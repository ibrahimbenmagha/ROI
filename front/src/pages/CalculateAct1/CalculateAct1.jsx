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
import TheHeader from "../Header/Header";
import axiosInstance, { deleteCookie } from "../../axiosConfig";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct1 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [samplesPerDoctor, setSamplesPerDoctor] = useState(0);
  const [percentGivenToPatients, setPercentGivenToPatients] = useState(0);
  const [samplesPerPatient, setSamplesPerPatient] = useState(0);
  const [percentPrescribed, setPercentPrescribed] = useState(0);
  const [percentWouldBePrescribed, setPercentWouldBePrescribed] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [costPerSample, setCostPerSample] = useState(0);
  const [fixedCosts, setFixedCosts] = useState(0);
  const [year, setYear] = useState(null);

  const [activityNumber, setActivityNumber] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/CalculateAct(\d+)/);
    const foundActivityNumber = match ? parseInt(match[1]) : null;
    setActivityNumber(foundActivityNumber);
    document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

    axiosInstance
      .get("getActivityItemsByActivityId/1")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des items :", error);
        message.error("Impossible de charger les données de l'activité.");
        setError("Erreur lors du chargement des données.");
      });
  }, [location.pathname]);

  const handleReset = () => {
    setNumDoctors(0);
    setSamplesPerDoctor(0);
    setPercentGivenToPatients(0);
    setSamplesPerPatient(0);
    setPercentPrescribed(0);
    setPercentWouldBePrescribed(0);
    setValuePerPatient(0);
    setCostPerSample(0);
    setFixedCosts(0);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
    setError(null);
  };

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const isFormValid = () =>
    validateNumeric(numDoctors, 0) &&
    validateNumeric(samplesPerDoctor, 0) &&
    validateNumeric(percentGivenToPatients, 0, 100) &&
    validateNumeric(samplesPerPatient, 0.1) &&
    validateNumeric(percentPrescribed, 0, 100) &&
    validateNumeric(percentWouldBePrescribed, 0, 100) &&
    validateNumeric(valuePerPatient, 0) &&
    validateNumeric(costPerSample, 0) &&
    validateNumeric(fixedCosts, 0) &&
    !!year;

  const generateInterpretation = async (result) => {
    try {
      const response = await axiosInstance.post("/generate-interpretation", {
        roi: result.roi,
        totalSamples: result.totalSamples,
        totalPatientsWithSample: result.totalPatientsWithSample,
        totalPatientsWithPrescription: result.totalPatientsWithPrescription,
        totalIncrementalPatients: result.totalIncrementalPatients,
        incrementalRevenue: result.incrementalRevenue,
        totalCost: result.totalCost,
        totalSamplesCost: result.totalSamplesCost,
        numDoctors,
        samplesPerDoctor,
        percentGivenToPatients,
        samplesPerPatient,
        percentPrescribed,
        percentWouldBePrescribed,
        valuePerPatient,
        costPerSample,
        fixedCosts,
      });

      return response.data.interpretation;
    } catch (error) {
      console.error("Erreur lors de la génération de l'interprétation :", error);
      return null; // Return null to indicate failure
    }
  };

  const calculateRoi = async () => {
    if (!validateNumeric(numDoctors, 0))
      return message.error("Nombre de médecins recevant des échantillons invalide");
    if (!validateNumeric(samplesPerDoctor, 0))
      return message.error("Nombre d'échantillons par médecin invalide");
    if (!validateNumeric(percentGivenToPatients, 0, 100))
      return message.error("Pourcentage des échantillons réellement donnés aux patients invalide");
    if (!validateNumeric(samplesPerPatient, 0.1))
      return message.error("Nombre moyen d'échantillons par patient invalide");
    if (!validateNumeric(percentPrescribed, 0, 100))
      return message.error("Pourcentage des patients ayant reçu une prescription invalide");
    if (!validateNumeric(percentWouldBePrescribed, 0, 100))
      return message.error("Pourcentage des patients prescrits sans échantillon invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return message.error("Valeur moyenne d'un patient incrémental invalide");
    if (!validateNumeric(costPerSample, 0))
      return message.error("Coût unitaire d'un échantillon invalide");
    if (!validateNumeric(fixedCosts, 0))
      return message.error("Coûts fixes du programme invalides");

    setLoading(true);
    setError(null);

    try {
      const A = numDoctors;
      const B = samplesPerDoctor;
      const D = percentGivenToPatients / 100;
      const E = samplesPerPatient;
      const G = percentPrescribed / 100;
      const I = percentWouldBePrescribed / 100;
      const K = valuePerPatient;
      const M = costPerSample;
      const N = fixedCosts;

      const C = A * B;
      const F = (C * D) / E;
      const H = F * G;
      const J = H * (1 - I);
      const L = J * K;
      const P = M * C;
      const O = P + N;

      const ROI = O > 0 ? L / O : 0;

      const result = {
        roi: ROI,
        totalSamples: C,
        totalPatientsWithSample: F,
        totalPatientsWithPrescription: H,
        totalIncrementalPatients: J,
        incrementalRevenue: L,
        totalCost: O,
        totalSamplesCost: P,
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
      console.error("Erreur lors du calcul du ROI :", error);
      setError("Erreur lors du calcul du ROI. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items || items.length < 10) {
      return message.error("Les données nécessaires ne sont pas encore disponibles.");
    }

    if (!activityNumber) {
      return message.error("Le numéro d’activité est manquant.");
    }

    const formData = {
      year,
      A: parseFloat(numDoctors),
      B: parseFloat(samplesPerDoctor),
      D: parseFloat(percentGivenToPatients),
      E: parseFloat(samplesPerPatient),
      G: parseFloat(percentPrescribed),
      I: parseFloat(percentWouldBePrescribed),
      K: parseFloat(valuePerPatient),
      M: parseFloat(costPerSample),
      N: parseFloat(fixedCosts),
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_E: items[3]?.id,
      id_G: items[4]?.id,
      id_I: items[5]?.id,
      id_K: items[6]?.id,
      id_M: items[7]?.id,
      id_N: items[8]?.id,
      id_ROI: items[9]?.id,
    };

    try {
      const response = await axiosInstance.post("/insetrIntoTable1", formData);

      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/CreateActivity");
      } else {
        message.error("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.error("Erreur lors de l’envoi du formulaire :", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Erreur lors de la communication avec le serveur.");
      }
      setError("Erreur lors de l’envoi du formulaire.");
    }
  };

  if (error) {
    return (
      <Layout className="min-h-screen">
        <TheHeader />
        <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
          <Alert
            message="Erreur"
            description={error}
            type="error"
            showIcon
            style={{ maxWidth: 800, margin: "0 auto" }}
          />
        </Content>
      </Layout>
    );
  }

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
                    value={calculationResult.roi * 100}
                    precision={2}
                    suffix="%"
                    valueStyle={{
                      color: calculationResult.roi >= 1 ? "#3f8600" : "#cf1322",
                    }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Valeur Totale"
                    value={calculationResult.incrementalRevenue}
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
                <Card>
                  <Statistic
                    title="Nombre total d’échantillons distribués"
                    value={calculationResult.totalSamples}
                    precision={0}
                    suffix=" Echantillons"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Nombre total de patients ayant reçu un échantillon"
                    value={calculationResult.totalPatientsWithSample}
                    precision={0}
                    suffix=" Patient"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Nombre total de patients obtenant une prescription"
                    value={calculationResult.totalPatientsWithPrescription}
                    precision={0}
                    suffix=" Patient"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Nombre total de patients incrémentaux gagnés grâce aux échantillons"
                    value={calculationResult.totalIncrementalPatients}
                    precision={0}
                    suffix=" Patient"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Coût total des échantillons distribués"
                    value={calculationResult.totalSamplesCost}
                    precision={2}
                    suffix=" MAD"
                  />
                </Card>
              </div>

              {calculationResult.roi < 1 && (
                <Alert
                  style={{ marginTop: "16px" }}
                  message="ROI Négatif ou Faible"
                  description="Le programme génère un retour insuffisant. Consultez les conseils ci-dessous pour améliorer vos résultats."
                  type="warning"
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
                Distribution des échantillons
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins recevant des échantillons (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Nombre d'échantillons par médecin (B)</label>
                  <Input
                    type="number"
                    min="0"
                    value={samplesPerDoctor}
                    onChange={(e) => setSamplesPerDoctor(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% des échantillons donnés aux patients (D)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentGivenToPatients}
                    onChange={(e) => setPercentGivenToPatients(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Nombre moyen d'échantillons par patient (E)</label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={samplesPerPatient}
                    onChange={(e) => setSamplesPerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% des patients avec prescription après usage (G)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescribed}
                    onChange={(e) => setPercentPrescribed(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% des patients prescrits sans échantillon (I)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentWouldBePrescribed}
                    onChange={(e) => setPercentWouldBePrescribed(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Valeur moyenne d'un patient incrémental MAD (K)</label>
                  <Input
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût unitaire d'un échantillon MAD (M)</label>
                  <Input
                    type="number"
                    min="0"
                    value={costPerSample}
                    onChange={(e) => setCostPerSample(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coûts fixes du programme MAD (N)</label>
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
                  type="button"
                  onClick={calculateRoi}
                  disabled={loading}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      <CalculatorOutlined /> Calculer ROI
                    </>
                  )}
                </Button>
                <Button
                  style={{ backgroundColor: "#1890ff" }}
                  type="submit"
                  disabled={loading || !calculated || !isFormValid()}
                >
                  <CheckCircleOutlined /> Insérer les données
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleReset}>
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="../CreateActivity">
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

export default CalculateAct1;