// import React, { useState, useEffect } from "react";
// import {
//   Layout,
//   Typography,
//   Card,
//   Divider,
//   Statistic,
//   message,
//   Alert,
//   Spin,
//   DatePicker,
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

// const CalculateAct1 = () => {
//   const [numDoctors, setNumDoctors] = useState(0);
//   const [samplesPerDoctor, setSamplesPerDoctor] = useState(0);
//   const [percentGivenToPatients, setPercentGivenToPatients] = useState(0);
//   const [samplesPerPatient, setSamplesPerPatient] = useState(0);
//   const [percentPrescribed, setPercentPrescribed] = useState(0);
//   const [percentWouldBePrescribed, setPercentWouldBePrescribed] = useState(0);
//   const [valuePerPatient, setValuePerPatient] = useState(0);
//   const [costPerSample, setCostPerSample] = useState(0);
//   const [fixedCosts, setFixedCosts] = useState(0);
//   const [year, setYear] = useState(null);

//   const [activityNumber, setActivityNumber] = useState(null);
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [interpretation, setInterpretation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false);
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const match = location.pathname.match(/CalculateAct(\d+)/);
//     const foundActivityNumber = match ? parseInt(match[1]) : null;
//     setActivityNumber(foundActivityNumber);
//     document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

//     axiosInstance
//       .get("getActivityItemsByActivityId/1")
//       .then((response) => setItems(response.data))
//       .catch((error) => {
//         console.error("Erreur lors du chargement des items :", error);
//         message.error("Impossible de charger les données de l'activité.");
//         setError("Erreur lors du chargement des données.");
//       });
//   }, [location.pathname]);

//   const handleReset = () => {
//     setNumDoctors(0);
//     setSamplesPerDoctor(0);
//     setPercentGivenToPatients(0);
//     setSamplesPerPatient(0);
//     setPercentPrescribed(0);
//     setPercentWouldBePrescribed(0);
//     setValuePerPatient(0);
//     setCostPerSample(0);
//     setFixedCosts(0);
//     setYear(null);
//     setCalculationResult(null);
//     setInterpretation(null);
//     setCalculated(false);
//     setError(null);
//   };

//   const validateNumeric = (value, min, max = null) => {
//     const num = Number(value);
//     if (isNaN(num)) return false;
//     if (num < min) return false;
//     if (max !== null && num > max) return false;
//     return true;
//   };

//   const isFormValid = () =>
//     validateNumeric(numDoctors, 0) &&
//     validateNumeric(samplesPerDoctor, 0) &&
//     validateNumeric(percentGivenToPatients, 0, 100) &&
//     validateNumeric(samplesPerPatient, 0.1) &&
//     validateNumeric(percentPrescribed, 0, 100) &&
//     validateNumeric(percentWouldBePrescribed, 0, 100) &&
//     validateNumeric(valuePerPatient, 0) &&
//     validateNumeric(costPerSample, 0) &&
//     validateNumeric(fixedCosts, 0) &&
//     !!year;

//   const generateInterpretation = async (result) => {
//     try {
//       const response = await axiosInstance.post("/generate-interpretation", {
//         roi: result.roi,
//         totalSamples: result.total_samples_distributed,
//         totalPatientsWithSample: result.total_patients_received_samples,
//         totalPatientsWithPrescription: result.patients_prescribed_after_sample,
//         totalIncrementalPatients: result.incremental_patients,
//         incrementalRevenue: result.incremental_sales,
//         totalCost: result.total_cost,
//         totalSamplesCost: result.variable_cost,
//         numDoctors,
//         samplesPerDoctor,
//         percentGivenToPatients,
//         samplesPerPatient,
//         percentPrescribed,
//         percentWouldBePrescribed,
//         valuePerPatient,
//         costPerSample,
//         fixedCosts,
//       });

