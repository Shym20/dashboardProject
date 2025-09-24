import Cookies from "js-cookie";

export const getTokenLocal = () => {
  return Cookies.get("clipC_auth_token") || null;
};

export const getUserLocal = () => {
  const user = Cookies.get("clipC_ufo");

  if (!user) return null; // return null if cookie not set

  try {
    return JSON.parse(user); // safely parse JSON
  } catch (err) {
    console.error("Error parsing user cookie:", err);
    return null;
  }
};

export const setTokenLocal = (token) => {
  Cookies.set("clipC_auth_token", token, { expires: 30 });
};

export const setUserLocal = (user) => {
  Cookies.set("clipC_ufo", JSON.stringify(user), { expires: 30 });
};