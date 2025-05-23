// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Card,
//   Divider,
//   Statistic,
//   Alert,
//   Layout,
//   DatePicker,
//   message,
//   Spin,
// } from "antd";
// import {
//   CalculatorOutlined,
//   ReloadOutlined,
//   CheckCircleOutlined,
// } from "@ant-design/icons";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import TheHeader from "../Header/Header";
// import axiosInstance, { deleteCookie } from "../../axiosConfig";
// import dayjs from "dayjs";

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const CalculateAct2 = () => {
//   const [numDoctors, setNumDoctors] = useState(0);
//   const [patientsPerDoctor, setPatientsPerDoctor] = useState(0);
//   const [percentContinue, setPercentContinue] = useState(0);
//   const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(0);
//   const [valuePerPatient, setValuePerPatient] = useState(0);
//   const [costPerDoctor, setCostPerDoctor] = useState(0);
//   const [fixedCosts, setFixedCosts] = useState(0);
//   const [year, setYear] = useState(null);
//   const [activityNumber, setActivityNumber] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false);
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [interpretation, setInterpretation] = useState(null);
//   const [items, setItems] = useState([]);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const match = location.pathname.match(/CalculateAct(\d+)/);
//     const foundActivityNumber = match ? parseInt(match[1]) : null;
//     setActivityNumber(foundActivityNumber);
//     document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

//     if (!sessionStorage.getItem("reloaded")) {
//       sessionStorage.setItem("reloaded", "true");
//       window.location.reload();
//     } else {
//       sessionStorage.removeItem("reloaded");
//     }

//     axiosInstance
//       .get("getActivityItemsByActivityId/2")
//       .then((response) => setItems(response.data))
//       .catch((error) => {
//         console.error("Erreur lors du chargement des items :", error);
//         message.error("Impossible de charger les données.");
//       });
//   }, [location.pathname]);

//   const validateNumeric = (value, min, max = null) => {
//     const num = Number(value);
//     if (isNaN(num)) return false;
//     if (num < min) return false;
//     if (max !== null && num > max) return false;
//     return true;
//   };

//   const generateInterpretation = async (result) => {
//     try {
//       const response = await axiosInstance.post("/generate-interpretation", {
//         roi: result.roi,
//         totalPatients: result.totalPatients,
//         continuingPatients: result.continuingPatients,
//         incrementalPatients: result.incrementalPatients,
//         incrementalSales: result.incrementalSales,
//         totalCost: result.totalCost,
//         numDoctors,
//         patientsPerDoctor,
//         percentContinue,
//         newPatientsPerDoctor,
//         valuePerPatient,
//         costPerDoctor,
//         fixedCosts,
//       });

//       return response.data.interpretation;
//     } catch (error) {
//       console.error("Erreur lors de la génération de l'interprétation :", error);
//       return null; // Return null to indicate failure
//     }
//   };

//   const calculateRoi = async () => {
//     if (!validateNumeric(numDoctors, 0))
//       return message.error("Nombre de médecins invalide");
//     if (!validateNumeric(patientsPerDoctor, 0))
//       return message.error("Nombre de patients par médecin invalide");
//     if (!validateNumeric(percentContinue, 0, 100))
//       return message.error("Pourcentage de patients continuant invalide");
//     if (!validateNumeric(newPatientsPerDoctor, 0))
//       return message.error("Nombre de nouveaux patients invalide");
//     if (!validateNumeric(valuePerPatient, 0))
//       return message.error("Valeur par patient invalide");
//     if (!validateNumeric(costPerDoctor, 0))
//       return message.error("Coût par médecin invalide");
//     if (!validateNumeric(fixedCosts, 0))
//       return message.error("Coûts fixes invalides");

//     setLoading(true);

//     try {
//       const A = numDoctors;
//       const B = patientsPerDoctor;
//       const D = percentContinue / 100;
//       const F = newPatientsPerDoctor;
//       const H = valuePerPatient;
//       const J = costPerDoctor;
//       const K = fixedCosts;

//       const C = A * B;
//       const E = C * D;
//       const G = A * (E / A + F);
//       const I = G * H;
//       const L = J * A + K;
//       const ROI = L > 0 ? (I / L) * 100 : 0;

//       const result = {
//         roi: ROI,
//         totalPatients: C,
//         continuingPatients: E,
//         incrementalPatients: G,
//         incrementalSales: I,
//         totalCost: L,
//       };

//       setCalculationResult(result);
//       setCalculated(true);

//       const interpretationText = await generateInterpretation(result);
//       if (interpretationText) {
//         setInterpretation(interpretationText);
//       } else {
//         message.error("L'interprétation n'est pas disponible pour le moment.");
//       }
//     } catch (error) {
//       message.error("Erreur lors du calcul du ROI.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setNumDoctors(0);
//     setPatientsPerDoctor(0);
//     setPercentContinue(0);
//     setNewPatientsPerDoctor(0);
//     setValuePerPatient(0);
//     setCostPerDoctor(0);
//     setFixedCosts(0);
//     setYear(null);
//     setCalculationResult(null);
//     setInterpretation(null);
//     setCalculated(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!items || items.length < 8) {
//       return message.error("Les données nécessaires ne sont pas encore disponibles.");
//     }

//     if (!year) {
//       return message.error("Année d'activité manquante.");
//     }

//     const formData = {
//       year,
//       activityId: activityNumber,
//       A: parseFloat(numDoctors),
//       B: parseFloat(patientsPerDoctor),
//       D: parseFloat(percentContinue),
//       F: parseFloat(newPatientsPerDoctor),
//       H: parseFloat(valuePerPatient),
//       J: parseFloat(costPerDoctor),
//       K: parseFloat(fixedCosts),
//       id_A: items[0]?.id,
//       id_B: items[1]?.id,
//       id_D: items[2]?.id,
//       id_F: items[3]?.id,
//       id_H: items[4]?.id,
//       id_J: items[5]?.id,
//       id_K: items[6]?.id,
//       id_ROI: items[7]?.id,
//     };

//     try {
//       const response = await axiosInstance.post("insertActivityData", formData);
//       if (response.status === 201) {
//         message.success("Les données ont été insérées avec succès.");
//         deleteCookie("activityNumber");
//         navigate("/DisplayActivity");
//       } else {
//         message.error("Une erreur est survenue lors de l'insertion.");
//       }
//     } catch (error) {
//       console.error("Erreur lors de l’envoi du formulaire :", error);
//       message.error(
//         error.response?.data?.message || "Erreur lors de la communication avec le serveur."
//       );
//     }
//   };

//   return (
//     <Layout className="min-h-screen">
//       <TheHeader />
//       <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
//         <div style={{ maxWidth: 800, margin: "0 auto" }}>
//           {calculationResult && (
//             <div className="mt-8">
//               <Divider>Résultats</Divider>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <Card>
//                   <Statistic
//                     title="ROI"
//                     value={calculationResult.roi}
//                     precision={2}
//                     suffix="%"
//                     valueStyle={{
//                       color: calculationResult.roi >= 100 ? "#3f8600" : "#cf1322",
//                     }}
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Ventes Incrémentales"
//                     value={calculationResult.incrementalSales}
//                     precision={2}
//                     suffix=" MAD"
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Coût Total"
//                     value={calculationResult.totalCost}
//                     precision={2}
//                     suffix=" MAD"
//                   />
//                 </Card>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//                 <Card>
//                   <Statistic
//                     title="Patients Inscrits"
//                     value={calculationResult.totalPatients}
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Patients Poursuivant"
//                     value={calculationResult.continuingPatients}
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Patients Incrémentaux"
//                     value={calculationResult.incrementalPatients}
//                   />
//                 </Card>
//               </div>

//               {calculationResult.roi < 100 && (
//                 <Alert
//                   style={{ marginTop: "16px" }}
//                   message="ROI Négatif ou Faible"
//                   description="Le programme génère un retour insuffisant. Consultez les conseils ci-dessous pour améliorer vos résultats."
//                   type="warning"
//                   showIcon
//                 />
//               )}
//               {calculationResult.roi >= 100 && (
//                 <Alert
//                   style={{ marginTop: "16px" }}
//                   message="ROI Positif"
//                   description="Le programme génère un retour positif. Continuez à optimiser pour maximiser les résultats."
//                   type="success"
//                   showIcon
//                 />
//               )}

//               {interpretation && (
//                 <div className="mt-6">
//                   <Divider>Interprétation et Conseils</Divider>
//                   <Card>
//                     <Text>{interpretation}</Text>
//                   </Card>
//                 </div>
//               )}
//             </div>
//           )}
//           <form onSubmit={handleSubmit}>
//             <Card>
//               <Title level={4} style={{ textAlign: "center" }}>
//                 Essai clinique
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label>Nombre de médecins participant à l'étude (A)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={numDoctors}
//                     onChange={(e) => setNumDoctors(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Nombre moyen de patients inscrits par médecin (B)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={patientsPerDoctor}
//                     onChange={(e) => setPatientsPerDoctor(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Pourcentage moyen de patients poursuivant le traitement (D)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentContinue}
//                     onChange={(e) => setPercentContinue(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Nombre de nouveaux patients traités par médecin (F)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={newPatientsPerDoctor}
//                     onChange={(e) => setNewPatientsPerDoctor(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Valeur par patient incrémental MAD (H)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={valuePerPatient}
//                     onChange={(e) => setValuePerPatient(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Coût variable par médecin MAD (J)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={costPerDoctor}
//                     onChange={(e) => setCostPerDoctor(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Coût fixe total de l’étude MAD (K)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={fixedCosts}
//                     onChange={(e) => setFixedCosts(Number(e.target.value))}
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
//                       <CalculatorOutlined className="mr-2" /> Calculer ROI
//                     </>
//                   )}
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={loading || !calculated}
//                   style={{ backgroundColor: "#1890ff" }}
//                 >
//                   <CheckCircleOutlined className="mr-2" /> Insérer les données
//                 </Button>
//                 <div className="flex gap-4">
//                   <Button variant="outline" onClick={handleReset} type="button">
//                     <ReloadOutlined className="mr-2" /> Réinitialiser
//                   </Button>
//                   <Link to="../DisplayActivity">
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

// export default CalculateAct2;

import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Divider,
  Statistic,
  Alert,
  Layout,
  DatePicker,
  message,
  Spin,
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

const CalculateAct2 = () => {
  const [numDoctors, setNumDoctors] = useState(0);
  const [patientsPerDoctor, setPatientsPerDoctor] = useState(0);
  const [percentContinue, setPercentContinue] = useState(0);
  const [newPatientsPerDoctor, setNewPatientsPerDoctor] = useState(0);
  const [valuePerPatient, setValuePerPatient] = useState(0);
  const [costPerDoctor, setCostPerDoctor] = useState(0);
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
      .get("getActivityItemsByActivityId/2")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des items :", error);
        message.error("Impossible de charger les données.");
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

  const generateInterpretation = async (result) => {
    try {
      const response = await axiosInstance.post("/generate-interpretation", {
        roi: result.roi,
        totalPatients: result.total_patients_enrolled,
        continuingPatients: result.patients_continuing_treatment,
        incrementalPatients: result.incremental_patients,
        incrementalSales: result.incremental_sales,
        totalCost: result.total_cost,
        numDoctors,
        patientsPerDoctor,
        percentContinue,
        newPatientsPerDoctor,
        valuePerPatient,
        costPerDoctor,
        fixedCosts,
      });

      return response.data.interpretation;
    } catch (error) {
      console.error("Erreur lors de la génération de l'interprétation :", error);
      return null; // Return null to indicate failure
    }
  };

  const calculateRoi = async () => {
    if (!validateNumeric(numDoctors, 0))
      return message.error("Nombre de médecins invalide");
    if (!validateNumeric(patientsPerDoctor, 0))
      return message.error("Nombre de patients par médecin invalide");
    if (!validateNumeric(percentContinue, 0, 100))
      return message.error("Pourcentage de patients continuant invalide");
    if (!validateNumeric(newPatientsPerDoctor, 0))
      return message.error("Nombre de nouveaux patients invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return message.error("Valeur par patient invalide");
    if (!validateNumeric(costPerDoctor, 0))
      return message.error("Coût par médecin invalide");
    if (!validateNumeric(fixedCosts, 0))
      return message.error("Coûts fixes invalides");
    if (!year)
      return message.error("Année d'activité manquante.");
    if (!activityNumber)
      return message.error("Le numéro d’activité est manquant.");
    if (!items || items.length < 7)
      return message.error("Les données des items d'activité ne sont pas disponibles.");

    setLoading(true);
    setError(null);

    try {
      const formData = {
        activityId: activityNumber,
        year,
        A: parseFloat(numDoctors),
        B: parseFloat(patientsPerDoctor),
        D: parseFloat(percentContinue),
        F: parseFloat(newPatientsPerDoctor),
        H: parseFloat(valuePerPatient),
        J: parseFloat(costPerDoctor),
        K: parseFloat(fixedCosts),
        id_A: items[0]?.id,
        id_B: items[1]?.id,
        id_D: items[2]?.id,
        id_F: items[3]?.id,
        id_H: items[4]?.id,
        id_J: items[5]?.id,
        id_K: items[6]?.id,
      };

      const response = await axiosInstance.post("calculateRoi", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = {
        roi: response.data.ROI * 100, // Convert to percentage for consistency with original
        total_patients_enrolled: response.data.results.total_patients_enrolled,
        patients_continuing_treatment: response.data.results.patients_continuing_treatment,
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
    setNumDoctors(0);
    setPatientsPerDoctor(0);
    setPercentContinue(0);
    setNewPatientsPerDoctor(0);
    setValuePerPatient(0);
    setCostPerDoctor(0);
    setFixedCosts(0);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items || items.length < 8) {
      return message.error("Les données nécessaires ne sont pas encore disponibles.");
    }

    if (!year) {
      return message.error("Année d'activité manquante.");
    }

    const formData = {
      year,
      activityId: activityNumber,
      A: parseFloat(numDoctors),
      B: parseFloat(patientsPerDoctor),
      D: parseFloat(percentContinue),
      F: parseFloat(newPatientsPerDoctor),
      H: parseFloat(valuePerPatient),
      J: parseFloat(costPerDoctor),
      K: parseFloat(fixedCosts),
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_K: items[6]?.id,
      id_ROI: items[7]?.id,
    };

    try {
      const response = await axiosInstance.post("insertActivityData", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        navigate("/DisplayActivity");
      } else {
        message.error("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.error("Erreur lors de l’envoi du formulaire :", error);
      message.error(
        error.response?.data?.message || "Erreur lors de la communication avec le serveur."
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
                      color: calculationResult.roi >= 100 ? "#3f8600" : "#cf1322",
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
                    title="Patients Inscrits"
                    value={calculationResult.total_patients_enrolled}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Patients Poursuivant"
                    value={calculationResult.patients_continuing_treatment}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Patients Incrémentaux"
                    value={calculationResult.incremental_patients}
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
                Essai clinique
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de médecins participant à l'étude (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Nombre moyen de patients inscrits par médecin k(B)</label>
                  <Input
                    type="number"
                    min="0"
                    value={patientsPerDoctor}
                    onChange={(e) => setPatientsPerDoctor(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Pourcentage moyen de patients poursuivant le traitement (D)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentContinue}
                    onChange={(e) => setPercentContinue(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Nombre de nouveaux patients traités par médecin (F)</label>
                  <Input
                    type="number"
                    min="0"
                    value={newPatientsPerDoctor}
                    onChange={(e) => setNewPatientsPerDoctor(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Valeur par patient incrémental MAD (H)</label>
                  <Input
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût variable par médecin MAD (J)</label>
                  <Input
                    type="number"
                    min="0"
                    value={costPerDoctor}
                    onChange={(e) => setCostPerDoctor(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût fixe total de l’étude MAD (K)</label>
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
                  disabled={loading || !calculated}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CheckCircleOutlined className="mr-2" /> Insérer les données
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} type="button">
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

export default CalculateAct2;