//       return response.data.interpretation;
//     } catch (error) {
//       console.error(
//         "Erreur lors de la génération de l'interprétation :",
//         error
//       );
//       return null; // Return null to indicate failure
//     }
//   };

//   const calculateRoi = async () => {
//     if (!validateNumeric(numDoctors, 0))
//       return message.error(
//         "Nombre de médecins recevant des échantillons invalide"
//       );
//     if (!validateNumeric(samplesPerDoctor, 0))
//       return message.error("Nombre d'échantillons par médecin invalide");
//     if (!validateNumeric(percentGivenToPatients, 0, 100))
//       return message.error(
//         "Pourcentage des échantillons réellement donnés aux patients invalide"
//       );
//     if (!validateNumeric(samplesPerPatient, 0.1))
//       return message.error("Nombre moyen d'échantillons par patient invalide");
//     if (!validateNumeric(percentPrescribed, 0, 100))
//       return message.error(
//         "Pourcentage des patients ayant reçu une prescription invalide"
//       );
//     if (!validateNumeric(percentWouldBePrescribed, 0, 100))
//       return message.error(
//         "Pourcentage des patients prescrits sans échantillon invalide"
//       );
//     if (!validateNumeric(valuePerPatient, 0))
//       return message.error("Valeur moyenne d'un patient incrémental invalide");
//     if (!validateNumeric(costPerSample, 0))
//       return message.error("Coût unitaire d'un échantillon invalide");
//     if (!validateNumeric(fixedCosts, 0))
//       return message.error("Coûts fixes du programme invalides");

//     if (!activityNumber) {
//       return message.error("Le numéro d’activité est manquant.");
//     }

