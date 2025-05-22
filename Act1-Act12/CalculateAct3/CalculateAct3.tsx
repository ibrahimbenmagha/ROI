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

const CalculateAct3 = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [emailsPerDoctor, setEmailsPerDoctor] = useState(0);
  const [percentRememberEmail, setPercentRememberEmail] = useState(0);
  const [percentRememberBrand, setPercentRememberBrand] = useState(0);
  const [percentPrescribing, setPercentPrescribing] = useState(0);
  const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [costPerEmail, setCostPerEmail] = useState(0);
  const [fixedCosts, setFixedCosts] = useState(0);
  const [year, setYear] = useState(null);
  const [activityNumber, setActivityNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/CalculateAct(\d+)/);
    const actNum = match ? parseInt(match[1]) : null;
    setActivityNumber(actNum);
    document.cookie = `activityNumber=${actNum}; path=/; max-age=3600;`;

    axiosInstance
      .get("getActivityItemsByActivityId/3")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des items :", error);
        message.error("Impossible de charger les données de l'activité.");
        setError("Erreur lors du chargement des données.");
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
    validateNumeric(totalDoctors, 0) &&
    validateNumeric(emailsPerDoctor, 0) &&
    validateNumeric(percentRememberEmail, 0, 100) &&
    validateNumeric(percentRememberBrand, 0, 100) &&
    validateNumeric(percentPrescribing, 0, 100) &&
    validateNumeric(newPatientsPerDoctor, 0) &&
    validateNumeric(valuePerPatient, 0) &&
    validateNumeric(costPerEmail, 0) &&
    validateNumeric(fixedCosts, 0) &&
    !!year;

  const generateInterpretation = async (result) => {
    try {
      const response = await axiosInstance.post("/generate-interpretation", {
        roi: result.roi,
        doctorsRememberEmail: result.doctors_remembering_email,
        doctorsRememberBrand: result.doctors_remembering_brand,
        doctorsPrescribing: result.doctors_prescribing,
        incrementalPatients: result.incremental_patients,
        incrementalSales: result.incremental_sales,
        totalCost: result.total_cost,
        totalDoctors,
        emailsPerDoctor,
        percentRememberEmail,
        percentRememberBrand,
        percentPrescribing,
        newPatientsPerDoctor,
        valuePerPatient,
        costPerEmail,
        fixedCosts,
      });

      return response.data.interpretation;
    } catch (error) {
      console.error(
        "Erreur lors de la génération de l'interprétation :",
        error
      );
      return null; // Return null to indicate failure
    }
  };

  const calculateRoi = async () => {
    if (!validateNumeric(totalDoctors, 0))
      return message.error("Nombre total de médecins invalide");
    if (!validateNumeric(emailsPerDoctor, 0))
      return message.error("Nombre d'emails par médecin invalide");
    if (!validateNumeric(percentRememberEmail, 0, 100))
      return message.error("Pourcentage rappel email invalide");
    if (!validateNumeric(percentRememberBrand, 0, 100))
      return message.error("Pourcentage rappel marque invalide");
    if (!validateNumeric(percentPrescribing, 0, 100))
      return message.error("Pourcentage prescrivant invalide");
    if (!validateNumeric(newPatientsPerDoctor, 0))
      return message.error("Nouveaux patients invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return message.error("Valeur par patient invalide");
    if (!validateNumeric(costPerEmail, 0))
      return message.error("Coût par email invalide");
    if (!validateNumeric(fixedCosts, 0))
      return message.error("Coût fixe invalide");
    if (!year)
      return message.error("Année d'activité manquante.");
    if (!activityNumber)
      return message.error("Le numéro d’activité est manquant.");
    if (!items || items.length < 9)
      return message.error("Les données des items d'activité ne sont pas disponibles.");

    setLoading(true);
    setError(null);

    try {
      const formData = {
        activityId: activityNumber,
        year,
        A: totalDoctors,
        B: emailsPerDoctor,
        C: percentRememberEmail,
        E: percentRememberBrand,
        G: percentPrescribing,
        I: newPatientsPerDoctor,
        K: valuePerPatient,
        M: costPerEmail,
        N: fixedCosts,
        id_A: items[0]?.id,
        id_B: items[1]?.id,
        id_C: items[2]?.id,
        id_E: items[3]?.id,
        id_G: items[4]?.id,
        id_I: items[5]?.id,
        id_K: items[6]?.id,
        id_M: items[7]?.id,
        id_N: items[8]?.id,
      };

      const response = await axiosInstance.post("calculateRoi", formData);

      const result = {
        roi: response.data.ROI * 100, // Convert to percentage for consistency
        doctors_remembering_email: response.data.results.doctors_remembering_email,
        doctors_remembering_brand: response.data.results.doctors_remembering_brand,
        doctors_prescribing: response.data.results.doctors_prescribing,
        incremental_patients: response.data.results.incremental_patients,
        incremental_sales: response.data.results.incremental_sales,
        total_cost: response.data.results.total_cost,
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
      setError(error.response?.data?.message || "Erreur lors du calcul du ROI. Veuillez réessayer.");
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
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 10) {
      return message.error(
        "Les données nécessaires ne sont pas encore disponibles."
      );
    }
    if (!year) {
      return message.error("Veuillez sélectionner une année.");
    }
    if (!activityNumber) {
      return message.error("Aucune activité détectée.");
    }

    const formData = {
      year,
      activityId: activityNumber,
      A: totalDoctors,
      B: emailsPerDoctor,
      C: percentRememberEmail,
      E: percentRememberBrand,
      G: percentPrescribing,
      I: newPatientsPerDoctor,
      K: valuePerPatient,
      M: costPerEmail,
      N: fixedCosts,
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_C: items[2]?.id,
      id_E: items[3]?.id,
      id_G: items[4]?.id,
      id_I: items[5]?.id,
      id_K: items[6]?.id,
      id_M: items[7]?.id,
      id_N: items[8]?.id,
      id_ROI: items[9]?.id,
    };

    try {
      const response = await axiosInstance.post("insertActivityData", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        message.error("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.error("Erreur lors de l’envoi du formulaire :", error);
      message.error(
        error.response?.data?.message ||
          "Erreur lors de la communication avec le serveur."
      );
    }
  };

  if (error) {
    return (
      <Layout className="min-h-screen">
        <TheHeader />
        <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
          <Alert
            message="Erreur"
            description={error}
            type="error"
            showIcon
            style={{ maxWidth: 800, margin: "0 auto" }}
          />
        </Content>
      </Layout>
    );
  }

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
                    value={calculationResult.incremental_sales}
                    precision={2}
                    suffix=" MAD"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Coût Total"
                    value={calculationResult.total_cost}
                    precision={2}
                    suffix=" MAD"
                  />
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Card>
                  <Statistic
                    title="Médecins se rappelant l'email"
                    value={calculationResult.doctors_remembering_email}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins se souvenant de la marque"
                    value={calculationResult.doctors_remembering_brand}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins prescrivant"
                    value={calculationResult.doctors_prescribing}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Patients incrémentaux"
                    value={calculationResult.incremental_patients}
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
                Mailing
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre total de médecins ciblés (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={totalDoctors}
                    onChange={(e) => setTotalDoctors(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Nombre moyen d'emails envoyés par médecin (B)</label>
                  <Input
                    type="number"
                    min="0"
                    value={emailsPerDoctor}
                    onChange={(e) => setEmailsPerDoctor(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>
                    % de médecins se rappelant avoir reçu l'email (C)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentRememberEmail}
                    onChange={(e) =>
                      setPercentRememberEmail(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>% se souvenant de la marque (E)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentRememberBrand}
                    onChange={(e) =>
                      setPercentRememberBrand(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>% de médecins prescrivant le produit (G)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescribing}
                    onChange={(e) =>
                      setPercentPrescribing(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>
                    Nombre moyen de nouveaux patients prescrits par médecin (I)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newPatientsPerDoctor}
                    onChange={(e) =>
                      setNewPatientsPerDoctor(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>Valeur moyenne par patient (K) (MAD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût par email (M) (MAD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={costPerEmail}
                    onChange={(e) => setCostPerEmail(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coûts fixes (N) (MAD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(Number(e.target.value))}
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
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <ReloadOutlined className="mr-2" /> Réinitialiser
                  </Button>
                  <Link to="../DisplayActivity">
                    <Button variant="secondary">Retour</Button>
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

export default CalculateAct3;