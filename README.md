# 🚀 WhatsApp Campaign Manager

A full-stack MERN application that allows admins to manage WhatsApp group campaigns by uploading users in bulk, sending invites, and tracking user engagement.

---

## 📌 Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Protected routes

### 👥 Group Management

* Create groups
* View groups
* Edit & delete groups

### 📂 CSV Upload

* Upload members in bulk via CSV
* Assign members to specific groups

### 📊 Members Dashboard

* View all members
* Filter by status:

  * Pending
  * Invited
  * Joined
  * Opted Out

### 📨 Invite System

* Send invites to all pending members
* Status updates automatically:

  * `pending → invited → joined`

### 📈 Dashboard Analytics

* Total members count
* Invited members
* Joined members
* Real-time updates

---

## 🛠️ Tech Stack

### Frontend:

* React.js
* Tailwind CSS
* React Router
* React Hook Form
* Axios
* React Hot Toast

### Backend:

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Multer (file upload)
* CSV Parser

---

## 📂 Folder Structure

```
client/
 ├── components/
 ├── pages/
 ├── services/
 └── routes/

server/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middlewares/
 └── config/
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/whatsapp-campaign-manager.git
```

---

### 2️⃣ Backend Setup

```
cd server
npm install
```

Create `.env` file:

```
PORT=3000
MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

---

## 📄 CSV Format

```
name,phone
Rahul Sharma,9876543210
Amit Verma,9123456780
```

---

## 🧪 How It Works

1. Admin logs in
2. Creates a group
3. Uploads members via CSV
4. Views members in dashboard
5. Sends invites
6. Tracks status updates

---

## 🔮 Future Improvements

* WhatsApp API integration
* Queue system for bulk invites
* Rate limiting for invites
* Email/SMS integration
* Advanced analytics dashboard

---


## 🧠 Learnings

* Built full-stack MERN application
* Implemented authentication & protected routes
* Handled file uploads and CSV parsing
* Designed scalable backend APIs
* Improved UI/UX with modern dashboard design

---

## 🤝 Contribution

Feel free to fork this project and improve it.

---

## 📬 Contact

If you have any questions or suggestions, feel free to reach out.

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
