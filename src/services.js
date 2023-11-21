import axios from "axios";

const API_BASE_URL =
  "https://65563eab84b36e3a431f6f45.mockapi.io/taskpin-jobs/jobs";

export const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postJob = async (jobApplication) => {
  try {
    await axios.post(`${API_BASE_URL}`, jobApplication);
    return true;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateJob = async (id, jobApplication) => {
  try {
    await axios.put(`${API_BASE_URL}/${id}`, jobApplication);
    return true;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
