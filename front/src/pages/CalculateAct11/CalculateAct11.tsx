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
// const CalculateAct11 = () => {
//   const [numConsumers, setNumConsumers] = useState(0);
//   const [percentMemorizing, setPercentMemorizing] = useState(0);
//   const [percentConsulting, setPercentConsulting] = useState(0);
//   const [percentPrescription, setPercentPrescription] = useState(0);
//   const [revenuePerPatient, setRevenuePerPatient] = useState(0);
//   const [totalCost, setTotalCost] = useState(0);
//   const [year, setYear] = useState(null);
//   const [activityNumber, setActivityNumber] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false);
//   const [calculationResult, setCalculationResult] = useState(null);
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
//       .get("getActivityItemsByActivityId/11")
//       .then((response) => setItems(response.data))
//       .catch((error) => console.error("Erreur chargement items:", error));
//   }, []);

//   const validateNumeric = (value, min, max = null) => {
//     const num = Number(value);
//     if (isNaN(num)) return false;
//     if (num < min) return false;
//     if (max !== null && num > max) return false;
//     return true;
//   };

//   const calculateRoi = () => {
//     if (!validateNumeric(numConsumers, 0))
//       return alert("Nombre de consommateurs invalide");
//     if (!validateNumeric(percentMemorizing, 0, 100))
//       return alert("Pourcentage de mémorisation invalide");
//     if (!validateNumeric(percentConsulting, 0, 100))
//       return alert("Consultation après exposition invalide");
//     if (!validateNumeric(percentPrescription, 0, 100))
//       return alert("Pourcentage de prescription invalide");
//     if (!validateNumeric(revenuePerPatient, 0))
//       return alert("Revenu par patient invalide");
//     if (!validateNumeric(totalCost, 0)) return alert("Coût total invalide");

//     const A = numConsumers;
//     const B = percentMemorizing / 100;
//     const D = percentConsulting / 100;
//     const F = percentPrescription / 100;
//     const H = revenuePerPatient;
//     const J = totalCost;

//     const C = A * B;
//     const E = C * D;
//     const G = E * F;
//     const I = G * H;
//     const ROI = J > 0 ? (I / J) * 100 : 0;

//     setCalculationResult({
//       roi: ROI,
//       consumersMemorizing: C,
//       consultationsGenerated: E,
//       incrementalPatients: G,
//       incrementalSales: I,
//       totalCost: J,
//     });

//     setCalculated(true);
//   };

//   const handleReset = () => {
//     setNumConsumers(0);
//     setPercentMemorizing(0);
//     setPercentConsulting(0);
//     setPercentPrescription(0);
//     setRevenuePerPatient(0);
//     setTotalCost(0);
//     setYear(null);
//     setCalculationResult(null);
//     setCalculated(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (items.length < 7)
//       return alert("Les éléments d'activité sont incomplets");
//     if (!year) return alert("Veuillez sélectionner une année");

//     const formData = {
//       year,
//       activityId: activityNumber,
//       A: numConsumers,
//       B: percentMemorizing,
//       D: percentConsulting,
//       F: percentPrescription,
//       H: revenuePerPatient,
//       J: totalCost,
//       id_A: items[0]?.id,
//       id_B: items[1]?.id,
//       id_D: items[2]?.id,
//       id_F: items[3]?.id,
//       id_H: items[4]?.id,
//       id_J: items[5]?.id,
//       id_ROI: items[6]?.id,
//     };

