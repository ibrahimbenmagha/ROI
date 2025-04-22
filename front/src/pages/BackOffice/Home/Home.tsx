

import React, { useState } from 'react';
import './AdminHomePage.css';
import { Link, Outlet } from "react-router-dom";
import MyLogo from "../../../photos/logo2.png";


import { MenuFoldOutlined, MenuUnfoldOutlined, LoadingOutlined, AppstoreAddOutlined, CheckOutlined, LogoutOutlined } from '@ant-design/icons';

import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;


export default function BackOffice() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
      <Layout className='HomePageAdmin1'>
        <Sider trigger={null} collapsible collapsed={collapsed} className='LayoutMenu'>
          <div className="demo-logo-vertical">
            <Link to="#" className="demo-logo-vertical"><img src={MyLogo} alt="ÉDUSPHERE" id='logoLarg' /></Link>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1" icon={<CheckOutlined />} >
              <Link to="DislayLabos" className="ConfirmedSchools">Listes des laboratoires</Link>
            </Menu.Item>

          </Menu>

        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content className='ContentHomePageAdmin'>
            <div className='RegisterFormComponent'>
              <Outlet />
            </div>

          </Content>
        </Layout>
      </Layout>
   
  );
};