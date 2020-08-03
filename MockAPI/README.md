# mockAPI API Express server on NodeJS to interface with dropdown bar react application
This server utilizes locations.json file as a reference for list of locations for the dropdown bar

## Project files
app.js in src folder

## Methods

GET('/'): returns a JSON string of array of countries to be parsed by the dropdown bar
POST('/addEntry'): updates the local JSON file with the updated entry added in the dropdown bar application

## run instructions
node src/app.js from the terminal in the project folder