//     try {
//       const response = await axiosInstance.post("insertIntoTable11", formData);
//       if (response.status === 201) {
//         message.success("Les données ont été insérées avec succès.");
//         deleteCookie("activityNumber");
//         deleteCookie("activityId");
//         navigate("/DisplayActivity");
//       } else {
//         message.error("Erreur lors de l'insertion.");
//       }
//     } catch (error) {
//       console.error(error);
//       message.error(error.response?.data?.message || "Erreur serveur.");
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
//                         title="Consommateurs Mémorisant"
//                         value={calculationResult.consumersMemorizing}
//                         precision={0}
//                       />
//                     </Card>
//                     <Card>
//                       <Statistic
//                         title="Consultations Générées"
//                         value={calculationResult.consultationsGenerated}
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
//           <form onSubmit={handleSubmit}>
//             <Card>
//               <Title level={4} style={{ textAlign: "center" }}>
//                 Campagnes de Communication Grand Public
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label>
//                     Nombre de consommateurs exposés à l'activité (A)
//                   </label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={numConsumers}
//                     onChange={(e) => setNumConsumers(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>% de consommateurs mémorisant le message (B)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentMemorizing}
//                     onChange={(e) =>
//                       setPercentMemorizing(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>
//                     % de consommateurs ayant consulté après l'exposition (D)
//                   </label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentConsulting}
//                     onChange={(e) =>
//                       setPercentConsulting(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>
//                     % des consultations aboutissant à une prescription (F)
//                   </label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={percentPrescription}
//                     onChange={(e) =>
//                       setPercentPrescription(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>Revenu moyen généré par patient MAD (H)</label>
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
//                   <label>Coût fixe total de l'activité MAD (J)</label>
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
//                     value={year ? dayjs(year, "YYYY") : null}
//                     onChange={(date, dateString) => setYear(dateString)}
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
// export default CalculateAct11;

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
const { Title, Text } = Typography;

