# Pantry-Chef

# instructions 

0. ensure you have the following installed:
- node.js: https://nodejs.org/en
- eclipse IDE for backend
- vscode
- MySQL

1. clone repo! 

2. create database in mysql following the directions in the data folder
- in data/pantrychef_parser.py make sure global params are set correctly
- csv files found at: https://www.kaggle.com/datasets/irkaal/foodcom-recipes-and-reviews?resource=download
- put reviews.csv and recipes.csv in data/original_data folder
- run the parser
- put folders in upload folder specified by path in data/load_db or data/load_for_mac
- open up MySQL terminal, run "\. {setup_db.txt path}", then "\. {load.txt | load_for_mac.txt}"
- to get paths, right click on the files and copy path
- if no errors then you should be good

3. open up the front end folder in vscode terminal
- run these commands:
- (npm install)
- npm (run) build
- npm run dev
- copy link to browser (or ctrl-leftclick on windows)

4. open up the backend folder in eclipse
- go to "project/properties/java build path"
- ensure json.20230618.jar and mysql-connector-j-8.0.33.jar in Backend folder are properly added to path
- change the password to your mysql password in Config.java
- press the run button
- should see "Started Server at http://localhost:8000" in console

then it should all work together :)
just navigate back to the front end server in browser!!

