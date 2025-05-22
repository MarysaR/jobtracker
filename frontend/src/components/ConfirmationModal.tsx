import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
  danger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-orange-200/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full mx-4 border border-orange-200/50">
        <div className="p-6">
          {/* Icône et titre */}
          <div className="flex items-center mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                danger
                  ? "bg-red-100 text-red-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {danger ? "⚠️" : "❓"}
            </div>
            <h3 className="text-lg font-bold text-orange-900">{title}</h3>
          </div>

          {/* Message */}
          <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-lg font-medium transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-3 text-white rounded-lg font-bold transition-all shadow-lg ${
                danger
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
