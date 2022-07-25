const jwt = require('jsonwebtoken');
const { SECRETKEY} = require('../config');
const {AuthenticationError}  = require('apollo-server');

module.exports = (context) => {

    const authHeader = context.req.headers.authorization

    if(authHeader){
        //Bearer token

        const token = authHeader.split('Bearer ')[1];
        if(token) {
            try {  
               return   jwt.verify(token, SECRETKEY)
            } catch (error) { 
                throw  new AuthenticationError('Invalid/Expired token') 
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')

    } 
    throw  new Error('Authorization header missing')
}