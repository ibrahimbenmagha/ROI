import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Utiliser useNavigate pour redirection
import {
  Card,
  Button,
  Layout,
  Typography,
  Row,
  Col,
  Space,
  Divider,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  ReloadOutlined,
  PrinterOutlined,
  LogoutOutlined, // Importer l'icône de déconnexion
} from "@ant-design/icons";

import Head from "./Header/Header";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

// Feature card component
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

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      navigate("/Login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Head/>

      <Content style={{ padding: "32px 24px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            {/* Entries Block */}
            <Col xs={24} md={12}>
              <Title
                level={4}
                style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}
              >
                Saisies
              </Title>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <FeatureCard
                  title="Informations de Base"
                  description="Configuration initiale pour la planification"
                  icon="📋"
                  link="/CreateActivity"
                />

                <FeatureCard
                  title="Listes des activites a calculer"
                  description="Les activites non calcules"
                  icon="👤"
                  link="/DisplayActivity"
                />

                <FeatureCard
                  title="Évaluation Plan Tactique"
                  description="Mesurer l'efficacité des stratégies marketing"
                  icon="📊"
                  link="/tactical-plan"
                />
              </Space>
            </Col>

            {/* Outputs Block */}
            <Col xs={24} md={12}>
              <Title
                level={4}
                style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}
              >
                Résultats
              </Title>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <FeatureCard
                  title="Analyse Seuil de Rentabilité"
                  description="Analyser les seuils de rentabilité pour les investissements"
                  icon="📈"
                  link="/threshold-analysis"
                />

                <FeatureCard
                  title="Aperçu ROI"
                  description="Vue complète du retour sur investissement"
                  icon="💰"
                  link="/roi-overview"
                />

                <FeatureCard
                  title="Résumé Année de Planification"
                  description="Résumé des activités de l'année planifiée"
                  icon="📅"
                  link="/year-summary"
                />

                <FeatureCard
                  title="Optimisation Mix Marketing"
                  description="Optimisez votre mix marketing pour de meilleurs résultats"
                  icon="🎯"
                  link="/marketing-mix"
                />

                <FeatureCard
                  title="Comparaison Stratégies Marketing"
                  description="Comparez différentes approches marketing"
                  icon="⚖️"
                  link="/strategies-comparison"
                />
              </Space>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Divider style={{ margin: "40px 0 24px" }} />
          <Row justify="space-between" gutter={[16, 16]}>
            <Col>
              <Space size={8}>
                <Button icon={<LeftOutlined />}>Précédent</Button>
                <Button icon={<RightOutlined />}>Suivant</Button>
                <Button icon={<QuestionCircleOutlined />}>Aide</Button>
              </Space>
            </Col>

            <Col>
              <Space size={8}>
                <Button icon={<DownloadOutlined />}>Exporter</Button>
                <Button icon={<UploadOutlined />}>Importer</Button>
                <Button icon={<ReloadOutlined />}>Réinitialiser</Button>
                <Button icon={<PrinterOutlined />}>Imprimer</Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center", background: "#f0f0f0" }}>
        <Text type="secondary">
          © 2023 Calculateur ROI pour Laboratoire Médical. Tous droits réservés.
        </Text>
      </Footer>
    </Layout>
  );
};

export default Index;
