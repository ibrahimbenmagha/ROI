import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import {
  Layout,
  Typography,
  Spin,
  Empty,
  message,
  Modal,
  Form,
  InputNumber,
} from "antd";
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
  is_custom: boolean; // Added to indicate custom activity
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
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Avoid double reload
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

  const handleExportCsv = async () => {
    try {
      const response = await axiosInstance.get("exportActivityCsv", {
        responseType: "blob", // important pour les fichiers binaires
      });

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Nom du fichier selon les infos dans le header ou fallback
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "activity_export.csv";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) fileName = match[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      alert("Erreur lors de l'export du fichier CSV.");
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get("exportActivityExcel", {
        responseType: "blob", // important pour fichiers binaires comme Excel
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
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      alert("Erreur lors de l'export du fichier Excel.");
    }
  };

  const handleExportPdf = () => {
    if (!activityData) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", ""); // Police avec bon support UTF-8
    doc.setFontSize(12);

    // En-tête
    doc.text(`Activité: ${activityData.activityByLabo.activity}`, 10, 10);
    doc.text(`Laboratoire: ${activityData.activityByLabo.labo}`, 10, 18);
    doc.text(`Année: ${activityData.activityByLabo.year}`, 10, 26);
    doc.text(
      `Type: ${
        activityData.activityByLabo.is_custom ? "Personnalisée" : "Standard"
      }`,
      10,
      34
    );

    // Ligne de séparation
    doc.setDrawColor(150);
    doc.line(10, 40, 200, 40);

    // Items de l'activité
    doc.setFontSize(14);
    doc.text("Items de l'activité :", 10, 48);
    doc.setFontSize(12);

    let y = 56;
    activityData.items.forEach((item) => {
      const value =
        item.value !== null
          ? `${item.value}${item.type === "percentage" ? "%" : ""}`
          : "N/A";
      doc.text(`${item.name}: ${value}`, 10, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    // Résultats calculés
    y += 6;
    doc.setFontSize(14);
    doc.text("Résultats calculés :", 10, y);
    doc.setFontSize(12);
    y += 8;

    Object.entries(activityData.calculated_results).forEach(([key, value]) => {
      let formattedValue = value;
      if (typeof value === "number" && !isNaN(value)) {
        formattedValue = key.toLowerCase().includes("roi")
          ? `${value.toFixed(2)}%`
          : key.toLowerCase().includes("cost") ||
            key.toLowerCase().includes("sales")
          ? `${value.toFixed(2)} MAD`
          : value.toFixed(value % 1 === 0 ? 0 : 2);
      }
      const label = key.replace(/_/g, " ");
      doc.text(`${label}: ${formattedValue}`, 10, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    // Enregistrement
    doc.save(`activity_${activityData.activityByLabo.id}_data.pdf`);
  };

  const deleteActivityValues = async (e: React.MouseEvent) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer les données ?"
    );
    if (confirmDelete) {
      try {
        await axiosInstance.delete(
          'deleteActivityValues',
          {
            withCredentials: true,
          }
        );
        message.success("Les données ont été supprimées avec succès");
        deleteCookie("activityNumber");
        navigate("/Home");
      } catch (error) {
        console.error("Erreur lors de la suppression des données:", error);
        message.error(
          error.response?.data?.error ||
            "Erreur lors de la suppression des données"
        );
      }
    }
  };

  const showModifyModal = () => {
    if (activityData) {
      // Pre-fill form with current values
      const initialValues = {
        year: activityData.activityByLabo.year,
        items: activityData.items
          .filter((item) =>
            activityData.activityByLabo.is_custom ? item.name === "Roi" : true
          )
          .map((item) => ({
            id: item.id,
            value: item.value,
          })),
      };
      form.setFieldsValue(initialValues);
      setIsModalVisible(true);
    }
  };

  const handleModifySubmit = async (values: any) => {
    try {
      const payload = {
        year: values.year,
        items: values.items.map(
          (item: { id: number; value: number | null }) => ({
            activityItemId: item.id,
            value: item.value,
          })
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
        await fetchActivityData(); // Refresh data
      } else {
        message.error("Erreur lors de la modification des données");
      }
    } catch (error) {
      console.error("Erreur lors de la modification des données:", error);
      message.error(
        error.response?.data?.error ||
          "Erreur lors de la modification des données"
      );
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout className="min-h-screen">
      <TheHeader />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle>
                Résultats du calcul ROI{" "}
                {activityData
                  ? `- ${activityData.activityByLabo.activity}`
                  : ""}
              </CardTitle>
              <CardDescription>
                {activityData
                  ? `Année: ${activityData.activityByLabo.year} | Type: ${
                      activityData.activityByLabo.is_custom
                        ? "Personnalisée"
                        : "Standard"
                    }`
                  : "Visualisation des données calculées"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Spin size="large" tip="Chargement des données..." />
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              ) : !activityData ? (
                <Empty
                  description="Aucune donnée disponible"
                  className="py-6"
                />
              ) : (
                <>
                  <div className="mb-6">
                    <Title level={4}>Items de l'activité</Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {activityData.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white shadow-md p-4 rounded-md flex flex-col items-start"
                        >
                          <Text className="font-semibold text-sm">
                            {item.name}
                          </Text>
                          <Text className="text-xl font-medium">
                            {item.value !== null
                              ? `${item.value}${
                                  item.type === "percentage" ? "%" : ""
                                }`
                              : "N/A"}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Title level={4}>Résultats calculés</Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(activityData.calculated_results).map(
                        ([key, value], index) => (
                          <div
                            key={index}
                            className={`bg-white shadow-md p-4 rounded-md flex flex-col items-start ${
                              key.toLowerCase().includes("roi")
                                ? "border-l-4 border-green-500"
                                : ""
                            }`}
                          >
                            <Text className="font-semibold text-sm">
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Text>
                            <Text className="text-xl font-medium">
                              {typeof value === "number" && !isNaN(value)
                                ? key.toLowerCase().includes("roi")
                                  ? `${value.toFixed(2)}%`
                                  : key.toLowerCase().includes("cost") ||
                                    key.toLowerCase().includes("sales")
                                  ? `${value.toFixed(2)} MAD`
                                  : value.toFixed(value % 1 === 0 ? 0 : 2)
                                : value.toString()}
                            </Text>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => navigate("/Home")}
                className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeftOutlined className="mr-2" />
                Retour à l'accueil
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/DisplayCalculatedActivity")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftOutlined className="mr-2" />
                  Retour
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={deleteActivityValues}
                  disabled={loading || !activityData}
                >
                  <DeleteOutlined className="mr-2" />
                  Supprimer
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={showModifyModal}
                  disabled={loading || !activityData}
                >
                  <EditOutlined className="mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  // onClick={handleExportCsv}
                  onClick={handleExportExcel}
                  disabled={loading || !activityData}
                  className="flex items-center gap-2"
                >
                  <DownloadOutlined className="mr-2" />
                  Exporter CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPdf}
                  disabled={loading || !activityData}
                  className="flex items-center gap-2"
                >
                  <DownloadOutlined className="mr-2" />
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
            <InputNumber min={2000} max={2100} style={{ width: "100%" }} />
          </Form.Item>

          <Title level={5}>Items de l'activité</Title>
          <Form.List name="items">
            {(fields) => (
              <>
                {fields.map((field, index) => {
                  const item = activityData?.items.find(
                    (i) =>
                      i.id === form.getFieldValue(["items", field.name, "id"])
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
                        style={{ width: "100%" }}
                        addonAfter={
                          item?.type === "percentage" ? "%" : undefined
                        }
                        precision={item?.type === "percentage" ? 0 : 2}
                      />
                    </Form.Item>
                  );
                })}
              </>
            )}
          </Form.List>

          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button variant="outline" onClick={handleModalCancel}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default DisplayCalculatedData;
