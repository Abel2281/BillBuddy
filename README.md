BillBuddy
BillBuddy is a full-stack web application designed to simplify bill splitting among friends or groups. Users can register, log in, add bills, track who paid and who owes what, and mark bills as paid. The application features dynamic user management and accurate debt calculations, making it easy to manage shared expenses.
Table of Contents

Features
Tech Stack  
Prerequisites
Installation
Clone the Repository
Set Up the Backend
Set Up the Frontend


Usage
API Endpoints
Testing
Stopping the Servers
Database Management
Contributing
License
Acknowledgments
Contact

Features

User Authentication: Secure registration and login with JWT-based authentication.
Bill Management: Add bills, specify payers, and split costs among participants.
Dynamic Users: Dynamically fetch and manage users from the backend.
Debt Calculation: Real-time calculation of amounts owed or owed to you.
Responsive UI: Built with React and styled with Tailwind CSS, featuring animations via Framer Motion.
RESTful API: Robust backend powered by Node.js, Express, and MongoDB.

Tech Stack

Frontend:
React
React Router
Axios
Framer Motion
Tailwind CSS
Vite


Backend:
Node.js
Express
MongoDB (with Mongoose)
JSON Web Tokens (JWT)
Bcrypt


Database: MongoDB (hosted on MongoDB Atlas)
Other: dotenv, CORS

Prerequisites
Ensure you have the following installed:

Node.js (v14 or later)
npm (included with Node.js)
MongoDB Atlas account
Git

Installation
Clone the Repository
git clone https://github.com/your-username/billbuddy.git
cd billbuddy

Set Up the Backend

Navigate to the backend directory:cd backend


Install dependencies:npm install


Create a .env file in the backend directory:echo "MONGO_URI=your-mongodb-connection-string" > .env
echo "JWT_SECRET=your-secure-secret-key" >> .env
echo "PORT=5000" >> .env


Replace your-mongodb-connection-string with your MongoDB Atlas URI.
Replace your-secure-secret-key with a secure string.


Start the backend server:npm start


The server runs on http://localhost:5000.



Set Up the Frontend

Open a new terminal and navigate to the frontend directory:cd frontend


Install dependencies:npm install


Start the frontend development server:npm run dev


The app is available at http://localhost:5173.



Usage

Register a User:
Visit http://localhost:5173/register.
Enter username, email, phone, and password.


Log In:
Go to http://localhost:5173/login and log in.


Add a Bill:
Navigate to /add-bill from the dashboard.
Enter bill details and submit.


Manage Bills:
On /dashboard, view bills, check debts, and toggle paid status.


Log Out:
Click "Logout" to end the session.



API Endpoints

POST /api/auth/register: Register a new user.
POST /api/auth/login: Log in and get a JWT token.
GET /api/users: Fetch all usernames (authenticated).
GET /api/me: Fetch current user profile (authenticated).
GET /api/bills: Fetch all bills (authenticated).
POST /api/bills: Add a new bill (authenticated).
PUT /api/bills/:id: Update bill status (authenticated).

Testing

Manual Testing:
Test registration, login, bill creation, and debt calculations via the UI.
Use Postman for API testing (include Authorization: Bearer <token>).


Stopping the Servers

Backend: Press Ctrl+C in the backend terminal.
Frontend: Press Ctrl+C in the frontend terminal.

Database Management

Access Data:
Use MongoDB Atlas, MongoDB Compass, or mongosh to view users and bills collections.


Clear Data:use billbuddy
db.users.drop()
db.bills.drop()



Contributing

Fork the repository.
Create a branch: git checkout -b feature/your-feature.
Commit changes: git commit -m "Add your feature".
Push to branch: git push origin feature/your-feature.
Open a Pull Request.

Contact
For questions, contact abelsmathew228@gmail.com or open a GitHub issue.
