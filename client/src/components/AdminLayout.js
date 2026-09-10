import React, { useState } from "react";
import {
  Button,
  Drawer,
  Dropdown,
} from "antd";
import {
  BankOutlined,
  CarOutlined,
  DashboardOutlined,
  FileProtectOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import ProfileAvatar from "./ProfileAvatar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    if (path === "/addcar") {
      return (
        location.pathname === "/addcar" ||
        location.pathname.startsWith("/editcar/")
      );
    }

    return location.pathname.startsWith(path);
  };

  const navigationItems = [
    {
      path: "/admin",
      label: "Manage Cars",
      icon: <DashboardOutlined />,
    },
    {
      path: "/addcar",
      label: "Add New Car",
      icon: <PlusCircleOutlined />,
    },
    {
      path: "/admin/car-requests",
      label: "Owner Requests",
      icon: <FileProtectOutlined />,
    },
    {
      path: "/admin/revenue",
      label: "Revenue & Payouts",
      icon: <BankOutlined />,
    },
  ];

  const accountMenu = [
    {
      key: "website",
      icon: <HomeOutlined />,
      label: (
        <Link to="/">
          Back to Website
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Logout",
      onClick: logout,
    },
  ];

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const SidebarContent = ({
    mobile = false,
  }) => (
    <div className="admin-sidebar-content">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          <CarOutlined />
        </div>

        {(!collapsed || mobile) && (
          <div className="admin-sidebar-brand-text">
            <h2>DriveEase</h2>
            <span>Admin Portal</span>
          </div>
        )}
      </div>

      <div className="admin-sidebar-profile">
        <ProfileAvatar
          size={
            collapsed && !mobile ? 48 : 72
          }
          editable={true}
        />

        {(!collapsed || mobile) && (
          <div className="admin-sidebar-profile-info">
            <strong>
              {user?.username ||
                "Administrator"}
            </strong>

            <span>Fleet Manager</span>
          </div>
        )}
      </div>

      <div className="admin-sidebar-section-label">
        {(!collapsed || mobile) &&
          "MANAGEMENT"}
      </div>

      <nav className="admin-sidebar-nav">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={
              collapsed && !mobile
                ? item.label
                : ""
            }
            onClick={closeMobileMenu}
            className={
              isActive(item.path)
                ? "admin-sidebar-link active"
                : "admin-sidebar-link"
            }
          >
            {item.icon}

            {(!collapsed || mobile) && (
              <span>{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="admin-sidebar-link"
          title={
            collapsed && !mobile
              ? "Back to Website"
              : ""
          }
        >
          <HomeOutlined />

          {(!collapsed || mobile) && (
            <span>Back to Website</span>
          )}
        </Link>

        <button
          type="button"
          onClick={logout}
          className="admin-sidebar-link admin-sidebar-logout"
          title={
            collapsed && !mobile
              ? "Logout"
              : ""
          }
        >
          <LogoutOutlined />

          {(!collapsed || mobile) && (
            <span>Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={
        collapsed
          ? "admin-application-layout sidebar-collapsed"
          : "admin-application-layout"
      }
    >
      <aside
        className={
          collapsed
            ? "admin-sidebar collapsed"
            : "admin-sidebar"
        }
      >
        <SidebarContent />
      </aside>

      <Drawer
        placement="left"
        width={290}
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
        className="admin-mobile-drawer"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <SidebarContent mobile />
      </Drawer>

      <div className="admin-main-area">
        <header className="admin-top-header">
          <div className="admin-top-header-left">
            <Button
              className="admin-mobile-sidebar-button"
              icon={<MenuOutlined />}
              onClick={() =>
                setMobileOpen(true)
              }
            />

            <Button
              className="admin-collapse-button"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() =>
                setCollapsed(
                  (previous) => !previous
                )
              }
            />

            <div className="admin-header-title">
              <h3>DriveEase Administration</h3>

              <span>
                Manage fleet, requests and
                platform revenue
              </span>
            </div>
          </div>

          <Dropdown
            menu={{ items: accountMenu }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button
              type="button"
              className="admin-header-profile"
            >
              <ProfileAvatar
                size={43}
                editable={false}
              />

              <div>
                <strong>
                  {user?.username || "Admin"}
                </strong>

                <span>Administrator</span>
              </div>
            </button>
          </Dropdown>
        </header>

        <main className="admin-page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;