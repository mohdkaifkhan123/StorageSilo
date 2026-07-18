import { create } from "zustand";
import folderService from "../services/folderService";
const useFolderStore = create((set) => ({
  createFolder: async (folderDetails) => {
    const res = await folderService.createFolderService(folderDetails);

    return res;
  },
}));
export default useFolderStore;
