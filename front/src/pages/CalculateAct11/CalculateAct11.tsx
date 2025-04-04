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

const CalculateAct11 = () => {
  // États pour stocker les valeurs du formulaire
  const [numConsumers, setNumConsumers] = useState(0); // A - Nombre de consommateurs exposés à l'activité
  const [percentMemorizing, setPercentMemorizing] = useState(0); // B - % de consommateurs mémorisant le message
  const [percentConsulting, setPercentConsulting] = useState(0); // D - % de consommateurs ayant consulté après l'exposition
  const [percentPrescription, setPercentPrescription] = useState(0); // F - % des consultations aboutissant à une prescription
  const [revenuePerPatient, setRevenuePerPatient] = useState(0); // H - Revenu moyen généré par patient
  const [totalCost, setTotalCost] = useState(0); // J - Coût fixe total de l'activité

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
      .get("getActivityItemsByActivityId/11")
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

  // Calculer le ROI
  const calculateRoi = () => {
    // Validation simple
    if (!validateNumeric(numConsumers, 0))
      return alert("Nombre de consommateurs invalide");
    if (!validateNumeric(percentMemorizing, 0, 100))
      return alert(
        "Pourcentage de consommateurs mémorisant le message invalide"
      );
    if (!validateNumeric(percentConsulting, 0, 100))
      return alert(
        "Pourcentage de consommateurs ayant consulté après l'exposition invalide"
      );
    if (!validateNumeric(percentPrescription, 0, 100))
      return alert(
        "Pourcentage des consultations aboutissant à une prescription invalide"
      );
    if (!validateNumeric(revenuePerPatient, 0))
      return alert("Revenu moyen par patient invalide");
    if (!validateNumeric(totalCost, 0))
      return alert("Coût total de l'activité invalide");

    // Conversion des pourcentages
    const B = percentMemorizing / 100;
    const D = percentConsulting / 100;
    const F = percentPrescription / 100;

    // Variables
    const A = numConsumers;
    const H = revenuePerPatient;
    const J = totalCost;

    // Calculs des métriques
    const C = A * B; // Nombre de consommateurs ayant mémorisé le message
    const E = C * D; // Nombre de consultations générées
    const G = E * F; // Nombre total de patients incrémentaux
    const I = G * H; // Ventes incrémentales générées
    const ROI = J > 0 ? (I / J) * 100 : 0; // Calcul du ROI (en pourcentage)

    setCalculationResult({
      roi: ROI,
      consumersMemorizing: C,
      consultationsGenerated: E,
      incrementalPatients: G,
      incrementalSales: I,
      totalCost: J,
    });

    setCalculated(true);
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setNumConsumers(0);
    setPercentMemorizing(0);
    setPercentConsulting(0);
    setPercentPrescription(0);
    setRevenuePerPatient(0);
    setTotalCost(0);
    setCalculationResult(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Veuillez d'abord ajouter des éléments d'activité");
      return;
    }

    const formData = {
      A: numConsumers,
      B: percentMemorizing,
      D: percentConsulting,
      F: percentPrescription,
      H: revenuePerPatient,
      J: totalCost,

      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_ROI: items[6]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable11", formData);
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
                Campagnes de Communication Grand Public
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A - Nombre de consommateurs exposés */}
                <div>
                  <label
                    htmlFor="numConsumers"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de consommateurs exposés à l'activité (A)
                  </label>
                  <Input
                    id="numConsumers"
                    type="number"
                    min="0"
                    value={numConsumers}
                    onChange={(e) => setNumConsumers(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* B - % de consommateurs mémorisant le message */}
                <div>
                  <label
                    htmlFor="percentMemorizing"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    % de consommateurs mémorisant le message (B)
                  </label>
                  <Input
                    id="percentMemorizing"
                    type="number"
                    min="0"
                    max="100"
                    value={percentMemorizing}
                    onChange={(e) =>
                      setPercentMemorizing(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* D - % de consommateurs ayant consulté après l'exposition */}
                <div>
                  <label
                    htmlFor="percentConsulting"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    % de consommateurs ayant consulté après l'exposition (D)
                  </label>
                  <Input
                    id="percentConsulting"
                    type="number"
                    min="0"
                    max="100"
                    value={percentConsulting}
                    onChange={(e) =>
                      setPercentConsulting(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* F - % des consultations aboutissant à une prescription */}
                <div>
                  <label
                    htmlFor="percentPrescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    % des consultations aboutissant à une prescription (F)
                  </label>
                  <Input
                    id="percentPrescription"
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescription}
                    onChange={(e) =>
                      setPercentPrescription(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* H - Revenu moyen par patient */}
                <div>
                  <label
                    htmlFor="revenuePerPatient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Revenu moyen généré par patient € (H)
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

                {/* J - Coût total de l'activité */}
                <div>
                  <label
                    htmlFor="totalCost"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût fixe total de l'activité € (J)
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
                        title="Consommateurs Mémorisant"
                        value={calculationResult.consumersMemorizing}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Consultations Générées"
                        value={calculationResult.consultationsGenerated}
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

export default CalculateAct11;
