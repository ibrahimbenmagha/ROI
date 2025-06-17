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
//   Tooltip, // Ajout de Tooltip pour le hover
// } from "antd";
// import {
//   CalculatorOutlined,
//   ReloadOutlined,
//   CheckCircleOutlined,
//   QuestionCircleOutlined, // Icône pour le bouton ?
// } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import TheHeader from "../Header/Header";
// import axiosInstance, { deleteCookie, getCookie } from "../../axiosConfig";
// import dayjs from "dayjs";

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const CalculateAct1 = () => {
//   const [formData, setFormData] = useState({});
//   const [year, setYear] = useState(null);
//   const [activityNumber, setActivityNumber] = useState(null);
//   const [activityName, setActivityName] = useState(null);
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [interpretation, setInterpretation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false);
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);
//   const [vpi, setVpi] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchVPI = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axiosInstance.get("getVPI", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setVpi(response.data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération du VPI :", error);
//         setVpi(null);
//       }
//     };

//     fetchVPI();
//   }, []);

//   useEffect(() => {
//     const activityNum = getCookie("activityNumber");
//     if (!activityNum || activityNum === "Autre activité") {
//       setError("Aucune activité sélectionnée ou activité non valide.");
//       return;
//     }
//     setActivityNumber(activityNum);

//     axiosInstance
//       .get("getActivityItemsByActivityIdall")
//       .then((response) => {
//         setItems(response.data.items);
//         setActivityName(response.data.activityName);
//         const initialFormData = {};
//         response.data.items.forEach((item) => {
//           if (item.itemName !== "Roi") {
//             initialFormData[item.symbole] =
//               item.itemName ===
//               "Valeur du revenu par patient incrémental en MAD"
//                 ? vpi || 0
//                 : 0;
//           }
//         });
//         setFormData(initialFormData);
//       })
//       .catch((error) => {
//         message.error("Impossible de charger les données de l'activité.");
//         setError("Erreur lors du chargement des données.");
//       });
//   }, [vpi]);

//   const handleReset = () => {
//     const resetFormData = {};
//     items.forEach((item) => {
//       if (item.itemName !== "Roi") {
//         resetFormData[item.symbole] =
//           item.itemName === "Valeur du revenu par patient incrémental en MAD"
//             ? vpi || 0
//             : 0;
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
//       if (item.itemName === "Roi") return true;
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
//       const response = await axiosInstance.post(
//         "/generate-interpretation",
//         payload
//       );
//       return response.data.interpretation;
//     } catch (error) {
//       return null;
//     }
//   };

//   const calculateRoi = async () => {
//     if (!year) {
//       return message.error(
//         "Veuillez sélectionner une année avant de calculer le ROI."
//       );
//     }

//     for (const item of items) {
//       if (item.itemName === "Roi") continue;
//       const value = formData[item.symbole];
//       if (item.Type === "percentage" && !validateNumeric(value, 0, 100)) {
//         return message.error(`"${item.itemName}" doit être entre 0 et 100.`);
//       }
//       if (
//         item.Type === "number" &&
//         !validateNumeric(value, item.symbole === "E" ? 0.1 : 0)
//       ) {
//         return message.error(
//           `"${item.itemName}" doit être ${
//             item.symbole === "E" ? "supérieur à 0.1" : "non négatif"
//           }.`
//         );
//       }
//     }

//     if (!activityNumber) {
//       return message.error("Le numéro d’activité est manquant.");
//     }

