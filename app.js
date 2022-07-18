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
  const dbUser = await db.get(userCheck);
  if (dbUser === undefined) {
    const createNewUser = `insert into user username,name,password,gender,location values(${username},${name},${hashedPassword},${gender},${location};`;
    await db.run(createNewUser);
    response.status(200);
    response.send("User created successfully");
  }
});
