import React, { useState } from "react";
import {
  useDeleteProfileImageMutation,
  useMakeCurrentProfileImageMutation,
  useProfileImageGalleryQuery,
} from "../../features/profile/profileApi";
import {
  FaTrash,
  FaUserCheck,
  FaExpand,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { showSuccessToast } from "../../utils/showSuccessToast";

interface ImageType {
  id: number;
  image: string;
  is_profile?: boolean;
  created_at?: string;
}

const ProfileImages = () => {
  const { data, isLoading, isError, refetch } = useProfileImageGalleryQuery();
  const [makeCurrentProfileImage, { isLoading: isSettingProfile }] =
    useMakeCurrentProfileImageMutation();
  const [deleteProfileImage, { isLoading: isDeleting }] =
    useDeleteProfileImageMutation();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const images: ImageType[] = data?.results || [];
  const profileImageId = images.find((img) => img.is_profile)?.id;

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const res = await deleteProfileImage(id).unwrap();
        showSuccessToast(res.message || "Profile image deleted successfully");
        refetch();
        if (selectedImageIndex !== null) closeSlider();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleSetProfile = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await makeCurrentProfileImage(id).unwrap();
      showSuccessToast(res.message || "Profile image updated successfully");
      refetch();
    } catch (error) {
      console.error("Set profile failed:", error);
    }
  };

  const openSlider = (index: number) => setSelectedImageIndex(index);
  const closeSlider = () => setSelectedImageIndex(null);

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load profile images. Please try again later.
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner">
        <div className="text-gray-400 text-6xl mb-3">📷</div>
        <p className="text-gray-500 font-medium">No profile images yet.</p>
        <p className="text-gray-400 text-sm mt-1">Upload your first image!</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Profile Gallery
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {images.length} {images.length === 1 ? "image" : "images"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100 transform hover:-translate-y-1"
              onClick={() => openSlider(idx)}
            >
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={image.image}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Profile Badge */}
              {image.id === profileImageId && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow-md">
                  <FaUserCheck size={10} /> Profile
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20 backdrop-blur-sm">
                <button
                  onClick={(e) => handleSetProfile(image.id, e)}
                  disabled={image.id === profileImageId}
                  className="p-2.5 bg-blue-500 rounded-full hover:bg-blue-600 transition text-white disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-110"
                  title="Set as Profile Image"
                >
                  {isSettingProfile ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaUserCheck />
                  )}
                </button>
                <button
                  onClick={(e) => handleDelete(image.id, e)}
                  disabled={isDeleting}
                  className="p-2.5 bg-red-500 rounded-full hover:bg-red-600 transition text-white transform hover:scale-110"
                  title="Delete"
                >
                  {isDeleting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openSlider(idx);
                  }}
                  className="p-2.5 bg-white rounded-full hover:bg-gray-100 transition text-gray-700 transform hover:scale-110"
                  title="Expand"
                >
                  <FaExpand />
                </button>
              </div>

              {/* Date Badge */}
              {image.created_at && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md z-10 backdrop-blur-sm">
                  {new Date(image.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Slider Modal */}
      {selectedImageIndex !== null && images[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center transition-all duration-300"
          onClick={closeSlider}
        >
          <div
            className="relative max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImageIndex].image}
              alt="Full size"
              className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Navigation Buttons */}
            {selectedImageIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              >
                <FaChevronLeft size={24} />
              </button>
            )}
            {selectedImageIndex < images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              >
                <FaChevronRight size={24} />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={closeSlider}
              className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all duration-200 hover:scale-110"
            >
              <FaTimes size={20} />
            </button>

            {/* Image Counter & Profile Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
              <span>
                {selectedImageIndex + 1} / {images.length}
              </span>
              {images[selectedImageIndex].id === profileImageId && (
                <span className="text-green-400 flex items-center gap-1">
                  <FaUserCheck size={12} /> Profile Image
                </span>
              )}
            </div>

            {/* Action Buttons inside Slider */}
            <div className="absolute bottom-4 right-4 flex gap-3">
              {images[selectedImageIndex].id !== profileImageId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetProfile(images[selectedImageIndex].id, e as any);
                    closeSlider();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaUserCheck /> Set as Profile
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(images[selectedImageIndex].id, e as any);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImages;
