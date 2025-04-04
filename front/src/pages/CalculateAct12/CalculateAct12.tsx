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

const CalculateAct12 = () => {
  // États pour stocker les valeurs du formulaire
  const [numDoctors, setNumDoctors] = useState(0); // A - Nombre de médecins susceptibles de prescrire
  const [percentUsingInternet, setPercentUsingInternet] = useState(50); // B - % des médecins utilisant internet
  const [totalUniqueVisits, setTotalUniqueVisits] = useState(0); // D - Nombre total de visites uniques
  const [percentInteracted, setPercentInteracted] = useState(50); // F - % des visiteurs ayant interagi
  const [percentChangedPerception, setPercentChangedPerception] = useState(50); // H - % des médecins ayant changé de perception
  const [percentLikelyToPrescribe, setPercentLikelyToPrescribe] = useState(50); // J - % des médecins susceptibles de prescrire
  const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(0); // L - Nombre moyen de nouveaux patients par médecin
  const [revenuePerPatient, setRevenuePerPatient] = useState(0); // N - Valeur moyenne de revenu par patient
  const [totalCost, setTotalCost] = useState(0); // P - Coût total du programme e-digital

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
      .get("getActivityItemsByActivityId/12")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  // Fonction pour valider une entrée numérique
  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const calculateRoi = () => {
    // Validation simple
    if (!validateNumeric(numDoctors, 0))
      return alert("Nombre de médecins invalide");
    if (!validateNumeric(percentUsingInternet, 0, 100))
      return alert("Pourcentage des médecins utilisant internet invalide");
    if (!validateNumeric(totalUniqueVisits, 0))
      return alert("Nombre total de visites uniques invalide");
    if (!validateNumeric(percentInteracted, 0, 100))
      return alert("Pourcentage des visiteurs ayant interagi invalide");
    if (!validateNumeric(percentChangedPerception, 0, 100))
      return alert(
        "Pourcentage des médecins ayant changé de perception invalide"
      );
    if (!validateNumeric(percentLikelyToPrescribe, 0, 100))
      return alert(
        "Pourcentage des médecins susceptibles de prescrire invalide"
      );
    if (!validateNumeric(newPatientsPerDoctor, 0))
      return alert("Nombre moyen de nouveaux patients par médecin invalide");
    if (!validateNumeric(revenuePerPatient, 0))
      return alert("Valeur moyenne de revenu par patient invalide");
    if (!validateNumeric(totalCost, 0))
      return alert("Coût total du programme e-digital invalide");

    // Conversion des pourcentages
    const B = percentUsingInternet / 100;
    const F = percentInteracted / 100;
    const H = percentChangedPerception / 100;
    const J = percentLikelyToPrescribe / 100;

    // Variables
    const A = numDoctors;
    const D = totalUniqueVisits;
    const L = newPatientsPerDoctor;
    const N = revenuePerPatient;
    const P = totalCost;

    // Calculs
    const C = A * B; // Taille de l'audience digitale potentielle
    const E = D / C; // Taux d'efficacité sur les médecins cibles
    const G = D * F; // Médecins ayant démontré un intérêt qualifié
    const I = G * H; // Médecins ayant changé positivement leur perception
    const K = I * J; // Médecins prescrivant le produit
    const M = K * L; // Nombre total de patients incrémentaux
    const O = M * N; // Ventes incrémentales générées
    const ROI = P > 0 ? (O / P) * 100 : 0; // Calcul du ROI (en pourcentage)

    setCalculationResult({
      roi: ROI,
      audiencePotential: C,
      effectivenessRate: E,
      interestedDoctors: G,
      changedPerceptionDoctors: I,
      prescribingDoctors: K,
      incrementalPatients: M,
      incrementalSales: O,
      totalCost: P,
    });
    setCalculated(true);

  };

  const handleReset = () => {
    setNumDoctors(0);
    setPercentUsingInternet(50);
    setTotalUniqueVisits(0);
    setPercentInteracted(50);
    setPercentChangedPerception(50);
    setPercentLikelyToPrescribe(50);
    setNewPatientsPerDoctor(0);
    setRevenuePerPatient(0);
    setTotalCost(0);
    setCalculationResult(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Veuillez d'abord ajouter des éléments d'activité");
      return;
    }

    const formData = {
      A: numDoctors,
      B: percentUsingInternet,
      D: totalUniqueVisits,
      F: percentInteracted,
      H: percentChangedPerception,
      J: percentLikelyToPrescribe,
      L: newPatientsPerDoctor,
      N: revenuePerPatient,
      P: totalCost,
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_L: items[6]?.id,
      id_N: items[7]?.id,
      id_P: items[8]?.id,
      id_ROI: items[9]?.id,
    };
    try {
      const response = await axiosInstance.post("insertIntoTable12", formData);
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
              <Title level={4}>Paramètres de calcul</Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A - Nombre de médecins */}
                <div>
                  <label
                    htmlFor="numDoctors"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de médecins susceptibles de prescrire (A)
                  </label>
                  <Input
                    id="numDoctors"
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* B - % des médecins utilisant internet */}
                <div>
                  <label
                    htmlFor="percentUsingInternet"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    % des médecins utilisant internet (B)
                  </label>
                  <Input
                    id="percentUsingInternet"
                    type="number"
                    min="0"
                    max="100"
                    value={percentUsingInternet}
                    onChange={(e) =>
                      setPercentUsingInternet(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* D - Nombre total de visites uniques */}
                <div>
                  <label
                    htmlFor="totalUniqueVisits"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre total de visites uniques (D)
                  </label>
                  <Input
                    id="totalUniqueVisits"
                    type="number"
                    min="0"
                    value={totalUniqueVisits}
                    onChange={(e) =>
                      setTotalUniqueVisits(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* F - % des visiteurs ayant interagi */}
                <div>
                  <label
                    htmlFor="percentInteracted"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    % des visiteurs ayant interagi (F)
                  </label>
                  <Input
                    id="percentInteracted"
                    type="number"
                    min="0"
                    max="100"
                    value={percentInteracted}
                    onChange={(e) =>
                      setPercentInteracted(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* H - % des médecins ayant changé de perception */}
                <div>
                  <label
                    htmlFor="percentChangedPerception"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    % des médecins ayant changé de perception (H)
                  </label>
                  <Input
                    id="percentChangedPerception"
                    type="number"
                    min="0"
                    max="100"
                    value={percentChangedPerception}
                    onChange={(e) =>
                      setPercentChangedPerception(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* J - % des médecins susceptibles de prescrire */}
                <div>
                  <label
                    htmlFor="percentLikelyToPrescribe"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    % des médecins susceptibles de prescrire (J)
                  </label>
                  <Input
                    id="percentLikelyToPrescribe"
                    type="number"
                    min="0"
                    max="100"
                    value={percentLikelyToPrescribe}
                    onChange={(e) =>
                      setPercentLikelyToPrescribe(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* L - Nombre moyen de nouveaux patients */}
                <div>
                  <label
                    htmlFor="newPatientsPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de nouveaux patients par médecin (L)
                  </label>
                  <Input
                    id="newPatientsPerDoctor"
                    type="number"
                    min="0"
                    value={newPatientsPerDoctor}
                    onChange={(e) =>
                      setNewPatientsPerDoctor(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* N - Valeur moyenne de revenu */}
                <div>
                  <label
                    htmlFor="revenuePerPatient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valeur moyenne de revenu par patient € (N)
                  </label>
                  <Input
                    id="revenuePerPatient"
                    type="number"
                    min="0"
                    value={revenuePerPatient}
                    onChange={(e) =>
                      setRevenuePerPatient(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* P - Coût total du programme */}
                <div>
                  <label
                    htmlFor="totalCost"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût total du programme e-digital € (P)
                  </label>
                  <Input
                    id="totalCost"
                    type="number"
                    min="0"
                    value={totalCost}
                    onChange={(e) => setTotalCost(Number(e.target.value))}
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
                  disabled={loading || !calculated}
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
                  <Button variant="outline" onClick={handleReset}>
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
                        suffix="€"
                      />
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Card>
                      <Statistic
                        title="Audience Digitale"
                        value={calculationResult.audiencePotential}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Taux d'Efficacité"
                        value={calculationResult.effectivenessRate}
                        precision={2}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Médecins Intéressés"
                        value={calculationResult.interestedDoctors}
                        precision={0}
                      />
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Card>
                      <Statistic
                        title="Perception Changée"
                        value={calculationResult.changedPerceptionDoctors}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Médecins Prescripteurs"
                        value={calculationResult.prescribingDoctors}
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

export default CalculateAct12;
