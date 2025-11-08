import { useState } from "react";
import axios from "axios";
import "./Login.css";
import API_BASE_URL from "../config"; // ✅ Add this import

function Login({ role, onSwitchToRegister, onLogin }) {
  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint =
        role === "admin"
          ? `${API_BASE_URL}/auth/login/admin`
          : `${API_BASE_URL}/auth/login`;

      const payload =
        role === "admin"
          ? { email: formData.email, password: formData.password }
          : { studentId: formData.studentId, password: formData.password };

      const response = await axios.post(endpoint, payload);
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🚌</div>
          <h1>VignanBusTracker</h1>
          <p>
            {role === "admin"
              ? "Admin access portal"
              : "Track your university bus in real-time"}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{role === "admin" ? "Admin Login" : "Student Login"}</h2>

          {error && <div className="error-message">{error}</div>}

          {role === "student" && (
            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter your student ID"
                required
              />
            </div>
          )}

          {role === "admin" && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {role === "student" && (
            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={onSwitchToRegister}
                >
                  Register here
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
