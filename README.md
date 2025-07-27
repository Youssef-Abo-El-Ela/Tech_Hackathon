# Tech_Hackathon

This project is a backend service that provides APIs for a location tracker mobile application.

## Features

- RESTful APIs for location tracking
- Built with TypeScript
- Prisma ORM for database management
- Deployed on Vercel: [https://tech-hackathon-mu.vercel.app/](https://tech-hackathon-mu.vercel.app/)

## Routes

The API exposes two main sets of routes:

- **Admin Routes:**  
  Endpoints dedicated to admin functionalities, such as managing users, overseeing location data, and performing administrative operations.  
  See: `src/routes/admin.routes.ts`

- **Beneficiary (User) Routes:**  
  Endpoints for regular users (beneficiaries) to interact with location tracking features, including submitting and retrieving location information.  
  See: `src/routes/beneficiary.routes.ts`

Each route group contains its own specific endpoints tailored to their role in the system.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Youssef-Abo-El-Ela/Tech_Hackathon.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

For complete API details, see the Swagger specification file located at:
```
public/swagger.yaml
```
You can use this file with tools like [Swagger UI](https://swagger.io/tools/swagger-ui/) or [Redoc](https://redocly.com/) to explore and test the API endpoints.

## License

Specify your license here (e.g., MIT, Apache-2.0).