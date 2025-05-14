
import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  Statistic,
  Alert,
  message,
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

const CalculateAct4 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [percentRemember, setPercentRemember] = useState(0);
  const [percentPositive, setPercentPositive] = useState(0);
  const [percentPrescribing, setPercentPrescribing] = useState(0);
  const [patientsPerDoctor, setPatientsPerDoctor] = useState(0);
  const [kolAdjustment, setKolAdjustment] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [costPerDoctor, setCostPerDoctor] = useState(0);
  const [fixedCosts, setFixedCosts] = useState(0);
  const [year, setYear] = useState(null);
  const [activityNumber, setActivityNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/CalculateAct(\d+)/);
    const activityNumber = match ? parseInt(match[1]) : null;
    setActivityNumber(activityNumber);
    document.cookie = `activityNumber=${activityNumber}; path=/; max-age=3600;`;

    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }

    axiosInstance
      .get("getActivityItemsByActivityId/4")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des items :", error);
        message.error("Impossible de charger les données de l'activité.");
      });
  }, [location.pathname]);

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const isFormValid = () =>
    validateNumeric(numDoctors, 0) &&
    validateNumeric(percentRemember, 0, 100) &&
    validateNumeric(percentPositive, 0, 100) &&
    validateNumeric(percentPrescribing, 0, 100) &&
    validateNumeric(patientsPerDoctor, 0) &&
    validateNumeric(kolAdjustment, 0) &&
    validateNumeric(valuePerPatient, 0) &&
    validateNumeric(costPerDoctor, 0) &&
    validateNumeric(fixedCosts, 0) &&
    !!year;

  const generateInterpretation = async (result) => {
    try {
      const response = await axiosInstance.post("/generate-interpretation", {
        roi: result.roi,
        doctorsExposed: result.doctorsExposed,
        doctorsPositive: result.doctorsPositive,
        doctorsPrescribing: result.doctorsPrescribing,
        incrementalPatients: result.incrementalPatients,
        incrementalSales: result.incrementalSales,
        totalCost: result.totalCost,
        numDoctors,
        percentRemember,
        percentPositive,
        percentPrescribing,
        patientsPerDoctor,
        kolAdjustment,
        valuePerPatient,
        costPerDoctor,
        fixedCosts,
      });

      return response.data.interpretation;
    } catch (error) {
      console.error(
        "Erreur lors de la génération de l'interprétation :",
        error
      );
      return null;
    }
  };

  const calculateRoi = async () => {
    if (!validateNumeric(numDoctors, 0))
      return message.error("Nombre de médecins invalide");
    if (!validateNumeric(percentRemember, 0, 100))
      return message.error("Pourcentage de rétention invalide");
    if (!validateNumeric(percentPositive, 0, 100))
      return message.error("Perception positive invalide");
    if (!validateNumeric(percentPrescribing, 0, 100))
      return message.error("Prescription invalide");
    if (!validateNumeric(patientsPerDoctor, 0))
      return message.error("Nombre de patients invalide");
    if (!validateNumeric(kolAdjustment, 0))
      return message.error("Ajustement KOL invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return message.error("Valeur patient invalide");
    if (!validateNumeric(costPerDoctor, 0))
      return message.error("Coût par médecin invalide");
    if (!validateNumeric(fixedCosts, 0))
      return message.error("Coûts fixes invalides");
    if (!year) return message.error("Veuillez sélectionner une année.");

    setLoading(true);
    try {
      const A = numDoctors;
      const B = percentRemember / 100;
      const D = percentPositive / 100;
      const F = percentPrescribing / 100;
      const H = patientsPerDoctor;
      const KOL = kolAdjustment;
      const J = valuePerPatient;
      const L = costPerDoctor;
      const M = fixedCosts;

      const C = A * B;
      const E = C * D;
      const G = E * F;
      const I = G * H + KOL;
      const K = I * J;
      const N = L * A + M;
      const ROI = N > 0 ? (K / N) * 100 : 0;

      const result = {
        roi: ROI,
        doctorsExposed: C,
        doctorsPositive: E,
        doctorsPrescribing: G,
        incrementalPatients: I,
        incrementalSales: K,
        totalCost: N,
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
      message.error("Erreur lors du calcul du ROI.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNumDoctors(0);
    setPercentRemember(0);
    setPercentPositive(0);
    setPercentPrescribing(0);
    setPatientsPerDoctor(0);
    setKolAdjustment(0);
    setValuePerPatient(0);
    setCostPerDoctor(0);
    setFixedCosts(0);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 10) {
      return message.error("Les items de l'activité ne sont pas prêts.");
    }
    if (!activityNumber) {
      return message.error("Aucune activité détectée.");
    }

    const formData = {
      year: year,
      A: numDoctors,
      B: percentRemember,
      D: percentPositive,
      F: percentPrescribing,
      H: patientsPerDoctor,
      KOL: kolAdjustment,
      J: valuePerPatient,
      L: costPerDoctor,
      M: fixedCosts,

      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_KOL: items[5]?.id,
      id_J: items[6]?.id,
      id_L: items[7]?.id,
      id_M: items[8]?.id,
      id_ROI: items[9]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable4", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        message.error("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.error("Erreur lors de l’envoi du formulaire :", error);
      message.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la communication avec le serveur."
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
                      color:
                        calculationResult.roi >= 100 ? "#3f8600" : "#cf1322",
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
                    title="Médecins exposés"
                    value={calculationResult.doctorsExposed}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins positifs"
                    value={calculationResult.doctorsPositive}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins prescrivant"
                    value={calculationResult.doctorsPrescribing}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Patients incrémentaux"
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
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Conférences
              </Title>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins participants (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% de rétention du message (B)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentRemember}
                    onChange={(e) => setPercentRemember(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% de perception positive (D)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPositive}
                    onChange={(e) => setPercentPositive(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% prescripteurs (F)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescribing}
                    onChange={(e) =>
                      setPercentPrescribing(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>Patients prescrits / médecin (H)</label>
                  <Input
                    type="number"
                    min="0"
                    value={patientsPerDoctor}
                    onChange={(e) =>
                      setPatientsPerDoctor(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>Ajustement KOL</label>
                  <Input
                    type="number"
                    min="0"
                    value={kolAdjustment}
                    onChange={(e) => setKolAdjustment(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Valeur par patient (J) (MAD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût / médecin (L) (MAD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={costPerDoctor}
                    onChange={(e) => setCostPerDoctor(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût fixe total (M) (MAD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(Number(e.target.value))}
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
                  onClick={calculateRoi}
                  type="button"
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
                  <CheckCircleOutlined className="mr-2" /> Insérer les données
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} type="button">
                    <ReloadOutlined className="mr-2" /> Réinitialiser
                  </Button>
                  <Link to="/DisplayActivity">
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

export default CalculateAct4;
