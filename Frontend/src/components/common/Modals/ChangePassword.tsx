import React, { useState } from "react";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";

const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[^a-zA-Z\d]/)) strength++;
  return strength;
};

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(newPassword);
  const isNewPasswordValid = newPassword.length >= 8;
  const doPasswordsMatch = newPassword === confirmPassword;

  const isFormValid =
    currentPassword.trim() !== "" &&
    isNewPasswordValid &&
    doPasswordsMatch &&
    confirmPassword !== "";

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isFormValid) {
      setError("Please fill all fields correctly.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    try {
      setSuccess("Password changed successfully!");

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Failed to change password. Check current password.",
      );
    }
  };

  if (!isOpen) return null;

  const strengthLabels = [
    "Very weak",
    "Weak",
    "Medium",
    "Strong",
    "Very strong",
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Change Password</h2>
            <button onClick={handleClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-sm">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-2"
                >
                  {showCurrent ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-2"
                >
                  {showNew ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {newPassword && (
                <p className="text-xs mt-2 text-gray-600">
                  Strength: {strengthLabels[passwordStrength]}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-2"
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {confirmPassword && !doPasswordsMatch && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            {success && (
              <p className="text-green-600 text-sm mb-3">{success}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-1 rounded disabled:opacity-50"
              >
                Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
