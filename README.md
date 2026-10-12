# 🎯 AI Mock Interview Platform

An AI-powered mock interview platform that helps candidates prepare for technical and HR interviews through AI-generated questions, answer evaluation, personalized feedback, and interview history tracking.

🌐 **Live Demo:** https://ai-mock-interview-frontend.netlify.app/

📂 **GitHub Repository:** https://github.com/Tanvi-gupta-cmd/AI-Mock-Interview-Platform

---

## ✨ Features

* 🤖 **AI-Generated Interview Questions** — Generate interview questions based on your selected job role, interview type, and experience level.
* 💻 **Technical & HR Interviews** — Practice technical and HR interview questions.
* 🎓 **Multiple Experience Levels** — Choose Fresher, Intermediate, or Experienced.
* 📝 **Answer Evaluation** — Get AI-powered feedback on your answers.
* 📊 **Performance Analysis** — View scores, strengths, areas for improvement, and sample answers.
* 📈 **Performance Summary** — Track your average score across evaluated answers.
* 💾 **Interview History** — Save completed interviews and review previous results.
* 📱 **Responsive UI** — A clean, modern interface designed for a smooth user experience.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### AI Integration

* Groq API
* `openai/gpt-oss-20b` model

### Database

* SQLite

### Deployment

* Netlify — Frontend
* Render — Backend
* GitHub — Version Control

---

## ⚙️ How It Works

1. Select your job role.
2. Choose Technical or HR interview.
3. Select your experience level.
4. Generate interview questions using AI.
5. Write your answers to the questions.
6. Evaluate your answers to receive scores and personalized feedback.
7. Review your performance summary.
8. Save your interview and access your interview history.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

* Python 3.11+
* Node.js and npm
* Git
* A Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/Tanvi-gupta-cmd/AI-Mock-Interview-Platform.git
cd AI-Mock-Interview-Platform
```

### 2. Set Up the Backend

Open a terminal and run:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows — Git Bash:**

```bash
source venv/Scripts/activate
```

**Windows — Command Prompt:**

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Replace `your_groq_api_key_here` with your own Groq API key.

**Important:** Never commit your `.env` file or expose your API key publicly.

### 4. Run the Backend

From the `backend` directory, run:

```bash
uvicorn main:app --reload
```

The backend will be available at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

### 5. Set Up the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually:

http://localhost:5173

**Note:** Ensure the frontend API requests point to your local backend URL when running locally. The deployed frontend should use the deployed backend URL.

---

## 🔐 Environment Variables

| Variable       | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| `GROQ_API_KEY` | API key used for AI-powered interview question generation and answer evaluation |

Keep all API keys private. Use environment variables rather than hardcoding secrets into source files.

---

## 📁 Project Structure

```text
AI-Mock-Interview-Platform/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

*Note: `.env`, `venv/`, generated database files, and `node_modules/` should remain local and should not be committed to GitHub.*

---

## 🎯 Project Goals

The goal of this project is to make interview preparation more accessible by providing an interactive environment where candidates can practise answering questions, receive AI-generated feedback, and track their progress.

---

## 🔮 Future Improvements

* 🎙️ Voice-based interview practice
* 📄 Resume-based personalized interview questions
* 📊 Detailed performance analytics
* ⏱️ Timed mock interview sessions
* 🔑 User authentication and individual profiles
* 📥 Downloadable interview reports

---

## 👩‍💻 Author

**Tanvi Kumari**

* GitHub: https://github.com/Tanvi-gupta-cmd

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub!

**Built with ❤️ using React, FastAPI, and Groq AI.**
