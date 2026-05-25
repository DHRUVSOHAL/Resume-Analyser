# Resume Analyser AI

An AI-powered Resume Analyser and Interview Preparation platform built using the MERN stack.

Users can upload resumes, provide job descriptions and self descriptions, and receive AI-generated interview reports, skill analysis, interview questions, and preparation plans.

---

## Features

- User Authentication (JWT + Cookies)
- Resume PDF Upload
- AI-based Resume Analysis
- Technical Interview Questions
- Behavioral Interview Questions
- Skill Gap Detection
- Personalized Preparation Plan
- Resume PDF Generation
- Protected Routes
- Responsive UI

---

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- SCSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- pdf-parse

### AI Integration
- Gemini API / OpenAI API

---

## Folder Structure

```bash
Resume-Analyser/
│
├── frontend/
│   ├── src/
│   └── ...
│
├── backend/
│   ├── src/
│   └── ...
│
└── README.md
```

---

## Environment Variables

### Backend `.env`

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_api_key
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/DHRUVSOHAL/Resume-Analyser.git
cd Resume-Analyser
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## API Routes

### Auth Routes

| Method | Route | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/auth/get-me` | Get current user |

---

### Interview Routes

| Method | Route | Description |
|--------|------|-------------|
| POST | `/api/interview/` | Generate interview report |
| GET | `/api/interview/` | Get all reports |
| GET | `/api/interview/report/:id` | Get single report |
| POST | `/api/interview/resume/pdf/:id` | Generate resume PDF |

---

## Deployment

- Frontend: Render
- Backend: Render
- Database: MongoDB Atlas

---

## Future Improvements

- ATS Score Analysis
- AI Mock Interviews
- Voice-based Interview Assistant
- Dashboard Analytics
- Dark Mode

---

## Author

### Dhruv Sohal

- GitHub: https://github.com/DHRUVSOHAL
- LinkedIn: https://linkedin.com/in/dhruv-sohal-474519372

---