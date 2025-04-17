🧠 SmartToDo AI – AI-Powered Todo List App

SmartToDo AI is a colorful, interactive, and intelligent todo list app powered by AI 🚀. Users can manage tasks manually or simply describe what they want to do, and AI will break it down into structured todos with priorities and due dates.

✨ Features

🎨 Beautiful sticky note UI with animations and responsive layout

✅ Add, update, delete tasks with ease

🔍 Filter tasks by status (To Do, In Progress, Done)

🧠 AI Task Suggestions using natural language prompts

🗕️ Due date and priority management



📦 Frontend: React, Material UI, React Query, Framer Motion

⚙️ Backend: Node.js, Express, Prisma, PostgreSQL

🔮 AI: Gemini for smart suggestions


🚀 Getting Started

1. Setup frontend
git clone https://github.com/tonykuriakose/smart-todo-frontend
cd ../frontend
npm install
npm run dev

2. Setup backend
git clone https://github.com/tonykuriakose/smart-todo-backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

🔐 Environment Variables

Frontend .env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

Backend .env
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key



💡 Sample Prompt for AI
"Book a movie Avatar on coming Sunday."

📚 License

MIT © 2024 Tony Kuriakose

