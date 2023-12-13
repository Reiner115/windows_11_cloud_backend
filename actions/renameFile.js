var explorer = require("../util/explorer");

function renameFile( state , oldName , newName ){

    const path = [ ...state.currentPath , oldName ];   

    const newStaet = explorer.rename( state , path , newName )


    return newStaet;

}


module.exports={renameFile}