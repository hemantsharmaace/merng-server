const Post = require("../../models/Post") 
const checkAuth = require('../../utils/verifyToken');
const {UserInputError, AuthenticationError} = require("apollo-server");
 
module.exports = {
    Mutation :{ 
        createComment : async(_, {postId,body}, context) => {
            const  user = checkAuth(context);

            if(body.trim() === ""){

                throw new UserInputError('Empty comment',{
                    errors : {
                        body : "comment body must not be empty"
                    }
                }) 
            } 
            const post = await Post.findById(postId) ;
            if(post) {
                console.log(user) 
                post.comments.unshift({
                        body,
                        username: user.username,
                        createdAt: new Date().toISOString()
                     }) 
              await post.save();
              return post;
            } else {
                throw new UserInputError("Post not found");
            }

        },
        deleteComment : async(_,{postId,commentId},context) => {
            const {username } = checkAuth(context);
            const post = await Post.findById(postId);

            if(post) {
                const  commentIndex = post.comments.findIndex(c => c.id === commentId);
                if(post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex,1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } else {
                throw  new UserInputError('Post not found');
            }
        }

    }
}