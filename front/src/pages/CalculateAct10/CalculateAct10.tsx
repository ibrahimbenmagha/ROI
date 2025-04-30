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

// const CalculateAct10 = () => {
//   // États pour stocker les valeurs du formulaire
//   const [numDoctors, setNumDoctors] = useState(0); // A - Nombre de médecins exposés à l'activité
//   const [percentRemember, setPercentRemember] = useState(0); // B - Pourcentage de médecins se souvenant du message
//   const [percentImproved, setPercentImproved] = useState(0); // D - Pourcentage ayant amélioré leur perception
//   const [percentPrescribers, setPercentPrescribers] = useState(0); // F - Pourcentage des prescripteurs ayant changé leur perception
//   const [patientsPerPrescriber, setPatientsPerPrescriber] = useState(0); // H - Nombre moyen de nouveaux patients par prescripteur
//   const [valuePerPatient, setValuePerPatient] = useState(0); // J - Valeur moyenne du revenu par patient
//   const [totalFixedCost, setTotalFixedCost] = useState(0); // L - Coût fixe total de l'activité

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
//       .get("getActivityItemsByActivityId/10")
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
//       return alert("Pourcentage de médecins se souvenant du message invalide");
//     if (!validateNumeric(percentImproved, 0, 100))
//       return alert("Pourcentage ayant amélioré leur perception invalide");
//     if (!validateNumeric(percentPrescribers, 0, 100))
//       return alert(
//         "Pourcentage des prescripteurs ayant changé leur perception invalide"
//       );
//     if (!validateNumeric(patientsPerPrescriber, 0))
//       return alert("Nombre de nouveaux patients par prescripteur invalide");
//     if (!validateNumeric(valuePerPatient, 0))
//       return alert("Valeur moyenne du revenu par patient invalide");
//     if (!validateNumeric(totalFixedCost, 0))
//       return alert("Coût fixe total invalide");

//     // Conversion des pourcentages
//     const B = percentRemember / 100;
//     const D = percentImproved / 100;
//     const F = percentPrescribers / 100;

//     // Variables
//     const A = numDoctors;
//     const H = patientsPerPrescriber;
//     const J = valuePerPatient;
//     const L = totalFixedCost;

//     // Calculs des métriques
//     const C = A * B; // Nombre de médecins ayant retenu le message
//     const E = C * D; // Nombre de médecins ayant amélioré leur perception
//     const G = E * F; // Nombre de prescripteurs supplémentaires
//     const I = G * H; // Nombre de patients incrémentaux
//     const K = I * J; // Ventes incrémentales générées
//     const ROI = L > 0 ? (K / L) * 100 : 0; // Calcul du retour sur investissement (en pourcentage)

//     setCalculationResult({
//       roi: ROI,
//       doctorsRemembering: C,
//       doctorsImproved: E,
//       additionalPrescribers: G,
//       incrementalPatients: I,
//       incrementalSales: K,
//       totalCost: L,
//     });

//     setCalculated(true);
//   };

//   const handleReset = () => {
//     setNumDoctors(0);
//     setPercentRemember(0);
//     setPercentImproved(0);
//     setPercentPrescribers(0);
//     setPatientsPerPrescriber(0);
//     setValuePerPatient(0);
//     setTotalFixedCost(0);
//     setCalculationResult(null);
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
//       D: percentImproved,
//       F: percentPrescribers,
//       H: patientsPerPrescriber,
//       J: valuePerPatient,
//       L: totalFixedCost,

//       id_A: items[0]?.id,
//       id_B: items[1]?.id,
//       id_D: items[2]?.id,
//       id_F: items[3]?.id,
//       id_H: items[4]?.id,
//       id_J: items[5]?.id,
//       id_L: items[6]?.id,
//       id_ROI: items[7]?.id,
//     };

//     try {
//       const response = await axiosInstance.post("insertIntoTable10", formData);
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
//               Médicaments génériques - Médecins
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* A - Nombre de médecins exposés */}
//                 <div>
//                   <label
//                     htmlFor="numDoctors"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nombre de médecins exposés à l'activité (A)
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

//                 {/* B - % médecins rappel */}
//                 <div>
//                   <label
//                     htmlFor="percentRemember"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage de médecins se souvenant du message (B)
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

//                 {/* D - % médecins perception améliorée */}
//                 <div>
//                   <label
//                     htmlFor="percentImproved"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage ayant amélioré leur perception (D)
//                   </label>
//                   <Input
//                     id="percentImproved"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentImproved}
//                     onChange={(e) => setPercentImproved(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* F - % prescripteurs */}
//                 <div>
//                   <label
//                     htmlFor="percentPrescribers"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Pourcentage des prescripteurs ayant changé leur perception
//                     (F)
//                   </label>
//                   <Input
//                     id="percentPrescribers"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentPrescribers}
//                     onChange={(e) =>
//                       setPercentPrescribers(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* H - Patients par prescripteur */}
//                 <div>
//                   <label
//                     htmlFor="patientsPerPrescriber"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nombre moyen de nouveaux patients par prescripteur (H)
//                   </label>
//                   <Input
//                     id="patientsPerPrescriber"
//                     type="number"
//                     min="0"
//                     value={patientsPerPrescriber}
//                     onChange={(e) =>
//                       setPatientsPerPrescriber(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* J - Valeur patient */}
//                 <div>
//                   <label
//                     htmlFor="valuePerPatient"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Valeur moyenne du revenu par patient € (J)
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

