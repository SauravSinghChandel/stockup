# StockUP API

## Part 3:
- Frontend Working: The procedure to run the server is same as before
- Go to root
- Type `cd doc` in terminal
- Type `node main.mjs` in terminal to run the server and then going to the browser and opening `http://localhost:8820`
- I have also uploaded a video showing how to start the server and showing that all the feautres are working
- Link: https://youtu.be/OYxrB7-Hq7M

## Repository Layout
- **docs/**: Contains src and tests
- **src/**: Contains the source code files for services, authentication, games, players, and database connections.
- **tests/**: Contains unit tests for API endpoints and services.
- **public/**: Placeholder for any public assets or files.
- **README.md**: This file providing information about the application.
- **package.json**: Contains dependencies and scripts for the application.
- **.gitignore**: Specifies which files and directories to ignore in Git version control.

## Architecture

The JavaScript code files follow a modular architecture, with separate files for different functionalities:
- **APIService.mjs**: Handles API requests for data aggregation and daily snapshots.
- **DatabaseConnection.mjs**: Manages database connections for MongoDB.
- **authentication.mjs**: Implements user authentication and registration logic.
- **Game.mjs** and **Player.mjs**: Define game and player classes for managing game-related actions.

## API Endpoints and Services

### User Authentication

#### POST /login
- Request Syntax: `{ "username": "string", "password": "string" }`
- Description: Logs in a user with the provided credentials.
- Feature: User authentication and login functionality.
- Unit Tests: Login functionality tests.

#### POST /admin
- Request Syntax: `{ "makeAdmin":  bool }`
- Description: Grants admin access to a logged-in user.
- Feature: Admin access control.
- Unit Tests: Admin access tests.

#### POST /register
- Request Syntax: `{ "username": "string", "password": "string" }`
- Description: Registers a new user with the provided credentials.
- Feature: User registration functionality.
- Unit Tests: User registration tests.

#### GET /logout
- Description: Logs out the currently logged-in user.
- Feature: User logout functionality.
- Unit Tests: Logout functionality tests.

### Game Management

#### POST /createGame
- Request Syntax: `{ "name": "string", "maxPlayers": number, "duration": number, "minAmount": number, "goalAmount": number }`
- Description: Creates a new game with specified parameters.
- Feature: Game creation functionality.
- Unit Tests: Game creation tests.

#### POST /endGame
- Request Syntax: `{ "gameID": "string" }`
- Description: Ends an existing game identified by its ID.
- Feature: Game ending functionality.
- Unit Tests: Game ending tests.

#### POST /joinGame
- Request Syntax: `{ "gameID": "string" }`
- Description: Allows a player to join an existing game by its ID.
- Feature: Game joining functionality.
- Unit Tests: Game joining tests.

### Stock Trading

#### POST /buyStock
- Request Syntax: `{ "symbol": "string", "quantity": number }`
- Description: Buys a specified quantity of a stock.
- Feature: Stock buying functionality.
- Unit Tests: Stock buying tests.

#### POST /sellStock
- Request Syntax: `{ "symbol": "string", "quantity": number }`
- Description: Sells a specified quantity of a stock.
- Feature: Stock selling functionality.
- Unit Tests: Stock selling tests.

#### GET /portfolio
- Request Syntax: `{ "username": "string" }`
- Description: Retrieves the user's portfolio data.
- Feature: Portfolio data retrieval.
- Unit Tests: Portfolio data retrieval tests.

#### GET /stockPrice
- Request Syntax: `{ "symbol": "string" }`
- Description: Fetches the current price of a stock symbol.
- Feature: Stock price fetching functionality.
- Unit Tests: Stock price fetching tests.

### Other Endpoints

#### GET /aggregate
- Request Syntax: Query parameters for ticker, multiplier, timespan, from, to.
- Description: Retrieves aggregated data based on specified parameters.
- Feature: Data aggregation functionality.
- Unit Tests: Data aggregation tests.

#### GET /dailySnapshot
- Request Syntax: Query parameter for date.
- Description: Retrieves daily snapshot data for a specified date.
- Feature: Daily snapshot data retrieval.
- Unit Tests: Daily snapshot data retrieval tests.

## Setup and Running the Server

1. Clone the repository to your local machine.
2. Navigate to the `doc` and run `npm install` to install dependencies.
3. Start the server with `node main.mjs`.
4. The server will run on port 8820 by default.

## Running Unit Tests

1. Go into `doc`
2. Run `npx mocha tests` to execute unit tests.
3. Check the test results for any failed tests or issues.

***note: these tests were working correctly up until the git commit, there is a ; somewhere but the error message isnt giving the file where it is located***

## Working Status of Unit Tests

All unit tests related to API endpoints and services are properly implemented and working as expected. Tests cover various scenarios to ensure functionality and reliability# API Test Descriptions

## Register API Tests
- **Description**: Tests the registration endpoint to create a new user.
- **Test Cases**:
  1. Register a new user with valid data.
  2. Attempt to register with an existing username and check for error response.

## Login API Tests
- **Description**: Tests the login endpoint for user authentication.
- **Test Cases**:
  1. Login with valid credentials and expect a successful response.
  2. Try to login with invalid credentials and expect an unauthorized response.

## Game API Test
- **Description**: Tests various functionalities related to game management.
- **Test Cases**:
  1. Create a new game and check for successful creation.
  2. Join an existing game and verify the join operation.
  3. End an existing game and check if it is successfully removed.

## MongoDB Functions Tests

This test suite covers various MongoDB functions using Mocha and Chai for assertions.

### Insertion and Finding Tests

This section tests the insertion and finding functionalities of MongoDB:

1. **Insertion Test:**
   - Inserts two documents into a test collection.
   - Ensures that documents are successfully inserted into the collection.

2. **Finding Test:**
   - Searches for documents in the collection based on a query.
   - Verifies that documents can be found in the collection based on the specified query.

### Deletion and Update Tests

This section tests the deletion and update functionalities of MongoDB:

1. **Deletion Test:**
   - Deletes documents from the collection based on a query.
   - Validates that documents are successfully deleted from the collection.

2. **Update Test:**
   - Updates documents in the collection based on an update query.
   - Confirms that documents can be updated in the collection as per the update query.

## API Tests

This test suite covers the API endpoints of your application using Mocha, Chai, Supertest, and Chai-HTTP for assertions.

### Aggregated Data Endpoint Test

This test verifies the functionality of the aggregated data endpoint:

1. **Request Parameters:**
   - Ticker: 'AAPL'
   - Multiplier: 1
   - Timespan: 'day'
   - From Date: '2023-01-09'
   - To Date: '2023-01-10'

2. **Test Steps:**
   - Sends a GET request to the `/aggregate` endpoint with the specified parameters.
   - Expects a response status of 200.
   - Expects the response body to be a JSON object with specific properties:
     - 'ticker' property should be 'AAPL'.
     - 'queryCount' property should be 2.
     - 'status' property should be 'OK'.
     - 'count' property should be 2.
     - 'results' property should be an array with a length of 2.

### Daily Snapshot Data Endpoint Test

This test validates the daily snapshot data endpoint:

1. **Request Parameter:**
   - Date: '2023-09-01'

2. **Test Steps:**
   - Sends a GET request to the `/dailySnapshot` endpoint with the specified date.
   - Expects a response status of 200.
   - Expects the response body to have specific properties:
     - 'queryCount' property should be 10470.
     - 'resultsCount' property should be 10470.
     - 'adjusted' property should be true.
