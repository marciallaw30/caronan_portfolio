# Capstone Project Defense Presentation Blueprint (30 Points)
**Student Guidelines Step 22 (Page 7)**
**Total Defense Time**: 25–30 Minutes

## Slide Deck & Speaking Script Outline

| Stage | Duration | Agenda | Key Talking Points |
|---|---|---|---|
| **1. Introduction** | 1–2 mins | Greeting & Candidate Intro | Candidate profile, BSIT degree, Datamex College of Saint Adeline, and capstone title. |
| **2. Problem Statement** | 2 mins | Industry Problem Analysis | Small and mid-sized retail enterprises suffer from stockouts, inaccurate inventory counts, and manual reorder overhead. |
| **3. Project Objectives** | 1 min | Measurable Targets | Develop a responsive web portal with real-time stock deduction, secure session auth, and automated predictive restock alerts. |
| **4. Proposed Solution** | 2 mins | System Overview | SmartShop AI-Assisted E-Commerce & Inventory Management Platform with role-based access control and live analytics. |
| **5. Technology Stack** | 2 mins | Architectural Decisions | HTML5/CSS3/Bootstrap 5 for responsive design, Vanilla JavaScript for zero-dependency client logic, MySQL for transactional persistence. |
| **6. System Demonstration** | 5–10 mins | Live Functional Walkthrough | Demo user registration, catalog search/filter, cart persistence, checkout order submission, and admin inventory restock dashboard. |
| **7. Architecture & DB** | 3 mins | Schema & Data Flow | Review 3NF normalized schema, foreign keys (users, orders, order_items, products), and ERD relationship mapping. |
| **8. Problems Encountered** | 2 mins | Technical Hurdles | Race conditions during concurrent checkouts; browser CORS headers on webhook events; image asset caching stalls. |
| **9. Solutions Implemented** | 2 mins | Engineering Mitigations | Atomic database transactions, strict preflight CORS headers, and asset cache-busting versioning strings. |
| **10. Future Improvements** | 1 min | Scalability Roadmap | Transition to Node.js/PostgreSQL containerized microservices, mobile app companion, and automated payment gateway webhooks. |
| **11. Q&A Panel Defense** | Open | Panel Inquiry Handling | Defend architectural choices, code maintainability, and database indexing strategies. |