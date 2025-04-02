import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Divider,
  Statistic,
  Alert,
  Layout,
  message,
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
import axiosInstance from "../../axiosConfig";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct2 = () => {
  const [numDoctors, setNumDoctors] = useState(); // A - Nombre de médecins participant à l'étude
  const [patientsPerDoctor, setPatientsPerDoctor] = useState(); // B - Nombre moyen de patients inscrits par médecin
  const [percentContinue, setPercentContinue] = useState(); // D - Pourcentage moyen de patients qui continuent le traitement
  const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(); // F - Nombre de nouveaux patients traités par médecin
  const [valuePerPatient, setValuePerPatient] = useState(); // H - Valeur du revenu par patient incrémental
  const [costPerDoctor, setCostPerDoctor] = useState(); // J - Coût variable par médecin
  const [fixedCosts, setFixedCosts] = useState(); // K - Coût fixe total de l'étude

  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false); // Nouvel état pour suivre l'état du calcul
  const [calculationResult, setCalculationResult] = useState(null);
  const [items, setItems] = useState();

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
      // Réinitialiser l'indicateur après le rechargement
      sessionStorage.removeItem("reloaded");
    }
    axiosInstance
      .get("getActivityItemsByActivityId/2")
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

  const calculateRoi = async () => {
    if (!validateNumeric(numDoctors, 0))
      return alert("Nombre de médecins invalide");
    if (!validateNumeric(patientsPerDoctor, 0))
      return alert("Nombre de patients par médecin invalide");
    if (!validateNumeric(percentContinue, 0, 100))
      return alert("Pourcentage de patients continuant invalide");
    if (!validateNumeric(newPatientsPerDoctor, 0))
      return alert("Nombre de nouveaux patients par médecin invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return alert("Valeur par patient invalide");
    if (!validateNumeric(costPerDoctor, 0))
      return alert("Coût par médecin invalide");
    if (!validateNumeric(fixedCosts, 0)) return alert("Coûts fixes invalides");

    setLoading(true);

    try {
      const A = numDoctors;
      const B = patientsPerDoctor;
      const D = percentContinue;
      const F = newPatientsPerDoctor;
      const H = valuePerPatient;
      const J = costPerDoctor;
      const K = fixedCosts;

      // Calculs
      const C = A * B; // Nombre total de patients inscrits
      const E = C * D; // Nombre de patients poursuivant le traitement après l'étude
      const G = A * (E / A + F); // Patients incrémentaux obtenus grâce à l'étude
      const I = G * H; // Ventes incrémentales
      const L = J * A + K; // Coût total du programme

      // Vérification pour éviter la division par zéro
      const ROI = L > 0 ? (I / L) * 100 : 0;

      setCalculationResult({
        roi: ROI,
        totalPatients: C,
        continuingPatients: E,
        incrementalPatients: G,
        incrementalSales: I,
        totalCost: L,
      });
      setCalculated(true); // Set to true once the calculation is done
    } catch (error) {
      alert("Error calculating ROI. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNumDoctors();
    setPatientsPerDoctor();
    setPercentContinue();
    setNewPatientsPerDoctor();
    setValuePerPatient();
    setCostPerDoctor();
    setFixedCosts();
    setCalculationResult();
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Veuillez d'abord ajouter des éléments d'activité");
      return;
    }

    const formData = {
      A: numDoctors,
      B: patientsPerDoctor,
      D: percentContinue,
      F: newPatientsPerDoctor,
      H: valuePerPatient,
      J: costPerDoctor,
      K: fixedCosts,

      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_K: items[6]?.id,
      id_ROI: items[7]?.id,
    };

    try {
      // Effectuer l'appel API avec axios pour envoyer les données
      const response = await axiosInstance.post("insertIntoTable2", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
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
          {" "}
          <form type="submit" onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Essai clinique{" "}
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A - Nombre de médecins */}
                <div>
                  <label
                    htmlFor="numDoctors"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de médecins participant à l'étude (A)
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

                {/* B - Patients par médecin */}
                <div>
                  <label
                    htmlFor="patientsPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de patients inscrits par médecin (B)
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

                {/* D - % Patients continuant */}
                <div>
                  <label
                    htmlFor="percentContinue"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage moyen de patients qui continuent le traitement
                    (D)
                  </label>
                  <Input
                    id="percentContinue"
                    type="number"
                    min="0"
                    max="100"
                    value={percentContinue}
                    onChange={(e) => setPercentContinue(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* F - Nouveaux patients */}
                <div>
                  <label
                    htmlFor="newPatientsPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de nouveaux patients traités par médecin (F)
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

                {/* H - Valeur patient */}
                <div>
                  <label
                    htmlFor="valuePerPatient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valeur du revenu par patient incrémental € (H)
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

                {/* J - Coût par médecin */}

                <div>
                  <label
                    htmlFor="costPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût variable par médecin € (J)
                  </label>
                  <Input
                    id="costPerDoctor"
                    type="number"
                    min="0"
                    value={costPerDoctor}
                    onChange={(e) => setCostPerDoctor(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* K - Coûts fixes */}
                <div>
                  <label
                    htmlFor="fixedCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût fixe total de l'étude € (K)
                  </label>
                  <Input
                    id="fixedCosts"
                    type="number"
                    min="0"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(Number(e.target.value))}
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
                      Inserer les donnees
                    </>
                  )}
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    <ReloadOutlined className="mr-2" />
                    Réinitialiser
                  </Button>
                  <Link to="../DisplayActivity">
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
                        title="Total Patients Inscrits"
                        value={calculationResult.totalPatients}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Patients Poursuivant"
                        value={calculationResult.continuingPatients}
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

export default CalculateAct2;
