import personApi from "../apis/personApi";
import validatePersonUpdate from "../validators/personUpdate";
import { handleApiError } from "../utils/handleApiError";

const PersonService = {
  getAll: async () => {
    try {
      const response = await personApi.get("/persons");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching persons:", error);
      throw handleApiError(error, "Failed to fetch persons");
    }
  },
  
  create: async (newPerson) => {
    try {
      if (!newPerson?.name) {
        throw new Error("name missing");
      }
      if (!newPerson?.number) {
        throw new Error("number missing");
      }
      
      const response = await personApi.post("/persons", {
        name: newPerson.name.trim(),
        number: newPerson.number.trim()
      });
      
      return response.data;
    } catch (error) {
      console.error("Error creating person:", error);
      throw handleApiError(error, "Failed to create person");
    }
  },
  
  delete: async (personId) => {
    try {
      if (!personId) {
        throw new Error("Missing person id");
      }
      
      await personApi.delete(`/persons/${personId}`);
    } catch (error) {
      console.error("Error deleting person:", error);
      throw handleApiError(error, "Failed to delete person");
    }
  },
  
  getById: async (personId) => {
    try {
      if (!personId) {
        throw new Error("Missing person id");
      }
      
      const response = await personApi.get(`/persons/${personId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching person:", error);
      throw handleApiError(error, "Failed to fetch person");
    }
  },
  
  searchPerson: async (searchParams) => {
    try {
      if (!searchParams) {
        throw new Error("Missing parameters");
      }
      
      const { id, name, number } = searchParams;
      const params = new URLSearchParams();
      
      if (id) params.append('id', id);
      if (name) params.append('name', name);
      if (number) params.append('number', number);
      
      const response = await personApi.get(`/persons/search?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error searching person:", error);
      throw handleApiError(error, "Failed to search for person");
    }
  },
  
  update: async (personId, updateData) => {
    try {
      validatePersonUpdate(personId, updateData);
      
      const trimmedData = {
        ...(updateData.name?.trim() && { name: updateData.name.trim() }),
        ...(updateData.number?.trim() && { number: updateData.number.trim() })
      };
      
      if (Object.keys(trimmedData).length === 0) {
        throw new Error("At least one field (name or number) must be provided");
      }
      
      const response = await personApi.put(`/persons/${personId}`, trimmedData);
      return response.data;
    } catch (error) {
      console.error("Error updating person:", {
        id: personId,
        data: updateData,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw handleApiError(error, "Failed to update person");
    }
  }
};

export default PersonService;