//     if (!items || items.length < 9) {
//       return message.error(
//         "Les données des items d'activité ne sont pas disponibles."
//       );
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const formData = {
//         activityId: activityNumber,
//         year,
//         A: parseFloat(numDoctors),
//         B: parseFloat(samplesPerDoctor),
//         D: parseFloat(percentGivenToPatients),
//         E: parseFloat(samplesPerPatient),
//         G: parseFloat(percentPrescribed),
//         I: parseFloat(percentWouldBePrescribed),
//         K: parseFloat(valuePerPatient),
//         M: parseFloat(costPerSample),
//         N: parseFloat(fixedCosts),
//         id_A: items[0]?.id,
//         id_B: items[1]?.id,
//         id_D: items[2]?.id,
//         id_E: items[3]?.id,
//         id_G: items[4]?.id,
//         id_I: items[5]?.id,
//         id_K: items[6]?.id,
//         id_M: items[7]?.id,
//         id_N: items[8]?.id,
//       };

//       const response = await axiosInstance.post("calculateRoi", formData);

//       const result = {
//         roi: response.data.ROI,
//         total_samples_distributed:
//           response.data.results.total_samples_distributed,
//         total_patients_received_samples:
//           response.data.results.total_patients_received_samples,
//         patients_prescribed_after_sample:
//           response.data.results.patients_prescribed_after_sample,
//         incremental_patients: response.data.results.incremental_patients,
//         incremental_sales: response.data.results.incremental_sales,
//         total_cost: response.data.results.total_cost,
//         variable_cost: response.data.results.variable_cost,
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
//       console.error("Erreur lors du calcul du ROI :", error);
//       setError(
//         error.response?.data?.message ||
//           "Erreur lors du calcul du ROI. Veuillez réessayer."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!items || items.length < 10) {
//       return message.error(
//         "Les données nécessaires ne sont pas encore disponibles."
//       );
//     }

//     if (!activityNumber) {
//       return message.error("Le numéro d’activité est manquant.");
//     }

//     const formData = {
//       year,
//       A: parseFloat(numDoctors),
//       B: parseFloat(samplesPerDoctor),
//       D: parseFloat(percentGivenToPatients),
//       E: parseFloat(samplesPerPatient),
//       G: parseFloat(percentPrescribed),
//       I: parseFloat(percentWouldBePrescribed),
//       K: parseFloat(valuePerPatient),
//       M: parseFloat(costPerSample),
//       N: parseFloat(fixedCosts),
//       id_A: items[0]?.id,
//       id_B: items[1]?.id,
//       id_D: items[2]?.id,
//       id_E: items[3]?.id,
//       id_G: items[4]?.id,
//       id_I: items[5]?.id,
//       id_K: items[6]?.id,
//       id_M: items[7]?.id,
//       id_N: items[8]?.id,
//       id_ROI: items[9]?.id,
//     };

//     try {
//       const response = await axiosInstance.post(
//         "/insertActivityData",
//         formData
//       );

//       if (response.status === 201) {
//         message.success("Les données ont été insérées avec succès.");
//         deleteCookie("activityNumber");
//         deleteCookie("activityId");
//         navigate("/CreateActivity");
//       } else {
//         message.error("Une erreur est survenue lors de l'insertion.");
//       }
//     } catch (error) {
//       console.error("Erreur lors de l’envoi du formulaire :", error);
//       if (error.response?.data?.message) {
//         message.error(error.response.data.message);
//       } else {
//         message.error("Erreur lors de la communication avec le serveur.");
//       }
//       setError("Erreur lors de l’envoi du formulaire.");
//     }
//   };

//   if (error) {
//     return (
//       <Layout className="min-h-screen">
//         <TheHeader />
//         <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
//           <Alert
//             message="Erreur"
//             description={error}
//             type="error"
//             showIcon
//             style={{ maxWidth: 800, margin: "0 auto" }}
//           />
//         </Content>
//       </Layout>
//     );
//   }

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
//                     value={calculationResult.roi * 100}
//                     precision={2}
//                     suffix="%"
//                     valueStyle={{
//                       color: calculationResult.roi >= 1 ? "#3f8600" : "#cf1322",
//                     }}
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Valeur Totale"
//                     value={calculationResult.incremental_sales}
//                     precision={2}
//                     suffix=" MAD"
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Coût Total"
//                     value={calculationResult.total_cost}
//                     precision={2}
//                     suffix=" MAD"
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Nombre total d’échantillons distribués"
//                     value={calculationResult.total_samples_distributed}
//                     precision={0}
//                     suffix=" Echantillons"
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Nombre total de patients ayant reçu un échantillon"
//                     value={calculationResult.total_patients_received_samples}
//                     precision={0}
//                     suffix=" Patient"
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Nombre total de patients obtenant une prescription"
//                     value={calculationResult.patients_prescribed_after_sample}
//                     precision={0}
//                     suffix=" Patient"
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Nombre total de patients incrémentaux gagnés grâce aux échantillons"
//                     value={calculationResult.incremental_patients}
//                     precision={0}
//                     suffix=" Patient"
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Coût total des échantillons distribués"
//                     value={calculationResult.variable_cost}
//                     precision={2}
//                     suffix=" MAD"
//                   />
//                 </Card>
//               </div>

//               {calculationResult.roi < 1 && (
//                 <Alert
//                   style={{ marginTop: "16px" }}
//                   message="ROI Négatif ou Faible"
//                   description="Le programme génère un retour insuffisant. Consultez les conseils ci-dessous pour améliorer vos résultats."
//                   type="warning"
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
//                 Distribution des échantillons
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label>
//                     Nombre de médecins recevant des échantillons (A)
//                   </label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={numDoctors}
//                     onChange={(e) => setNumDoctors(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Nombre d'échantillons par médecin (B)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={samplesPerDoctor}
//                     onChange={(e) =>
//                       setSamplesPerDoctor(Number(e.target.value))
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label>% des échantillons donnés aux patients (D)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentGivenToPatients}
//                     onChange={(e) =>
//                       setPercentGivenToPatients(Number(e.target.value))
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label>Nombre moyen d'échantillons par patient (E)</label>
//                   <Input
//                     type="number"
//                     min="0.1"
//                     step="0.1"
//                     value={samplesPerPatient}
//                     onChange={(e) =>
//                       setSamplesPerPatient(Number(e.target.value))
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label>
//                     % des patients avec prescription après usage (G)
//                   </label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentPrescribed}
//                     onChange={(e) =>
//                       setPercentPrescribed(Number(e.target.value))
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label>% des patients prescrits sans échantillon (I)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentWouldBePrescribed}
//                     onChange={(e) =>
//                       setPercentWouldBePrescribed(Number(e.target.value))
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label>Valeur moyenne d'un patient incrémental MAD (K)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={valuePerPatient}
//                     onChange={(e) => setValuePerPatient(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Coût unitaire d'un échantillon MAD (M)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={costPerSample}
//                     onChange={(e) => setCostPerSample(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label>Coûts fixes du programme MAD (N)</label>
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
//                   type="button"
//                   onClick={calculateRoi}
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
//                   style={{ backgroundColor: "#1890ff" }}
//                   type="submit"
//                   disabled={loading || !calculated || !isFormValid()}
//                 >
//                   <CheckCircleOutlined /> Insérer les données
//                 </Button>
//                 <div className="flex gap-4">
//                   <Button variant="outline" type="button" onClick={handleReset}>
//                     <ReloadOutlined /> Réinitialiser
//                   </Button>
//                   <Link to="../CreateActivity">
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

