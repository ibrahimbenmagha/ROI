
import React, { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  message,
  DatePicker,
  Form,
  Input as AntInput,
  Modal
} from "antd";
import {
  CheckCircleOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../axiosConfig";
import TheHeader from "../Header/Header";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const CustomActivityPage: React.FC = () => {
  // Form state
  const [activityName, setActivityName] = useState<string>("");
  const [roi, setRoi] = useState<string>("");
  const [year, setYear] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Check if all fields are filled
  const allFieldsFilled = (): boolean => {
    return (
      activityName.trim() !== "" &&
      roi.trim() !== "" &&
      year !== null
    );
  };

  const handleReset = (): void => {
    setActivityName("");
    setRoi("");
    setYear(null);
    form.resetFields();
  };

  const showConfirm = () => {
    confirm({
      title: 'Êtes-vous sûr de vouloir soumettre cette activité personnalisée?',
      icon: <ExclamationCircleOutlined />,
      content: 'Cette action va créer une nouvelle activité personnalisée dans la base de données',
      onOk() {
        handleSubmit();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const formData = {
        activityName: activityName,
        year: year,
        roi: parseFloat(roi)
      };

      const response = await axiosInstance.post("insertCustomActivity", formData);
      
      if (response.status === 201 || response.status === 200) {
        message.success("L'activité personnalisée a été créée avec succès.");
        navigate("/DisplayActivity");
      } else {
        message.error("Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      message.error(
        "Une erreur est survenue lors de la communication avec le serveur."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <TheHeader />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Form form={form} layout="vertical" onFinish={showConfirm}>
            <Card>
              <Title level={4} style={{ textAlign: "center" }}>
                Créer une activité personnalisée
              </Title>
              <Divider />
              
              <div className="grid grid-cols-1 gap-6">
                <Form.Item
                  name="activityName"
                  label="Nom de l'activité"
                  rules={[{ required: true, message: 'Veuillez entrer le nom de l\'activité' }]}
                >
                  <AntInput 
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="Entrez le nom de l'activité"
                  />
                </Form.Item>

                <Form.Item
                  name="roi"
                  label="ROI"
                  rules={[{ required: true, message: 'Veuillez entrer le ROI' }]}
                >
                  <AntInput 
                    value={roi}
                    onChange={(e) => setRoi(e.target.value)}
                    placeholder="Entrez le ROI (ex: 0.25 pour 25%)"
                    type="number"
                    step="0.01"
                  />
                </Form.Item>

                <Form.Item 
                  name="year" 
                  label="Année"
                  rules={[{ required: true, message: 'Veuillez sélectionner une année' }]}
                >
                  <DatePicker
                    picker="year"
                    onChange={(date, dateString) => setYear(dateString)}
                    value={year ? dayjs(year, "YYYY") : null}
                    style={{ width: "100%" }}
                    placeholder="Sélectionnez l'année"
                  />
                </Form.Item>
              </div>

              <Divider />

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  type="submit"
                  style={{ backgroundColor: "#1890ff" }}
                  disabled={!allFieldsFilled() || loading}
                >
                  <CheckCircleOutlined /> {loading ? "Création en cours..." : "Créer l'activité"}
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} type="button">
                    <ReloadOutlined /> Réinitialiser
                  </Button>
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={() => navigate("/DisplayActivity")}
                  >
                    Retour
                  </Button>
                </div>
              </div>
            </Card>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};
export default CustomActivityPage;
