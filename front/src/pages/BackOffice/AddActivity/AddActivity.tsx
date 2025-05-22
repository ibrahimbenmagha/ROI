// import React, { useState } from "react";
// import {
//   Layout,
//   Typography,
//   Card,
//   Divider,
//   Select,
//   message,
//   Spin,
//   Input as AntInput,
//   Modal,
//   Button as AntButton,
//   Tag,
// } from "antd";
// import {
//   PlusOutlined,
//   SaveOutlined,
//   CalculatorOutlined,
//   ReloadOutlined,
//   DeleteOutlined,
//   CloseCircleOutlined,
//   NumberOutlined,
// } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import TheHeader from "../../Header/Header"; // Adjust path as needed
// import axiosInstance from "../../../axiosConfig"; // Adjust path as needed
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { Option } = Select;

// // Available symbols (A-Z)
// const AVAILABLE_SYMBOLS = Array.from({ length: 26 }, (_, i) =>
//   String.fromCharCode(65 + i)
// );

// const CreateActivity = () => {
//   const [activityName, setActivityName] = useState("");
//   const [items, setItems] = useState([]);
//   const [formulat, setFormulat] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [isCalculatorModalVisible, setIsCalculatorModalVisible] = useState(false);
//   const [newFormulaKey, setNewFormulaKey] = useState("");
//   const [newFormulaExpression, setNewFormulaExpression] = useState([]);

//   const navigate = useNavigate();

//   // Get available symbols for an item (exclude symbols used by other items)
//   const getAvailableSymbols = (currentItemId) => {
//     const usedSymbols = items
//       .filter((item) => item.id !== currentItemId && item.symbole)
//       .map((item) => item.symbole);
//     return AVAILABLE_SYMBOLS.filter((symbol) => !usedSymbols.includes(symbol));
//   };

//   // Add a new item
//   const handleAddItem = () => {
//     setItems([
//       ...items,
//       {
//         id: `item-${Date.now()}`,
//         name: "",
//         symbole: "",
//         type: "number",
//       },
//     ]);
//   };

//   // Remove an item
//   const handleRemoveItem = (id) => {
//     setItems(items.filter((item) => item.id !== id));
//     // Remove any formula expressions that reference the deleted item's symbol
//     const updatedFormulat = { ...formulat };
//     const deletedItem = items.find((item) => item.id === id);
//     if (deletedItem?.symbole) {
//       Object.keys(updatedFormulat).forEach((key) => {
//         if (updatedFormulat[key].split(" ").includes(deletedItem.symbole)) {
//           delete updatedFormulat[key];
//         }
//       });
//       setFormulat(updatedFormulat);
//     }
//   };

//   // Update an item
//   const handleItemChange = (id, field, value) => {
//     if (field === "symbole") {
//       const usedSymbols = items
//         .filter((item) => item.id !== id)
//         .map((item) => item.symbole);
//       if (usedSymbols.includes(value)) {
//         message.error("Ce symbole est déjà utilisé. Choisissez un autre.");
//         return;
//       }
//     }
//     setItems(
//       items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
//     );
//   };

//   // Reset the form
//   const handleReset = () => {
//     setActivityName("");
//     setItems([]);
//     setFormulat({});
//     setNewFormulaKey("");
//     setNewFormulaExpression([]);
//   };

//   // Validate the form
//   const isFormValid = () => {
//     if (!activityName.trim()) return false;
//     return (
//       items.length > 0 &&
//       items.every(
//         (item) =>
//           item.name.trim() &&
//           item.symbole.trim() &&
//           ["number", "percentage"].includes(item.type)
//       ) &&
//       Object.keys(formulat).length > 0 &&
//       Object.keys(formulat).includes("roi")
//     );
//   };

//   // Open formula modal
//   const openCalculatorModal = () => {
//     if (items.length === 0 || items.some((item) => !item.name || !item.symbole)) {
//       message.error(
//         "Veuillez remplir tous les champs des items avant de définir des formules."
//       );
//       return;
//     }
//     setNewFormulaKey("");
//     setNewFormulaExpression([]);
//     setIsCalculatorModalVisible(true);
//   };

