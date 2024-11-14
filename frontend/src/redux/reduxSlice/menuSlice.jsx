import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: "menu",
    initialState: {
        isOpenMenuTab: false,
        isOpenAvatarEditTab: false
    },

    reducers: {
        isOpenMenu: (state, action) =>{
            state.isOpenMenuTab = !state.isOpenMenuTab
        },
        isOpenAvatarEdit: (state, action) =>{
            state.isOpenAvatarEditTab = !state.isOpenAvatarEditTab
        }
    }
})

export const {isOpenMenu, isOpenAvatarEdit} = menuSlice.actions;
export default menuSlice.reducer;