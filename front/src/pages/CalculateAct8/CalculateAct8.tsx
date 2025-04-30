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

const CalculateAct8 = () => {
  // États du formulaire
  const [A, setA] = useState(0); // Population totale
  const [B, setB] = useState(0); // Taux d'incidence
  const [D, setD] = useState(0); // % Patients satisfaits
  const [F, setF] = useState(0); // % Patients visés
  const [H, setH] = useState(0); // Visites uniques
  const [J, setJ] = useState(0); // % Visiteurs intéressés
  const [L, setL] = useState(0); // % Visiteurs ayant consulté
  const [N, setN] = useState(0); // % Patients avec prescription
  const [P, setP] = useState(0); // Valeur patient
  const [R, setR] = useState(0); // Coût campagne
  const [year, setYear] = useState(null);

  // États de l'application
  const [activityNumber, setActivityNumber] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
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
      .get("getActivityItemsByActivityId/8")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des items :", error);
        message.error("Impossible de charger les données de l'activité.");
      });
  }, [location.pathname]);

  const handleReset = () => {
    setA(0);
    setB(0);
    setD(0);
    setF(0);
    setH(0);
    setJ(0);
    setL(0);
    setN(0);
    setP(0);
    setR(0);
    setYear(null);
    setCalculationResult(null);
    setCalculated(false);
  };

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const isFormValid = () =>
    validateNumeric(A, 0) &&
    validateNumeric(B, 0, 100) &&
    validateNumeric(D, 0, 100) &&
    validateNumeric(F, 0, 100) &&
    validateNumeric(H, 0) &&
    validateNumeric(J, 0, 100) &&
    validateNumeric(L, 0, 100) &&
    validateNumeric(N, 0, 100) &&
    validateNumeric(P, 0) &&
    validateNumeric(R, 0) &&
    !!year;

  const calculateRoi = async () => {
    if (!validateNumeric(A, 0)) return message.error("Population totale invalide");
    if (!validateNumeric(B, 0, 100)) return message.error("Taux d'incidence invalide");
    if (!validateNumeric(D, 0, 100)) return message.error("% Patients satisfaits invalide");
    if (!validateNumeric(F, 0, 100)) return message.error("% Patients visés invalide");
    if (!validateNumeric(H, 0)) return message.error("Visites uniques invalides");
    if (!validateNumeric(J, 0, 100)) return message.error("% Visiteurs intéressés invalide");
    if (!validateNumeric(L, 0, 100)) return message.error("% Visiteurs consultant invalide");
    if (!validateNumeric(N, 0, 100)) return message.error("% Prescriptions invalide");
    if (!validateNumeric(P, 0)) return message.error("Valeur patient invalide");
    if (!validateNumeric(R, 0)) return message.error("Coût campagne invalide");

    setLoading(true);

    try {
      // Calculs intermédiaires
      const C = A * (B / 100); // Patients souffrant
      const E = C * (1 - (D / 100)); // Patients non traités/insatisfaits
      const G = E * (F / 100); // Patients ciblés
      const I = H / G; // Taux efficacité
      const K = H * (J / 100); // Visiteurs intéressés
      const M = K * (L / 100); // Visiteurs consultant
      const O = M * (N / 100); // Patients prescrits
      const Q = O * P; // Ventes incrémentales
      const ROI = R > 0 ? (Q / R) * 100 : 0; // ROI en %

      setCalculationResult({
        roi: ROI,
        incrementalSales: Q,
        totalPatients: C,
        untreatedPatients: E,
        targetedPatients: G,
        efficacyRate: I,
        interestedVisitors: K,
        consultedVisitors: M,
        prescribedPatients: O,
        totalCost: R,
      });
      setCalculated(true);
    } catch (error) {
      message.error("Erreur lors du calcul du ROI");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items || items.length < 11) {
      return message.error("Données nécessaires non disponibles");
    }

    if (!activityNumber) {
      return message.error("Numéro d'activité manquant");
    }

    const formData = {
      year,
      A: parseFloat(A),
      B: parseFloat(B),
      D: parseFloat(D),
      F: parseFloat(F),
      H: parseFloat(H),
      J: parseFloat(J),
      L: parseFloat(L),
      N: parseFloat(N),
      P: parseFloat(P),
      R: parseFloat(R),

      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_L: items[6]?.id,
      id_N: items[7]?.id,
      id_P: items[8]?.id,
      id_R: items[9]?.id,
      id_ROI: items[10]?.id,
    };

    try {
      const response = await axiosInstance.post("/insertIntoTable8", formData);

      if (response.status === 201) {
        message.success("Données enregistrées avec succès");
        deleteCookie("activityNumber");
        navigate("/CreateActivity");
      } else {
        message.error("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      message.error(
        error.response?.data?.message || "Erreur de communication avec le serveur"
      );
    }
  };

  return (
    <Layout className="min-h-screen">
      <TheHeader />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {calculationResult && (
            <div className="mt-8">
              <Divider>Résultats</Divider>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <Statistic
                    title="ROI"
                    value={calculationResult.roi}
                    precision={2}
                    suffix="%"
                    valueStyle={{
                      color: calculationResult.roi >= 0 ? "#3f8600" : "#cf1322",
                    }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Ventes Incrémentales"
                    value={calculationResult.incrementalSales}
                    precision={2}
                    suffix="MAD"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Coût Total"
                    value={calculationResult.totalCost}
                    precision={2}
                    suffix="MAD"
                  />
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Card>
                  <Statistic
                    title="Patients Potentiels"
                    value={calculationResult.totalPatients}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Visiteurs Intéressés"
                    value={calculationResult.interestedVisitors}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Patients Prescrits"
                    value={calculationResult.prescribedPatients}
                    precision={0}
                  />
                </Card>
              </div>

              <Card className="mt-4">
                <Statistic
                  title="Efficacité Campagne"
                  value={calculationResult.efficacyRate}
                  precision={2}
                />
                <Text type="secondary">
                  Ratio visites/patients ciblés
                </Text>
              </Card>

              {calculationResult.roi < 0 && (
                <Alert
                  message="ROI Négatif"
                  description="Ajustez les paramètres pour améliorer le ROI"
                  type="warning"
                  showIcon
                />
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Publicité Digitale - Calcul ROI
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Population totale (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={A}
                    onChange={(e) => setA(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Taux d'incidence % (B)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={B}
                    onChange={(e) => setB(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Patients satisfaits (D)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={D}
                    onChange={(e) => setD(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Patients visés (F)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={F}
                    onChange={(e) => setF(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Visites uniques (H)</label>
                  <Input
                    type="number"
                    min="0"
                    value={H}
                    onChange={(e) => setH(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Visiteurs intéressés (J)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={J}
                    onChange={(e) => setJ(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Visiteurs consultant (L)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={L}
                    onChange={(e) => setL(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Prescriptions (N)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={N}
                    onChange={(e) => setN(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Valeur patient (MAD) (P)</label>
                  <Input
                    type="number"
                    min="0"
                    value={P}
                    onChange={(e) => setP(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Coût campagne (MAD) (R)</label>
                  <Input
                    type="number"
                    min="0"
                    value={R}
                    onChange={(e) => setR(Number(e.target.value))}
                  />
                </div>

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
                  {loading ? <Spin size="small" /> : <><CalculatorOutlined /> Calculer ROI</>}
                </Button>

                <Button
                  type="submit"
                  disabled={loading || !calculated || !isFormValid()}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CheckCircleOutlined /> Enregistrer
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="/CreateActivity">
                    <Button variant="secondary">Retour</Button>
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

export default CalculateAct8;
