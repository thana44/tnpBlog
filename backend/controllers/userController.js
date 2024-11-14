const pool = require('../connectDB/connectdb')
const cloundinary = require('../cloudinary/connectCloud')


const getUserProfile = async(req, res)=>{
    const {id} = req.params
    try{
        const checkUserSql = "SELECT userId FROM user_table WHERE userId = ?";
        const [user] = await pool.execute(checkUserSql, [id])
        if(user.length === 0){
            return res.status(404).json({message: "Not found."})
        }
        const getProfileSql = "SELECT profileImg, username, discription, instagramLink, facebookLink, otherLink, joined, COUNT(DISTINCT b.blogId) AS blogCount, SUM(b.view_count) AS viewCount FROM user_table u LEFT JOIN blog_table b ON b.blogUserId = u.userId WHERE userId = ?";
        const [result] = await pool.execute(getProfileSql, [id])
        if(result.length === 1) {
            const newResult = result.map((item)=>({
                ...item,
                viewCount: item.viewCount || 0
            }))
            return res.json(newResult)
        }
    }catch(err){
        console.log(err)
        return res.status(400).json({message: "Something went wrong."})
    }
}
const getUserProfileForUpdate = async(req, res)=>{
    const {id} = req.params
    const {userId} = req.currentUser
    try{
        if(id !== userId){
            return res.status(404).json({message: "Not found."})
        }
        const getProfileSql = "SELECT profileImg, username, discription, instagramLink, facebookLink, otherLink FROM user_table WHERE userId = ?";
        const [result] = await pool.execute(getProfileSql, [id])
        if(result.length === 1) {
            return res.json(result)
        }
        return res.status(404).json({message: "Not found."})
    }catch(err){
        console.log(err)
        return res.status(400).json({message: "Something went wrong."})
    }
}

const updateProfile = async(req, res)=>{
    const {id} = req.params
    const {userId} = req.currentUser
    const {newImage, username, discription, instagramLink, facebookLink, otherLink} = req.body
    try{
        if(id !== userId){
            return res.status(404).json({message: "Not found."})
        }
        if(!username){
            return res.status(400).json({message: "Please enter your username."})
        }
        const checkUsername = "SELECT username, userId FROM user_table WHERE username = ?";
        const [name] = await pool.execute(checkUsername, [username])
        if(name.length > 0){
            if(name[0].userId !== userId){
                return res.status(409).json({message: "Username already exists"})
            }
        }
        if(newImage){
            const img = await cloundinary.uploader.upload(newImage,{
                folder: "blogProfileImg"
            })
            const getUserSql = "SELECT profileImgId FROM user_table WHERE userId = ?";
            const [getUser] = await pool.execute(getUserSql, [userId])
            if(getUser[0].profileImgId){
                await cloundinary.uploader.destroy(getUser[0].profileImgId)
            }

            const updateProfileSql = "UPDATE user_table SET profileImgId = ?, profileImg = ? WHERE userId = ?";
            const [update] = await pool.execute(updateProfileSql, [img.public_id, img.secure_url, userId])
        }
        const updateSql = "UPDATE user_table SET username = ?, discription = ?, instagramLink = ?, facebookLink = ?, otherLink = ? WHERE userId = ?";
        const [result] = await pool.execute(updateSql, [username, discription, instagramLink, facebookLink, otherLink, userId])

        return res.json({message: "Profile update successful."})
    }catch(err){
        console.log(err)
    }
}

module.exports = {getUserProfile, getUserProfileForUpdate, updateProfile};