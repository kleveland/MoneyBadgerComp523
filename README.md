README:

Initial Setup Instructions

1.	Install nodejs. (https://nodejs.org/en/)

2.	Clone project into a working directory.

3.	Create a MySQL local server using MAMP or XAMP.

4.	Import SQL file (DataBaseImportFile.sql) from repo into phpMyAdmin in a DB to replicate our DB.

5.	Go to current working directory.

6.	Run the command “npm install” from the terminal to install all required dependencies.

7.	Configure pasDB settings on serv.js file. There is a config variable that needs to be set accordingly with values of the DB you just created. 

8.	You will be automatically logged in to an admin account. Please use the users in the users table from the DB to choose the account you want to use. To change to a particular account, keep a note of the PID of the user. Then in the application, in the models folder, open up dbuser.js using a text editor of your choice. Scroll to the bottom to the login function. Change the “req.headers.pid” variable to the value of the PID of the user you want to login to. This PID must be in the database for the application to run.

9.	Then run “node serv.js”. This will start the app. 

10.	Visit http://localhost:3000/ to access the app.
