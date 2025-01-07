# ChatbotPDF

This is a full-stack application with a React frontend and a FastAPI backend. The application is containerized using Docker and can be run with a single command using `docker-compose up`.

---

![ChatbotPDF Demo](./pdf chatbot .gif)


## Features

- **Frontend**: Built with React and Vite, styled with TailwindCSS.
- **Backend**: Powered by FastAPI, with Python dependencies managed via `requirements.txt`.
- **Dockerized**: Easily run both the frontend and backend using Docker.
- **Networking**: Both services communicate seamlessly within a shared Docker network.

---

## Prerequisites

Make sure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## Environment Setup

1. Create a new file named `.env` in the `/server` directory
2. Add the following environment variables:

```env
# MongoDB Connection String
# Replace <your_mongodb_connection_string> with your actual MongoDB connection URL
# Example: mongodb://username:password@host:port/database
MONGODB_URI=<your_mongodb_connection_string>

# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=<your_gemini_api_key>
```

---

## Access the Application

```
Once the application is running:

Frontend will be available at: http://localhost:3000
Backend API will be available at: http://localhost:5000
```

## Project Structure

```plaintext
chatbotpdf/
├── client/                     # Frontend (React)
│   ├── src/                    # React source files
│   ├── Dockerfile              # Dockerfile for frontend
│   ├── package.json            # Node.js dependencies
│   └── ...                     # Other frontend files
├── server/                     # Backend (FastAPI)
│   ├── routes/                 # API routes
│   ├── utils/                  # Utility functions
│   ├── Dockerfile              # Dockerfile for backend
│   ├── main.py                 # FastAPI entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables (must be created manually)
│   └── ...                     # Other backend files
├── docker-compose.yml          # Docker Compose file to orchestrate services
└── README.md                   # Documentation
```
