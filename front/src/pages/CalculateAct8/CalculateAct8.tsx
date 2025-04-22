// import React, { useState, useEffect } from "react";
// import {
//   Layout,
//   Typography,
//   Card,
//   Divider,
//   Statistic,
//   Alert,
//   message,
// } from "antd";
// import {
//   CalculatorOutlined,
//   ReloadOutlined,
//   CheckCircleOutlined,
// } from "@ant-design/icons";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import TheHeader from "../Header/Header";
// import axiosInstance from "../../axiosConfig";
// import {deleteCookie } from "../../axiosConfig";

// const { Header, Content } = Layout;
// const { Title, Text } = Typography;

// const CalculateAct8 = () => {
//   // États pour stocker les valeurs du formulaire
//   const [totalPopulation, setTotalPopulation] = useState(0); // A - Population totale
//   const [diseaseRate, setDiseaseRate] = useState(0); // B - Taux d'incidence de la maladie
//   const [satisfiedRate, setSatisfiedRate] = useState(0); // D - Pourcentage des patients déjà traités et satisfaits
//   const [targetedRate, setTargetedRate] = useState(0); // F - Pourcentage des patients visés par la campagne en ligne
//   const [uniqueVisits, setUniqueVisits] = useState(0); // H - Nombre total de visites uniques sur le site
//   const [interestedRate, setInterestedRate] = useState(0); // J - Pourcentage des visiteurs intéressés
//   const [consultedRate, setConsultedRate] = useState(0); // L - Pourcentage des visiteurs ayant consulté un médecin
//   const [prescriptionRate, setPrescriptionRate] = useState(0); // N - Pourcentage des patients ayant reçu une prescription
//   const [revenuePerPatient, setRevenuePerPatient] = useState(0); // P - Valeur du revenu par patient incrémental
//   const [campaignCost, setCampaignCost] = useState(0); // R - Coût total de la campagne digitale

//   // État pour stocker les résultats
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false);
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
//       .get("getActivityItemsByActivityId/8")
//       .then((response) => {
//         setItems(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching activities:", error);
//       });
//   }, []);

//   const validateNumeric = (value, min, max = null) => {
//     const num = Number(value);
//     if (isNaN(num)) return false;
//     if (num < min) return false;
//     if (max !== null && num > max) return false;
//     return true;
//   };

//   const calculateRoi = () => {
//     if (!validateNumeric(totalPopulation, 0))
//       return alert("Population totale invalide");
//     if (!validateNumeric(diseaseRate, 0, 100))
//       return alert("Taux d'incidence invalide");
//     if (!validateNumeric(satisfiedRate, 0, 100))
//       return alert("Pourcentage de patients satisfaits invalide");
//     if (!validateNumeric(targetedRate, 0, 100))
//       return alert("Pourcentage de patients visés invalide");
//     if (!validateNumeric(uniqueVisits, 0))
//       return alert("Nombre de visites unique invalide");
//     if (!validateNumeric(interestedRate, 0, 100))
//       return alert("Pourcentage de visiteurs intéressés invalide");
//     if (!validateNumeric(consultedRate, 0, 100))
//       return alert("Pourcentage de visiteurs ayant consulté invalide");
//     if (!validateNumeric(prescriptionRate, 0, 100))
//       return alert(
//         "Pourcentage de patients ayant reçu une prescription invalide"
//       );
//     if (!validateNumeric(revenuePerPatient, 0))
//       return alert("Valeur par patient invalide");
//     if (!validateNumeric(campaignCost, 0))
//       return alert("Coût de campagne invalide");

//     // Variables
//     const A = totalPopulation;
//     const B = diseaseRate / 100;
//     const D = satisfiedRate / 100;
//     const F = targetedRate / 100;
//     const H = uniqueVisits;
//     const J = interestedRate / 100;
//     const L = consultedRate / 100;
//     const N = prescriptionRate / 100;
//     const P = revenuePerPatient;
//     const R = campaignCost;

