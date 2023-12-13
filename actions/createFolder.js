var explorer = require("../util/explorer");

function createFolder( state , folderName ){
    const name =  explorer.getUniqueName( state , state.currentPath , folderName );
   
    let path = state.currentPath;
    let newFolder = {
        children : [],
        name : name,
        type : "FOLDER",
        absolutePath : [ ...path , name ]
    };

    return explorer.createFolder(state , path , newFolder );

}


module.exports={createFolder}