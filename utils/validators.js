module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {}
    if(username.trim() == "") {
        errors.username = 'Username must not be empty'
    }
    if(email.trim() == "") {
        errors.email = 'Email must not be empty'
    }
    // } else {
    //    const regexp =  '/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/' ;

    //       if(!email.match(regexp)) {
    //         errors.email = 'Email is not valid'
    //       }
    // }
    if(password == "") {
        errors.password = 'Password must not be empty'
    } else if ( password != confirmPassword ){
        errors.confirmPassword = 'Confirm Password must  be equal to password'
    } 

    return {
        errors ,
        valid : Object.keys(errors).length < 1 
    }
}

module.exports.validateLoginInput = (username,password) => {
    const errors = {}
    if(username.trim() == "") {
        errors.username = 'Username must not be empty'
    }
    
    if(password == "") {
        errors.password = 'Password must not be empty'
    }  

    return {
        errors ,
        valid : Object.keys(errors).length < 1 
    }
}
