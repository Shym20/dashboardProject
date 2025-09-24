import { getTokenLocal, getUserLocal } from "../utils/localStorage.util";

export const useAuthenticated = () => {
  const token = getTokenLocal();
  const user = getUserLocal();
  if (token && user) {
    return true;
  } else {
    return false;
  }
};
