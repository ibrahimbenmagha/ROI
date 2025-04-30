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
// import axiosInstance, { deleteCookie } from "../../axiosConfig";
// import TheHeader from "../Header/Header";
// import dayjs from "dayjs";

// const { Content } = Layout;
// const { Title, Text } = Typography;

// const CalculateAct6 = () => {
//   // États du formulaire
//   const [A, setA] = useState(0); // Nombre de médecins ciblés
//   const [B, setB] = useState(0); // Visites par médecin
//   const [E, setE] = useState(0); // % Rappel du message
//   const [G, setG] = useState(0); // % Prescription
//   const [I, setI] = useState(0); // Patients par médecin
//   const [K, setK] = useState(0); // Valeur patient
//   const [M1, setM1] = useState(0); // Coût par représentant
//   const [M2, setM2] = useState(0); // Nombre de représentants
//   const [year, setYear] = useState(null);

//   // États de l'application
//   const [activityNumber, setActivityNumber] = useState(null);
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [calculated, setCalculated] = useState(false);
//   const [items, setItems] = useState([]);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const match = location.pathname.match(/CalculateAct(\d+)/);
//     const foundActivityNumber = match ? parseInt(match[1]) : null;
//     setActivityNumber(foundActivityNumber);
//     document.cookie = `activityNumber=${foundActivityNumber}; path=/; max-age=3600;`;

//     axiosInstance
//       .get("getActivityItemsByActivityId/6")
//       .then((response) => setItems(response.data))
//       .catch((error) => {
//         console.error("Erreur lors du chargement des items :", error);
//         message.error("Impossible de charger les données de l'activité.");
//       });
//   }, [location.pathname]);

//   const handleReset = () => {
//     setA(0);
//     setB(0);
//     setE(0);
//     setG(0);
//     setI(0);
//     setK(0);
//     setM1(0);
//     setM2(0);
//     setYear(null);
//     setCalculationResult(null);
//     setCalculated(false);
//   };

//   const validateNumeric = (value, min, max = null) => {
//     const num = Number(value);
//     if (isNaN(num)) return false;
//     if (num < min) return false;
//     if (max !== null && num > max) return false;
//     return true;
//   };

//   const isFormValid = () =>
//     validateNumeric(A, 0) &&
//     validateNumeric(B, 0) &&
//     validateNumeric(E, 0, 100) &&
//     validateNumeric(G, 0, 100) &&
//     validateNumeric(I, 0) &&
//     validateNumeric(K, 0) &&
//     validateNumeric(M1, 0) &&
//     validateNumeric(M2, 0) &&
//     !!year;

//   const calculateRoi = async () => {
//     if (!validateNumeric(A, 0)) return message.error("Nombre de médecins invalide");
//     if (!validateNumeric(B, 0)) return message.error("Visites par médecin invalide");
//     if (!validateNumeric(E, 0, 100)) return message.error("% Rappel du message invalide");
//     if (!validateNumeric(G, 0, 100)) return message.error("% Prescription invalide");
//     if (!validateNumeric(I, 0)) return message.error("Patients par médecin invalide");
//     if (!validateNumeric(K, 0)) return message.error("Valeur patient invalide");
//     if (!validateNumeric(M1, 0)) return message.error("Coût par représentant invalide");
//     if (!validateNumeric(M2, 0)) return message.error("Nombre de représentants invalide");

//     setLoading(true);

//     try {
//       // Calculs intermédiaires
//       const C = A * B; // Total visites
//       const F = A * (E / 100); // Médecins se rappelant
//       const H = F * (G / 100); // Médecins prescrivant
//       const J = H * I; // Patients incrémentaux
//       const L = J * K; // Ventes incrémentales
//       const M = M1 * M2; // Coût total
//       const ROI = M > 0 ? (L / M) * 100 : 0; // ROI en %

//       setCalculationResult({
//         roi: ROI,
//         totalVisits: C,
//         doctorsRemembering: F,
//         doctorsPrescribing: H,
//         incrementalPatients: J,
//         incrementalSales: L,
//         totalCost: M,
//       });
//       setCalculated(true);
//     } catch (error) {
//       message.error("Erreur lors du calcul du ROI");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!items || items.length < 9) {
//       return message.error("Données nécessaires non disponibles");
//     }

