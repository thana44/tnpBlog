import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
    name: "blogs",
    initialState: {
        allBlog: [],
        blogFilter: [],
        blogRecom: [],
        readBlogData: {}
    },

    reducers: {
        getblog: (state, action) =>{
            state.allBlog = action.payload
            if(state.blogFilter.length === 0){
                state.blogFilter = action.payload
            }
        },
        setblogfilter: (state, action)=>{
            if(action.payload === "All"){
                state.blogFilter = state.allBlog
            }else{
                state.blogFilter = state.allBlog.filter(x => x.blogCategory === action.payload)
            }
        },
        getblogRecom: (state, action)=>{
            state.blogRecom = action.payload
        },
        getReadBlogData: (state, action)=>{
            state.readBlogData = action.payload
        },
        likeBlog: (state, action)=>{
            const {id, bId, type} = action.payload
            if(type === 'home'){
                const index = state.allBlog.findIndex((x)=> x.blogId === bId)
                state.allBlog[index].likeTotal.push(id)
                const index2 = state.blogFilter.findIndex((x)=> x.blogId === bId)
                state.blogFilter[index2].likeTotal.push(id)
            }
            if(type === 'read'){
                state.readBlogData.likeTotal.push(id)
            }
            if(type === 'recom'){
                const index = state.blogRecom.findIndex((x)=> x.blogId === bId)
                state.blogRecom[index].likeTotal.push(id)
            }
        },
        unlikeBlog: (state, action)=>{
            const {id, bId, type} = action.payload
            if(type === 'home'){
                const index = state.allBlog.findIndex((x)=> x.blogId === bId)
                state.allBlog[index].likeTotal =  state.allBlog[index].likeTotal.filter(x => x !== id)
                const index2 = state.blogFilter.findIndex((x)=> x.blogId === bId)
                state.blogFilter[index2].likeTotal =  state.blogFilter[index2].likeTotal.filter(x => x !== id)
            }
            if(type === 'read'){
                state.readBlogData.likeTotal = state.readBlogData.likeTotal.filter(x => x !== id)
            }
            if(type === 'recom'){
                const index = state.blogRecom.findIndex((x)=> x.blogId === bId)
                state.blogRecom[index].likeTotal = state.blogRecom[index].likeTotal.filter((x)=> x !== id)
            }
        },
        plusCommentTotal: (state, action)=>{
            state.readBlogData.commentTotal += 1
        },
        deleteBlog: (state, action)=>{
            const {blogId} = action.payload
            state.allBlog = state.allBlog.filter(x => x.blogId !== blogId)
            state.blogFilter = state.blogFilter.filter(x => x.blogId !== blogId)
        }
    }
})

export const {getblog, setblogfilter, getblogRecom, getReadBlogData, likeBlog, unlikeBlog, plusCommentTotal, deleteBlog} = blogSlice.actions;
export default blogSlice.reducer;