//     if (!items || items.length === 0) {
//       return message.error(
//         "Les données des items d'activité ne sont pas disponibles."
//       );
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const payload = {
//         activityId: activityNumber,
//         year,
//       };
//       items.forEach((item) => {
//         if (item.itemName !== "Roi") {
//           payload[item.symbole] =
//             item.Type === "percentage"
//               ? formData[item.symbole] / 100
//               : formData[item.symbole];
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
//       return message.error(
//         "Les données nécessaires ne sont pas encore disponibles."
//       );
//     }

//     if (!activityNumber) {
//       return message.error("Le numéro d’activité est manquant.");
//     }

//     if (!calculationResult) {
//       return message.error(
//         "Veuillez calculer le ROI avant d'insérer les données."
//       );
//     }

//     try {
//       const payload = {
//         activityId: activityNumber,
//         year,
//         roi: calculationResult.roi,
//       };
//       items.forEach((item) => {
//         if (item.itemName !== "Roi") {
//           payload[item.symbole] =
//             item.Type === "percentage"
//               ? formData[item.symbole] / 100
//               : formData[item.symbole];
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
//                         precision={
//                           key.includes("cost") || key.includes("sales") ? 2 : 0
//                         }
//                         suffix={
//                           key.includes("cost") || key.includes("sales")
//                             ? " MAD"
//                             : key.includes("patients") ||
//                               key.includes("doctors")
//                             ? " Personnes"
//                             : key.includes("samples")
//                             ? " Échantillons"
//                             : ""
//                         }
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
//                 {activityName || "Activité sans nom"}
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {items
//                   .filter((item) => item.itemName !== "Roi")
//                   .map((item) => (
//                     <div key={item.id}>
//                       <label>{item.itemName}</label>
//                       <div className="flex items-center gap-2">
//                         {/* Ajout du bouton ? avec Tooltip pour les benchmarks non null */}
//                         {(item.benchmark_min !== null || item.benchmark_max !== null) && (
//                           <Tooltip
//                             title={
//                               item.Type === "percentage"
//                                 ? `${item.benchmark_min * 100}%-${item.benchmark_max * 100}%`
//                                 : `${item.benchmark_min}-${item.benchmark_max}`
//                             }
//                           >
//                             <Button
//                               type="button"
//                               size="sm"
//                               style={{
//                                 padding: "0 8px",
//                                 height: "32px",
//                                 backgroundColor: "#f0f0f0",
//                               }}
//                             >
//                               <QuestionCircleOutlined />
//                             </Button>
//                           </Tooltip>
//                         )}
//                         <Input
//                           type="number"
//                           min={
//                             item.Type === "percentage"
//                               ? "0"
//                               : item.symbole === "E"
//                               ? "0.1"
//                               : "0"
//                           }
//                           max={item.Type === "percentage" ? "100" : undefined}
//                           step={item.symbole === "E" ? "0.1" : "1"}
//                           value={
//                             item.itemName ===
//                             "Valeur du revenu par patient incrémental en MAD"
//                               ? vpi !== null && vpi !== undefined
//                                 ? vpi
//                                 : 0
//                               : formData[item.symbole] || 0
//                           }
//                           disabled={
//                             item.itemName ===
//                             "Valeur du revenu par patient incrémental en MAD"
//                           }
//                           onChange={(e) =>
//                             item.itemName !==
//                               "Valeur du revenu par patient incrémental en MAD" &&
//                             setFormData({
//                               ...formData,
//                               [item.symbole]: Number(e.target.value),
//                             })
//                           }
//                         />
//                         {item.itemName ===
//                           "Valeur du revenu par patient incrémental en MAD" && (
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => navigate("/PatientIncremental")}
//                             style={{ backgroundColor: "#1890ff", height: "40px" }}
//                             title="Modifier la valeur du revenu par patient incrémental"
//                           >
//                             Éditer
//                           </Button>
//                         )}
//                       </div>
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
  Tooltip,
} from "antd";
import {
  CalculatorOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
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
  const [vpi, setVpi] = useState(null);
  const [benchmarkErrors, setBenchmarkErrors] = useState({}); // État pour les messages d'erreur des benchmarks
  const [roiBenchmarkError, setRoiBenchmarkError] = useState(null); // État pour l'erreur du ROI

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVPI = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("getVPI", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVpi(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du VPI :", error);
        setVpi(null);
      }
    };

    fetchVPI();
  }, []);

  useEffect(() => {
    const activityNum = getCookie("activityNumber");
    if (!activityNum || activityNum === "Autre activité") {
      setError("Aucune activité sélectionnée ou activité non valide.");
      return;
    }
    setActivityNumber(activityNum);

    axiosInstance
      .get("getActivityItemsByActivityIdall")
      .then((response) => {
        setItems(response.data.items);
        setActivityName(response.data.activityName);
        const initialFormData = {};
        response.data.items.forEach((item) => {
          if (item.itemName !== "Roi") {
            initialFormData[item.symbole] =
              item.itemName ===
              "Valeur du revenu par patient incrémental en MAD"
                ? vpi || 0
                : 0;
          }
        });
        setFormData(initialFormData);
      })
      .catch((error) => {
        message.error("Impossible de charger les données de l'activité.");
        setError("Erreur lors du chargement des données.");
      });
  }, [vpi]);

  const handleReset = () => {
    const resetFormData = {};
    items.forEach((item) => {
      if (item.itemName !== "Roi") {
        resetFormData[item.symbole] =
          item.itemName === "Valeur du revenu par patient incrémental en MAD"
            ? vpi || 0
            : 0;
      }
    });
    setFormData(resetFormData);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
    setError(null);
    setBenchmarkErrors({}); // Réinitialiser les erreurs de benchmarks
    setRoiBenchmarkError(null); // Réinitialiser l'erreur du ROI
  };

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const validateBenchmark = (value, item) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (
      item.benchmark_min !== null &&
      item.benchmark_max !== null &&
      (num < (item.Type === "percentage" ? item.benchmark_min * 100 : item.benchmark_min) ||
        num > (item.Type === "percentage" ? item.benchmark_max * 100 : item.benchmark_max))
    ) {
      return false;
    }
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
      const response = await axiosInstance.post(
        "/generate-interpretation",
        payload
      );
      return response.data.interpretation;
    } catch (error) {
      return null;
    }
  };

  const calculateRoi = async () => {
    if (!year) {
      return message.error(
        "Veuillez sélectionner une année avant de calculer le ROI."
      );
    }

    for (const item of items) {
      if (item.itemName === "Roi") continue;
      const value = formData[item.symbole];
      if (item.Type === "percentage" && !validateNumeric(value, 0, 100)) {
        return message.error(`"${item.itemName}" doit être entre 0 et 100.`);
      }
      if (
        item.Type === "number" &&
        !validateNumeric(value, item.symbole === "E" ? 0.1 : 0)
      ) {
        return message.error(
          `"${item.itemName}" doit être ${
            item.symbole === "E" ? "supérieur à 0.1" : "non négatif"
          }.`
        );
      }
    }

    if (!activityNumber) {
      return message.error("Le numéro d’activité est manquant.");
    }

    if (!items || items.length === 0) {
      return message.error(
        "Les données des items d'activité ne sont pas disponibles."
      );
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        activityId: activityNumber,
        year,
      };
      items.forEach((item) => {
        if (item.itemName !== "Roi") {
          payload[item.symbole] =
            item.Type === "percentage"
              ? formData[item.symbole] / 100
              : formData[item.symbole];
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

      // Vérifier si le ROI est hors des benchmarks
      const roiItem = items.find((item) => item.itemName === "Roi");
      if (
        roiItem &&
        roiItem.benchmark_min !== null &&
        roiItem.benchmark_max !== null &&
        (result.roi < roiItem.benchmark_min || result.roi > roiItem.benchmark_max)
      ) {
        setRoiBenchmarkError("Le ROI calculé est hors des benchmarks.");
      } else {
        setRoiBenchmarkError(null);
      }

      const interpretationText = await generateInterpretation(result);
      if (interpretationText) {
        setInterpretation(interpretationText);
      } else {
        message.error("L'interprétation n'est pas disponible pour le moment.");
      }
    } catch (error) {
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
      return message.error(
        "Les données nécessaires ne sont pas encore disponibles."
      );
    }

    if (!activityNumber) {
      return message.error("Le numéro d’activité est manquant.");
    }

    if (!calculationResult) {
      return message.error(
        "Veuillez calculer le ROI avant d'insérer les données."
      );
    }

    try {
      const payload = {
        activityId: activityNumber,
        year,
        roi: calculationResult.roi,
      };
      items.forEach((item) => {
        if (item.itemName !== "Roi") {
          payload[item.symbole] =
            item.Type === "percentage"
              ? formData[item.symbole] / 100
              : formData[item.symbole];
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
                  {roiBenchmarkError && (
                    <Text type="danger" style={{ fontSize: "12px" }}>
                      {roiBenchmarkError}
                    </Text>
                  )}
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
                        precision={
                          key.includes("cost") || key.includes("sales") ? 2 : 0
                        }
                        suffix={
                          key.includes("cost") || key.includes("sales")
                            ? " MAD"
                            : key.includes("patients") ||
                              key.includes("doctors")
                            ? " Personnes"
                            : key.includes("samples")
                            ? " Échantillons"
                            : ""
                        }
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
                      <label>{item.itemName}</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={
                            item.Type === "percentage"
                              ? "0"
                              : item.symbole === "E"
                              ? "0.1"
                              : "0"
                          }
                          max={item.Type === "percentage" ? "100" : undefined}
                          step={item.symbole === "E" ? "0.1" : "1"}
                          value={
                            item.itemName ===
                            "Valeur du revenu par patient incrémental en MAD"
                              ? vpi !== null && vpi !== undefined
                                ? vpi
                                : 0
                              : formData[item.symbole] || 0
                          }
                          disabled={
                            item.itemName ===
                            "Valeur du revenu par patient incrémental en MAD"
                          }
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (
                              item.itemName !==
                              "Valeur du revenu par patient incrémental en MAD"
                            ) {
                              setFormData({
                                ...formData,
                                [item.symbole]: value,
                              });
                              // Vérifier si la valeur est hors des benchmarks
                              if (!validateBenchmark(value, item)) {
                                setBenchmarkErrors({
                                  ...benchmarkErrors,
                                  [item.symbole]:
                                    "Vous êtes hors des benchmarks.",
                                });
                              } else {
                                setBenchmarkErrors({
                                  ...benchmarkErrors,
                                  [item.symbole]: null,
                                });
                              }
                            }
                          }}
                        />
                        {(item.benchmark_min !== null ||
                          item.benchmark_max !== null) && (
                          <Tooltip
                            title={
                              item.Type === "percentage"
                                ? `${item.benchmark_min * 100}%-${
                                    item.benchmark_max * 100
                                  }%`
                                : `${item.benchmark_min}-${item.benchmark_max}`
                            }
                          >
                            <Button
                              type="button"
                              size="sm"
                              style={{
                                padding: "0 8px",
                                height: "32px",
                                backgroundColor: "#f0f0f0",
                              }}
                            >
                              <QuestionCircleOutlined />
                            </Button>
                          </Tooltip>
                        )}
                        {item.itemName ===
                          "Valeur du revenu par patient incrémental en MAD" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/PatientIncremental")}
                            style={{ backgroundColor: "#1890ff", height: "40px" }}
                            title="Modifier la valeur du revenu par patient incrémental"
                          >
                            Éditer
                          </Button>
                        )}
                      </div>
                      {benchmarkErrors[item.symbole] && (
                        <Text type="danger" style={{ fontSize: "12px" }}>
                          {benchmarkErrors[item.symbole]}
                        </Text>
                      )}
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