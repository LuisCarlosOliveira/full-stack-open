const express = require("express");
const app = express();

app.use(express.json());

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
      return response.status(400).json({
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
      personId: request.params.id,
      stack: error.stack,
    });

    return response.status(500).json({
      error: "Internal server error",
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express Server running at: http://localhost:${PORT}`);
});
