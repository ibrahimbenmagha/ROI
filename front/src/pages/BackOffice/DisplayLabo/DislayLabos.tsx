import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Button,
  Row,
  Col,
  Typography,
  Spin,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Labo {
  Name: string;
  FirstName: string;
  LastName: string;
  id: number; // Assure-toi que chaque labo a un ID unique
}

const storeActivityIdInCookie = (laboId) => {
  document.cookie = `laboId=${laboId}; path=/; max-age=3600;`;
};

const DislayLabos: React.FC = () => {
  const [labos, setLabos] = useState<Labo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLabos();
  }, []);

  const fetchLabos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("GetAllLabosInfos");
      setLabos(response.data.labos);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des laboratoires:", error);
      message.error("Impossible de charger les laboratoires");
      setLoading(false);
    }
  };

  const HandleDetails = (laboId) => {
    storeActivityIdInCookie(laboId);
    navigate("../DisplayCalculatedActivity");
  };

  const handleDeleteLabo = async (laboId) => {
    storeActivityIdInCookie(laboId);
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer les données ?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete("deleteLaboWithData");
      message.success(
        response.data.message || "Les données ont été supprimées avec succès"
      );
      fetchLabos(); // recharge la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      message.error("Erreur lors de la suppression des données");
    }
  };

  const handleCreateLabo = () => {
    navigate("../Creation");
  };

  return (
    <Content
      style={{
        margin: "24px",
        background: "#fff",
        padding: "24px",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Title level={3}>Liste des Laboratoires</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreateLabo}
        >
          Créer Labo
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {labos.map((labo) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={labo.id}>
              <Card
                hoverable
                title={labo.Name}
                style={{ height: "200px" }}
                actions={[
                  <Button
                    type="primary"
                    onClick={() => HandleDetails(labo.id)}
                  >
                    Voir détails
                  </Button>,
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteLabo(labo.id)}
                  >
                    Supprimer
                  </Button>,
                ]}
              >
                <Text strong>Responsable:</Text>
                <p>{`${labo.FirstName} ${labo.LastName}`}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Content>
  );
};

export default DislayLabos;
