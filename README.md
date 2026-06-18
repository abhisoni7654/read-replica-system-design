# PostgreSQL Primary-Replica Architecture with Read/Write Splitting

A simple demonstration of PostgreSQL replication and read/write separation using Node.js, Express, and PostgreSQL.

## Overview

This project simulates a common database architecture used in large-scale applications. 

* All write operations are sent to the primary database.
* All read operations are served from the replica database.
* If the replica is unavailable, reads automatically fall back to the primary database.

The goal of this project is to understand database replication and how read replicas help scale read-heavy workloads.

## Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **pg** (node-postgres)

## Architecture

```text
                Client
                  |
                  |
             Express API
             /         \
            /           \
      Write Requests   Read Requests
           |               |
           v               v
     Primary Database ---> Replica Database
                           ^
                           |
                      Replication
```

## Features

* Read/write separation
* PostgreSQL primary-replica setup
* Automatic replication
* Parameterized SQL queries
* Replica-to-primary fallback mechanism
* REST API endpoints
* Error handling

## API Endpoints

### Create Student

**POST** `/`

**Request Body:**
```json
{
    "roll_no": 1,
    "name": "John Doe",
    "class": "10",
    "father": "Robert Doe",
    "mother": "Jane Doe"
}
```

**Response:**
```json
{
    "message": "Student inserted successfully"
}
```

### Get Student

**GET** `/:roll`

**Example Request:**
```http
GET /1
```

**Response:**
```json
{
    "roll_no": 1,
    "name": "John Doe",
    "class": "10",
    "father_name": "Robert Doe",
    "mother_name": "Jane Doe"
}
```

## Replication Flow

1. A client sends a write request.
2. The API writes data to the primary PostgreSQL instance.
3. PostgreSQL replication propagates the changes to the replica.
4. Read requests are served from the replica.
5. If the replica is unavailable, the API falls back to the primary database.

## Project Structure

```text
.
├── server.js
├── package.json
└── README.md
```

## Running the Project

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
node server.js
```

3. **Server URL:**
```text
http://localhost:3000
```

## Learning Objectives

This project was built to understand:
* Database replication
* Read scaling
* Read/write splitting
* Fault tolerance using fallback reads
* High-level database architecture used in production systems

