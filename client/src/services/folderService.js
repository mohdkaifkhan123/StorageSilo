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
  getAllContent: async (folderId = "root") => {
    try {
      let res = await fetch(`${API_URI}/allcontent/${folderId}`, {
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
  }
};

export default folderService;