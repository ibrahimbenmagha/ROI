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
// import axiosInstance from "../../axiosConfig";
// import {deleteCookie } from "../../axiosConfig";

// import { Axis3DIcon } from "lucide-react";

// const { Header, Content } = Layout;
// const { Title, Text } = Typography;

// const CalculateAct1 = () => {
//   const [numDoctors, setNumDoctors] = useState();
//   const [samplesPerDoctor, setSamplesPerDoctor] = useState();
//   const [percentGivenToPatients, setPercentGivenToPatients] = useState();
//   const [samplesPerPatient, setSamplesPerPatient] = useState();
//   const [percentPrescribed, setPercentPrescribed] = useState();
//   const [percentWouldBePrescribed, setPercentWouldBePrescribed] = useState();
//   const [valuePerPatient, setValuePerPatient] = useState();
//   const [costPerSample, setCostPerSample] = useState();
//   const [fixedCosts, setFixedCosts] = useState();

//   // État pour stocker les résultats
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false); // Nouvel état pour suivre l'état du calcul
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
//       // Réinitialiser l'indicateur après le rechargement
//       sessionStorage.removeItem("reloaded");
//     }
//     axiosInstance
//       .get("getActivityItemsByActivityId/1")
//       .then((response) => {
//         setItems(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching activities:", error);
//       });
//   }, []);

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
//     setCalculationResult(null);
//     setCalculated(false); // Réinitialiser l'état calculé lorsque la réinitialisation se produit
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Empêche la soumission par défaut du formulaire

//     if (items.length === 0) {
//       alert("Les données nécessaires ne sont pas encore disponibles.");
//       return;
//     }
//     const formData = {
//       A: numDoctors,
//       B: samplesPerDoctor,
//       D: percentGivenToPatients,
//       E: samplesPerPatient,
//       G: percentPrescribed,
//       I: percentWouldBePrescribed,
//       K: valuePerPatient,
//       M: costPerSample,
//       N: fixedCosts,
//       id_A: items[0]?.id, // Utilisation de l'ID dynamique de items
//       id_B: items[1]?.id, // Utilisation de l'ID dynamique de items
//       id_D: items[2]?.id, // Utilisation de l'ID dynamique de items
//       id_E: items[3]?.id, // Utilisation de l'ID dynamique de items
//       id_G: items[4]?.id, // Utilisation de l'ID dynamique de items
//       id_I: items[5]?.id, // Utilisation de l'ID dynamique de items
//       id_K: items[6]?.id, // Utilisation de l'ID dynamique de items
//       id_M: items[7]?.id, // Utilisation de l'ID dynamique de items
//       id_N: items[8]?.id, // Utilisation de l'ID dynamique de items
//       id_ROI: items[9]?.id, // Utilisation de l'ID dynamique de items
//     };

//     try {
//       const response = await axiosInstance.post("insetrIntoTable1", formData);
//           if (response.status === 201) {
//             message.success("Les données ont été insérées avec succès.");
//             deleteCookie("activityNumber");
//             deleteCookie("activityId");

//             navigate("/DisplayActivity");
//           } else {
//             alert("Une erreur est survenue lors de l'insertion.");
//           }
//         } catch (error) {
//           console.log(error);
//           if (error.response) {
//             alert(
//               error.response.data.message ||
//                 "Une erreur est survenue lors de l'insertion."
//             );
//           } else if (error.request) {
//             alert("Aucune réponse reçue du serveur.");
//           } else {
//             alert("Une erreur est survenue lors de l'envoi de la requête.");
//           }
//         }
//   };

//   const validateNumeric = (value, min, max = null) => {
//     const num = Number(value);
//     if (isNaN(num)) return false;
//     if (num < min) return false;
//     if (max !== null && num > max) return false;
//     return true;
//   };

