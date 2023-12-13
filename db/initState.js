const initState = {
  isLoading: false,
  user: {
    isLoggedIn: true,
    userName: undefined,
    token: undefined,
    config: {
      enablePaste: false,
    },
  },
  files: {
    name: "PC",
    type: "PC",
    absolutePath: [],
    currentPath: [],
    pathFiles: [
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
                absolutePath: ["C", "programs files", "IDM"],
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
  },
};

module.exports = {
  initState,
};
