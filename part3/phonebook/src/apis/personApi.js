import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

const personApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

personApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.error || "Communication error with the server";
    console.error(`Error in the API: ${errorMessage}`);
    return Promise.reject(error);
  }
);

export default personApi;