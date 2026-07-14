import React, { useEffect, useRef } from "react";
import { Info, Download, Share2, Edit2, Trash2 } from "lucide-react";

const FileMenuModal = ({
  isOpen,
  onClose,
  anchorPosition,
  file,
  onDelete,
  onRename,
  onShare,
  onDownload,
  onDetails,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !anchorPosition) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${anchorPosition.y}px`,
        left: `${anchorPosition.x}px`,
      }}
      className="w-44 bg-white border border-[#E0E0E6] rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 transform -translate-x-full"
    >
      <button
        onClick={() => {
          onDetails?.(file);
          onClose();
        }}
        className="w-full px-3 py-2 text-sm text-[#4A4A52] hover:bg-[#F2F2F7] flex items-center gap-2.5 transition-colors"
      >
        <Info size={15} className="text-[#82828A]" />
        <span>Details</span>
      </button>

      <button
        onClick={() => {
          onDownload?.(file);
          onClose();
        }}
        className="w-full px-3 py-2 text-sm text-[#4A4A52] hover:bg-[#F2F2F7] flex items-center gap-2.5 transition-colors"
      >
        <Download size={15} className="text-[#82828A]" />
        <span>Download</span>
      </button>

      <button
        onClick={() => {
          onShare?.(file);
          onClose();
        }}
        className="w-full px-3 py-2 text-sm text-[#4A4A52] hover:bg-[#F2F2F7] flex items-center gap-2.5 transition-colors"
      >
        <Share2 size={15} className="text-[#82828A]" />
        <span>Share</span>
      </button>

      <button
        onClick={() => {
          onRename?.(file);
          onClose();
        }}
        className="w-full px-3 py-2 text-sm text-[#4A4A52] hover:bg-[#F2F2F7] flex items-center gap-2.5 transition-colors"
      >
        <Edit2 size={15} className="text-[#82828A]" />
        <span>Rename</span>
      </button>

      <hr className="border-[#E0E0E6] my-1" />

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (file && onDelete) onDelete(file.id);
          onClose();
        }}
        className="w-full px-3 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2.5 transition-colors font-medium"
      >
        <Trash2 size={15} className="text-[#EF4444]" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default FileMenuModal;
