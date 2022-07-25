const Post = require('../../models/Post.js');

const checkAuth = require("../../utils/verifyToken");

const {AuthenticationError}  = require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');

module.exports = {
    Query : {
        async getPosts() {
            try { 
                return await Post.find();  
            } catch (error) {
                throw new Error(err)
            }

        },
        async getPost(_,{postId}) {
            try {
                const post = await Post.findById(postId);
                if(post) {
                    return post
                } else {
                    throw new Error("Post not found");
                }

            } catch (err) {

                throw new Error(err)
                
            }
            
        }

    },
    Mutation : {
        async createPost(_,{body},context){

            if(body.trim() == "") {
                throw new Error('Post body must not be empty')
            }

            const  user = checkAuth(context);
            console.log(user);  
            const  newPost = new Post({
                body,
                user:user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            const post = await newPost.save();
            return post;
        },
        async deletePost(_,{postId}, context){
            const  user = checkAuth(context);
           
            try {
           
                 const postdata  =  await Post.findById(postId); 
                 console.log(user.username)
                 console.log(postdata.username)
                if(user.username == postdata.username){
                    await  postdata.delete();
                    return 'Post Deleted successfully'
                } else {

                    throw new AuthenticationError('Action not allowed')
                } 
                
            } catch (err) {
                throw new Error(err)
            }
           
        },
        likePost : async(_,{postId},context) => {
            const {username } = checkAuth(context);
            const post = await Post.findById(postId);

            if(post) {
               
                if(post.likes.find(like => like.username === username)) {
                    //Post already liked
                    post.likes = post.likes.filter(like => like.username !== username)
                   
                } else { 
                    //Not liked post
                    post.likes.push({
                        username,
                        createdAt : new Date().toISOString()
                    })
                }
                await post.save();
                return post;    
            } else {
                throw  new UserInputError('Post not found');
            }
        }
        
    },
    Subscription : {
            newPost :  {
                subscribe: () => pubsub.asyncIterator(['POST_CREATED']), 
            }
    }
}