🌍 Globle Profiles Viewer with Map Integration



**admin authentication**
🛠️ Admin Dashboard

Accessible only after login with:

Email: admin@gmail.com
Password: admin
**must login to access admin page **


A responsive and user-friendly web application built using React.js (frontend) and Express.js (backend) that allows users to browse profiles and view their locations interactively on a Google Map. Administrators can manage the profiles through a secure dashboard.

📌 Features

👤 User Side

Home Page: View a list of profiles with name, photo, and description.

Search & Filter: Filter profiles by name, country, state, or city.

View on Map: Click the Summary button to see a profile’s address on an interactive Google Map.

Profile Detail View: Click on a profile to see full details in a separate page.

🔐 Authentication

Admins must log in via the Auth Page to access the dashboard.

Uses JWT (JSON Web Tokens) for secure session management.

🛠️ Admin Dashboard

Accessible only after login with:

Email: admin@gmail.com

Password: admin

View all profiles in a table format.

Add, Edit, and Delete profiles.

Admin UI includes modals and form validation.

🗺️ Map Integration

Integrated using Google Maps API.

Dynamically displays location markers for profile addresses.

📱 Responsive Design

Fully responsive layout for mobile, tablet, and desktop.

Clean and intuitive user experience.

🚀 Getting Started

🔧 Prerequisites

Node.js and npm

Google Maps API Key

📁 Project Structure

/frontend/globel-profiles     → React frontend
/backend     → Express backend


✅ Usage

🌐 Home Page

Browse, search, and filter profiles.

View location by clicking Summary.

🔑 Auth Page

Login as admin with predefined credentials.

🧑‍💼 Admin Page

Manage profile data.

Open form modals to add or update profiles.

⚠️ Notes

Ensure your Google Maps API key has Maps JavaScript API enabled.

Replace default admin credentials in production.

Error handling and loading indicators are implemented for smooth UX.

