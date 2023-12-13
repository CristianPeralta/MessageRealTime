<div align="center">
   <h1>MessageRealTime Application </h1>
  <img src="https://img.shields.io/badge/Node.js-43853D" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-F7DF1E" alt="Express">
  <img src="https://img.shields.io/badge/-MongoDB-white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Vue.js-35495E" alt="Vue.js">
  <img src="https://img.shields.io/badge/Sockets-21af90" alt="Sockets">
  <img src="https://img.shields.io/badge/-CRUD_Operations-red" alt="CRUD Operations">
  <img src="https://img.shields.io/badge/-Docker-blue" alt="Docker">
</div>
<br>

This project is a web application built with Node.js, Express, MongoDB, and Vue.js. The application provides a login system, group chat, direct messages, contacts, and user profile.

## 1. Requirements 

To run this application, you need to have the following installed on your computer:

- Node.js [versión 18.18.2]
- MongoDB [versión 6.0.4]

## 2. Technologies Used
  - Node.js [18.18.2]
  - Express [4.16.2]
  - MongoDB [6.0.4]
  - Vue.js [2.5.13]

## 3. Installation 

Run the following command to install the dependencies: 
```bash
npm install
```

## 4. Configuration

1.  Copy the `.env.example` file as `.env` and configure the necessary environment variables.
2.  If you want to run tests, also copy the `.env.example` file as `.env.test` and configure the necessary environment variables for testing.

## 5. Execution

To run the server, execute the following command in the project root:

```bash
npm run start
```
The server will start on port 3000

And for the client:

```bash
npm run watch
```
The client will start on port 3000


## 6. Docker

This documentation provides instructions on how to use Docker to build and run the Messages application. It covers building the Docker image, running the image with Docker, and using Docker Compose for more complex setups.

### 6.1 Prerequisites

Docker should be installed on your system. If you don't have Docker installed, please follow the [Docker installation guide](https://docs.docker.com/engine/install/).

### 6.2 Building the Docker Image

To build the Docker image for the Messages application, run the following command:
```bash
docker build -t messages-app .
```
### 6.3 Running the Docker Container
To run the Docker container with the Messages app image, use the following command:

```bash
docker run -p 3000:3000 --network host messages-app
```
Note: Using the --network host flag allows the container to consume the database from the host machine. If this is not available, consider using Docker Compose as described below.

### 6.4 Running with Docker Compose
If you prefer to use Docker Compose, follow these steps:

Grant necessary permissions to the data directory for persistent storage:

```bash
sudo chmod -R 777 /data/db
```
Uncomment line 6 and comment line 4 in the .env file:

```bash
4. MONGODB_CONNECTION_STRING=mongodb://localhost/messageDb
5. # For docker compose
6. # MONGODB_CONNECTION_STRING=mongodb://mongodb/messageDb
```
(Optional) If you encounter permission issues or need to customize the UID and GID, uncomment lines 7 and 8 in the .env file:

```bash
7. # UID=1000
8. # GID=1000
```
Ensure that port '27017:27017' is available on your system or modify the port in line 6 of the docker-compose.yml file.

To run the Messages application with Docker Compose, execute the following command:

```bash
docker compose up
```

## 7. Author
[Cristian Peralta](https://github.com/CristianPeralta)

## 8. License
This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.
