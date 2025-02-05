import apiPerson from "../apis/apiPerson";

export const getAll = async () => {
  try {
    const response = await apiPerson.get("/persons");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    throw error;
  }
};
export const create = async (newPerson) => {
    try {
        const response = await apiPerson.post("/persons", newPerson); 
        return response.data;
    } catch (error) {
    console.error("Error creating person:", error);
    throw error;
    }
};

export const deletePerson = async (personIDToDelete) => {
  try {
    const response = await apiPerson.delete(`/persons/${personIDToDelete}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting person:", error);
    throw error;
  }
};