const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");

app.use(cors());

app.use(express.json());

//app.use(morgan('tiny'));
morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  try {
    if (!persons || !Array.isArray(persons)) {
      return response.status(500).json({
        error: "Data source is not available",
      });
    }

    console.log(`GET /api/persons - Fetching ${persons.length} records`);

    return response.status(200).json({
      success: true,
      data: persons,
      total: persons.length,
    });
  } catch (error) {
    console.error("Error fetching persons:", error);
    return response.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/info", (request, response) => {
  try {
    if (!persons || !Array.isArray(persons)) {
      return response.status(500).send(`
          <h1>Error</h1>
          <p>Data source is not available</p>
        `);
    }

    const requestTime = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    });

    console.log(`GET /info - Request received at ${requestTime}`);

    return response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${requestTime}</p>
      `);
  } catch (error) {
    console.error("Error serving info page:", error);
    return response.status(500).send(`
      <h1>Error</h1>
      <p>Internal server error occurred</p>
    `);
  }
});

app.get("/api/persons/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return response.status(400).json({
        error: "Missing person id",
      });
    }

    const person = persons.find((person) => person.id === id);

    if (!person) {
      return res.status(404).json({
        error: "Person not found",
        requestedId: id,
      });
    }

    console.log(`GET /api/persons/${id} - Person found`);

    return res.json(person);
  } catch (error) {
    console.error("Error fetching person:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Missing person id",
      });
    }

    const personToDelete = persons.find((person) => person.id === id);
    if (!personToDelete) {
      console.log(`DELETE attempt - Person ${id} not found`);
      return res.status(404).json({
        error: "Person not found",
        requestedId: id,
      });
    }

    const initialLength = persons.length;
    persons = persons.filter((person) => person.id !== id);

    if (persons.length === initialLength) {
      console.error(`DELETE failed - Could not delete person ${id}`);
      return res.status(500).json({
        error: "Failed to delete person",
        requestedId: id,
      });
    }
    console.log({
      event: "person_deleted",
      personId: id,
      timestamp: new Date().toISOString(),
      remainingPersons: persons.length,
    });

    return res.status(204).end();
  } catch (error) {
    console.error("Error during person deletion:", {
      error: error.message,
      personId: req.params.id,
      stack: error.stack,
    });

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

const generateId = () => {
  const min = 1;
  const max = 9999999;

  let newId;
  do {
    newId = Math.floor(Math.random() * (max - min) + min).toString();
  } while (persons.some((p) => p.id === newId));

  return newId;
};

const validatePerson = (person) => {
  const { name, number } = person;

  if (!name) {
    throw new Error("name missing");
  }
  if (typeof name !== "string") {
    throw new Error("name must be text");
  }
  if (!number) {
    throw new Error("number missing");
  }
  if (typeof number !== "string") {
    throw new Error("number must be text");
  }
  if (persons.find((p) => p.number === number)) {
    throw new Error("number must be unique");
  }
  if (persons.find((p) => p.name === name)) {
    throw new Error("name must be unique");
  }
};

app.post("/api/persons", (req, res) => {
  try {
    const { name, number } = req.body;

    validatePerson({ name, number });

    const person = {
      name: name.trim(),
      number: number.trim(),
      id: generateId(),
    };

    persons = persons.concat(person);
    console.log({
      event: "person_created",
      personId: person.id,
      timestamp: new Date().toISOString(),
    });
    return res.status(201).json(person);
  } catch (error) {
    console.error("Error creating person:", {
      error: error.message,
      body: request.body,
      timestamp: new Date().toISOString(),
    });
    return res.status(500).json({
      error: "something went wrong",
    });
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express Server running at: http://localhost:${PORT}`);
});
