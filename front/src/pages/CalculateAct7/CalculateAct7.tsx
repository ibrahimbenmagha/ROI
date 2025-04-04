import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  Statistic,
  Alert,
  message,
} from "antd";
import {
  CalculatorOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import TheHeader from "../Header/Header";
import axiosInstance from "../../axiosConfig";
import {deleteCookie } from "../../axiosConfig";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct7 = () => {
  // États pour stocker les valeurs du formulaire
  const [consumerTarget, setConsumerTarget] = useState(0); // G - Nombre de consommateurs cibles pour la campagne
  const [reachPercentage, setReachPercentage] = useState(0); // H - Pourcentage d'audience cible atteinte par le plan média
  const [recallPercentage, setRecallPercentage] = useState(0); // J - Pourcentage de consommateurs se rappelant de la campagne
  const [consultPercentage, setConsultPercentage] = useState(0); // L - Pourcentage de consommateurs ayant consulté un médecin suite à l'exposition
  const [prescriptionPercentage, setPrescriptionPercentage] = useState(0); // N - Pourcentage de patients ayant consulté et recevant une prescription
  const [valuePerPatient, setValuePerPatient] = useState(0); // P - Valeur du revenu par patient incrémental
  const [mediaCosts, setMediaCosts] = useState(0); // R1 - Dépenses médias (en MAD k)
  const [productionCosts, setProductionCosts] = useState(0); // S - Coûts de production, frais d'agence et autres (en MAD k)

  // État pour stocker les résultats
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/CalculateAct(\d+)/);
    const activityNumber = match ? parseInt(match[1]) : null;
    document.cookie = `activityNumber=${activityNumber}; path=/; max-age=3600;`;

    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }
    axiosInstance
      .get("getActivityItemsByActivityId/7")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const calculateRoi = () => {
    // Validation simple
    if (!validateNumeric(consumerTarget, 0))
      return alert("Nombre de consommateurs cibles invalide");
    if (!validateNumeric(reachPercentage, 0, 100))
      return alert("Pourcentage d'audience invalide");
    if (!validateNumeric(recallPercentage, 0, 100))
      return alert("Pourcentage de rappel invalide");
    if (!validateNumeric(consultPercentage, 0, 100))
      return alert("Pourcentage de consultation invalide");
    if (!validateNumeric(prescriptionPercentage, 0, 100))
      return alert("Pourcentage de prescription invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return alert("Valeur par patient invalide");
    if (!validateNumeric(mediaCosts, 0))
      return alert("Dépenses médias invalides");
    if (!validateNumeric(productionCosts, 0))
      return alert("Coûts de production invalides");

    // Conversion des pourcentages
    const H = reachPercentage / 100;
    const J = recallPercentage / 100;
    const L = consultPercentage / 100;
    const N = prescriptionPercentage / 100;

    const G = consumerTarget;
    const P = valuePerPatient;
    const R1 = mediaCosts;
    const S = productionCosts;

    // Calculs
    const I = G * H; // Nombre de consommateurs atteints par la campagne
    const K = I * J; // Nombre de consommateurs se rappelant de la campagne
    const M = K * L; // Nombre de consommateurs consultant un médecin
    const O = M * N; // Nombre de patients incrémentaux obtenus
    const Q = O * P; // Ventes incrémentales générées
    const T = R1 + S; // Coûts totaux du programme

    // Calcul du ROI
    const ROI = T > 0 ? (Q / T) * 100 : 0;

    setCalculationResult({
      roi: ROI,
      consumersReached: I,
      consumersRecalling: K,
      consumersConsulting: M,
      incrementalPatients: O,
      incrementalSales: Q,
      totalCost: T,
    });
    setCalculated(true);
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
    setCalculationResult(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Veuillez d'abord ajouter des éléments d'activité");
      return;
    }
    const formData = {
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
        alert("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        alert(
          error.response.data.message ||
            "Une erreur est survenue lors de l'insertion."
        );
      } else if (error.request) {
        alert("Aucune réponse reçue du serveur.");
      } else {
        alert("Une erreur est survenue lors de l'envoi de la requête.");
      }
    }
  };

  return (
    <Layout className="min-h-screen">
      <TheHeader />

      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Publicité directe au consommateur
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* G - Consommateurs cibles */}
                <div>
                  <label
                    htmlFor="consumerTarget"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de consommateurs cibles
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

                {/* H - Pourcentage d'audience */}
                <div>
                  <label
                    htmlFor="reachPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage d'audience atteinte %
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

                {/* J - Pourcentage de rappel */}
                <div>
                  <label
                    htmlFor="recallPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de consommateurs se rappelant %
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

                {/* L - Pourcentage de consultation */}
                <div>
                  <label
                    htmlFor="consultPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage ayant consulté un médecin %
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

                {/* N - Pourcentage de prescription */}
                <div>
                  <label
                    htmlFor="prescriptionPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage recevant une prescription %
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

                {/* P - Valeur patient */}
                <div>
                  <label
                    htmlFor="valuePerPatient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valeur du revenu par patient €
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

                {/* R1 - Dépenses médias */}
                <div>
                  <label
                    htmlFor="mediaCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dépenses médias k€
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

                {/* S - Coûts de production */}
                <div>
                  <label
                    htmlFor="productionCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coûts de production et frais d'agence k€
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
              </div>

              <Divider />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  onClick={calculateRoi}
                  type="button"
                  className="bg-primary"
                  disabled={loading}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      <CalculatorOutlined className="mr-2" />
                      Calculer ROI
                    </>
                  )}
                </Button>

                <Button
                  className="bg-primary"
                  type="submit"
                  disabled={loading || !calculated} // Désactiver si le calcul n'est pas encore fait
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      <CheckCircleOutlined className="mr-2" />
                      Insérer les données
                    </>
                  )}
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} type="button">
                    <ReloadOutlined className="mr-2" />
                    Réinitialiser
                  </Button>
                  <Link to="/DisplayActivity">
                    <Button variant="secondary">Retour</Button>
                  </Link>
                </div>
              </div>

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
                            calculationResult.roi >= 0 ? "#3f8600" : "#cf1322",
                        }}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Ventes Incrémentales"
                        value={calculationResult.incrementalSales}
                        precision={2}
                        suffix="€"
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Coût Total"
                        value={calculationResult.totalCost}
                        precision={2}
                        suffix="k€"
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

                  {calculationResult.roi < 0 && (
                    <Alert
                      style={{ marginTop: "16px" }}
                      message="ROI Négatif"
                      description="Le programme génère actuellement un retour négatif sur investissement. Essayez d'ajuster les paramètres."
                      type="warning"
                      showIcon
                    />
                  )}
                </div>
              )}
            </Card>
          </form>
        </div>
      </Content>
    </Layout>
  );
};

export default CalculateAct7;
