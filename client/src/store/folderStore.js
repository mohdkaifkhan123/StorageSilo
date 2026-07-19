import { create } from "zustand";
import folderService from "../services/folderService";

const useFolderStore = create((set) => ({
  // 1. Core State
  folders: [],
  files: [],
  breadcrumbs: [],
  loading: false,

  // 2. Action: Create Folder
  createFolder: async (folderDetails) => {
    set({ loading: true });
    try {
      const res = await folderService.createFolderService(folderDetails);
      return res;
    } catch (error) {
      console.error("Error creating folder in store:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // 3. Action: Fetch Content (Folders + Files + Breadcrumbs)
  fetchFolderContent: async (folderId =null) => {
    set({ loading: true });
    try {
      const res = await folderService.getAllContent(folderId);
      
      // Match your backend's res.status(200).json({ message: { breadcrumbs, folders, files } })
      if (res && res.message) {
        set({
          folders: res.message.folders || [],
          files: res.message.files || [],
          breadcrumbs: res.message.breadcrumbs || [],
        });
      }
      return res;
    } catch (error) {
      console.error("Error fetching folder content in store:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFolderStore;