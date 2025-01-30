# Luna

Empowering teachers with an interactive web tool for in-browser Python exercises.

Create, manage, and run Python exercises without leaving your browser.

Share it with your students.

[Live Demo](https://luna-frontend-blush.vercel.app/)

## Target Audience

- Computer Science Educators
- Programming Instructors
- Teaching Assistants

## Use Cases

- Create custom Python exercises with test cases
- Track student progress and submissions
- Provide detailed feedback

## Tech Stack

### Frontend

- Next.js
- TypeScript

### Backend

- Django REST Framework
- PostgreSQL

## Architecture

### System Design

![Conceptual Model](./docs/conceptual_model.png)

### Database Schema

![ERD Diagram](./docs/erd_diagram.png)

### Authentication Flow

![Auth Flow](./docs/auth_flow.png)

### Deployment Architecture

Luna uses a modern cloud deployment setup:

- Frontend: Hosted on Vercel for optimal Next.js performance
- Backend: Django REST API deployed on Railway
- Database: PostgreSQL instance managed by Railway

![Deployment](./docs/deployment.png)

## API Documentation

[View API Documentation](https://luna-backend.up.railway.app/api/schema/swagger-ui/#/)
