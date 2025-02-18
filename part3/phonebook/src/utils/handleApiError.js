export const handleApiError = (error, defaultMessage = "Internal server error") => {
  if (error.response) {
    const serverError = error.response.data.error;
    switch (error.response.status) {
      case 400:
        throw new Error(serverError || "Bad request");
      case 404:
        throw new Error(serverError || "Not found");
      default:
        throw new Error(serverError || defaultMessage);
    }
  }
  throw new Error(defaultMessage);
};

export default handleApiError;