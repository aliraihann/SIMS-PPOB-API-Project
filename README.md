﻿# SIMS-PPOB-API-Project

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

1. **User Profile**:
    - Method: GET
    - Endpoint: /profile
    - Description: This endpoint retrieves the profile information for the authenticated user.
    - Authentication: Required (Bearer Token)
    - Request Headers:
        ```
        Authorization: Bearer <jwt_token>
        ```
    - Response:
        - Success Response:
            - Status Code: 200
            - Response Body:
                ```
                {
                    "status": 0,
                    "message": "Sukses",
                    "data": {
                        "email": "user@example.com",
                        "first_name": "User",
                        "last_name": "Example",
                        "profile_image": "memorystorage/uploads/background.jpg"
                    }
                }
                ```
        - Error Response:
            - Status Code: 401
            - Response Body:
                ```
                {
                    "status": 108,
                    "message": "Token tidak valid atau kadaluwarsa",
                    "data": null
                }
                ```
    - Notes:
        - This endpoint requires a valid JWT token obtained from the login endpoint
        - The token must be included in the Authorization header using the Bearer scheme
       - The endpoint will return the profile information for the authenticated user


1. **Update User Profile**:
    - Method: POST
    - Endpoint: /profile/update
    - Description: This endpoint updates the authenticated user's profile information including first name and last name.
    - Authentication: Required (Bearer Token)
    - Request:
        - Headers:
            ```
                Authorization: Bearer <jwt_token>
            ```
        - Request Body:
            - first_name: (string, required) The user's new first name
            - last_name: (string, required) The user's new last name
            ```
                {
                    "first_name": "User first name edited",
                    "last_name": "Last name edited"
                }
            ```
    - Response:
        - Success Response:
            - Status Code: 200
            - Response Body:
                ```
                {
                    "status": 0,
                    "message": "Update Profile berhasil",
                    "data": {
                        "email": "user@example.com",
                        "first_name": "User Edited",
                        "last_name": "Nutech Edited"
                    }
                }
                ```
        - Error Response:
            - Status Code: 400/401
            - Response Body:
                ```
                {
                    "status": 108,
                    "message": "Error message here",
                    "data": null
                }
                ```
            - Error Messages:
                - "Gagal update profile": When the profile update operation fails
                - "Token tidak valid atau kadaluwarsa": When the authentication token is invalid or expired (Status Code: 401)


1. **Update Profile Image**:
    - Method: POST
    - Endpoint: /profile/image
    - Description: This endpoint allows users to upload and update their profile image. The endpoint accepts JPEG, JPG, or PNG image files.
    - Authentication: Required (Bearer Token)
    - Request
        - Headers:
            ```
                Authorization: Bearer <jwt_token>
            ```
        - Request Body:
            - file: (file, required) The image file to upload
            ```
                Form-data:
                file: <image_file>
            ```
        - File Requirements
            - Allowed File Types:
                - JPEG/JPG
                - PNG

    - Response:
        - Success Response:
        - Status Code: 200
        - Response Body:
            ```
            {
                "status": 0,
                "message": "Update Profile berhasil",
                "data": {
                    "email": "user@example.com",
                    "first_name": "User",
                    "last_name": "Example",
                    "profile_image": "memorystorage/uploads/image.jpg"
                }
            }
            ```
        - Error Response:
            - Status Code: 400/401
            - Response Body:
                ```
                {
                    "status": 102,
                    "message": "Error message here",
                    "data": null
                }
                ```
        - Error Messages:
            - "Format Image tidak sesuai": When the uploaded file type is not supported
            - "Gagal upload file": When no file is uploaded or upload fails
            - "Gagal update profile": When the profile update operation fails
            - "Token tidak valid atau kadaluwarsa": When the authentication token is invalid (Status Code: 401)
    - Notes
        - The image must be uploaded as multipart/form-data
        - Only JPEG, JPG, and PNG formats are accepted
        - The file should be sent with the field name "file"
        - The endpoint uses Multer for file handling
        - Files are stored differently in development (disk storage) and production (memory storage)
        - The response includes the complete updated user profile with the new image path
          
Here are the list of other endpoint:

2. get - /balance  -> Get user's balance
3. get - /banner -> Get all banners
4. get - /services -> Get all services
5. post - /topup -> Top up balance
6. post - /transaction -> Create transaction
7. get - /transaction/history -> To get transaction history

Note: please look up in the source code for more details on the endpoint requirement, function and etc
