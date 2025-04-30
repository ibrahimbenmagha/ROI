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
  const [items, setItems] = useState([]);

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
      .catch((error) => console.error("Erreur items:", error));
  }, []);

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const calculateRoi = () => {
    const checks = [
      [totalDoctors, 0, null, "Nombre total de médecins invalide"],
      [emailsPerDoctor, 0, null, "Nombre d'emails par médecin invalide"],
      [percentRememberEmail, 0, 100, "Pourcentage rappel email invalide"],
      [percentRememberBrand, 0, 100, "Pourcentage rappel marque invalide"],
      [percentPrescribing, 0, 100, "Pourcentage prescrivant invalide"],
      [newPatientsPerDoctor, 0, null, "Nouveaux patients invalide"],
      [valuePerPatient, 0, null, "Valeur par patient invalide"],
      [costPerEmail, 0, null, "Coût par email invalide"],
      [fixedCosts, 0, null, "Coût fixe invalide"],
    ];
    for (const [val, min, max, msg] of checks) {
      if (!validateNumeric(val, min, max)) return alert(msg);
    }

    setLoading(true);
    try {
      const A = totalDoctors;
      const B = emailsPerDoctor;
      const C = percentRememberEmail / 100;
      const E = percentRememberBrand / 100;
      const G = percentPrescribing / 100;
      const I = newPatientsPerDoctor;
      const K = valuePerPatient;
      const M = costPerEmail;
      const N = fixedCosts;

      const D = A * C;
      const F = D * E;
      const H = F * G;
      const J = H * I;
      const L = J * K;
      const O = M * A * B + N;
      const ROI = O > 0 ? (L / O) * 100 : 0;

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
      alert("Erreur lors du calcul.");
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
    setYear(null);
    setCalculationResult(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 10) return alert("Données incomplètes");
    if (!year) return alert("Veuillez sélectionner une année");
    if (!activityNumber) return alert("Aucune activité détectée");

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
      const response = await axiosInstance.post("insertIntoTable3", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        alert("Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert(error.response?.data?.message || "Erreur serveur.");
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
                      color: calculationResult.roi >= 1 ? "#3f8600" : "#cf1322",
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
                    value={totalDoctors}
                    onChange={(e) => setTotalDoctors(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Nombre moyen d'emails envoyés par médecin (B)</label>
                  <Input
                    type="number"
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
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Coût par email (M) (MAD)</label>
                  <Input
                    type="number"
                    value={costPerEmail}
                    onChange={(e) => setCostPerEmail(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Coûts fixes (N) (MAD)</label>
                  <Input
                    type="number"
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
                      <CalculatorOutlined /> Calculer ROI
                    </>
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={loading || !calculated}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CheckCircleOutlined /> Insérer les données
                </Button>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="../CreateActivity">
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
