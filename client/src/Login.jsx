// import React, { useState, useContext } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { AuthContext } from "./AuthContext";

// function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//     if (!form.email || !form.password) {
//       toast.error("Email and password are required!");
//       return;
//     }

//     try {
//       const res = await axios.post("${process.env.REACT_APP_API_URL}/api/auth/login", form);
//       login(res.data.user, res.data.token);
//       toast.success(" Logged in successfully!");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "❌ Login failed");
//     }
//   };

//   const styles = {
//     container: {
//       maxWidth: "40%",
//       margin: "auto",
//       marginTop: "5rem",
//       padding: "2rem",
//       backgroundColor: "#fff",
//       borderRadius: "12px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//     },
//     heading: {
//       textAlign: "center",
//       marginBottom: "1.5rem",
//     },
//     input: {
//       width: "100%",
//       padding: "0.75rem",
//       marginBottom: "1rem",
//       borderRadius: "8px",
//       border: "1px solid #ccc",
//       fontSize: "1rem",
//     },
//     button: {
//       width: "100%",
//       padding: "0.75rem",
//       backgroundColor: "#2e86de",
//       color: "#fff",
//       border: "none",
//       borderRadius: "8px",
//       fontWeight: "bold",
//       cursor: "pointer",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>🔐 Login to Continue</h2>
//       <input
//         name="email"
//         type="email"
//         placeholder="Email"
//         onChange={handleChange}
//         value={form.email}
//         style={styles.input}
//       />
//       <input
//         name="password"
//         type="password"
//         placeholder="Password"
//         onChange={handleChange}
//         value={form.password}
//         style={styles.input}
//       />
//       <button onClick={handleLogin} style={styles.button}>
//         🔓 Login
//       </button>
//     </div>
//   );
// }

// export default Login;
import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import "./Login.css";                   // 👈 new styles

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Email and password are required!");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        form
      );
            console.log("ROLE:", user?.role);
console.log("FIRM ID:", user?.firm_id);
      login(res.data.user, res.data.token);
      toast.success("Logged in successfully!");

    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Login failed");
    }
  };

  /*  Inline style only for the inputs (keeps highlight logic simple) */
  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box",
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">🔐 Login to Continue</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        style={inputStyle}
      />

      <button className="login-btn" onClick={handleLogin}>
        🔓 Login
      </button>
    </div>
  );
}

export default Login;
