import { createSlice } from "@reduxjs/toolkit";
import {
  getTokenLocal,
  getUserLocal,
  setTokenLocal,
  setUserLocal,
} from "../../utils/localStorage.util";

const initialState = {
  clipC_user_info: getUserLocal(),  
  clipC_auth_token: getTokenLocal(),
  resetToken: "",
  User: [],
};

//internally using immer lib (can create mutable state)
export const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      setUserLocal(action.payload);
      state.clipC_user_info = action.payload;
    },
    updateToken: (state, action) => {
      setTokenLocal(action.payload);
      state.clipC_auth_token = action.payload;
    },
    updateAllUser: (state, action) => {
      state.User = action.payload;
    },
    updateResetToken: (state, action) => {
      console.log("Updating reset token in user slice:", action.payload);
      state.resetToken = action.payload;
    },
    logoutUser: (state) => {
      state.clipC_user_info = null; // Clear user info
      state.clipC_auth_token = null; // Clear auth token
    },
    resetUser: (state, action) => {
      state.User = [];
    },
  },
});

// this is for dispatch
export const {
  updateUser,
  updateToken,
  updateAllUser,
  resetUser,
  logoutUser,
  updateResetToken,
} = userSlice.actions;

// this is for configureStore
export default userSlice.reducer;
