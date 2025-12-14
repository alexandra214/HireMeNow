# HireMeNow  
**A Full-Stack Job Portal Project**   

**Team Members:**  
- Oblu Alexandra-Mihaela
- Matei Eduard-Gabriel 

## Project Overview  
HireMeNow is a web-based job portal designed to connect students with employers for internships, freelance work, part-time jobs, and entry-level positions.  

The platform supports three user roles:  
- **Students** – browse jobs, apply, manage applications, and create a personal portfolio  
- **Employers** – post and edit jobs, view applicants and their portfolios  
- **Admin** – manage users and jobs  

This project was developed as a team of two, focusing on clean code, role-based access, and a professional user experience.

## Main Features  

### Student Features  
- Register/Login as student  
- Browse available jobs  
- Apply to jobs (one application per job)  
- View and cancel applied jobs in dashboard  
- Create and update a personal portfolio (full name, phone, education, experience, skills)  

### Employer Features  
- Register/Login as employer  
- Post new jobs  
- Edit existing jobs (using the same form)  
- View list of posted jobs  
- View job details with list of applicants  
- View each applicant’s portfolio in a popup  

### Admin Features  
- View and delete users  
- View and delete jobs  

## Technical Stack  
- **Backend**: Node.js + Express  
- **Database**: MariaDB  
- **Authentication**: JWT (JSON Web Tokens)  
- **Frontend**: HTML, CSS, JavaScript (vanilla – no frameworks)  

## Project Structure Highlights  
- Role-based routing and UI  
- Reusable post-job form for both create and edit  
- Secure API endpoints with JWT verification  
- Responsive design with modern CSS (gradients, shadows, hover effects)  
- Clean separation of routes (auth, jobs, profile, admin, student, applications, portfolio)  

## What We Learned  
- Full-stack development workflow  
- Database design with foreign keys and constraints  
- Role-based authorization  
- Building reusable components in vanilla JS  
- Handling file uploads and form data  
- Debugging complex authentication issues  

## Setup & Run  
```bash
npm install
node server.js
```
Open `http://localhost:4000`
