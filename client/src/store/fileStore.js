import { create } from "zustand";
import fileService from "../services/fileService";
const useFileStore = create((set) => ({
  preSignedData: null,
  allFiles: [],
  error: null,

  presignedURL: async (fileData) => {
    const res = await fileService.presignedUrlService(fileData);
    try {
      set({ preSignedData: res.uploadURL });
      return res;
    } catch (error) {
      set({ error: error.message });
    }
  },
  saveMetaDataStore: async (fileMetaData) => {
    const res = await fileService.saveMetaDataService(fileMetaData);
    console.log(res);
  },
  getAllFilesData: async () => {
    const res = await fileService.getAllFilesService();
    try {
      const files = res?.fileList || [];
      set({ allFiles: files });
      return files;
    } catch (error) {
      set({ error: error });
      return [];
    }
  },
  deleteFiles: async (id) => {
    const res = await fileService.deleteFileService(id);
    return res;
  },
  getTrashData: async () => {
    const res = await fileService.getTrashDataService();
    return res;
  },
}));

export default useFileStore;
