import React, { memo } from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal = memo(
  ({ isOpen, onConfirm, onCancel }: LogoutModalProps) => {
    if (!isOpen) return null;

    return (
      <>
        {/* Custom unique animation styles */}
        <style>{`
        @keyframes uniquePop {
          0% {
            opacity: 0;
            transform: scale(0.6) rotate(-8deg);
          }
          40% {
            opacity: 1;
            transform: scale(1.08) rotate(2deg);
          }
          70% {
            transform: scale(0.98) rotate(-1deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            backdrop-filter: blur(0);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(4px);
          }
        }
        .animate-uniquePop {
          animation: uniquePop 0.5s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>

        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with smooth fade + blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeInScale"
            onClick={onCancel}
          />

          {/* Modal Panel with unique pop animation */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-uniquePop">
            <h3 className="text-xl font-semibold text-gray-800">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </>
    );
  },
);

LogoutModal.displayName = "LogoutModal";

export default LogoutModal;
