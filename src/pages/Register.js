import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";

function Register() {
	const navigate = useNavigate();
	const handleSubmit = (e) => {
		e.preventDefault();
		navigate("/login");
	};
	return (
		<div className="auth-page register-page">
			<form className="auth-card" onSubmit={handleSubmit}>
				<h2>Register</h2>
				<div className="field">
					<label>Full Name</label>
					<input name="name" required />
				</div>
				<div className="field">
					<label>Email</label>
					<input type="email" name="email" required />
				</div>
				<div className="field">
					<label>Password</label>
					<input type="password" name="password" required />
				</div>
				<button className="btn" type="submit">Create Account</button>
				<p className="muted">Sudah punya akun? <Link to="/login">Login</Link></p>
			</form>
		</div>
	);
}

export default Register;

