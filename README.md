# SIMS-PPOB-API-Project

## Table of Contents

1. [Project Introduction](#project-introduction)
2. [Key Features](#key-features)
3. [Technologies Used](#technologies-used)
4. [Entity Relationship Diagram](#entity-relationship-diagram)
5. [App URL](#app-url)
6. [App Endpoint](#app-endpoint)


## Project Introduction
This project introduces a robust payment platform designed to facilitate seamless transactions and manage user profiles effectively. The platform offers a comprehensive suite of features, including user management, product operations, secure authentication, and robust error handling.

## Key Features:
A. User Management:

 - Create new user accounts
 - Authenticate users using secure JSON Web Tokens (JWT)
 - Update user profiles and manage their financial balances

B. Product Operations:

 - Manage and display banners for promotional purposes
 - Provide detailed information about available services
 - Allow users to check their current balance
 - Enable users to top up their balance for transactions

C. Transactions:

 - Process various types of transactions, such as purchases, payments, and balance updates
 - Check a transaction history

D. File Upload:

 - Allow users to upload profile images for personalization
   
E. Error Handling:

 - Implement comprehensive error handling to provide informative messages and maintain system stability, covering input validation, database errors, authentication issues, and unexpected exceptions.

F. Security:

 - Prioritize user data security with measures like input validation, password hashing, JWT authentication, and access control..

  


## Technologies Used

| Technology | Description |
|---|---|
| Node.js | JavaScript runtime environment for server-side applications |
| Express.js | Web framework for building web applications and APIs with Node.js. It provides a structured way to handle HTTP requests and responses |
| PostgreSQL | Relational database management system to store and manage application's data  |
| pg | A Node.js library for interacting with PostgreSQL databases |
| dotenv | library that loads environment variables from a .env file, making it easier to manage configuration settings without exposing it in the code |
| jsonwebtoken | Library for generating and verifying JWTs for authentication |
| bcrypt | Library providing secure password hashing for user authentication |
| multer | Middleware for handling file uploads in Express.js applications |

## Entity Relationship Diagram
![Payment-Point-Online-Banking Tables](https://github.com/aliraihann/SIMS-PPOB-API-Project/blob/main/Entity%20Relationship%20Diagram.png)
Here's a breakdown of the key entities and their functionalities:

1. Users: Represent the system's users, identified by unique IDs and associated with attributes like email, name, profile image, and password. Each user has a corresponding balance record tracking their current financial standing.
2. Banners: Represent advertisements or promotional content displayed within the system. Each banner has a unique ID, name, image URL, description, and creation timestamp.
3. Services: Represent the available services or products offered by the system. Each service has a unique ID, code, name, icon URL, and a tariff associated with it (e.g., price or fee). Services can be linked to transactions, indicating their involvement in user purchases.
4. Transactions: Represent financial activities performed by users. Each transaction has a unique ID, a user ID (foreign key referencing the user), invoice number, transaction type (purchase, payment, etc.), description, total amount, creation timestamp, and an optional service ID if applicable.
5. Balance: Represents the current financial standing of each user. Each balance record has a unique ID, a user ID (foreign key), and a field for storing the current balance amount. Additionally, a timestamp tracks the last time the balance was updated.


These entities interact through defined relationships:

A. One-to-Many: A user can have many transactions associated with them, reflecting their activity. Similarly, a user has one corresponding balance record. Each service can be involved in multiple transactions.

B. Many-to-Many: Services can be associated with many transactions, suggesting they might be displayed across various transactions within the system.

By understanding the relationships and attributes within this data model, users can effectively interact with the API to manage services, conduct transactions, and track their balances.

## App Url: 
sims-ppob-api-project-production.up.railway.app

## App Endpoint: 

1. **User registration**:
   - Method: POST
   - Endpoint: /registration
   -  Description: This endpoint registers a new user by taking their email, first name, last name, and password. It validates the input, checks if the user already exists, hashes the password, stores the user in the database, and initiates a new balance for the user.
   -   Request Body:
       - email: (string, required) The user's email address. Must follow a valid email format.
       - first_name: (string, required) The user's first name.
       - last_name: (string, required) The user's last name.
       - password: (string, required) Must be at least 8 characters.
           ```
           {
             "email": "user@nutech-integrasi.com",
             "first_name": "User",
             "last_name": "Nutech",
             "password": "abcdef1234"
           }
           ```
   -  Response:
       * Success Response
         - Status Code: 200
         - Response Body:
           ```
           {
             "status": 0,
             "message": "Registrasi berhasil silahkan login",
             "data": null
           }
           ```
       * Error Response:
         - Status Code: 400
         - Response Body:
           ```
           {
             "status": 102,
             "message": "Error message here",
             "data": null
           }
           ```

          * Error Messages
              - "Password minimal berjumlah 8 karakter": When the password is less than 8 characters.
              - "Parameter email tidak sesuai format": When the email format is invalid.
              - "Email telah digunakan": When the email is already registered.
              - "Gagal membuat balance untuk user": When there is a failure in initiating the user's balance.
           
1. **User Login**:
   - Method: POST
   - Endpoint: /login
   -  Description: This endpoint authenticates a user using their email and password. It validates the email format, verifies the user's existence, checks the password, and returns a JWT token upon successful authentication.

   - Request Body:
        - email: (string, required) The user's email address. Must follow a valid email format.
        - password: (string, required) The user's password.
            ```
            {
              "email": "user@nutech-integrasi.com",
              "password": "abcdef1234"
            }
            ```
    - Response:
        - Success Response: 
            - Status Code: 200
            - Response Body:
            ```
            {
              "status": 0,
              "message": "Login Sukses",
              "data": {
                "token": "eyJhbGciOiJIUzI1NiIs..."
            }
            ```
        - Error Response:
            - Status Code: 400/500
            - Response Body:
            ```
            {
              "status": 102,
              "message": "Error message here",
              "data": null
            }
            ```
            - Error Messages:
                - Status 102:
                    - "Parameter email tidak sesuai format": When the email format is invalid
                - Status 103:
                    - "Username atau password salah": When the email doesn't exist or password is incorrect
                    - "Internal server error": When an unexpected server error occurs (Status Code: 500)

        - Authentication:
            - After successful login, a JWT token is returned
            - Store this token and include it in subsequent requests
            - Format: Include in Authorization header using Bearer scheme

Here are the list of other endpoint:
1. post - /login -> user login
1. get - /profile -> get user's profile
1. post - /profile/update -> Update user's profile
1. post - /profile/image -> Update user's profile image
2. get - /balance  -> Get user's balance
3. get - /banner -> Get all banners
4. get - /services -> Get all services
5. post - /topup -> Top up balance
6. post - /transaction -> Create transaction
7. get - /transaction/history -> To get transaction history

Note: please look up in the source code for more details on the endpoint requirement, function and etc
