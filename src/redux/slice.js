import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    dataObject:{},
    isUserSR:false,
  },
  reducers: {
    setDataObject: (state, action) => {
      state.dataObject = action.payload;
    },
    setIsUserSR: (state, action) => {
      state.isUserSR = action.payload;
    },
  },
});

export const {setDataObject, setIsUserSR} = walletSlice.actions;
export default walletSlice.reducer;