// export default CalculateAct1;

/** */


// import React, { useState, useEffect } from "react";
// import {
//   Layout,
//   Typography,
//   Card,
//   Divider,
//   Statistic,
//   message,
//   Alert,
//   Spin,
//   DatePicker,
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

// const CalculateAct1 = () => {
//   const [formData, setFormData] = useState({});
//   const [year, setYear] = useState(null);
//   const [activityNumber, setActivityNumber] = useState(null);
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [interpretation, setInterpretation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false);
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const match = location.pathname.match(/CalculateAct(\d+)/);
//     const foundActivityNumber = match ? parseInt(match[1]) : null;
//     setActivityNumber(foundActivityNumber);
//     document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

//     axiosInstance
//       .get('getActivityItemsByActivityIdall')
//       .then((response) => {
//         setItems(response.data);
//         // Initialize formData with default values for each item
//         const initialFormData = {};
//         response.data.forEach((item) => {
//           if (item.Name !== "Roi") {
//             initialFormData[item.symbole] = 0;
//           }
//         });
//         setFormData(initialFormData);
//       })
//       .catch((error) => {
//         console.error("Erreur lors du chargement des items :", error);
//         message.error("Impossible de charger les données de l'activité.");
//         setError("Erreur lors du chargement des données.");
//       });
//   }, [location.pathname]);

//   const handleReset = () => {
//     const resetFormData = {};
//     items.forEach((item) => {
//       if (item.Name !== "Roi") {
//         resetFormData[item.symbole] = 0;
//       }
//     });
//     setFormData(resetFormData);
//     setYear(null);
//     setCalculationResult(null);
//     setInterpretation(null);
//     setCalculated(false);
//     setError(null);
//   };

//   const validateNumeric = (value, min, max = null) => {
//     const num = Number(value);
//     if (isNaN(num)) return false;
//     if (num < min) return false;
//     if (max !== null && num > max) return false;
//     return true;
//   };

//   const isFormValid = () => {
//     if (!year) return false;
//     return items.every((item) => {
//       if (item.Name === "Roi") return true;
//       const value = formData[item.symbole];
//       return item.Type === "percentage"
//         ? validateNumeric(value, 0, 100)
//         : validateNumeric(value, item.symbole === "E" ? 0.1 : 0);
//     });
//   };

//   const generateInterpretation = async (result) => {
//     try {
//       const payload = {
//         roi: result.roi,
//         ...result,
//         ...formData,
//       };
//       const response = await axiosInstance.post("/generate-interpretation", payload);
//       return response.data.interpretation;
//     } catch (error) {
//       console.error("Erreur lors de la génération de l'interprétation :", error);
//       return null;
//     }
//   };

