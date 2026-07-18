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
};
export default folderService;
