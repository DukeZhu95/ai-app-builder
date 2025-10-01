# 🤖 AI App Builder Portal

An intelligent web application that allows users to describe their app ideas in natural language and automatically generates a custom application interface with AI-powered requirement analysis.

![AI App Builder Portal](https://img.shields.io/badge/React-18.x-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-orange)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project is an **Intern Evaluation Task** that demonstrates the ability to:
- Integrate AI APIs for intelligent requirement extraction
- Build dynamic, component-based user interfaces
- Create full-stack applications with modern web technologies
- Design intuitive user experiences

### How It Works

1. **User Input**: Describe your desired application in natural language
2. **AI Analysis**: OpenAI GPT analyzes the description and extracts key requirements
3. **Dynamic Generation**: The system generates a custom UI based on extracted entities, roles, and features
4. **Save & Manage**: Save generated applications and view them later

## ✨ Features

### Core Features
- **Natural Language Processing**: Describe apps in plain English
- **AI-Powered Requirement Extraction**: Automatic analysis of app requirements
- **Dynamic UI Generation**: Creates forms, dashboards, and navigation based on requirements
- **Application Management**: Save, view, and delete generated applications
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Technical Highlights
- Real-time requirement analysis with OpenAI GPT-3.5-turbo
- MongoDB persistence for saved applications
- RESTful API architecture
- Modern React with Hooks
- Beautiful gradient UI with smooth animations

## 🛠 Tech Stack

### Frontend
- **React** 18.x - UI library
- **React Router** - Navigation and routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **CSS3** - Styling with animations and gradients

### Backend
- **Node.js** 18.x - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **OpenAI API** - GPT-3.5-turbo for requirement extraction

### Development Tools
- **nodemon** - Auto-restart server during development
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v7.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Package manager
- **OpenAI API Key** - [Get your API key](https://platform.openai.com/api-keys)
- **Git** - Version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-app-builder.git
cd ai-app-builder
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ..
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-app-builder
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-app-builder

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### How to Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy the key and paste it in your `.env` file

**Important**: Keep your API key secure and never commit it to version control!

### MongoDB Setup

#### Option 1: Local MongoDB (Recommended for Development)

1. Install MongoDB Community Server
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your Atlas connection string

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

**Expected Output:**
```
🚀 AI App Builder Backend Server Started
🔗 http://localhost:5000
✅ MongoDB Connected Successfully
🤖 AI Service Status: ready
```

### Start Frontend Development Server

Open a new terminal window:

```bash
cd src
npm start
```

The frontend will open automatically at `http://localhost:3000`

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
ai-app-builder/
├── backend/
│   ├── models/
│   │   └── App.js              # MongoDB schema for applications
│   ├── routes/
│   │   └── api.js              # API endpoints
│   ├── services/
│   │   └── aiService.js        # OpenAI integration
│   ├── .env                    # Environment variables (create this)
│   ├── .env.example            # Environment template
│   ├── server.js               # Express server entry point
│   └── package.json            # Backend dependencies
│
├── src/
│   ├── components/
│   │   ├── RequirementCapture.js   # Main input form
│   │   ├── GeneratedApp.js         # Dynamic UI generation
│   │   └── SavedApps.js            # Saved apps viewer
│   ├── styles/
│   │   ├── globals.css             # Global styles
│   │   ├── RequirementCapture.css  # Form styles
│   │   └── GeneratedApp.css        # Generated app styles
│   ├── App.js                  # Main React component
│   ├── App.css                 # App-level styles
│   └── index.js                # React entry point
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
└── README.md
```

## 🔌 API Endpoints

### Extract Requirements
```http
POST /api/extract-requirements
Content-Type: application/json

{
  "description": "I want an app to manage student courses..."
}

Response:
{
  "success": true,
  "data": {
    "appName": "Course Manager",
    "entities": ["Student", "Course", "Grade"],
    "roles": ["Teacher", "Student", "Admin"],
    "features": ["Add Course", "Enroll Students", "View Reports"]
  }
}
```

### Save Application
```http
POST /api/apps
Content-Type: application/json

{
  "appName": "Course Manager",
  "description": "App description...",
  "entities": ["Student", "Course"],
  "roles": ["Teacher", "Admin"],
  "features": ["Add Course", "View Reports"]
}
```

### Get All Applications
```http
GET /api/apps?page=1&limit=10

Response:
{
  "success": true,
  "apps": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalApps": 3
  }
}
```

### Delete Application
```http
DELETE /api/apps/:id
```

## 🌐 Deployment

### Deploy Backend (Render)

1. Create account at [Render](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
    - **Name**: ai-app-builder-backend
    - **Environment**: Node
    - **Build Command**: `cd backend && npm install`
    - **Start Command**: `cd backend && npm start`
5. Add environment variables:
    - `OPENAI_API_KEY`
    - `MONGODB_URI`
    - `FRONTEND_URL`

### Deploy Frontend (Vercel)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd src
   vercel
   ```

3. Follow prompts and configure:
    - Add environment variable for backend URL

### Deploy Database (MongoDB Atlas)

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Add to backend environment variables
4. Whitelist deployment server IP

## 🌐 Live Demo

- **Frontend**: https://ai-app-builder-dukes-projects-20e29fcb.vercel.app
- **Backend API**: https://ai-app-builder-backend-365t.onrender.com

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### MongoDB Connection Failed
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify network connectivity for Atlas

#### OpenAI API Error
- Verify API key is correct
- Check API usage limits
- Ensure you have credits in your OpenAI account

#### CORS Error
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend is running on correct port
- Clear browser cache

### Debug Mode

Enable verbose logging:
```bash
# Backend
NODE_ENV=development npm run dev

# Check logs in console for detailed error messages
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created as an intern evaluation task and is available for educational purposes.

## 👨‍💻 Author

Created by Duke Zhu
- GitHub: @DukeZhu95(https://github.com/DukeZhu95)
- Email: zlnirvana4@gmail.com

## 🙏 Acknowledgments

- OpenAI for GPT-3.5-turbo API
- React team for the amazing framework
- MongoDB for the database solution
- All contributors and reviewers

---

**Note**: This project is part of an internship evaluation task demonstrating full-stack development skills, AI integration, and modern web development practices.