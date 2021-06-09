 const path = require("path"); 
 const multer = require("multer");
  var appDir = path.dirname(require.main.filename);
  const staticImagesDir = path.join( appDir , "/public/images/");
  
  
  // SET STORAGE
  var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
		cb(null, staticImagesDir )
	  },
	  filename: function (req, file, cb) {
		  var newName = `${Date.now()}` + file.originalname;
		  req.fileName = newName;
		  cb(null, newName  )
	  }
	})
	 
	var upload = multer({ storage: storage });

	module.exports = upload;