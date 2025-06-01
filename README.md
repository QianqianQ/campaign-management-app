# Campaign Management Application

> A full-stack web application for managing marketing campaigns.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://campaign-management-app-gilt.vercel.app/)
[![Backend](https://img.shields.io/badge/backend-Django%205.2+-blue)](https://github.com/QianqianQ/campaign-management-app)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%2015.3+-black)](https://github.com/QianqianQ/campaign-management-app)
[![CI/CD](https://github.com/QianqianQ/campaign-management-app/actions/workflows/server-ci.yml/badge.svg)](https://github.com/QianqianQ/campaign-management-app/actions/workflows/server-ci.yml)
[![CI/CD](https://github.com/QianqianQ/campaign-management-app/actions/workflows/client-ci.yml/badge.svg)](https://github.com/QianqianQ/campaign-management-app/actions/workflows/client-ci.yml)

**[🌐 Live Demo](https://campaign-management-app-gilt.vercel.app/)**

*Feel free to create an account with any email for testing purposes.*

##  🚀 Features
- **🔒 User Authentication** - JWT-based user authentication
- **✏️ Campaign Management** - Full CRUD operations capabilities for campaigns
- **📊 Campaign Dashboard** - View campaigns with search and filtering

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 5.2+ with Django REST Framework
- **Language:** Python 3.12+
- **Database:** PostgreSQL 16+ (Production) / SQLite (Development)
- **Authentication:** JWT (JSON Web Tokens)
- **API:** RESTful API with DRF
- **Testing**: pytest + pytest-django

### Frontend
- **Framework**: Next.js 15.3+ (React 19.0+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context
- **Forms**: react-hook-form with Zod validation
- **HTTP Client**: Axios
- **Testing**: Jest + Playwright (E2E)
- **Package Manager**: npm

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud Platform**: Render (Backend + Database) + Vercel (Frontend)

## 🚀 Local Development

### Prerequisites
- Node.js 22+
- Python 3.12+

### Installation
1. **Clone the repository**
    ```bash
    git clone https://github.com/QianqianQ/campaign-management-app.git
    cd campaign-management-app
    ```
2. **Set up the backend**
    ```bash
    cd server
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    pip install -r requirements-dev.txt

    python manage.py migrate
    python manage.py runserver
    ```
3. **Set up the frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```
4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🧪 Testing

### Run Backend Tests
```bash
cd server
pytest  # Run all tests
pytest --cov  # with coverage report
pytest -v  # verbose output
```

### Run Frontend Tests
```bash
cd client
npm run test  # Unit tests with Jest
npm run test:e2e  # E2E tests with Playwright
```

## 📝 API Endpoints

### Authentication
- `POST /api/signup/` - User registration
- `POST /api/signin/` - User authentication
- `GET /api/profile/` - Get user profile

### Campaign Management
- `GET /api/campaigns/` - List all campaigns
- `POST /api/campaigns/` - Create new campaign
- `GET /api/campaigns/{id}/` - Get campaign details
- `PUT /api/campaigns/{id}/` - Update campaign
- `PATCH /api/campaigns/{id}/` - Partial update
- `DELETE /api/campaigns/{id}/` - Delete campaign

## 🚧 Roadmap

### Security Improvements
- [ ] Migrate JWT token storage to httpOnly cookies
- [ ] Implement JWT refresh token strategy

### Performance & Scalability
- [ ] Redis caching implementation
- [ ] CDN setup for static assets
- [ ] Pagination and virtual scrolling for large lists
