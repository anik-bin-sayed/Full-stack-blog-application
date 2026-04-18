import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  useCreateBlogMutation,
  useGetCategoriesQuery,
} from "../../features/blogs/blogApi";
import CreateCategoryModal from "../../components/category/CreateCategory";
import { showErrorToast } from "../../utils/showErrorToast";
import { showSuccessToast } from "../../utils/showSuccessToast";
import { useAppSelector } from "../../redux/hooks";
import { RxCross2 } from "react-icons/rx";

interface Category {
  id: number;
  name: string;
}

interface BlogFormState {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  is_featured: boolean;
  is_publish: boolean;
}

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
  image?: string;
  tags?: string;
}

const initialState: BlogFormState = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  is_featured: false,
  is_publish: false,
};

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;

const CreateBlogPage: React.FC = () => {
  const { blog } = useAppSelector((state) => state.blog);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [form, setForm] = useState<BlogFormState>(initialState);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof BlogFormState, boolean>>({
    title: false,
    excerpt: false,
    content: false,
    category: false,
    is_featured: false,
    is_publish: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (blog?.title) {
      setForm((prev) => ({
        ...prev,
        title: blog.title || prev.title,
        excerpt: blog.excerpt || prev.excerpt,
        content: blog.content || prev.content,
      }));
      if (blog.tags && Array.isArray(blog.tags)) setTags(blog.tags);
    }
  }, [blog]);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch,
  } = useGetCategoriesQuery();
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();

  const categories: Category[] = categoriesData || [];

  // Tag management
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (tags.length >= MAX_TAGS) {
      setTagError(`Maximum ${MAX_TAGS} tags allowed`);
      return;
    }
    if (trimmed.length > MAX_TAG_LENGTH) {
      setTagError(`Tag too long (max ${MAX_TAG_LENGTH} chars)`);
      return;
    }
    if (tags.includes(trimmed.toLowerCase())) {
      setTagError("Tag already exists");
      return;
    }
    setTags([...tags, trimmed]);
    setTagInput("");
    setTagError("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.length < 5)
      newErrors.title = "Title must be at least 5 characters";
    else if (form.title.length > 200)
      newErrors.title = "Title must be less than 200 characters";

    if (!form.content.trim()) newErrors.content = "Content is required";
    else if (form.content.length < 20)
      newErrors.content = "Content must be at least 20 characters";

    if (!form.category) newErrors.category = "Please select a category";

    if (imageFile && imageFile.size > 10 * 1024 * 1024) {
      newErrors.image = "Image size must be less than 10MB";
    }

    if (tags.length === 0) newErrors.tags = "Add at least one tag";
    else if (tags.length > MAX_TAGS)
      newErrors.tags = `Maximum ${MAX_TAGS} tags allowed`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, imageFile, tags]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateForm();
  };

  // Image handling
  const handleImageChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showErrorToast("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showErrorToast("Image must be less than 10MB");
      return;
    }
    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageChange(file);
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setForm(initialState);
    setTags([]);
    setTagInput("");
    setTagError("");
    setTouched({
      title: false,
      excerpt: false,
      content: false,
      category: false,
      is_featured: false,
      is_publish: false,
    });
    setErrors({});
    handleRemoveImage();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      excerpt: true,
      content: true,
      category: true,
      is_featured: true,
      is_publish: true,
    });
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("excerpt", form.excerpt.trim());
    formData.append("content", form.content.trim());
    formData.append("category", form.category);
    formData.append("is_featured", String(form.is_featured));
    formData.append("is_publish", String(form.is_publish));
    if (imageFile) formData.append("image", imageFile);

    // ✅ Send each tag as a separate form field - matches Django ListField
    tags.forEach((tag) => formData.append("tags", tag));

    try {
      const res = await createBlog(formData).unwrap();
      showSuccessToast(res.message || "Blog created successfully!");
      resetForm();
      refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Create New Blog
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Share your story with the world
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., The Future of Web Development"
                value={form.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  touched.title && errors.title
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-gray-50 focus:bg-white"
                }`}
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Short Excerpt
              </label>
              <textarea
                name="excerpt"
                placeholder="A brief summary that hooks readers..."
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Max 160 characters recommended
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Blog Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                placeholder="Write your amazing content here... (Markdown supported)"
                value={form.content}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={12}
                className={`w-full px-4 py-3 rounded-xl border transition font-mono text-sm ${
                  touched.content && errors.content
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-gray-50 focus:bg-white"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {touched.content && errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            {/* Featured Image with Drag & Drop */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image
              </label>
              {!preview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-600 font-medium">
                        Click or drag to upload
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition shadow"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition shadow"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium truncate">
                      {imageFile?.name}
                    </p>
                    <p className="text-white/80 text-xs">
                      {(imageFile!.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              )}
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">{errors.image}</p>
              )}
            </div>

            {/* Category + New button */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`flex-1 px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    touched.category && errors.category
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categoriesLoading ? (
                    <option disabled>Loading categories...</option>
                  ) : categoriesError ? (
                    <option disabled>Failed to load categories</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium flex items-center gap-1 shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New
                </button>
              </div>
              {touched.category && errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tags <span className="text-red-500">*</span>
              </label>
              <div
                className={`border rounded-xl transition-all duration-200 ${
                  errors.tags
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-400"
                }`}
              >
                <div className="flex flex-wrap gap-2 p-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm font-medium capitalize"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="ml-1 text-indigo-400 hover:text-red-500 focus:outline-none"
                      >
                        <RxCross2 />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setTagError("");
                    }}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => addTag()}
                    placeholder={
                      tags.length === 0
                        ? "e.g., react, typescript, tailwind (press Enter)"
                        : "Add tag..."
                    }
                    className="flex-1 min-w-[120px] px-2 py-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    disabled={tags.length >= MAX_TAGS}
                  />
                </div>
              </div>
              {tagError && (
                <p className="mt-1 text-sm text-red-500">{tagError}</p>
              )}
              {errors.tags && (
                <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Add up to {MAX_TAGS} tags (max {MAX_TAG_LENGTH} chars each).
                Press Enter or comma to add.
              </p>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                  disabled={!form.is_publish}
                  className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-gray-700 group-hover:text-indigo-600 transition">
                  Featured Blog
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="is_publish"
                  checked={form.is_publish}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-gray-700 group-hover:text-indigo-600 transition">
                  🚀 Publish Immediately
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  "Publish Blog"
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 border border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold text-lg hover:bg-gray-50 transition shadow-sm cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          By publishing, you agree to our community guidelines.
        </p>
      </div>

      <CreateCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategoryCreated={() => refetch()}
      />
    </div>
  );
};

export default CreateBlogPage;
