// Register.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

function Register({ goToLogin }) {
  const { login } = useContext(AuthContext);      // not used but left in case you auto‑login later

  /* ---------------- state ---------------- */
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  /* ---------------- validators ---------------- */
  const emailOK = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
  const passOK = (v) => v.length >= 8;

  const validate = ({ name, email, password }) => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!emailOK(email)) e.email = "Enter a valid email.";
    if (!passOK(password)) e.password = "Min 8 characters.";
    return e;
  };

  /* ---------------- handlers ---------------- */
  const handleChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    setErrors(validate(next));
  };

  const handleRegister = async () => {
    const currentErrors = validate(form);
    if (Object.keys(currentErrors).length) {
      setErrors(currentErrors);
      toast.error(" Please fix the highlighted errors.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);

      toast.success(" Registered! Redirecting to login…");

      // wait 1.5 s so user sees the toast, then flip to login
      setTimeout(() => {
        if (typeof goToLogin === "function") {
          goToLogin();              // e.g. setPage("login")
        } else {
          // fallback: hard refresh (replace with your own fallback if needed)
          window.location.reload();
        }
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Registration failed");
    }
  };

  /* ---------------- styles ---------------- */
  const styles = {
    container: {
      maxWidth: "40%",
      margin: "auto",
      marginTop: "5rem",
      padding: "2rem",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    heading: { textAlign: "center", marginBottom: "1.5rem" },
    input: (bad) => ({
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1rem",
      borderRadius: "8px",
      border: `1px solid ${bad ? "#e74c3c" : "#ccc"}`,
      fontSize: "1rem",
    }),
    errTxt: { color: "#e74c3c", fontSize: "0.8rem", marginTop: "-0.75rem" },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#10ac84",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  /* ---------------- ui ---------------- */
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Register</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        style={styles.input(errors.name)}
      />
      {errors.name && <div style={styles.errTxt}>{errors.name}</div>}

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={styles.input(errors.email)}
      />
      {errors.email && <div style={styles.errTxt}>{errors.email}</div>}

      <input
        type="password"
        name="password"
        placeholder="Password (min 8 chars)"
        value={form.password}
        onChange={handleChange}
        style={styles.input(errors.password)}
      />
      {errors.password && <div style={styles.errTxt}>{errors.password}</div>}

      <button style={styles.button} onClick={handleRegister}>
        ➕ Register
      </button>
    </div>
  );
}

export default Register;
