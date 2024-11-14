const pool = require('../connectDB/connectdb')
const {v4: uuidv4} = require('uuid')
const cloudinary = require('../cloudinary/connectCloud')

const getAllBlog = async(req, res)=>{
    try{
        const getAllSql = "SELECT blogId, blogHead, blogDiscription, blogImg, blogCategory, blogPosted, u.userId, u.profileImg, u.username, GROUP_CONCAT(lb.likeBlogBy SEPARATOR ' ') AS likeTotal FROM `blog_table` b JOIN user_table u ON b.blogUserId = u.userId LEFT JOIN like_blog_table lb ON b.blogId = lb.likeBlogId GROUP BY b.blogId ORDER BY blogPosted DESC";
        const [result] = await pool.execute(getAllSql, [])
        const newResult = result.map((item)=>({
            ...item,
            likeTotal: item.likeTotal?.split(' ') || []
        }))
        return res.json(newResult)
    }catch(err){
        console.log(err)
    }
}

const getBlogRecom = async(req, res)=>{
    const {blogId, category} = req.query
    try{
        const getBlogRecomSql = "SELECT blogId, blogHead, blogDiscription, blogImg, blogCategory, blogPosted, u.userId, u.profileImg, u.username, GROUP_CONCAT(DISTINCT lb.likeBlogBy SEPARATOR ' ') AS likeTotal FROM `blog_table` b JOIN user_table u ON b.blogUserId = u.userId LEFT JOIN like_blog_table lb ON b.blogId = lb.likeBlogId WHERE blogCategory = ? AND blogId != ? GROUP BY b.blogId ORDER BY RAND() LIMIT 3";
        const [result] = await pool.execute(getBlogRecomSql, [category, blogId])
        const newResult = result.map((item)=>({
            ...item,
            likeTotal: item.likeTotal?.split(' ') || []
        }))
        return res.json(newResult)
    }catch(err){
        console.log(err)
    }
}

const createBlog = async(req, res)=>{
    const {userId} = req.currentUser
    const {heading, description, blogImage, category, content} = req.body
    try{
        if(!heading || !description || !blogImage || !category || !content){
            return res.status(400).json({message: "Please enter all information."})
        }
        if(heading.length > 255){
            return res.status(400).json({message: "Heading must be no more than 255 characters long."})
        }
        if(description.length > 255){
            return res.status(400).json({message: "Description must be no more than 255 characters long."})
        }
        const image = await cloudinary.uploader.upload(blogImage, {
            folder: "blogPostImg"
        })

        const blogImgId = image.public_id
        const blogImg = image.secure_url

        const createSql = "INSERT INTO blog_table(blogId, blogHead, blogDiscription, blogImgId, blogImg, blogCategory, blogContent, blogUserId) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
        const [result] = await pool.execute(createSql, [uuidv4(), heading, description, blogImgId, blogImg, category, content, userId])
        return res.status(201).json({message: "Post created successfully."})
    }catch(err){
        console.log(err)
    }
}

const readBlog = async(req, res)=>{
    const {id} = req.params
    try{
        // set view count
        const viewCountSql = "UPDATE blog_table SET view_count = view_count + 1 WHERE blogId = ?";
        await pool.execute(viewCountSql, [id])
        
        const readBlogSql = "SELECT blogId, blogHead, blogCategory, blogImg, blogContent, blogPosted, u.userId, u.profileImg, u.username , GROUP_CONCAT(DISTINCT lb.likeBlogBy SEPARATOR ' ') AS likeTotal, COUNT(DISTINCT c.commentId) AS commentTotal FROM `blog_table` b JOIN user_table u ON b.blogUserId = u.userId LEFT JOIN like_blog_table lb ON b.blogId = lb.likeBlogId LEFT JOIN comment_table c ON b.blogId = c.commentBlogId WHERE b.blogId = ? GROUP BY b.blogId";
        const [result] = await pool.execute(readBlogSql, [id])
        if(result.length === 0){
            return res.status(404).json({message: "not found."})
        }
        const newResult = result.map((item)=>({
            ...item,
            likeTotal: item.likeTotal?.split(' ') || []
        }))

        return res.json(newResult)
    }catch(err){
        console.log(err)
    }
}

const getBlogId = async(req, res)=>{
    const {id} = req.params
    try{
        const getBlogIdSql = "SELECT blogId, blogHead, blogDiscription, blogImg, blogCategory, blogPosted, u.userId, u.profileImg, u.username, GROUP_CONCAT(DISTINCT lb.likeBlogBy SEPARATOR ' ') AS likeTotal FROM `blog_table` b JOIN user_table u ON b.blogUserId = u.userId LEFT JOIN like_blog_table lb ON b.blogId = lb.likeBlogId WHERE blogUserId = ? GROUP BY b.blogId ORDER BY blogPosted DESC";
        const [result] = await pool.execute(getBlogIdSql, [id])
        const newResult = result.map((item)=> ({
            ...item,
            likeTotal: item.likeTotal?.split(' ') || []
        }))
        return res.json(newResult)
    }catch(err){
        console.log(err)
    }
}

