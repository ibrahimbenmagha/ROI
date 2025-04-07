import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
//<DeleteOutlined />
import { Layout, Typography, Spin, Empty } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import axiosInstance from "../../axiosConfig";
import { deleteCookie } from "../../axiosConfig";

import TheHeader from "../Header/Header";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface ActivityItemData {
  itemName: string;
  value: string | number;
}
type respType = { key: string; value: number };

const DisplayCalculatedData = () => {
  const [activityData, setActivityData] = useState<respType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      // Réinitialiser l'indicateur après le rechargement
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
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Function to convert data to CSV
    const convertToCSV = (data: ActivityItemData[]) => {
      const header = "L itmem de l activite\n";
      const rows = data
        .map((item) => `"${item.key}","${item.value}"`)
        .join("\n");
      return header + rows;
    };

    // Create CSV content
    const csvContent = convertToCSV(activityData);

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger the download
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

    // Fonction pour formater les données à exporter dans le PDF
  const convertToText = (data: ActivityItemData[]) => {
    const header = "L'item de l'activité\n\n"; // Titre du document PDF
    const rows = data
      .map((item) => `${item.key}: ${item.value}`)
      .join("\n");
    return header + rows;
  };

  // Récupérer les données sous forme de texte
  const pdfContent = convertToText(activityData);

  // Créer un document PDF avec jsPDF
  const doc = new jsPDF();

  // Ajouter le contenu au PDF
  doc.text(pdfContent, 10, 10); // Positionnement du texte dans le PDF

  // Enregistrer le fichier PDF avec un nom spécifique
  doc.save('activity-data.pdf');
};

  return (
    <Layout className="min-h-screen">
      <TheHeader />

      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Card className="mb-6">
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
                <Table>
                  <TableCaption>Données de résultats calculés</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Paramètre</TableHead>
                      <TableHead>Valeur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.key}
                        </TableCell>
                        <TableCell>
                          {typeof item.value === "number" && !isNaN(item.value)
                            ? // Format numeric values
                              item.key.toLowerCase().includes("roi")
                              ? `${(Number(item.value) * 100).toFixed(2)}%`
                              : item.key.toLowerCase().includes("coût") ||
                                item.key.toLowerCase().includes("cout") ||
                                item.key.toLowerCase().includes("vente") ||
                                item.key.toLowerCase().includes("revenu")
                              ? `${Number(item.value).toFixed(2)} €`
                              : Number(item.value).toFixed(
                                  item.value % 1 === 0 ? 0 : 2
                                )
                            : item.value.toString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>
                <ArrowLeftOutlined className="mr-2" />
                Retour à l'accueil
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/DisplayCalculatedActivity")}
                >
                  <ArrowLeftOutlined className="mr-2" />
                  Retour
                </Button>
                <Button
                  variant="outline"
                  // onClick={() => }
                >
                  <DeleteOutlined className="mr-2" />
                  Mettre A 0 
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={loading || activityData.length === 0}
                >
                  <DownloadOutlined className="mr-2" />
                  Exporter CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPdf}
                  disabled={loading || activityData.length === 0}
                >
                  <DownloadOutlined className="mr-2" />
                  Exporter PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  disabled={loading || activityData.length === 0}
                >
                  <PrinterOutlined className="mr-2" />
                  Imprimer
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
