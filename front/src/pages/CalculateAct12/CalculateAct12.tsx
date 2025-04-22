// import React, { useState, useEffect } from "react";
// import {
//   Layout,
//   Typography,
//   Card,
//   Divider,
//   Statistic,
//   Alert,
//   message,
//   Spin,
//   DatePicker,
// } from "antd";
// import {
//   CalculatorOutlined,
//   ReloadOutlined,
//   CheckCircleOutlined,
// } from "@ant-design/icons";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import dayjs from "dayjs";


// import TheHeader from "../Header/Header";
// import axiosInstance, { deleteCookie } from "../../axiosConfig";

// const { Content } = Layout;
// const { Title } = Typography;

// const CalculateAct12 = () => {
//   const [numDoctors, setNumDoctors] = useState(0);
//   const [percentUsingInternet, setPercentUsingInternet] = useState(50);
//   const [totalUniqueVisits, setTotalUniqueVisits] = useState(0);
//   const [percentInteracted, setPercentInteracted] = useState(50);
//   const [percentChangedPerception, setPercentChangedPerception] = useState(50);
//   const [percentLikelyToPrescribe, setPercentLikelyToPrescribe] = useState(50);
//   const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(0);
//   const [revenuePerPatient, setRevenuePerPatient] = useState(0);
//   const [totalCost, setTotalCost] = useState(0);
//   const [year, setYear] = useState(null);


//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false);
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [items, setItems] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const match = location.pathname.match(/CalculateAct(\d+)/);
//     const activityNumber = match ? parseInt(match[1]) : null;
//     document.cookie = `activityNumber=${activityNumber}; path=/; max-age=3600;`;

//     if (!sessionStorage.getItem("reloaded")) {
//       sessionStorage.setItem("reloaded", "true");
//       window.location.reload();
//     } else {
//       sessionStorage.removeItem("reloaded");
//     }

//     axiosInstance
//       .get("getActivityItemsByActivityId/12")
//       .then((res) => setItems(res.data))
//       .catch((err) => console.error("Error fetching activities:", err));
//   }, []);

//   const validateNumeric = (value, min, max = null) => {
//     const num = Number(value);
//     if (isNaN(num)) return false;
//     if (num < min) return false;
//     if (max !== null && num > max) return false;
//     return true;
//   };

//   const calculateRoi = () => {
//     if (!validateNumeric(numDoctors, 0))
//       return alert("Nombre de médecins invalide");
//     if (!validateNumeric(percentUsingInternet, 0, 100))
//       return alert("Pourcentage internet invalide");
//     if (!validateNumeric(totalUniqueVisits, 0))
//       return alert("Nombre de visites invalide");
//     if (!validateNumeric(percentInteracted, 0, 100))
//       return alert("Interaction invalide");
//     if (!validateNumeric(percentChangedPerception, 0, 100))
//       return alert("Perception invalide");
//     if (!validateNumeric(percentLikelyToPrescribe, 0, 100))
//       return alert("Prescription invalide");
//     if (!validateNumeric(newPatientsPerDoctor, 0))
//       return alert("Nouveaux patients invalide");
//     if (!validateNumeric(revenuePerPatient, 0))
//       return alert("Revenu patient invalide");
//     if (!validateNumeric(totalCost, 0)) return alert("Coût total invalide");

//     const A = numDoctors;
//     const B = percentUsingInternet / 100;
//     const D = totalUniqueVisits;
//     const F = percentInteracted / 100;
//     const H = percentChangedPerception / 100;
//     const J = percentLikelyToPrescribe / 100;
//     const L = newPatientsPerDoctor;
//     const N = revenuePerPatient;
//     const P = totalCost;

//     const C = A * B;
//     const E = C > 0 ? D / C : 0;
//     const G = D * F;
//     const I = G * H;
//     const K = I * J;
//     const M = K * L;
//     const O = M * N;
//     const ROI = P > 0 ? (O / P) * 100 : 0;

//     setCalculationResult({
//       roi: ROI,
//       audiencePotential: C,
//       effectivenessRate: E,
//       interestedDoctors: G,
//       changedPerceptionDoctors: I,
//       prescribingDoctors: K,
//       incrementalPatients: M,
//       incrementalSales: O,
//       totalCost: P,
//     });

//     setCalculated(true);
//   };

//   const handleReset = () => {
//     setNumDoctors(0);
//     setPercentUsingInternet(50);
//     setTotalUniqueVisits(0);
//     setPercentInteracted(50);
//     setPercentChangedPerception(50);
//     setPercentLikelyToPrescribe(50);
//     setNewPatientsPerDoctor(0);
//     setRevenuePerPatient(0);
//     setTotalCost(0);
//     setCalculationResult(null);
//     setYear(null);
//     setCalculated(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (items.length === 0)
//       return alert("Veuillez ajouter des éléments d'activité");

