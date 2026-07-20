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
fetchFolderContent: async (folderId = null) => {
    set({ loading: true });
    try {
      // API returns { success, breadcrumbs, contents } — contents is a unified array
      // with isFolder: true/false on each item
      const res = await folderService.getAllContent(folderId);
      const contents = Array.isArray(res?.contents) ? res.contents : [];

      set({
        folders: contents.filter((item) => item.isFolder === true),
        files: contents.filter((item) => item.isFolder === false),
        breadcrumbs: Array.isArray(res?.breadcrumbs) ? res.breadcrumbs : [],
      });

      return res;
    } catch (error) {
      console.error("Error fetching folder content in store:", error);
      // Ensure we don't leave the UI in a broken state on error
      set({ folders: [], files: [], breadcrumbs: [] }); 
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFolderStore;