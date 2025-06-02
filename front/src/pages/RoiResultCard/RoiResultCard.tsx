import React, { useState, useEffect } from "react";
import { Layout, Typography, Spin, Empty, message, Modal, Form, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axiosInstance, { deleteCookie } from "../../axiosConfig";
import TheHeader from "../Header/Header";

const { Content } = Layout;
const { Title, Text } = Typography;

interface ActivityItem {
  id: number;
  name: string;
  symbole: string | null;
  type: "number" | "percentage";
  value: number | null;
}

interface CalculatedResult {
  [key: string]: number | string;
}

interface ActivityByLabo {
  id: number;
  labo: string;
  activity: string;
  year: string;
  is_custom: boolean;
}

interface ActivityData {
  activityByLabo: ActivityByLabo;
  items: ActivityItem[];
  calculated_results: CalculatedResult;
}

const DisplayCalculatedData = () => {
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Helper function to determine ROI border color
  const getRoiBorderClass = (roi: number): string => {
    if (roi >= 1) {
      return "border-l-4 border-green-500";
    }
    if (roi < 0) {
      return "border-l-4 border-red-600";
    }
    const intensity = Math.min(Math.max(roi, 0), 0.75);
    if (intensity >= 0.5) {
      return "border-l-4 border-red-300"; // ROI 0.5 to 0.75
    } else if (intensity >= 0.25) {
      return "border-l-4 border-red-400"; // ROI 0.25 to 0.5
    } else {
      return "border-l-4 border-red-600"; // ROI 0 to 0.25
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("getActivityByLaboData");
      if (response.status === 200) {
        setActivityData(response.data);
      } else {
        setError("Erreur lors de la récupération des données");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setError(
        error.response?.data?.error ||
          "Impossible de récupérer les données. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get("exportActivityExcel", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "activity_export.xlsx";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) fileName = match[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      message.error("Erreur lors de l'export du fichier Excel.");
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await axiosInstance.get("exportActivityPdf", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "activity_export.pdf";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) fileName = match[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      message.error("Erreur lors de l'export du fichier PDF.");
    }
  };

  const deleteActivityValues = async (e: React.MouseEvent) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer les données ?"
    );
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        const response = await axiosInstance.delete("deleteActivityValues", {
          withCredentials: true,
        });
        message.success(response.data.message || "Données supprimées avec succès");
        deleteCookie("activityNumber");
        navigate("/Home");
      } catch (error) {
        console.error("Erreur lors de la suppression des données:", error);
        message.error(
          error.response?.data?.error ||
            "Erreur lors de la suppression des données"
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const showModifyModal = () => {
    if (activityData) {
      const initialValues = {
        year: parseInt(activityData.activityByLabo.year),
        items: activityData.items
          .filter((item) => item.name.toLowerCase() !== "roi")
          .map((item) => ({
            id: item.id,
            value: item.type === "percentage" && item.value !== null ? item.value * 100 : item.value,
          })),
      };
      form.setFieldsValue(initialValues);
      setIsModalVisible(true);
    }
  };

  const handleModifySubmit = async (values: any) => {
    try {
      setIsModifying(true);
      const payload = {
        year: values.year,
        items: values.items.map(
          (item: { id: number; value: number | null }) => {
            const activityItem = activityData?.items.find((i) => i.id === item.id);
            return {
              activityItemId: item.id,
              value: activityItem?.type === "percentage" && item.value !== null
                ? item.value / 100
                : item.value,
            };
          }
        ),
      };

      const response = await axiosInstance.patch(
        "updateActivityByLaboData",
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        message.success("Données modifiées avec succès");
        setIsModalVisible(false);
        await fetchActivityData();
      } else {
        message.error("Erreur lors de la modification des données");
      }
    } catch (error) {
      console.error("Erreur lors de la modification des données:", error);
      message.error(
        error.response?.data?.error ||
          "Erreur lors de la modification des données"
      );
    } finally {
      setIsModifying(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <TheHeader />
      <Content className="p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl rounded-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardTitle className="text-2xl font-bold">
                Résultats du calcul ROI{" "}
                {activityData ? `- ${activityData.activityByLabo.activity}` : ""}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {activityData
                  ? `Année: ${activityData.activityByLabo.year} | Type: ${
                      activityData.activityByLabo.is_custom ? "Personnalisée" : "Standard"
                    }`
                  : "Visualisation des données calculées"}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Spin size="large" tip="Chargement des données..." />
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              ) : !activityData ? (
                <Empty description="Aucune donnée disponible" className="py-6" />
              ) : (
                <>
                  <div className="mb-8">
                    <Title level={4} className="text-lg font-semibold mb-4">
                      Items de l'activité
                    </Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {activityData.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white shadow-sm p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center"
                        >
                          <Text className="text-sm font-bold text-gray-700 mb-2">
                            {item.name}
                          </Text>
                          <Text className="text-lg text-gray-900">
                            {item.value !== null
                              ? item.type === "percentage"
                                ? `${(item.value * 100).toFixed(0)}%`
                                : item.value.toFixed(item.value % 1 === 0 ? 0 : 2)
                              : "N/A"}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Title level={4} className="text-lg font-semibold mb-4">
                      Résultats calculés
                    </Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(activityData.calculated_results).map(([key, value]) => (
                        <div
                          key={key}
                          className={`bg-white shadow-sm p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center ${
                            key.toLowerCase().includes("roi") && typeof value === "number" && !isNaN(value)
                              ? getRoiBorderClass(value)
                              : ""
                          }`}
                        >
                          <Text className="text-sm font-bold text-gray-700 mb-2">
                            {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Text>
                          <Text className="text-lg text-gray-900">
                            {typeof value === "number" && !isNaN(value)
                              ? key.toLowerCase().includes("roi")
                                ? `${(value * 100).toFixed(2)}%`
                                : key.toLowerCase().includes("cost") || key.toLowerCase().includes("sales")
                                ? `${value.toFixed(2)} MAD`
                                : key.toLowerCase().includes("percentage")
                                ? `${(value * 100).toFixed(0)}%`
                                : value.toFixed(value % 1 === 0 ? 0 : 2)
                              : value.toString()}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center bg-gray-50 p-6">
              <Button
                variant="outline"
                onClick={() => navigate("/Home")}
                className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <ArrowLeftOutlined />
                Retour à l'accueil
              </Button>

              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => navigate("/DisplayCalculatedActivity")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftOutlined />
                  Retour
                </Button>
                <Button
                  variant="outline"
                  onClick={deleteActivityValues}
                  disabled={loading || !activityData || isDeleting}
                  className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  <DeleteOutlined />
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </Button>
                <Button
                  variant="outline"
                  onClick={showModifyModal}
                  disabled={loading || !activityData || isModifying}
                  className="flex items-center gap-2 text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white"
                >
                  <EditOutlined />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportExcel}
                  disabled={loading || !activityData}
                  className="flex items-center gap-2"
                >
                  <DownloadOutlined />
                  Exporter Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPdf}
                  disabled={loading || !activityData}
                  className="flex items-center gap-2"
                >
                  <DownloadOutlined />
                  Exporter PDF
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </Content>

      <Modal
        title="Modifier les données de l'activité"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModifySubmit}
          initialValues={{ items: [], year: "" }}
        >
          <Form.Item
            name="year"
            label="Année"
            rules={[{ required: true, message: "Veuillez entrer l'année" }]}
          >
            <InputNumber
              min={2000}
              max={2100}
              className="w-full"
              placeholder="Entrez l'année"
            />
          </Form.Item>

          <Title level={5} className="mb-4">
            Items de l'activité
          </Title>
          <Form.List name="items">
            {(fields) => (
              <>
                {fields.map((field) => {
                  const item = activityData?.items.find(
                    (i) => i.id === form.getFieldValue(["items", field.name, "id"])
                  );
                  return (
                    <Form.Item
                      key={field.key}
                      label={item?.name}
                      name={[field.name, "value"]}
                      rules={[
                        {
                          required: true,
                          message: `Veuillez entrer la valeur pour ${item?.name}`,
                        },
                        {
                          type: "number",
                          min: 0,
                          message: "La valeur doit être positive",
                        },
                      ]}
                    >
                      <InputNumber
                        className="w-full"
                        addonAfter={item?.type === "percentage" ? "%" : undefined}
                        precision={item?.type === "percentage" ? 0 : 2}
                        placeholder={`Entrez la valeur pour ${item?.name}`}
                      />
                    </Form.Item>
                  );
                })}
              </>
            )}
          </Form.List>

          <Form.Item>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleModalCancel}>
                Annuler
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isModifying}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isModifying ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default DisplayCalculatedData;
