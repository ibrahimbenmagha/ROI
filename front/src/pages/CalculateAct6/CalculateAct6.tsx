import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  Statistic,
  message,
  Alert,
  Spin,
  DatePicker,
} from "antd";
import {
  CalculatorOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance, { deleteCookie } from "../../axiosConfig";
import TheHeader from "../Header/Header";
import dayjs from "dayjs";
const { Content } = Layout;
const { Title, Text } = Typography;
const initialFormState = {
  A: 0,
  B: 0,
  E: 0,
  G: 0,
  I: 0,
  K: 0,
  M1: 0,
  M2: 0,
};
const validateNumeric = (
  value: number,
  min: number,
  max: number | null = null
) => !isNaN(value) && value >= min && (max === null || value <= max);
const CalculateAct6 = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [year, setYear] = useState<string | null>(null);
  const [activityNumber, setActivityNumber] = useState<number | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/CalculateAct(\d+)/);
    const foundActivityNumber = match ? parseInt(match[1]) : null;
    setActivityNumber(foundActivityNumber);
    document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

    axiosInstance
      .get("getActivityItemsByActivityId/6")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error("Erreur chargement items :", err);
        message.error("Erreur chargement données activité.");
      });
  }, [location.pathname]);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const isFormValid = () => {
    return (
      Object.entries(formData).every(([key, value]) =>
        validateNumeric(value, 0, key === "E" || key === "G" ? 100 : null)
      ) && !!year
    );
  };

  const generateInterpretation = async (result: any) => {
    try {
      // Combine result and input fields into a single payload
      const payload = {
        ...result, // roi, totalVisits, doctorsRemembering, etc.
        inputs: {
          numDoctors: formData.A,
          visitsPerDoctor: formData.B,
          percentMessageRecall: formData.E,
          percentPrescribing: formData.G,
          patientsPerDoctor: formData.I,
          valuePerPatient: formData.K,
          costPerRepresentative: formData.M1,
          numRepresentatives: formData.M2,
        },
      };
      const response = await axiosInstance.post("/generate-interpretation", payload);
      return response.data.interpretation;
    } catch (error) {
      console.error("Erreur lors de la génération de l'interprétation :", error);
      return null;
    }
  };

  const calculateRoi = async () => {
    const { A, B, E, G, I, K, M1, M2 } = formData;
    if (!isFormValid()) {
      message.error("Veuillez remplir correctement tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const C = A * B; // Total visites
      const F = A * (E / 100); // Médecins se rappelant
      const H = F * (G / 100); // Médecins prescrivant
      const J = H * I; // Patients incrémentaux
      const L = J * K; // Ventes incrémentales
      const M = M1 * M2; // Coût total
      const ROI = M > 0 ? (L / M) * 100 : 0; // ROI en %

      const result = {
        roi: ROI,
        totalVisits: C,
        doctorsRemembering: F,
        doctorsPrescribing: H,
        incrementalPatients: J,
        incrementalSales: L,
        totalCost: M,
      };

      setCalculationResult(result);
      setCalculated(true);

      const interpretationText = await generateInterpretation(result);
      if (interpretationText) {
        setInterpretation(interpretationText);
      } else {
        message.error("L'interprétation n'est pas disponible pour le moment.");
      }
    } catch (error) {
      console.error(error);
      message.error("Erreur pendant le calcul du ROI.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || !activityNumber) {
      message.error("Données nécessaires non disponibles.");
      return;
    }

    try {
      const payload = {
        ...formData,
        year,
        id_A: items[0]?.id,
        id_B: items[1]?.id,
        id_E: items[2]?.id,
        id_G: items[3]?.id,
        id_I: items[4]?.id,
        id_K: items[5]?.id,
        id_M1: items[6]?.id,
        id_M2: items[7]?.id,
        id_ROI: items[8]?.id,
      };

      const response = await axiosInstance.post("/insertIntoTable6", payload);
      if (response.status === 201) {
        message.success("Données enregistrées avec succès.");
        deleteCookie("activityNumber");
        navigate("/CreateActivity");
      } else {
        message.error("Erreur lors de l'enregistrement.");
      }
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Erreur serveur.");
    }
  };

  const fields = [
    { label: "Nombre de médecins ciblés (A)", key: "A" },
    { label: "Visites par médecin (B)", key: "B" },
    { label: "% Rappel du message (E)", key: "E", max: 100 },
    { label: "% Prescription (G)", key: "G", max: 100 },
    { label: "Patients par médecin (I)", key: "I" },
    { label: "Valeur patient (MAD) (K)", key: "K" },
    { label: "Coût par représentant (MAD) (M1)", key: "M1" },
    { label: "Nombre de représentants (M2)", key: "M2" },
  ];

  return (
    <Layout className="min-h-screen">
      <TheHeader />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {calculationResult && (
            <>
              <Divider>Résultats</Divider>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <Statistic
                    title="ROI"
                    value={calculationResult.roi}
                    precision={2}
                    suffix="%"
                    valueStyle={{
                      color: calculationResult.roi >= 100 ? "#3f8600" : "#cf1322",
                    }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Ventes Incrémentales"
                    value={calculationResult.incrementalSales}
                    precision={2}
                    suffix=" MAD"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Coût Total"
                    value={calculationResult.totalCost}
                    precision={2}
                    suffix=" MAD"
                  />
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Card>
                  <Statistic
                    title="Total Visites"
                    value={calculationResult.totalVisits}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins se Rappelant"
                    value={calculationResult.doctorsRemembering}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins Prescrivant"
                    value={calculationResult.doctorsPrescribing}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Patients Incrémentaux"
                    value={calculationResult.incrementalPatients}
                    precision={0}
                  />
                </Card>
              </div>

              {calculationResult.roi < 100 && (
                <Alert
                  style={{ marginTop: "16px" }}
                  message="ROI Négatif ou Faible"
                  description="Le programme génère un retour insuffisant. Consultez les conseils ci-dessous pour améliorer vos résultats."
                  type="warning"
                  showIcon
                />
              )}
              {calculationResult.roi >= 100 && (
                <Alert
                  style={{ marginTop: "16px" }}
                  message="ROI Positif"
                  description="Le programme génère un retour positif. Continuez à optimiser pour maximiser les résultats."
                  type="success"
                  showIcon
                />
              )}

              {interpretation && (
                <div className="mt-6">
                  <Divider>Interprétation et Conseils</Divider>
                  <Card>
                    <Text>{interpretation}</Text>
                  </Card>
                </div>
              )}
            </>
          )}

          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Visites Médicales - Calcul ROI
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map(({ label, key, max }) => (
                  <div key={key}>
                    <label>{label}</label>
                    <Input
                      type="number"
                      min="0"
                      max={max}
                      value={formData[key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  </div>
                ))}
                <div>
                  <label>Année</label>
                  <DatePicker
                    picker="year"
                    onChange={(date, dateString) => setYear(dateString)}
                    value={year ? dayjs(year, "YYYY") : null}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <Divider />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  type="button"
                  onClick={calculateRoi}
                  disabled={loading}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      <CalculatorOutlined className="mr-2" /> Calculer ROI
                    </>
                  )}
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !calculated || !isFormValid()}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CheckCircleOutlined className="mr-2" /> Enregistrer
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} type="button">
                    <ReloadOutlined className="mr-2" /> Réinitialiser
                  </Button>
                  <Link to="/CreateActivity">
                    <Button variant="secondary" type="button">
                      Retour
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </Content>
    </Layout>
  );
};
export default CalculateAct6;

