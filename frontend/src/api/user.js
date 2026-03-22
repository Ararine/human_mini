import { api, api_cre } from "./axios";

export async function signup(data) {
  const res = await api.post("/register", data);

  return res;

  //   try {
  //     const res = await api.post("http://localhost:5000/register", data);
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
}

export async function loginCheck() {
  return api_cre.post("/get-user");
}
