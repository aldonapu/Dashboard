import "./navbar.scss";

export default function Navbar({ collapsed, onToggle }) {
    return (
        <header className="navbar">
            <button className="navbar__toggle" onClick={onToggle}>
                {collapsed ? <i className="pi pi-list"></i> : <i className="pi pi-sliders-h"></i>}
            </button>

          

            <div className="navbar__profile">
                <div className="navbar__avatar">AD</div>
                <div>
                    <p className="navbar__name">Admin</p>
                    <p className="navbar__role">Super user</p>
                </div>
            </div>
        </header>
    );
}
