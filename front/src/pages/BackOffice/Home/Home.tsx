import React, { useState } from "react";
import axiosInstance from "../../../axiosConfig";
import "./AdminHomePage.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MyLogo from "../../../photos/logo.png";
import { message } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, theme } from "antd";
const { Header, Sider, Content } = Layout;

export default function BackOffice() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  return (
    <Layout className="HomePageAdmin1">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="LayoutMenu"
      >
        <div className="demo-logo-vertical">
          <Link to="#" className="demo-logo-vertical">
            <img src={MyLogo} alt="ÉDUSPHERE" id="logoLarg" />
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ flex: 1 }}
        >
          <Menu.Item key="1" icon={<CheckOutlined />}>
            <Link to="DislayLabos" >
              Listes des laboratoires
            </Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
            <Link to="./AddActivity">
              Ajouter activite
            </Link>
          </Menu.Item>
        </Menu>

        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Menu theme="dark" mode="inline" selectable={false}>
            <Menu.Item
              key="logout"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Déconnexion
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
        </Header>
        <Content className="ContentHomePageAdmin">
          <div className="RegisterFormComponent">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
