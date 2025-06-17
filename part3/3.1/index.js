const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Database Connection
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(url);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Person Schema - matches frontend expectations
const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name must be at least 1 character long"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    number: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      minlength: [1, "Phone number must be at least 1 character long"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add indexes for better search performance
personSchema.index({ name: 1 });
personSchema.index({ number: 1 });

const Person = mongoose.model("Person", personSchema);

// Middleware
app.use(cors());
app.use(express.static("dist"));
app.use(express.json({ limit: "10mb" }));

// Custom Morgan logging
morgan.token("body", (req) => {
  return req.method === "POST" || req.method === "PUT"
    ? JSON.stringify(req.body)
    : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Validation Middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid ID format",
    });
  }
  next();
};

const validatePersonData = (req, res, next) => {
  const { name, number } = req.body;

  if (req.method === "POST") {
    // For creation, both fields are required
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "name missing" });
    }
    if (!number || !number.trim()) {
      return res.status(400).json({ error: "number missing" });
    }
  } else if (req.method === "PUT") {
    // For updates, at least one field is required
    if ((!name || !name.trim()) && (!number || !number.trim())) {
      return res.status(400).json({
        error: "At least one field (name or number) must be provided",
      });
    }
  }

  next();
};

// Error handling utility
const handleDatabaseError = (error, res, operation = "operation") => {
  console.error(`Database error during ${operation}:`, error);

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      error: messages.join(", "),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      error: "Invalid data format",
    });
  }

  res.status(500).json({
    error: `Failed to ${operation}`,
  });
};

// ROUTES - ORDEM MUITO IMPORTANTE!
// Rotas específicas devem vir ANTES de rotas com parâmetros

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Info endpoint
app.get("/api/info", async (req, res) => {
  try {
    const personCount = await Person.countDocuments();
    res.json({
      message: `Phonebook has info for ${personCount} ${
        personCount === 1 ? "person" : "people"
      }`,
      timestamp: new Date().toISOString(),
      count: personCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get info",
    });
  }
});

// GET /api/persons - Get all persons
app.get("/api/persons", async (req, res) => {
  try {
    console.log("📋 Getting all persons...");
    const persons = await Person.find({}).sort({ name: 1 });

    // Frontend expects response.data.data structure
    res.json({
      data: persons,
      count: persons.length,
    });
  } catch (error) {
    handleDatabaseError(error, res, "fetch persons");
  }
});

// GET /api/persons/search - Search persons
// IMPORTANTE: Esta rota DEVE vir ANTES da rota /:id
app.get("/api/persons/search", async (req, res) => {
  try {
    console.log("\n🔍 =========================");
    console.log("🔍 SEARCH REQUEST RECEIVED");
    console.log("🔍 =========================");

    // Debug completo dos parâmetros
    console.log("📥 Raw req.query:", JSON.stringify(req.query, null, 2));
    console.log("📥 req.url:", req.url);

    const { id, name, number } = req.query;

    console.log("📋 Individual parameters:");
    console.log(`  🆔 id: "${id}" (type: ${typeof id})`);
    console.log(`  👤 name: "${name}" (type: ${typeof name})`);
    console.log(`  📞 number: "${number}" (type: ${typeof number})`);

    // Validate that at least one search parameter is provided
    if (!id && !name && !number) {
      console.log("❌ No search parameters provided");
      return res.status(400).json({
        error:
          "At least one search parameter (id, name, or number) is required",
      });
    }

    let query = {};

    // Search by ID (exact match)
    if (id) {
      console.log("🆔 Processing ID search...");
      const cleanId = id.trim();

      if (cleanId.length !== 24) {
        console.log(`❌ ID length invalid: ${cleanId.length}`);
        return res.status(400).json({
          error: `Invalid ID format: ID must be 24 characters long. Received: "${cleanId}" (${cleanId.length} characters)`,
        });
      }

      const hexRegex = /^[0-9a-fA-F]{24}$/;
      if (!hexRegex.test(cleanId)) {
        console.log(`❌ ID contains invalid characters: "${cleanId}"`);
        return res.status(400).json({
          error: `Invalid ID format: ID must contain only hexadecimal characters. Received: "${cleanId}"`,
        });
      }

      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        console.log(`❌ Mongoose validation failed: "${cleanId}"`);
        return res.status(400).json({
          error: `Invalid ObjectId format: "${cleanId}"`,
        });
      }

      try {
        query._id = new mongoose.Types.ObjectId(cleanId);
        console.log("✅ ID query created:", query._id);
      } catch (objectIdError) {
        console.log(`❌ ObjectId creation failed: ${objectIdError.message}`);
        return res.status(400).json({
          error: `Failed to create ObjectId from: "${cleanId}". Error: ${objectIdError.message}`,
        });
      }
    }

    // Search by name (case-insensitive partial match)
    if (name) {
      console.log("👤 Processing NAME search...");
      const cleanName = name.trim();

      if (cleanName.length === 0) {
        console.log("❌ Name is empty");
        return res.status(400).json({
          error: "Name search parameter cannot be empty",
        });
      }

      query.name = {
        $regex: cleanName,
        $options: "i",
      };
      console.log("✅ Name query created:", query.name);
    }

    // Search by number (exact match)
    if (number) {
      console.log("📞 Processing NUMBER search...");
      const cleanNumber = number.trim();

      if (cleanNumber.length === 0) {
        console.log("❌ Number is empty");
        return res.status(400).json({
          error: "Number search parameter cannot be empty",
        });
      }

      query.number = cleanNumber;
      console.log("✅ Number query created:", query.number);
    }

    console.log("🗄️ Final MongoDB query:", JSON.stringify(query, null, 2));

    const persons = await Person.find(query).sort({ name: 1 });
    console.log(`📊 Found ${persons.length} person(s)`);

    if (persons.length === 0) {
      console.log("❌ No persons found matching criteria");
      return res.status(404).json({
        error: "No persons found matching the search criteria",
      });
    }

    // Return single person for ID search, array for other searches
    const result = id && persons.length === 1 ? persons[0] : persons;
    console.log("✅ Search successful, returning result");
    console.log("🔍 =========================\n");

    res.json(result);
  } catch (error) {
    console.log("💥 Search error:", error);
    handleDatabaseError(error, res, "search persons");
  }
});

