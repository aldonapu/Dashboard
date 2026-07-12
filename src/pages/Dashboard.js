import { Card } from "primereact/card";
import "./Dashboard.scss";
import gambar from "../Gambar.svg";

export default function Dashboard() {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="page__eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="card">
        <div className="card_content">
          <h1 className="card_title">Welcome Back, Admin!</h1>
          <p className="card_description">
            Here is a quick overview of your dashboard. You can manage products, orders, and users from the sidebar menu. Use the settings to customize your experience.
          </p>
        </div>
        <div className="card_image_wrapper">
          <img
            src={gambar}
            alt="Dashboard Illustration"
            className="card_image"
          />
        </div>
      </div>

      <div className="dashboard-grid">
        <Card title="Products" className="content-card">
          <div className="metric">120 items</div>
        </Card>

        <Card title="Orders" className="content-card">
          <div className="metric">80 pending</div>
        </Card>

        <Card title="Users" className="content-card">
          <div className="metric">20 active</div>
        </Card>
      </div>
      
    </div>
  );
}
