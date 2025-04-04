import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  Statistic,
  Alert,
  Spin,
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
import {deleteCookie } from "../../axiosConfig";


const { Header, Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct3 = () => {
  // États pour stocker les valeurs du formulaire
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [emailsPerDoctor, setEmailsPerDoctor] = useState(0);
  const [percentRememberEmail, setPercentRememberEmail] = useState(0);
  const [percentRememberBrand, setPercentRememberBrand] = useState(0);
  const [percentPrescribing, setPercentPrescribing] = useState(0);
  const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [costPerEmail, setCostPerEmail] = useState(0);
  const [fixedCosts, setFixedCosts] = useState(0);
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
      .get("getActivityItemsByActivityId/3")
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
    // Validation des inputs
    const validationChecks = [
      {
        value: totalDoctors,
        message: "Nombre total de médecins invalide",
        minValue: 0,
      },
      {
        value: emailsPerDoctor,
        message: "Nombre d'emails par médecin invalide",
        minValue: 0,
      },
      {
        value: percentRememberEmail,
        message: "Pourcentage des médecins se rappelant de l'email invalide",
        minValue: 0,
        maxValue: 100,
      },
      {
        value: percentRememberBrand,
        message: "Pourcentage des médecins se rappelant de la marque invalide",
        minValue: 0,
        maxValue: 100,
      },
      {
        value: percentPrescribing,
        message: "Pourcentage des médecins prescrivant invalide",
        minValue: 0,
        maxValue: 100,
      },
      {
        value: newPatientsPerDoctor,
        message: "Nombre de nouveaux patients par médecin invalide",
        minValue: 0,
      },
      {
        value: valuePerPatient,
        message: "Valeur par patient invalide",
        minValue: 0,
      },
      { value: costPerEmail, message: "Coût par email invalide", minValue: 0 },
      { value: fixedCosts, message: "Coûts fixes invalides", minValue: 0 },
    ];

    // Validation groupée
    for (const check of validationChecks) {
      if (!validateNumeric(check.value, check.minValue, check.maxValue)) {
        alert(check.message);
        return;
      }
    }

    setLoading(true);
    setCalculated(false);

    try {
      // Conversion des pourcentages

      // Variables
      const A = totalDoctors;
      const B = emailsPerDoctor;
      const C = percentRememberEmail / 100;
      const E = percentRememberBrand / 100;
      const G = percentPrescribing / 100;
      const I = newPatientsPerDoctor;
      const K = valuePerPatient;
      const M = costPerEmail;
      const N = fixedCosts;

      // Calculs
      const D = A * C; // Nombre de médecins ayant reçu et rappelé l'email
      const F = D * E; // Nombre de médecins se rappelant du produit et du message
      const H = F * G; // Nombre de médecins prescrivant à la suite de l'email
      const J = H * I; // Nombre de patients incrémentaux générés par l'email
      const L = J * K; // Ventes incrémentales générées
      const O = M * A * B + N; // Coût total du programme
      const ROI = O > 0 ? (L / O) * 100 : 0; // Retour sur investissement (ROI)

      setCalculationResult({
        roi: ROI,
        doctorsRememberEmail: D,
        doctorsRememberBrand: F,
        doctorsPrescribing: H,
        incrementalPatients: J,
        incrementalSales: L,
        totalCost: O,
      });

      setCalculated(true);
    } catch (error) {
      alert("Erreur lors du calcul du ROI. Veuillez réessayer.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTotalDoctors(0);
    setEmailsPerDoctor(0);
    setPercentRememberEmail(0);
    setPercentRememberBrand(0);
    setPercentPrescribing(0);
    setNewPatientsPerDoctor(0);
    setValuePerPatient(0);
    setCostPerEmail(0);
    setFixedCosts(0);
    setCalculationResult(null);
    setLoading(false);
    setCalculated(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Veuillez d'abord ajouter des éléments d'activité");
      return;
    }

    const formData = {
      A: totalDoctors,
      B: emailsPerDoctor,
      C: percentRememberEmail,
      E: percentRememberBrand,
      G: percentPrescribing,
      I: newPatientsPerDoctor,
      K: valuePerPatient,
      M: costPerEmail,
      N: fixedCosts,

      id_A: items[0].id,
      id_B: items[1].id,
      id_C: items[2].id,
      id_E: items[3].id,
      id_G: items[4].id,
      id_I: items[5].id,
      id_K: items[6].id,
      id_M: items[7].id,
      id_N: items[8].id,
      id_ROI: items[9].id,
    };
    try {
      const response = await axiosInstance.post("insertIntoTable3", formData);
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
          <form type="submit" onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Mailing
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A - Nombre total de médecins */}
                <div>
                  <label
                    htmlFor="totalDoctors"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre total de médecins ciblés par l'email (A)
                  </label>
                  <Input
                    id="totalDoctors"
                    type="number"
                    min="0"
                    value={totalDoctors}
                    onChange={(e) => setTotalDoctors(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* B - Emails par médecin */}
                <div>
                  <label
                    htmlFor="emailsPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen d'emails envoyés par médecin (B)
                  </label>
                  <Input
                    id="emailsPerDoctor"
                    type="number"
                    min="0"
                    value={emailsPerDoctor}
                    onChange={(e) => setEmailsPerDoctor(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* C - % Médecins se rappelant de l'email */}
                <div>
                  <label
                    htmlFor="percentRememberEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins se rappelant avoir reçu l'email (C)
                  </label>
                  <Input
                    id="percentRememberEmail"
                    type="number"
                    min="0"
                    max="100"
                    value={percentRememberEmail}
                    onChange={(e) =>
                      setPercentRememberEmail(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* E - % Médecins se rappelant de la marque */}
                <div>
                  <label
                    htmlFor="percentRememberBrand"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins se rappelant de la marque et du
                    message (E)
                  </label>
                  <Input
                    id="percentRememberBrand"
                    type="number"
                    min="0"
                    max="100"
                    value={percentRememberBrand}
                    onChange={(e) =>
                      setPercentRememberBrand(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* G - % Médecins prescrivant */}
                <div>
                  <label
                    htmlFor="percentPrescribing"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pourcentage de médecins prescrivant Prexige à de nouveaux
                    patients (G)
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

                {/* I - Nouveaux patients par médecin */}
                <div>
                  <label
                    htmlFor="newPatientsPerDoctor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre moyen de nouveaux patients mis sous Prexige par
                    médecin (I)
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

                {/* M - Coût par email */}
                <div>
                  <label
                    htmlFor="costPerEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût variable par email envoyé € (M)
                  </label>
                  <Input
                    id="costPerEmail"
                    type="number"
                    min="0"
                    value={costPerEmail}
                    onChange={(e) => setCostPerEmail(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* N - Coûts fixes */}
                <div>
                  <label
                    htmlFor="fixedCosts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Coût fixe total du programme € (N)
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

                <div className="flex gap-4">
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
                        Inserer les donnees
                      </>
                    )}
                  </Button>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <Card>
                      <Statistic
                        title="Médecins se rappelant de l'email"
                        value={calculationResult.doctorsRememberEmail}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Médecins se rappelant de la marque"
                        value={calculationResult.doctorsRememberBrand}
                        precision={0}
                      />
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <Card>
                      <Statistic
                        title="Médecins prescrivant Prexige"
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

export default CalculateAct3;
