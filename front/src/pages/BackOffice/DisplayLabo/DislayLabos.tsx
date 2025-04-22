    import React, { useState, useEffect } from "react";
    import { Layout, Menu, Card, Button, Row, Col, Typography, Spin, message } from "antd";
    import { LogoutOutlined, PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
    import { useNavigate } from "react-router-dom";
    import axiosInstance from "../../../axiosConfig";

    const { Header, Sider, Content } = Layout;
    const { Title, Text } = Typography;

    interface Labo {
    Name: string;
    FirstName: string;
    LastName: string;
    }

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

    const handleLogout = async () => {
        try {
        message.loading("Déconnexion en cours...", 0);
        await axiosInstance.post("/auth/logout");
        localStorage.removeItem("access_token");
        message.destroy();
        message.success("Déconnecté avec succès");
        navigate("/login");
        } catch (error) {
        message.error(
            `Échec de la déconnexion. Erreur: ${
            error.response?.data?.message || error.message
            }`
        );
        }
    };

    const handleCreateLabo = () => {
        navigate("/Creation");
    };

    return (

        <Content style={{ margin: "24px", background: "#fff", padding: "24px", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
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
            {labos.map((labo, index) => (
                <Col xs={24} sm={12} md={8} lg={8} xl={6} key={index}>
                <Card
                    hoverable
                    title={labo.Name}
                    style={{ height: "200px" }}
                    actions={[
                    <Button type="primary">Voir détails</Button>
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