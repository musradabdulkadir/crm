
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a valid email address");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
          <span className="brand-tag">YOUR BUSINESS. BETTER CONNECTED.</span>

          <h1>
            Build stronger<br />
            connections.<br />
            <span>Achieve more.</span>
          </h1>

          <p>
            Create your account and start managing
            your customer relationships with a
            smarter and simpler CRM platform.
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
            <span className="welcome-label">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Enter your details to get started with Connectly.</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="auth-switch">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>

          <div className="auth-security">
            <span>●</span> Secure customer management platform
          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;
