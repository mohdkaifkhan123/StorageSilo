import prisma from "../prisma/prismaClient.js";

export const createFolder = async (req, res) => {
  const { folderName, parentId } = req.body;

  if (parentId) {
    const parent = await prisma.folder.findUnique({
      where: { id: parseInt(parentId) },
    });
    if (!parent || parent.UserId !== req.userId) {
      return res
        .status(403)
        .json({ message: "Parent folder not found or unauthorized" });
    }
  }
  try {
    const finalRes = await prisma.folder.create({
      data: {
        folderName: folderName,
        UserId: req.userId,
        parentId: parentId,
      },
    });
    res.status(200).json({ finalRes });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const findFoldersFiles = async (req, res) => {
  const userId = req.userId;
  const findAll = await prisma.folder.findMany({
    where: { UserId: userId },
    include: {
      files: true,
    },
  });
  if (findAll) return res.status(200).json({ message: findAll });
  return res.status(404).json({
    message: "Folder not found",
  });
};

export const shareFolder = async (req, res) => {
  const { email, permission, folderId } = req.body;

  const EmailValid = await prisma.user.findUnique({ where: { email: email } });
  if (!EmailValid) return res.status(404).json({ message: "User not found" });
  const sharedFolder = await prisma.shared.create({
    data: {
      folderId: folderId,
      senderUserId: req.userId,
      receiverUserId: EmailValid.id,
      permission: permission,
      createdAt: new Date(),
    },
  });

  if (shareFolder)
    return res.status(200).json({ message: "Shared folder info", shareFolder });
  return res.status(500).json({ message: "Internal server error" });
};

const collectFolderContent = async (folderId) => {
  const childFolders = await prisma.folder.findMany({
    where: {
      parentId: folderId,
    },
  });

  const files = await prisma.file.findMany({
    where: {
      FolderId: folderId,
    },
  });

  const nestedFolders = [];

  for (const folder of childFolders) {
    const childTree = await collectFolderContent(folder.id);

    nestedFolders.push({
      ...folder,
      folders: childTree.folders,
      files: childTree.files,
    });
  }

  return {
    files,
    folders: nestedFolders,
  };
};
const buildBreadcrumbs = async (folderId) => {
  const path = [];
  let currentFolderId = folderId;

  while (currentFolderId) {
    const folder = await prisma.folder.findUnique({
      where: { id: currentFolderId },
      select: { id: true, folderName: true, parentId: true },
    });

    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.folderName });
    currentFolderId = folder.parentId;
  }

  path.unshift({ id: null, name: "Home" }); 
  return path;
};

export const getFolderContent = async (req, res) => {
  const folderId = req.params.id;
  console.log("Fetching content for folder ID:", folderId);
  const userId = req.userId;

  try {
   
    const isRoot = !folderId || folderId === "root" || folderId === "null";
    const parsedFolderId = isRoot ? null : parseInt(folderId);
    console.log("Final parsedFolderId sent to database query:", parsedFolderId);
  
    const childFolders = await prisma.folder.findMany({
      where: {
        UserId: userId,
        parentId: parsedFolderId,
        isExplicitlyDeleted: false,
      },
    });

    const files = await prisma.file.findMany({
      where: {
        UserId: userId,
        FolderId: parsedFolderId,
        isExplicitlyDeleted: false,
      },
    });
    console.log("filesss", files);
    const breadcrumbs = isRoot
      ? [{ id: null, name: "Home" }]
      : await buildBreadcrumbs(parsedFolderId);

   
    const unifiedContents = [
      ...childFolders.map((folder) => ({ ...folder, isFolder: true })),
      ...files.map((file) => ({ ...file, isFolder: false })),
    ];

    return res.status(200).json({
      success: true,
      breadcrumbs,
      contents: unifiedContents,
    });
  } catch (error) {
    console.error("[getFolderContent Error]:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const folderId = parseInt(req.params.id);

    if (isNaN(folderId)) {
      return res.status(400).json({ message: "Invalid folder ID" });
    }

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      select: { id: true, UserId: true, isExplicitlyDeleted: true },
    });

    if (!folder) return res.status(404).json({ message: "Folder not found" });
    if (folder.UserId !== req.userId) return res.status(403).json({ message: "Unauthorized" });
    if (folder.isExplicitlyDeleted) return res.status(400).json({ message: "Folder is already deleted" });

  
    await prisma.folder.update({
      where: { id: folderId },
      data: {
        deletedAt: new Date(),
        isExplicitlyDeleted: true,
      },
    });

    return res.status(200).json({ message: "Folder moved to trash" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const restoreFolder = async (req, res) => {
  try {
    const folderId = parseInt(req.params.id);

    if (isNaN(folderId)) {
      return res.status(400).json({ message: "Invalid folder ID" });
    }

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      select: { id: true, UserId: true, isExplicitlyDeleted: true, parentId: true },
    });

    if (!folder) return res.status(404).json({ message: "Folder not found" });
    if (folder.UserId !== req.userId) return res.status(403).json({ message: "Unauthorized" });
    if (!folder.isExplicitlyDeleted) return res.status(400).json({ message: "Folder is not in trash" });

   
    let restoredParentId = folder.parentId;
    if (folder.parentId) {
      const parent = await prisma.folder.findUnique({
        where: { id: folder.parentId },
        select: { isExplicitlyDeleted: true },
      });
      if (parent?.isExplicitlyDeleted) {
        restoredParentId = null; 
      }
    }

    await prisma.folder.update({
      where: { id: folderId },
      data: {
        deletedAt: null,
        isExplicitlyDeleted: false,
        parentId: restoredParentId,
      },
    });

    return res.status(200).json({
      message: "Folder restored successfully",
      restoredToRoot: restoredParentId === null && folder.parentId !== null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
