import React, { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  message,
  Spin,
  Input as AntInput,
  Select,
  Button as AntButton,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const CreateStandardActivity = () => {
  const [activityName, setActivityName] = useState("");
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Add a new item
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        name: "",
        type: "number",
        symbole: "", // Optional symbol
      },
    ]);
  };

  // Remove an item
  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Update item fields
  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Reset form
  const handleReset = () => {
    setActivityName("");
    setItems([]);
  };

  // Validate form
  const isFormValid = () => {
    if (!activityName.trim()) return false;
    return (
      items.length > 0 &&
      items.every((item) => item.name.trim() && item.type)
    );
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      message.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: activityName,
        items: items.map((item) => ({
          name: item.name,
          type: item.type,
          symbole: item.symbole || null, // Send null if symbole is empty
        })),
      };

      console.log("Payload envoyé au backend:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.post("/insertStandardActivity", payload);
      message.success("Activité standard créée avec succès");
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
          <form onSubmit={handleSubmit}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Créer une activité standard
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

              <Divider>Items de l'activité</Divider>

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
                    <Select
                      style={{ width: "100%" }}
                      value={item.type}
                      onChange={(value) => handleItemChange(item.id, "type", value)}
                    >
                      <Option value="number">Nombre</Option>
                      <Option value="percentage">Pourcentage</Option>
                      <Option value="calculated">Calculé</Option>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <AntInput
                      placeholder="Symbole (optionnel)"
                      value={item.symbole}
                      onChange={(e) => handleItemChange(item.id, "symbole", e.target.value)}
                    />
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

              <Divider />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  style={{ backgroundColor: "#1890ff" }}
                  type="submit"
                  disabled={submitting || !isFormValid()}
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
    </Layout>
  );
};

export default CreateStandardActivity;