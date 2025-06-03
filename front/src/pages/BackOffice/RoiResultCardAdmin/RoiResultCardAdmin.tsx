

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
} from "@ant-design/icons";
import axiosInstance from "../../../axiosConfig";

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
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
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
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      message.error("Erreur lors de l'export du fichier CSV.");
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

  const handleExportPdf = () => {
    if (!activityData) return;

    const convertToText = (data: ActivityData) => {
      let text = `Activité: ${data.activityByLabo.activity}\n`;
      text += `Laboratoire: ${data.activityByLabo.labo}\n`;
      text += `Année: ${data.activityByLabo.year}\n\n`;
      text += "Items de l'activité:\n";
      data.items.forEach((item) => {
        text += `${item.name}: ${item.value !== null ? item.value.toFixed(2) : "N/A"}${
          item.type === "percentage" ? "%" : ""
        }\n`;
      });
      text += "\nRésultats calculés:\n";
      Object.entries(data.calculated_results).forEach(([key, value]) => {
        let formattedValue = value;
        if (typeof value === "number" && !isNaN(value)) {
          formattedValue =
            key.toLowerCase().includes("roi")
              ? `${(value * 100).toFixed(2)}%`
              : key.toLowerCase().includes("cost") || key.toLowerCase().includes("sales")
              ? `${value.toFixed(2)} MAD`
              : value.toFixed(value % 1 === 0 ? 0 : 2);
        }
        text += `${key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}: ${formattedValue}\n`;
      });
      return text;
    };

    const pdfContent = convertToText(activityData);
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(pdfContent, 10, 10);
    doc.save(`activity_${activityData.activityByLabo.id}_data.pdf`);
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content className="p-6 sm:p-8">
        <div className="w-[100%] mx-auto">
          <Card className="shadow-xl rounded-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardTitle className="text-2xl font-bold">
                Résultats du calcul ROI{" "}
                {activityData ? `- ${activityData.activityByLabo.activity}` : ""}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {activityData
                  ? `Laboratoire: ${activityData.activityByLabo.labo}, Année: ${activityData.activityByLabo.year}`
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
                          <Text className="text-lg text-gray-900 bg-gray-50 border border-gray-300 rounded px-2 py-1">
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
                          className="bg-white shadow-sm p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center"
                        >
                          <Text className="text-sm font-bold text-gray-700 mb-2">
                            {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Text>
                          <Text
                            className={`text-lg bg-gray-50 border border-gray-300 rounded px-2 py-1 ${
                              key.toLowerCase().includes("roi") && typeof value === "number" && !isNaN(value)
                                ? value >= 1
                                  ? "text-green-500"
                                  : "text-red-500"
                                : "text-gray-900"
                            }`}
                          >
                            {typeof value === "number" && !isNaN(value)
                              ? key.toLowerCase().includes("roi")
                                ? `${(value * 100).toFixed(0)}%`
                                : key.toLowerCase().includes("cost") || key.toLowerCase().includes("sales")
                                ? `${value.toFixed(2)} MAD`
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
                  className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <ArrowLeftOutlined />
                  Retour
                </Button>
  
                <Button
                  variant="outline"
                  onClick={handleExportExcel}
                  disabled={loading || !activityData}
                  className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <DownloadOutlined />
                  Exporter Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPdf}
                  disabled={loading || !activityData}
                  className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <DownloadOutlined />
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