// import React, { useState } from "react";
// import {
//   Layout,
//   Typography,
//   Card,
//   Divider,
//   Input as AntInput,
//   Select,
//   message,
//   Spin,
//   Button as AntButton,
//   Tag,
//   Modal,
// } from "antd";
// import {
//   PlusOutlined,
//   SaveOutlined,
//   DeleteOutlined,
//   CloseCircleOutlined,
//   ReloadOutlined,
//   NumberOutlined,
// } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import TheHeader from "../../Header/Header"; // Adjust path as needed
// import axiosInstance from "../../../axiosConfig"; // Adjust path as needed
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { Option } = Select;

// const CreateRegularActivity = () => {
//   const [activityName, setActivityName] = useState("");
//   const [description, setDescription] = useState("");
//   const [items, setItems] = useState([]);
//   const [formulat, setFormulat] = useState({});
//   const [isFormulaModalVisible, setIsFormulaModalVisible] = useState(false);
//   const [newFormula, setNewFormula] = useState({ name: "", expression: [] });
//   const [submitting, setSubmitting] = useState(false);

//   const navigate = useNavigate();

//   // Add a new item
//   const handleAddItem = () => {
//     setItems([
//       ...items,
//       {
//         id: `item-${Date.now()}`,
//         name: "",
//         symbole: "",
//         Type: "number",
//       },
//     ]);
//   };

//   // Remove an item
//   const handleRemoveItem = (id) => {
//     setItems(items.filter((item) => item.id !== id));
//     // Remove formulas that depend on this item
//     const updatedFormulat = { ...formulat };
//     Object.keys(updatedFormulat).forEach((key) => {
//       if (updatedFormulat[key].includes(id)) {
//         delete updatedFormulat[key];
//       }
//     });
//     setFormulat(updatedFormulat);
//   };

//   // Update an item
//   const handleItemChange = (id, field, value) => {
//     if (field === "symbole") {
//       if (value.length > 10) {
//         message.error("Le symbole ne peut pas dépasser 10 caractères.");
//         return;
//       }
//       // Check for unique symbols
//       if (items.some((item) => item.id !== id && item.symbole === value)) {
//         message.error("Le symbole doit être unique.");
//         return;
//       }
//     }
//     setItems(
//       items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
//     );
//   };

//   // Open formula modal
//   const openFormulaModal = () => {
//     if (items.length === 0 || items.some((item) => !item.name || !item.symbole)) {
//       message.error("Veuillez ajouter et compléter tous les items avant de définir des formules.");
//       return;
//     }
//     setNewFormula({ name: "", expression: [] });
//     setIsFormulaModalVisible(true);
//   };

//   // Add element to formula expression
//   const addExpressionElement = (type, value) => {
//     const canAddItemOrConstant =
//       newFormula.expression.length === 0 ||
//       newFormula.expression[newFormula.expression.length - 1].type === "operator";
//     const canAddOperator =
//       newFormula.expression.length > 0 &&
//       (newFormula.expression[newFormula.expression.length - 1].type === "item" ||
//         newFormula.expression[newFormula.expression.length - 1].type === "constant");

//     if ((type === "item" || type === "constant") && !canAddItemOrConstant) {
//       message.error("Veuillez ajouter un opérateur avant d'ajouter un autre élément.");
//       return;
//     }
//     if (type === "operator" && !canAddOperator) {
//       message.error("Veuillez ajouter un élément avant d'ajouter un opérateur.");
//       return;
//     }

//     setNewFormula({
//       ...newFormula,
//       expression: [...newFormula.expression, { type, value }],
//     });
//   };

//   // Remove last expression element
//   const removeLastExpressionElement = () => {
//     if (newFormula.expression.length === 0) return;
//     const newExpression = [...newFormula.expression];
//     newExpression.pop();
//     setNewFormula({ ...newFormula, expression: newExpression });
//   };

//   // Add a new formula to formulat
//   const handleAddFormula = () => {
//     const { name, expression } = newFormula;
//     if (!name.trim() || expression.length < 3) {
//       message.error(
//         "Veuillez saisir un nom et une expression valide (au moins un opérateur et deux opérandes)."
//       );
//       return;
//     }
//     if (expression[expression.length - 1].type === "operator") {
//       message.error("L'expression ne peut pas se terminer par un opérateur.");
//       return;
//     }
//     if (formulat[name]) {
//       message.error("Ce nom de formule existe déjà. Choisissez un nom unique.");
//       return;
//     }

