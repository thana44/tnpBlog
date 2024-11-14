import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        currentUser: [],
    },

    reducers: {
        getCurrentUser: (state, action) =>{
            state.currentUser = action.payload
        },
        clearUser: (state, action)=>{
            state.currentUser = []
        }
    }
})

export const {getCurrentUser, clearUser} = userSlice.actions;
export default userSlice.reducer;