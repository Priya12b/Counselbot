// // // Register.jsx
// // import React, { useState, useContext } from "react";
// // import axios from "axios";
// // import toast from "react-hot-toast";
// // import { AuthContext } from "./AuthContext";
// // // api import isn’t used anywhere → delete it or use it
// // // import api from "./api";

// // function Register({ goToLogin }) {
// //   const { login } = useContext(AuthContext);   // still unused but fine

// //   /* ---------------- state ---------------- */
// //   const [form, setForm] = useState({ name: "", email: "", password: "" });
// //   const [errors, setErrors] = useState({});

// //   /* ---------------- validators ---------------- */
// //   const emailOK = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
// //   const passOK  = (v) => v.length >= 8;

// //   const validate = ({ name, email, password }) => {
// //     const e = {};
// //     if (!name.trim())        e.name     = "Name is required.";
// //     if (!emailOK(email))     e.email    = "Enter a valid email.";
// //     if (!passOK(password))   e.password = "Min 8 characters.";
// //     return e;
// //   };

// //   /* ---------------- handlers ---------------- */
// //   const handleChange = (e) => {
// //     const next = { ...form, [e.target.name]: e.target.value };
// //     setForm(next);
// //     setErrors(validate(next));
// //   };

// //   const handleRegister = async () => {
// //     const currentErrors = validate(form);
// //     if (Object.keys(currentErrors).length) {
// //       setErrors(currentErrors);
// //       toast.error("Please fix the highlighted errors.");
// //       return;
// //     }
// //     try {
// //       await axios.post("/api/auth/register", form);
// //       toast.success("Registered! Redirecting to login…");
// //       setTimeout(
// //         () =>
// //           typeof goToLogin === "function"
// //             ? goToLogin()
// //             : window.location.reload(),
// //         1500
// //       );
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || "❌ Registration failed");
// //     }
// //   };

// //   /* ---------------- styles ---------------- */
// //   const styles = {
// //     container: {
// //       maxWidth: "40%",
// //       margin: "auto",
// //       marginTop: "5rem",
// //       padding: "2rem",
// //       backgroundColor: "#fff",
// //       borderRadius: "12px",
// //       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// //       boxSizing: "border-box",   // 👈 keeps the card from spilling over
// //     },
// //     heading: { textAlign: "center", marginBottom: "1.5rem" },
// //     input: (bad) => ({
// //       width: "100%",
// //       padding: "0.75rem",
// //       marginBottom: "1rem",
// //       borderRadius: "8px",
// //       border: `1px solid ${bad ? "#e74c3c" : "#ccc"}`, // ✅ fixed template string
// //       fontSize: "1rem",
// //       boxSizing: "border-box",
// //     }),
// //     errTxt: { color: "#e74c3c", fontSize: "0.8rem", marginTop: "-0.75rem" },
// //     button: {
// //       width: "100%",
// //       padding: "0.75rem",
// //       backgroundColor: "#10ac84",
// //       color: "#fff",
// //       border: "none",
// //       borderRadius: "8px",
// //       fontWeight: "bold",
// //       cursor: "pointer",
// //     },
// //   };

// //   /* ---------------- UI ---------------- */
// //   return (
// //     <div style={styles.container}>
// //       <h2 style={styles.heading}>📝 Register</h2>

// //       <input
// //         name="name"
// //         placeholder="Full Name"
// //         value={form.name}
// //         onChange={handleChange}
// //         style={styles.input(errors.name)}
// //       />
// //       {errors.name && <div style={styles.errTxt}>{errors.name}</div>}

// //       <input
// //         name="email"
// //         placeholder="Email"
// //         value={form.email}
// //         onChange={handleChange}
// //         style={styles.input(errors.email)}
// //       />
// //       {errors.email && <div style={styles.errTxt}>{errors.email}</div>}

// //       <input
// //         type="password"
// //         name="password"
// //         placeholder="Password (min 8 chars)"
// //         value={form.password}
// //         onChange={handleChange}
// //         style={styles.input(errors.password)}
// //       />
// //       {errors.password && <div style={styles.errTxt}>{errors.password}</div>}

// //       <button style={styles.button} onClick={handleRegister}>
// //         ➕ Register
// //       </button>
// //     </div>
// //   );
// // }

// // export default Register;
// import React, { useState, useContext } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { AuthContext } from "./AuthContext";
// import "./Register.css";          // 👈 import the new styles

// function Register({ goToLogin }) {
//   const { login } = useContext(AuthContext);

//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [errors, setErrors] = useState({});

//   /* ---------------- validators ---------------- */
//   const emailOK = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
//   const passOK  = (v) => v.length >= 8;
//   const validate = ({ name, email, password }) => {
//     const e = {};
//     if (!name.trim())        e.name     = "Name is required.";
//     if (!emailOK(email))     e.email    = "Enter a valid email.";
//     if (!passOK(password))   e.password = "Min 8 characters.";
//     return e;
//   };

