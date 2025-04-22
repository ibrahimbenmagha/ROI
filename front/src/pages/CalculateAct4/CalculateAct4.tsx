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
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import axiosInstance from "../../axiosConfig";
// import {deleteCookie } from "../../axiosConfig";
// import TheHeader from "../Header/Header";

// const { Header, Content } = Layout;
// const { Title, Text } = Typography;

// const CalculateAct4 = () => {
//   const [numDoctors, setNumDoctors] = useState(0); // A - Nombre de médecins participants à la conférence
//   const [percentRemember, setPercentRemember] = useState(0); // B - Pourcentage de médecins ayant retenu le message
//   const [percentPositive, setPercentPositive] = useState(0); // D - Pourcentage de médecins ayant une perception positive
//   const [percentPrescribing, setPercentPrescribing] = useState(0); // F - Pourcentage de médecins qui prescrivent à de nouveaux patients
//   const [patientsPerDoctor, setPatientsPerDoctor] = useState(0); // H - Nombre moyen de nouveaux patients prescrits par médecin
//   const [kolAdjustment, setKolAdjustment] = useState(0); // KOL - Ajustement lié à l'influence des leaders d'opinion
//   const [valuePerPatient, setValuePerPatient] = useState(0); // J - Valeur de revenu générée par patient incrémental
//   const [costPerDoctor, setCostPerDoctor] = useState(0); // L - Coût variable par médecin
//   const [fixedCosts, setFixedCosts] = useState(0); // M - Coût fixe total du programme

//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false); // Nouvel état pour suivre l'état du calcul
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
//       .get("getActivityItemsByActivityId/4")
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
//     // Validation simple
//     if (!validateNumeric(numDoctors, 0))
//       return alert("Nombre de médecins invalide");
//     if (!validateNumeric(percentRemember, 0, 100))
//       return alert("Pourcentage de médecins ayant retenu le message invalide");
//     if (!validateNumeric(percentPositive, 0, 100))
//       return alert(
//         "Pourcentage de médecins ayant une perception positive invalide"
//       );
//     if (!validateNumeric(percentPrescribing, 0, 100))
//       return alert("Pourcentage de médecins qui prescrivent invalide");
//     if (!validateNumeric(patientsPerDoctor, 0))
//       return alert("Nombre de patients par médecin invalide");
//     if (!validateNumeric(kolAdjustment, 0))
//       return alert("Ajustement KOL invalide");
//     if (!validateNumeric(valuePerPatient, 0))
//       return alert("Valeur par patient invalide");
//     if (!validateNumeric(costPerDoctor, 0))
//       return alert("Coût par médecin invalide");
//     if (!validateNumeric(fixedCosts, 0)) return alert("Coûts fixes invalides");

//     // Conversion des pourcentages

//     // Variables
//     const A = numDoctors;
//     const B = percentRemember / 100;
//     const D = percentPositive / 100;
//     const F = percentPrescribing / 100;
//     const H = patientsPerDoctor;
//     const KOL = kolAdjustment;
//     const J = valuePerPatient;
//     const L = costPerDoctor;
//     const M = fixedCosts;

//     // Calculs
//     const C = A * B; // Nombre de médecins exposés au message
//     const E = C * D; // Nombre de médecins ayant une perception positive
//     const G = E * F; // Nombre de médecins prescrivant à de nouveaux patients
//     const I = G * H + KOL; // Nombre de patients incrémentaux gagnés
//     const K = I * J; // Ventes incrémentales générées
//     const N = L * A + M; // Coût total du programme

//     // Vérification pour éviter la division par zéro
//     const ROI = N > 0 ? (K / N) * 100 : 0;

//     setCalculationResult({
//       roi: ROI,
//       doctorsExposed: C,
//       doctorsPositive: E,
//       doctorsPrescribing: G,
//       incrementalPatients: I,
//       incrementalSales: K,
//       totalCost: N,
//     });

//     // Marquer le calcul comme terminé
//     setCalculated(true);
//   };

//   const handleReset = () => {
//     setNumDoctors(0);
//     setPercentRemember(0);
//     setPercentPositive(0);
//     setPercentPrescribing(0);
//     setPatientsPerDoctor(0);
//     setKolAdjustment(0);
//     setValuePerPatient(0);
//     setCostPerDoctor(0);
//     setFixedCosts(0);
//     setCalculationResult(null);
//     // Réinitialiser également l'état de calcul
//     setCalculated(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (items.length === 0) {
//       alert("Veuillez d'abord ajouter des éléments d'activité");
//       return;
//     }
//     const formData = {
//       A: numDoctors,
//       B: percentRemember,
//       D: percentPositive,
//       F: percentPrescribing,
//       H: patientsPerDoctor,
//       KOL: kolAdjustment,
//       J: valuePerPatient,
//       L: costPerDoctor,
//       M: fixedCosts,

