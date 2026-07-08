import prisma from "../prisma/prismaClient.js";

export const createFolder = async (req, res) => {
  const { folderName, parentId } = req.body;
  console.log("jhj", req.userId, folderName, parentId);

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
export const getFolderContent = async (req, res) => {
  const folderId = parseInt(req.params.folderId);
  const userId = req.userId;

  const collectAllContent = await collectFolderContent(folderId);
  try {
    return res.status(200).json({ message: collectAllContent });
  } catch (error) {
    return res.status(500).json({ message: "Interval server error" });
  }
};
