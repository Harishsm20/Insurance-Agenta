import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Avatar,
  Space,
  Row,
  Col,
  Button,
  Drawer,
  ConfigProvider,
  Grid, 
  theme,
} from "antd"; 
import { adminNav as items } from "../constants/constant";

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const flattenMenuItems = (items) => {
  let flattened = {};

  const flatten = (items) => {
    items.forEach((item) => {
      if (item.path) {
        flattened[item.key] = item.path;
      }
      if (item.children) {
        flatten(item.children);
      }
    });
  };

  flatten(items);
  return flattened;
};

const DashLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint(); 

  const [drawerVisible, setDrawerVisible] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken(); 
  
  const findKeyByPath = (pathname) => {
    const paths = flattenMenuItems(items);
    return (
      Object.keys(paths).find((key) => paths[key] === pathname) || "dashboard"
    );
  };

  const [current, setCurrent] = useState(findKeyByPath(location.pathname));

  const onClick = (e) => {
    setCurrent(e.key);
    const paths = flattenMenuItems(items);
    if (paths[e.key]) {
      navigate(paths[e.key]);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f67009",
          colorInfo: "#f67009",
        },
      }}
    >
      <Layout className="h-screen" style={{ overflow: "hidden" }}>
        {/* Sider for desktop */}
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          width="230"
          trigger={null} 
          className={`shadow-sm ${!screens.lg ? "hidden" : ""}`} 
        >
          <div className="p-4 text-center">
            <span className="text-2xl font-bold tracking-tight text-primary">
              Insurance Agenta
            </span>
          </div>
          <Menu
            theme="light"
            onClick={onClick}
            selectedKeys={[current]}
            defaultOpenKeys={[location.pathname.split("/")[2]]}
            mode="inline"
            items={items}
          />
        </Sider>

        {/* Drawer for mobile */}
        <Drawer
          title="Insurance Agenta"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            theme="light"
            onClick={(e) => {
              onClick(e);
              setDrawerVisible(false); // Close drawer on menu selection
            }}
            selectedKeys={[current]}
            mode="inline"
            items={items}
          />
        </Drawer>

        <Layout>
          {/* Header */}
          <Header
          className="px-4 flex items-center justify-end relative"
          style={{
            background: colorBgContainer,
          }}
        >
          {/* Mobile menu toggle */}
          {screens.xs && (
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              onClick={() => setDrawerVisible(true)}
            />
          )}
        </Header>



          {/* Content */}
          <Content className="mx-4 my-4 mb-0 custom-hide-scrollbar">
            <div
              className="p-4 md:p-8"
              style={{
                minHeight: 360,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DashLayout;
