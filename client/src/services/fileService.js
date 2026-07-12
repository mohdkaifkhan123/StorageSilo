const API_URL = "http://localhost:3000/api/files";
const fileService = {
  presignedUrlService: async (fileData) => {

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
  saveMetaDataService: async (fileMetaData) => {
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileMetaData),
      credentials: "include",
    });
    const data = await res.json();

    return data;
  },
  getAllFilesService: async () => {
    let res = await fetch(`${API_URL}/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  },
};

export default fileService;