//     // Calculs
//     const C = A * B; // Nombre total de patients souffrant de la maladie
//     const E = C * (1 - D); // Nombre de patients non traités ou insatisfaits
//     const G = E * F; // Nombre de patients ciblés par la campagne digitale
//     const I = H / G; // Taux d'efficacité d'atteinte des patients ciblés
//     const K = H * J; // Nombre de visiteurs uniques intéressés et sensibilisés
//     const M = K * L; // Nombre de visiteurs uniques ayant consulté un médecin
//     const O = M * N; // Nombre de patients ayant obtenu une prescription
//     const Q = O * P; // Ventes incrémentales générées

//     // Calcul du ROI
//     const ROI = R > 0 ? (Q / R) * 100 : 0;

//     setCalculationResult({
//       roi: ROI,
//       incrementalSales: Q,
//       totalPatients: C,
//       untreatedPatients: E,
//       targetedPatients: G,
//       efficacyRate: I,
//       interestedVisitors: K,
//       consultedVisitors: M,
//       prescribedPatients: O,
//       totalCost: R,
//     });
//     setCalculated(true);
//   };

//   const handleReset = () => {
//     setTotalPopulation(0);
//     setDiseaseRate(0);
//     setSatisfiedRate(0);
//     setTargetedRate(0);
//     setUniqueVisits(0);
//     setInterestedRate(0);
//     setConsultedRate(0);
//     setPrescriptionRate(0);
//     setRevenuePerPatient(0);
//     setCampaignCost(0);
//     setCalculationResult(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (items.length === 0) {
//       alert("Veuillez d'abord ajouter des éléments d'activité");
//       return;
//     }
//     const formData = {
//       A: totalPopulation,
//       B: diseaseRate,
//       D: satisfiedRate,
//       F: targetedRate,
//       H: uniqueVisits,
//       J: interestedRate,
//       L: consultedRate,
//       N: prescriptionRate,
//       P: revenuePerPatient,
//       R: campaignCost,
//       id_A: items[0]?.id,
//       id_B: items[1]?.id,
//       id_D: items[2]?.id,
//       id_F: items[3]?.id,
//       id_H: items[4]?.id,
//       id_J: items[5]?.id,
//       id_L: items[6]?.id,
//       id_N: items[7]?.id,
//       id_P: items[8]?.id,
//       id_R: items[9]?.id,
//       id_ROI: items[10]?.id,
//     };
//     try {
//       const response = await axiosInstance.post("insertIntoTable8", formData);
//       if (response.status === 201) {
//         message.success("Les données ont été insérées avec succès.");
//         deleteCookie("activityNumber");
//         deleteCookie("activityId");
//         navigate("/DisplayActivity");
//       } else {
//         alert("Une erreur est survenue lors de l'insertion.");
//       }
//     } catch (error) {
//       console.log(error);
//       if (error.response) {
//         alert(
//           error.response.data.message ||
//             "Une erreur est survenue lors de l'insertion."
//         );
//       } else if (error.request) {
//         alert("Aucune réponse reçue du serveur.");
//       } else {
//         alert("Une erreur est survenue lors de l'envoi de la requête.");
//       }
//     }
//   };