//   // Add element to formula expression
//   const addExpressionElement = (type, value) => {
//     const canAddItemOrConstant =
//       newFormulaExpression.length === 0 ||
//       newFormulaExpression[newFormulaExpression.length - 1].type === "operator";
//     const canAddOperator =
//       newFormulaExpression.length > 0 &&
//       (newFormulaExpression[newFormulaExpression.length - 1].type === "item" ||
//         newFormulaExpression[newFormulaExpression.length - 1].type === "constant" ||
//         newFormulaExpression[newFormulaExpression.length - 1].type === "formula");

//     if ((type === "item" || type === "constant" || type === "formula") && !canAddItemOrConstant) {
//       message.error(
//         "Veuillez ajouter un opérateur avant d'ajouter un autre élément."
//       );
//       return;
//     }
//     if (type === "operator" && !canAddOperator) {
//       message.error(
//         "Veuillez ajouter un élément avant d'ajouter un opérateur."
//       );
//       return;
//     }

//     setNewFormulaExpression([...newFormulaExpression, { type, value }]);
//   };

//   // Remove last expression element
//   const removeLastExpressionElement = () => {
//     if (newFormulaExpression.length === 0) return;
//     const newExpression = [...newFormulaExpression];
//     newExpression.pop();
//     setNewFormulaExpression(newExpression);
//   };

//   // Add a new formula
//   const handleAddFormula = () => {
//     if (!newFormulaKey.trim() || newFormulaExpression.length < 3) {
//       message.error(
//         "Veuillez saisir un nom de formule valide et une expression d'au moins trois éléments."
//       );
//       return;
//     }
//     if (newFormulaExpression[newFormulaExpression.length - 1].type === "operator") {
//       message.error("L'expression ne peut pas se terminer par un opérateur.");
//       return;
//     }
//     if (formulat[newFormulaKey]) {
//       message.error("Ce nom de formule existe déjà. Choisissez un nom unique.");
//       return;
//     }

//     // Convert expression to string (e.g., "A + B * roi_total")
//     const expressionStr = newFormulaExpression
//       .map((elem) => {
//         if (elem.type === "item") {
//           const item = items.find((i) => i.id === elem.value);
//           return item ? item.symbole : "";
//         } else if (elem.type === "constant") {
//           return elem.value;
//         } else if (elem.type === "formula") {
//           return elem.value;
//         } else if (elem.type === "operator") {
//           switch (elem.value) {
//             case "add":
//               return "+";
//             case "subtract":
//               return "-";
//             case "multiply":
//               return "*";
//             case "divide":
//               return "/";
//             default:
//               return "";
//           }
//         }
//         return "";
//       })
//       .filter((part) => part)
//       .join(" ");

//     if (!expressionStr) {
//       message.error("Erreur lors de la construction de l'expression.");
//       return;
//     }

//     const formulaKey = newFormulaKey.toLowerCase().includes("roi") ? "roi" : newFormulaKey;
//     setFormulat({
//       ...formulat,
//       [formulaKey]: expressionStr,
//     });
//     setNewFormulaKey("");
//     setNewFormulaExpression([]);
//     message.success("Formule ajoutée avec succès.");
//   };

//   // Parse string expression back to array for rendering
//   const parseExpression = (expressionStr) => {
//     const parts = expressionStr.split(" ").filter((part) => part);
//     return parts.map((part) => {
//       if (items.some((i) => i.symbole === part)) return { type: "item", value: part };
//       if (Object.keys(formulat).includes(part)) return { type: "formula", value: part };
//       if (!isNaN(part)) return { type: "constant", value: parseFloat(part) };
//       if (["+", "-", "*", "/"].includes(part)) return { type: "operator", value: part === "+" ? "add" : part === "-" ? "subtract" : part === "*" ? "multiply" : "divide" };
//       return { type: "unknown", value: part };
//     });
//   };

//   // Get item name by symbol
//   const getItemNameBySymbole = (symbole) => {
//     const item = items.find((i) => i.symbole === symbole);
//     return item ? item.name : "Item inconnu";
//   };

//   // Get operation symbol for display
//   const getOperationSymbol = (operation) => {
//     switch (operation) {
//       case "add":
//         return "+";
//       case "subtract":
//         return "-";
//       case "multiply":
//         return "×";
//       case "divide":
//         return "÷";
//       default:
//         return "?";
//     }
//   };

