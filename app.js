const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "userData.db");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");

let db = null;
const initializationDataBaseAndServer = async () => {
  try {
    dp = open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running...");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};
initializationDataBaseAndServer();

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userCheck = `select * from user where username = ${username}`;
  const dbUser = await db.all(userCheck);
  if (dbUser === undefined) {
    const createNewUser = `insert into user username,name,password,gender,location values(${username},${name},${hashedPassword},${gender},${location};`;
    await db.run(createNewUser);
    response.status(200);
    response.send("User created successfully");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const userInQuery = `select * from user where username=${username};`;
  const dbUser = await db.all(userInQuery);

  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const passwordCompare = await bcrypt.hash(password, dbUser.password);
    if (passwordCompare) {
      response.status(200);
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const changePassword = `select * from user where username=${username};`;
  const dbUser = await db.all(changePassword);
  const comparePassword = await bcrypt.compare(oldPassword, dbUser.password);
  if (comparePassword) {
    if (oldPassword.length >= 5) {
      const password = await bcrypt.hash(newPassword, 10);
      const updatePassword = `update user set password=${password};`;
      const dbUser = await db.run(updatePassword);
      response.status(200);
      response.send("Password updated");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("Invalid current password");
  }
});

module.exports = app;
