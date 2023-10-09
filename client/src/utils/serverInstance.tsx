import axios from "axios";

const ServerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://codeverse-8hie.onrender.com",
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  }
});



export default ServerApi;
