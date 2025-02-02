import apiPerson from '../apis/apiPerson';

const getAll = async () => {
    const response = await apiPerson.get("/persons"); 
    return response.data.data;
}

export default { 
    getAll
};