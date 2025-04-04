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

const CalculateAct6 = () => {
  // États pour stocker les valeurs du formulaire
  const [numDoctors, setNumDoctors] = useState(0); // A - Nombre total de médecins ciblés par le représentant
  const [visitsPerDoctor, setVisitsPerDoctor] = useState(0); // B - Nombre moyen de visites par médecin
  const [percentRemember, setPercentRemember] = useState(0); // E - Pourcentage de médecins se rappelant du message
  const [percentPrescribing, setPercentPrescribing] = useState(0); // G - Pourcentage de médecins prescrivant après visite
  const [patientsPerDoctor, setPatientsPerDoctor] = useState(0); // I - Nombre moyen de nouveaux patients par médecin
  const [valuePerPatient, setValuePerPatient] = useState(0); // K - Valeur du revenu par patient incrémental
  const [costPerRep, setCostPerRep] = useState(0); // M1 - Coût variable par représentant
  const [totalReps, setTotalReps] = useState(0); // M2 - Nombre total de représentants
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
      .get("getActivityItemsByActivityId/6")
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

  // Calculer le ROI
  const calculateRoi = () => {
    // Validation simple
    if (!validateNumeric(numDoctors, 0))
      return alert("Nombre de médecins invalide");
    if (!validateNumeric(visitsPerDoctor, 0))
      return alert("Nombre de visites par médecin invalide");
    if (!validateNumeric(percentRemember, 0, 100))
      return alert("Pourcentage de médecins se rappelant du message invalide");
    if (!validateNumeric(percentPrescribing, 0, 100))
      return alert("Pourcentage de médecins prescrivant invalide");
    if (!validateNumeric(patientsPerDoctor, 0))
      return alert("Nombre de patients par médecin invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return alert("Valeur par patient invalide");
    if (!validateNumeric(costPerRep, 0))
      return alert("Coût par représentant invalide");
    if (!validateNumeric(totalReps, 0))
      return alert("Nombre de représentants invalide");

    // Variables
    const A = numDoctors;
    const B = visitsPerDoctor;
    const E = percentRemember / 100;
    const G = percentPrescribing / 100;
    const I = patientsPerDoctor;
    const K = valuePerPatient;
    const M1 = costPerRep;
    const M2 = totalReps;

    // Calculs
    const C = A * B; // Nombre total de visites (détails)
    const F = A * E; // Nombre de médecins se rappelant du message
    const H = F * G; // Nombre de médecins prescrivant
    const J = H * I; // Nombre de patients incrémentaux
    const L = J * K; // Ventes incrémentales
    const M = M1 * M2; // Coût total du programme

    // Calcul du ROI
    const ROI = M > 0 ? (L / M) * 100 : 0;

    setCalculationResult({
      roi: ROI,
      totalVisits: C,
      doctorsRemembering: F,
      doctorsPrescribing: H,
      incrementalPatients: J,
      incrementalSales: L,
      totalCost: M,
    });
    setCalculated(true); // Set calculated to true after the calculation
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setNumDoctors(0);
    setVisitsPerDoctor(0);
    setPercentRemember(0);
    setPercentPrescribing(0);
    setPatientsPerDoctor(0);
    setValuePerPatient(0);
    setCostPerRep(0);
    setTotalReps(0);
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
      B: visitsPerDoctor,
      E: percentRemember,
      G: percentPrescribing,
      I: patientsPerDoctor,
      K: valuePerPatient,
      M1: costPerRep,
      M2: totalReps,

      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_E: items[2]?.id,
      id_G: items[3]?.id,
      id_I: items[4]?.id,
      id_K: items[5]?.id,
      id_M1: items[6]?.id,
      id_M2: items[7]?.id,
      id_ROI: items[8]?.id,
    };
    try {
      const response = await axiosInstance.post("insertIntoTable6", formData);
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
                Visites médicales
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A - Nombre de médecins */}
                <div>
                  <label
                    htmlFor="numDoctors"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre total de médecins ciblés (A)
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

                {/* B - Visites par médecin */}
                <div>
                  <label
                    htmlFor="visitsPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de visites par médecin (B)
                  </label>
                  <Input
                    id="visitsPerDoctor"
                    type="number"
                    min="0"
                    value={visitsPerDoctor}
                    onChange={(e) => setVisitsPerDoctor(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* E - % médecins rappel */}
                <div>
                  <label
                    htmlFor="percentRemember"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins se rappelant du message (E)
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

                {/* G - % médecins prescripteurs */}
                <div>
                  <label
                    htmlFor="percentPrescribing"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins prescrivant après visite (G)
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

                {/* I - Patients par médecin */}
                <div>
                  <label
                    htmlFor="patientsPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de nouveaux patients par médecin (I)
                  </label>
                  <Input
                    id="patientsPerDoctor"
                    type="number"
                    min="0"
                    value={patientsPerDoctor}
                    onChange={(e) =>
                      setPatientsPerDoctor(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* K - Valeur patient */}
                <div>
                  <label
                    htmlFor="valuePerPatient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valeur du revenu par patient incrémental € (K)
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

                {/* M1 - Coût par représentant */}
                <div>
                  <label
                    htmlFor="costPerRep"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût variable par représentant € (M1)
                  </label>
                  <Input
                    id="costPerRep"
                    type="number"
                    min="0"
                    value={costPerRep}
                    onChange={(e) => setCostPerRep(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* M2 - Nombre de représentants */}
                <div>
                  <label
                    htmlFor="totalReps"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre total de représentants (M2)
                  </label>
                  <Input
                    id="totalReps"
                    type="number"
                    min="0"
                    value={totalReps}
                    onChange={(e) => setTotalReps(Number(e.target.value))}
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
                        title="Total Visites"
                        value={calculationResult.totalVisits}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Médecins se Rappelant"
                        value={calculationResult.doctorsRemembering}
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

export default CalculateAct6;
