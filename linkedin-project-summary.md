# Shipping Management System - LinkedIn Project Summary

## Project Overview

This project is a full-featured shipping and logistics management frontend built with `Next.js 16`, `TypeScript`, `Redux Toolkit`, `RTK Query`, `React Hook Form`, `Yup`, and `Tailwind CSS`, integrated with a `.NET` backend API.

The system is designed to manage daily shipping operations end-to-end across multiple user roles, including:

- `Admin`
- `Employee`
- `Merchant`
- `Delivery`

Rather than building isolated CRUD pages, the work focused on delivering a connected operational system with role-aware dashboards, protected routes, setup workflows, reporting, dynamic forms, and order lifecycle management.

## What I Built

I developed a logistics dashboard and operations frontend that supports the core workflows of a shipping company, including merchant onboarding, branch and location setup, delivery assignment, order creation, order tracking, status updates, reporting, and profile/settings management.

The application includes:

- Authentication flow with login, forgot password, OTP verification, and password reset.
- Route protection and session restoration using cookies, JWT decoding, Redux state hydration, and redirect handling.
- Role-based dashboards with different experiences for admin, merchant, and delivery users.
- A multi-step setup wizard for initializing business data such as branches, governments, cities, and merchants.
- Order management with create, read, delete, status transitions, delivery assignment, filtering, and details view.
- Merchant-specific and delivery-specific order views driven by the logged-in user.
- Report pages with filtering by status, date range, and search terms.
- System settings modules for shipping types, pricing, governments, cities, roles, permissions, and general settings.
- Profile management including profile image upload.
- Dark/light mode support and a more premium dashboard UI direction.

## Technical Highlights

This project demonstrates strong frontend engineering across architecture, state management, API integration, and user experience:

- Built on the Next.js App Router structure with clear feature-based organization.
- Used `Redux Toolkit` for global state and `RTK Query` for API calls, cache invalidation, and mutation workflows.
- Centralized API endpoints and built a large shared API slice covering auth, orders, merchants, deliveries, branches, reports, profile, settings, shipping types, roles, and permissions.
- Implemented role-aware data fetching logic so each user sees the correct data source and actions based on their role.
- Added defensive response normalization in multiple places to handle backend shape inconsistencies and 404 fallback cases safely.
- Built advanced forms with `React Hook Form` and `Yup`, including cascading selects, conditional resets, multi-product order payloads, checkbox-driven options, and derived form filtering.
- Implemented a setup wizard with dependency-aware navigation, smart redirects, completion tracking, and success-driven progression.
- Created analytical dashboards using `Recharts` to visualize order activity, revenue, destination distribution, merchant performance, and delivery coverage.
- Added reusable UI building blocks such as stat cards, loaders, empty states, pagination, dialogs, theme toggle, breadcrumbs, and responsive sidebar/mobile navigation.
- Integrated `Sonner` to provide user feedback for mutations and operational actions.

## Features That Stand Out

If I were presenting this project to a hiring manager or senior engineer, these are the strongest implementation points:

- Multi-role system design instead of a single generic dashboard.
- Real operational order lifecycle, not just static records.
- Setup wizard that reflects actual business dependencies.
- Dynamic shipping forms with nested product data and location-aware selection.
- Reporting and analytics connected to live backend data.
- Frontend architecture that scales by features rather than page-only logic.
- Strong API integration layer with reusable hooks and cache-aware mutations.
- UX work that improves perceived product quality through theming, charts, polished cards, empty states, and status feedback.

## Senior-Level Talking Points

What makes this project stronger than a typical junior CRUD app is the combination of business logic, architecture, and product thinking:

- I handled multiple personas inside one product and separated their experiences clearly.
- I built flows that reflect real shipping operations, including assignment, rejection, status changes, and merchant-specific visibility.
- I used centralized state and API patterns that make the codebase easier to scale and maintain.
- I worked with backend-driven constraints and normalized inconsistent API responses on the frontend where needed.
- I focused on reusable abstractions, structured folders, typed models, validation schemas, and shared UI components.
- I paid attention to both functionality and presentation, especially in dashboard analytics and theming.

## Ready-to-Post LinkedIn Version

Recently, I finished building a full shipping management frontend system using `Next.js 16`, `TypeScript`, `Redux Toolkit`, `RTK Query`, `React Hook Form`, `Yup`, and `Tailwind CSS`, integrated with a `.NET` backend.

This was not just a set of CRUD screens. The project was designed as a real logistics operations platform with multiple user roles (`Admin`, `Employee`, `Merchant`, and `Delivery`), each with different dashboards, permissions, and workflows.

Key parts I worked on included:

- Full authentication flow with login, password recovery, OTP verification, and session restoration
- Protected routing and role-aware navigation
- Advanced order management flow with creation, filtering, assignment to delivery agents, status updates, rejection flow, and detailed order views
- Merchant and delivery specific experiences based on the authenticated user
- A setup wizard for onboarding core business entities like branches, governments, cities, and merchants
- Reporting and analytics dashboards powered by live API data
- Dynamic validated forms with cascading dropdowns and complex payload handling
- Reusable UI architecture with shared components, loaders, empty states, pagination, and themed layouts

One thing I am especially proud of is that the project reflects real product and business logic, not just frontend styling. I had to think about system flow, user roles, backend integration, validation, fallback handling, and usability together.

Projects like this helped me grow beyond basic frontend implementation and practice building systems that feel closer to production software.

I am currently open to frontend opportunities where I can contribute to building scalable, thoughtful, and user-centered products.

## Short CV / Portfolio Bullets

- Built a role-based shipping management system using `Next.js`, `TypeScript`, `Redux Toolkit`, and `RTK Query`.
- Implemented end-to-end order operations including creation, assignment, status transitions, rejection, filtering, and reporting.
- Developed multi-step onboarding/setup workflows for branches, cities, governments, and merchants.
- Created role-specific dashboards with analytics and live operational data visualization using `Recharts`.
- Built advanced validated forms with cascading dependencies and complex nested payload handling.
- Integrated authentication, protected routing, session restoration, and profile management with backend APIs.

## Suggested Caption Style

If you want the post to sound more confident and job-search oriented, use this tone:

"I enjoy building frontend systems that go beyond UI and reflect real business workflows. This shipping management platform pushed me to think about architecture, role-based access, data flow, validation, analytics, and product usability together. I'm currently looking for frontend opportunities where I can bring that same mindset to production products."
