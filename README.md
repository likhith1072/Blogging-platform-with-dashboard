
# 📝 Blogging Platform with Dashboard  

A full-stack **MERN blogging platform** with a built-in dashboard for creating and managing posts
This project demonstrates secure backend APIs, a modern frontend, and a scalable architecture for content management.  

🌐 **Live Demo**: [Blogging Platform](https://blogging-platform-with-dashboard.onrender.com/)  
---

## 🚀 Features  

- ✍️ **Create, Read, Update, Delete (CRUD) Blogs**  
- 🔑 **User Authentication** with JWT & bcryptjs
- 📝 **Rich Text Editing** with **Lexical Editor**
- 🌓 **Dark/Light Mode** theme switching
- 📨 **Email Notifications** using Nodemailer  
- 📂 **Dashboard** for managing posts and users  
- 🗂️ **MongoDB Database** with Mongoose models  
- 🔒 **Secure Cookies** for authentication  
- 🎨 **Frontend with React** (components, pages, and Redux for state management)  
- ⚡ **Responsive UI** built for performance  

---

## 📂 Project Structure  
```
MERN-BLOG/
├── api/ # Backend (Express + MongoDB)
│ ├── config/ # DB configuration
│ ├── controllers/ # Controller logic
│ ├── models/ # Mongoose models
│ ├── routes/ # API routes
│ ├── utils/ # Utility functions
│ └── index.js # Server entry point
│
├── client/ # Frontend (React)
│ ├── public/ # Public assets
│ └── src/ # React source code
│ ├── assets/ # Images, icons, etc.
│ ├── components/ # Reusable components
│ ├── pages/ # Page components
│ ├── redux/ # Redux store and slices
│ ├── App.jsx # Main app component
│ ├── firebase.js # Firebase config (if used)
│ ├── index.css # Global styles
│ └── main.jsx # React entry point
│
├── package.json
└── README.md
```


---

## 🛠️ Tech Stack  

- **Frontend**: React, Redux, CSS  
- **Backend**: Node.js, Express  
- **Database**: MongoDB with Mongoose  
- **Authentication**: JWT + bcryptjs  
- **Editor**: Lexical Editor  
- **Email**: Nodemailer  
- **Deployment**: Render  

---

## 📦 Installation  

Clone the repository:  

git clone https://github.com/likhith1072/Blogging-platform-with-dashboard.git
cd Blogging-platform-with-dashboard

🔧 Backend Setup
  npm install

Create a .env file and add:
MONGO=<your-mongodb-connection-uri> ,
JWT_SECRET=<your-secret>,
NODE_ENV='development',
SMTP_USER=Your smtp username
SMTP_PASS=YOur smtp_pass,
SENDER_EMAIL=Your email id from which you send email to user for verifcation of otp

create .env in frontend inside client:
VITE_FIREBASE_API_KEY=Your vite firebase api key which is used for image uploading and getting url of images to display and saved in mongodb and for Google Auth

Start the backend server:
npm run dev

🎨 Frontend Setup
cd client
npm install
npm run dev

🌐 Deployment

This project is deployed on Render.
👉 Live Demo: https://blogging-platform-with-dashboard.onrender.com/