//   return (
//     <Layout className="min-h-screen">
//       <TheHeader />
//       <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
//         <div style={{ maxWidth: 800, margin: "0 auto" }}>
//           <form onSubmit={handleSubmit}>
//             <Card>
//               <Title level={4} style={{ textAlign: "center" }}>
//                 Publicité directe au consommateur en ligne
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* A - Population totale */}
//                 <div>
//                   <label
//                     htmlFor="totalPopulation"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Population totale (A)
//                   </label>
//                   <Input
//                     id="totalPopulation"
//                     type="number"
//                     min="0"
//                     value={totalPopulation}
//                     onChange={(e) => setTotalPopulation(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* B - Taux d'incidence */}
//                 <div>
//                   <label
//                     htmlFor="diseaseRate"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Taux d'incidence de la maladie % (B)
//                   </label>
//                   <Input
//                     id="diseaseRate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={diseaseRate}
//                     onChange={(e) => setDiseaseRate(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* D - Patients satisfaits */}
//                 <div>
//                   <label
//                     htmlFor="satisfiedRate"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage des patients déjà traités et satisfaits % (D)
//                   </label>
//                   <Input
//                     id="satisfiedRate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={satisfiedRate}
//                     onChange={(e) => setSatisfiedRate(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* F - Patients visés */}
//                 <div>
//                   <label
//                     htmlFor="targetedRate"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage des patients visés par la campagne % (F)
//                   </label>
//                   <Input
//                     id="targetedRate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={targetedRate}
//                     onChange={(e) => setTargetedRate(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* H - Visites uniques */}
//                 <div>
//                   <label
//                     htmlFor="uniqueVisits"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nombre total de visites uniques sur le site (H)
//                   </label>
//                   <Input
//                     id="uniqueVisits"
//                     type="number"
//                     min="0"
//                     value={uniqueVisits}
//                     onChange={(e) => setUniqueVisits(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* J - Visiteurs intéressés */}
//                 <div>
//                   <label
//                     htmlFor="interestedRate"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage des visiteurs intéressés % (J)
//                   </label>
//                   <Input
//                     id="interestedRate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={interestedRate}
//                     onChange={(e) => setInterestedRate(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* L - Visiteurs ayant consulté */}
//                 <div>
//                   <label
//                     htmlFor="consultedRate"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage des visiteurs ayant consulté un médecin % (L)
//                   </label>
//                   <Input
//                     id="consultedRate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={consultedRate}
//                     onChange={(e) => setConsultedRate(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* N - Patients avec prescription */}
//                 <div>
//                   <label
//                     htmlFor="prescriptionRate"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage des patients ayant reçu une prescription % (N)
//                   </label>
//                   <Input
//                     id="prescriptionRate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={prescriptionRate}
//                     onChange={(e) =>
//                       setPrescriptionRate(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* P - Valeur du revenu */}
//                 <div>
//                   <label
//                     htmlFor="revenuePerPatient"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Valeur du revenu par patient incrémental MAD (P)
//                   </label>
//                   <Input
//                     id="revenuePerPatient"
//                     type="number"
//                     min="0"
//                     value={revenuePerPatient}
//                     onChange={(e) =>
//                       setRevenuePerPatient(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* R - Coût de la campagne */}
//                 <div>
//                   <label
//                     htmlFor="campaignCost"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Coût total de la campagne digitale MAD (R)
//                   </label>
//                   <Input
//                     id="campaignCost"
//                     type="number"
//                     min="0"
//                     value={campaignCost}
//                     onChange={(e) => setCampaignCost(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>
//               </div>

//               <Divider />

//               <div className="flex flex-col sm:flex-row justify-between gap-4">
//                 <Button
//                   onClick={calculateRoi}
//                   type="button"
//                   className="bg-primary"
//                   disabled={loading}
//                   style={{ backgroundColor: "#1890ff" }}
//                 >
//                   {loading ? (
//                     <Spin size="small" />
//                   ) : (
//                     <>
//                       <CalculatorOutlined className="mr-2" />
//                       Calculer ROI
//                     </>
//                   )}
//                 </Button>

//                 <Button
//                   className="bg-primary"
//                   type="submit"
//                   disabled={loading || !calculated} // Désactiver si le calcul n'est pas encore fait
//                   style={{ backgroundColor: "#1890ff" }}
//                 >
//                   {loading ? (
//                     <Spin size="small" />
//                   ) : (
//                     <>
//                       <CheckCircleOutlined className="mr-2" />
//                       Insérer les données
//                     </>
//                   )}
//                 </Button>

