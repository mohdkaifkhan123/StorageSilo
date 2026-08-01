import {
  uploadFile,
  getFile,
  deleteFile,
  shareFile,
  removeAccess,
  preSignedURL,
  getTrashData,
  restoreFile,
  getDownloadUrl,
  renameFile
} from "../controller/uploadController.js";
import Router from "express";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/protect.js";
const router = Router();

router.post("/upload", protect, uploadFile);
router.get("/list", protect, getFile);
router.patch("/delete/:id", protect, deleteFile);
router.post("/share",protect,shareFile)
router.post("/remove",protect,removeAccess)
router.post("/signedurl",protect,preSignedURL)
router.get("/trash",protect,getTrashData)
router.put("/restore/:id",protect,restoreFile)
router.get("/download/:id",getDownloadUrl)
router.patch("/rename/:id", protect, renameFile)
export default router;