//       id_A: items[0]?.id,
//       id_B: items[1]?.id,
//       id_D: items[2]?.id,
//       id_F: items[3]?.id,
//       id_H: items[4]?.id,
//       id_KOL: items[5]?.id,
//       id_J: items[6]?.id,
//       id_L: items[7]?.id,
//       id_M: items[8]?.id,
//       id_ROI: items[9]?.id,
//     };

//     try {
//       const response = await axiosInstance.post("insertIntoTable4", formData);
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
//                 Conférences
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* A - Nombre de médecins */}
//                 <div>
//                   <label
//                     htmlFor="numDoctors"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nombre de médecins participants à la conférence
//                   </label>
//                   <Input
//                     id="numDoctors"
//                     type="number"
//                     min="0"
//                     value={numDoctors}
//                     onChange={(e) => setNumDoctors(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* B - % médecins retenus */}
//                 <div>
//                   <label
//                     htmlFor="percentRemember"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage de médecins ayant retenu le message
//                   </label>
//                   <Input
//                     id="percentRemember"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentRemember}
//                     onChange={(e) => setPercentRemember(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* D - % médecins positifs */}
//                 <div>
//                   <label
//                     htmlFor="percentPositive"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage de médecins ayant une perception positive
//                   </label>
//                   <Input
//                     id="percentPositive"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentPositive}
//                     onChange={(e) => setPercentPositive(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* F - % médecins prescripteurs */}
//                 <div>
//                   <label
//                     htmlFor="percentPrescribing"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage de médecins qui prescrivent à de nouveaux
//                     patients (F)
//                   </label>
//                   <Input
//                     id="percentPrescribing"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentPrescribing}
//                     onChange={(e) =>
//                       setPercentPrescribing(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* H - Patients par médecin */}
//                 <div>
//                   <label
//                     htmlFor="patientsPerDoctor"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nombre moyen de nouveaux patients prescrits par médecin
//                   </label>
//                   <Input
//                     id="patientsPerDoctor"
//                     type="number"
//                     min="0"
//                     value={patientsPerDoctor}
//                     onChange={(e) =>
//                       setPatientsPerDoctor(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* KOL - Ajustement leaders d'opinion */}
//                 <div>
//                   <label
//                     htmlFor="kolAdjustment"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Ajustement lié à l'influence des leaders d'opinion
//                   </label>
//                   <Input
//                     id="kolAdjustment"
//                     type="number"
//                     min="0"
//                     value={kolAdjustment}
//                     onChange={(e) => setKolAdjustment(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* J - Valeur patient */}
//                 <div>
//                   <label
//                     htmlFor="valuePerPatient"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Valeur de revenu générée par patient incrémental MAD
//                   </label>
//                   <Input
//                     id="valuePerPatient"
//                     type="number"
//                     min="0"
//                     value={valuePerPatient}
//                     onChange={(e) => setValuePerPatient(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* L - Coût par médecin */}
//                 <div>
//                   <label
//                     htmlFor="costPerDoctor"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Coût variable par médecin MAD
//                   </label>
//                   <Input
//                     id="costPerDoctor"
//                     type="number"
//                     min="0"
//                     value={costPerDoctor}
//                     onChange={(e) => setCostPerDoctor(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* M - Coûts fixes */}
//                 <div>
//                   <label
//                     htmlFor="fixedCosts"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Coût fixe total du programme MAD
//                   </label>
//                   <Input
//                     id="fixedCosts"
//                     type="number"
//                     min="0"
//                     value={fixedCosts}
//                     onChange={(e) => setFixedCosts(Number(e.target.value))}
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
//                   <Button variant="outline" onClick={handleReset}>
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
//                         title="Médecins Exposés"
//                         value={calculationResult.doctorsExposed}
//                         precision={0}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Médecins Positifs"
//                         value={calculationResult.doctorsPositive}
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

