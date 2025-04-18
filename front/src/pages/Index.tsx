import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Layout,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  message,
  Modal,
  Input
} from "antd";
import {
  DownloadOutlined,
  UploadOutlined,
  ReloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

import Head from "./Header/Header";
import axiosInstance from "../axiosConfig";
import {deleteCookie } from "../axiosConfig";


const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const FeatureCard = ({ title, description, icon, link }) => {
  return (
    <Card
      hoverable
      style={{ width: "100%" }}
      extra={<span style={{ fontSize: 24 }}>{icon}</span>}
      title={title}
    >
      <Paragraph type="secondary">{description}</Paragraph>
      <Link to={link}>
        <Button type="primary" style={{ width: "100%" }}>
          Accéder
        </Button>
      </Link>
    </Card>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  deleteCookie("activityId");
  deleteCookie("activityNumber");
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      navigate("/Login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const showDeleteModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setPassword("");
  };

  const deleteByLabo = async () => {
    if (!password) {
      message.error("Veuillez entrer votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/verify-password", { password });
      if (response.data.success) {
        await axiosInstance.delete("deleteLaboData");
        message.success("Les données ont été supprimées avec succès.");
        setVisible(false);
        setPassword("");
      } else {
        message.error("Mot de passe incorrect.");
      }
    } catch (error) {
      message.error("Erreur lors de la suppression: " + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  return (
    <Layout className="min-h-screen">
      <Head />
      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
                Saisies
              </Title>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <FeatureCard title="Informations de Base" description="Configuration initiale pour la planification" icon="📋" link="/CreateActivity" />
                <FeatureCard title="Liste des activités a calculer" description="Les activités non calculés" icon="👤" link="/DisplayActivity" />
                <FeatureCard title="Évaluation Plan Tactique" description="Mesurer l'efficacité des stratégies marketing" icon="📊" link="/tactical-plan" />
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
                Résultats
              </Title>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <FeatureCard title="Liste des activités calculées" description="Liste des activités deja calculées" icon="💰" link="/DisplayCalculatedActivity" />
                <FeatureCard title="Analyse Seuil de Rentabilité" description="Analyser les seuils de rentabilité pour les investissements" icon="📈" link="/threshold-analysis" />
                <FeatureCard title="Résumé Année de Planification" description="Résumé des activités de l'année planifiée" icon="📅" link="/year-summary" />
                <FeatureCard title="Optimisation Mix Marketing" description="Optimisez votre mix marketing pour de meilleurs résultats" icon="🎯" link="/marketing-mix" />
                <FeatureCard title="Comparaison Stratégies Marketing" description="Comparez différentes approches marketing" icon="⚖️" link="/strategies-comparison" />
              </Space>
            </Col>
          </Row>
          <Divider style={{ margin: "40px 0 24px" }} />
          <Row justify="space-between" gutter={[16, 16]}>
            <Col>
            </Col>
            <Col>
              <Space size={8}>
                <Button icon={<DownloadOutlined />}>Exporter</Button>
                <Button icon={<UploadOutlined />}>Importer</Button>
                <Button icon={<ReloadOutlined />} onClick={showDeleteModal}>Réinitialiser</Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: "center", background: "#f0f0f0" }}>
        <Text type="secondary">
          © 2025 Calculateur ROI pour Laboratoire Médical. Tous droits réservés.
        </Text>
      </Footer>
      <Modal
        title="Confirmation de suppression"
        visible={visible}
        onOk={deleteByLabo}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <p>Veuillez entrer votre mot de passe pour confirmer la suppression :</p>
        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
      </Modal>
    </Layout>
  );
};

export default Index;
