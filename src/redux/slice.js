import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    dataObject:{},
  },
  reducers: {
    setDataObject: (state, action) => {
      state.dataObject = action.payload;
    },
  },
});

export const {setDataObject} = walletSlice.actions;
export default walletSlice.reducer;
