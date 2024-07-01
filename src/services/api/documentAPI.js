import axios from "axios";

const apiURLFetch = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const token =
  "f+DbjFvlxGF5QypP2huHk2OOJfr1FyeQ79p1tt3JCiIoH93GbnkwxF6S60yFQoZwYCzUwZVb-Lk9KvOx1EDnvhGs8MXNidUcPQw5+EclkXS1jSzvfVEfoyCiWb7+8ScBa4qjsdt6Loe9UxdLSsMXyKnFROFIMGxC";

const fetchService = async (serviceName, params) => {
  try {
    const requestBody = {
      token: token,
      params: params,
    };
    const response = await apiURLFetch.post(`/${serviceName}`, requestBody);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching service:",
      error.response?.data || error.message
    );
    return { error: error.response?.data || error.message };
  }
};

export default fetchService;
