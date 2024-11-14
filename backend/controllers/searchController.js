const pool = require('../connectDB/connectdb')


const search = async(req, res)=>{
    const {radioType, search, category} = req.query
    try{
        if(!search){
            return res.json([] || {message: "Please enter a search term."})
        }
        if(radioType === 'blogs'){
            if(category === 'All'){
                const searchSql = "SELECT blogId, blogHead, blogDiscription, blogImg, blogCategory, blogPosted, u.userId, u.profileImg, u.username, GROUP_CONCAT(DISTINCT lb.likeBlogBy SEPARATOR ' ') AS likeTotal FROM `blog_table` b JOIN user_table u ON b.blogUserId = u.userId LEFT JOIN like_blog_table lb ON b.blogId = lb.likeBlogId WHERE blogHead LIKE ? GROUP BY b.blogId LIMIT 3"
                const [result] = await pool.execute(searchSql, [`%${search}%`])
                const newResult = result.map((item)=>({
                    ...item,
                    likeTotal: item.likeTotal?.split(' ') || []
                }))
                return res.json(newResult)
            }
            const searchSql = "SELECT blogId, blogHead, blogDiscription, blogImg, blogCategory, blogPosted, u.userId, u.profileImg, u.username, GROUP_CONCAT(DISTINCT lb.likeBlogBy SEPARATOR ' ') AS likeTotal FROM `blog_table` b JOIN user_table u ON b.blogUserId = u.userId LEFT JOIN like_blog_table lb ON b.blogId = lb.likeBlogId WHERE blogCategory = ? AND blogHead LIKE ? GROUP BY b.blogId LIMIT 3"
            const [result] = await pool.execute(searchSql, [category, `%${search}%`])
            const newResult = result.map((item)=>({
                ...item,
                likeTotal: item.likeTotal?.split(' ') || []
            }))
            return res.json(newResult)
        }
        if(radioType === 'users'){
            const searchSql = "SELECT userId, profileImg, username, COUNT(DISTINCT b.blogId) AS blogCount, SUM(b.view_count) AS viewCount FROM user_table u LEFT JOIN blog_table b ON b.blogUserId = u.userId WHERE u.username LIKE ? GROUP BY u.userId LIMIT 3;";
            const [result] = await pool.execute(searchSql, [`%${search}%`])
            const newResult = result.map((item)=>({
                ...item,
                viewCount: item.viewCount || 0
            }))
            return res.json(newResult)
        }

    }catch(err){
        console.log(err)
    }
}

module.exports = {search};