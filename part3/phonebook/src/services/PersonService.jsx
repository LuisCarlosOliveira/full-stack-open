import apiPerson from '../apis/apiPerson';

export const getAll = async () => {
    try {
      const response = await apiPerson.get("/persons");
      return response.data.data; 
    } catch (error) {
      console.error("Error fetching persons:", error);
      throw error; 
    }
  };