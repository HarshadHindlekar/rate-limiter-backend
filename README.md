# SMS API Rate Limiter

This project implements an API rate limiter for SMS APIs, where clients are limited to a certain number of SMS requests per minute and per day.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Rate Limiting Rules](#rate-limiting-rules)
- [Logging](#logging)
- [Usage](#usage)

## Overview

This project includes:
- **API Rate Limiting** for a public-facing SMS API using Node.js and Redis.

Clients identified by IP address and phone number are restricted to sending:
- A maximum of **3 SMS requests per minute**.
- A maximum of **10 SMS requests per day**.

If a client exceeds the limit, a `429 Too Many Requests` response is returned with a `Retry-After` header specifying when they can retry.

## Features

1. **Rate Limiting**: Enforces rate limits based on IP and phone number.
2. **Throttling**: Returns appropriate responses for clients exceeding limits.
3. **Persistent Storage**: Uses Redis for tracking SMS requests across multiple API instances.
4. **Logging**: Logs each request and records any rate limit violations.

## Technologies Used

- **Backend**: Node.js, Express, Redis
- **Other Libraries**: 
  - `express.json()` for handling JSON requests
  - File system for logging

## Installation

### Prerequisites
- Node.js (v16+)
- Redis
- Git

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HarshadHindlekar/rate-limiter-backend.git
   cd sms-api-rate-limiter

2. **Install dependencies**:
    ```bash
    npm install

3. **Set up Redis**:
- Ensure Redis is installed on your system. If you haven't installed Redis yet, you can follow the setup instructions in      this video to install and run Redis on your local machine.
- Start the Redis server using the following command:
    ```bash
    redis-server

4. **Start the server**:
- After starting Redis, run the following command in your project directory(not in same cmd/powershell where you started redis server):
    ```bash
    node index.js
- You should see a message indicating that the server is running:
    ```bash
    Server is running on http://localhost:3001


5. **Testing the API**: Use tools like Postman or cURL to test the API endpoint for sending SMS.

## Configuration

- Redis connection is managed in the `config/RedisConfig.js` file.
- Logging is handled in `middleware/Logging.js`, with logs stored in `logs.txt`.

## API Endpoints

- **POST /api/send-sms**: Sends an SMS to the provided phone number
    - **Request Body**:
        ```json
        {
            "phoneNumber": "string",
            "message": "string"
        }

    - **Response**:
        - Success: `{"message": "SMS sent to <phoneNumber>"}`
        - Error (Rate Limit Exceeded): `{"error": "Too many requests. Try again in 1 minute."}`

## Rate Limiting Rules

 - Maximum of 3 SMS requests per minute per client (IP + phone number).
 - Maximum of 10 SMS requests per day per client.

If limits are exceeded, a 429 Too Many Requests response is sent, including a Retry-After header.

## Logging

All API requests and rate limit violations are logged in `logs.txt` using the `middleware/Logging.js`. The log entries include:

 - Timestamp
 - Client IP address
 - Phone number
 - HTTP status code
 - Log message

 ## Usage

 After setting up and starting the server, you can use tools like Postman or cURL to test the API endpoint for sending SMS. Ensure Redis is running in the background.