//     // Convert expression to string (e.g., "A * B")
//     const expressionStr = expression
//       .map((elem) => {
//         if (elem.type === "item") {
//           const item = items.find((item) => item.id === elem.value);
//           return item ? item.symbole : "";
//         } else if (elem.type === "constant") {
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
//       .join(" ")
//       .trim();

//     if (!expressionStr) {
//       message.error("Erreur lors de la construction de l'expression.");
//       return;
//     }

//     setFormulat({
//       ...formulat,
//       [name]: expressionStr,
//     });
//     setNewFormula({ name: "", expression: [] });
//     message.success("Formule ajoutée avec succès.");
//   };

//   // Remove a formula from formulat
//   const handleRemoveFormula = (key) => {
//     const updatedFormulat = { ...formulat };
//     delete updatedFormulat[key];
//     setFormulat(updatedFormulat);
//   };

//   // Reset the form
//   const handleReset = () => {
//     setActivityName("");
//     setDescription("");
//     setItems([]);
//     setFormulat({});
//     setNewFormula({ name: "", expression: [] });
//   };

//   // Validate the form
//   const isFormValid = () => {
//     if (!activityName.trim()) return false;
//     if (
//       description &&
//       (!isString(description) || description.length > 65535)
//     ) {
//       return false;
//     }
//     if (items.length === 0 || Object.keys(formulat).length === 0) return false;
//     return items.every(
//       (item) =>
//         item.name.trim() &&
//         item.symbole.trim() &&
//         item.symbole.length <= 10 &&
//         ["number", "percentage"].includes(item.Type)
//     );
//   };

//   // Check if a value is a string
//   const isString = (value) => typeof value === "string" || value instanceof String;

//   // Submit the form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const hasRoiFormulat = Object.keys(formulat).some((key) =>
//         key.toLowerCase().includes("roi")
//       );
//       if (!hasRoiFormulat) {
//         message.error("Vous devez définir une formule nommée contenant 'ROI'.");
//         setSubmitting(false);
//         return;
//       }

//       const payload = {
//         name: activityName,
//         description: description || undefined,
//         items: items.map((item) => ({
//           name: item.name,
//           symbole: item.symbole,
//           Type: item.Type,
//         })),
//         formulat,
//       };

//       console.log("Payload envoyé au backend:", JSON.stringify(payload, null, 2));

//       const response = await axiosInstance.post("/createActivity2", payload);
//       message.success("Activité régulière créée avec succès");
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

//   // Get item name by ID for expression rendering
//   const getItemNameById = (id) => {
//     const item = items.find((item) => item.id === id);
//     return item ? item.name : "Item inconnu";
//   };

//   // Get operator symbol for display
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
//             {getItemNameById(elem.value)}
//           </Tag>
//         );
//       } else if (elem.type === "constant") {
//         return (
//           <Tag key={index} color="purple">
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

//   // Get items for selection in the modal
//   const getItemsForSelection = () => {
//     return items.map((item) => ({
//       value: item.id,
//       label: `${item.name} (${item.symbole})`,
//     }));
//   };

//   return (
//     <Layout className="min-h-screen">
//       <TheHeader />
//       <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
//         <div style={{ maxWidth: 800, margin: "0 auto" }}>
//           <form onSubmit={handleSubmit}>
//             <Card>
//               <Title level={4} style={{ textAlign: "center" }}>
//                 Créer une activité régulière
//               </Title>
//               <Divider />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label>Nom de l'activité</label>
//                   <Input
//                     value={activityName}
//                     onChange={(e) => setActivityName(e.target.value)}
//                     placeholder="Entrez le nom de l'activité"
//                   />
//                 </div>
//                 <div>
//                   <label>Description (optionnel)</label>
//                   <Textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Entrez une description"
//                     rows={4}
//                   />
//                 </div>
//               </div>

//               <Divider>Items</Divider>

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
//                     <AntInput
//                       placeholder="Symbole (ex: A)"
//                       value={item.symbole}
//                       onChange={(e) =>
//                         handleItemChange(item.id, "symbole", e.target.value)
//                       }
//                     />
//                   </div>
//                   <div className="md:col-span-1">
//                     <Select
//                       style={{ width: "100%" }}
//                       value={item.Type}
//                       onChange={(value) =>
//                         handleItemChange(item.id, "Type", value)
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

//               <Divider>Formules</Divider>