//     const formData = {
//       A: numDoctors,
//       B: percentUsingInternet,
//       D: totalUniqueVisits,
//       F: percentInteracted,
//       H: percentChangedPerception,
//       J: percentLikelyToPrescribe,
//       L: newPatientsPerDoctor,
//       N: revenuePerPatient,
//       P: totalCost,
//       id_A: items[0]?.id,
//       id_B: items[1]?.id,
//       id_D: items[2]?.id,
//       id_F: items[3]?.id,
//       id_H: items[4]?.id,
//       id_J: items[5]?.id,
//       id_L: items[6]?.id,
//       id_N: items[7]?.id,
//       id_P: items[8]?.id,
//       id_ROI: items[9]?.id,
//     };

//     try {
//       const response = await axiosInstance.post("insertIntoTable12", formData);
//       if (response.status === 201) {
//         message.success("Les données ont été insérées avec succès.");
//         deleteCookie("activityNumber");
//         deleteCookie("activityId");
//         navigate("/DisplayActivity");
//       } else {
//         alert("Erreur lors de l'insertion.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Erreur serveur.");
//     }
//   };

//   return (
//     <Layout className="min-h-screen">
//       <TheHeader />
//       <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
//         <div style={{ maxWidth: 800, margin: "0 auto" }}>
//         {calculationResult && (
//                 <div className="mt-8">
//                   <Divider>Résultats</Divider>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <Card>
//                       <Statistic
//                         title="ROI"
//                         value={calculationResult.roi}
//                         precision={2}
//                         suffix="%"
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Ventes Incrémentales"
//                         value={calculationResult.incrementalSales}
//                         precision={2}
//                         suffix="MAD"
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Coût Total"
//                         value={calculationResult.totalCost}
//                         precision={2}
//                         suffix="MAD"
//                       />
//                     </Card>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//                     <Card>
//                       <Statistic
//                         title="Audience Digitale"
//                         value={calculationResult.audiencePotential}
//                         precision={0}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Taux d'Efficacité"
//                         value={calculationResult.effectivenessRate}
//                         precision={2}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Médecins Intéressés"
//                         value={calculationResult.interestedDoctors}
//                         precision={0}
//                       />
//                     </Card>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//                     <Card>
//                       <Statistic
//                         title="Perception Changée"
//                         value={calculationResult.changedPerceptionDoctors}
//                         precision={0}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Médecins Prescripteurs"
//                         value={calculationResult.prescribingDoctors}
//                         precision={0}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Patients Incrémentaux"
//                         value={calculationResult.incrementalPatients}
//                         precision={0}
//                       />
//                     </Card>
//                   </div>

//                   {calculationResult.roi < 0 && (
//                     <Alert
//                       style={{ marginTop: "16px" }}
//                       message="ROI Négatif"
//                       description="Le programme génère actuellement un ROI négatif. Veuillez réajuster vos paramètres."
//                       type="warning"
//                       showIcon
//                     />
//                   )}
//                 </div>
//               )}
//           <form onSubmit={handleSubmit}>
//             <Card>
//               <Title level={4} style={{ textAlign: "center" }}>
//                 Programme e-Digital – Calcul ROI
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label>
//                     Nombre de médecins susceptibles de prescrire (A)
//                   </label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={numDoctors}
//                     onChange={(e) => setNumDoctors(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>% des médecins utilisant internet (B)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentUsingInternet}
//                     onChange={(e) =>
//                       setPercentUsingInternet(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>Nombre total de visites uniques (D)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={totalUniqueVisits}
//                     onChange={(e) =>
//                       setTotalUniqueVisits(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>% des visiteurs ayant interagi (F)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentInteracted}
//                     onChange={(e) =>
//                       setPercentInteracted(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>% ayant changé de perception (H)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentChangedPerception}
//                     onChange={(e) =>
//                       setPercentChangedPerception(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>% susceptibles de prescrire (J)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentLikelyToPrescribe}
//                     onChange={(e) =>
//                       setPercentLikelyToPrescribe(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>Nombre moyen de nouveaux patients (L)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={newPatientsPerDoctor}
//                     onChange={(e) =>
//                       setNewPatientsPerDoctor(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>Valeur moyenne de revenu par patient MAD (N)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={revenuePerPatient}
//                     onChange={(e) =>
//                       setRevenuePerPatient(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>Coût total du programme e-digital MAD (P)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={totalCost}
//                     onChange={(e) => setTotalCost(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>Année</label>
//                   <DatePicker
//                     picker="year"
//                     onChange={(date, dateString) => setYear(dateString)}
//                     value={year ? dayjs(year, "YYYY") : null}
//                     style={{ width: "100%" }}
//                   />
//                 </div>
//               </div>

