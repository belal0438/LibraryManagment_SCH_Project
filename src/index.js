require("dotenv").config({ path: "./.env" });

const { error } = require("console");
const { connectDB } = require("./db/index");
const { app } = require("./App");

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error Event For App !!", error);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at Port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed !!", error);
  });