//               <div className="mb-4">
//                 <Button
//                   type="button"
//                   onClick={openFormulaModal}
//                   style={{ backgroundColor: "#52c41a" }}
//                   disabled={items.length === 0}
//                 >
//                   <PlusOutlined /> Ajouter une formule
//                 </Button>
//               </div>

//               {Object.keys(formulat).length > 0 && (
//                 <div className="bg-gray-50 p-3 rounded mb-3">
//                   {Object.entries(formulat).map(([key, value]) => (
//                     <div
//                       key={key}
//                       className="flex justify-between items-center mb-2"
//                     >
//                       <div>
//                         <Text strong>{key}</Text>
//                         <Text> = </Text>
//                         <Tag color="blue">{value}</Tag>
//                       </div>
//                       <Button
//                         size="small"
//                         danger
//                         onClick={() => handleRemoveFormula(key)}
//                       >
//                         <DeleteOutlined />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <Divider />

//               <div className="flex flex-col sm:flex-row justify-between gap-4">
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
//         title="Définir une formule"
//         open={isFormulaModalVisible}
//         onCancel={() => setIsFormulaModalVisible(false)}
//         footer={[
//           <Button
//             key="cancel"
//             onClick={() => setIsFormulaModalVisible(false)}
//           >
//             Annuler
//           </Button>,
//           <Button
//             key="add"
//             type="primary"
//             onClick={handleAddFormula}
//             disabled={!newFormula.name || newFormula.expression.length < 3}
//           >
//             Ajouter formule
//           </Button>,
//         ]}
//         width={800}
//       >
//         <div className="space-y-6">
//           <div>
//             <Title level={5}>Instructions</Title>
//             <Text>
//               Pour calculer le ROI, vous devez obligatoirement créer un calcul
//               nommé "ROI". Vous pouvez également ajouter d'autres calculs comme
//               "Revenu Total" ou "Coût Total".
//             </Text>
//             <Text type="secondary" className="block mt-1">
//               Une formule nommée contenant "ROI" est requise pour soumettre l'activité.
//             </Text>
//           </div>

//           <Divider>Nouvelle formule</Divider>

//           <div>
//             <label>Nom de la formule*</label>
//             <AntInput
//               placeholder="ex: ROI, total_doctors_trained"
//               value={newFormula.name}
//               onChange={(e) =>
//                 setNewFormula({ ...newFormula, name: e.target.value })
//               }
//             />
//             <Text type="secondary" className="block mt-1">
//               Pour le ROI, incluez le mot "ROI" dans le nom
//             </Text>
//           </div>

//           <div>
//             <label>Expression de la formule*</label>
//             <div className="p-3 bg-gray-50 rounded min-h-12 mb-2">
//               {newFormula.expression.length > 0 ? (
//                 renderExpression(newFormula.expression)
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
//                 disabled={newFormula.expression.length === 0}
//                 icon={<CloseCircleOutlined />}
//               >
//                 Effacer dernier
//               </AntButton>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label>Items disponibles</label>
//                 <Select
//                   style={{ width: "100%" }}
//                   placeholder="Sélectionnez un item"
//                   options={getItemsForSelection()}
//                   onSelect={(value) => addExpressionElement("item", value)}
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
//         </div>
//       </Modal>
//     </Layout>
//   );
// };

