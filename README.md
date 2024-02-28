# Movie Case Server Information 

The project has been deployed using DigitalOcean Web Application (The Dockerfile works in these services). Additionally, as a bonus task, GraphQL integration has been implemented in the project. Yarn is used as the package manager.

You can use https://king-prawn-app-7rgxo.ondigitalocean.app/swagger as the link for the remote server.

For local testing, use http://localhost:3000/swagger.

The key and other information are specified in the .env.example file.


# Movie Information API Documentation

This document provides a comprehensive guide to the Movie Information API, designed to fetch, persist, and manage movie data retrieved from The Movie Database (TMDB) and stored within a MongoDB database. The API is developed using Node.js and NestJS framework, providing RESTful endpoints alongside an optional GraphQL query interface.

To prevent access by code reviewers, token information has been shared in the .env.example file, but this is not a recommended practice. Additionally, if you work locally with your .env.local file, the configuration will be based on your local environment.

## Getting Started

### Prerequisites

- Node.js (version 12.x or higher recommended)
- MongoDB (version 4.x or higher)
- A valid TMDB API key

### Installation

First, clone the repository to your local machine:

```bash
git clone https://github.com/hllibrhm01/nestjs-movie-case.git
cd nestjs-movie-case
```

Install the project dependencies:

```bash
yarn install
```

### Configuration

Create a `.env` file in your project root directory and add the following configurations:

```env
TMDB_API_KEY=your_tmdb_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
PORT=3000
```

Replace `your_tmdb_api_key_here` with your TMDB API key and `your_mongodb_connection_string_here` with your MongoDB connection string.

### Running the application

To start the application, run:

```bash
yarn start
```

For development mode with hot reload, run:

```bash
yarn start:dev
```

The application will be accessible at `http://localhost:3000` by default.

## API Endpoints

The API provides the following RESTful endpoints:

### Fetch and Persist Movies

- **POST** `/movie

Fetches movies based on the specified criteria from TMDB and persists them in MongoDB. This endpoint does not require any input.

### Get Movie by ID

- **GET** `/movie/:id`

Retrieves a single movie by its UUID from the MongoDB database.

### Get All Movies

- **GET** `/movie`

Retrieves all movies from the MongoDB database.

### Delete Movie by ID

- **DELETE** `/movie/:id`

Deletes a single movie by its UUID from the MongoDB database.

## GraphQL Endpoint (Optional)

If GraphQL is configured, you can perform queries using the GraphQL endpoint:

### Find Movie by ID

Query:

```graphql
{
  findById(id: "movie_uuid_here") {
    id
    name
    overview
    popularity
    voteAverage
    voteCount
    releaseDate
    genres
  }
}
```

## Running Tests

To run the automated tests for the API, execute:

```bash
yarn test
```

## Deployment

The API can be deployed to a cloud service provider such as DigitalOcean. Ensure to provide the required environment variables during deployment.

---

### Notes

Remember to replace placeholder texts like `your_tmdb_api_key_here`, `your_mongodb_connection_string_here` with your actual data.
