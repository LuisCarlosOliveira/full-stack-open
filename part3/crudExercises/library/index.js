const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

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

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name must be at least 1 character long"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [1, "Author must be at least 1 character long"],
      maxlength: [100, "Author must be less than 100 characters"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      trim: true,
      minlength: [10, "ISBN must be at least 10 character long"],
      maxlength: [13, "ISBN must be less than 13 characters"],
      match: [
        /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
        "Please enter a valid ISBN",
      ],
    },
    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: [0, "Published year must be at least 0"],
      max: [
        new Date().getFullYear(),
        `Published year must be no more than current year (${new Date().getFullYear()})`,
      ],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      minlength: [1, "Genre must be at least 1 character long"],
      maxlength: [50, "Genre must be less than 50 characters"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
    toJSON: {
      virtuals: true, // Include virtuals when converting to JSON
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true }, // Include virtuals when converting to objects
  }
);

//indexes for better search performance
bookSchema.index({ name: 1 });
bookSchema.index({ author: 1, name: 1 }); // Compound index for author + name queries
bookSchema.index({ isbn: 1 }, { unique: true }); // Unique index for ISBN

const Book = mongoose.model("Book", bookSchema);

// Middleware
app.use(cors());
app.use(express.static("dist"));
app.use(express.json({ limit: "10mb" }));

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid ID format",
    });
  }
  next();
};

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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

//Info Endpoint
app.get("/api/info", async (req, res) => {
  try {
    const bookCount = await Book.countDocuments();
    res.json({
      message: `Library has info for ${bookCount} ${
        bookCount === 1 ? "book" : "books"
      }`,
      timestamp: new Date().toISOString(),
      count: bookCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get info",
    });
  }
});

// POST /api/books - Create new book
app.post("/api/books", async (req, res) => {
  try {
    console.log("➕ Creating new book...");
    const { name, author, isbn, publishedYear, genre } = req.body;

    // Check if all required fields are present
    if (!name || !author || !isbn || !publishedYear || !genre) {
      return res.status(400).json({
        error:
          "All fields (name, author, isbn, publishedYear, genre) are required",
      });
    }

    const parsedYear = parseInt(publishedYear, 10);

    // Check if the parsing was successful
    if (isNaN(parsedYear)) {
      return res.status(400).json({
        error: "Published year must be a valid number",
      });
    }

    const trimmedIsbn = isbn.trim();

    //Check if book with same isbn already exists
    const existingBook = await Book.findOne({
      isbn: trimmedIsbn,
    });

    if (existingBook) {
      return res.status(409).json({
        error: "ISBN already exists in the library",
      });
    }

    const book = new Book({
      name: name.trim(),
      author: author.trim(),
      isbn: trimmedIsbn,
      publishedYear: parsedYear,
      genre: genre.trim(),
    });

    const savedBook = await book.save();
    console.log("✅ Book created successfully");

    res.status(201).json({
      success: true,
      data: savedBook,
      message: "Book created successfully",
    });
  } catch (error) {
    handleDatabaseError(error, res, "create book");
  }
});

// GET /api/books - Get all books
app.get("/api/books", async (req, res) => {
  try {
    console.log("📋 Getting all books...");
    const books = await Book.find({}).sort({ name: 1 });

    res.json({
      success: true,
      data: books,
      count: books.length,
      message:
        books.length === 0 ? "No books found" : `Found ${books.length} book(s)`,
    });
  } catch (error) {
    handleDatabaseError(error, res, "fetch books");
  }
});

//GET /api/book/:id - Get book by id - CORRIGIDO
app.get("/api/book/:id", validateObjectId, async (req, res) => {
  try {
    console.log(`📖 Getting book by ID: ${req.params.id}`);
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: `Book ${req.params.id} not found`,
      });
    }

    res.json({
      success: true,
      data: book,
      message: "Book found successfully"
    });
  } catch (error) { // CORRIGIDO: adicionado parâmetro 'error'
    handleDatabaseError(error, res, "fetch book");
  }
});

// PUT /api/book/:id - Update book - CORRIGIDO
app.put("/api/book/:id", validateObjectId, async (req, res) => {
  try {
    console.log(`✏️ Updating book: ${req.params.id}`);
    const { id } = req.params;
    const { name, author, isbn, publishedYear, genre } = req.body; // CORRIGIDO: 'name' em vez de 'title'

    // Build update object with only provided fields
    const updatedData = {};
    if (name && name.trim()) {
      updatedData.name = name.trim(); // CORRIGIDO: 'name' em vez de 'title'
    }
    if (author && author.trim()) {
      updatedData.author = author.trim();
    }
    if (publishedYear) {
      const parsedYear = parseInt(publishedYear, 10);
      if (isNaN(parsedYear)) {
        return res.status(400).json({
          success: false,
          error: "Published year must be a valid number",
        });
      }
      updatedData.publishedYear = parsedYear;
    }
    if (genre && genre.trim()) {
      updatedData.genre = genre.trim();
    }
    if (isbn && isbn.trim()) {
      updatedData.isbn = isbn.trim();
    }

    // Check for duplicate ISBN if ISBN is being updated
    if (updatedData.isbn) {
      const existingBook = await Book.findOne({
        isbn: updatedData.isbn,
        _id: { $ne: id }, // MongoDB query: find book where _id is NOT EQUAL to current id
      });

      if (existingBook) {
        return res.status(409).json({
          success: false,
          error: "ISBN already exists in the library",
        });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: "Book not found", // CORRIGIDO: "Book" em vez de "Person"
      });
    }
    console.log("✅ Book updated successfully");

    res.json({
      success: true,
      data: updatedBook,
      message: "Book updated successfully"
    });
  } catch (error) {
    handleDatabaseError(error, res, "update book");
  }
});

// DELETE /api/book/:id - Delete book
app.delete("/api/book/:id", validateObjectId, async (req, res) => {
  try {
    console.log(`🗑️ Deleting book: ${req.params.id}`);
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }
    console.log("✅ Book deleted successfully");
    res.status(204).end();
  } catch (error) {
    handleDatabaseError(error, res, "delete book");
  }
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Express Server running at: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📝 API Info: http://localhost:${PORT}/api/info`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

module.exports = app;