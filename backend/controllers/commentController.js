const pool = require('../connectDB/connectdb')
const {v4: uuidv4} = require('uuid')

const getComment = async(req, res)=>{
    const {blogId} = req.query
    try{
        const getCommentSql = "SELECT commentId, comment, dateComment, u.userId, u.profileImg, u.username, GROUP_CONCAT(DISTINCT lc.likeComBy SEPARATOR ' ') AS likeCommentTotal FROM `comment_table` c JOIN user_table u ON c.commentBy = u.userId LEFT JOIN like_comment_table lc ON c.commentId = lc.likeComId WHERE c.commentBlogId = ? GROUP BY c.commentId ORDER BY dateComment DESC";
        const [result] = await pool.execute(getCommentSql, [blogId])
        const newResult = result.map((item)=>({
            ...item,
            likeCommentTotal: item.likeCommentTotal?.split(' ') || []
        }))
        return res.json(newResult)
    }catch(err){
        console.log(err)
    }
}

const addComment = async(req, res)=>{
    const {userId} = req.currentUser
    const {blogId} = req.query
    const {comment} = req.body
    try{
        if(comment.length < 1 || !comment){
            return res.status(400).json({message: "Please write your comment."})
        }
        if(comment.length > 500){
            return res.status(400).json({message: "Your comment is too long."})
        }
        const commentId = uuidv4();
        const addCommentSql = "INSERT INTO comment_table(commentId, comment, commentBlogId, commentBy) VALUES(?, ?, ?, ?)";
        const [result] = await pool.execute(addCommentSql, [commentId, comment, blogId, userId])

        if(result){
            const getCommentSql = "SELECT commentId, comment, dateComment, u.userId, u.profileImg, u.username, GROUP_CONCAT(DISTINCT lc.likeComBy SEPARATOR ' ') AS likeCommentTotal FROM `comment_table` c JOIN user_table u ON c.commentBy = u.userId LEFT JOIN like_comment_table lc ON c.commentId = lc.likeComId WHERE c.commentId = ? GROUP BY c.commentId";
            const [getComment] = await pool.execute(getCommentSql, [commentId])
            const newComment = getComment.map((item)=>({
                ...item,
                likeCommentTotal: item.likeCommentTotal?.split(' ') || []
            }))
            return res.json(newComment)
        }
    }catch(err){
        console.log(err)
    }
}

const commentLike = async(req, res)=>{
    const {id} = req.params
    const {userId} = req.currentUser
    try{
        const likeSql = "INSERT INTO like_comment_table(likeCId, likeComId, likeComBy) VALUES(?, ?, ?)";
        const [result] = await pool.execute(likeSql, [uuidv4(), id, userId])
        return res.json({message: "Successfully Like."})
    }catch(err){
        console.log(err)
    }
}
const commentUnLike = async(req, res)=>{
    const {id} = req.params
    const {userId} = req.currentUser
    try{
        const likeSql = "DELETE FROM like_comment_table WHERE likeComId = ? AND likeComBy = ?";
        const [result] = await pool.execute(likeSql, [id, userId])
        return res.json({message: "Successfully Unliked."})
    }catch(err){
        console.log(err)
    }
}

module.exports = {getComment, addComment, commentLike, commentUnLike};