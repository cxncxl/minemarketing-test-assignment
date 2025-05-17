# NestJS Demo Project (Inventory Management API)

A test assignment for job application, shows off my NestJS skills as well
as lack of TypeORM skills

## Overview

The project is a CRUD application for inventory management

It exposes a REST API endpoints for Product, Category and Stock Update entities
(see [related section](#data-models))

## Dependencies

The app is built with [NestJS](https://nestjs.com) and [TypeORM](https://typeorm.io) libraries

Docker and Docker Compose are used for serving the application

## Setup

In order to get the app running, clone the repository, run `npm run install`
for installing dependencies, create .env file with the following variables:

- DB_HOST - IP address or domain name of server running Postgres database
- DB_PORT - Port number on which the DB service is listening connections
- POSTGRES_USER - Username for authorizing in the DB
- POSTGRES_PASSWORD - Password for DB authorization
- POSTGRES_DB - Name of the database in Postgres to use by the app

Example:
```
DB_HOST=127.0.0.1 # hosting DB on the same machine as the app
DB_PORT=5432 # default Postgres port
POSTGRES_USER=db-user-username
POSTGRES_PASSWORD=verystrongpassword
POSTGRES_DB=inventory
```
migration/migrations directory contains configuration for creating tables and
relationships in the db. In order to commit the schema execute

```
npm run typeorm migration:run -- -d migration/datasource.ts
```
And finally run the app using

`npm run start`

## Setup (docker)

Alternatively, run `docker compose up` in the root of the repository, this will
build and spin up Docker containers for both DB and the app, install dependencies
and setup database schema

## Usage

By default the app is listening on port 3000. Swager API documentation and playground
is available at `/swag` (e.g., http://localhost:3000/swag)

The API consists of the following endpoints:

### Category

#### GET /category

**Get list of categories**

##### Query parameters:
`page`, `limit` -- define pagination. `limit` defines how many
records to take per page

*(all query parameters are optional)*

##### Response body:
```
{
    "categories": [
        {
            "id": "c1002611-6075-4ba3-8a19-91783155322c",
            "name": "Laptop",
            "createdAt": "2025-04-31T12:00:00Z",
            "updatedAt": null,
            "products": []
        },
        {
            "id": "ce7c8108-a7be-4822-9a19-8d23e27462b0",
            "name": "USB Drive",
            "createdAt": "2025-04-30T17:00:00Z",
            "updatedAt": "2025-04-31T13:10:00Z",
            "products": []
        }
    ],
    "pagination": {
        "nextPage": 2
    }
}
```
Categories field contains list of Category models,
Pagination field contains Pagination data

#### POST /category

**Create a new category**

##### Request body:

```
{
    "name": string
}
```
`name` must be not empty string

##### Resonse body:

```
{
    "category": {
        "id": "ce7c8108-a7be-4822-9a19-8d23e27462b0",
        "name": "USB Drive",
        "createdAt": "2025-04-30T17:00:00Z",
        "updatedAt": null,
        "products": []
    }
}
```

`category` contains Category model for the inserted row

Can return 400 (Bad Request) error if provided data is invalid
Can return 429 (Conflict) error if category with given name already exists

### Product

#### GET /product

**Get list of products**

##### Query parameters:
`page`, `limit` -- pagination, `categoryId` -- get only products
from specified category, `minStock` and `maxStock` -- filter products by stock,
`minPrice` and `maxPrice` -- filter products by price

*(all query parameters are optional)*

##### Response body:

```
{
    "products": [
        {
            "id": "244d5bed-89ae-462e-bac1-6cba7f583089",
            "name": "MacBook Air",
            "sku": "macbook-air-123",
            "category": {
                "id": "c1002611-6075-4ba3-8a19-91783155322c",
                "name": "Laptop"
            },
            "stock": 10,
            "price": 1000.00,
            "createdAt": "2025-04-31T12:00:01Z",
            "updatedAt": "2025-04-31T13:00:00Z"
        }
    ],
    "pagintation": {
        "nextPage": 5
    }
}
```
`products` -- list of Product models
`pagination` -- pagination data

Can return 400 (Bad request) if provided filters are invalid

#### POST /product

**Create a new product**

##### Request body:

```
{
    "name": string,
    "sku": string,
    "categoryId": string,
    "stock": int,
    "price": double
}
```
*(all fields are mandatory)*

##### Response body:

```
{
    "product": {
        "id": "9e6492e9-6806-4ef5-951b-dd57b7cd8c46",
        "name": "USB Drive 128G",
        "sku": "usb-128",
        "category": {
            "id": "ce7c8108-a7be-4822-9a19-8d23e27462b0",
            "name": "USB Drive",
        }
        "stock": 43,
        "price": 15.00,
        "createdAt": "2025-04-31T12:00:01Z",
        "updatedAt": "2025-04-31T13:00:00Z"
    },
}
```

`product` is Product model of the created row

Can return 400 (Bad request) error if provided values are invalid
Can return 404 (Not found) error if provided `categoryId` is unknown
Can return 429 (Conflict) error if product with given `sku` already exists

#### PUT /product/:id

**Update a product**

##### URL Parameters:
`id` -- product's id

##### Request body:

```
{
    "name": string,
    "stock": int,
    "price": double
}
```

*(`id` is mandatory, at least one body field must be specified)*

##### Response body:

```
{
    "product": {
        "id": "244d5bed-89ae-462e-bac1-6cba7f583089",
        "name": "MacBook Air",
        "sku": "macbook-air-123",
        "category": {
            "id": "c1002611-6075-4ba3-8a19-91783155322c",
            "name": "Laptop"
        },
        "stock": 10,
        "price": 1000.00,
        "createdAt": "2025-04-31T12:00:01Z",
        "updatedAt": "2025-04-31T13:00:00Z"
    },
}
```

`product` contains updated Product model

Can return 400 (Bad request) error if given body fields are invalid
Can return 404 (Not found) error if product with given id does not exist

#### DELETE /product/:id

**Delete product**

##### URL Parameters:
`id` -- product's id

##### Response body:

```
{
    "status": "ok"
}
```

Can return 400 (Bad request) error if given id is in wrong format
Can return 404 (Not found) error if product with given id does not exist

### Stock Updates

#### GET /stock

**Get history of stock updates**

##### Query params:
`page`, `limit` -- pagination, `date` -- date in ISO format (YYYY-MM-dd)
on which the updates happened, `hour` -- hour in military time (0-24) during which update
happened, `categoryId` -- only get updates for products in specified category

##### Response body:

```
{
    "updates": {
        "244d5bed-89ae-462e-bac1-6cba7f583089": {
            "totalUpdates": 3,
            "updateHistory": [
                {
                    "from": 10,
                    "to": 15,
                    "at": "2025-04-31T13:00:00Z",
                    "productId": "244d5bed-89ae-462e-bac1-6cba7f583089"
                },
                {
                    "from": 15,
                    "to": 5,
                    "at": "2025-04-31T19:00:00Z",
                    "productId": "244d5bed-89ae-462e-bac1-6cba7f583089"
                },
                {
                    "from": 5,
                    "to": 12,
                    "at": "2025-05-01T01:00:00Z",
                    "productId": "244d5bed-89ae-462e-bac1-6cba7f583089"
                }
            ]
        }
    },
    "pagination": {
        "nextPage": 2
    }
}
```
`updates` contains Stock Updates models grouped by Category ID
`pagination` contains pagination data

## Data models

### Category

- `id`: string, uuid,
- `name`: string,
- `createdAt` - datetime,
- `updatedAt` - datetime, nullable,
- `products` - Product[], nullable,

Example:
```
{
    "id": "c1002611-6075-4ba3-8a19-91783155322c",
    "name": "Laptop",
    "createdAt": "2025-04-31T12:00:00Z",
    "updatedAt": null,
    "products": []
}
```

### Product

- `id`: string, uuid,
- `name`: string,
- `sku`: string,
- `category`: Category,
- `stock`: int,
- `price`: double,
- `createdAt`: datetime,
- `updatedAt`: datetime, nullable,

Example:

```
{
    "id": "244d5bed-89ae-462e-bac1-6cba7f583089",
    "name": "MacBook Air",
    "sku": "macbook-air-123",
    "category": {
        "id": "c1002611-6075-4ba3-8a19-91783155322c",
        "name": "Laptop"
    },
    "stock": 10,
    "price": 1000.00,
    "createdAt": "2025-04-31T12:00:01Z",
    "updatedAt": "2025-04-31T13:00:00Z"
}
```

### Stock update

- `totalUpdates`: total updates done in given category during selected time
- `updateHistory`: array of Stock Update Event

### Stock Update Event

- `from`: int, old stock value,
- `to`: int, new stock value,
- `at`: datetime, when update was done,
- `productId`: string, uuid, id of the updated product

Example:

```
{
    "from": 10,
    "to": 15,
    "at": "2025-04-31T13:00:00Z",
    "productId": "244d5bed-89ae-462e-bac1-6cba7f583089"
}
```

## Cron job

A cron job is defined in API service. Each 6 hours it founds products with
stock less than 10, it updates their stock with random value between 5 and 20
On each run it logs how many products are going to be updated in stdout, as well
as errors if any pop up
