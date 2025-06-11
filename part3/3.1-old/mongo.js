const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide password as argument");
  console.log("Usage: node mongo.js <password> [name] [phone]");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://8190370:${password}@cluster0.3frrybm.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

const phoneNrSchema = new mongoose.Schema({
  name: String,
  phone: String,
});
const PhoneNr = mongoose.model("Phone", phoneNrSchema);

const closeConnection = () => {
  mongoose.connection.close();
};

async function runPhonebookApp() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(url);
    console.log("Connected to MongoDB successfully");
    
    if (process.argv.length === 3) {
      await listAllContacts();
      
    } else if (process.argv.length === 5) {
      await addNewContact(name, number);
      
    } else {
      console.log("Invalid number of arguments");
      console.log("Usage:");
      console.log("  node mongo.js <password> - to list all entries");
      console.log("  node mongo.js <password> <name> <phone> - to add new entry");
      process.exit(1);
    }
    
  } catch (error) {
    handleDatabaseError(error);
  } finally {
    closeConnection();
    console.log("Database connection closed");
  }
}

async function listAllContacts() {
  try {
    console.log("phonebook:");
    const contacts = await PhoneNr.find({});
    
    if (contacts.length === 0) {
      console.log("No contacts found in phonebook");
    } else {
      contacts.forEach((contact) => {
        console.log(`${contact.name} ${contact.phone}`);
      });
    }
    
  } catch (error) {
    console.log("Error fetching contacts from database:", error.message);
    throw error;
  }
}

async function addNewContact(name, number) {
  try {
    const phoneNr = new PhoneNr({
      name: name,
      phone: number,
    });
    
    await phoneNr.save();
    console.log(`added ${name} number ${number} to phonebook`);
    
  } catch (error) {
    console.log("Error saving contact to database:", error.message);
    throw error;
  }
}

function handleDatabaseError(error) {
  console.log("\n--- Database Error ---");
  
  if (error.name === 'MongoServerError' && error.code === 8000) {
    console.log("❌ Authentication failed!");
    console.log("Please check:");
    console.log("  - Is your password correct?");
    console.log("  - Is your database user configured properly?");
    console.log("  - Are your IP whitelist settings correct in MongoDB Atlas?");
    
  } else if (error.name === 'MongoNetworkError') {
    console.log("❌ Network connection failed!");
    console.log("Please check:");
    console.log("  - Is your internet connection working?");
    console.log("  - Is the MongoDB Atlas cluster running?");
    console.log("  - Are there any firewall restrictions?");
    
  } else if (error.name === 'MongoTimeoutError') {
    console.log("❌ Connection timeout!");
    console.log("The database is taking too long to respond.");
    console.log("Please try again in a few moments.");
    
  } else {
    console.log("❌ Unexpected database error:");
    console.log(`Error: ${error.message}`);
    console.log(`Type: ${error.name}`);
  }
  
  console.log("---------------------\n");
}

runPhonebookApp();