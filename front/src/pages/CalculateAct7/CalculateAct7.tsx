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

const CalculateAct7 = () => {
  const [consumerTarget, setConsumerTarget] = useState(0);
  const [reachPercentage, setReachPercentage] = useState(0);
  const [recallPercentage, setRecallPercentage] = useState(0);
  const [consultPercentage, setConsultPercentage] = useState(0);
  const [prescriptionPercentage, setPrescriptionPercentage] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [mediaCosts, setMediaCosts] = useState(0);
  const [productionCosts, setProductionCosts] = useState(0);
  const [year, setYear] = useState(null);

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
    document.cookie = `activityNumber=${activityNumber}; path=/; max-age=3600;`;

    axiosInstance
      .get("getActivityItemsByActivityId/7")
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
    validateNumeric(consumerTarget, 0) &&
    validateNumeric(reachPercentage, 0, 100) &&
    validateNumeric(recallPercentage, 0, 100) &&
    validateNumeric(consultPercentage, 0, 100) &&
    validateNumeric(prescriptionPercentage, 0, 100) &&
    validateNumeric(valuePerPatient, 0) &&
    validateNumeric(mediaCosts, 0) &&
    validateNumeric(productionCosts, 0) &&
    !!year;

  const generateInterpretation = async (result) => {
    try {
      const payload = {
        ...result, // roi, consumersReached, consumersRecalling, etc.
        inputs: {
          numConsumersTargeted: consumerTarget,
          percentReach: reachPercentage,
          percentRecall: recallPercentage,
          percentConsulting: consultPercentage,
          percentPrescribed: prescriptionPercentage,
          valuePerPatient: valuePerPatient,
          mediaCosts: mediaCosts,
          productionCosts: productionCosts,
        },
      };
      const response = await axiosInstance.post(
        "/generate-interpretation",
        payload
      );
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
    if (!validateNumeric(consumerTarget, 0))
      return message.error("Nombre de consommateurs cibles invalide");
    if (!validateNumeric(reachPercentage, 0, 100))
      return message.error("Pourcentage d'audience invalide");
    if (!validateNumeric(recallPercentage, 0, 100))
      return message.error("Pourcentage de rappel invalide");
    if (!validateNumeric(consultPercentage, 0, 100))
      return message.error("Pourcentage de consultation invalide");
    if (!validateNumeric(prescriptionPercentage, 0, 100))
      return message.error("Pourcentage de prescription invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return message.error("Valeur par patient invalide");
    if (!validateNumeric(mediaCosts, 0))
      return message.error("Dépenses médias invalides");
    if (!validateNumeric(productionCosts, 0))
      return message.error("Coûts de production invalides");
    if (!year) return message.error("Veuillez sélectionner une année");

    setLoading(true);
    try {
      const H = reachPercentage / 100;
      const J = recallPercentage / 100;
      const L = consultPercentage / 100;
      const N = prescriptionPercentage / 100;

      const G = consumerTarget;
      const P = valuePerPatient;
      const R1 = mediaCosts;
      const S = productionCosts;

      const I = G * H; // Consumers reached
      const K = I * J; // Consumers recalling
      const M = K * L; // Consumers consulting
      const O = M * N; // Incremental patients
      const Q = O * P; // Incremental sales
      const T = R1 + S; // Total cost
      const ROI = T > 0 ? (Q / T) * 100 : 0; // ROI in %

      const result = {
        roi: ROI,
        consumersReached: I,
        consumersRecalling: K,
        consumersConsulting: M,
        incrementalPatients: O,
        incrementalSales: Q,
        totalCost: T,
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
    setConsumerTarget(0);
    setReachPercentage(0);
    setRecallPercentage(0);
    setConsultPercentage(0);
    setPrescriptionPercentage(0);
    setValuePerPatient(0);
    setMediaCosts(0);
    setProductionCosts(0);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      message.error("Veuillez d'abord ajouter des éléments d'activité");
      return;
    }

    const formData = {
      year,
      H: reachPercentage,
      J: recallPercentage,
      L: consultPercentage,
      N: prescriptionPercentage,
      G: consumerTarget,
      P: valuePerPatient,
      R1: mediaCosts,
      S: productionCosts,
      id_H: items[0]?.id,
      id_J: items[1]?.id,
      id_L: items[2]?.id,
      id_N: items[3]?.id,
      id_G: items[4]?.id,
      id_P: items[5]?.id,
      id_R1: items[6]?.id,
      id_S: items[7]?.id,
      id_ROI: items[8]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable7", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        message.error("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
      message.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'insertion."
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
                    title="Consommateurs Atteints"
                    value={calculationResult.consumersReached}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Consommateurs se Rappelant"
                    value={calculationResult.consumersRecalling}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Consommateurs Consultant"
                    value={calculationResult.consumersConsulting}
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
                Publicité directe au consommateur
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="consumerTarget"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de consommateurs cibles (G)
                  </label>
                  <Input
                    id="consumerTarget"
                    type="number"
                    min="0"
                    value={consumerTarget}
                    onChange={(e) => setConsumerTarget(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reachPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage d'audience atteinte % (H)
                  </label>
                  <Input
                    id="reachPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={reachPercentage}
                    onChange={(e) => setReachPercentage(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="recallPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de consommateurs se rappelant % (J)
                  </label>
                  <Input
                    id="recallPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={recallPercentage}
                    onChange={(e) =>
                      setRecallPercentage(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="consultPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage ayant consulté un médecin % (L)
                  </label>
                  <Input
                    id="consultPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={consultPercentage}
                    onChange={(e) =>
                      setConsultPercentage(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="prescriptionPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage recevant une prescription % (N)
                  </label>
                  <Input
                    id="prescriptionPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={prescriptionPercentage}
                    onChange={(e) =>
                      setPrescriptionPercentage(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="valuePerPatient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valeur du revenu par patient MAD (P)
                  </label>
                  <Input
                    id="valuePerPatient"
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mediaCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dépenses médias MAD (R1)
                  </label>
                  <Input
                    id="mediaCosts"
                    type="number"
                    min="0"
                    value={mediaCosts}
                    onChange={(e) => setMediaCosts(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="productionCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coûts de production et frais d'agence MAD (S)
                  </label>
                  <Input
                    id="productionCosts"
                    type="number"
                    min="0"
                    value={productionCosts}
                    onChange={(e) => setProductionCosts(Number(e.target.value))}
                    className="w-full"
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

export default CalculateAct7;