//                 {/* L - Coût fixe total */}
//                 <div>
//                   <label
//                     htmlFor="totalFixedCost"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Coût fixe total de l'activité € (L)
//                   </label>
//                   <Input
//                     id="totalFixedCost"
//                     type="number"
//                     min="0"
//                     value={totalFixedCost}
//                     onChange={(e) => setTotalFixedCost(Number(e.target.value))}
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
//                   disabled={loading || !calculated}
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
//                         suffix="€"
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Coût Total"
//                         value={calculationResult.totalCost}
//                         precision={2}
//                         suffix="€"
//                       />
//                     </Card>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//                     <Card>
//                       <Statistic
//                         title="Médecins Mémorisant"
//                         value={calculationResult.doctorsRemembering}
//                         precision={0}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Prescripteurs Supplémentaires"
//                         value={calculationResult.additionalPrescribers}
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
// export default CalculateAct10;

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

const CalculateAct10 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [percentRemember, setPercentRemember] = useState(0);
  const [percentImproved, setPercentImproved] = useState(0);
  const [percentPrescribers, setPercentPrescribers] = useState(0);
  const [patientsPerPrescriber, setPatientsPerPrescriber] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [totalFixedCost, setTotalFixedCost] = useState(0);
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
      .get("getActivityItemsByActivityId/10")
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
    if (!validateNumeric(numDoctors, 0))
      return alert("Nombre de médecins invalide");
    if (!validateNumeric(percentRemember, 0, 100))
      return alert("Pourcentage de mémorisation invalide");
    if (!validateNumeric(percentImproved, 0, 100))
      return alert("Perception améliorée invalide");
    if (!validateNumeric(percentPrescribers, 0, 100))
      return alert("Prescripteurs supplémentaires invalide");
    if (!validateNumeric(patientsPerPrescriber, 0))
      return alert("Nouveaux patients invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return alert("Valeur par patient invalide");
    if (!validateNumeric(totalFixedCost, 0)) return alert("Coût fixe invalide");

    const A = numDoctors;
    const B = percentRemember / 100;
    const D = percentImproved / 100;
    const F = percentPrescribers / 100;
    const H = patientsPerPrescriber;
    const J = valuePerPatient;
    const L = totalFixedCost;

    const C = A * B;
    const E = C * D;
    const G = E * F;
    const I = G * H;
    const K = I * J;
    const ROI = L > 0 ? (K / L) * 100 : 0;

    setCalculationResult({
      roi: ROI,
      doctorsRemembering: C,
      doctorsImproved: E,
      additionalPrescribers: G,
      incrementalPatients: I,
      incrementalSales: K,
      totalCost: L,
    });

    setCalculated(true);
  };

  const handleReset = () => {
    setNumDoctors(0);
    setPercentRemember(0);
    setPercentImproved(0);
    setPercentPrescribers(0);
    setPatientsPerPrescriber(0);
    setValuePerPatient(0);
    setTotalFixedCost(0);
    setYear(null);
    setCalculationResult(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 8) return alert("Données manquantes");
    if (!year) return alert("Veuillez sélectionner une année");
    if (!activityNumber) return alert("Numéro d'activité introuvable");

    const formData = {
      year,
      activityId: activityNumber,
      A: numDoctors,
      B: percentRemember,
      D: percentImproved,
      F: percentPrescribers,
      H: patientsPerPrescriber,
      J: valuePerPatient,
      L: totalFixedCost,
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_L: items[6]?.id,
      id_ROI: items[7]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable10", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        message.error("Erreur lors de l'insertion.");
      }
    } catch (error) {
      console.error(error);
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
                    <Card>
                      <Statistic
                        title="ROI"
                        value={calculationResult.roi}
                        precision={2}
                        suffix="%"
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
                        title="Médecins Mémorisant"
                        value={calculationResult.doctorsRemembering}
                        precision={0}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Prescripteurs Supplémentaires"
                        value={calculationResult.additionalPrescribers}
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
                      description="Le programme génère un retour négatif. Ajustez les paramètres."
                      type="warning"
                      showIcon
                    />
                  )}
                </div>
              )}
          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Médicaments génériques - Médecins
              </Title>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins exposés à l'activité (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>
                    Pourcentage de médecins se souvenant du message (B)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentRemember}
                    onChange={(e) => setPercentRemember(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Pourcentage ayant amélioré leur perception (D)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentImproved}
                    onChange={(e) => setPercentImproved(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>
                    Pourcentage des prescripteurs ayant changé leur perception
                    (F)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescribers}
                    onChange={(e) =>
                      setPercentPrescribers(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>
                    Nombre moyen de nouveaux patients par prescripteur (H)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={patientsPerPrescriber}
                    onChange={(e) =>
                      setPatientsPerPrescriber(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>Valeur moyenne du revenu par patient MAD (J)</label>
                  <Input
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût fixe total de l'activité MAD (L)</label>
                  <Input
                    type="number"
                    min="0"
                    value={totalFixedCost}
                    onChange={(e) => setTotalFixedCost(Number(e.target.value))}
                  />
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
                  disabled={!calculated}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CheckCircleOutlined /> Insérer les données
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleReset}>
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="/DisplayActivity">
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

export default CalculateAct10;
