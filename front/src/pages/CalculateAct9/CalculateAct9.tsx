import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  Statistic,
  Alert,
  message,
  Spin,
  DatePicker,
} from "antd";
import {
  CalculatorOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";

import TheHeader from "../Header/Header";
import axiosInstance, { deleteCookie } from "../../axiosConfig";

const { Content } = Layout;
const { Title } = Typography;

const CalculateAct9 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [numInsertions, setNumInsertions] = useState(0);
  const [percentRemember, setPercentRemember] = useState(0);
  const [percentPrescribing, setPercentPrescribing] = useState(0);
  const [patientsPerPrescriber, setPatientsPerPrescriber] = useState(0);
  const [revenuePerPatient, setRevenuePerPatient] = useState(0);
  const [mediaCosts, setMediaCosts] = useState(0);
  const [managementCosts, setManagementCosts] = useState(0);
  const [year, setYear] = useState(null);
  const [activityNumber, setActivityNumber] = useState(null);

  const [calculationResult, setCalculationResult] = useState(null);
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

    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }

    axiosInstance
      .get("getActivityItemsByActivityId/9")
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
    if (!validateNumeric(numDoctors, 0)) return alert("Nombre de médecins invalide");
    if (!validateNumeric(numInsertions, 0)) return alert("Nombre d'insertions invalide");
    if (!validateNumeric(percentRemember, 0, 100)) return alert("Pourcentage de rappel invalide");
    if (!validateNumeric(percentPrescribing, 0, 100)) return alert("Pourcentage de prescription invalide");
    if (!validateNumeric(patientsPerPrescriber, 0)) return alert("Patients par prescripteur invalide");
    if (!validateNumeric(revenuePerPatient, 0)) return alert("Revenu par patient invalide");
    if (!validateNumeric(mediaCosts, 0)) return alert("Coûts média invalides");
    if (!validateNumeric(managementCosts, 0)) return alert("Coûts de gestion invalides");

    const C = percentRemember / 100;
    const E = percentPrescribing / 100;

    const A = numDoctors;
    const G = patientsPerPrescriber;
    const I = revenuePerPatient;
    const K = mediaCosts;
    const L = managementCosts;

    const D = A * C;
    const F = D * E;
    const H = F * G;
    const J = H * I;
    const M = K + L;
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
    setYear(null);
    setCalculationResult(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 9) return alert("Données incomplètes");
    if (!year) return alert("Veuillez sélectionner une année");
    if (!activityNumber) return alert("Aucune activité détectée");

    const formData = {
      year,
      activityId: activityNumber,
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
        message.error("Erreur lors de l'insertion.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      message.error(error.response?.data?.message || "Erreur serveur.");
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
                    <Card><Statistic title="ROI" value={calculationResult.roi} precision={2} suffix="%" /></Card>
                    <Card><Statistic title="Ventes Incrémentales" value={calculationResult.incrementalSales} precision={2} suffix=" MAD" /></Card>
                    <Card><Statistic title="Coût Total" value={calculationResult.totalCost} precision={2} suffix=" MAD" /></Card>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Card><Statistic title="Médecins se Souvenant" value={calculationResult.doctorsRemembering} precision={0} /></Card>
                    <Card><Statistic title="Médecins Prescripteurs" value={calculationResult.doctorsPrescribing} precision={0} /></Card>
                    <Card><Statistic title="Patients Incrémentaux" value={calculationResult.incrementalPatients} precision={0} /></Card>
                  </div>
                  {calculationResult.roi < 0 && (
                    <Alert
                      style={{ marginTop: "16px" }}
                      message="ROI Négatif"
                      description="Le programme génère actuellement un retour négatif. Ajustez les paramètres."
                      type="warning"
                      showIcon
                    />
                  )}
                </div>
              )}
          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>Publicité dans les revues</Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins lisant les publications (A)</label>
                  <Input type="number" min="0" value={numDoctors} onChange={(e) => setNumDoctors(Number(e.target.value))} />
                </div>

                <div>
                  <label>Nombre d'insertions publicitaires prévues (B)</label>
                  <Input type="number" min="0" value={numInsertions} onChange={(e) => setNumInsertions(Number(e.target.value))} />
                </div>

                <div>
                  <label>Pourcentage de médecins se souvenant de la marque (C)</label>
                  <Input type="number" min="0" max="100" value={percentRemember} onChange={(e) => setPercentRemember(Number(e.target.value))} />
                </div>

                <div>
                  <label>Pourcentage de médecins prescrivant après exposition (E)</label>
                  <Input type="number" min="0" max="100" value={percentPrescribing} onChange={(e) => setPercentPrescribing(Number(e.target.value))} />
                </div>

                <div>
                  <label>Nombre moyen de nouveaux patients par prescripteur (G)</label>
                  <Input type="number" min="0" value={patientsPerPrescriber} onChange={(e) => setPatientsPerPrescriber(Number(e.target.value))} />
                </div>

                <div>
                  <label>Revenu par nouveau patient MAD (I)</label>
                  <Input type="number" min="0" value={revenuePerPatient} onChange={(e) => setRevenuePerPatient(Number(e.target.value))} />
                </div>

                <div>
                  <label>Coûts d'achat media MAD (K)</label>
                  <Input type="number" min="0" value={mediaCosts} onChange={(e) => setMediaCosts(Number(e.target.value))} />
                </div>

                <div>
                  <label>Coûts de création et gestion MAD (L)</label>
                  <Input type="number" min="0" value={managementCosts} onChange={(e) => setManagementCosts(Number(e.target.value))} />
                </div>

                <div>
                  <label>Année</label>
                  <DatePicker
                    picker="year"
                    value={year ? dayjs(year, "YYYY") : null}
                    onChange={(date, dateString) => setYear(dateString)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <Divider />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button type="button" onClick={calculateRoi} disabled={loading} style={{ backgroundColor: "#1890ff" }}>
                  {loading ? <Spin size="small" /> : <><CalculatorOutlined /> Calculer ROI</>}
                </Button>

                <Button type="submit" disabled={!calculated} style={{ backgroundColor: "#1890ff" }}>
                  <CheckCircleOutlined /> Insérer les données
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleReset}>
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="/DisplayActivity"><Button variant="secondary">Retour</Button></Link>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </Content>
    </Layout>
  );
};

export default CalculateAct9;
