README:

Initial Setup Instructions

1.	Install nodejs. (https://nodejs.org/en/)

2.	Clone project into working directory.

3.	Create a mySQL local server using MAMP or XAMP.

4.	Import SQL file from repo into phpMyAdmin in a DB to replicate our DB.

5.	Go back to working directory with cloned project.

6.	Run the command “npm install” from the terminal to install all required dependencies.

7.	Configer DB settings on serv.js file. There is a config variable that needs to be set accordingly with values of the DB you just created. 

8.	You will be automatically logged in to an admin account. Please use the accounts in the users table in the DB to choose the account you want to use. To change to a particular account, keep a note of the PID. On the application, in the models folder open up dbuser.js using a text editor of your choice. Scroll to the bottom where the login function exists. Change the “req.headers.pid” variable to the value of the PID of the account you want to login to.

9.	Then run “node serv.js”. This will start the app. 

10.	Visit http://localhost:3000/ to access the app.
