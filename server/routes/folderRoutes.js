import { createFolder, shareFolder, getFolderContent, deleteFolder, restoreFolder } from "../controller/folderController.js";
import { Router } from "express";
import { protect } from "../middleware/protect.js";
import { findFoldersFiles } from "../controller/folderController.js";
const router = Router();

router.post("/create", protect, createFolder);
router.get("/", protect, findFoldersFiles);
router.post("/share", protect, shareFolder);
router.get("/allcontent/:id", protect, getFolderContent);
router.post("/delete/:id", protect, deleteFolder);
router.post("/restore/:id", protect, restoreFolder);

export default router;
