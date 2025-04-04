import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { message, Layout, Typography } from "antd";
import { Button } from "@/components/ui/button";
import { HomeOutlined } from "@ant-design/icons";

import axiosInstance from "../../axiosConfig";


const { Header, Content } = Layout;
const { Title } = Typography;

const Head = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Affichage de l'indicateur de chargement
      message.loading("Logging out...", 0); // Indicateur de chargement pendant la requête
  
      // Appel à l'API pour se déconnecter
      await axiosInstance.post("/auth/logout");
  
      // Nettoyer le token dans le localStorage ou cookie après déconnexion
      localStorage.removeItem('access_token'); // Suppression du token dans le localStorage (si utilisé)
      // Si vous utilisez un cookie, vous pouvez aussi le supprimer ici, par exemple :
      // document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  
      // Afficher un message de succès et rediriger l'utilisateur vers la page de connexion
      message.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      // Afficher un message d'erreur si quelque chose va mal
      message.error(`Failed to logout, please try again. Error: ${error.response?.data?.message || error.message}`);
    }
  };
  

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
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="text-white hover:text-white/80 transition-colors"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </Header>
  );
};
export default Head;