//   const calculateRoi = async () => {
//     if (!validateNumeric(numDoctors, 0))
//       return alert("Nombre de médecins invalide");
//     if (!validateNumeric(samplesPerDoctor, 0))
//       return alert("Nombre d'échantillons par médecin invalide");
//     if (!validateNumeric(percentGivenToPatients, 0, 100))
//       return alert("Pourcentage donné aux patients invalide");
//     if (!validateNumeric(samplesPerPatient, 0.1))
//       return alert("Nombre d'échantillons par patient invalide");
//     if (!validateNumeric(percentPrescribed, 0, 100))
//       return alert("Pourcentage prescrit invalide");
//     if (!validateNumeric(percentWouldBePrescribed, 0, 100))
//       return alert("Pourcentage qui serait prescrit invalide");
//     if (!validateNumeric(valuePerPatient, 0))
//       return alert("Valeur par patient invalide");
//     if (!validateNumeric(costPerSample, 0))
//       return alert("Coût par échantillon invalide");
//     if (!validateNumeric(fixedCosts, 0)) return alert("Coûts fixes invalides");

//     setLoading(true);

//     try {
//       const response = await axiosInstance.post("calculateROIAct1", {
//         A: numDoctors,
//         B: samplesPerDoctor,
//         D: percentGivenToPatients,
//         E: samplesPerPatient,
//         G: percentPrescribed,
//         I: percentWouldBePrescribed,
//         K: valuePerPatient,
//         M: costPerSample,
//         N: fixedCosts,
//       });

//       setCalculationResult(response.data);
//       setCalculated(true); // Mettre à jour l'état calculé une fois que les résultats sont reçus
//     } catch (error) {
//       alert("Error calculating ROI. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout className="min-h-screen">
//       <TheHeader />

//       <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
//         <div style={{ maxWidth: 800, margin: "0 auto" }}>
//           <form type="submit" onSubmit={handleSubmit}>
//             <Card>
//               <Title level={4} style={{ textAlign: "center" }}>
//                 Distribution des échantillons
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label
//                     htmlFor="numDoctors"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nombre de médecins recevant des échantillons (A)
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

//                 {/* B - Nombre d'échantillons par médecin */}
//                 <div>
//                   <label
//                     htmlFor="samplesPerDoctor"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nombre d'échantillons par médecin (B)
//                   </label>
//                   <Input
//                     id="samplesPerDoctor"
//                     type="number"
//                     min="0"
//                     value={samplesPerDoctor}
//                     onChange={(e) =>
//                       setSamplesPerDoctor(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="percentGivenToPatients"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     % des échantillons donnés aux patients (D)
//                   </label>
//                   <Input
//                     id="percentGivenToPatients"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentGivenToPatients}
//                     onChange={(e) =>
//                       setPercentGivenToPatients(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* E - Nombre moyen d'échantillons par patient */}
//                 <div>
//                   <label
//                     htmlFor="samplesPerPatient"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Nombre moyen d'échantillons par patient (E)
//                   </label>
//                   <Input
//                     id="samplesPerPatient"
//                     type="number"
//                     min="0.1"
//                     step="0.1"
//                     value={samplesPerPatient}
//                     onChange={(e) =>
//                       setSamplesPerPatient(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="percentPrescribed"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     % des patients avec prescription après usage (G)
//                   </label>
//                   <Input
//                     id="percentPrescribed"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentPrescribed}
//                     onChange={(e) =>
//                       setPercentPrescribed(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* I - % des patients prescrits sans échantillon */}
//                 <div>
//                   <label
//                     htmlFor="percentWouldBePrescribed"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     % des patients prescrits sans échantillon (I)
//                   </label>
//                   <Input
//                     id="percentWouldBePrescribed"
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentWouldBePrescribed}
//                     onChange={(e) =>
//                       setPercentWouldBePrescribed(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 {/* K - Valeur moyenne d'un patient incrémental € */}
//                 <div>
//                   <label
//                     htmlFor="valuePerPatient"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Valeur moyenne d'un patient incrémental € (K)
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

//                 {/* M - Coût unitaire d'un échantillon € */}
//                 <div>
//                   <label
//                     htmlFor="costPerSample"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Coût unitaire d'un échantillon € (M)
//                   </label>
//                   <Input
//                     id="costPerSample"
//                     type="number"
//                     min="0"
//                     value={costPerSample}
//                     onChange={(e) => setCostPerSample(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* N - Coûts fixes du programme € */}
//                 <div>
//                   <label
//                     htmlFor="fixedCosts"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Coûts fixes du programme € (N)
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
//                       Inserer les donnees
//                     </>
//                   )}
//                 </Button>

