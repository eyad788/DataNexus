# DataNexus

## Project Description
**DataNexus** is a web-based application built with Node.js that helps organizations store, organize, and manage their data effectively. The platform ensures that data within corporate systems is accurate, available, and accessible, streamlining the data management process and facilitating better data-driven decision-making.

## Features
- **Data Storage:** Securely store structured and unstructured data.
- **Data Accessibility:** Ensure that data is accessible to authorized users.
- **Data Integrity:** Maintain the accuracy and consistency of the data.

## Getting Started

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB 
- npm 

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/datanexus.git
    ```
2. Navigate to the project directory:
    ```bash
    cd datanexus
    ```
3. Install dependencies:
    ```bash
    npm install
    ```


### Running the Application
Start the development server:
```bash
npm run watch
```
The application will be available at `http://localhost:3000`.



## Usage
1. Register a new organization customer and create user roles.
2. Manage data access permissions to ensure data security.


## Project Structure
```bash
├── controllers        # Controller files
├── middleware         # Middleware files
├── models             # Database models
├── public             # Static files (CSS, JS, Images)
├── routes             # API routes
├── views              # Frontend templates
├── .env               # Environment configuration
├── app.js             # Main server file
└── README.md
```

## Technologies Used
- **Node.js**: Backend framework
- **Express**: Web framework for Node.js
- **MongoDB**: Database for storing and querying data
- **Mongoose**: MongoDB object modeling for Node.js
- **EJS**: Template engine for rendering views.
- **Cloudinary**: Media management solution for uploading, storing, and serving images.


