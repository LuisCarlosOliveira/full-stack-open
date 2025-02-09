const validatePersonUpdate = (personId, updateData) => {
    if (!personId) {
      throw new Error("Person ID is required");
    }
  
    if (!updateData || typeof updateData !== 'object') {
      throw new Error("Update data must be an object");
    }
  
    const { name, number } = updateData;
    if (!name && !number) {
      throw new Error("At least one field (name or number) must be provided");
    }
  };

  export default validatePersonUpdate; 