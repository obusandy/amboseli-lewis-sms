# Amboseli School Management System

A modern, web-based school fee and student management system designed for small to medium-sized educational institutions. This application provides administrators with a powerful, at-a-glance dashboard to track finances, manage students, and automate critical end-of-year processes with safety and confidence.



## ✨ Key Features

*   **Dynamic Admin Dashboard:** A central hub providing real-time financial statistics, including term collections, term-specific outstanding fees, and the total outstanding balance (including all historical arrears).
*   **Comprehensive Fee Tracking:** The system intelligently tracks student payments on a per-term basis.
*   **Cumulative Arrears Management:** Unpaid balances are automatically and accurately calculated and rolled over from term to term and year to year, ensuring no debt is ever lost.
*   **Student & Class Management:** Easily view students by class, manage their financial records, and update class-wide term fees through a user-friendly interface.
*   **Automated End-of-Year Promotion:** The system automates the promotion of students to the next class and the graduation of the final year class. This complex process is triggered intelligently and safely when the administrator starts a new "Term 1".
*   **Safety Net: Undo Promotion:** A critical "Undo" feature is available immediately after a promotion event, allowing administrators to instantly revert the entire process in case of a mistake.
*   **Secure Admin Authentication:** Built with NextAuth.js, ensuring that all sensitive data and administrative functions are protected.
*   **Dynamic Term Management:** Administrators have full control over the academic calendar, with a visual progress bar and countdown on the dashboard.
*   **Responsive & User-Friendly Interface:** Built with Ant Design, the UI is clean, professional, and accessible on both desktop and mobile devices.

---

## 💻 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database ORM:** [Prisma](https://www.prisma.io/)
*   **Database:** [MongoDB](https://www.mongodb.com/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **UI Library:** [Ant Design](https://ant.design/)
*   **Data Fetching:** [SWR](https://swr.vercel.app/)

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites

*   Node.js (v18 or later)
*   npm or yarn
*   A MongoDB database (a free tier on [MongoDB Atlas](https://www.mongodb.com/atlas/database) is perfect)

### 2. Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://your-repository-link.git
    cd amboseli-lewis-sms 
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of the project and add the following variables. Get your `DATABASE_URL` from MongoDB Atlas.

    ```env
    # .env

    # Your MongoDB connection string
    DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/your-db-name?retryWrites=true&w=majority"

    # A long, random string for NextAuth.js session security
    # You can generate one here: https://generate-secret.vercel.app/32
    NEXTAUTH_SECRET="your-super-secret-string"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Sync the database schema:**
    This command reads your `prisma/schema.prisma` file and applies it to your MongoDB database.
    ```bash
    npx prisma db push
    ```

5.  **Seed the database:**
    This is a critical one-time step that creates the foundational data the application needs to run, such as the school classes ("Form 1", "Graduated", etc.) and the default admin user.
    ```bash
    npx prisma db seed
    ```
    *   **Default Admin Credentials:**
        *   **Email:** `admin@amboseli.com`
        *   **Password:** `admin123`
    *(You can change these in the `prisma/seed.ts` file if needed)*

6.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:3000`.

---

## 📖 Admin Guide

### Logging In
Navigate to `http://localhost:3000/login` and use the default admin credentials to access the system.

### Starting a New Term
1.  Navigate to **System Management -> Go to Term Settings**.
2.  Fill in the "Term Name" (e.g., "Term 2 2024").
3.  Select the start and end dates.
4.  Click "Start Term".

> **IMPORTANT:** If you start a term with "Term 1" in its name (e.g., "Term 1 2025"), the system will **automatically** perform the end-of-year process: it will calculate and save all outstanding arrears for every student and then promote them to the next class. An "Undo Promotion" button will appear for 10 seconds in the success message.

### Recording a Payment
1.  From the dashboard, click "View Class" on any class card.
2.  Find the student in the table and click the "Record Payment" button.
3.  Fill in the amount and details, then submit.

### Managing Class Fees
1.  Navigate to **System Management -> Manage Class Fees**.
2.  Click "Edit Fee" for the desired class, enter the new amount, and update.

---

## 🔮 Future Features (Roadmap)

*   **Import Students from CSV:** A feature to allow administrators to bulk-upload new students from a CSV file.
*   **Offline Functionality (PWA):** Convert the application into a Progressive Web App to allow recording payments even with an unstable internet connection.
*   **Detailed Student Profiles:** A dedicated page for each student showing their complete payment history and academic progress.
*   **Expense Tracking:** A module for the school to track its own expenses.

---

## 📄 License

This project is licensed under the MIT License.
>>>>>>> Stashed changes
