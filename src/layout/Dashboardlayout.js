import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import "./Dashboardlayout.scss";

export default function Dashboardlayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`dashboard-layout ${
        collapsed ? "dashboard-layout--collapsed" : ""
      }`}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <div className="dashboard-layout__content">
        <Navbar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <main className="dashboard-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
