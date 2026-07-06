import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FolderPlus,
  Download,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Folder,
  FileText,
  HardDrive,
  Share2,
  ShieldCheck,
  Clock,
  Star,
  Trash2,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [currentTab, setCurrentTab] = useState("all");
  const navigate = useNavigate();
  const mockFiles = [
    {
      name: "modal.PNG",
      type: "PNG",
      size: "124.41 KB",
      date: "Jul 4, 2026",
      shared: "Only you",
    },
    {
      name: "production-logs.txt",
      type: "TXT",
      size: "14.20 KB",
      date: "Jul 3, 2026",
      shared: "3 teams",
    },
    {
      name: "architecture-v2.pdf",
      type: "PDF",
      size: "2.4 MB",
      date: "Jun 28, 2026",
      shared: "Only you",
    },
  ];
  const routeSetting = () => {
    navigate("/setting");
  };
  return (
 
    <div className="fixed inset-0 w-screen h-screen bg-[#F9F9FB] text-[#1E1E24] font-sans flex m-0 p-0 overflow-hidden select-none z-[9999]">
      <aside className="w-64 bg-[#F0F0F5] border-r border-[#E2E2E9] hidden md:flex flex-col justify-between p-4 shrink-0 h-full">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="bg-[#3B30EC] p-2 rounded-xl text-white shadow-md shadow-indigo-600/10">
              <HardDrive size={18} />
            </div>
            <span className="text-md font-bold tracking-tight text-[#0F0F14]">
              Storemy<span className="text-[#3B30EC]">stuff</span>
            </span>
          </div>

          <div className="space-y-2 px-1">
            <button className="w-full flex items-center justify-between bg-[#3B30EC] hover:bg-[#2A20DF] text-white text-sm font-medium p-3 rounded-xl shadow-md transition-all active:scale-[0.98]">
              <span className="flex items-center gap-2">
                <Upload size={16} /> Upload items
              </span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">
                ↑
              </span>
            </button>
            <button className="w-full flex items-center gap-2 bg-white hover:bg-[#F5F5FA] text-[#4A4A52] border border-[#D1D1DB] text-sm font-medium p-3 rounded-xl transition-all shadow-sm">
              <FolderPlus size={16} className="text-emerald-600" /> Create
              folder
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
                  onClick={() => setCurrentTab(item.id)}
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

      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#F9F9FB]">
        <header className="h-16 border-b border-[#E2E2E9] bg-white px-6 flex items-center justify-between w-full shrink-0">
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82828A]"
              size={14}
            />
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
            <div
              onClick={routeSetting}
              className="flex items-center gap-2.5 pl-4 border-l border-[#E2E2E9]"
            >
              <div className="text-right hidden lg:block">
                <p className="text-xs font-semibold text-[#0F0F14]">kkdw</p>
                <p className="text-[10px] text-[#82828A]">
                  khank11111999@gmail.com
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#3B30EC] border border-white flex items-center justify-center text-white text-xs font-bold font-mono shadow-sm">
                M
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto space-y-6 w-full">
          <div className="w-full border border-dashed border-[#C4C4D0] hover:border-[#3B30EC] bg-white rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#F4F4F7] border border-[#E2E2E9] group-hover:border-[#3B30EC]/30 flex items-center justify-center text-[#62626A] group-hover:text-[#3B30EC] transition-colors mb-3">
              <Upload size={18} />
            </div>
            <p className="text-sm font-semibold text-[#0F0F14]">
              Drag and drop files to instantly upload
            </p>
            <p className="text-xs text-[#82828A] mt-0.5">
              Or click here to browse files from your computer
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#E2E2E9] pb-3 w-full">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#62626A]">
              <span className="hover:text-[#0F0F14] cursor-pointer">Home</span>
              <ChevronRight size={12} />
              <span className="text-[#3B30EC] font-medium truncate">
                root-khanfghj...
              </span>
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

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 w-full">
              {mockFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E2E2E9] hover:border-[#3B30EC]/60 rounded-xl p-4 transition-all group relative flex flex-col justify-between h-40 shadow-xs hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-[#F4F4F7] border border-[#E2E2E9] rounded-xl text-[#3B30EC] group-hover:bg-[#3B30EC] group-hover:text-white transition-all">
                      <FileText size={18} />
                    </div>
                    <button className="text-[#82828A] hover:text-[#0F0F14] p-1 rounded">
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#0F0F14] truncate mb-1">
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#82828A]">
                      <span>{file.size}</span>
                      <span className="bg-[#F4F4F7] px-1.5 py-0.5 rounded text-[#62626A] font-bold">
                        {file.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                    {mockFiles.map((file, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#F9F9FB] transition group"
                      >
                        <td className="p-4 flex items-center gap-3 text-[#0F0F14] font-semibold group-hover:text-[#3B30EC] transition">
                          <FileText size={16} className="text-[#3B30EC]" />
                          {file.name}
                        </td>
                        <td className="p-4 text-[#62626A] font-mono">
                          {file.size}
                        </td>
                        <td className="p-4 text-[#62626A]">{file.shared}</td>
                        <td className="p-4 text-[#82828A] text-right font-mono">
                          {file.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
