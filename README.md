# MGMS (Mall Garage Management System)

## Project Name
MGMS (Mall Garage Management System)

## Author
Asmaa Alaghbari

## Start Date
March 28, 2024

## End Date
June 20, 2024

## Project Description
MGMS is a comprehensive management system designed to streamline the operations of mall garages. It provides functionalities for managing parking spots, reservations, payments, user notifications, and settings, aiming to enhance the efficiency and user experience of parking management.

## Features
- User Management: Register, login, and manage user profiles.
- Parking Spot Management: Add, update, delete, and search for parking spots.
- Reservation Management: Create, update, delete, and search for reservations.
- Payment Management: Process and manage payments.
- Notification System: Notify users about their reservations and other important updates.
- Settings Management: Configure user-specific settings such as notifications and display preferences.
- Statistics: View statistics and summaries of parking spots, reservations, and payments.

## Technologies Used
- Frontend: React
- Backend: .NET Core 8
- Database: PostgreSQL
- Authentication: JWT (JSON Web Tokens)

## How to Setup the Project
### Prerequisites
- Node.js (for frontend)
- .NET Core 8 SDK (for backend)
- PostgreSQL (for database)

### Frontend Setup
1. Clone the repository: `git clone https://github.com/Asmaa-Alaghbari/Mall-Garage-Managment-System.git`
2. Navigate to the frontend directory: `cd mgms-frontend`
3. Install dependencies: `npm install`
4. Install React Router DOM: npm install react-router-dom

### Backend Setup
1. Navigate to the backend directory: `cd mgms-backend`
2. Install .NET dependencies: `dotnet restore`
3. Add PostgreSQL Entity Framework Core: dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
4. Add Entity Framework Core Design: dotnet add package Microsoft.EntityFrameworkCore.Design
5. Add JWT Bearer Authentication: dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
6. Add BCrypt for password hashing: dotnet add package BCrypt.Net-Next
7. Set up the PostgreSQL database and update the connection string in appsettings.json

### Database Setup
1. Create a PostgreSQL database.
2. Update the connection string in the backend `appsettings.json`.
3. Create the initial migration: dotnet ef migrations add InitialMigration
4. Update the database: dotnet ef database update

## How to Run the Project
### Running the Frontend
1. Navigate to the frontend directory: `cd mgms-frontend`
2. Start the development server: `npm start`
3. Open your browser and go to `http://localhost:3000`

### Running the Backend
1. Navigate to the backend directory: `cd mgms-backend`
2. Start the backend server: `dotnet run`
3. The backend API will be available at `http://localhost:5000`

## How to Test the Project
### Frontend Tests
1. Navigate to the frontend directory: `cd mgms-frontend`
2. Run tests: `npm test`

### Backend Tests
1. Navigate to the backend directory: `cd mgms-backend`
2. Run tests: `dotnet test`

## Libraries
### Frontend
- React
- Redux
- React Router
- Axios
- Styled Components
- Formik
- Yup
- React-Toastify
- Chart.js

### Backend
- .NET Core 8
- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- Swashbuckle (for Swagger)
- BCrypt.Net-Next

## Additional Information
### JWT Token Management
- Create JWT token: `dotnet user-jwts create`
- Print JWT token: `dotnet user-jwts print`
- Get JWT key: `dotnet user-jwts key`
- Create JWT token with Admin role: `dotnet user-jwts create --role Admin`

### OpenSSL
Generate a base64-encoded 32-byte random string (useful for JWT secret keys):
openssl rand -base64 32

### Swagger
Access Swagger UI for API documentation at:
http://localhost:5296/swagger/index.html

## References
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-8.0)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT](https://jwt.io/)
- [ASP.NET Core ControllerBase](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.controllerbase?view=aspnetcore-8.0)
- [Mall Garage Management System Reference](https://parcari3.ro:8443/parcari)
- [YouTube - Patrick God](https://www.youtube.com/watch?v=UwruwHl3BlU&ab_channel=PatrickGod)
- [YouTube - Patrick God](https://www.youtube.com/watch?v=6sMPvucWNRE&ab_channel=PatrickGod)

Thank you for using MGMS!