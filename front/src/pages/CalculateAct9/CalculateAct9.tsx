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

const CalculateAct9 = () => {
  // États pour stocker les valeurs du formulaire
  const [numDoctors, setNumDoctors] = useState(0);
  const [numInsertions, setNumInsertions] = useState(0); // A - Nombre de médecins lisant les publications
   // A - Nombre de médecins lisant les publications
  const [percentRemember, setPercentRemember] = useState(0); // C - Pourcentage de médecins qui se souviennent de la marque
  const [percentPrescribing, setPercentPrescribing] = useState(0); // E - Pourcentage de médecins prescrivant après exposition
  const [patientsPerPrescriber, setPatientsPerPrescriber] = useState(0); // G - Nombre moyen de nouveaux patients par prescripteur
  const [revenuePerPatient, setRevenuePerPatient] = useState(0); // I - Revenu par nouveau patient
  const [mediaCosts, setMediaCosts] = useState(0); // K - Coûts d'achat media
  const [managementCosts, setManagementCosts] = useState(0); // L - Coûts de création et gestion de la campagne

  // État pour stocker les résultats
  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
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
      .get("getActivityItemsByActivityId/9")
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
    if (!validateNumeric(numDoctors, 0))
      return alert("Nombre de médecins invalide");
    if (!validateNumeric(percentRemember, 0, 100))
      return alert(
        "Pourcentage de médecins se souvenant de la marque invalide"
      );
    if (!validateNumeric(percentPrescribing, 0, 100))
      return alert("Pourcentage de médecins prescrivant invalide");
    if (!validateNumeric(patientsPerPrescriber, 0))
      return alert("Nombre de patients par prescripteur invalide");
    if (!validateNumeric(revenuePerPatient, 0))
      return alert("Revenu par patient invalide");
    if (!validateNumeric(mediaCosts, 0))
      return alert("Coûts d'achat media invalides");
    if (!validateNumeric(managementCosts, 0))
      return alert("Coûts de création et gestion invalides");

    // Conversion des pourcentages
    const C = percentRemember / 100;
    const E = percentPrescribing / 100;

    // Variables
    const A = numDoctors;
    const G = patientsPerPrescriber;
    const I = revenuePerPatient;
    const K = mediaCosts;
    const L = managementCosts;

    // Calculs
    const D = A * C; // Nombre de médecins qui se souviennent de la marque et du message
    const F = D * E; // Nombre de médecins qui commencent à prescrire après l'exposition
    const H = F * G; // Nombre de patients incrémentiels gagnés
    const J = H * I; // Ventes incrémentales générées
    const M = K + L; // Coût total de la campagne

    // Calcul du ROI
    const ROI = M > 0 ? (J / M) * 100 : 0;

    setCalculationResult({
      roi: ROI,
      doctorsRemembering: D,
      doctorsPrescribing: F,
      incrementalPatients: H,
      incrementalSales: J,
      totalCost: M,
    });
    setCalculated(true);
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
              <Title level={4} style={{ textAlign: "center" }}>Publicité dans les revues</Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A - Nombre de médecins */}
                <div>
                  <label
                    htmlFor="numDoctors"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de médecins lisant les publications (A)
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
                {/* B - Nombre d'insertions publicitaires prévues */}
                <div>
                  <label
                    htmlFor="numDoctors"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre d'insertions publicitaires prévues 
                  </label>
                  <Input
                    id="numInsertions"
                    type="number"
                    min="0"
                    value={numInsertions}
                    onChange={(e) => setNumInsertions(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* C - % médecins se souvenant */}
                <div>
                  <label
                    htmlFor="percentRemember"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins se souvenant de la marque (C)
                  </label>
                  <Input
                    id="percentRemember"
                    type="number"
                    min="0"
                    max="100"
                    value={percentRemember}
                    onChange={(e) => setPercentRemember(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* E - % médecins prescrivant */}
                <div>
                  <label
                    htmlFor="percentPrescribing"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins prescrivant après exposition (E)
                  </label>
                  <Input
                    id="percentPrescribing"
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescribing}
                    onChange={(e) =>
                      setPercentPrescribing(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* G - Patients par prescripteur */}
                <div>
                  <label
                    htmlFor="patientsPerPrescriber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de nouveaux patients par prescripteur (G)
                  </label>
                  <Input
                    id="patientsPerPrescriber"
                    type="number"
                    min="0"
                    value={patientsPerPrescriber}
                    onChange={(e) =>
                      setPatientsPerPrescriber(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* I - Revenu par patient */}
                <div>
                  <label
                    htmlFor="revenuePerPatient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Revenu par nouveau patient € (I)
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

                <div>
                  <label
                    htmlFor="mediaCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coûts d'achat media € (K)
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

                {/* L - Coûts de création et gestion */}
                <div>
                  <label
                    htmlFor="managementCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coûts de création et gestion de la campagne € (L)
                  </label>
                  <Input
                    id="managementCosts"
                    type="number"
                    min="0"
                    value={managementCosts}
                    onChange={(e) => setManagementCosts(Number(e.target.value))}
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
                        suffix="€"
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

export default CalculateAct9;
