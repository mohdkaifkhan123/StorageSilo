import prisma from "../prisma/prismaClient.js";

export const createFolder = async (req, res) => {
  console.log("follllll", req.body);
  const { folderName, parentId } = req.body;
  // console.log("jhj", req.userId, folderName, parentId);

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
// --- NEW HIGH-PERFORMANCE BREADCRUMB HELPER ---
const buildBreadcrumbs = async (folderId) => {
  const path = [];
  let currentFolderId = folderId;

  // Trace UP the tree until we hit a null parentId (the root)
  while (currentFolderId) {
    const folder = await prisma.folder.findUnique({
      where: { id: currentFolderId },
      select: { id: true, folderName: true, parentId: true },
    });

    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.folderName });
    currentFolderId = folder.parentId;
  }

  path.unshift({ id: null, name: "Home" }); // Use null here to stay consistent with frontend state
  return path;
};

// --- REFACTORED: SHALLOW-LOADING CONTROLLER ---
export const getFolderContent = async (req, res) => {
  const folderId = req.params.id;
  console.log("Fetching content for folder ID:", folderId);
  const userId = req.userId;

  try {
    // 1. Identify if we are viewing the top-level root ("Home")
    // Safe-check against undefined, "root", or the literal string "null" from the client URL
    const isRoot = !folderId || folderId === "root" || folderId === "null";
    const parsedFolderId = isRoot ? null : parseInt(folderId);
console.log("Final parsedFolderId sent to database query:", parsedFolderId);
    // 2. Fetch ONLY the immediate folders inside this directory
    const childFolders = await prisma.folder.findMany({
      where: {
        UserId: userId,
        parentId: parsedFolderId,
      },
    });

    // 3. Fetch ONLY the immediate files inside this directory
    const files = await prisma.file.findMany({
      where: {
        UserId: userId,
        FolderId: parsedFolderId,
      },
    });
    console.log("filesss", files);
    // 4. Generate the dynamic linear nav trail up to the root
    const breadcrumbs = isRoot
      ? [{ id: null, name: "Home" }]
      : await buildBreadcrumbs(parsedFolderId);

    // 5. UNIFY data: Combine files and folders into a single flat array
    // We append an explicit 'isFolder' property to make frontend rendering foolproof
    const unifiedContents = [
      ...childFolders.map((folder) => ({ ...folder, isFolder: true })),
      ...files.map((file) => ({ ...file, isFolder: false })),
    ];

    // 6. Send unified payload structure directly to frontend
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
