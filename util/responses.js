 INTERNAL_SERVER_ERROR = {
    responseCode : 500,
    responseStatus : "failed" ,
    responseMessage : "Internal Server Error"
},

 FILE_UPLOADED_SUCCESSFULY = {
    responseCode : 200,
    responseStatus : "Successful" ,
    responseMessage : "File has been uploaded successfauly"
}

STATE_NOT_FOUND = {
    responseCode : 400,
    responseStatus : "failed" ,
    responseMessage : "State is not found in the request body"
}

USERNAME_OR_PASSWORD_IS_WRONG = {
    responseCode : 400,
    responseStatus : "failed" ,
    responseMessage : "User name or password is wrong"
}

NAME_FIELD_NOT_FOUND_IN_REQUEST = {
    responseCode : 400,
    responseStatus : "failed" ,
    responseMessage : "Enter a valid name"
}

PASSWORD_FIELD_NOT_FOUND_IN_REQUEST = {
    responseCode : 400,
    responseStatus : "failed" ,
    responseMessage : "Enter a valid password"
}

USER_WITH_THIS_NAME_ALREADY_EXSITS = {
    responseCode : 400,
    responseStatus : "failed" ,
    responseMessage : "Username already exists"
}


module.exports = {
    INTERNAL_SERVER_ERROR ,
    FILE_UPLOADED_SUCCESSFULY,STATE_NOT_FOUND,
    NAME_FIELD_NOT_FOUND_IN_REQUEST,
    PASSWORD_FIELD_NOT_FOUND_IN_REQUEST,
    USER_WITH_THIS_NAME_ALREADY_EXSITS,
    USERNAME_OR_PASSWORD_IS_WRONG,
    }