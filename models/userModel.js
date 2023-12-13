var pool = require("../db/connection.js");
async function inserUser( name , password , state ){
	
	 return new Promise( (resolve , reject )=>{

		pool.getConnection((getConnectionError, connection) => {
			if (getConnectionError) {
			  reject(getConnectionError);
			  return;
		}


        let arr = [];
        arr.push(name);
        arr.push(password);
        arr.push(state);
		connection.query("INSERT IGNORE INTO `users` ( `id` , `name` , `password` ,`state` ) values (NULL , ? , ? , ? );" , arr , ( err , data )=>{
			if( err ){
				reject( err );
			}else{
				delete data.password;
				resolve( data );
			}
		});
		
	});

	 });
}

module.exports={
    inserUser
}