import React, { useState, useEffect } from "react";
import { FolderPlus, X } from "lucide-react";

const CreateFolderModal = ({ isOpen, onClose, onSubmit }) => {
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset input field when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setFolderName("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(folderName.trim());
      onClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[10000] animate-in fade-in duration-200">
      <div className="bg-white border border-[#E2E2E9] rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200 flex flex-col gap-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FolderPlus size={18} />
            </div>
            <h3 className="text-sm font-bold text-[#0F0F14]">New Folder</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-[#82828A] hover:text-[#0F0F14] p-1 hover:bg-[#F4F4F7] rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-[#62626A] uppercase tracking-wider">
              Folder Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter name (e.g., Marketing Assets)"
              className="w-full bg-[#F4F4F7] border border-[#E2E2E9] rounded-xl px-4 py-2.5 text-xs text-[#0F0F14] placeholder-[#82828A] focus:outline-none focus:border-[#3B30EC] transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#4A4A52] hover:bg-[#F4F4F7] border border-[#D1D1DB] rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim() || isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-[#3B30EC] hover:bg-[#2A20DF] disabled:bg-[#3B30EC]/50 rounded-xl shadow-sm transition active:scale-[0.98]"
            >
              {isSubmitting ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;