// export default CalculateAct4;

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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import axiosInstance, { deleteCookie } from "../../axiosConfig";
import TheHeader from "../Header/Header";
import dayjs from "dayjs";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct4 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [percentRemember, setPercentRemember] = useState(0);
  const [percentPositive, setPercentPositive] = useState(0);
  const [percentPrescribing, setPercentPrescribing] = useState(0);
  const [patientsPerDoctor, setPatientsPerDoctor] = useState(0);
  const [kolAdjustment, setKolAdjustment] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [costPerDoctor, setCostPerDoctor] = useState(0);
  const [fixedCosts, setFixedCosts] = useState(0);
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
      .get("getActivityItemsByActivityId/4")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des items :", error);
        message.error("Impossible de charger les données de l'activité.");
      });
  }, []);

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const calculateRoi = () => {
    if (!validateNumeric(numDoctors, 0))
      return message.error("Nombre de médecins invalide");
    if (!validateNumeric(percentRemember, 0, 100))
      return message.error("Pourcentage de rétention invalide");
    if (!validateNumeric(percentPositive, 0, 100))
      return message.error("Perception positive invalide");
    if (!validateNumeric(percentPrescribing, 0, 100))
      return message.error("Prescription invalide");
    if (!validateNumeric(patientsPerDoctor, 0))
      return message.error("Nombre de patients invalide");
    if (!validateNumeric(kolAdjustment, 0))
      return message.error("Ajustement KOL invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return message.error("Valeur patient invalide");
    if (!validateNumeric(costPerDoctor, 0))
      return message.error("Coût par médecin invalide");
    if (!validateNumeric(fixedCosts, 0))
      return message.error("Coûts fixes invalides");
    if (!year) return message.error("Veuillez sélectionner une année.");

    const A = numDoctors;
    const B = percentRemember / 100;
    const D = percentPositive / 100;
    const F = percentPrescribing / 100;
    const H = patientsPerDoctor;
    const KOL = kolAdjustment;
    const J = valuePerPatient;
    const L = costPerDoctor;
    const M = fixedCosts;

    const C = A * B;
    const E = C * D;
    const G = E * F;
    const I = G * H + KOL;
    const K = I * J;
    const N = L * A + M;
    const ROI = N > 0 ? (K / N) * 100 : 0;

    setCalculationResult({
      roi: ROI,
      doctorsExposed: C,
      doctorsPositive: E,
      doctorsPrescribing: G,
      incrementalPatients: I,
      incrementalSales: K,
      totalCost: N,
    });

    setCalculated(true);
  };

  const handleReset = () => {
    setNumDoctors(0);
    setPercentRemember(0);
    setPercentPositive(0);
    setPercentPrescribing(0);
    setPatientsPerDoctor(0);
    setKolAdjustment(0);
    setValuePerPatient(0);
    setCostPerDoctor(0);
    setFixedCosts(0);
    setYear(null);
    setCalculationResult(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 10) {
      return message.error("Les items de l'activité ne sont pas prêts.");
    }

    const formData = {
      year: year,
      A: numDoctors,
      B: percentRemember,
      D: percentPositive,
      F: percentPrescribing,
      H: patientsPerDoctor,
      KOL: kolAdjustment,
      J: valuePerPatient,
      L: costPerDoctor,
      M: fixedCosts,

      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_KOL: items[5]?.id,
      id_J: items[6]?.id,
      id_L: items[7]?.id,
      id_M: items[8]?.id,
      id_ROI: items[9]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable4", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        message.error("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la communication avec le serveur."
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
                        valueStyle={{ color: calculationResult.roi >= 0 ? "#3f8600" : "#cf1322" }}
                      />
                    </Card>
                    <Card>
                      <Statistic title="Ventes Incrémentales" value={calculationResult.incrementalSales} precision={2} suffix=" MAD" />
                    </Card>
                    <Card>
                      <Statistic title="Coût Total" value={calculationResult.totalCost} precision={2} suffix=" MAD" />
                    </Card>
                  </div>
                </div>
              )}
          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Conférences
              </Title>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins participants</label>
                  <Input
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% de rétention du message</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentRemember}
                    onChange={(e) => setPercentRemember(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% de perception positive</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPositive}
                    onChange={(e) => setPercentPositive(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>% prescripteurs</label>
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
                  <label>Patients prescrits / médecin</label>
                  <Input
                    type="number"
                    min="0"
                    value={patientsPerDoctor}
                    onChange={(e) =>
                      setPatientsPerDoctor(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label>Ajustement KOL</label>
                  <Input
                    type="number"
                    min="0"
                    value={kolAdjustment}
                    onChange={(e) => setKolAdjustment(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Valeur par patient (MAD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Coût / médecin (MAD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={costPerDoctor}
                    onChange={(e) => setCostPerDoctor(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Coût fixe total (MAD)</label>
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
                  onClick={calculateRoi}
                  type="button"
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
                  style={{ backgroundColor: "#1890ff" }}
                  disabled={!calculated || !year}
                >
                  <CheckCircleOutlined /> Insérer les données
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} type="button">
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="/DisplayActivity">
                    <Button variant="secondary" type="button">Retour</Button>
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

export default CalculateAct4;
