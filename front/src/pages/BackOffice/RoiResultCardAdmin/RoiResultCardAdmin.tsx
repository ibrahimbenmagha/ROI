import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Layout, Typography, Spin, Empty, message } from "antd";
import { useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import axiosInstance from "../../../axiosConfig";
import { deleteCookie } from "../../../axiosConfig";

// import TheHeader from "../Header/Header";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface ActivityItemData {
  itemName: string;
  value: string | number;
}
type respType = { key: string; value: number };

const DisplayCalculatedDataAdmin = () => {
  const [activityData, setActivityData] = useState<respType[]>([]);
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
      const response = await axiosInstance.get("calculateDynamicROI");
      if (response.status === 200) {
        var list = Object.entries(response.data).map(([key, value]) => ({
          key,
          value: value as Number,
        })) as Array<respType>;
        setActivityData(list);
      } else {
        setError("Erreur lors de la récupération des données");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setError(
        "Impossible de récupérer les données. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const convertToCSV = (data: ActivityItemData[]) => {
      const header = "L'item de l'activité\n";
      const rows = data
        .map((item) => `"${item.key}","${item.value}"`)
        .join("\n");
      return header + rows;
    };
    const csvContent = convertToCSV(activityData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `activity-data.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    const convertToText = (data: ActivityItemData[]) => {
      const header = "L'item de l'activité\n\n"; // Titre du document PDF
      const rows = data.map((item) => `${item.key}: ${item.value}`).join("\n");
      return header + rows;
    };

    const pdfContent = convertToText(activityData);
    const doc = new jsPDF();
    doc.text(pdfContent, 10, 10);
    doc.save("activity-data.pdf");
  };

  const deleteActivityValues = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer les données ?"
    );
    if (confirmDelete) {
      try {
        await axiosInstance.delete("deleteActivityValues");
        message.success("Les données ont été supprimées avec succès");
        navigate("/Home");
      } catch (error) {
        console.error("Erreur lors de la suppression des données:", error);
        alert("Erreur lors de la suppression des données");
      }
    } else {
      // Si l'utilisateur annule, rien ne se passe
      alert("La suppression des données a été annulée");
    }
  };

  return (
    <Layout className="min-h-screen">
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle>Résultats du calcul ROI</CardTitle>
              <CardDescription>
                Visualisation des données calculées
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
              ) : activityData.length === 0 ? (
                <Empty
                  description="Aucune donnée disponible"
                  className="py-6"
                />
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {activityData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-md p-4 rounded-md flex flex-col items-start"
                    >
                      <Text className="font-semibold text-sm">{item.key}</Text>
                      <Text className="text-xl font-medium">
                        {typeof item.value === "number" && !isNaN(item.value)
                          ? item.key.toLowerCase().includes("roi")
                            ? `${(Number(item.value) * 100).toFixed(2)}%`
                            : item.key.toLowerCase().includes("coût") ||
                              item.key.toLowerCase().includes("cout") ||
                              item.key.toLowerCase().includes("vente") ||
                              item.key.toLowerCase().includes("revenu")
                            ? `${Number(item.value).toFixed(2)} MAD`
                            : Number(item.value).toFixed(
                                item.value % 1 === 0 ? 0 : 2
                              )
                          : item.value.toString()}
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
              <Button
                variant="outline"
                // onClick={() => navigate("../")}
                className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeftOutlined className="mr-2" />
                Retour à l'accueil
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  // onClick={() => navigate("BackOffice/DislayLabos")}
                  className="flex items-center gap-2"
                >
                  <NavLink to={"../"}>
                    <ArrowLeftOutlined className="mr-2" />
                    Retour
                  </NavLink>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={deleteActivityValues}
                >
                  <DeleteOutlined className="mr-2" />
                  Mettre A 0
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={loading || activityData.length === 0}
                  className="flex items-center gap-2"
                >
                  <DownloadOutlined className="mr-2" />
                  Exporter CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPdf}
                  disabled={loading || activityData.length === 0}
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

export default DisplayCalculatedDataAdmin;