//   // Render expression as tags
//   const renderExpression = (expression) => {
//     return expression.map((elem, index) => {
//       if (elem.type === "item") {
//         return (
//           <Tag key={index} color="blue">
//             {elem.value}
//           </Tag>
//         );
//       } else if (elem.type === "constant") {
//         return (
//           <Tag key={index} color="purple">
//             {elem.value}
//           </Tag>
//         );
//       } else if (elem.type === "formula") {
//         return (
//           <Tag key={index} color="green">
//             {elem.value}
//           </Tag>
//         );
//       } else if (elem.type === "operator") {
//         return (
//           <Tag key={index} color="orange">
//             {getOperationSymbol(elem.value)}
//           </Tag>
//         );
//       }
//       return null;
//     });
//   };

//   // Get options for formula expression (items, formulas)
//   const getAllElementsForSelection = () => {
//     const itemOptions = items.map((item) => ({
//       value: item.symbole,
//       label: `${item.name} (${item.symbole})`,
//       type: "item",
//     }));
//     const formulaOptions = Object.keys(formulat).map((key) => ({
//       value: key,
//       label: `Formule: ${key}`,
//       type: "formula",
//     }));
//     return [...itemOptions, ...formulaOptions];
//   };

//   // Submit the form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       if (!isFormValid()) {
//         message.error(
//           "Veuillez remplir tous les champs et définir une formule nommée 'roi'."
//         );
//         setSubmitting(false);
//         return;
//       }

//       const payload = {
//         name: activityName,
//         items: items.map((item) => ({
//           name: item.name,
//           symbole: item.symbole,
//           Type: item.type,
//         })),
//         formulat,
//       };

//       console.log("Payload envoyé au backend:", JSON.stringify(payload, null, 2));

//       const response = await axiosInstance.post("createActivity2", payload);
//       message.success("Activité personnalisée créée avec succès");
//       handleReset();
//       navigate("/Activities");
//     } catch (error) {
//       if (error.response) {
//         console.error("Erreur serveur:", error.response.data);
//         message.error(
//           error.response.data.message || "Erreur lors de la création"
//         );
//       } else {
//         console.error("Erreur réseau:", error);
//         message.error("Erreur de communication avec le serveur.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Layout className="min-h-screen">
//       {/* <TheHeader /> */}
//       <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
//         <div style={{ maxWidth: 800, margin: "0 auto" }}>
//           <form onSubmit={handleSubmit}>
//             <Card>
//               <Title level={4} style={{ textAlign: "center" }}>
//                 Créer une activité personnalisée
//               </Title>
//               <Divider />

//               <div className="mb-6">
//                 <label>Nom de l'activité</label>
//                 <Input
//                   value={activityName}
//                   onChange={(e) => setActivityName(e.target.value)}
//                   placeholder="Entrez le nom de l'activité"
//                 />
//               </div>

//               <Divider>Items de base</Divider>

//               {items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
//                 >
//                   <div className="md:col-span-1">
//                     <AntInput
//                       placeholder="Nom de l'item"
//                       value={item.name}
//                       onChange={(e) =>
//                         handleItemChange(item.id, "name", e.target.value)
//                       }
//                     />
//                   </div>
//                   <div className="md:col-span-1">
//                     <Select
//                       style={{ width: "100%" }}
//                       placeholder="Choisissez un symbole"
//                       value={item.symbole || undefined}
//                       onChange={(value) =>
//                         handleItemChange(item.id, "symbole", value)
//                       }
//                     >
//                       {getAvailableSymbols(item.id).map((symbol) => (
//                         <Option key={symbol} value={symbol}>
//                           {symbol}
//                         </Option>
//                       ))}
//                     </Select>
//                   </div>
//                   <div className="md:col-span-1">
//                     <Select
//                       style={{ width: "100%" }}
//                       value={item.type}
//                       onChange={(value) =>
//                         handleItemChange(item.id, "type", value)
//                       }
//                     >
//                       <Option value="number">Nombre</Option>
//                       <Option value="percentage">Pourcentage</Option>
//                     </Select>
//                   </div>
//                   <div className="md:col-span-1">
//                     <Button
//                       variant="outline"
//                       type="button"
//                       onClick={() => handleRemoveItem(item.id)}
//                     >
//                       <DeleteOutlined /> Supprimer
//                     </Button>
//                   </div>
//                 </div>
//               ))}

//               <div className="mt-4 mb-6">
//                 <Button
//                   type="button"
//                   onClick={handleAddItem}
//                   style={{ backgroundColor: "#1890ff" }}
//                 >
//                   <PlusOutlined /> Ajouter un item
//                 </Button>
//               </div>

