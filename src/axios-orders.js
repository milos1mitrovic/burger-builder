import axios from "axios";

const instance = axios.create({
  baseURL: "https://burger-builder-f4ed2-default-rtdb.firebaseio.com/",
});

export default instance;
