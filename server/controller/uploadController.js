import prisma from "../prisma/prismaClient.js";
import s3 from "../config/awsS3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const preSignedURL = async (req, res) => {
  const { name, type } = req.body;
  console.log(name, type);
  if (!type || !name)
    return res
      .status(400)
      .json({ message: "fileName and fileType are required" });
  const s3Key = `upload/${req.userId}/${Date.now()}-${name}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    ContentType: type,
  });
  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 });
  try {
    res.status(200).json({ uploadURL, s3Key });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { originalname, path, size, mimetype, FolderId } = req.body;
    const file = await prisma.file.create({
      data: {
        fileName: originalname,
        fileUrl: path,
        fileSize: size,
        UserId: req.userId,
        mimetype: mimetype,
        FolderId: parseInt(FolderId),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    return res.status(200).json({ message: "File saved successfully", file });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const getDownloadUrl = async (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const userId = req.user.id;

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        UserId: userId,
        deletedAt: null,
      },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found or is in trash" });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.fileUrl,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(file.fileName)}"`,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return res.status(200).json({ downloadUrl });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getFile = async (req, res) => {
  try {
    console.log("reqqq", req.userId);
    const userId = req.userId;
    const fileList = await prisma.file.findMany({
      where: {
        UserId: userId,
        deletedAt: null,
      },
    });
    return res.status(200).json({ message: "Files retrieved", fileList });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    await prisma.file.update({
      where: { id: parseInt(fileId) },
      data: { deletedAt: new Date(), isExplicitlyDeleted: true },
    });
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const getTrashData = async (req, res) => {
  try {
    const [files, folders] = await Promise.all([
      prisma.file.findMany({
        where: { UserId: req.userId, isExplicitlyDeleted: true },
      }),
      prisma.folder.findMany({
        where: { UserId: req.userId, isExplicitlyDeleted: true },
      }),
    ]);

    const trashData = [
      ...folders.map((f) => ({ ...f, isFolder: true, name: f.folderName })),
      ...files.map((f) => ({ ...f, isFolder: false, name: f.fileName })),
    ];

    return res.status(200).json({ trashData });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const shareFile = async (req, res) => {
  const { fileId, email, permission } = req.body;
  const findUserByMail = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!findUserByMail)
    return res.status(404).json({ message: "User not found" });
  if (req.userId === findUserByMail.id)
    return res.status(403).json({ message: "Can't shared with yourself" });
  try {
    const sharedData = await prisma.shared.create({
      data: {
        fileId: fileId,
        senderUserId: req.userId,
        receiverUserId: findUserByMail.id,
        createdAt: new Date(),
        permission: permission,
      },
    });
    return res.status(200).json({ message: sharedData });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const removeAccess = async (req, res) => {
  const { shareId } = req.body;

  try {
    const sharedData = await prisma.shared.delete({
      where: { id: shareId },
    });
    return res.status(200).json({ message: "Access removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const restoreFile = async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.file.update({
      where: { id: parseInt(id) },
      data: { deletedAt: null, isExplicitlyDeleted: false },
    });

    return res.status(200).json({ message: "File restore" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
