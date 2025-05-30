# Campaign Management Application

A web application for managing marketing campaigns.

Online Demo: https://campaign-management-app-gilt.vercel.app/

You could create an account with a fake email for testing

##  🚀 Features
- **User Authentication** - JWT authentication
- **Campaign Management** - Campaign CRUD
- **Campaign Dashboard** - View campaigns with search and filtering

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.2+ with Django REST Framework
- **Language**: Python 3.12+
- **Database**: PostgreSQL
- **Authentication**: JWT (stored in local storage)
- **API**: RESTful API with DRF
- **Testing**: pytest + pytest-django
- **Package Manager**: pip

### Frontend
- **Framework**: Next.js 15.3+ (React 19.0+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context (AuthContext)
- **Forms**: react-hook-form with Zod validation
- **HTTP Client**: Axios
- **Testing**: Jest + Playwright (E2E)
- **Package Manager**: npm

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose (ongoing)
- **Database**: sqlite3 for local development, PostgreSQL for dockerization and production
- **CI/CD**: GitHub Actions
- **Cloud Platform**: Render (Backend) + Render (Database) + Vercel (Frontend)

## 🚀 Local Development

### Prerequisites
- Node.js 22+
- Python 3.12+
- PostgreSQL

```bash
# Clone the repository
git clone https://github.com/QianqianQ/campaign-management-app.git
cd campaign-management-app
```

### Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

python manage.py migrate
python manage.py runserver
```

#### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm run test              # Unit tests with Jest
npm run test:e2e         # E2E tests with Playwright
```

### Backend Testing
```bash
cd server
pytest  # Run all tests. --cov for coverage. -v for verbose output
```

## 📝 API Endpoints


- `POST /api/signup/` - User registration
- `POST /api/signin/` - User authentication
- `GET /api/profile/` - Get user profile
- `GET /api/campaigns/` - List campaigns
- `POST /api/campaigns/` - Create campaign
- `GET /api/campaigns/{id}/` - Get campaign details
- `PUT /api/campaigns/{id}/` - Update campaign
- `PATCH /api/campaigns/{id}/` - Partially update campaign
- `DELETE /api/campaigns/{id}/` - Delete campaign


## 🚧 Limitations & Future improvements

- **Docker Setup**: Docker Compose configuration exists while not in use currently
- **Security Considerations**:
  - JWT tokens stored in localStorage. Should migrate to httpOnly cookies
  - Rate limiting not implemented
- **Testing Coverage**:
  - Backend unit tests and integration tests, Frontend unit tests, E2E tests are required to be improved
- **Error Handling**: Edge cases in API error responses need improvement
- **Performance**: No caching strategy implemented yet

### Possible improvements

#### Security
- Implement JWT refresh token strategy
- Improve input validation and sanitization
- Set up proper logging and monitoring
- Implement backup and disaster recovery procedures
- Add API rate limiting
- More...

#### Performance & Scalability
- Implement Redis caching for frequently accessed data if needed
- Imrpove database query performance
- Set up CDN for static assets
- Implement lazy loading for large campaign lists
- Add pagination and virtual scrolling for large lists
- More...
