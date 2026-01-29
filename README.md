# Municipality Management System – How to Run

This file contains the steps needed to run the project on your laptop.

---

## 0) Requirements

Make sure you have these installed:

- **XAMPP** (includes Apache + MySQL + phpMyAdmin)
- **PHP >= 8.2**
- **Composer** (https://getcomposer.org)
- **Node.js >= 16 + npm** (https://nodejs.org)

---

## 1) Get the Project

### Method A: ZIP File

1. Download the ZIP file.
2. Extract it anywhere (Desktop is fine).
3. Open **VS Code** → File → Open Folder → select the extracted folder.
4. Open the terminal in VS Code: **View → Terminal** (or press `` Ctrl + ` ``)

### Method B: GitHub Clone

Open PowerShell and run:

```powershell
git clone https://github.com/Kareem-hassanieh/municipality-system.git
cd municipality-system
code .
```

---

## 2) Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Click **Start** next to:
   - **Apache**
   - **MySQL**
3. Make sure both show **Running** (green).

> **Note:** Apache is needed to open phpMyAdmin in the browser, and MySQL is needed for the database connection.

---

## 3) Create the Database

1. Open your browser and go to: http://localhost/phpmyadmin
2. Click the **Databases** tab.
3. In "Create database", type: `municipality_db`
4. Click **Create**.

> **Note:** If `municipality_db` already exists, create a different name and update it in `backend/.env` later.

---

## 4) Backend Setup (Laravel)

In the VS Code terminal, run these commands:

### Step 1: Go to backend folder

```powershell
cd backend
```

### Step 2: Install PHP dependencies

```powershell
composer install
```

### Step 3: Create .env file

**If you are using PowerShell:**
```powershell
Copy-Item .env.example .env
```

**If you are using macOS, Linux, or Git Bash:**
```bash
cp .env.example .env
```

### Step 4: Generate Laravel app key

```powershell
php artisan key:generate
```

---

## 5) Configure Database in .env

Open the file `backend/.env` and make sure these lines are correct:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=municipality_db
DB_USERNAME=root
DB_PASSWORD=
```

> **Notes:**
> - In most XAMPP installs, the root user has an empty password, so `DB_PASSWORD=` is normal.
> - If your MySQL has a password, add it after `DB_PASSWORD=`.
> - If you created a different database name, update `DB_DATABASE=`.

---

## 6) Create Tables + Admin Account

Still in the `backend/` folder, run:

```powershell
php artisan migrate
```

```powershell
php artisan db:seed
```

> **Note:** The `db:seed` command creates an admin account automatically (defined in `database/seeders/DatabaseSeeder.php`) with the following code:

```php
User::create([
    'name' => 'Admin',
    'email' => 'admin@municipality.com',
    'password' => 'password123',
    'role' => 'admin',
]);
```

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@municipality.com   |
| Password | password123              |

---

### Want to create a new Admin?

**Option A: Using Tinker**

In the `backend/` folder, run:

```powershell
php artisan tinker
```

Then type:

```php
User::create(['name' => 'New Admin', 'email' => 'newadmin@example.com', 'password' => 'password123', 'role' => 'admin']);
```

Type `exit` to close Tinker.

**Option B: Edit the Seeder**

1. Open `database/seeders/DatabaseSeeder.php`
2. Add another `User::create([...])` with the new admin details
3. Run `php artisan db:seed` again

---

### Want to create a Citizen?

Just register through the website at: http://localhost:5173/register

---

## 7) Start the Backend Server

Still in `backend/`, run:

```powershell
php artisan serve
```

Backend will run at: **http://localhost:8000**

**Keep this terminal open!** Don't close it.

---

## 8) Frontend Setup (React + Vite)

Open a **new terminal** in VS Code (click the **+** button in the terminal panel).

**Do NOT close the backend terminal!**

### Step 1: Go to frontend folder

From the project root folder:

```powershell
cd frontend
```

### Step 2: Install Node dependencies

```powershell
npm install
```

### Step 3: Start the frontend

```powershell
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## 9) Open the Website

Open your browser:

### Admin Dashboard
- Go to: http://localhost:5173/login
- Email: `admin@municipality.com`
- Password: `password123`

### Citizen Portal
- Citizens can register at: http://localhost:5173/register

> **Tip:** To test both Admin and Citizen at the same time, open one in a normal tab and the other in an **Incognito/Private window**.

---

## 10) Common Problems (Quick Fixes)

### A) phpMyAdmin does not open
If http://localhost/phpmyadmin shows "refused to connect":
- Start **Apache** in XAMPP.

### B) Database connection error in Laravel
If you see: `SQLSTATE[HY000] [2002] ... refused`
- Start **MySQL** in XAMPP.
- Check the DB settings in `backend/.env`.

### C) Missing vendor/autoload.php
If artisan fails with "vendor/autoload.php not found":
- Run `composer install` inside the `backend/` folder.

### D) Frontend fails to start
- Run `npm install` inside the `frontend/` folder.
- Then run `npm run dev`.

### E) "php" or "composer" not recognized
- Make sure PHP and Composer are installed and added to your system PATH.
- Restart your terminal after installing.