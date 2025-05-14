import React, { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  DatePicker,
  Select,
  message,
  Spin,
  Input as AntInput,
  Modal,
  Button as AntButton,
  Tag,
  Alert,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  CalculatorOutlined,
  ReloadOutlined,
  DeleteOutlined,
  NumberOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import TheHeader from "../../Header/Header";
import axiosInstance from "../../../axiosConfig";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AddActivity= () => {

  const [activityName, setActivityName] = useState("");
  const [year, setYear] = useState(null);
  const [items, setItems] = useState([]);
  const [calculatedItems, setCalculatedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [roiResult, setRoiResult] = useState(null);
  const [roiFinal, setRoiFinal] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [isCalculatorModalVisible, setIsCalculatorModalVisible] = useState(false);
  const [newCalculatedItem, setNewCalculatedItem] = useState({
    name: "",
    expression: [],
  });

  const navigate = useNavigate();

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        name: "",
        value: "",
        type: "number",
      },
    ]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    const updatedCalculatedItems = calculatedItems.filter(
      (calcItem) =>
        !calcItem.expression.some((expr) => expr.type === "item" && expr.value === id)
    );
    setCalculatedItems(updatedCalculatedItems);
  };

  const handleItemChange = (id, field, value) => {
    if (field === "value") {
      const item = items.find((item) => item.id === id);
      if (item.type === "number" && value !== "" && isNaN(value)) {
        message.error("Veuillez entrer une valeur numérique valide.");
        return;
      }
      if (
        item.type === "percentage" &&
        value !== "" &&
        (isNaN(value) || value < 0 || value > 100)
      ) {
        message.error("Veuillez entrer un pourcentage valide (0-100).");
        return;
      }
    }
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    setRoiResult(null);
    setRoiFinal(null);
    setInterpretation(null);
  };

  const handleReset = () => {
    setActivityName("");
    setYear(null);
    setItems([]);
    setCalculatedItems([]);
    setRoiResult(null);
    setRoiFinal(null);
    setInterpretation(null);
  };

  const isFormValid = () => {
    if (!activityName.trim() || !year) return false;
    return (
      items.length > 0 &&
      items.every((item) => item.name.trim() && item.value !== "" && !isNaN(item.value) && item.type)
    );
  };

  const openCalculatorModal = () => {
    if (!isFormValid()) {
      message.error("Veuillez remplir tous les champs avant de définir des calculs.");
      return;
    }
    setNewCalculatedItem({ name: "", expression: [] });
    setIsCalculatorModalVisible(true);
  };

  const addExpressionElement = (type, value) => {
    const canAddItemOrConstant =
      newCalculatedItem.expression.length === 0 ||
      newCalculatedItem.expression[newCalculatedItem.expression.length - 1].type === "operator";
    const canAddOperator =
      newCalculatedItem.expression.length > 0 &&
      (newCalculatedItem.expression[newCalculatedItem.expression.length - 1].type === "item" ||
        newCalculatedItem.expression[newCalculatedItem.expression.length - 1].type === "constant");

    if ((type === "item" || type === "constant") && !canAddItemOrConstant) {
      message.error("Veuillez ajouter un opérateur avant d'ajouter un autre élément.");
      return;
    }
    if (type === "operator" && !canAddOperator) {
      message.error("Veuillez ajouter un élément avant d'ajouter un opérateur.");
      return;
    }

    setNewCalculatedItem({
      ...newCalculatedItem,
      expression: [...newCalculatedItem.expression, { type, value }],
    });
  };

  const removeLastExpressionElement = () => {
    if (newCalculatedItem.expression.length === 0) return;
    const newExpression = [...newCalculatedItem.expression];
    newExpression.pop();
    setNewCalculatedItem({ ...newCalculatedItem, expression: newExpression });
  };

  const handleAddCalculatedItem = () => {
    const { name, expression } = newCalculatedItem;
    if (!name.trim() || expression.length < 3) {
      message.error(
        "Veuillez saisir un nom et une expression valide (au moins un opérateur et deux opérandes)."
      );
      return;
    }
    if (expression[expression.length - 1].type === "operator") {
      message.error("L'expression ne peut pas se terminer par un opérateur.");
      return;
    }
    if (name.toLowerCase().includes("roi") && expression.length < 5) {
      message.warning(
        "L'expression pour le ROI doit être suffisamment détaillée pour un calcul précis."
      );
    }

    const newItem = {
      id: `calc-${Date.now()}`,
      name: name.toLowerCase().includes("roi") ? "ROI" : name, // Normalize ROI name
      expression,
      value: 0,
      isCalculated: true,
    };

    setCalculatedItems([...calculatedItems, newItem]);
    setNewCalculatedItem({ name: "", expression: [] });
    message.success("Calcul ajouté avec succès.");
  };

  const evaluateExpression = (expression, valueMap) => {
    let expressionStr = "";
    let hasError = false;

    console.log("Evaluating expression:", expression);
    console.log("Value map:", valueMap);

    expression.forEach((elem) => {
      if (elem.type === "item") {
        const itemValue = valueMap[elem.value];
        if (itemValue === undefined || isNaN(itemValue)) {
          console.error(`Erreur: Valeur manquante ou invalide pour l'item ${elem.value}`);
          hasError = true;
          return;
        }
        expressionStr += itemValue;
      } else if (elem.type === "constant") {
        if (isNaN(elem.value)) {
          console.error(`Erreur: Constante invalide ${elem.value}`);
          hasError = true;
          return;
        }
        expressionStr += elem.value;
      } else if (elem.type === "operator") {
        switch (elem.value) {
          case "add":
            expressionStr += "+";
            break;
          case "subtract":
            expressionStr += "-";
            break;
          case "multiply":
            expressionStr += "*";
            break;
          case "divide":
            expressionStr += "/";
            break;
          default:
            console.error(`Erreur: Opérateur inconnu ${elem.value}`);
            hasError = true;
            expressionStr += "+";
        }
      }
    });

    if (hasError) {
      console.error("Erreur dans l'évaluation de l'expression: Données invalides");
      return 0;
    }

    console.log("Expression string:", expressionStr);

    try {
      const result = new Function("return " + expressionStr)();
      if (isNaN(result) || !isFinite(result)) {
        console.error("Erreur: Résultat non valide (NaN ou Infini)");
        return 0;
      }
      console.log("Expression result:", result);
      return result;
    } catch (error) {
      console.error("Erreur d'évaluation d'expression:", error);
      return 0;
    }
  };

  const performCalculations = () => {
    const valueMap = {};
    items.forEach((item) => {
      valueMap[item.id] = parseFloat(item.value);
    });

    console.log("Value map for calculations:", valueMap);

    let remainingItems = [...calculatedItems];
    const processedItems = [];
    const maxIterations = remainingItems.length * 2;
    let iterations = 0;

    while (remainingItems.length > 0 && iterations < maxIterations) {
      iterations++;
      const initialLength = remainingItems.length;

      const itemsToProcess = remainingItems.filter((item) =>
        item.expression.every((expr) => expr.type !== "item" || valueMap[expr.value] !== undefined)
      );

      console.log("Items to process:", itemsToProcess);

      itemsToProcess.forEach((item) => {
        const calculatedValue = evaluateExpression(item.expression, valueMap);
        valueMap[item.id] = calculatedValue;
        processedItems.push({ ...item, value: calculatedValue });
      });

      remainingItems = remainingItems.filter(
        (item) => !itemsToProcess.some((processedItem) => processedItem.id === item.id)
      );

      if (initialLength === remainingItems.length && remainingItems.length > 0) {
        console.error("Dépendance circulaire détectée dans les calculs.");
        message.error("Dépendance circulaire détectée dans les calculs.");
        break;
      }
    }

    console.log("Processed items:", processedItems);
    return processedItems;
  };

  const generateInterpretation = async (result) => {
    try {
      const inputs = {};
      items.forEach((item) => {
        inputs[item.name.toLowerCase().replace(/\s+/g, "_")] = parseFloat(item.value);
      });
      calculatedItems.forEach((item) => {
        inputs[item.name.toLowerCase().replace(/\s+/g, "_")] = item.value;
      });

      const payload = {
        ...result,
        inputs,
      };
      console.log("Interpretation payload:", payload);
      const response = await axiosInstance.post("/generate-interpretation", payload);
      return response.data.interpretation;
    } catch (error) {
      console.error("Erreur lors de la génération de l'interprétation :", error);
      return null;
    }
  };

  const calculateRoi = async () => {
    if (!isFormValid()) {
      message.error("Veuillez remplir tous les champs avant de calculer le ROI.");
      return;
    }

    const hasRoiItem = calculatedItems.some((item) => item.name.toLowerCase().includes("roi"));
    if (!hasRoiItem) {
      message.error("Vous devez définir un calcul nommé 'ROI' avant de calculer.");
      return;
    }

    setCalculating(true);

    try {
      const updatedCalculatedItems = performCalculations();
      console.log("Updated Calculated Items:", updatedCalculatedItems);

      const calculatedMap = {};
      updatedCalculatedItems.forEach((item) => {
        calculatedMap[item.id] = item.value;
      });

      const roiItem = updatedCalculatedItems.find((item) => item.name === "ROI");
      const revenueItem = updatedCalculatedItems.find((item) =>
        item.name.toLowerCase().includes("revenu") || item.name.toLowerCase().includes("revenue")
      );
      const costItem = updatedCalculatedItems.find((item) =>
        item.name.toLowerCase().includes("coût") ||
        item.name.toLowerCase().includes("cout") ||
        item.name.toLowerCase().includes("cost")
      );

      const result = {
        roi: roiItem ? roiItem.value : 0,
        totalRevenue: revenueItem ? revenueItem.value : 0,
        totalCost: costItem ? costItem.value : 0,
      };

      // Store ROI value in roiFinal
      if (roiItem) {
        if (roiItem.value === 0) {
          console.warn("ROI calculé est 0, vérifiez l'expression et les données d'entrée.");
          message.warning("La valeur du ROI est 0. Veuillez vérifier votre calcul.");
        }
        setRoiFinal(roiItem.value);
        console.log("ROI Final set to:", roiItem.value);
      } else {
        setRoiFinal(0);
        console.error("Aucun item ROI trouvé dans les calculatedItems.");
        message.error("Erreur: Aucun calcul ROI valide trouvé.");
      }

      setCalculatedItems(updatedCalculatedItems);
      setRoiResult(result);

      console.log("ROI Result:", result);

      const interpretationText = await generateInterpretation(result);
      if (interpretationText) {
        setInterpretation(interpretationText);
      } else {
        message.error("L'interprétation n'est pas disponible pour le moment.");
      }

      message.success("Calcul terminé avec succès.");
      setIsCalculatorModalVisible(false);
    } catch (error) {
      message.error("Erreur lors du calcul du ROI. Veuillez vérifier vos données.");
      console.error("Erreur dans calculateRoi:", error);
    } finally {
      setCalculating(false);
    }
  };

  const getItemNameById = (id) => {
    const regularItem = items.find((item) => item.id === id);
    if (regularItem) return regularItem.name;
    const calcItem = calculatedItems.find((item) => item.id === id);
    if (calcItem) return calcItem.name;
    return "Item inconnu";
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
            {getItemNameById(elem.value)}
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
    return [
      ...items.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.value})`,
      })),
      ...calculatedItems.map((item) => ({
        value: item.id,
        label: `${item.name} (Calculé)`,
      })),
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const hasRoiItem = calculatedItems.some((item) => item.name === "ROI");
      if (!hasRoiItem) {
        message.error("Vous devez définir un calcul nommé 'ROI' avant de soumettre.");
        setSubmitting(false);
        return;
      }

      if (roiFinal === null) {
        message.error("Veuillez calculer le ROI avant de soumettre.");
        setSubmitting(false);
        return;
      }

      if (roiFinal === 0) {
        message.warning("La valeur du ROI est 0. Souhaitez-vous continuer ?");
      }

      const payload = {
        name: activityName,
        year: year,
        items: items.map((item) => ({
          name: item.name,
          value: parseFloat(item.value),
          type: item.type,
        })),
        calculatedItems: calculatedItems.map((item) => ({
          name: item.name,
          value: item.name === "ROI" ? roiFinal : item.value || 0,
        })),
      };

      console.log("Payload envoyé au backend:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.post("insertCustomActivity1", payload);
      message.success("Activité personnalisée créée avec succès");
      handleReset();
      navigate("/Activities");
    } catch (error) {
      if (error.response) {
        console.error("Erreur serveur:", error.response.data);
        message.error(error.response.data.message || "Erreur lors de la création");
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
          {roiResult && (
            <div className="mt-8">
              <Divider>Résultats</Divider>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <Typography.Text strong>ROI</Typography.Text>
                  <Typography.Title
                    level={2}
                    style={{ color: roiResult.roi >= 1 ? "#3f8600" : "#cf1322" }}
                  >
                    {(roiResult.roi * 100).toFixed(2)}%
                  </Typography.Title>
                </Card>
                <Card>
                  <Typography.Text strong>Revenu Total</Typography.Text>
                  <Typography.Title level={2}>
                    {roiResult.totalRevenue.toFixed(2)} MAD
                  </Typography.Title>
                </Card>
                <Card>
                  <Typography.Text strong>Coût Total</Typography.Text>
                  <Typography.Title level={2}>
                    {roiResult.totalCost.toFixed(2)} MAD
                  </Typography.Title>
                </Card>
              </div>
              {roiResult.roi < 1 && (
                <Alert
                  style={{ marginTop: "16px" }}
                  message="ROI Négatif ou Faible"
                  description="L'activité génère un retour insuffisant. Consultez les conseils ci-dessous pour améliorer vos résultats."
                  type="warning"
                  showIcon
                />
              )}
              {roiResult.roi >= 1 && (
                <Alert
                  style={{ marginTop: "16px" }}
                  message="ROI Positif"
                  description="L'activité génère un retour positif. Continuez à optimiser pour maximiser les résultats."
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
                Créer une activité personnalisée
              </Title>
              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label>Nom de l'activité</label>
                  <Input
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="Entrez le nom de l'activité"
                  />
                </div>

              </div>

              <Divider>Items de base</Divider>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1">
                    <AntInput
                      placeholder="Nom de l'item"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <AntInput
                      placeholder="Valeur"
                      value={item.value}
                      onChange={(e) => handleItemChange(item.id, "value", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Select
                      style={{ width: "100%" }}
                      value={item.type}
                      onChange={(value) => handleItemChange(item.id, "type", value)}
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

              {calculatedItems.length > 0 && (
                <>
                  <Divider>Items calculés</Divider>
                  {calculatedItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded mb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>{item.name}</Text>
                          <Text> = </Text>
                          <span className="ml-1">{renderExpression(item.expression)}</span>
                          <Text type="secondary">
                            {" "}
                            = {item.value !== undefined ? item.value.toFixed(2) : "N/A"}
                          </Text>
                        </div>
                        <Button
                          size="small"
                          danger
                          onClick={() => {
                            setCalculatedItems(calculatedItems.filter((ci) => ci.id !== item.id));
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
                  disabled={!isFormValid()}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  <CalculatorOutlined className="mr-2" /> Calculer ROI
                </Button>

                <Button
                  style={{ backgroundColor: "#1890ff" }}
                  type="submit"
                  disabled={submitting || !isFormValid() || !roiResult}
                >
                  {submitting ? <Spin size="small" /> : <SaveOutlined className="mr-2" />} Enregistrer
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
        title="Définir les calculs et ROI"
        open={isCalculatorModalVisible}
        onCancel={() => setIsCalculatorModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsCalculatorModalVisible(false)}>
            Annuler
          </Button>,
          <Button
            key="calculate"
            type="primary"
            onClick={calculateRoi}
            disabled={!calculatedItems.some((item) => item.name.toLowerCase().includes("roi"))}
          >
            {calculating ? <Spin size="small" /> : "Calculer et afficher les résultats"}
          </Button>,
        ]}
        width={800}
      >
        <div className="space-y-6">
          <div>
            <Title level={5}>Instructions</Title>
            <Text>
              Pour calculer le ROI, vous devez obligatoirement créer un calcul nommé "ROI". Vous
              pouvez également ajouter d'autres calculs comme "Revenu Total" ou "Coût Total".
            </Text>
            <Text type="secondary" className="block mt-1">
              Un calcul nommé "ROI" est requis pour soumettre l'activité. Exemple: (Revenu Total -
              Coût Total) / Coût Total
            </Text>
          </div>

          <Divider>Nouveau calcul</Divider>

          <div>
            <label>Nom du calcul*</label>
            <AntInput
              placeholder="ex: ROI, Revenu Total, Coût Total"
              value={newCalculatedItem.name}
              onChange={(e) =>
                setNewCalculatedItem({ ...newCalculatedItem, name: e.target.value })
              }
            />
            <Text type="secondary" className="block mt-1">
              Pour le ROI, incluez le mot "ROI" dans le nom
            </Text>
          </div>

          <div>
            <label>Expression de calcul*</label>
            <div className="p-3 bg-gray-50 rounded min-h-12 mb-2">
              {newCalculatedItem.expression.length > 0 ? (
                renderExpression(newCalculatedItem.expression)
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
                disabled={newCalculatedItem.expression.length === 0}
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

          <div className="mt-4">
            <Button
              type="primary"
              onClick={handleAddCalculatedItem}
              disabled={!newCalculatedItem.name || newCalculatedItem.expression.length < 3}
            >
              Ajouter ce calcul
            </Button>
          </div>

          {calculatedItems.length > 0 && (
            <>
              <Divider>Calculs définis</Divider>
              <div className="max-h-60 overflow-y-auto">
                {calculatedItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-3 rounded mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong>{item.name}</Text>
                        <Text> = </Text>
                        {renderExpression(item.expression)}
                        <Text type="secondary">
                          {" "}
                          = {item.value !== undefined ? item.value.toFixed(2) : "N/A"}
                        </Text>
                      </div>
                      <Button
                        size="small"
                        danger
                        onClick={() => {
                          setCalculatedItems(calculatedItems.filter((ci) => ci.id !== item.id));
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

export default AddActivity;