//     if (!activityNumber) {
//       return message.error("Numéro d'activité manquant");
//     }

//     const formData = {
//       year,
//       A: parseFloat(A),
//       B: parseFloat(B),
//       E: parseFloat(E),
//       G: parseFloat(G),
//       I: parseFloat(I),
//       K: parseFloat(K),
//       M1: parseFloat(M1),
//       M2: parseFloat(M2),

//       id_A: items[0]?.id,
//       id_B: items[1]?.id,
//       id_E: items[2]?.id,
//       id_G: items[3]?.id,
//       id_I: items[4]?.id,
//       id_K: items[5]?.id,
//       id_M1: items[6]?.id,
//       id_M2: items[7]?.id,
//       id_ROI: items[8]?.id,
//     };

//     try {
//       const response = await axiosInstance.post("/insertIntoTable6", formData);

//       if (response.status === 201) {
//         message.success("Données enregistrées avec succès");
//         deleteCookie("activityNumber");
//         navigate("/CreateActivity");
//       } else {
//         message.error("Erreur lors de l'enregistrement");
//       }
//     } catch (error) {
//       console.error("Erreur:", error);
//       message.error(
//         error.response?.data?.message || "Erreur de communication avec le serveur"
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
//                       color: calculationResult.roi >= 0 ? "#3f8600" : "#cf1322",
//                     }}
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Ventes Incrémentales"
//                     value={calculationResult.incrementalSales}
//                     precision={2}
//                     suffix="MAD"
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Coût Total"
//                     value={calculationResult.totalCost}
//                     precision={2}
//                     suffix="MAD"
//                   />
//                 </Card>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//                 <Card>
//                   <Statistic
//                     title="Total Visites"
//                     value={calculationResult.totalVisits}
//                     precision={0}
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Médecins se Rappelant"
//                     value={calculationResult.doctorsRemembering}
//                     precision={0}
//                   />
//                 </Card>
//                 <Card>
//                   <Statistic
//                     title="Médecins Prescrivant"
//                     value={calculationResult.doctorsPrescribing}
//                     precision={0}
//                   />
//                 </Card>
//               </div>

//               <Card className="mt-4">
//                 <Statistic
//                   title="Patients Incrémentaux"
//                   value={calculationResult.incrementalPatients}
//                   precision={0}
//                 />
//                 <Text type="secondary">
//                   Patients additionnels grâce aux visites médicales
//                 </Text>
//               </Card>

//               {calculationResult.roi < 0 && (
//                 <Alert
//                   message="ROI Négatif"
//                   description="Ajustez les paramètres pour améliorer le ROI"
//                   type="warning"
//                   showIcon
//                 />
//               )}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <Card>
//               <Title level={4} style={{ textAlign: "center" }}>
//                 Visites Médicales - Calcul ROI
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label>Nombre de médecins ciblés (A)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={A}
//                     onChange={(e) => setA(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>Visites par médecin (B)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={B}
//                     onChange={(e) => setB(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>% Rappel du message (E)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={E}
//                     onChange={(e) => setE(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>% Prescription (G)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={G}
//                     onChange={(e) => setG(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>Patients par médecin (I)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={I}
//                     onChange={(e) => setI(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>Valeur patient (MAD) (K)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={K}
//                     onChange={(e) => setK(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>Coût par représentant (MAD) (M1)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={M1}
//                     onChange={(e) => setM1(Number(e.target.value))}
//                   />
//                 </div>

//                 <div>
//                   <label>Nombre de représentants (M2)</label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={M2}
//                     onChange={(e) => setM2(Number(e.target.value))}
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
//                   {loading ? <Spin size="small" /> : <><CalculatorOutlined /> Calculer ROI</>}
//                 </Button>

//                 <Button
//                   type="submit"
//                   disabled={loading || !calculated || !isFormValid()}
//                   style={{ backgroundColor: "#1890ff" }}
//                 >
//                   <CheckCircleOutlined /> Enregistrer
//                 </Button>

//                 <div className="flex gap-4">
//                   <Button variant="outline" onClick={handleReset}>
//                     <ReloadOutlined /> Réinitialiser
//                   </Button>
//                   <Link to="/CreateActivity">
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

