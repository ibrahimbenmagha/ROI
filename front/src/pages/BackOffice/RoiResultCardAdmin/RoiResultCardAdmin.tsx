import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Layout, Typography, Spin, Empty, message } from "antd";
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
  PrinterOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axiosInstance, { deleteCookie } from "../../../axiosConfig";

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
      const response = await axiosInstance.get("getActivityByLaboData", {
        withCredentials: true, // Ensure cookies are sent
      });
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

  const handleExportCsv = () => {
    if (!activityData) return;

    const convertToCSV = (data: ActivityData) => {
      const header = "Section,Clé,Valeur\n";
      const activityByLaboRows = Object.entries(data.activityByLabo)
        .map(([key, value]) => `"activityByLabo","${key}","${value}"`)
        .join("\n");
      const itemsRows = data.items
        .map(
          (item) =>
            `"items","${item.name}","${item.value}${
              item.type === "percentage" ? "%" : ""
            }"`
        )
        .join("\n");
      const calculatedRows = Object.entries(data.calculated_results)
        .map(([key, value]) => {
          let formattedValue = value;
          if (typeof value === "number") {
            formattedValue =
              key.toLowerCase().includes("roi") && !isNaN(value)
                ? `${(value * 100).toFixed(2)}%`
                : key.toLowerCase().includes("cost") ||
                  key.toLowerCase().includes("sales")
                ? `${value.toFixed(2)} MAD`
                : value.toFixed(value % 1 === 0 ? 0 : 2);
          }
          return `"calculated_results","${key}","${formattedValue}"`;
        })
        .join("\n");

      return header + activityByLaboRows + "\n" + itemsRows + "\n" + calculatedRows;
    };

    const csvContent = convertToCSV(activityData);
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `activity_${activityData.activityByLabo.id}_data.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    if (!activityData) return;

    const convertToText = (data: ActivityData) => {
      let text = `Activité: ${data.activityByLabo.activity}\n`;
      text += `Laboratoire: ${data.activityByLabo.labo}\n`;
      text += `Année: ${data.activityByLabo.year}\n\n`;
      text += "Items de l'activité:\n";
      data.items.forEach((item) => {
        text += `${item.name}: ${item.value}${
          item.type === "percentage" ? "%" : ""
        }\n`;
      });
      text += "\nRésultats calculés:\n";
      Object.entries(data.calculated_results).forEach(([key, value]) => {
        let formattedValue = value;
        if (typeof value === "number") {
          formattedValue =
            key.toLowerCase().includes("roi") && !isNaN(value)
              ? `${(value * 100).toFixed(2)}%`
              : key.toLowerCase().includes("cost") ||
                key.toLowerCase().includes("sales")
              ? `${value.toFixed(2)} MAD`
              : value.toFixed(value % 1 === 0 ? 0 : 2);
        }
        text += `${key.replace(/_/g, " ")}: ${formattedValue}\n`;
      });
      return text;
    };

    const pdfContent = convertToText(activityData);
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(pdfContent, 10, 10);
    doc.save(`activity_${activityData.activityByLabo.id}_data.pdf`);
  };

  const deleteActivityValues = async (e: React.MouseEvent) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer les données ?"
    );
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/api/deleteActivityValues/${activityData?.activityByLabo.id}`);
        message.success("Les données ont été supprimées avec succès");
        deleteCookie("activityNumber");
        navigate("/Home");
      } catch (error) {
        console.error("Erreur lors de la suppression des données:", error);
        message.error("Erreur lors de la suppression des données");
      }
    }
  };

  return (
    <Layout className="min-h-screen">
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle>
                Résultats du calcul ROI - {activityData?.activityByLabo.activity}
              </CardTitle>
              <CardDescription>
                {activityData
                  ? `Laboratoire: ${activityData.activityByLabo.labo}, Année: ${activityData.activityByLabo.year}`
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
                            className="bg-white shadow-md p-4 rounded-md flex flex-col items-start"
                          >
                            <Text className="font-semibold text-sm">
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Text>
                            <Text className="text-xl font-medium">
                              {typeof value === "number" && !isNaN(value)
                                ? key.toLowerCase().includes("roi")
                                  ? `${(value * 100).toFixed(2)}%`
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
                  onClick={handleExportCsv}
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
    </Layout>
  );
};

export default DisplayCalculatedData;