// GET /api/persons/:id - Get single person by ID
// IMPORTANTE: Esta rota DEVE vir DEPOIS da rota /search
app.get("/api/persons/:id", validateObjectId, async (req, res) => {
  try {
    console.log(`🆔 Getting person by ID: ${req.params.id}`);
    const { id } = req.params;
    const person = await Person.findById(id);

    if (!person) {
      return res.status(404).json({
        error: "Person not found",
      });
    }

    // Frontend expects person object directly in response.data
    res.json(person);
  } catch (error) {
    handleDatabaseError(error, res, "fetch person");
  }
});

// POST /api/persons - Create new person
app.post("/api/persons", validatePersonData, async (req, res) => {
  try {
    console.log("➕ Creating new person...");
    const { name, number } = req.body;

    // Check if person with same number already exists
    const existingPerson = await Person.findOne({
      number: number.trim(),
    });

    if (existingPerson) {
      return res.status(400).json({
        error: "Phone number already exists in the phonebook",
      });
    }

    const person = new Person({
      name: name.trim(),
      number: number.trim(),
    });

    const savedPerson = await person.save();
    console.log("✅ Person created successfully");

    // Frontend expects the person object directly
    res.status(201).json(savedPerson);
  } catch (error) {
    handleDatabaseError(error, res, "create person");
  }
});

// PUT /api/persons/:id - Update person
app.put(
  "/api/persons/:id",
  validateObjectId,
  validatePersonData,
  async (req, res) => {
    try {
      console.log(`✏️ Updating person: ${req.params.id}`);
      const { id } = req.params;
      const { name, number } = req.body;

      // Build update object with only provided fields
      const updateData = {};
      if (name && name.trim()) {
        updateData.name = name.trim();
      }
      if (number && number.trim()) {
        updateData.number = number.trim();
      }

      // If updating number, check for duplicates (excluding current person)
      if (updateData.number) {
        const existingPerson = await Person.findOne({
          number: updateData.number,
          _id: { $ne: id },
        });

        if (existingPerson) {
          return res.status(400).json({
            error: "Phone number already exists in the phonebook",
          });
        }
      }

      const updatedPerson = await Person.findByIdAndUpdate(id, updateData, {
        new: true, // Return updated document
        runValidators: true, // Run schema validations
      });

      if (!updatedPerson) {
        return res.status(404).json({
          error: "Person not found",
        });
      }

      console.log("✅ Person updated successfully");
      // Frontend expects the updated person object directly
      res.json(updatedPerson);
    } catch (error) {
      handleDatabaseError(error, res, "update person");
    }
  }
);

// DELETE /api/persons/:id - Delete person
app.delete("/api/persons/:id", validateObjectId, async (req, res) => {
  try {
    console.log(`🗑️ Deleting person: ${req.params.id}`);
    const { id } = req.params;

    const deletedPerson = await Person.findByIdAndDelete(id);

    if (!deletedPerson) {
      return res.status(404).json({
        error: "Person not found",
      });
    }

    console.log("✅ Person deleted successfully");
    // Frontend expects no content for successful deletion
    res.status(204).end();
  } catch (error) {
    handleDatabaseError(error, res, "delete person");
  }
});

// 404 handler for unknown endpoints
const unknownEndpoint = (req, res) => {
  console.log(`❓ Unknown endpoint: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Unknown endpoint",
    path: req.path,
    method: req.method,
  });
};

app.use(unknownEndpoint);

// Global error handler
app.use((error, req, res, next) => {
  console.error("💥 Unhandled error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("📦 Database connection closed");
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Express Server running at: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📝 API Info: http://localhost:${PORT}/api/info`);
    console.log("\n📋 Available routes:");
    console.log("  GET    /api/persons           - Get all persons");
    console.log("  GET    /api/persons/search    - Search persons");
    console.log("  GET    /api/persons/:id       - Get person by ID");
    console.log("  POST   /api/persons           - Create new person");
    console.log("  PUT    /api/persons/:id       - Update person");
    console.log("  DELETE /api/persons/:id       - Delete person");
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

module.exports = app;
