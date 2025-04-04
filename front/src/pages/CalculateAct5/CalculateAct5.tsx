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
import axiosInstance from "../../axiosConfig";
import {deleteCookie } from "../../axiosConfig";
import TheHeader from "../Header/Header";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct5 = () => {
  // États pour stocker les valeurs du formulaire
  const [numDoctors, setNumDoctors] = useState(0); // A - Nombre de médecins participant aux tables rondes
  const [roundTablesPerDoctor, setRoundTablesPerDoctor] = useState(0); // B - Nombre moyen de tables rondes assistées par médecin par an
  const [doctorsPerRoundTable, setDoctorsPerRoundTable] = useState(0); // D - Nombre moyen de médecins par table ronde
  const [percentPositiveChange, setPercentPositiveChange] = useState(0); // F - Pourcentage de médecins ayant changé positivement leur perception
  const [percentPrescribing, setPercentPrescribing] = useState(0); // H - Pourcentage de médecins influencés qui vont prescrire
  const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(0); // J - Nombre moyen de nouveaux patients mis sous traitement par médecin
  const [valuePerPatient, setValuePerPatient] = useState(0); // L - Valeur du revenu par patient incrémental
  const [costPerRoundTable, setCostPerRoundTable] = useState(0); // N - Coût variable par table ronde
  const [fixedCosts, setFixedCosts] = useState(0); // O - Coût fixe total du programme
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
      .get("getActivityItemsByActivityId/5")
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
    if (!validateNumeric(numDoctors, 0))
      return alert("Nombre de médecins invalide");
    if (!validateNumeric(roundTablesPerDoctor, 0))
      return alert("Nombre de tables rondes par médecin invalide");
    if (!validateNumeric(doctorsPerRoundTable, 0))
      return alert("Nombre de médecins par table ronde invalide");
    if (!validateNumeric(percentPositiveChange, 0, 100))
      return alert(
        "Pourcentage de médecins ayant changé positivement leur perception invalide"
      );
    if (!validateNumeric(percentPrescribing, 0, 100))
      return alert("Pourcentage de médecins qui prescrivent invalide");
    if (!validateNumeric(newPatientsPerDoctor, 0))
      return alert("Nombre de nouveaux patients par médecin invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return alert("Valeur par patient invalide");
    if (!validateNumeric(costPerRoundTable, 0))
      return alert("Coût par table ronde invalide");
    if (!validateNumeric(fixedCosts, 0)) return alert("Coûts fixes invalides");

    // Variables
    const A = numDoctors;
    const B = roundTablesPerDoctor;
    const D = doctorsPerRoundTable;
    const F = percentPositiveChange / 100;
    const H = percentPrescribing / 100;
    const J = newPatientsPerDoctor;
    const L = valuePerPatient;
    const N = costPerRoundTable;
    const O = fixedCosts;

    // Calculs
    const C = A * B; // Nombre total de contacts médecins
    const E = C / D; // Nombre total de tables rondes requises
    const G = A * F; // Nombre de médecins ayant changé positivement leur perception
    const I = G * H; // Nombre de médecins prescrivant
    const K = I * J; // Nombre de patients incrémentaux gagnés
    const M = K * L; // Ventes incrémentales
    const P = N * E + O; // Coût total du programme
    const Q = P / C; // Coût par contact médecin

    // Vérification pour éviter la division par zéro
    const ROI = P > 0 ? (M / P) * 100 : 0;

    setCalculationResult({
      roi: ROI,
      doctorContacts: C,
      totalRoundTables: E,
      doctorsPositive: G,
      doctorsPrescribing: I,
      incrementalPatients: K,
      incrementalSales: M,
      totalCost: P,
      costPerContact: Q,
    });
    setCalculated(true); // Set calculated to true after the calculation
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setNumDoctors(0);
    setRoundTablesPerDoctor(0);
    setDoctorsPerRoundTable(0);
    setPercentPositiveChange(0);
    setPercentPrescribing(0);
    setNewPatientsPerDoctor(0);
    setValuePerPatient(0);
    setCostPerRoundTable(0);
    setFixedCosts(0);
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
      B: roundTablesPerDoctor,
      D: doctorsPerRoundTable,
      F: percentPositiveChange,
      H: percentPrescribing,
      J: newPatientsPerDoctor,
      L: valuePerPatient,
      N: costPerRoundTable,
      O: fixedCosts,

      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_L: items[6]?.id,
      id_N: items[7]?.id,
      id_O: items[8]?.id,
      id_ROI: items[9]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable5", formData);
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
                Tables Rondes
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A - Nombre de médecins */}
                <div>
                  <label
                    htmlFor="numDoctors"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de médecins participant aux tables rondes (A)
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

                {/* B - Tables rondes par médecin */}
                <div>
                  <label
                    htmlFor="roundTablesPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de tables rondes assistées par médecin par an
                    (B)
                  </label>
                  <Input
                    id="roundTablesPerDoctor"
                    type="number"
                    min="0"
                    value={roundTablesPerDoctor}
                    onChange={(e) =>
                      setRoundTablesPerDoctor(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* D - Médecins par table ronde */}
                <div>
                  <label
                    htmlFor="doctorsPerRoundTable"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de médecins par table ronde (D)
                  </label>
                  <Input
                    id="doctorsPerRoundTable"
                    type="number"
                    min="0"
                    value={doctorsPerRoundTable}
                    onChange={(e) =>
                      setDoctorsPerRoundTable(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* F - % Médecins perception positive */}
                <div>
                  <label
                    htmlFor="percentPositiveChange"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins ayant changé positivement leur
                    perception (F)
                  </label>
                  <Input
                    id="percentPositiveChange"
                    type="number"
                    min="0"
                    max="100"
                    value={percentPositiveChange}
                    onChange={(e) =>
                      setPercentPositiveChange(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* H - % Médecins prescripteurs */}
                <div>
                  <label
                    htmlFor="percentPrescribing"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins influencés qui vont prescrire (H)
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

                {/* J - Nouveaux patients par médecin */}
                <div>
                  <label
                    htmlFor="newPatientsPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de nouveaux patients mis sous traitement par
                    médecin (J)
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

                {/* L - Valeur patient */}
                <div>
                  <label
                    htmlFor="valuePerPatient"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valeur du revenu par patient incrémental € (L)
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

                {/* N - Coût par table ronde */}
                <div>
                  <label
                    htmlFor="costPerRoundTable"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût variable par table ronde € (N)
                  </label>
                  <Input
                    id="costPerRoundTable"
                    type="number"
                    min="0"
                    value={costPerRoundTable}
                    onChange={(e) =>
                      setCostPerRoundTable(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* O - Coûts fixes */}
                <div>
                  <label
                    htmlFor="fixedCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût fixe total du programme € (O)
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
                        title="Total Contacts Médecins"
                        value={calculationResult.doctorContacts}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Nombre Tables Rondes"
                        value={calculationResult.totalRoundTables}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Médecins Perception Positive"
                        value={calculationResult.doctorsPositive}
                        precision={0}
                      />
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Card>
                      <Statistic
                        title="Médecins Prescrivant"
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
                    <Card>
                      <Statistic
                        title="Coût Par Contact Médecin"
                        value={calculationResult.costPerContact}
                        precision={2}
                        suffix="€"
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

export default CalculateAct5;
