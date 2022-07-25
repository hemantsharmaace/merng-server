const User = require("../../models/User");
const  { UserInputError } = require("apollo-server");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {validateRegisterInput, validateLoginInput} = require('../../utils/validators');
const { SECRETKEY } = require('../../config');

function  generateToken(user) { 
  return jwt.sign({id: user.id, email : user.email, username  : user.username},SECRETKEY, { expiresIn : '1h'});
}  


module.exports = {
  Mutation: {
   async   login(_,{username,password}) {
    const {errors,valid} = validateLoginInput(username,password);
    if(!valid) {
      throw new UserInputError("Errors", {errors})
    } 
    const user = await User.findOne({username:username});
    if(!user) {
      errors.general = "Username not found";
      throw new UserInputError('User not found',errors);
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
      errors.general = "User not found";
      throw new UserInputError('Wrongs credential',errors);
    } 
   
    const token = generateToken(user); 
    return  {
      ...user._doc,
      id : user.id,
      token
     }
   },
  async   register(
      _,
      { 
        registerInput: { username, email, password, confirmPassword } 
      } 
    ) {
      //TODO  validate user data
       const {errors,valid} = validateRegisterInput(username, email, password, confirmPassword)
       if(!valid) {
         throw new UserInputError("Errors", {errors})
       }
      //TODO  make sure username is unique and not already exist
      // TODO  hash password  and create and auth token
       const  user = await User.findOne({username})
        if(user){
            throw new UserInputError('Username is taken',{
                errors : {
                    username : "This username is taken"
                }
            })
        }
       password  = await bcrypt.hash(password,12)
       const  newUser = new User({
        email,
        username,
        password,
        createdAt : new Date().toISOString()
       })
       const res = await  newUser.save()

       const token = generateToken(res);
       return  {
        ...res._doc,
        id : res.id,
        token
       }
    } 
  },
};


