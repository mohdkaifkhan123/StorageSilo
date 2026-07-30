import React, { useState, useEffect, useRef } from "react";
import useFileStore from "../../../store/fileStore";
import useFolderStore from "../../../store/folderStore";

const MoreVerticalIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400 hover:text-gray-800 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
    />
  </svg>
);

const FolderIcon = () => (
  <svg
    className="h-5 w-5 text-amber-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
    />
  </svg>
);

const FileIcon = () => (
  <svg
    className="h-5 w-5 text-[#3B30EC]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TrashView() {
  const [trashData, setTrashData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const { getTrashData, restoreFile } = useFileStore();
  const { restoreFolder } = useFolderStore();

  const handleTrashData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getTrashData();
      if (res && Array.isArray(res.trashData)) {
        setTrashData(res.trashData);
      }
    } catch (err) {
      console.error("Error fetching trash data:", err);
      setError("Failed to load deleted items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleTrashData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRestoreClick = async (item) => {
    try {
      if (item.isFolder) {
        await restoreFolder(item.id);
      } else {
        await restoreFile(item.id);
      }
      setTrashData((prev) => prev.filter((i) => i.id !== item.id || i.isFolder !== item.isFolder));
      setActiveMenuId(null);
    } catch (err) {
      console.error("Failed to restore item:", err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pt-4 pb-12">
      <div className="text-center pb-4">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Trash <span className="text-[#3B30EC]">Bin</span>
        </h1>
        <p className="text-sm text-gray-500 mt-3 font-medium">
          Deleted files are stored here. Restore files to return them to your
          main library.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-[#3B30EC] rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-[#62626A]">
              Loading deleted items...
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-50/50 rounded-2xl border border-red-100">
          <p className="text-red-600 font-semibold mb-3">Error: {error}</p>
          <button
            onClick={handleTrashData}
            className="px-4 py-2 bg-white text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-sm"
          >
            Try Again
          </button>
        </div>
      ) : trashData.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
                  <p className="text-gray-500 text-sm font-medium">
                    Your trash bin is completely empty.
                  </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/30">
                  <th className="py-4 px-6 w-1/2">Name</th>
                  <th className="py-4 px-6 w-1/6">Type</th>
                  <th className="py-4 px-6 w-1/3">Deleted On</th>
                  <th className="py-4 px-6 w-1/6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {trashData.map((item) => (
                  <tr
                    key={`${item.isFolder ? "folder" : "file"}-${item.id}`}
                    className="hover:bg-gray-50/80 transition-all duration-200 group"
                  >
                    <td className="py-4 px-6 font-medium text-gray-700 flex items-center space-x-4">
                      <div className="p-2.5 bg-[#F3F2FF] rounded-lg shrink-0 border border-indigo-50/50 group-hover:scale-105 transition-transform duration-200">
                        {item.isFolder ? <FolderIcon /> : <FileIcon />}
                      </div>
                      <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-sm group-hover:text-[#3B30EC] transition-colors cursor-default">
                        {item.name}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-gray-500 font-medium text-xs">
                      <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${
                        item.isFolder ? "bg-amber-50 text-amber-600" : "bg-[#F4F4F7] text-[#62626A]"
                      }`}>
                        {item.isFolder ? "FOLDER" : (item.mimetype?.split("/")[1]?.toUpperCase() || "FILE")}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-gray-500 font-medium text-xs">
                      {formatDate(item.deletedAt)}
                    </td>

                    <td className="py-4 px-6 text-right relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === `${item.isFolder}-${item.id}` ? null : `${item.isFolder}-${item.id}`,
                          )
                        }
                        className={`p-2 rounded-lg transition-all duration-200 inline-flex items-center justify-center ${
                          activeMenuId === `${item.isFolder}-${item.id}`
                            ? "bg-gray-100 text-gray-900"
                            : "hover:bg-gray-100 text-gray-400"
                        }`}
                      >
                        <MoreVerticalIcon />
                      </button>

                      {activeMenuId === `${item.isFolder}-${item.id}` && (
                        <div
                          ref={menuRef}
                          className="absolute right-8 top-12 z-50 w-40 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 text-left animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                          <button
                            onClick={() => handleRestoreClick(item)}
                            className="w-full px-4 py-2.5 text-sm text-[#3B30EC] hover:bg-[#F3F2FF] font-medium flex items-center space-x-2.5 transition-colors"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                              />
                            </svg>
                            <span>Restore File</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
