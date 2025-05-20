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
import axiosInstance, { deleteCookie } from "../../axiosConfig";
import TheHeader from "../Header/Header";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct5 = () => {
  // États du formulaire
  const [A, setA] = useState(0); // Nombre de médecins
  const [B, setB] = useState(0); // Tables rondes par médecin
  const [D, setD] = useState(0); // Médecins par table ronde
  const [F, setF] = useState(0); // % Perception positive
  const [H, setH] = useState(0); // % Prescription
  const [J, setJ] = useState(0); // Patients par médecin
  const [L, setL] = useState(0); // Valeur patient
  const [N, setN] = useState(0); // Coût table ronde
  const [O, setO] = useState(0); // Coûts fixes
  const [year, setYear] = useState(null);

  // États de l'application
  const [activityNumber, setActivityNumber] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/CalculateAct(\d+)/);
    const foundActivityNumber = match ? parseInt(match[1]) : null;
    setActivityNumber(foundActivityNumber);
    document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

    axiosInstance
      .get("getActivityItemsByActivityId/5")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des items :", error);
        message.error("Impossible de charger les données de l'activité.");
      });
  }, [location.pathname]);

  const handleReset = () => {
    setA(0);
    setB(0);
    setD(0);
    setF(0);
    setH(0);
    setJ(0);
    setL(0);
    setN(0);
    setO(0);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
  };

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const isFormValid = () =>
    validateNumeric(A, 0) &&
    validateNumeric(B, 0) &&
    validateNumeric(D, 0) &&
    validateNumeric(F, 0, 100) &&
    validateNumeric(H, 0, 100) &&
    validateNumeric(J, 0) &&
    validateNumeric(L, 0) &&
    validateNumeric(N, 0) &&
    validateNumeric(O, 0) &&
    !!year;

  const generateInterpretation = async (result) => {
    try {
      // Combine result and input fields into a single payload
      const payload = {
        ...result, // roi, doctorContacts, totalRoundTables, etc.
        inputs: {
          numDoctors: A,
          roundTablesPerDoctor: B,
          doctorsPerRoundTable: D,
          percentPositive: F,
          percentPrescribing: H,
          patientsPerDoctor: J,
          valuePerPatient: L,
          costPerRoundTable: N,
          fixedCosts: O,
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
    if (!validateNumeric(A, 0))
      return message.error("Nombre de médecins invalide");
    if (!validateNumeric(B, 0))
      return message.error("Tables rondes par médecin invalide");
    if (!validateNumeric(D, 0))
      return message.error("Médecins par table ronde invalide");
    if (!validateNumeric(F, 0, 100))
      return message.error("% Perception positive invalide");
    if (!validateNumeric(H, 0, 100))
      return message.error("% Prescription invalide");
    if (!validateNumeric(J, 0))
      return message.error("Patients par médecin invalide");
    if (!validateNumeric(L, 0)) return message.error("Valeur patient invalide");
    if (!validateNumeric(N, 0))
      return message.error("Coût table ronde invalide");
    if (!validateNumeric(O, 0)) return message.error("Coûts fixes invalides");
    if (!year) return message.error("Veuillez sélectionner une année");

    setLoading(true);

    try {
      // Calculs intermédiaires
      const C = A * B; // Contacts médecins
      const E = C / D; // Tables rondes totales
      const G = A * (F / 100); // Médecins positifs
      const I = G * (H / 100); // Médecins prescrivant
      const K = I * J; // Patients incrémentaux
      const M = K * L; // Ventes incrémentales
      const P = N * E + O; // Coût total
      const Q = P / C || 0; // Coût par contact (handle division by zero)
      const ROI = P > 0 ? (M / P) * 100 : 0; // ROI en %

      const result = {
        roi: ROI,
        doctorContacts: C,
        totalRoundTables: E,
        doctorsPositive: G,
        doctorsPrescribing: I,
        incrementalPatients: K,
        incrementalSales: M,
        totalCost: P,
        costPerContact: Q,
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
      message.error("Erreur lors du calcul du ROI");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items || items.length < 10) {
      return message.error("Données nécessaires non disponibles");
    }

    if (!activityNumber) {
      return message.error("Numéro d'activité manquant");
    }

    const formData = {
      year,
      A: parseFloat(A),
      B: parseFloat(B),
      D: parseFloat(D),
      F: parseFloat(F),
      H: parseFloat(H),
      J: parseFloat(J),
      L: parseFloat(L),
      N: parseFloat(N),
      O: parseFloat(O),
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
      const response = await axiosInstance.post("insertActivityData", formData);

      if (response.status === 201) {
        message.success("Données enregistrées avec succès");
        deleteCookie("activityNumber");
        navigate("/CreateActivity");
      } else {
        message.error("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      message.error(
        error.response?.data?.message ||
          "Erreur de communication avec le serveur"
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
                    title="Contacts Médecins"
                    value={calculationResult.doctorContacts}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Tables Rondes"
                    value={calculationResult.totalRoundTables}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins Positifs"
                    value={calculationResult.doctorsPositive}
                    precision={0}
                  />
                </Card>
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
                    title="Coût par Contact"
                    value={calculationResult.costPerContact}
                    precision={2}
                    suffix=" MAD"
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
                Tables Rondes - Calcul ROI
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={A}
                    onChange={(e) => setA(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Tables rondes/médecin/an (B)</label>
                  <Input
                    type="number"
                    min="0"
                    value={B}
                    onChange={(e) => setB(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Médecins/table ronde (D)</label>
                  <Input
                    type="number"
                    min="0"
                    value={D}
                    onChange={(e) => setD(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% Perception positive (F)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={F}
                    onChange={(e) => setF(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% Prescription (H)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={H}
                    onChange={(e) => setH(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Patients/médecin (J)</label>
                  <Input
                    type="number"
                    min="0"
                    value={J}
                    onChange={(e) => setJ(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Valeur patient (MAD) (L)</label>
                  <Input
                    type="number"
                    min="0"
                    value={L}
                    onChange={(e) => setL(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût table ronde (MAD) (N)</label>
                  <Input
                    type="number"
                    min="0"
                    value={N}
                    onChange={(e) => setN(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coûts fixes (MAD) (O)</label>
                  <Input
                    type="number"
                    min="0"
                    value={O}
                    onChange={(e) => setO(Number(e.target.value))}
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
                  <CheckCircleOutlined className="mr-2" /> Enregistrer
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} type="button">
                    <ReloadOutlined className="mr-2" /> Réinitialiser
                  </Button>
                  <Link to="/CreateActivity">
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

export default CalculateAct5;
