import { Link, useNavigate } from "react-router-dom";
import { Layout, Typography, message, Dropdown, Avatar, Menu } from "antd";
import { Button } from "@/components/ui/button";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import axiosInstance from "../../axiosConfig";

const { Header } = Layout;
const { Title } = Typography;

const Head = () => {
  const navigate = useNavigate();

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

  const profileMenu = (
    <Menu>
      <Menu.Item key="Profile" icon={<UserOutlined/>}>
      Profile
      </Menu.Item>

      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: "#1A1F2C",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("../home")}
        className="text-white hover:text-white/80 transition-colors"
      >
        <HomeOutlined className="h-5 w-5" />
      </Button>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Title level={3} style={{ color: "white", margin: "16px 0" }}>
          Calculateur ROI pour Laboratoire Médical
        </Title>
      </div>

      <Dropdown
        overlay={profileMenu}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Avatar
          icon={<UserOutlined />}
          style={{ cursor: "pointer", backgroundColor: "#1890ff" }}
        />
      </Dropdown>
    </Header>
  );
};

export default Head;