//   const calculateRoi = async () => {
//     for (const item of items) {
//       if (item.Name === "Roi") continue;
//       const value = formData[item.symbole];
//       if (item.Type === "percentage" && !validateNumeric(value, 0, 100)) {
//         return message.error(`"${item.Name}" doit être entre 0 et 100.`);
//       }
//       if (item.Type === "number" && !validateNumeric(value, item.symbole === "E" ? 0.1 : 0)) {
//         return message.error(`"${item.Name}" doit être ${item.symbole === "E" ? "supérieur à 0.1" : "non négatif"}.`);
//       }
//     }

//     if (!activityNumber) {
//       return message.error("Le numéro d’activité est manquant.");
//     }

//     if (!items || items.length === 0) {
//       return message.error("Les données des items d'activité ne sont pas disponibles.");
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const payload = {
//         activityId: activityNumber,
//         year,
//         ...formData,
//       };
//       items.forEach((item) => {
//         if (item.Name !== "Roi") {
//           payload[`id_${item.symbole}`] = item.id;
//         } else {
//           payload.id_ROI = item.id;
//         }
//       });

//       const response = await axiosInstance.post("calculateRoi", payload);

//       const result = {
//         roi: response.data.ROI,
//         ...response.data.results,
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
//       console.error("Erreur lors du calcul du ROI :", error);
//       setError(
//         error.response?.data?.message ||
//           "Erreur lors du calcul du ROI. Veuillez réessayer."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!items || items.length === 0) {
//       return message.error("Les données nécessaires ne sont pas encore disponibles.");
//     }

//     if (!activityNumber) {
//       return message.error("Le numéro d’activité est manquant.");
//     }

//     try {
//       const payload = {
//         year,
//         ...formData,
//       };
//       items.forEach((item) => {
//         if (item.Name !== "Roi") {
//           payload[`id_${item.symbole}`] = item.id;
//         } else {
//           payload.id_ROI = item.id;
//         }
//       });

//       const response = await axiosInstance.post("/insertActivityData", payload);

//       if (response.status === 201) {
//         message.success("Les données ont été insérées avec succès.");
//         deleteCookie("activityNumber");
//         deleteCookie("activityId");
//         navigate("/CreateActivity");
//       } else {
//         message.error("Une erreur est survenue lors de l'insertion.");
//       }
//     } catch (error) {
//       console.error("Erreur lors de l’envoi du formulaire :", error);
//       if (error.response?.data?.message) {
//         message.error(error.response.data.message);
//       } else {
//         message.error("Erreur lors de la communication avec le serveur.");
//       }
//       setError("Erreur lors de l’envoi du formulaire.");
//     }
//   };

//   if (error) {
//     return (
//       <Layout className="min-h-screen">
//         <TheHeader />
//         <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
//           <Alert
//             message="Erreur"
//             description={error}
//             type="error"
//             showIcon
//             style={{ maxWidth: 800, margin: "0 auto" }}
//           />
//         </Content>
//       </Layout>
//     );
//   }

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
//                     value={calculationResult.roi * 100}
//                     precision={2}
//                     suffix="%"
//                     valueStyle={{
//                       color: calculationResult.roi >= 1 ? "#3f8600" : "#cf1322",
//                     }}
//                   />
//                 </Card>
//                 {Object.entries(calculationResult)
//                   .filter(([key]) => key !== "roi")
//                   .map(([key, value]) => (
//                     <Card key={key}>
//                       <Statistic
//                         title={key
//                           .replace(/_/g, " ")
//                           .replace(/\b\w/g, (c) => c.toUpperCase())}
//                         value={value}
//                         precision={key.includes("cost") || key.includes("sales") ? 2 : 0}
//                         suffix={key.includes("cost") || key.includes("sales") ? " MAD" : key.includes("patients") || key.includes("doctors") ? " Personnes" : key.includes("samples") ? " Échantillons" : ""}
//                       />
//                     </Card>
//                   ))}
//               </div>

//               {calculationResult.roi < 1 && (
//                 <Alert
//                   style={{ marginTop: "16px" }}
//                   message="ROI Négatif ou Faible"
//                   description="Le programme génère un retour insuffisant. Consultez les conseils ci-dessous pour améliorer vos résultats."
//                   type="warning"
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
//                 {items.length > 0
//                   ? items[0]?.Name || "Distribution des échantillons"
//                   : "Distribution des échantillons"}
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {items
//                   .filter((item) => item.Name !== "Roi")
//                   .map((item) => (
//                     <div key={item.id}>
//                       <label>{item.Name} ({item.symbole})</label>
//                       <Input
//                         type="number"
//                         min={item.Type === "percentage" ? "0" : item.symbole === "E" ? "0.1" : "0"}
//                         max={item.Type === "percentage" ? "100" : undefined}
//                         step={item.symbole === "E" ? "0.1" : "1"}
//                         value={formData[item.symbole] || 0}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             [item.symbole]: Number(e.target.value),
//                           })
//                         }
//                       />
//                     </div>
//                   ))}
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
//                   type="button"
//                   onClick={calculateRoi}
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
//                   style={{ backgroundColor: "#1890ff" }}
//                   type="submit"
//                   disabled={loading || !calculated || !isFormValid()}
//                 >
//                   <CheckCircleOutlined /> Insérer les données
//                 </Button>
//                 <div className="flex gap-4">
//                   <Button variant="outline" type="button" onClick={handleReset}>
//                     <ReloadOutlined /> Réinitialiser
//                   </Button>
//                   <Link to="../CreateActivity">
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

// export default CalculateAct1;

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
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TheHeader from "../Header/Header";
import axiosInstance, { deleteCookie, getCookie } from "../../axiosConfig";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct1 = () => {
  const [formData, setFormData] = useState({});
  const [year, setYear] = useState(null);
  const [activityNumber, setActivityNumber] = useState(null);
  const [activityName, setActivityName] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve activityNumber from cookie
    const activityNum = getCookie("activityNumber");
    if (!activityNum || activityNum === "Autre activité") {
      setError("Aucune activité sélectionnée ou activité non valide.");
      return;
    }
    setActivityNumber(activityNum);

    // Fetch activity items
    axiosInstance
      .get("getActivityItemsByActivityIdall")
      .then((response) => {
        setItems(response.data.items);
        setActivityName(response.data.activityName);
        // Initialize formData with default values for each item
        const initialFormData = {};
        response.data.items.forEach((item) => {
          if (item.itemName !== "Roi") {
            initialFormData[item.symbole] = 0;
          }
        });
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des items :", error);
        message.error("Impossible de charger les données de l'activité.");
        setError("Erreur lors du chargement des données.");
      });
  }, []);

  const handleReset = () => {
    const resetFormData = {};
    items.forEach((item) => {
      if (item.itemName !== "Roi") {
        resetFormData[item.symbole] = 0;
      }
    });
    setFormData(resetFormData);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
    setError(null);
  };

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const isFormValid = () => {
    if (!year) return false;
    return items.every((item) => {
      if (item.itemName === "Roi") return true;
      const value = formData[item.symbole];
      return item.Type === "percentage"
        ? validateNumeric(value, 0, 100)
        : validateNumeric(value, item.symbole === "E" ? 0.1 : 0);
    });
  };

  const generateInterpretation = async (result) => {
    try {
      const payload = {
        roi: result.roi,
        ...result,
        ...formData,
      };
      const response = await axiosInstance.post("/generate-interpretation", payload);
      return response.data.interpretation;
    } catch (error) {
      console.error("Erreur lors de la génération de l'interprétation :", error);
      return null;
    }
  };

  const calculateRoi = async () => {
    for (const item of items) {
      if (item.itemName === "Roi") continue;
      const value = formData[item.symbole];
      if (item.Type === "percentage" && !validateNumeric(value, 0, 100)) {
        return message.error(`"${item.itemName}" doit être entre 0 et 100.`);
      }
      if (item.Type === "number" && !validateNumeric(value, item.symbole === "E" ? 0.1 : 0)) {
        return message.error(`"${item.itemName}" doit être ${item.symbole === "E" ? "supérieur à 0.1" : "non négatif"}.`);
      }
    }

    if (!activityNumber) {
      return message.error("Le numéro d’activité est manquant.");
    }

    if (!items || items.length === 0) {
      return message.error("Les données des items d'activité ne sont pas disponibles.");
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        activityId: activityNumber,
        year,
        ...formData,
      };
      items.forEach((item) => {
        if (item.itemName !== "Roi") {
          payload[`id_${item.symbole}`] = item.id;
        } else {
          payload.id_ROI = item.id;
        }
      });

      const response = await axiosInstance.post("calculateRoi", payload);

      const result = {
        roi: response.data.ROI,
        ...response.data.results,
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
      setError(
        error.response?.data?.message ||
          "Erreur lors du calcul du ROI. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items || items.length === 0) {
      return message.error("Les données nécessaires ne sont pas encore disponibles.");
    }

    if (!activityNumber) {
      return message.error("Le numéro d’activité est manquant.");
    }

    try {
      const payload = {
        year,
        ...formData,
      };
      items.forEach((item) => {
        if (item.itemName !== "Roi") {
          payload[`id_${item.symbole}`] = item.id;
        } else {
          payload.id_ROI = item.id;
        }
      });

      const response = await axiosInstance.post("/insertActivityData", payload);

      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/CreateActivity");
      } else {
        message.error("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.error("Erreur lors de l’envoi du formulaire :", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Erreur lors de la communication avec le serveur.");
      }
      setError("Erreur lors de l’envoi du formulaire.");
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
                    value={calculationResult.roi * 100}
                    precision={2}
                    suffix="%"
                    valueStyle={{
                      color: calculationResult.roi >= 1 ? "#3f8600" : "#cf1322",
                    }}
                  />
                </Card>
                {Object.entries(calculationResult)
                  .filter(([key]) => key !== "roi")
                  .map(([key, value]) => (
                    <Card key={key}>
                      <Statistic
                        title={key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        value={value}
                        precision={key.includes("cost") || key.includes("sales") ? 2 : 0}
                        suffix={key.includes("cost") || key.includes("sales") ? " MAD" : key.includes("patients") || key.includes("doctors") ? " Personnes" : key.includes("samples") ? " Échantillons" : ""}
                      />
                    </Card>
                  ))}
              </div>

              {calculationResult.roi < 1 && (
                <Alert
                  style={{ marginTop: "16px" }}
                  message="ROI Négatif ou Faible"
                  description="Le programme génère un retour insuffisant. Consultez les conseils ci-dessous pour améliorer vos résultats."
                  type="warning"
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
                {activityName || "Activité sans nom"}
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items
                  .filter((item) => item.itemName !== "Roi")
                  .map((item) => (
                    <div key={item.id}>
                      <label>{item.itemName} </label>
                      <Input
                        type="number"
                        min={item.Type === "percentage" ? "0" : item.symbole === "E" ? "0.1" : "0"}
                        max={item.Type === "percentage" ? "100" : undefined}
                        step={item.symbole === "E" ? "0.1" : "1"}
                        value={formData[item.symbole] || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [item.symbole]: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  ))}
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
                  style={{ backgroundColor: "#1890ff" }}
                  type="submit"
                  disabled={loading || !calculated || !isFormValid()}
                >
                  <CheckCircleOutlined /> Insérer les données
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleReset}>
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

export default CalculateAct1;