# Installation

## Requirements

* Yarn - Setup yarn from [here](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

* Node - Setup Node from [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Backend:
* Install packages required.

    ```
    cd backend
    npm install
    ```
* Check for MySQL
    ```
    which mysqld
    ```
    If it shows the path then continue otherwise install MySQL.
* Setup config/dbConfig.json file with the user and password of your MySQL.

* Create Database
    ```
    sh ./db.sh
    ```

## Frontend
* Install packages required.
    ```
    cd frontend
    npm install
    yarn install
    ```

## How to Run
* In terminal 1
```
cd backend
npx nodemon app.js
```
* In terminal 2
```
cd frontend
npm start
```
<strong>Note</strong> : We consider you are at the root folder of the app in both the terminals.


## Code Standardization

Camel Case => helloHowAreYou.

SnakeCase => hello_how_are_you.


FileNames: Snake Case

JavaScript Code: Camel Case

JSONs: Snake Case

Tables & Columns: Snake Case

CSS: Snake Case

API Paths: Snake Case