//               {Object.keys(formulat).length > 0 && (
//                 <>
//                   <Divider>Formules définies</Divider>
//                   {Object.entries(formulat).map(([key, expression]) => (
//                     <div key={key} className="bg-gray-50 p-3 rounded mb-3">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <Text strong>{key}</Text>
//                           <Text> = </Text>
//                           <span className="ml-1">
//                             {renderExpression(parseExpression(expression))}
//                           </span>
//                         </div>
//                         <Button
//                           size="small"
//                           danger
//                           onClick={() => {
//                             const newFormulat = { ...formulat };
//                             delete newFormulat[key];
//                             setFormulat(newFormulat);
//                           }}
//                         >
//                           <DeleteOutlined />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               )}

//               <Divider />

//               <div className="flex flex-col sm:flex-row justify-between gap-4">
//                 <Button
//                   type="button"
//                   onClick={openCalculatorModal}
//                   disabled={items.length === 0}
//                   style={{ backgroundColor: "#52c41a" }}
//                 >
//                   <CalculatorOutlined className="mr-2" /> Définir formules
//                 </Button>

//                 <Button
//                   style={{ backgroundColor: "#1890ff" }}
//                   type="submit"
//                   disabled={submitting || !isFormValid()}
//                 >
//                   {submitting ? (
//                     <Spin size="small" />
//                   ) : (
//                     <SaveOutlined className="mr-2" />
//                   )}{" "}
//                   Enregistrer
//                 </Button>

//                 <div className="flex gap-4">
//                   <Button variant="outline" type="button" onClick={handleReset}>
//                     <ReloadOutlined className="mr-2" /> Réinitialiser
//                   </Button>
//                   <Link to="/Activities">
//                     <Button variant="secondary" type="button">
//                       Retour
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             </Card>
//           </form>
//         </div>
//       </Content>

//       <Modal
//         title="Définir les formules"
//         open={isCalculatorModalVisible}
//         onCancel={() => setIsCalculatorModalVisible(false)}
//         footer={[
//           <Button
//             key="cancel"
//             onClick={() => setIsCalculatorModalVisible(false)}
//           >
//             Annuler
//           </Button>,
//           <Button
//             key="add"
//             type="primary"
//             onClick={handleAddFormula}
//             disabled={!newFormulaKey || newFormulaExpression.length < 3}
//           >
//             Ajouter cette formule
//           </Button>,
//         ]}
//         width={800}
//       >
//         <div className="space-y-6">
//           <div>
//             <Title level={5}>Instructions</Title>
//             <Text>
//               Définissez les formules pour les calculs. Une formule nommée "roi"
//               est obligatoire pour soumettre l'activité. Exemple de formule ROI :
//               (Revenu Total - Coût Total) / Coût Total
//             </Text>
//           </div>

//           <Divider>Nouvelle formule</Divider>

//           <div>
//             <label>Nom de la formule*</label>
//             <AntInput
//               placeholder="ex: roi, revenu_total, cout_total"
//               value={newFormulaKey}
//               onChange={(e) => setNewFormulaKey(e.target.value)}
//             />
//             <Text type="secondary" className="block mt-1">
//               Pour le ROI, incluez le mot "roi" dans le nom
//             </Text>
//           </div>

//           <div>
//             <label>Expression de la formule*</label>
//             <div className="p-3 bg-gray-50 rounded min-h-12 mb-2">
//               {newFormulaExpression.length > 0 ? (
//                 renderExpression(newFormulaExpression)
//               ) : (
//                 <Text type="secondary">
//                   Construisez votre expression en utilisant les boutons ci-dessous
//                 </Text>
//               )}
//             </div>