const blogLike = async(req, res)=>{
    const {id} = req.params
    const {userId} = req.currentUser
    try{
        const likeSql = "INSERT INTO like_blog_table(likeBId, likeBlogId, likeBlogBy) VALUES(?, ?, ?)";
        const [result] = await pool.execute(likeSql, [uuidv4(), id, userId])
        return res.json({message: "Successfully Like."})
    }catch(err){
        console.log(err)
    }
}
const blogUnLike = async(req, res)=>{
    const {id} = req.params
    const {userId} = req.currentUser
    try{
        const likeSql = "DELETE FROM like_blog_table WHERE likeBlogId = ? AND likeBlogBy = ?";
        const [result] = await pool.execute(likeSql, [id, userId])
        return res.json({message: "Successfully Unliked."})
    }catch(err){
        console.log(err)
    }
}

const getBlogUpdate = async(req, res)=>{
    const {blogId} = req.query
    const {userId} = req.currentUser
    try{
        const getBlogSql = "SELECT blogId, blogHead, blogDiscription, blogImg, blogCategory, blogContent, blogUserId FROM blog_table WHERE blogId = ?";
        const [result] = await pool.execute(getBlogSql, [blogId])
        if(result[0].blogUserId !== userId){
            return res.status(404).json({message: "not found."})
        }
        return res.json(result)
    }catch(err){
        console.log(err)
    }
}

const blogUpdate = async(req, res)=>{
    try{
        const {id} = req.params
        const {userId} = req.currentUser
        const {heading, description, newImage, category, content, blogUserId} = req.body
        if(blogUserId !== userId){
            return res.status(404).json({message: "Not found."})
        }
        if(!heading || !description || !category || !content){
            return res.status(400).json({message: "Please enter all information."})
        }
        if(heading.length > 255){
            return res.status(400).json({message: "Heading must be no more than 255 characters long."})
        }
        if(description.length > 255){
            return res.status(400).json({message: "Description must be no more than 255 characters long."})
        }

        if(newImage){
            const img = await cloudinary.uploader.upload(newImage,{
                folder: "blogPostImg"
            })
            const getImgSql = "SELECT blogImgId FROM blog_table WHERE blogId = ?";
            const [getImgId] = await pool.execute(getImgSql, [id])
            if(getImgId[0].blogImgId){
                await cloudinary.uploader.destroy(getImgId[0].blogImgId)
            }

            const updateBlogImg = "UPDATE blog_table SET blogImgId = ?, blogImg = ? WHERE blogId = ?";
            const [update] = await pool.execute(updateBlogImg, [img.public_id, img.secure_url, id])
        }
        const updateSql = "UPDATE blog_table SET blogHead = ?, blogDiscription = ?, blogCategory = ?, blogContent = ? WHERE blogId = ?";
        const [result] = await pool.execute(updateSql, [heading, description, category, content, id])

        return res.json({message: "Blog update successful."})
    }catch(err){
        console.log(err)
    }
}

const blogDelete = async(req, res)=>{
    const {blogId} = req.query
    const {userId} = req.currentUser
    try{
        const checkUserSql = "SELECT blogUserId FROM blog_table WHERE blogId = ?";
        const [user] = await pool.execute(checkUserSql, [blogId])
        if(user[0].blogUserId !== userId){
            return res.status(404).json({message: "not found."})
        }
        const deleteLikeComSql = "DELETE FROM `like_comment_table` WHERE likeComId IN (SELECT commentId FROM comment_table WHERE commentBlogId = ?)";
        await pool.execute(deleteLikeComSql, [blogId])
        const deleteLikeBlogSql = "DELETE FROM like_blog_table WHERE likeBlogId = ?";
        await pool.execute(deleteLikeBlogSql, [blogId])
        const deleteComSql = "DELETE FROM  comment_table WHERE commentBlogId = ?";
        await pool.execute(deleteComSql, [blogId])
        const deleteBlogImageSql = "SELECT blogImgId FROM blog_table WHERE blogId = ?";
        const [result] = await pool.execute(deleteBlogImageSql, [blogId])
        if(result[0].blogImgId){
            await cloudinary.uploader.destroy(result[0].blogImgId)
        }
        const deleteBlogSql = "DELETE FROM blog_table WHERE blogId = ?";
        await pool.execute(deleteBlogSql, [blogId])
        return res.json({message: "Successfully deleted the blog."})
    }catch(err){
        console.log(err)
    }
}
 
module.exports = {getAllBlog, createBlog, readBlog, getBlogId, getBlogRecom, blogLike, blogUnLike, getBlogUpdate, blogUpdate, blogDelete};