//                 <div className="flex gap-4">
//                   <Button variant="outline" onClick={handleReset} type="button">
//                     <ReloadOutlined className="mr-2" />
//                     Réinitialiser
//                   </Button>
//                   <Link to="/DisplayActivity">
//                     <Button variant="secondary">Retour</Button>
//                   </Link>
//                 </div>
//               </div>

//               {calculationResult && (
//                 <div className="mt-8">
//                   <Divider>Résultats</Divider>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <Card>
//                       <Statistic
//                         title="ROI"
//                         value={calculationResult.roi}
//                         precision={2}
//                         suffix="%"
//                         valueStyle={{
//                           color:
//                             calculationResult.roi >= 0 ? "#3f8600" : "#cf1322",
//                         }}
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
//                         title="Patients Potentiels"
//                         value={calculationResult.totalPatients}
//                         precision={0}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Visiteurs Intéressés"
//                         value={calculationResult.interestedVisitors}
//                         precision={0}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Patients Traités"
//                         value={calculationResult.prescribedPatients}
//                         precision={0}
//                       />
//                     </Card>
//                   </div>

//                   {calculationResult.roi < 0 && (
//                     <Alert
//                       style={{ marginTop: "16px" }}
//                       message="ROI Négatif"
//                       description="Le programme génère actuellement un retour négatif sur investissement. Essayez d'ajuster les paramètres."
//                       type="warning"
//                       showIcon
//                     />
//                   )}
//                 </div>
//               )}
//             </Card>
//           </form>
//         </div>
//       </Content>
//     </Layout>
//   );
// };

// export default CalculateAct8;


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

