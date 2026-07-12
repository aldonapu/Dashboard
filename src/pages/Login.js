import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";

function Login() {
	const navigate = useNavigate();
	const handleSubmit = (e) => {
		e.preventDefault();
		navigate("/");
	};
	return (
		<div className="auth-page login-page">
			<form className="auth-card" onSubmit={handleSubmit}>
				<h2>Login</h2>
				<div className="field">
					<label>Email</label>
					<input type="email" name="email" required />
				</div>
				<div className="field">
					<label>Password</label>
					<input type="password" name="password" required />
				</div>
				<button className="btn" type="submit">Sign In</button>
				<p className="muted">Belum punya akun? <Link to="/register">Register</Link></p>
			</form>
		</div>
	);
}

export default Login;

