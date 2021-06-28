import axios from "axios";
const instance = axios.create({
  //   baseURL: `http://localhost:4000/`,
  baseURL: "https://p4000.140-112-18-200.nip.io/",
});
export default instance;
