# Campaign Management Application

A tool for managing marketing campaigns

## Features
- Campaign management portal
- Campaign creation form
- Run/Stop campaign
- Campaign searching

## Tech Stack

### Frontend

- **Library**: React
- **Language**: TypeScript
- **Framework**: React Router v7
  - Next.js framework is considered, but may not be required for this project (SSR is necessary)
- **Styling**: Tailwind CSS (+ shadcn/ui library)
- **State** Management: Redux
- **Routing**: React Router
- **API**: Axios
- **Form Handling**: react-hook-form
- **Validation**: zod
- **Build Tool**: Vite
  - For this small app rapid development and build speed is more important, so Vite might be enough
  - For a larger app, Webpack might be a good choice
- **Package Manager**: npm


### Backend

- **Framework**: Django 5.2.1 (Python 3.10+)
  - No async support is required for this project, so FastAPI is not necessary
  - Flask is also a good choice for this project. It is more lightweight and has a smaller footprint
  - Django is a good choice for this project because it is a full-stack framework that includes a built-in ORM, a built-in admin interface, and a built-in authentication system
  - While Django is mentioned in the job ad, and personally I'd like to enhance my skills in Django from scratch, and thus I'd like to use Django for this project
- **Language**: Python 3.12
- **API**: RestAPI (Django Rest Framework)
- **ORM**: Django ORM


### Database

- PostgreSQL
- Caching: Redis


### Deployment

- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Cloud Platform**: Azure
- **Infrastructure as Code**: Terraform


### Security

- **Authentication**: Django Built-in/JWT/OAuth2(Social Login)
- **Security measures**: Rate Limiting, CORS


### Testing

- **Backend**: Unit Testing (pytest/unittest), E2E Testing (Playwright/Selenium)
- **Frontend**: Unit Testing (Jest), Integration Testing, E2E Testing (Cypress)
