import React, { useState, memo, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { useUploadCoverImageMutation } from "../../features/profile/profileApi";
import { showErrorToast } from "../../utils/showErrorToast";
import { FaRegImage, FaUpload } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

interface CoverImageProps {
  isOpen: boolean;
  onClose: () => void;
}

const CoverImage = ({ isOpen, onClose }: CoverImageProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCoverImage, { isLoading }] = useUploadCoverImageMutation();

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);

      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const getCroppedImg = async (imageSrc: string, crop: any) => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx?.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], "cover.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    });
  };

  const handleUpload = async () => {
    if (!selectedImage || !croppedAreaPixels || !preview) return;

    try {
      const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
      const formData = new FormData();
      formData.append("image", croppedImage);

      await uploadCoverImage(formData).unwrap();

      if (preview) URL.revokeObjectURL(preview);
      setSelectedImage(null);
      setPreview(null);
      setCroppedAreaPixels(null);
      onClose();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleClose = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedImage(null);
    setPreview(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    onClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100 border cursor-pointer hover:border-black"
            aria-label="Close"
          >
            <MdOutlineClose />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Cover Image</h2>
              <p className="text-sm text-gray-500">
                Upload and crop your cover photo (16:9)
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {preview ? (
            <div className="space-y-4">
              <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-inner">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedPixels) =>
                    setCroppedAreaPixels(croppedPixels)
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                    Zoom
                  </span>
                  <span className="text-purple-600 font-medium">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <button
                onClick={triggerFileInput}
                className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 cursor-pointer"
              >
                Choose different image
              </button>
            </div>
          ) : (
            <div
              onClick={triggerFileInput}
              className="relative group cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all hover:border-purple-400">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                  <FaRegImage />
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-medium cursor-pointer">
                    Click to upload cover image
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    PNG, JPG up to 5MB (16:9 recommended)
                  </p>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedImage || !croppedAreaPixels || isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CoverImage);
