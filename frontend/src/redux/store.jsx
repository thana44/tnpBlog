import {configureStore} from '@reduxjs/toolkit'
import userSlice from './reduxSlice/userSlice'
import commentSlice from './reduxSlice/commentSlice';
import blogSlice from './reduxSlice/blogSlice'
import menuSlice from './reduxSlice/menuSlice'

const store = configureStore({
    reducer: {
        user: userSlice,
        comment: commentSlice,
        blog: blogSlice,
        menu: menuSlice
    }
})

export default store;