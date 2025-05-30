import React, { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  message,
  DatePicker,
  Form,
  Input as AntInput,
  Modal,
  Statistic,
  Alert,
} from "antd";
import {
  CalculatorOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../axiosConfig";
import TheHeader from "../Header/Header";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const CustomActivityPage: React.FC = () => {
  // Form state
  const [activityName, setActivityName] = useState<string>("");
  const [revenueTotale, setRevenueTotale] = useState<string>("");
  const [coutTotale, setCoutTotale] = useState<string>("");
  const [year, setYear] = useState<string | null>(null);
  const [roiResult, setRoiResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [calculated, setCalculated] = useState<boolean>(false);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Check if all fields are filled
  const allFieldsFilled = (): boolean => {
    return (
      activityName.trim() !== "" &&
      revenueTotale.trim() !== "" &&
      coutTotale.trim() !== "" &&
      year !== null
    );
  };

  const handleReset = (): void => {
    setActivityName("");
    setRevenueTotale("");
    setCoutTotale("");
    setYear(null);
    setRoiResult(null);
    setCalculated(false);
    form.resetFields();
  };

  const calculateRoi = (): void => {
    const revenue = parseFloat(revenueTotale);
    const cout = parseFloat(coutTotale);

    if (isNaN(revenue) || revenue <= 0) {
      message.error("Revenue Totale doit être un nombre positif.");
      return;
    }
    if (isNaN(cout) || cout <= 0) {
      message.error("Cout Totale doit être un nombre positif.");
      return;
    }

    const roi = revenue / cout; // ROI = Revenue Totale / Cout Totale
    setRoiResult(roi);
    setCalculated(true);
    message.success("ROI calculé avec succès.");
  };

  const showConfirm = () => {
    confirm({
      title: "Êtes-vous sûr de vouloir soumettre cette activité personnalisée ?",
      icon: <ExclamationCircleOutlined />,
      content: "Cette action va créer une nouvelle activité personnalisée dans la base de données.",
      onOk() {
        handleSubmit();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleSubmit = async (): Promise<void> => {
    if (!calculated || roiResult === null) {
      message.error("Veuillez calculer le ROI avant de soumettre.");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        activityName: activityName,
        year: year,
        revenue_totale: parseFloat(revenueTotale),
        cout_totale: parseFloat(coutTotale),
        roi: roiResult,
      };

      const response = await axiosInstance.post("insertCustomActivity", formData);

      if (response.status === 201 || response.status === 200) {
        message.success("L'activité personnalisée a été créée avec succès.");
        navigate("/DisplayActivity");
      } else {
        message.error("Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      message.error(
        "Une erreur est survenue lors de la communication avec le serveur."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <TheHeader />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {roiResult !== null && (
            <div className="mt-8">
              <Divider>Résultats</Divider>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <Statistic
                    title="ROI"
                    value={roiResult * 100}
                    precision={2}
                    suffix="%"
                    valueStyle={{
                      color: roiResult >= 1 ? "#3f8600" : "#cf1322",
                    }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Revenue Totale"
                    value={parseFloat(revenueTotale)}
                    precision={2}
                    suffix=" MAD"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Cout Totale"
                    value={parseFloat(coutTotale)}
                    precision={2}
                    suffix=" MAD"
                  />
                </Card>
              </div>
              {roiResult < 1 && (
                <Alert
                  style={{ marginTop: "16px" }}
                  message="ROI Négatif ou Faible"
                  description="L'activité génère un retour insuffisant. Considérez d'optimiser les coûts ou d'augmenter les revenus."
                  type="warning"
                  showIcon
                />
              )}
            </div>
          )}

          <Form form={form} layout="vertical" onFinish={showConfirm}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Créer une activité personnalisée
              </Title>
              <Divider />

              <div className="grid grid-cols-1 gap-6">
                <Form.Item
                  name="activityName"
                  label="Nom de l'activité"
                  rules={[{ required: true, message: "Veuillez entrer le nom de l'activité" }]}
                >
                  <AntInput
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="Entrez le nom de l'activité"
                  />
                </Form.Item>

                <Form.Item
                  name="revenueTotale"
                  label="Revenue Totale"
                  rules={[
                    { required: true, message: "Veuillez entrer le Revenue Totale" },
                    { pattern: /^\d+(\.\d+)?$/, message: "Veuillez entrer un nombre positif" },
                  ]}
                >
                  <AntInput
                    value={revenueTotale}
                    onChange={(e) => setRevenueTotale(e.target.value)}
                    placeholder="Entrez le Revenue Totale (MAD)"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </Form.Item>

                <Form.Item
                  name="coutTotale"
                  label="Cout Totale"
                  rules={[
                    { required: true, message: "Veuillez entrer le Cout Totale" },
                    { pattern: /^\d+(\.\d+)?$/, message: "Veuillez entrer un nombre positif" },
                  ]}
                >
                  <AntInput
                    value={coutTotale}
                    onChange={(e) => setCoutTotale(e.target.value)}
                    placeholder="Entrez le Cout Totale (MAD)"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </Form.Item>

                <Form.Item
                  name="year"
                  label="Année"
                  rules={[{ required: true, message: "Veuillez sélectionner une année" }]}
                >
                  <DatePicker
                    picker="year"
                    onChange={(date, dateString) => setYear(dateString)}
                    value={year ? dayjs(year, "YYYY") : null}
                    style={{ width: "100%" }}
                    placeholder="Sélectionnez l'année"
                  />
                </Form.Item>
              </div>

              <Divider />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  type="button"
                  onClick={calculateRoi}
                  disabled={loading || !allFieldsFilled()}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CalculatorOutlined /> Calculer ROI
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: "#1890ff" }}
                  disabled={!allFieldsFilled() || loading || !calculated}
                >
                  <CheckCircleOutlined /> Créer l'activité
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} type="button">
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate("/DisplayActivity")}
                  >
                    Retour
                  </Button>
                </div>
              </div>
            </Card>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default CustomActivityPage;
