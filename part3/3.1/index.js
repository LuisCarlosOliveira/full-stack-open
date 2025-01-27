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
      const requestTime = new Date();
      return response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${requestTime}</p>
      `);
    } catch (error) {
      console.error('Error in info route:', error);
      return response.status(500).send('Internal Server Error');
    }
  });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express Server running at: http://localhost:${PORT}`);
});
