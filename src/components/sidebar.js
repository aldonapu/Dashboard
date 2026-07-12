import { NavLink } from "react-router-dom";
import "./sidebar.scss";
import logo from '../Brand.svg'


const menuItems = [
    { path: "/", label: "Dashboard", icon: "pi pi-home" },
    { path: "/products", label: "Products", icon: "pi pi-database" },
    { path: "/orders", label: "Orders", icon: "pi pi-shopping-cart" },
    { path: "/users", label: "Users", icon: "pi pi-users" },
    { path: "/settings", label: "Settings", icon: "pi pi-cog" },
];

export default function Sidebar({ collapsed, onToggle }) {
    return (
        <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
            <div className="sidebar__top">
                <div className="sidebar__brand">
                    <img src={logo} alt="Logo" className="sidebar__brand-image" />
                    {!collapsed && <span className="sidebar__brand-text">DASHBOARD</span>}
                </div>
            </div>

            <nav className="sidebar__nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                        }
                    >
                        <i className={`${item.icon} sidebar__icon`}></i>
                        {!collapsed && <span className="sidebar__label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
