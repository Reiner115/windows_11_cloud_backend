
  
   function createFolder(files, path, folder ) {
    const sourceNode = findNode(files, path);
    if( sourceNode != undefined || sourceNode != null ){
        if( sourceNode.hasOwnProperty("children"))
          sourceNode.children.push( folder );
        else{
          sourceNode.children = [];
          sourceNode.children.push( folder );
        }
    }
    return files;

  }
  
   function deleteFile(files, path) {
    const parentPath = path.slice(0, -1);
    const fileName = path[path.length - 1];
    const parent = findNode(files, parentPath);
    if (parent) {
      parent.children = parent.children.filter((item) => item.name !== fileName);
    }
    return files;
  }
  
   function copy(files, fromPath, toPath) {
    const sourceNode = findNode(files, fromPath);
    if (sourceNode) {
      const copiedNode = { ...sourceNode };
      copiedNode.name = getUniqueName(files, toPath, copiedNode.name);
      copiedNode.absolutePath = toPath.slice();
      findNode(files, toPath).children.push(copiedNode);
    }
    return files;
  }
  
   function cut(files, fromPath, toPath) {
    files = copy(files, fromPath, toPath);
    files = deleteFile(files, fromPath);
    return files;
  }
  
   function getFiles(files, path) {
    const node = findNode(files, path);
    return node ? node.children : [];
  }
  
   function rename(files, path, newName) {
    const node = findNode(files, path);
    if (node) {
      node.name = getUniqueName(files, path.slice(0, -1), newName);
      node.absolutePath = [ ...node.absolutePath.slice(0,-1) , node.name ];
    }
    return files;
  }
  
   function addFile(files, path, newFile) {
    newFile.name = getUniqueName(files, path, newFile.name);
    //newFile.absolutePath = path.slice();
    findNode(files, path).children.push(newFile);
    return files;
  }
  
   function findNode(node, path) {
    if (path.length === 0) return node;
    const [head, ...rest] = path;
    const childNode = node.children.find((item) => {
      const isEual = (item.name === head);
      return item.name === head;
    });
    if (childNode) {
      return findNode(childNode, rest);
    }
    return null;
  }
  
  function getUniqueName(files, path, name) {
    let newName = name;
    let count = 1;
    while (findNode(files, [...path, newName])) {
      newName = `${name} (${count})`;
      count++;
    }
    return newName;
  }


  module.exports={
    addFile,
    createFolder,
    getUniqueName,
    rename,
    copy,
    cut,
    deleteFile
  }