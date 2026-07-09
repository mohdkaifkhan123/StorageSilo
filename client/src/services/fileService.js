const API_URL = "http://localhost:3000/api/files";
const fileService = {
  presignedUrlService: async (fileData) => {
    console.log("servvv",fileData)
    const response = await fetch(`${API_URL}/signedurl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileData),
      credentials: "include",
    });
    const data = await response.json();

    return data;
  },
};

export default fileService;
