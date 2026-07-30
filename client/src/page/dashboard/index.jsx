import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useFileStore from "../../store/fileStore";
import useFolderStore from "../../store/folderStore";
import {
  Upload,
  FolderPlus,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Folder,
  FileText,
  HardDrive,
  Share2,
  Clock,
  Star,
  Trash2,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import FileMenuModal from "../../components/modal";
import TrashView from "./tabs/TrashPage";
import CreateFolderModal from "../../components/CreateFolderModal";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [currentTab, setCurrentTab] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const navigate = useNavigate();

  const { presignedURL, saveMetaDataStore, deleteFiles, downloadFile } = useFileStore();
  
  // FIXED: Destructure 'folders' and 'files' instead of 'contents'
  const { createFolder, deleteFolder, folders, files, breadcrumbs, fetchFolderContent } = useFolderStore();
  const inputFileRef = useRef();

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || isNaN(bytes)) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (currentTab === "all") {
      fetchFolderContent(currentFolderId);
    }
  }, [currentFolderId, currentTab]);

  // COMBINE FOLDERS AND FILES INTO ONE ARRAY FOR THE UI
  const items = useMemo(() => {
    const safeFolders = Array.isArray(folders) ? folders : [];
    const safeFiles = Array.isArray(files) ? files : [];

    const mappedFolders = safeFolders.map((folder) => ({
      ...folder,
      name: folder.folderName || folder.name || "Untitled Folder",
      size: "—",
      type: "FOLDER",
      isFolder: true, // Force this to true so the UI knows it's a folder
      date: formatDate(folder.createdAt || folder.updatedAt),
      shared: "Only you",
    }));

    const mappedFiles = safeFiles.map((file) => ({
      ...file,
      name: file.fileName || file.originalname || file.name || "Untitled File",
      size: formatBytes(file.fileSize || file.size),
      type: file.mimetype?.split("/")[1]?.toUpperCase() || file.mimetype?.toUpperCase() || "UNKNOWN",
      isFolder: false,
      date: formatDate(file.createdAt || file.updatedAt),
      shared: file.shares?.length > 0 ? `${file.shares.length} users` : "Only you",
    }));

    // Return combined array (Folders first, then files)
    return [...mappedFolders, ...mappedFiles];
  }, [folders, files]);

  // Handle Breadcrumbs safely
  const activeBreadcrumbs = useMemo(() => {
    return Array.isArray(breadcrumbs) ? breadcrumbs : [];
  }, [breadcrumbs]);

  const routeSetting = () => navigate("/setting");
  const handleFileSelection = () => inputFileRef.current.click();

  const uploadFile = async (metadata) => {
    if (!metadata) return;
    const { name, type, size } = metadata;
    const urlData = await presignedURL({ name, type });
    const res = await fetch(urlData.uploadURL, {
      method: "PUT",
      body: metadata,
      headers: { "Content-Type": metadata.type },
    });
    if (res.ok) {
      await saveMetaDataStore({
        originalname: name,
        path: urlData.s3Key,
        size: size,
        mimetype: type,
        FolderId: currentFolderId ? parseInt(currentFolderId) : null,
      });
      await fetchFolderContent(currentFolderId);
    }
  };

  const handleFileChange = async (e) => {
    await uploadFile(e.target.files[0]);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    await uploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleOpenMenu = (e, file) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ x: rect.right, y: rect.bottom + window.scrollY + 4 });
    setSelectedFile(file);
    setMenuOpen(true);
  };

  const handleDeleteAction = async (id) => {
    try {
      if (selectedFile?.isFolder) {
        await deleteFolder(id);
      } else {
        await deleteFiles(id);
      }
      await fetchFolderContent(currentFolderId);
    } catch (error) {
      console.error("Error executing delete pipeline:", error);
    }
  };

  const handleCreateFolderSubmit = async (folderName) => {
    try {
      if (createFolder) {
        await createFolder({ 
          folderName: folderName, 
          parentId: currentFolderId ? parseInt(currentFolderId) : null 
        });
        await fetchFolderContent(currentFolderId);
      }
    } catch (error) {
      console.error("Failed to post folder creation request:", error);
      throw error;
    }
  };

  const handleItemClick = (item) => {
    if (item.isFolder) {
      setCurrentFolderId(item.id);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#F9F9FB] text-[#1E1E24] font-sans flex m-0 p-0 overflow-hidden select-none z-[9999]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F0F0F5] border-r border-[#E2E2E9] hidden md:flex flex-col justify-between p-4 shrink-0 h-full">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="bg-[#3B30EC] p-2 rounded-xl text-white shadow-md shadow-indigo-600/10">
              <HardDrive size={18} />
            </div>
            <span className="text-md font-bold tracking-tight text-[#0F0F14]">
              Storage<span className="text-[#3B30EC]">silo</span>
            </span>
          </div>

          <div className="space-y-2 px-1">
            <input
              ref={inputFileRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleFileSelection}
              className="w-full flex items-center justify-between bg-[#3B30EC] hover:bg-[#2A20DF] text-white text-sm font-medium p-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <Upload size={16} /> Upload items
              </span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">
                ↑
              </span>
            </button>

            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="w-full flex items-center gap-2 bg-white hover:bg-[#F5F5FA] text-[#4A4A52] border border-[#D1D1DB] text-sm font-medium p-3 rounded-xl transition-all shadow-sm active:scale-[0.99]"
            >
              <FolderPlus size={16} className="text-emerald-600" /> Create folder
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { id: "all", label: "All files", icon: Folder },
              { id: "recent", label: "Recent", icon: Clock },
              { id: "starred", label: "Starred", icon: Star },
              { id: "trash", label: "Deleted items", icon: Trash2 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (item.id === "all") setCurrentFolderId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentTab === item.id
                      ? "bg-white text-[#3B30EC] shadow-sm font-semibold"
                      : "text-[#62626A] hover:text-[#0F0F14] hover:bg-[#E8E8EF]"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-white border border-[#E2E2E9] p-4 rounded-xl space-y-2 shadow-sm">
          <div className="flex justify-between text-[11px] font-mono text-[#62626A]">
            <span>Storage status</span>
            <span className="text-[#3B30EC] font-bold">64% used</span>
          </div>
          <div className="w-full bg-[#E8E8EF] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#3B30EC] to-purple-500 h-full w-[64%]"></div>
          </div>
          <div className="text-[10px] text-[#82828A] flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            All Nodes Connected
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#F9F9FB]">
        <header className="h-16 border-b border-[#E2E2E9] bg-white px-6 flex items-center justify-between w-full shrink-0">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82828A]" size={14} />
            <input
              type="text"
              placeholder="Search content, files..."
              className="w-full bg-[#F4F4F7] border border-[#E2E2E9] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#0F0F14] placeholder-[#82828A] focus:outline-none focus:border-[#3B30EC]/50 transition"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-[#62626A]">
            <button className="hover:text-[#0F0F14] transition hidden sm:flex items-center gap-1.5 font-medium">
              <Share2 size={14} /> Share Workspace
            </button>
            <div onClick={routeSetting} className="flex items-center gap-2.5 pl-4 border-l border-[#E2E2E9] cursor-pointer">
              <div className="text-right hidden lg:block">
                <p className="text-xs font-semibold text-[#0F0F14]">kkdw</p>
                <p className="text-[10px] text-[#82828A]">khank11111999@gmail.com</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#3B30EC] border border-white flex items-center justify-center text-white text-xs font-bold font-mono shadow-sm">
                M
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 w-full">
          {currentTab === "trash" ? (
            <TrashView />
          ) : (
            <>
              {/* Dropzone */}
              <div
                onClick={handleFileSelection}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`w-full border border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm ${
                  isDragOver
                    ? "border-[#3B30EC] bg-[#F0EFFE]"
                    : "border-[#C4C4D0] hover:border-[#3B30EC] bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#F4F4F7] border border-[#E2E2E9] group-hover:border-[#3B30EC]/30 flex items-center justify-center text-[#62626A] group-hover:text-[#3B30EC] transition-colors mb-3">
                  <Upload size={18} />
                </div>
                <p className="text-sm font-semibold text-[#0F0F14]">Drag and drop files to instantly upload</p>
                <p className="text-xs text-[#82828A] mt-0.5">Or click here to browse files from your computer</p>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-[#E2E2E9] pb-3 w-full">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#62626A]">
                  {activeBreadcrumbs.length > 0 ? activeBreadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.id || index}>
                      <span 
                        onClick={() => setCurrentFolderId(crumb.id)} 
                        className={`hover:text-[#0F0F14] cursor-pointer transition-colors ${
                          index === activeBreadcrumbs.length - 1 ? "text-[#3B30EC] font-semibold" : ""
                        }`}
                      >
                        {crumb.name || crumb.folderName || "Folder"}
                      </span>
                      {index < activeBreadcrumbs.length - 1 && <ChevronRight size={12} />}
                    </React.Fragment>
                  )) : (
                    <span className="text-[#3B30EC] font-semibold">Root</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-[#E8E8EF] p-0.5 rounded-md flex items-center">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white text-[#3B30EC] shadow-xs" : "text-[#82828A] hover:text-[#0F0F14]"}`}
                    >
                      <LayoutGrid size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded ${viewMode === "list" ? "bg-white text-[#3B30EC] shadow-xs" : "text-[#82828A] hover:text-[#0F0F14]"}`}
                    >
                      <List size={14} />
                    </button>
                  </div>
                  <button className="bg-white border border-[#E2E2E9] text-xs text-[#4A4A52] font-medium px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs hover:bg-[#F4F4F7]">
                    <ArrowUpDown size={12} /> Sort
                  </button>
                </div>
              </div>

              {/* Empty State Handler */}
              {items.length === 0 ? (
                <div className="w-full text-center py-12 text-[#82828A]">
                  <Folder size={48} className="mx-auto mb-4 text-[#C4C4D0] opacity-50" />
                  <p className="text-sm">This folder is empty.</p>
                </div>
              ) : (
                <>
                  {/* Grid View */}
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 w-full">
                      {items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          onClick={() => handleItemClick(item)}
                          className={`bg-white border rounded-xl p-4 transition-all group relative flex flex-col justify-between h-40 shadow-xs hover:shadow-md cursor-pointer ${
                            item.isFolder ? "border-amber-100 hover:border-amber-500/60" : "border-[#E2E2E9] hover:border-[#3B30EC]/60"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className={`p-2.5 border rounded-xl transition-all ${
                              item.isFolder 
                                ? "bg-amber-50/70 border-amber-100 text-amber-500 group-hover:bg-amber-500 group-hover:text-white"
                                : "bg-[#F4F4F7] border-[#E2E2E9] text-[#3B30EC] group-hover:bg-[#3B30EC] group-hover:text-white"
                            }`}>
                              {item.isFolder ? <Folder size={18} /> : <FileText size={18} />}
                            </div>
                            <button
                              onClick={(e) => handleOpenMenu(e, item)}
                              className="text-[#82828A] hover:text-[#0F0F14] p-1 hover:bg-[#F2F2F7] rounded-full transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#0F0F14] truncate mb-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#82828A]">
                              <span>{item.size}</span>
                              <span className={`px-1.5 py-0.5 rounded font-bold ${
                                item.isFolder ? "bg-amber-50 text-amber-600 text-[10px]" : "bg-[#F4F4F7] text-[#62626A]"
                              }`}>
                                {item.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* List View */}
                  {viewMode === "list" && (
                    <div className="bg-white border border-[#E2E2E9] rounded-xl overflow-hidden shadow-xs w-full">
                      <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#E2E2E9] bg-[#F4F4F7] text-[#62626A] uppercase font-mono tracking-wider">
                              <th className="p-4 font-semibold">Name</th>
                              <th className="p-4 font-semibold">Size</th>
                              <th className="p-4 font-semibold">Access</th>
                              <th className="p-4 font-semibold text-right">Modified</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E2E9]">
                            {items.map((item, idx) => (
                              <tr 
                                key={item.id || idx} 
                                onClick={() => handleItemClick(item)}
                                className="hover:bg-[#F9F9FB] transition group cursor-pointer"
                              >
                                <td className={`p-4 flex items-center gap-3 font-semibold transition ${
                                  item.isFolder ? "text-[#0F0F14] group-hover:text-amber-500" : "text-[#0F0F14] group-hover:text-[#3B30EC]"
                                }`}>
                                  {item.isFolder ? (
                                    <Folder size={16} className="text-amber-500" />
                                  ) : (
                                    <FileText size={16} className="text-[#3B30EC]" />
                                  )}
                                  {item.name}
                                </td>
                                <td className="p-4 text-[#62626A] font-mono">{item.size}</td>
                                <td className="p-4 text-[#62626A]">{item.shared}</td>
                                <td className="p-4 text-[#82828A] text-right font-mono">{item.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <FileMenuModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorPosition={menuPosition}
        file={selectedFile}
        onDelete={handleDeleteAction}
        onDownload={(file) => downloadFile(file.id)}
      />

      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSubmit={handleCreateFolderSubmit}
      />
    </div>
  );
};

export default Dashboard;