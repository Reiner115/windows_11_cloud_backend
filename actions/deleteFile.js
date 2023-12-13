var explorer = require("../util/explorer");

function deleteFile( state , path ){

    const newStaet = explorer.deleteFile(state , path )


    return newStaet;

}


module.exports={deleteFile}