//             <div className="flex flex-wrap gap-2 mb-4">
//               <AntButton
//                 type="primary"
//                 onClick={removeLastExpressionElement}
//                 disabled={newFormulaExpression.length === 0}
//                 icon={<CloseCircleOutlined />}
//               >
//                 Effacer dernier
//               </AntButton>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label>Éléments disponibles</label>
//                 <Select
//                   style={{ width: "100%" }}
//                   placeholder="Sélectionnez un élément"
//                   options={getAllElementsForSelection()}
//                   onSelect={(value, option) =>
//                     addExpressionElement(option.type, value)
//                   }
//                 />
//               </div>
//               <div>
//                 <label>Valeur constante</label>
//                 <div className="flex gap-2">
//                   <AntInput placeholder="ex: 100" id="constantValue" />
//                   <AntButton
//                     icon={<NumberOutlined />}
//                     onClick={() => {
//                       const value = document.getElementById("constantValue").value;
//                       if (value && !isNaN(value)) {
//                         addExpressionElement("constant", parseFloat(value));
//                         document.getElementById("constantValue").value = "";
//                       } else {
//                         message.error("Veuillez entrer un nombre valide");
//                       }
//                     }}
//                   >
//                     Ajouter
//                   </AntButton>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4">
//               <label>Opérateurs</label>
//               <div className="grid grid-cols-2 gap-2">
//                 <AntButton
//                   onClick={() => addExpressionElement("operator", "add")}
//                   style={{ height: "40px" }}
//                 >
//                   Addition (+)
//                 </AntButton>
//                 <AntButton
//                   onClick={() => addExpressionElement("operator", "subtract")}
//                   style={{ height: "40px" }}
//                 >
//                   Soustraction (-)
//                 </AntButton>
//                 <AntButton
//                   onClick={() => addExpressionElement("operator", "multiply")}
//                   style={{ height: "40px" }}
//                 >
//                   Multiplication (×)
//                 </AntButton>
//                 <AntButton
//                   onClick={() => addExpressionElement("operator", "divide")}
//                   style={{ height: "40px" }}
//                 >
//                   Division (÷)
//                 </AntButton>
//               </div>
//             </div>
//           </div>

//           {Object.keys(formulat).length > 0 && (
//             <>
//               <Divider>Formules définies</Divider>
//               <div className="max-h-60 overflow-y-auto">
//                 {Object.entries(formulat).map(([key, expression]) => (
//                   <div key={key} className="bg-gray-50 p-3 rounded mb-2">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <Text strong>{key}</Text>
//                         <Text> = </Text>
//                         {renderExpression(parseExpression(expression))}
//                       </div>
//                       <Button
//                         size="small"
//                         danger
//                         onClick={() => {
//                           const newFormulat = { ...formulat };
//                           delete newFormulat[key];
//                           setFormulat(newFormulat);
//                         }}
//                       >
//                         <DeleteOutlined />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </Modal>
//     </Layout>
//   );
// };

// export default CreateActivity;


