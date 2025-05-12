# Kerjamail Dashboard

## Setup Laravel Project

Follow these steps to set up the Laravel project:

### Prerequisites
- PHP >= 8.3
- Composer
- Node.js & npm
- MySQL or any supported database

### Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-repo/kerjamail-dashboard.git
    cd kerjamail-dashboard
    ```

2. **Install Dependencies**
    ```bash
    composer install
    npm install
    ```

3. **Environment Configuration**
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Update the `.env` file with your database and other configurations.

4. **Generate Application Key**
    ```bash
    php artisan key:generate
    ```

5. **Run Migrations**
    ```bash
    php artisan migrate
    ```

6. **Seed the Database**
    ```bash
    php artisan db:seed
    ```
    - This will populate the database with initial data, including a default user.

7. **Default User Credentials**
    - Email: `admin@mail.com`
    - Password: `admin1234`
    - Role : `Admin`

    - Email: `user@mail.com`
    - Password: `user1234`
    - Role : `User`
    

8. **Build Frontend Assets**
    ```bash
    npm run dev
    ```

9. **Start the Development Server**
    ```bash
    php artisan serve
    ```
