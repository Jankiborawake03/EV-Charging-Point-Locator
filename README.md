# EV ChargePoint Locator 🚗⚡

A full-stack web application that helps Electric Vehicle (EV) users locate nearby charging stations, check availability, book charging slots, and make secure online payments.

## 📌 Features

* 🔍 Search and discover nearby EV charging stations
* 🗺️ Interactive map integration using Leaflet.js
* 📍 Real-time location-based station lookup
* 🔐 Secure user authentication using JWT
* 📅 Charging slot booking and reservation
* 💳 Online payment integration with Razorpay
* 👤 User profile and booking management
* 🛠️ Admin dashboard for managing stations and bookings
* 📱 Responsive and user-friendly interface

## 🏗️ Tech Stack

### Frontend

* Angular
* TypeScript
* HTML5
* CSS3

### Backend

* Spring Boot
* Java
* REST APIs

### Database

* MongoDB

### Authentication

* JWT (JSON Web Token)

### Maps & Geolocation

* Leaflet.js
* OpenStreetMap

### Payment Gateway

* Razorpay

### Version Control

* Git & GitHub

## 📂 Project Structure

```
EV-ChargePoint-Locator/
├── client/          # Angular Frontend
├── server/          # Spring Boot Backend
├── README.md
```

## 🚀 Installation & Setup

### Clone Repository

```bash
git clone https://github.com/your-username/EV-ChargePoint-Locator.git
cd EV-ChargePoint-Locator
```

### Frontend Setup

```bash
cd client
npm install
ng serve
```

Frontend will run on:

```
http://localhost:4200
```

### Backend Setup

```bash
cd server
mvn spring-boot:run
```

Backend will run on:

```
http://localhost:8080
```

### MongoDB

Ensure MongoDB is running locally or update the database configuration in:

```properties
application.properties
```

## 🔑 User Roles

### User

* Register/Login
* Search charging stations
* Book charging slots
* Make payments
* View booking history

### Admin

* Manage charging stations
* View and manage bookings
* Monitor platform usage
* Manage users



## 🔮 Future Enhancements

* Real-time charging station availability updates
* Route optimization for EV users
* Charging session tracking
* Notifications and alerts
* Mobile application support

## 👨‍💻 Author

**Janki Borawake**

GitHub: https://github.com/Jankiborawake03

## 📄 License

This project is developed for learning and educational purposes.