import React, { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  Select,
  message,
  Spin,
  Input as AntInput,
  Modal,
  Button as AntButton,
  Tag,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  CalculatorOutlined,
  ReloadOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import TheHeader from "../../Header/Header"; // Adjust path as needed
import axiosInstance from "../../../axiosConfig"; // Adjust path as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// Available symbols (A-Z)
const AVAILABLE_SYMBOLS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const CreateActivity = () => {
  const [activityName, setActivityName] = useState("");
  const [items, setItems] = useState([]);
  const [formulat, setFormulat] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isCalculatorModalVisible, setIsCalculatorModalVisible] = useState(false);
  const [newFormulaKey, setNewFormulaKey] = useState("");
  const [newFormulaExpression, setNewFormulaExpression] = useState([]);

  const navigate = useNavigate();

  // Get available symbols for an item (exclude symbols used by other items)
  const getAvailableSymbols = (currentItemId) => {
    const usedSymbols = items
      .filter((item) => item.id !== currentItemId && item.symbole)
      .map((item) => item.symbole);
    return AVAILABLE_SYMBOLS.filter((symbol) => !usedSymbols.includes(symbol));
  };

  // Add a new item
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        name: "",
        symbole: "",
        type: "number",
      },
    ]);
  };

  // Remove an item
  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    // Remove any formula expressions that reference the deleted item's symbol
    const updatedFormulat = { ...formulat };
    const deletedItem = items.find((item) => item.id === id);
    if (deletedItem?.symbole) {
      Object.keys(updatedFormulat).forEach((key) => {
        if (updatedFormulat[key].split(" ").includes(deletedItem.symbole)) {
          delete updatedFormulat[key];
        }
      });
      setFormulat(updatedFormulat);
    }
  };

  // Update an item
  const handleItemChange = (id, field, value) => {
    if (field === "symbole") {
      const usedSymbols = items
        .filter((item) => item.id !== id)
        .map((item) => item.symbole);
      if (usedSymbols.includes(value)) {
        message.error("Ce symbole est déjà utilisé. Choisissez un autre.");
        return;
      }
    }
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Reset the form
  const handleReset = () => {
    setActivityName("");
    setItems([]);
    setFormulat({});
    setNewFormulaKey("");
    setNewFormulaExpression([]);
  };

  // Validate the form
  const isFormValid = () => {
    if (!activityName.trim()) return false;
    return (
      items.length > 0 &&
      items.every(
        (item) =>
          item.name.trim() &&
          item.symbole.trim() &&
          ["number", "percentage"].includes(item.type)
      ) &&
      Object.keys(formulat).length > 0 &&
      Object.keys(formulat).includes("roi")
    );
  };

  // Open formula modal
  const openCalculatorModal = () => {
    if (items.length === 0 || items.some((item) => !item.name || !item.symbole)) {
      message.error(
        "Veuillez remplir tous les champs des items avant de définir des formules."
      );
      return;
    }
    setNewFormulaKey("");
    setNewFormulaExpression([]);
    setIsCalculatorModalVisible(true);
  };

  // Add element to formula expression
  const addExpressionElement = (type, value) => {
    const canAddItemOrConstant =
      newFormulaExpression.length === 0 ||
      newFormulaExpression[newFormulaExpression.length - 1].type === "operator";
    const canAddOperator =
      newFormulaExpression.length > 0 &&
      (newFormulaExpression[newFormulaExpression.length - 1].type === "item" ||
        newFormulaExpression[newFormulaExpression.length - 1].type === "constant" ||
        newFormulaExpression[newFormulaExpression.length - 1].type === "formula");

    if ((type === "item" || type === "constant" || type === "formula") && !canAddItemOrConstant) {
      message.error(
        "Veuillez ajouter un opérateur avant d'ajouter un autre élément."
      );
      return;
    }
    if (type === "operator" && !canAddOperator) {
      message.error(
        "Veuillez ajouter un élément avant d'ajouter un opérateur."
      );
      return;
    }

    setNewFormulaExpression([...newFormulaExpression, { type, value }]);
  };

  // Remove last expression element
  const removeLastExpressionElement = () => {
    if (newFormulaExpression.length === 0) return;
    const newExpression = [...newFormulaExpression];
    newExpression.pop();
    setNewFormulaExpression(newExpression);
  };

  // Add a new formula
  const handleAddFormula = () => {
    if (!newFormulaKey.trim() || newFormulaExpression.length < 3) {
      message.error(
        "Veuillez saisir un nom de formule valide et une expression d'au moins trois éléments."
      );
      return;
    }
    if (newFormulaExpression[newFormulaExpression.length - 1].type === "operator") {
      message.error("L'expression ne peut pas se terminer par un opérateur.");
      return;
    }
    if (formulat[newFormulaKey]) {
      message.error("Ce nom de formule existe déjà. Choisissez un nom unique.");
      return;
    }

    // Convert expression to string (e.g., "A + B * roi_total")
    const expressionStr = newFormulaExpression
      .map((elem) => {
        if (elem.type === "item") {
          // Since value is already the symbole (e.g., "A"), use it directly
          return elem.value;
        } else if (elem.type === "constant") {
          return elem.value;
        } else if (elem.type === "formula") {
          return elem.value;
        } else if (elem.type === "operator") {
          switch (elem.value) {
            case "add":
              return "+";
            case "subtract":
              return "-";
            case "multiply":
              return "*";
            case "divide":
              return "/";
            default:
              return "";
          }
        }
        return "";
      })
      .filter((part) => part)
      .join(" ");

    if (!expressionStr) {
      message.error("Erreur lors de la construction de l'expression.");
      return;
    }

    const formulaKey = newFormulaKey.toLowerCase().includes("roi") ? "roi" : newFormulaKey;
    setFormulat({
      ...formulat,
      [formulaKey]: expressionStr,
    });
    setNewFormulaKey("");
    setNewFormulaExpression([]);
    message.success("Formule ajoutée avec succès.");
  };

  // Parse string expression back to array for rendering
  const parseExpression = (expressionStr) => {
    const parts = expressionStr.split(" ").filter((part) => part);
    return parts.map((part) => {
      if (items.some((i) => i.symbole === part)) return { type: "item", value: part };
      if (Object.keys(formulat).includes(part)) return { type: "formula", value: part };
      if (!isNaN(part)) return { type: "constant", value: parseFloat(part) };
      if (["+", "-", "*", "/"].includes(part)) return { type: "operator", value: part === "+" ? "add" : part === "-" ? "subtract" : part === "*" ? "multiply" : "divide" };
      return { type: "unknown", value: part };
    });
  };

  // Get item name by symbol
  const getItemNameBySymbole = (symbole) => {
    const item = items.find((i) => i.symbole === symbole);
    return item ? item.name : "Item inconnu";
  };

  // Get operation symbol for display
  const getOperationSymbol = (operation) => {
    switch (operation) {
      case "add":
        return "+";
      case "subtract":
        return "-";
      case "multiply":
        return "×";
      case "divide":
        return "÷";
      default:
        return "?";
    }
  };

  // Render expression as tags
  const renderExpression = (expression) => {
    return expression.map((elem, index) => {
      if (elem.type === "item") {
        return (
          <Tag key={index} color="blue">
            {elem.value}
          </Tag>
        );
      } else if (elem.type === "constant") {
        return (
          <Tag key={index} color="purple">
            {elem.value}
          </Tag>
        );
      } else if (elem.type === "formula") {
        return (
          <Tag key={index} color="green">
            {elem.value}
          </Tag>
        );
      } else if (elem.type === "operator") {
        return (
          <Tag key={index} color="orange">
            {getOperationSymbol(elem.value)}
          </Tag>
        );
      }
      return null;
    });
  };

  // Get options for formula expression (items, formulas)
  const getAllElementsForSelection = () => {
    const itemOptions = items.map((item) => ({
      value: item.symbole, // Use symbole instead of id
      label: `${item.name} (${item.symbole})`,
      type: "item",
    }));
    const formulaOptions = Object.keys(formulat).map((key) => ({
      value: key,
      label: `Formule: ${key}`,
      type: "formula",
    }));
    return [...itemOptions, ...formulaOptions];
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!isFormValid()) {
        message.error(
          "Veuillez remplir tous les champs et définir une formule nommée 'roi'."
        );
        setSubmitting(false);
        return;
      }

      const payload = {
        name: activityName,
        items: items.map((item) => ({
          name: item.name,
          symbole: item.symbole,
          Type: item.type,
        })),
        formulat,
      };

      console.log("Payload envoyé au backend:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.post("createActivity2", payload);
      message.success("Activité personnalisée créée avec succès");
      handleReset();
      navigate("/Activities");
    } catch (error) {
      if (error.response) {
        console.error("Erreur serveur:", error.response.data);
        message.error(
          error.response.data.message || "Erreur lors de la création"
        );
      } else {
        console.error("Erreur réseau:", error);
        message.error("Erreur de communication avec le serveur.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      {/* <TheHeader /> */}
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Créer une activité personnalisée
              </Title>
              <Divider />

              <div className="mb-6">
                <label>Nom de l'activité</label>
                <Input
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Entrez le nom de l'activité"
                />
              </div>

              <Divider>Items de base</Divider>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
                >
                  <div className="md:col-span-1">
                    <AntInput
                      placeholder="Nom de l'item"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(item.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Choisissez un symbole"
                      value={item.symbole || undefined}
                      onChange={(value) =>
                        handleItemChange(item.id, "symbole", value)
                      }
                    >
                      {getAvailableSymbols(item.id).map((symbol) => (
                        <Option key={symbol} value={symbol}>
                          {symbol}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Select
                      style={{ width: "100%" }}
                      value={item.type}
                      onChange={(value) =>
                        handleItemChange(item.id, "type", value)
                      }
                    >
                      <Option value="number">Nombre</Option>
                      <Option value="percentage">Pourcentage</Option>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <DeleteOutlined /> Supprimer
                    </Button>
                  </div>
                </div>
              ))}

              <div className="mt-4 mb-6">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <PlusOutlined /> Ajouter un item
                </Button>
              </div>

              {Object.keys(formulat).length > 0 && (
                <>
                  <Divider>Formules définies</Divider>
                  {Object.entries(formulat).map(([key, expression]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded mb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>{key}</Text>
                          <Text> = </Text>
                          <span className="ml-1">
                            {renderExpression(parseExpression(expression))}
                          </span>
                        </div>
 natychmiast <Button
                          size="small"
                          danger
                          onClick={() => {
                            const newFormulat = { ...formulat };
                            delete newFormulat[key];
                            setFormulat(newFormulat);
                          }}
                        >
                          <DeleteOutlined />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <Divider />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  type="button"
                  onClick={openCalculatorModal}
                  disabled={items.length === 0}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  <CalculatorOutlined className="mr-2" /> Définir formules
                </Button>

                <Button
                  style={ submitting || !isFormValid() ? { backgroundColor: "#1890ff", opacity: 0.5, cursor: "not-allowed" } : { backgroundColor: "#1890ff" }}
                  type="submit"
                  disabled={submitting || !isFormValid()}
                >
                  {submitting ? (
                    <Spin size="small" />
                  ) : (
                    <SaveOutlined className="mr-2" />
                  )}{" "}
                  Enregistrer
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleReset}>
                    <ReloadOutlined className="mr-2" /> Réinitialiser
                  </Button>
                  <Link to="/Activities">
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

      <Modal
        title="Définir les formules"
        open={isCalculatorModalVisible}
        onCancel={() => setIsCalculatorModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsCalculatorModalVisible(false)}
          >
            Annuler
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddFormula}
            disabled={!newFormulaKey || newFormulaExpression.length < 3}
          >
            Ajouter cette formule
          </Button>,
        ]}
        width={800}
      >
        <div className="space-y-6">
          <div>
            <Title level={5}>Instructions</Title>
            <Text>
              Définissez les formules pour les calculs. Une formule nommée "roi"
              est obligatoire pour soumettre l'activité. Exemple de formule ROI :
              (Revenu Total - Coût Total) / Coût Total
            </Text>
          </div>

          <Divider>Nouvelle formule</Divider>

          <div>
            <label>Nom de la formule*</label>
            <AntInput
              placeholder="ex: roi, revenu_total, cout_total"
              value={newFormulaKey}
              onChange={(e) => setNewFormulaKey(e.target.value)}
            />
            <Text type="secondary" className="block mt-1">
              Pour le ROI, incluez le mot "roi" dans le nom
            </Text>
          </div>

          <div>
            <label>Expression de la formule*</label>
            <div className="p-3 bg-gray-50 rounded min-h-12 mb-2">
              {newFormulaExpression.length > 0 ? (
                renderExpression(newFormulaExpression)
              ) : (
                <Text type="secondary">
                  Construisez votre expression en utilisant les boutons ci-dessous
                </Text>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <AntButton
                type="primary"
                onClick={removeLastExpressionElement}
                disabled={newFormulaExpression.length === 0}
                icon={<CloseCircleOutlined />}
              >
                Effacer dernier
              </AntButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Éléments disponibles</label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Sélectionnez un élément"
                  options={getAllElementsForSelection()}
                  onSelect={(value, option) =>
                    addExpressionElement(option.type, value)
                  }
                />
              </div>
              <div>
                <label>Valeur constante</label>
                <div className="flex gap-2">
                  <AntInput placeholder="ex: 100" id="constantValue" />
                  <AntButton
                    icon={<NumberOutlined />}
                    onClick={() => {
                      const value = document.getElementById("constantValue").value;
                      if (value && !isNaN(value)) {
                        addExpressionElement("constant", parseFloat(value));
                        document.getElementById("constantValue").value = "";
                      } else {
                        message.error("Veuillez entrer un nombre valide");
                      }
                    }}
                  >
                    Ajouter
                  </AntButton>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label>Opérateurs</label>
              <div className="grid grid-cols-2 gap-2">
                <AntButton
                  onClick={() => addExpressionElement("operator", "add")}
                  style={{ height: "40px" }}
                >
                  Addition (+)
                </AntButton>
                <AntButton
                  onClick={() => addExpressionElement("operator", "subtract")}
                  style={{ height: "40px" }}
                >
                  Soustraction (-)
                </AntButton>
                <AntButton
                  onClick={() => addExpressionElement("operator", "multiply")}
                  style={{ height: "40px" }}
                >
                  Multiplication (×)
                </AntButton>
                <AntButton
                  onClick={() => addExpressionElement("operator", "divide")}
                  style={{ height: "40px" }}
                >
                  Division (÷)
                </AntButton>
              </div>
            </div>
          </div>

          {Object.keys(formulat).length > 0 && (
            <>
              <Divider>Formules définies</Divider>
              <div className="max-h-60 overflow-y-auto">
                {Object.entries(formulat).map(([key, expression]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong>{key}</Text>
                        <Text> = </Text>
                        {renderExpression(parseExpression(expression))}
                      </div>
                      <Button
                        size="small"
                        danger
                        onClick={() => {
                          const newFormulat = { ...formulat };
                          delete newFormulat[key];
                          setFormulat(newFormulat);
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default CreateActivity;
