// import React from "react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import AddClientForm from "./AddClientForm";
// import NotesSection from "./NotesSection";
// import ClientProfile from "./ClientProfile";

// function ClientList({ setPage, setClientId }) {
//   const [clients, setClients] = useState([]);
//   const [selectedClientId, setSelectedClientId] = useState(null);

//   const fetchClients = async () => {
//     const token = localStorage.getItem("token");
//     const res = await axios.get("${process.env.REACT_APP_API_URL}/api/clients/my", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setClients(res.data);
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const styles = {
//     container: {
//       backgroundColor: "#fff",
//       borderRadius: "12px",
//       padding: "1.5rem",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       marginTop: "1.5rem",
//       // maxWidth: "90%",
//       // maxWidth: "800px",
//       margin: "2rem auto",
//     },
//     clientCard: {
//       backgroundColor: "#f9f9f9",
//       padding: "1rem",
//       borderRadius: "10px",
//       marginBottom: "1rem",
//       display: "flex",
//       flexDirection: "column",
//       gap: "0.5rem",
//     },
//     button: {
//       padding: "8px 16px",
//       border: "none",
//       borderRadius: "6px",
//       backgroundColor: "#3498db",
//       color: "#fff",
//       cursor: "pointer",
//       fontWeight: "bold",
//       alignSelf: "start",
//     },
//     listHeader: {
//       fontSize: "1.5rem",
//       marginBottom: "1rem",
//     },
//   };

//   // 📌 if a client is selected, show profile instead
//   if (selectedClientId) {
//     return (
//       <ClientProfile
//         clientId={selectedClientId}
//         onBack={() => setSelectedClientId(null)}
//         refreshClients={fetchClients}
//       />
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <AddClientForm onAdd={fetchClients} />

//       <h3 style={styles.listHeader}>👥 My Clients</h3>
//       <div>
//         {clients.map((client) => (
//           <div key={client.id} style={styles.clientCard}>
//             <div>
//               <strong>{client.name}</strong> — {client.email} — {client.phone}
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedClientId(client.id);
//                 // setPage("client_profile");
//               }}
//               style={styles.button}
//             >
//               View Profile
//             </button>
//           </div>
//         ))}
//       </div>

//       {selectedClientId && <NotesSection clientId={selectedClientId} />}
//     </div>
//   );
// }

// export default ClientList;


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AddClientForm from "./AddClientForm";
import NotesSection from "./NotesSection";
import ClientProfile from "./ClientProfile";
import ClientChat from "./ClientChat";
import { AuthContext } from "../AuthContext";

function ClientList() {
  const { user } = useContext(AuthContext);          // 🔑 get logged‑in user
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [chatClient, setChatClient] = useState(null); // 👈 for chat pane

  const fetchClients = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/clients/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClients(res.data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* ---------- styles ---------- */
  const styles = {
    container: {
      background: "#fff",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      margin: "2rem auto",
    },
    card: {
      background: "#f9f9f9",
      padding: "1rem",
      borderRadius: "10px",
      marginBottom: "1rem",
    },
    btn: {
      padding: "6px 14px",
      border: "none",
      borderRadius: "6px",
      background: "#3498db",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      marginRight: "0.5rem",
    },
  };

  /* ---------- if profile view ---------- */
  if (selectedClientId) {
    return (
      <ClientProfile
        clientId={selectedClientId}
        onBack={() => setSelectedClientId(null)}
        refreshClients={fetchClients}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* add‑client only for admin / lawyer */}
      {(user.role === "admin" || user.role === "lawyer") && (
        <AddClientForm onAdd={fetchClients} />
      )}

      <h3>👥 My Clients</h3>
      {clients.map((c) => (
        <div key={c.id} style={styles.card}>
          <strong>{c.name}</strong> — {c.email} — {c.phone} <br />

          <button style={styles.btn} onClick={() => setSelectedClientId(c.id)}>
            View Profile
          </button>

          {/* Lawyer‑only chat button */}
          {user.role === "lawyer" && (
            <button style={styles.btn} onClick={() => setChatClient(c)}>
              Chat 💬
            </button>
          )}
        </div>
      ))}

      {/* Chat pane (renders once) */}
      {user.role === "lawyer" && chatClient && (
        <ClientChat selectedClient={chatClient} />
      )}

      {/* notes panel if needed */}
      {chatClient && <NotesSection clientId={chatClient.id} />}
    </div>
  );
}

export default ClientList;