const CalculateAct8 = () => {
  // États du formulaire
  const [A, setA] = useState(0); // Population totale
  const [B, setB] = useState(0); // Taux d'incidence
  const [D, setD] = useState(0); // % Patients satisfaits
  const [F, setF] = useState(0); // % Patients visés
  const [H, setH] = useState(0); // Visites uniques
  const [J, setJ] = useState(0); // % Visiteurs intéressés
  const [L, setL] = useState(0); // % Visiteurs ayant consulté
  const [N, setN] = useState(0); // % Patients avec prescription
  const [P, setP] = useState(0); // Valeur patient
  const [R, setR] = useState(0); // Coût campagne
  const [year, setYear] = useState(null);

  // États de l'application
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

    axiosInstance
      .get("getActivityItemsByActivityId/8")
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
    setP(0);
    setR(0);
    setYear(null);
    setCalculationResult(null);
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
    validateNumeric(B, 0, 100) &&
    validateNumeric(D, 0, 100) &&
    validateNumeric(F, 0, 100) &&
    validateNumeric(H, 0) &&
    validateNumeric(J, 0, 100) &&
    validateNumeric(L, 0, 100) &&
    validateNumeric(N, 0, 100) &&
    validateNumeric(P, 0) &&
    validateNumeric(R, 0) &&
    !!year;

  const calculateRoi = async () => {
    if (!validateNumeric(A, 0)) return message.error("Population totale invalide");
    if (!validateNumeric(B, 0, 100)) return message.error("Taux d'incidence invalide");
    if (!validateNumeric(D, 0, 100)) return message.error("% Patients satisfaits invalide");
    if (!validateNumeric(F, 0, 100)) return message.error("% Patients visés invalide");
    if (!validateNumeric(H, 0)) return message.error("Visites uniques invalides");
    if (!validateNumeric(J, 0, 100)) return message.error("% Visiteurs intéressés invalide");
    if (!validateNumeric(L, 0, 100)) return message.error("% Visiteurs consultant invalide");
    if (!validateNumeric(N, 0, 100)) return message.error("% Prescriptions invalide");
    if (!validateNumeric(P, 0)) return message.error("Valeur patient invalide");
    if (!validateNumeric(R, 0)) return message.error("Coût campagne invalide");

    setLoading(true);

    try {
      // Calculs intermédiaires
      const C = A * (B / 100); // Patients souffrant
      const E = C * (1 - (D / 100)); // Patients non traités/insatisfaits
      const G = E * (F / 100); // Patients ciblés
      const I = H / G; // Taux efficacité
      const K = H * (J / 100); // Visiteurs intéressés
      const M = K * (L / 100); // Visiteurs consultant
      const O = M * (N / 100); // Patients prescrits
      const Q = O * P; // Ventes incrémentales
      const ROI = R > 0 ? (Q / R) * 100 : 0; // ROI en %

      setCalculationResult({
        roi: ROI,
        incrementalSales: Q,
        totalPatients: C,
        untreatedPatients: E,
        targetedPatients: G,
        efficacyRate: I,
        interestedVisitors: K,
        consultedVisitors: M,
        prescribedPatients: O,
        totalCost: R,
      });
      setCalculated(true);
    } catch (error) {
      message.error("Erreur lors du calcul du ROI");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items || items.length < 11) {
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
      P: parseFloat(P),
      R: parseFloat(R),

      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_L: items[6]?.id,
      id_N: items[7]?.id,
      id_P: items[8]?.id,
      id_R: items[9]?.id,
      id_ROI: items[10]?.id,
    };

    try {
      const response = await axiosInstance.post("/insertIntoTable8", formData);

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
        error.response?.data?.message || "Erreur de communication avec le serveur"
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
                      color: calculationResult.roi >= 0 ? "#3f8600" : "#cf1322",
                    }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Ventes Incrémentales"
                    value={calculationResult.incrementalSales}
                    precision={2}
                    suffix="MAD"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Coût Total"
                    value={calculationResult.totalCost}
                    precision={2}
                    suffix="MAD"
                  />
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Card>
                  <Statistic
                    title="Patients Potentiels"
                    value={calculationResult.totalPatients}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Visiteurs Intéressés"
                    value={calculationResult.interestedVisitors}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Patients Prescrits"
                    value={calculationResult.prescribedPatients}
                    precision={0}
                  />
                </Card>
              </div>

              <Card className="mt-4">
                <Statistic
                  title="Efficacité Campagne"
                  value={calculationResult.efficacyRate}
                  precision={2}
                />
                <Text type="secondary">
                  Ratio visites/patients ciblés
                </Text>
              </Card>

              {calculationResult.roi < 0 && (
                <Alert
                  message="ROI Négatif"
                  description="Ajustez les paramètres pour améliorer le ROI"
                  type="warning"
                  showIcon
                />
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Publicité Digitale - Calcul ROI
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Population totale (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={A}
                    onChange={(e) => setA(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Taux d'incidence % (B)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={B}
                    onChange={(e) => setB(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Patients satisfaits (D)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={D}
                    onChange={(e) => setD(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Patients visés (F)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={F}
                    onChange={(e) => setF(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Visites uniques (H)</label>
                  <Input
                    type="number"
                    min="0"
                    value={H}
                    onChange={(e) => setH(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Visiteurs intéressés (J)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={J}
                    onChange={(e) => setJ(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Visiteurs consultant (L)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={L}
                    onChange={(e) => setL(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% Prescriptions (N)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={N}
                    onChange={(e) => setN(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Valeur patient (MAD) (P)</label>
                  <Input
                    type="number"
                    min="0"
                    value={P}
                    onChange={(e) => setP(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Coût campagne (MAD) (R)</label>
                  <Input
                    type="number"
                    min="0"
                    value={R}
                    onChange={(e) => setR(Number(e.target.value))}
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
                  {loading ? <Spin size="small" /> : <><CalculatorOutlined /> Calculer ROI</>}
                </Button>

                <Button
                  type="submit"
                  disabled={loading || !calculated || !isFormValid()}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CheckCircleOutlined /> Enregistrer
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="/CreateActivity">
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

export default CalculateAct8;