const CalculateAct11 = () => {
  const [numConsumers, setNumConsumers] = useState(0);
  const [percentMemorizing, setPercentMemorizing] = useState(0);
  const [percentConsulting, setPercentConsulting] = useState(0);
  const [percentPrescription, setPercentPrescription] = useState(0);
  const [revenuePerPatient, setRevenuePerPatient] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [year, setYear] = useState(null);
  const [activityNumber, setActivityNumber] = useState(null);

  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/CalculateAct(\d+)/);
    const foundActivityNumber = match ? parseInt(match[1]) : null;
    setActivityNumber(foundActivityNumber);
    document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

    axiosInstance
      .get("getActivityItemsByActivityId/11")
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error("Erreur chargement items:", error);
        message.error("Impossible de charger les données de l'activité.");
      });
  }, [location.pathname]);

  const validateNumeric = (value, min, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };

  const isFormValid = () =>
    validateNumeric(numConsumers, 0) &&
    validateNumeric(percentMemorizing, 0, 100) &&
    validateNumeric(percentConsulting, 0, 100) &&
    validateNumeric(percentPrescription, 0, 100) &&
    validateNumeric(revenuePerPatient, 0) &&
    validateNumeric(totalCost, 0) &&
    !!year;

  const generateInterpretation = async (result) => {
    try {
      const payload = {
        ...result, // roi, consumersMemorizing, consultationsGenerated, etc.
        inputs: {
          numConsumersExposed: numConsumers,
          percentMemorizing: percentMemorizing,
          percentConsulting: percentConsulting,
          percentPrescription: percentPrescription,
          revenuePerPatient: revenuePerPatient,
          totalCost: totalCost,
        },
      };
      const response = await axiosInstance.post("/generate-interpretation", payload);
      return response.data.interpretation;
    } catch (error) {
      console.error("Erreur lors de la génération de l'interprétation :", error);
      return null;
    }
  };

  const calculateRoi = async () => {
    if (!validateNumeric(numConsumers, 0))
      return message.error("Nombre de consommateurs invalide");
    if (!validateNumeric(percentMemorizing, 0, 100))
      return message.error("Pourcentage de mémorisation invalide");
    if (!validateNumeric(percentConsulting, 0, 100))
      return message.error("Consultation après exposition invalide");
    if (!validateNumeric(percentPrescription, 0, 100))
      return message.error("Pourcentage de prescription invalide");
    if (!validateNumeric(revenuePerPatient, 0))
      return message.error("Revenu par patient invalide");
    if (!validateNumeric(totalCost, 0))
      return message.error("Coût total invalide");
    if (!year) return message.error("Veuillez sélectionner une année");

    setLoading(true);
    try {
      const A = numConsumers;
      const B = percentMemorizing / 100;
      const D = percentConsulting / 100;
      const F = percentPrescription / 100;
      const H = revenuePerPatient;
      const J = totalCost;

      const C = A * B; // Consommateurs mémorisant
      const E = C * D; // Consultations générées
      const G = E * F; // Patients incrémentaux
      const I = G * H; // Ventes incrémentales
      const ROI = J > 0 ? (I / J) * 100 : 0; // ROI en %

      const result = {
        roi: ROI,
        consumersMemorizing: C,
        consultationsGenerated: E,
        incrementalPatients: G,
        incrementalSales: I,
        totalCost: J,
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
      message.error("Erreur lors du calcul du ROI.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNumConsumers(0);
    setPercentMemorizing(0);
    setPercentConsulting(0);
    setPercentPrescription(0);
    setRevenuePerPatient(0);
    setTotalCost(0);
    setYear(null);
    setCalculationResult(null);
    setInterpretation(null);
    setCalculated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length < 7) {
      message.error("Les éléments d'activité sont incomplets");
      return;
    }
    if (!year) {
      message.error("Veuillez sélectionner une année");
      return;
    }
    if (!activityNumber) {
      message.error("Numéro d'activité introuvable");
      return;
    }

    const formData = {
      year,
      activityId: activityNumber,
      A: numConsumers,
      B: percentMemorizing,
      D: percentConsulting,
      F: percentPrescription,
      H: revenuePerPatient,
      J: totalCost,
      id_A: items[0]?.id,
      id_B: items[1]?.id,
      id_D: items[2]?.id,
      id_F: items[3]?.id,
      id_H: items[4]?.id,
      id_J: items[5]?.id,
      id_ROI: items[6]?.id,
    };

    try {
      const response = await axiosInstance.post("insertIntoTable11", formData);
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
      message.error(
        error.response?.data?.message || "Erreur de communication avec le serveur."
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
                      color: calculationResult.roi >= 100 ? "#3f8600" : "#cf1322",
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Card>
                  <Statistic
                    title="Consommateurs Mémorisant"
                    value={calculationResult.consumersMemorizing}
                    precision={0}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Consultations Générées"
                    value={calculationResult.consultationsGenerated}
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
                Campagnes de Communication Grand Public
              </Title>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nombre de consommateurs exposés à l'activité (A)</label>
                  <Input
                    type="number"
                    min="0"
                    value={numConsumers}
                    onChange={(e) => setNumConsumers(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% de consommateurs mémorisant le message (B)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentMemorizing}
                    onChange={(e) => setPercentMemorizing(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% de consommateurs ayant consulté après l'exposition (D)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentConsulting}
                    onChange={(e) => setPercentConsulting(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>% des consultations aboutissant à une prescription (F)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={percentPrescription}
                    onChange={(e) => setPercentPrescription(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Revenu moyen généré par patient MAD (H)</label>
                  <Input
                    type="number"
                    min="0"
                    value={revenuePerPatient}
                    onChange={(e) => setRevenuePerPatient(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Coût fixe total de l'activité MAD (J)</label>
                  <Input
                    type="number"
                    min="0"
                    value={totalCost}
                    onChange={(e) => setTotalCost(Number(e.target.value))}
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
                  disabled={loading || !calculated || !isFormValid()}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <CheckCircleOutlined className="mr-2" /> Insérer les données
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleReset}>
                    <ReloadOutlined className="mr-2" /> Réinitialiser
                  </Button>
                  <Link to="/DisplayActivity">
                    <Button variant="secondary" type="button">
                      Retour
                    </Button>
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

export default CalculateAct11;