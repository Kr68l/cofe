# Restauranrt website
Rapota Kira Konstantinivna 
email: kira_rapota@icloud.com 
Nechai Nika Olegivna
email: mejz698@gmail.com

## Project Goal
The Cofe restaurant website is a web application designed for a modern restaurant. 
**The platform allows users to:**
- view restaurant menu and information
- book tables online
- contact administration
- view location on maps
- create personal accounts
- leave comments and ratings
- view reservation history
The project was created to improve interaction with customers and simplify the process of booking tables.

## Functionality
- Responsive café website interface
- Website translation / language switcher
- Multilingual interface for different users
- User registration and login
- Manual registration using email and password
- Sign in and registration via Google
- Email confirmation after user registration
- Supabase authentication integration
- User session management
- Connection to Supabase database
- Local project launch using MAMP server
- Navigation through main website sections
- Interactive user forms
- Database storage for user-related data
### Authentication
The website uses Supabase Authentication for user registration and login.
Users can create an account manually using email and password or sign in with Google. After registration, a confirmation email is sent to the user's email address. The account becomes active after confirming the registration through the link in the email.
Google authentication is supported for both login and registration.
Apple authentication is currently not available because it requires an additional paid subscription.
### Translation
The website includes a translation feature that allows users to switch the interface language. This improves accessibility and makes the café website more convenient for different visitors.


### Customer Features

- User registration and login
- Online table reservation
- Reservation form validation
- Viewing restaurant information
- Contact form for customer inquiries
- Language switching (Ukrainian / Englis /Germany)
- Responsive design for mobile and desktop devices

### Administrative Features

- Viewing reservation requests
- Managing customer bookings
- Monitoring registered users
- Processing customer messages

### Technical Features

- Database storage for users and reservations
- Session-based authentication
- Dynamic page rendering
- RESTful backend architecture
- Frontend and backend integration

##  Getting Started
To run the Café Website locally, follow the steps below:
### 1. Clone the repository
git clone <repository_url>
cd <project_folder>
### 2. Create a virtual environment
python -m venv venv
### 3. Activate the virtual environment
source venv/bin/activate
### 4. Install dependencies
pip install -r requirements.txt
### 5. Run the project
python telegram_bot.py
### 6.Start MAMP or any other local server
Open MAMP and start **Apache** and **MySQL** servers. Move project to MAMP directory. Place the project folder into: /Applications/MAMP/**htdocs/**
### 7. Open project in browser
Go to: http://localhost:8888/<project_folder>/
or simply: http://localhost:8888/
### 8. Register/login - or supabase
Open the file auth.js and insert your Supabase URL and API keys.
Make sure your database is active (note: if there is no activity for 7 days, it may stop automatically depending on the free tier settings).
Then go to the website and choose:
- Login or Register
You can create an account manually or use Google authentication.
Apple authentication is not supported because it requires an additional paid subscription.
After signing up via Google, confirm your account by following the link sent to your email address.
That’s it — your account is successfully created and ready to use.

###  Requirements
- Local server environment (MAMP)
- Supabase backend (authentication and database)
- Web browser (latest version recommended)
- Internet connection for external services (Google OAuth, Supabase)

## Getting Started
Start MAMP (Apache + MySQL), place the project in htdocs, then open it in the browser.
URL http://localhost:8888/<project_folder>/
Database (if used)
Import the .sql file via phpMyAdmin:
http://localhost:8888/phpMyAdmin/
Check database connection settings in the project files.

## License
This project is licensed under the MIT License.