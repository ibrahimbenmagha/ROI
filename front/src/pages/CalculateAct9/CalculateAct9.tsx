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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";

import TheHeader from "../Header/Header";
import axiosInstance, { deleteCookie } from "../../axiosConfig";

const { Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct9 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [numInsertions, setNumInsertions] = useState(0);
  const [percentRemember, setPercentRemember] = useState(0);
  const [percentPrescribing, setPercentPrescribing] = useState(0);
  const [patientsPerPrescriber, setPatientsPerPrescriber] = useState(0);
  const [revenuePerPatient, setRevenuePerPatient] = useState(0);
  const [mediaCosts, setMediaCosts] = useState(0);
  const [managementCosts, setManagementCosts] = useState(0);
  const [year, setYear] = useState(null);
  const [activityNumber, setActivityNumber] = useState(null);

  const [calculationResult, setCalculationResult] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
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
      .get("getActivityItemsByActivityId/9")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur items:", error);
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
    validateNumeric(numInsertions, 0) &&
    validateNumeric(percentRemember, 0, 100) &&
    validateNumeric(percentPrescribing, 0, 100) &&
    validateNumeric(patientsPerPrescriber, 0) &&
    validateNumeric(revenuePerPatient, 0) &&
    validateNumeric(mediaCosts, 0) &&
    validateNumeric(managementCosts, 0) &&
    !!year;

  const generateInterpretation = async (result) => {
    try {
      const payload = {
        ...result, // roi, doctorsRemembering, doctorsPrescribing, etc.
        inputs: {
          numDoctorsReading: numDoctors,
          numInsertions: numInsertions,
          percentRemember: percentRemember,
          percentPrescribing: percentPrescribing,
          patientsPerPrescriber: patientsPerPrescriber,
          revenuePerPatient: revenuePerPatient,
          mediaCosts: mediaCosts,
          managementCosts: managementCosts,
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
    if (!validateNumeric(numDoctors, 0))
      return message.error("Nombre de médecins invalide");
    if (!validateNumeric(numInsertions, 0))
      return message.error("Nombre d'insertions invalide");
    if (!validateNumeric(percentRemember, 0, 100))
      return message.error("Pourcentage de rappel invalide");
    if (!validateNumeric(percentPrescribing, 0, 100))
      return message.error("Pourcentage de prescription invalide");
    if (!validateNumeric(patientsPerPrescriber, 0))
      return message.error("Patients par prescripteur invalide");
    if (!validateNumeric(revenuePerPatient, 0))
      return message.error("Revenu par patient invalide");
    if (!validateNumeric(mediaCosts, 0))
      return message.error("Coûts média invalides");
    if (!validateNumeric(managementCosts, 0))
      return message.error("Coûts de gestion invalides");
    if (!year) return message.error("Veuillez sélectionner une année");

    setLoading(true);
    try {
      const C = percentRemember / 100;
      const E = percentPrescribing / 100;

      const A = numDoctors;
      const G = patientsPerPrescriber;
      const I = revenuePerPatient;
      const K = mediaCosts;
      const L = managementCosts;

      const D = A * C; // Médecins se souvenant
      const F = D * E; // Médecins prescripteurs
      const H = F * G; // Patients incrémentaux
      const J = H * I; // Ventes incrémentales
      const M = K + L; // Coût total
      const ROI = M > 0 ? (J / M) * 100 : 0; // ROI en %

      const result = {
        roi: ROI,
        doctorsRemembering: D,
        doctorsPrescribing: F,
        incrementalPatients: H,
        incrementalSales: J,
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
      console.error("Erreur lors du calcul du ROI :", error);
      message.error("Erreur lors du calcul du ROI.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNumDoctors(0);
    setNumInsertions(0);
    setPercentRemember(0);
    setPercentPrescribing(0);
    setPatientsPerPrescriber(0);
    setRevenuePerPatient(0);
    setMediaCosts(0);
    setManagementCosts(0);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 9) {
      message.error("Données incomplètes");
      return;
    }
    if (!year) {
      message.error("Veuillez sélectionner une année");
      return;
    }
    if (!activityNumber) {
      message.error("Aucune activité détectée");
      return;
    }

    const formData = {
      year,
      activityId: activityNumber,
      A: numDoctors,
      B: numInsertions,
      C: percentRemember,
      E: percentPrescribing,
      G: patientsPerPrescriber,
      I: revenuePerPatient,
      K: mediaCosts,
      L: managementCosts,
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_C: items[2]?.id,
      id_E: items[3]?.id,
      id_G: items[4]?.id,
      id_I: items[5]?.id,
      id_K: items[6]?.id,
      id_L: items[7]?.id,
      id_ROI: items[8]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable9", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        message.error("Erreur lors de l'insertion.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      message.error(
        error.response?.data?.message || "Erreur de communication avec le serveur."
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
                    title="Médecins se Souvenant"
                    value={calculationResult.doctorsRemembering}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins Prescripteurs"
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
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Publicité dans les revues
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins lisant les publications (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Nombre d'insertions publicitaires prévues (B)</label>
                  <Input
                    type="number"
                    min="0"
                    value={numInsertions}
                    onChange={(e) => setNumInsertions(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Pourcentage de médecins se souvenant de la marque % (C)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentRemember}
                    onChange={(e) => setPercentRemember(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Pourcentage de médecins prescrivant après exposition % (E)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescribing}
                    onChange={(e) => setPercentPrescribing(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Nombre moyen de nouveaux patients par prescripteur (G)</label>
                  <Input
                    type="number"
                    min="0"
                    value={patientsPerPrescriber}
                    onChange={(e) => setPatientsPerPrescriber(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Revenu par nouveau patient MAD (I)</label>
                  <Input
                    type="number"
                    min="0"
                    value={revenuePerPatient}
                    onChange={(e) => setRevenuePerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coûts d'achat média MAD (K)</label>
                  <Input
                    type="number"
                    min="0"
                    value={mediaCosts}
                    onChange={(e) => setMediaCosts(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coûts de création et gestion MAD (L)</label>
                  <Input
                    type="number"
                    min="0"
                    value={managementCosts}
                    onChange={(e) => setManagementCosts(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Année</label>
                  <DatePicker
                    picker="year"
                    value={year ? dayjs(year, "YYYY") : null}
                    onChange={(date, dateString) => setYear(dateString)}
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
                  <CheckCircleOutlined className="mr-2" /> Insérer les données
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleReset}>
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

export default CalculateAct9;