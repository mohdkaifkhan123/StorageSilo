const API_URI = "http://localhost:3000/api/folder";

const folderService = {
  createFolderService: async (folderDetails) => {
    console.log("dfghjkl", folderDetails);
    let res = await fetch(`${API_URI}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(folderDetails),
      credentials: "include",
    });
    let data = await res.json();
    return data;
  },

  // Fixed the syntax error and fully implemented the GET request
  getAllContent: async (folderId = null) => {
    try {
      const id = folderId ?? "null";
      let res = await fetch(`${API_URI}/allcontent/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Keeps the session/token alive for userId validation
      });
      
      let data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching folder contents in service:", error);
      throw error;
    }
  },
  deleteFolderService: async (folderId) => {
    try {
      let res = await fetch(`${API_URI}/delete/${folderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let data = await res.json();
      return data;
    } catch (error) {
      console.error("Error deleting folder in service:", error);
      throw error;
    }
  },

  restoreFolderService: async (folderId) => {
    try {
      let res = await fetch(`${API_URI}/restore/${folderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let data = await res.json();
      return data;
    } catch (error) {
      console.error("Error restoring folder in service:", error);
      throw error;
    }
  },
};

export default folderService;