import { create } from "zustand";
import fileService from "../services/fileService";
const useFileStore = create((set) => ({
  preSignedData: null,

  presignedURL: async (fileData) => {
    const res = await fileService.presignedUrlService(fileData);
    try {
      set({ preSignedData: res.uploadURL });
      return res
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useFileStore;