//   /* ---------------- handlers ---------------- */
//   const handleChange = (e) => {
//     const next = { ...form, [e.target.name]: e.target.value };
//     setForm(next);
//     setErrors(validate(next));
//   };

//   const handleRegister = async () => {
//     const currentErrors = validate(form);
//     if (Object.keys(currentErrors).length) {
//       setErrors(currentErrors);
//       toast.error("Please fix the highlighted errors.");
//       return;
//     }
//     try {
//       await axios.post("/api/auth/register", form);
//       toast.success("Registered! Redirecting to login…");
//       setTimeout(() => (typeof goToLogin === "function" ? goToLogin() : window.location.reload()), 1500);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "❌ Registration failed");
//     }
//   };

//   /* ---------------- dynamic inline bits ---------------- */
//   const inputStyle = (bad) => ({
//     width: "100%",
//     padding: "0.75rem",
//     marginBottom: "1rem",
//     borderRadius: "8px",
//     border: `1px solid ${bad ? "#e74c3c" : "#ccc"}`,
//     fontSize: "1rem",
//     boxSizing: "border-box",
//   });
//   const errTxt = { color: "#e74c3c", fontSize: "0.8rem", marginTop: "-0.75rem" };

//   return (
//     <div className="register-container">
//       <h2 className="register-heading">📝 Register</h2>

//       <input
//         name="name"
//         placeholder="Full Name"
//         value={form.name}
//         onChange={handleChange}
//         style={inputStyle(errors.name)}
//       />
//       {errors.name && <div style={errTxt}>{errors.name}</div>}

//       <input
//         name="email"
//         placeholder="Email"
//         value={form.email}
//         onChange={handleChange}
//         style={inputStyle(errors.email)}
//       />
//       {errors.email && <div style={errTxt}>{errors.email}</div>}

//       <input
//         type="password"
//         name="password"
//         placeholder="Password (min 8 chars)"
//         value={form.password}
//         onChange={handleChange}
//         style={inputStyle(errors.password)}
//       />
//       {errors.password && <div style={errTxt}>{errors.password}</div>}

//       <button className="register-btn" onClick={handleRegister}>
//         ➕ Register
//       </button>
//     </div>
//   );
// }

// export default Register;
import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import "./Register.css";

function Register({ goToLogin }) {
  // const { login } = useContext(AuthContext); // not used now but keep if you need later

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
    firm_name: "",
  });
  const [errors, setErrors] = useState({});

  /* ---------------- validators ---------------- */
  const emailOK = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
  const passOK = (v) => v.length >= 8;
  const validate = ({ name, email, password, role, firm_name }) => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!emailOK(email)) e.email = "Enter a valid email.";
    if (!passOK(password)) e.password = "Min 8 characters.";
    if (["admin", "lawyer"].includes(role) && !firm_name.trim())
      e.firm_name = "Firm name is required for admin/lawyer.";
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
      toast.error("Please fix the highlighted errors.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("Registered! Redirecting to login…");
      setTimeout(
        () =>
          typeof goToLogin === "function" ? goToLogin() : window.location.reload(),
        1500
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Registration failed");
    }
  };

  /* ---------------- dynamic inline bits ---------------- */
  const inputStyle = (bad) => ({
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: `1px solid ${bad ? "#e74c3c" : "#ccc"}`,
    fontSize: "1rem",
    boxSizing: "border-box",
  });
  const errTxt = {
    color: "#e74c3c",
    fontSize: "0.8rem",
    marginTop: "-0.75rem",
    marginBottom: "0.5rem",
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">📝 Register</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        style={inputStyle(errors.name)}
      />
      {errors.name && <div style={errTxt}>{errors.name}</div>}

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={inputStyle(errors.email)}
      />
      {errors.email && <div style={errTxt}>{errors.email}</div>}

      <input
        type="password"
        name="password"
        placeholder="Password (min 8 chars)"
        value={form.password}
        onChange={handleChange}
        style={inputStyle(errors.password)}
      />
      {errors.password && <div style={errTxt}>{errors.password}</div>}

      <label style={{ fontWeight: "bold" }}>Role:</label>
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        style={inputStyle(errors.role)}
      >
        <option value="client">Client</option>
        <option value="lawyer">Lawyer</option>
        <option value="admin">Admin / Firm Head</option>
      </select>

      <label style={{ fontWeight: "bold" }}>
        Firm Name {form.role === "client" ? "(optional)" : "(required)"}
      </label>
      <input
        name="firm_name"
        placeholder="e.g. Bright Legal LLP"
        value={form.firm_name}
        onChange={handleChange}
        style={inputStyle(errors.firm_name)}
      />
      {errors.firm_name && <div style={errTxt}>{errors.firm_name}</div>}

      <button className="register-btn" onClick={handleRegister}>
        ➕ Register
      </button>
    </div>
  );
}

export default Register;
