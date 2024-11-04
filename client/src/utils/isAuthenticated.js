import { redirect } from "react-router-dom";

export default async function isAuthenticated() {
  const user = localStorage.getItem("userId");
  if (!user) throw redirect("/login");
  return null;
}
