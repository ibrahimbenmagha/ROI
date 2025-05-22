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

const CalculateAct10 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [percentRemember, setPercentRemember] = useState(0);
  const [percentImproved, setPercentImproved] = useState(0);
  const [percentPrescribers, setPercentPrescribers] = useState(0);
  const [patientsPerPrescriber, setPatientsPerPrescriber] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [totalFixedCost, setTotalFixedCost] = useState(0);
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
    const foundActivityNumber = match ? parseInt(match[1]) : null;
    setActivityNumber(foundActivityNumber);
    document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

    axiosInstance
      .get("getActivityItemsByActivityId/10")
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
    validateNumeric(percentRemember, 0, 100) &&
    validateNumeric(percentImproved, 0, 100) &&
    validateNumeric(percentPrescribers, 0, 100) &&
    validateNumeric(patientsPerPrescriber, 0) &&
    validateNumeric(valuePerPatient, 0) &&
    validateNumeric(totalFixedCost, 0) &&
    !!year;

  const generateInterpretation = async (result) => {
    try {
      const payload = {
        ...result, // roi, doctorsRemembering, doctorsImproved, etc.
        inputs: {
          numDoctorsExposed: numDoctors,
          percentRemember: percentRemember,
          percentImprovedPerception: percentImproved,
          percentAdditionalPrescribers: percentPrescribers,
          patientsPerPrescriber: patientsPerPrescriber,
          valuePerPatient: valuePerPatient,
          totalFixedCost: totalFixedCost,
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
    if (!validateNumeric(percentRemember, 0, 100))
      return message.error("Pourcentage de mémorisation invalide");
    if (!validateNumeric(percentImproved, 0, 100))
      return message.error("Perception améliorée invalide");
    if (!validateNumeric(percentPrescribers, 0, 100))
      return message.error("Prescripteurs supplémentaires invalide");
    if (!validateNumeric(patientsPerPrescriber, 0))
      return message.error("Nouveaux patients invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return message.error("Valeur par patient invalide");
    if (!validateNumeric(totalFixedCost, 0))
      return message.error("Coût fixe invalide");
    if (!year) return message.error("Veuillez sélectionner une année");

    setLoading(true);
    try {
      const A = numDoctors;
      const B = percentRemember / 100;
      const D = percentImproved / 100;
      const F = percentPrescribers / 100;
      const H = patientsPerPrescriber;
      const J = valuePerPatient;
      const L = totalFixedCost;

      const C = A * B; // Médecins mémorisant
      const E = C * D; // Médecins avec perception améliorée
      const G = E * F; // Prescripteurs supplémentaires
      const I = G * H; // Patients incrémentaux
      const K = I * J; // Ventes incrémentales
      const ROI = L > 0 ? (K / L) * 100 : 0; // ROI en %

      const result = {
        roi: ROI,
        doctorsRemembering: C,
        doctorsImproved: E,
        additionalPrescribers: G,
        incrementalPatients: I,
        incrementalSales: K,
        totalCost: L,
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
    setPercentRemember(0);
    setPercentImproved(0);
    setPercentPrescribers(0);
    setPatientsPerPrescriber(0);
    setValuePerPatient(0);
    setTotalFixedCost(0);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 8) {
      message.error("Données manquantes");
      return;
    }
    if (!year) {
      message.error("Veuillez sélectionner une année");
      return;
    }
    if (!activityNumber) {
      message.error("Numéro d'activité introuvable");
      return;
    }

    const formData = {
      year,
      activityId: activityNumber,
      A: numDoctors,
      B: percentRemember,
      D: percentImproved,
      F: percentPrescribers,
      H: patientsPerPrescriber,
      J: valuePerPatient,
      L: totalFixedCost,
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_L: items[6]?.id,
      id_ROI: items[7]?.id,
    };

    try {
      const response = await axiosInstance.post("insertActivityData", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        message.error("Erreur lors de l'insertion.");
      }
    } catch (error) {
      console.error(error);
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
                    title="Médecins Mémorisant"
                    value={calculationResult.doctorsRemembering}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins avec Perception Améliorée"
                    value={calculationResult.doctorsImproved}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Prescripteurs Supplémentaires"
                    value={calculationResult.additionalPrescribers}
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
                Médicaments génériques - Médecins
              </Title>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins exposés à l'activité (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Pourcentage de médecins se souvenant du message % (B)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentRemember}
                    onChange={(e) => setPercentRemember(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Pourcentage ayant amélioré leur perception % (D)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentImproved}
                    onChange={(e) => setPercentImproved(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Pourcentage des prescripteurs ayant changé leur perception % (F)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescribers}
                    onChange={(e) => setPercentPrescribers(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Nombre moyen de nouveaux patients par prescripteur (H)</label>
                  <Input
                    type="number"
                    min="0"
                    value={patientsPerPrescriber}
                    onChange={(e) => setPatientsPerPrescriber(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Valeur moyenne du revenu par patient MAD (J)</label>
                  <Input
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût fixe total de l'activité MAD (L)</label>
                  <Input
                    type="number"
                    min="0"
                    value={totalFixedCost}
                    onChange={(e) => setTotalFixedCost(Number(e.target.value))}
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

export default CalculateAct10;