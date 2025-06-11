const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;

async function connectToDatabase() {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
}
connectToDatabase();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find({});
    res.json({ data: persons });
  } catch (error) {
    console.error("Error fetching persons:", error);
    res.status(500).json({ error: "Failed to fetch persons" });
  }
});

app.post("/api/persons", async (req, res) => {
  try {
    const { name, number } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name missing" });
    }
    if (!number) {
      return res.status(400).json({ error: "number missing" });
    }

    const person = new Person({
      name: name.trim(),
      number: number.trim(),
    });

    const savedPerson = await person.save();
    res.json(savedPerson);
  } catch (error) {
    console.error("Error creating person:", error);
    res.status(500).json({ error: "Failed to create person" });
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint!" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express Server running at: http://localhost:${PORT}`);
});
