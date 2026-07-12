import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboardlayout from "./layout/Dashboardlayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primeicons/primeicons.css';
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<Dashboardlayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;