import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        isOpenTab: false,
        allComment: []
    },

    reducers: {
        isOpenComment: (state, action) =>{
            state.isOpenTab = !state.isOpenTab
        },
        getAllComment: (state, action)=>{
            state.allComment = action.payload
        },
        addNewComment: (state, action)=>{
            state.allComment.push(action.payload)
        },
        likeComment: (state, action)=>{
            const {userId, commentId} = action.payload
            const index = state.allComment.findIndex(x => x.commentId === commentId)
            state.allComment[index].likeCommentTotal.push(userId)
        },
        unlikeComment: (state, action)=>{
            const {userId, commentId} = action.payload
            const index = state.allComment.findIndex(x => x.commentId === commentId)
            state.allComment[index].likeCommentTotal = state.allComment[index].likeCommentTotal.filter(x => x !== userId)
        }
    }
})

export const {isOpenComment, getAllComment, addNewComment, likeComment, unlikeComment} = commentSlice.actions;
export default commentSlice.reducer;