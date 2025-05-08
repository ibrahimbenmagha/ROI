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
import TheHeader from "../Header/Header";
import axiosInstance from "../../axiosConfig";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const CreateActivity = () => {
  const [activityName, setActivityName] = useState("");
  const [year, setYear] = useState(null);
  const [items, setItems] = useState([]);
  const [calculatedItems, setCalculatedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [roiResult, setRoiResult] = useState(null);
  const [isCalculatorModalVisible, setIsCalculatorModalVisible] = useState(false);
  const [newCalculatedItem, setNewCalculatedItem] = useState({
    name: "",
    expression: [],
  });

  const navigate = useNavigate();

  // Ajouter un nouvel item
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

  // Supprimer un item
  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    const updatedCalculatedItems = calculatedItems.filter(
      (calcItem) => !calcItem.expression.some((expr) => expr.type === "item" && expr.value === id)
    );
    setCalculatedItems(updatedCalculatedItems);
  };

  // Modifier un item avec validation
  const handleItemChange = (id, field, value) => {
    if (field === "value") {
      const item = items.find((item) => item.id === id);
      if (item.type === "number" && value !== "" && isNaN(value)) {
        message.error("Veuillez entrer une valeur numérique valide.");
        return;
      }
      if (item.type === "percentage" && value !== "" && (isNaN(value) || value < 0 || value > 100)) {
        message.error("Veuillez entrer un pourcentage valide (0-100).");
        return;
      }
    }
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    setRoiResult(null);
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setActivityName("");
    setYear(null);
    setItems([]);
    setCalculatedItems([]);
    setRoiResult(null);
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    if (!activityName.trim() || !year) return false;
    return (
      items.length > 0 &&
      items.every((item) => item.name.trim() && item.value !== "" && !isNaN(item.value) && item.type)
    );
  };

  // Ouvrir la modale de calcul
  const openCalculatorModal = () => {
    if (!isFormValid()) {
      message.error("Veuillez remplir tous les champs avant de définir des calculs.");
      return;
    }
    setNewCalculatedItem({ name: "", expression: [] });
    setIsCalculatorModalVisible(true);
  };

  // Ajouter un élément à l'expression
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

  // Supprimer le dernier élément de l'expression
  const removeLastExpressionElement = () => {
    if (newCalculatedItem.expression.length === 0) return;
    const newExpression = [...newCalculatedItem.expression];
    newExpression.pop();
    setNewCalculatedItem({ ...newCalculatedItem, expression: newExpression });
  };

  // Ajouter un item calculé
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

    const newItem = {
      id: `calc-${Date.now()}`,
      name,
      expression,
      value: 0,
      isCalculated: true,
    };

    setCalculatedItems([...calculatedItems, newItem]);
    setNewCalculatedItem({ name: "", expression: [] });
    message.success("Calcul ajouté avec succès.");
  };

  // Évaluer une expression
  const evaluateExpression = (expression, valueMap) => {
    let expressionStr = "";
    let hasError = false;

    expression.forEach((elem) => {
      if (elem.type === "item") {
        const itemValue = valueMap[elem.value];
        if (itemValue === undefined) {
          hasError = true;
          return;
        }
        expressionStr += itemValue;
      } else if (elem.type === "constant") {
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
            expressionStr += "+";
        }
      }
    });

    if (hasError) return 0;

    try {
      return new Function("return " + expressionStr)();
    } catch (error) {
      console.error("Erreur d'évaluation d'expression:", error);
      return 0;
    }
  };

  // Effectuer les calculs
  const performCalculations = () => {
    const valueMap = {};
    items.forEach((item) => {
      valueMap[item.id] = parseFloat(item.value);
    });

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

      itemsToProcess.forEach((item) => {
        const calculatedValue = evaluateExpression(item.expression, valueMap);
        valueMap[item.id] = calculatedValue;
        processedItems.push({ ...item, value: calculatedValue });
      });

      remainingItems = remainingItems.filter(
        (item) => !itemsToProcess.some((processedItem) => processedItem.id === item.id)
      );

      if (initialLength === remainingItems.length && remainingItems.length > 0) {
        message.error("Dépendance circulaire détectée dans les calculs.");
        break;
      }
    }

    return processedItems;
  };

  const calculateRoi = () => {
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
      const calculatedMap = {};
      updatedCalculatedItems.forEach((item) => {
        calculatedMap[item.id] = item.value;
      });

      const roiItem = updatedCalculatedItems.find((item) =>
        item.name.toLowerCase().includes("roi")
      );
      const revenueItem = updatedCalculatedItems.find((item) =>
        item.name.toLowerCase().includes("revenu") || item.name.toLowerCase().includes("revenue")
      );
      const costItem = updatedCalculatedItems.find((item) =>
        item.name.toLowerCase().includes("coût") ||
        item.name.toLowerCase().includes("cout") ||
        item.name.toLowerCase().includes("cost")
      );

      setCalculatedItems(updatedCalculatedItems);
      setRoiResult({
        roi: roiItem ? roiItem.value : 0,
        totalRevenue: revenueItem ? revenueItem.value : 0,
        totalCost: costItem ? costItem.value : 0,
      });

      message.success("Calcul terminé avec succès.");
      setIsCalculatorModalVisible(false);
    } catch (error) {
      message.error("Erreur lors du calcul du ROI. Veuillez vérifier vos données.");
      console.error(error);
    } finally {
      setCalculating(false);
    }
  };

  // Obtenir le nom d'un item par son ID
  const getItemNameById = (id) => {
    const regularItem = items.find((item) => item.id === id);
    if (regularItem) return regularItem.name;
    const calcItem = calculatedItems.find((item) => item.id === id);
    if (calcItem) return calcItem.name;
    return "Item inconnu";
  };

  // Obtenir le symbole de l'opération
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

  // Rendre une expression sous forme de tags
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

  // Obtenir tous les items pour la sélection
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

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const hasRoiItem = calculatedItems.some((item) => item.name.toLowerCase().includes("roi"));
      if (!hasRoiItem) {
        message.error("Vous devez définir un calcul nommé 'ROI' avant de soumettre.");
        setSubmitting(false);
        return;
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
          value: item.value,
        })),
      };

      const response = await axiosInstance.post("insertCustomActivity1", payload);
      console.log("Activité créée:", response.data);
      message.success("Activité personnalisée créée avec succès");
      handleReset();
    } catch (error) {
      if (error.response) {
        console.error("Erreur serveur:", error.response.data);
        message.error(error.response.data.message || "Erreur lors de la création");
      } else {
        console.error("Erreur réseau:", error);
        message.error("Erreur de connexion");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <TheHeader />
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
                    style={{ color: roiResult.roi >= 0 ? "#3f8600" : "#cf1322" }}
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
                            = {item.value !== undefined ? item.value : "N/A"}
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
                  <CalculatorOutlined /> Calculer ROI
                </Button>

                <Button
                  style={{ backgroundColor: "#1890ff" }}
                  type="submit"
                  disabled={submitting || !isFormValid() || !roiResult}
                >
                  {submitting ? <Spin size="small" /> : <SaveOutlined />} Enregistrer
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" type="button" onClick={handleReset}>
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Link to="/Activities">
                    <Button variant="secondary">Retour</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </Content>

      {/* Modal pour les calculs et ROI */}
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
                          = {item.value !== undefined ? item.value : "N/A"}
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

export default CreateActivity;