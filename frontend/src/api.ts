import axios from "axios";

const API = axios.create({
  baseURL: "https://weather-insights-dolw.onrender.com/api/weather", 
//   baseURL: "http://127.0.0.1:8000/api/weather", 
});

export default API;