// export default CreateRegularActivity;

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
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import TheHeader from "../../Header/Header";
import axiosInstance from "../../../axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const CreateActivity = () => {
  const [activityName, setActivityName] = useState("");
  const [items, setItems] = useState([]);
  const [formulat, setFormulat] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isCalculatorModalVisible, setIsCalculatorModalVisible] = useState(false);
  const [newFormulaKey, setNewFormulaKey] = useState("");
  const [newFormulaExpression, setNewFormulaExpression] = useState([]);

  const navigate = useNavigate();

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

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    // Remove any formula expressions that reference the deleted item
    const updatedFormulat = { ...formulat };
    Object.keys(updatedFormulat).forEach((key) => {
      if (updatedFormulat[key].includes(id)) {
        delete updatedFormulat[key];
      }
    });
    setFormulat(updatedFormulat);
  };

  const handleItemChange = (id, field, value) => {
    if (field === "symbole" && value.length > 10) {
      message.error("Le symbole ne peut pas dépasser 10 caractères.");
      return;
    }
    if (field === "symbole" && items.some((item) => item.symbole === value && item.id !== id)) {
      message.error("Le symbole doit être unique.");
      return;
    }
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleReset = () => {
    setActivityName("");
    setItems([]);
    setFormulat({});
  };

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

  const openCalculatorModal = () => {
    if (!isFormValid()) {
      message.error(
        "Veuillez remplir tous les champs des items avant de définir des formules."
      );
      return;
    }
    setNewFormulaKey("");
    setNewFormulaExpression([]);
    setIsCalculatorModalVisible(true);
  };

  const addExpressionElement = (type, value) => {
    const canAddItemOrConstant =
      newFormulaExpression.length === 0 ||
      newFormulaExpression[newFormulaExpression.length - 1].type === "operator";
    const canAddOperator =
      newFormulaExpression.length > 0 &&
      (newFormulaExpression[newFormulaExpression.length - 1].type === "item" ||
        newFormulaExpression[newFormulaExpression.length - 1].type === "constant");

    if ((type === "item" || type === "constant") && !canAddItemOrConstant) {
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

  const removeLastExpressionElement = () => {
    if (newFormulaExpression.length === 0) return;
    const newExpression = [...newFormulaExpression];
    newExpression.pop();
    setNewFormulaExpression(newExpression);
  };

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

    // Convert expression to string format (e.g., "A + B * 2")
    const expressionStr = newFormulaExpression
      .map((elem) => {
        if (elem.type === "item") {
          const item = items.find((i) => i.id === elem.value);
          return item ? item.symbole : elem.value;
        } else if (elem.type === "constant") {
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
      .join(" ");

    setFormulat({
      ...formulat,
      [newFormulaKey.toLowerCase().includes("roi") ? "roi" : newFormulaKey]: expressionStr,
    });
    setNewFormulaKey("");
    setNewFormulaExpression([]);
    message.success("Formule ajoutée avec succès.");
  };

  const getItemNameById = (id) => {
    const item = items.find((i) => i.id === id);
    return item ? item.name : "Item inconnu";
  };

  const getItemSymboleById = (id) => {
    const item = items.find((i) => i.id === id);
    return item ? item.symbole : "???";
  };

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

  const renderExpression = (expression) => {
    return expression.map((elem, index) => {
      if (elem.type === "item") {
        return (
          <Tag key={index} color="blue">
            {getItemSymboleById(elem.value)}
          </Tag>
        );
      } else if (elem.type === "constant") {
        return (
          <Tag key={index} color="purple">
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

  const getAllItemsForSelection = () => {
    return items.map((item) => ({
      value: item.id,
      label: `${item.name} (${item.symbole})`,
    }));
  };

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

      const response = await axiosInstance.post("insertCustomActivity2", payload);
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
                    <AntInput
                      placeholder="Symbole (max 10 caractères)"
                      value={item.symbole}
                      onChange={(e) =>
                        handleItemChange(item.id, "symbole", e.target.value)
                      }
                    />
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
                            {expression.split(" ").map((part, index) => (
                              <Tag
                                key={index}
                                color={
                                  items.some((i) => i.symbole === part)
                                    ? "blue"
                                    : !isNaN(part)
                                    ? "purple"
                                    : "orange"
                                }
                              >
                                {part}
                              </Tag>
                            ))}
                          </span>
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
                  style={{ backgroundColor: "#1890ff" }}
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
                onClick={() => removeLastExpressionElement()}
                disabled={newFormulaExpression.length === 0}
                icon={<CloseCircleOutlined />}
              >
                Effacer dernier
              </AntButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Champs disponibles</label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Sélectionnez un item"
                  options={getAllItemsForSelection()}
                  onSelect={(value) => addExpressionElement("item", value)}
                />
              </div>
              <div>
                <label>Valeur constante</label>
                <div className="flex gap-2">
                  <AntInput placeholder="ex: 100" id="constantValue" />
                  <AntButton
                    icon={<CloseCircleOutlined />}
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

          <div className="mt-4">
            <Button
              type="primary"
              onClick={handleAddFormula}
              disabled={!newFormulaKey || newFormulaExpression.length < 3}
            >
              Ajouter cette formule
            </Button>
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
                        {expression.split(" ").map((part, index) => (
                          <Tag
                            key={index}
                            color={
                              items.some((i) => i.symbole === part)
                                ? "blue"
                                : !isNaN(part)
                                ? "purple"
                                : "orange"
                            }
                          >
                            {part}
                          </Tag>
                        ))}
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