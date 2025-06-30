# 🧑‍⚖️ CounselBot – Your Personal Legal Assistant

**CounselBot** is a full-stack AI-powered legal tool that helps lawyers and individuals manage clients, take smart notes, generate legal documents, chat with an AI lawyer, and organize legal files — all in one sleek dashboard.

> 🧠 Powered by Gemini API, CounselBot combines Google-level AI smarts with your client data for real-time legal drafting, smart chatbot advice, and fully automated workflows.

---

## ⚙️ Tech Stack

### 💻 Frontend
- React.js (Custom CSS — No Tailwind)
- Axios for API calls
- jsPDF for document downloads
- File Upload + Previews

### 🖥️ Backend
- Node.js + Express
- MySQL (Structured DB with Foreign Keys)
- Gemini API (for legal text generation)
- JWT Authentication
- Multer (File handling)
- Bcrypt (Password security)

---

## 🌟 Features

✅ **Authentication**
- Register / Login (JWT-based)
- Auth-protected routes
- User-specific data isolation

👥 **Client Management**
- Add / Edit / Delete clients
- Linked with logged-in user

📝 **Notes System**
- Add/edit/delete notes for each client
- Timestamp display
- Used in document generation

📄 **Document Generator**
- Create legal documents using:
  - Client details
  - Saved notes
  - Optional user input
- Documents saved to DB
- PDF download support
- Delete functionality
- Auto-format currency and dates
- 🆕 Upload Your Own Template! Users can upload any legal document template (DOCX or TXT), and CounselBot will automatically fill it using client info, notes, and AI suggestions.

💬 **AI Legal Chatbot**
- Uses Gemini API for smarter replies
- Can access client data, notes, documents
- Saves past chats
- Regenerate reply 🔁
- Chat-to-Document feature 📝
- Voice input 🎙️
- Multilingual Input (Hindi, Gujarati, English)

📂 **File Management**
- Upload files per client or personal
- View/download/delete files
- Linked to users and optionally clients

🗃️ **Saved Docs View**
- View all generated docs per client
- Delete, preview, and download options

📌 **Chat History**
- Save multiple chats with titles
- Edit, delete, pin chats

---

## 🧠 AI Capabilities

- ✍️ Smart document generation (agreements, notices, custom legal docs)
- 📄 Auto-fill uploaded templates with user/client data
- 🧾 Understands legal structure and intent
- 🔁 Memory across chat session
- 🧑‍💼 Used by lawyers for fast, error-free drafting

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Priyab12/counselbot.git
cd counselbot
```
---

### 2. Install dependencies

#### Backend
```bash
cd server
npm install
```
#### FRontend
```bash
cd ../client
npm install
```
---

### 3. Set up Environment Variables
- Create a .env file in /server with the following:
```bash
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=legal_tool
```
---

### 4. Run the app
```bash
# Start backend
cd server
npm start

# Start frontend (in a separate terminal)
cd client
npm start
```
---
### Author
Priyanka
Engineering Student @ IIIT Vadodara
Building tools that make real-world impact 💼⚖️

