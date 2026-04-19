import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  FiSave,
  FiX,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiTwitter,
  FiGithub,
  FiLinkedin,
  FiBriefcase,
  FiAlertCircle,
} from "react-icons/fi";

import { useUpdateProfileMutation } from "../../features/profile/profileApi";
import { showSuccessToast } from "../../utils/showSuccessToast";
import { showErrorToast } from "../../utils/showErrorToast";

interface ProfileFormData {
  fullname: string;
  bio: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  gender: string;
  language: string;
  twitter: string;
  github: string;
  linkedin: string;
  website: string;
  portfolio_url: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    profile?: ProfileFormData;
  };
  onSuccess?: () => void;
}
const initialState: ProfileFormData = {
  fullname: "",
  bio: "",
  city: "",
  country: "",
  address: "",
  phone: "",
  gender: "",
  language: "",
  twitter: "",
  github: "",
  linkedin: "",
  website: "",
  portfolio_url: "",
};

const getChangedFields = (
  current: ProfileFormData,
  original: ProfileFormData,
): Partial<ProfileFormData> => {
  const changed: Partial<ProfileFormData> = {};
  (Object.keys(current) as (keyof ProfileFormData)[]).forEach((key) => {
    if (current[key] !== original[key]) {
      changed[key] = current[key];
    }
  });
  return changed;
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>(initialState);
  const [originalData, setOriginalData] =
    useState<ProfileFormData>(initialState);
  const modalRef = useRef<HTMLDivElement>(null);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profileData = useMemo(() => {
    if (!user?.profile) return null;

    const profile = user.profile;

    return {
      fullname: profile.fullname || "",
      bio: profile.bio || "",
      city: profile.city || "",
      country: profile.country || "",
      address: profile.address || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      language: profile.language || "",
      twitter: profile.twitter || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      website: profile.website || "",
      portfolio_url: profile.portfolio_url || "",
    };
  }, [user]);

  useEffect(() => {
    if (!profileData) return;

    setFormData(profileData || initialState);
    setOriginalData(profileData);
    setError(null);
  }, [profileData]);

  const bioLength = useMemo(() => formData.bio.length, [formData.bio]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (error) setError(null);
    },
    [error],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Only send changed fields
      const changed = getChangedFields(formData, originalData);
      if (Object.keys(changed).length === 0) {
        showSuccessToast("No changes to save");
        onClose();
        return;
      }

      const formDataToSend = new FormData();
      Object.entries(changed).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          formDataToSend.append(key, value);
        }
      });

      try {
        await updateProfile(formDataToSend).unwrap();
        showSuccessToast("Profile updated successfully!");
        onSuccess?.();
        onClose();
      } catch (error: unknown) {
        let errorMessage = "Failed to update profile";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "data" in error
        ) {
          const apiError = error as { data?: { message?: string } };
          errorMessage = apiError.data?.message || errorMessage;
        }

        showErrorToast(errorMessage);
        setError(errorMessage);
      }
    },
    [formData, originalData, updateProfile, onSuccess, onClose],
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scroll-smooth"
        >
          <div className="sticky top-0 z-10 bg-white shadow px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-black">Edit Profile</h2>
              <p className="text-sm mt-1 text-black">
                Update your personal information and social links
              </p>
            </div>
            <button
              onClick={onClose}
              className="border cursor-pointer hover:bg-black/10 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <FiAlertCircle className="shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="City"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Country"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Street address"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Languages
                </label>
                <input
                  id="language"
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g., English, Bengali, Hindi"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple languages with commas
                </p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={14}
                value={formData.bio}
                onChange={handleChange}
                className="w-full h-100 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {bioLength} characters
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-4 pt-2 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Social Links
              </h3>
              <div className="relative">
                <FiTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Twitter profile URL"
                />
              </div>
              <div className="relative">
                <FiGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="GitHub profile URL"
                />
              </div>
              <div className="relative">
                <FiLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="LinkedIn profile URL"
                />
              </div>
              <div className="relative">
                <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Personal website"
                />
              </div>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Portfolio URL"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <FiX size={18} /> Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isUpdating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileEditModal);
