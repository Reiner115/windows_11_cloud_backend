const initState = {
  
    isLoading:false,
      user:{
        isLoggedIn : true,
        userName : undefined,
        token : undefined,
        config : {
          enablePaste : false
        },
      },
  
      apps : {
          explorer : {
            key : "explorer",
              isRunning : false,
              id : "fileExplorerApplication",
              appType : "FILES_EXPLORER",
              isTop : true,
              icon:"explorer.png",
              className : "FileExplorerContainer",
              title : "Explorer"
  
              
          },
          notepad :{
              key : "notepad",
              isRunning : false,
              id : "notepadApplication",
              appType : "NOTEPAD",
              fileType : "TXT",
              isTop : false,
              icon:"notepad2.png",
              className : "notepad",
              title : "Notepad"
          },
          notes : {
            key : "notes",
              isRunning : false,
              id : "notesApplication",
              appType : "NOTES",
              isTop : false,
              icon:"notes.png",
              title : "Notes",
              className : "notes"
          },
          images : {
            key : "images",
              isRunning : false,
              id : "picturesPreviewerApplication",
              appType : "PICTURES_PREVIEWER",
              fileType : "IMAGE",
              isTop : false,
              icon:"photo.png",
              title:"Pictures",
              className : "image-container"
  
          },
          settings : {
            key : "settings",
              isRunning : false,
              id : "settingsApplication",
              appType : "SETTINGS",
              fileType : undefined,
              isTop : false,
              icon:"settings.png",
              title:"Settings",
              className : "settings-application"
  
          },
          camera : {
              key : "camera",
              isRunning : false,
              id : "cameraApplication",
              appType : "CAMERA",
              fileType : undefined,
              isTop : false,
              icon:"camera.png",
              title:"Camera",
              className : "camera"
          },
  
          videoPlayer : {
            key : "videoPlayer",
            isRunning : false,
            id : "videoPlayerApplication",
            appType : "VIDEO_PLAYER",
            fileType : "VIDEO",
            isTop : false,
            icon:"video.png",
            title:"Video Player",
            className : "video-player-window",
            src:"",
        },
        progressBar : {
          ke:"upload",
          isRunning : false,
          id:"progressBarApplication",
          appType : "",
          fileType : "",
          isTop : false,
          icon:"marker.png",
          title:"Uploading....",
          className : "progress-bar-window",
        },
        pdfViewer : {
          key : "pdfViewer",
          isRunning : false,
          id:"pdfApplication",
          appType : "MUSIC_PLAYER",
          fileType : "pdf",
          isTop : false,
          icon:"marker.png",
          title:"PDF Document",
          className : "pdf-viewer",
        },
        music:{
          key : "music",
          isRunning : true,
          id:"musicApplication",
          appType : "music",
          fileType : "AUDIO",
          isTop : false,
          icon:"music-sm.png",
          title:"ThunderDev Music Player",
          className : "music-player-container",
        }
          
      },
      name: "PC",
      type: "PC",
      absolutePath: [],
      currentPath : [],
      pathFiles : [
          {
            name: "C",
            type: "WINDOWS_DISK",
            absolutePath: ["C"],
            children: [
              {
                name: "programs files",
                type: "FOLDER",
                absolutePath: ["C", "programs files"],
                children: [],
              },
            ],
          },
          {
            name: "D",
            type: "DISK",
            absolutePath: ["D"],
            children: [],
          },
        ], 
      children: [
        {
          name: "C",
          type: "WINDOWS_DISK",
          absolutePath: ["C"],
          children: [
            {
              name: "programs files",
              type: "FOLDER",
              absolutePath: ["C", "programs files"],
              children: [
                {
                  name: "IDM",
                  type: "FOLDER",
                  absolutePath: ["C", "programs files" , "IDM"],
                  children: [],
                },
              ],
            },
            {
              name: "windows",
              type: "FOLDER",
              absolutePath: ["C", "windows"],
              children: [],
            },
            {
              name: "user",
              type: "FOLDER",
              absolutePath: ["C", "user"],
              children: [],
            },
          ],
        },
        {
          name: "D",
          type: "DISK",
          absolutePath: ["D"],
          children: [],
        },
      ],
    }; 
  
  module.exports ={
      initState
  }