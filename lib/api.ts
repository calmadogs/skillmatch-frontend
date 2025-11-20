  import axios from "axios";

  export const api = axios.create({
    baseURL: "http://localhost:3000", // ajuste se seu backend estiver em outra porta/host
  });

  export const registerUser = async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  };

  export default api;
