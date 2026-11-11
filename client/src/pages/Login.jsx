
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-left">
        <div className="brand-logo">
          <span className="logo-icon">C</span>
          <span>Connectly</span>
        </div>

        <div className="brand-content">
          <span className="brand-tag">CUSTOMER MANAGEMENT PLATFORM</span>

          <h1>
            Manage your<br />
            relationships.<br />
            <span>Grow your business.</span>
          </h1>

          <p>
            Everything you need to manage customers,
            organize your business and build stronger
            relationships in one place.
          </p>
        </div>

        <div className="brand-footer">
          © 2026 Connectly CRM. All rights reserved.
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          <div className="mobile-logo">
            <span className="logo-icon">C</span>
            Connectly
          </div>

          <div className="auth-heading">
            <span className="welcome-label">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="auth-switch">
            Don't have an account?
            <Link to="/register">Create account</Link>
          </div>

          <div className="auth-security">
            <span>●</span> Secure customer management platform
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;
