import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

const apiPerson = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiPerson.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.error || "Communication error with the server";
    console.error(`Error in the API: ${errorMessage}`);
    return Promise.reject(errorMessage);
  }
);

export default apiPerson;