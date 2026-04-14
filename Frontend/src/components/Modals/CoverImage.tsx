import React, { useState, memo } from "react";
import { useUploadCoverImageMutation } from "../../features/profile/profileApi";
import { showErrorToast } from "../../utils/showErrorToast";

interface CoverImageProps {
  isOpen: boolean;
  onClose: () => void;
}

const CoverImage = ({ isOpen, onClose }: CoverImageProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [uploadCoverImage, { isLoading }] = useUploadCoverImageMutation();

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      await uploadCoverImage(formData).unwrap();

      setSelectedImage(null);
      setPreview(null);
      onClose();
    } catch (error) {
      showErrorToast(error);
    }
  };
  const handleClose = () => {
    setSelectedImage(null);
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload Cover Image
        </h2>

        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-40 flex items-center justify-center border-2 border-dashed rounded-lg mb-4 text-gray-400">
            No Image Selected
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!selectedImage}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Uploading" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(CoverImage);