// export default CalculateAct6;

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

const initialFormState = {
  A: 0,
  B: 0,
  E: 0,
  G: 0,
  I: 0,
  K: 0,
  M1: 0,
  M2: 0,
};

const validateNumeric = (
  value: number,
  min: number,
  max: number | null = null
) => !isNaN(value) && value >= min && (max === null || value <= max);

const CalculateAct6 = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [year, setYear] = useState<string | null>(null);
  const [activityNumber, setActivityNumber] = useState<number | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
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
      .get("getActivityItemsByActivityId/6")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error("Erreur chargement items :", err);
        message.error("Erreur chargement données activité.");
      });
  }, [location.pathname]);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const isFormValid = () => {
    return (
      Object.entries(formData).every(([key, value]) =>
        validateNumeric(value, 0, key === "E" || key === "G" ? 100 : null)
      ) && !!year
    );
  };

  const calculateRoi = async () => {
    const { A, B, E, G, I, K, M1, M2 } = formData;
    if (!isFormValid()) {
      message.error("Veuillez remplir correctement tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const C = A * B;
      const F = A * (E / 100);
      const H = F * (G / 100);
      const J = H * I;
      const L = J * K;
      const M = M1 * M2;
      const ROI = M > 0 ? (L / M) * 100 : 0;

      setCalculationResult({
        roi: ROI,
        totalVisits: C,
        doctorsRemembering: F,
        doctorsPrescribing: H,
        incrementalPatients: J,
        incrementalSales: L,
        totalCost: M,
      });
      setCalculated(true);
    } catch (error) {
      console.error(error);
      message.error("Erreur pendant le calcul du ROI.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setYear(null);
    setCalculationResult(null);
    setCalculated(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || !activityNumber) {
      message.error("Données nécessaires non disponibles.");
      return;
    }

    try {
      const payload = {
        ...formData,
        year,
        id_A: items[0]?.id,
        id_B: items[1]?.id,
        id_E: items[2]?.id,
        id_G: items[3]?.id,
        id_I: items[4]?.id,
        id_K: items[5]?.id,
        id_M1: items[6]?.id,
        id_M2: items[7]?.id,
        id_ROI: items[8]?.id,
      };

      const response = await axiosInstance.post("/insertIntoTable6", payload);
      if (response.status === 201) {
        message.success("Données enregistrées avec succès.");
        deleteCookie("activityNumber");
        navigate("/CreateActivity");
      } else {
        message.error("Erreur lors de l'enregistrement.");
      }
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Erreur serveur.");
    }
  };

  const fields = [
    { label: "Nombre de médecins ciblés (A)", key: "A" },
    { label: "Visites par médecin (B)", key: "B" },
    { label: "% Rappel du message (E)", key: "E", max: 100 },
    { label: "% Prescription (G)", key: "G", max: 100 },
    { label: "Patients par médecin (I)", key: "I" },
    { label: "Valeur patient (MAD) (K)", key: "K" },
    { label: "Coût par représentant (MAD) (M1)", key: "M1" },
    { label: "Nombre de représentants (M2)", key: "M2" },
  ];

  return (
    <Layout className="min-h-screen">
      <TheHeader />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {calculationResult && (
            <>
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
                    title="Total Visites"
                    value={calculationResult.totalVisits}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins se Rappelant"
                    value={calculationResult.doctorsRemembering}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Médecins Prescrivant"
                    value={calculationResult.doctorsPrescribing}
                  />
                </Card>
              </div>

              <Card className="mt-4">
                <Statistic
                  title="Patients Incrémentaux"
                  value={calculationResult.incrementalPatients}
                />
                <Text type="secondary">
                  Patients additionnels grâce aux visites médicales
                </Text>
              </Card>

              {calculationResult.roi < 0 && (
                <Alert
                  message="ROI Négatif"
                  description="Ajustez les paramètres pour améliorer le ROI."
                  type="warning"
                  showIcon
                />
              )}
            </>
          )}

          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Visites Médicales - Calcul ROI
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map(({ label, key, max }) => (
                  <div key={key}>
                    <label>{label}</label>
                    <Input
                      type="number"
                      min="0"
                      max={max}
                      value={formData[key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
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

export default CalculateAct6;
