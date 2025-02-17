import personApi from "../apis/personApi";
import { validatePersonUpdate  } from "../validators/personUpdate";

export const getAll = async () => {
  try {
    const response = await personApi.get("/persons");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    throw error;
  }
};

export const create = async (newPerson) => {
  try {
    if (!newPerson?.name || !newPerson?.number) {
      throw new Error("Name and number are required");
    }

    const response = await personApi.post("/persons", newPerson);
    return response.data;
  } catch (error) {
    console.error("Error creating person:", error);
    throw error;
  }
};

export const deletePerson = async (personIDToDelete) => {
  try {
    if (!personIDToDelete) {
      throw new Error("Person ID is required");
    }

    const response = await personApi.delete(`/persons/${personIDToDelete}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting person:", error);
    throw error;
  }
};

export const getPerson = async (personIDToGet) => {
  try{
    if(!personIDToGet) {
      throw new Error("Person ID is required");
    }

    const response = await personApi.get(`/persons/${personIDToGet}`);
    return response.data; 
  }catch (error){
    console.error("Error getting person:", error);
    throw error;
  }
};

export const updatePerson = async (personIDToUpdate, newObject) => {
  try {
    validatePersonUpdate(personIDToUpdate, newObject);

    const updateData = {
      ...(newObject.name?.trim() && { name: newObject.name.trim() }),
      ...(newObject.number?.trim() && { number: newObject.number.trim() })
    };

    const response = await personApi.put(
      `/persons/${personIDToUpdate}`, 
      updateData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating person:", {
      id: personIDToUpdate,
      data: newObject,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
};