//               <Divider />

//               <div className="flex flex-col sm:flex-row justify-between gap-4">
//                 <Button
//                   onClick={calculateRoi}
//                   type="button"
//                   disabled={loading}
//                   style={{ backgroundColor: "#1890ff" }}
//                 >
//                   {loading ? (
//                     <Spin size="small" />
//                   ) : (
//                     <>
//                       <CalculatorOutlined /> Calculer ROI
//                     </>
//                   )}
//                 </Button>

//                 <Button
//                   type="submit"
//                   disabled={!calculated}
//                   style={{ backgroundColor: "#1890ff" }}
//                 >
//                   <CheckCircleOutlined /> Insérer les données
//                 </Button>

//                 <div className="flex gap-4">
//                   <Button variant="outline" onClick={handleReset}>
//                     <ReloadOutlined /> Réinitialiser
//                   </Button>
//                   <Link to="/DisplayActivity">
//                     <Button variant="secondary">Retour</Button>
//                   </Link>
//                 </div>
//               </div>


//             </Card>
//           </form>
//         </div>
//       </Content>
//     </Layout>
//   );
// };

// export default CalculateAct12;


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

const CalculateAct12 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [percentUsingInternet, setPercentUsingInternet] = useState(50);
  const [totalUniqueVisits, setTotalUniqueVisits] = useState(0);
  const [percentInteracted, setPercentInteracted] = useState(50);
  const [percentChangedPerception, setPercentChangedPerception] = useState(50);
  const [percentLikelyToPrescribe, setPercentLikelyToPrescribe] = useState(50);
  const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(0);
  const [revenuePerPatient, setRevenuePerPatient] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [year, setYear] = useState(null);

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
      .get("getActivityItemsByActivityId/12")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching activities:", err));
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
    if (!validateNumeric(percentUsingInternet, 0, 100)) return alert("Pourcentage internet invalide");
    if (!validateNumeric(totalUniqueVisits, 0)) return alert("Nombre de visites invalide");
    if (!validateNumeric(percentInteracted, 0, 100)) return alert("Interaction invalide");
    if (!validateNumeric(percentChangedPerception, 0, 100)) return alert("Perception invalide");
    if (!validateNumeric(percentLikelyToPrescribe, 0, 100)) return alert("Prescription invalide");
    if (!validateNumeric(newPatientsPerDoctor, 0)) return alert("Nouveaux patients invalide");
    if (!validateNumeric(revenuePerPatient, 0)) return alert("Revenu patient invalide");
    if (!validateNumeric(totalCost, 0)) return alert("Coût total invalide");

    const A = numDoctors;
    const B = percentUsingInternet / 100;
    const D = totalUniqueVisits;
    const F = percentInteracted / 100;
    const H = percentChangedPerception / 100;
    const J = percentLikelyToPrescribe / 100;
    const L = newPatientsPerDoctor;
    const N = revenuePerPatient;
    const P = totalCost;

    const C = A * B;
    const E = C > 0 ? D / C : 0;
    const G = D * F;
    const I = G * H;
    const K = I * J;
    const M = K * L;
    const O = M * N;
    const ROI = P > 0 ? (O / P) * 100 : 0;

    setCalculationResult({
      roi: ROI,
      audiencePotential: C,
      effectivenessRate: E,
      interestedDoctors: G,
      changedPerceptionDoctors: I,
      prescribingDoctors: K,
      incrementalPatients: M,
      incrementalSales: O,
      totalCost: P,
    });

    setCalculated(true);
  };

  const handleReset = () => {
    setNumDoctors(0);
    setPercentUsingInternet(50);
    setTotalUniqueVisits(0);
    setPercentInteracted(50);
    setPercentChangedPerception(50);
    setPercentLikelyToPrescribe(50);
    setNewPatientsPerDoctor(0);
    setRevenuePerPatient(0);
    setTotalCost(0);
    setYear(null);
    setCalculationResult(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!year) return alert("Veuillez sélectionner une année.");
    if (items.length === 0) return alert("Veuillez ajouter des éléments d'activité");

    const formData = {
      A: numDoctors,
      B: percentUsingInternet,
      D: totalUniqueVisits,
      F: percentInteracted,
      H: percentChangedPerception,
      J: percentLikelyToPrescribe,
      L: newPatientsPerDoctor,
      N: revenuePerPatient,
      P: totalCost,
      year,
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_L: items[6]?.id,
      id_N: items[7]?.id,
      id_P: items[8]?.id,
      id_ROI: items[9]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable12", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        alert("Erreur lors de l'insertion.");
      }
    } catch (error) {
      console.error(error);
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
                  <Statistic title="ROI" value={calculationResult.roi} precision={2} suffix="%" />
                </Card>
                <Card>
                  <Statistic title="Ventes Incrémentales" value={calculationResult.incrementalSales} precision={2} suffix="MAD" />
                </Card>
                <Card>
                  <Statistic title="Coût Total" value={calculationResult.totalCost} precision={2} suffix="MAD" />
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Card>
                  <Statistic title="Audience Digitale" value={calculationResult.audiencePotential} precision={0} />
                </Card>
                <Card>
                  <Statistic title="Taux d'Efficacité" value={calculationResult.effectivenessRate} precision={2} />
                </Card>
                <Card>
                  <Statistic title="Médecins Intéressés" value={calculationResult.interestedDoctors} precision={0} />
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Card>
                  <Statistic title="Perception Changée" value={calculationResult.changedPerceptionDoctors} precision={0} />
                </Card>
                <Card>
                  <Statistic title="Médecins Prescripteurs" value={calculationResult.prescribingDoctors} precision={0} />
                </Card>
                <Card>
                  <Statistic title="Patients Incrémentaux" value={calculationResult.incrementalPatients} precision={0} />
                </Card>
              </div>

              {calculationResult.roi < 0 && (
                <Alert
                  style={{ marginTop: "16px" }}
                  message="ROI Négatif"
                  description="Le programme génère actuellement un ROI négatif. Veuillez réajuster vos paramètres."
                  type="warning"
                  showIcon
                />
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Programme e-Digital – Calcul ROI
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins susceptibles de prescrire (A)</label>
                  <Input type="number" min="0" value={numDoctors} onChange={(e) => setNumDoctors(Number(e.target.value))} />
                </div>
                <div>
                  <label>% des médecins utilisant internet (B)</label>
                  <Input type="number" min="0" max="100" value={percentUsingInternet} onChange={(e) => setPercentUsingInternet(Number(e.target.value))} />
                </div>
                <div>
                  <label>Nombre total de visites uniques (D)</label>
                  <Input type="number" min="0" value={totalUniqueVisits} onChange={(e) => setTotalUniqueVisits(Number(e.target.value))} />
                </div>
                <div>
                  <label>% des visiteurs ayant interagi (F)</label>
                  <Input type="number" min="0" max="100" value={percentInteracted} onChange={(e) => setPercentInteracted(Number(e.target.value))} />
                </div>
                <div>
                  <label>% ayant changé de perception (H)</label>
                  <Input type="number" min="0" max="100" value={percentChangedPerception} onChange={(e) => setPercentChangedPerception(Number(e.target.value))} />
                </div>
                <div>
                  <label>% susceptibles de prescrire (J)</label>
                  <Input type="number" min="0" max="100" value={percentLikelyToPrescribe} onChange={(e) => setPercentLikelyToPrescribe(Number(e.target.value))} />
                </div>
                <div>
                  <label>Nombre moyen de nouveaux patients (L)</label>
                  <Input type="number" min="0" value={newPatientsPerDoctor} onChange={(e) => setNewPatientsPerDoctor(Number(e.target.value))} />
                </div>
                <div>
                  <label>Valeur moyenne de revenu par patient MAD (N)</label>
                  <Input type="number" min="0" value={revenuePerPatient} onChange={(e) => setRevenuePerPatient(Number(e.target.value))} />
                </div>
                <div>
                  <label>Coût total du programme e-digital MAD (P)</label>
                  <Input type="number" min="0" value={totalCost} onChange={(e) => setTotalCost(Number(e.target.value))} />
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

              <div className="flex flex-wrap justify-between gap-4">
                <Button onClick={calculateRoi} type="button" disabled={loading} style={{ backgroundColor: "#1890ff" }}>
                  {loading ? <Spin size="small" /> : <><CalculatorOutlined /> Calculer ROI</>}
                </Button>

                <Button type="submit" disabled={!calculated} style={{ backgroundColor: "#1890ff" }}>
                  <CheckCircleOutlined /> Insérer les données
                </Button>

                <Button variant="outline" onClick={handleReset}>
                  <ReloadOutlined /> Réinitialiser
                </Button>

                <Link to="/DisplayActivity">
                  <Button variant="secondary">Retour</Button>
                </Link>
              </div>
            </Card>
          </form>
        </div>
      </Content>
    </Layout>
  );
};

export default CalculateAct12;