//                 <div className="flex gap-4">
//                   <Button variant="outline" onClick={handleReset}>
//                     <ReloadOutlined className="mr-2" />
//                     Réinitialiser
//                   </Button>
//                   <Link to="../DisplayActivity">
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
//                         value={calculationResult.ROI}
//                         precision={2}
//                         suffix="%"
//                         valueStyle={{
//                           color:
//                             calculationResult.ROI >= 0 ? "#3f8600" : "#cf1322",
//                         }}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Valeur Totale"
//                         value={calculationResult.L}
//                         precision={2}
//                         suffix="€"
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Coût Total"
//                         value={calculationResult.O}
//                         precision={2}
//                         suffix="€"
//                       />
//                     </Card>
//                   </div>

//                   <Card className="mt-4">
//                     <Statistic
//                       title="Patients Incrémentaux"
//                       value={calculationResult.J}
//                       precision={0}
//                     />
//                     <Text type="secondary">
//                       Nombre estimé de patients additionnels ayant reçu une
//                       prescription grâce au programme d'échantillons.
//                     </Text>
//                   </Card>

//                   {calculationResult.ROI < 0 && (
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

const { Content } = Layout;
const { Title, Text } = Typography;

const CalculateAct1 = () => {
  const [numDoctors, setNumDoctors] = useState();
  const [samplesPerDoctor, setSamplesPerDoctor] = useState();
  const [percentGivenToPatients, setPercentGivenToPatients] = useState();
  const [samplesPerPatient, setSamplesPerPatient] = useState();
  const [percentPrescribed, setPercentPrescribed] = useState();
  const [percentWouldBePrescribed, setPercentWouldBePrescribed] = useState();
  const [valuePerPatient, setValuePerPatient] = useState();
  const [costPerSample, setCostPerSample] = useState();
  const [fixedCosts, setFixedCosts] = useState();

  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
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
      .get("getActivityItemsByActivityId/1")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  const handleReset = () => {
    setNumDoctors(0);
    setSamplesPerDoctor(0);
    setPercentGivenToPatients(0);
    setSamplesPerPatient(0);
    setPercentPrescribed(0);
    setPercentWouldBePrescribed(0);
    setValuePerPatient(0);
    setCostPerSample(0);
    setFixedCosts(0);
    setCalculationResult(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Les données nécessaires ne sont pas encore disponibles.");
      return;
    }

    const formData = {
      A: numDoctors,
      B: samplesPerDoctor,
      D: percentGivenToPatients,
      E: samplesPerPatient,
      G: percentPrescribed,
      I: percentWouldBePrescribed,
      K: valuePerPatient,
      M: costPerSample,
      N: fixedCosts,
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_E: items[3]?.id,
      id_G: items[4]?.id,
      id_I: items[5]?.id,
      id_K: items[6]?.id,
      id_M: items[7]?.id,
      id_N: items[8]?.id,
      id_ROI: items[9]?.id,
    };

    try {
      const response = await axiosInstance.post("insetrIntoTable1", formData);
      if (response.status === 201) {
        message.success("Les données ont été insérées avec succès.");
        deleteCookie("activityNumber");
        deleteCookie("activityId");
        navigate("/DisplayActivity");
      } else {
        alert("Une erreur est survenue lors de l'insertion.");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        alert(
          error.response.data.message ||
            "Une erreur est survenue lors de l'insertion."
        );
      } else if (error.request) {
        alert("Aucune réponse reçue du serveur.");
      } else {
        alert("Une erreur est survenue lors de l'envoi de la requête.");
      }
    }
  };

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const calculateRoi = async () => {
    if (!validateNumeric(numDoctors, 0))
      return alert("Nombre de médecins invalide");
    if (!validateNumeric(samplesPerDoctor, 0))
      return alert("Nombre d'échantillons par médecin invalide");
    if (!validateNumeric(percentGivenToPatients, 0, 100))
      return alert("Pourcentage donné aux patients invalide");
    if (!validateNumeric(samplesPerPatient, 0.1))
      return alert("Nombre d'échantillons par patient invalide");
    if (!validateNumeric(percentPrescribed, 0, 100))
      return alert("Pourcentage prescrit invalide");
    if (!validateNumeric(percentWouldBePrescribed, 0, 100))
      return alert("Pourcentage qui serait prescrit invalide");
    if (!validateNumeric(valuePerPatient, 0))
      return alert("Valeur par patient invalide");
    if (!validateNumeric(costPerSample, 0))
      return alert("Coût par échantillon invalide");
    if (!validateNumeric(fixedCosts, 0)) return alert("Coûts fixes invalides");

    setLoading(true);

    try {
      const response = await axiosInstance.post("calculateROIAct1", {
        A: numDoctors,
        B: samplesPerDoctor,
        D: percentGivenToPatients,
        E: samplesPerPatient,
        G: percentPrescribed,
        I: percentWouldBePrescribed,
        K: valuePerPatient,
        M: costPerSample,
        N: fixedCosts,
      });

      console.log("ROI calculation response:", response.data);

      if (!response.data || !response.data.ROI) {
        alert("Les résultats du calcul ne sont pas valides.");
        return;
      }

      setCalculationResult(response.data);
      setCalculated(true);
    } catch (error) {
      alert("Erreur lors du calcul du ROI.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <TheHeader />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Distribution des échantillons
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1">
                    Nombre de médecins recevant des échantillons (A)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={numDoctors}
                    onChange={(e) => setNumDoctors(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Nombre d'échantillons par médecin (B)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={samplesPerDoctor}
                    onChange={(e) =>
                      setSamplesPerDoctor(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    % des échantillons donnés aux patients (D)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentGivenToPatients}
                    onChange={(e) =>
                      setPercentGivenToPatients(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Nombre moyen d'échantillons par patient (E)
                  </label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={samplesPerPatient}
                    onChange={(e) =>
                      setSamplesPerPatient(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    % des patients avec prescription après usage (G)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescribed}
                    onChange={(e) =>
                      setPercentPrescribed(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    % des patients prescrits sans échantillon (I)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentWouldBePrescribed}
                    onChange={(e) =>
                      setPercentWouldBePrescribed(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Valeur moyenne d'un patient incrémental € (K)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={valuePerPatient}
                    onChange={(e) => setValuePerPatient(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Coût unitaire d'un échantillon € (M)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={costPerSample}
                    onChange={(e) => setCostPerSample(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Coûts fixes du programme € (N)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(Number(e.target.value))}
                  />
                </div>
              </div>

              <Divider />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  onClick={calculateRoi}
                  className="bg-primary"
                  disabled={loading}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {loading ? <Spin size="small" /> : <><CalculatorOutlined /> Calculer ROI</>}
                </Button>

                <Button
                  type="submit"
                  className="bg-primary"
                  disabled={loading || !calculated}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CheckCircleOutlined /> Inserer les donnees
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="../DisplayActivity">
                    <Button variant="secondary">Retour</Button>
                  </Link>
                </div>
              </div>

              {calculationResult && (
                <div className="mt-8">
                  <Divider>Résultats</Divider>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                      <Statistic
                        title="ROI"
                        value={calculationResult.ROI}
                        precision={2}
                        suffix="%"
                        valueStyle={{
                          color:
                            calculationResult.ROI >= 0 ? "#3f8600" : "#cf1322",
                        }}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Valeur Totale"
                        value={calculationResult.L}
                        precision={2}
                        suffix="€"
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Coût Total"
                        value={calculationResult.O}
                        precision={2}
                        suffix="€"
                      />
                    </Card>
                  </div>

                  <Card className="mt-4">
                    <Statistic
                      title="Patients Incrémentaux"
                      value={calculationResult.J}
                      precision={0}
                    />
                    <Text type="secondary">
                      Nombre estimé de patients additionnels ayant reçu une prescription grâce au programme d'échantillons.
                    </Text>
                  </Card>

                  {calculationResult.ROI < 0 && (
                    <Alert
                      style={{ marginTop: "16px" }}
                      message="ROI Négatif"
                      description="Le programme génère actuellement un retour négatif sur investissement. Essayez d'ajuster les paramètres."
                      type="warning"
                      showIcon
                    />
                  )}
                </div>
              )}
            </Card>
          </form>
        </div>
      </Content>
    </Layout>
  );
};

export default CalculateAct1;
