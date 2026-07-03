import React, { useState, useEffect } from 'react';

export function DynamicToast({ title, message = "", type = "error", onClose }) {
  const [visible, setVisible] = useState(true);

  // Set default title based on type if not explicitly provided
  const displayTitle = title || (type === "success" ? "Success" : "Error");

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  // Automatically close after 3 seconds (3000ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [onClose]);

  if (!visible) return null;

  // Configuration for variant-specific styles
  const isSuccess = type === "success";
  const borderClass = isSuccess ? "border-green-500" : "border-red-500";
  const iconColorClass = isSuccess ? "text-green-500" : "text-red-500";

  return (
    <div className={`flex items-center w-full max-w-sm p-4 bg-white rounded-xl shadow-lg border-l-4 ${borderClass} relative`}>
      <div className="flex items-start space-x-3 pr-8">
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess ? (
            /* Success Icon (Checkmark) */
            <svg className={`w-5 h-5 ${iconColorClass} fill-current`} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          ) : (
            /* Error Icon (Exclamation) */
            <svg className={`w-5 h-5 ${iconColorClass} fill-current`} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800 capitalize">{displayTitle}</h3>
          {message && <p className="text-sm text-gray-500 mt-1">{message}</p>}
        </div>
      </div>
      <button onClick={handleClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <svg className="w-4 h-4 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}