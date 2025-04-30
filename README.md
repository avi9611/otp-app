# 🔐 Secure OTP Authentication App

A modern, passwordless login system using one-time passwords (OTP) to enhance user security and convenience. This app replaces traditional password logins with dynamically generated OTPs and provides a clean, responsive interface with insightful dashboard charts.

---

## 🚀 Live Demo

**Deployed on:** [https://otp-app-henna.vercel.app/#/login]  
**

---

## 📌 Problem Statement

In today's digital world, users often reuse passwords across platforms, making them susceptible to data breaches. If a single platform is compromised, all associated accounts can be affected. This project introduces an OTP-based login mechanism that eliminates the need for passwords, ensuring more secure and temporary access credentials.

---

## 🎯 Features & Objectives

- ✅ **OTP-Based Authentication**: Passwordless login using a random 6-digit OTP.
- ✅ **OTP Expiry Logic**: OTP is valid for 30 seconds; expired OTPs redirect to a resend screen.
- ✅ **Frontend Only**: OTP is generated and verified using local state or `localStorage`.
- ✅ **Responsive Design**: Matches the provided UI screens (typography, colors, layout).
- ✅ **Dashboard Analytics**: Displays dummy user stats with ApexCharts.
- ✅ **Routing**: Implemented using `react-router-dom` (HashRouter only).
- ✅ **Deployment**: Hosted frontend and backend on modern platforms like Vercel or Render.

---

## 🛠 Tech Stack

- **Frontend**: React.js
- **Routing**: React Router (HashRouter)
- **Charts**: ApexCharts via `react-apexcharts`
- **Styling**: TailwindCSS
- **Backend (optional)**: Express.js for email OTP via `nodemailer`
- **Deployment**: Vercel (frontend), Render (backend)

---

## 🔐 How It Works

1. User enters their email on the login screen.
2. A 6-digit random OTP is generated and displayed via `alert()`.
3. User must enter the OTP within 30 seconds.
4. If OTP is valid:
   - ✅ Redirects to the secure dashboard.
5. If OTP is invalid or expired:
   - ❌ Redirects to the **Resend OTP** screen.

---

