import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useBlogDetailsQuery,
  useUpdateBlogMutation,
  useGetCategoriesQuery,
} from "../../features/blogs/blogApi";
import CreateCategoryModal from "../../components/category/CreateCategory";
import { showErrorToast } from "../../utils/showErrorToast";
import { showSuccessToast } from "../../utils/showSuccessToast";
import { getImageUrl } from "../../helper";

// Category interface – must match your API response (id + name)
interface Category {
  id: number;
  name: string;
  slug?: string;
}

interface BlogFormState {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  is_featured: boolean;
  is_publish: boolean;
}

const EditBlogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [form, setForm] = useState<BlogFormState>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    is_featured: false,
    is_publish: false,
  });

  // Image states
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false); // NEW flag
  const fileInputRef = useRef<HTMLInputElement>(null);

  // All hooks called unconditionally – use `skip` to avoid fetching when slug is missing
  const {
    data: blogData,
    isLoading: isLoadingBlog,
    isError,
  } = useBlogDetailsQuery({ slug }, { skip: !slug });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const categories = categoriesData || [];

  // Populate form when blog data loads
  useEffect(() => {
    if (blogData) {
      setForm({
        title: blogData.title || "",
        excerpt: blogData.excerpt || "",
        content: blogData.content || "",
        category: blogData.category?.id?.toString() || "",
        is_featured: blogData.is_featured || false,
        is_publish: blogData.is_publish || false,
      });
      if (blogData.image) {
        setExistingImage(blogData.image);
      }
      // Reset image removal flag when a new blog loads
      setIsImageRemoved(false);
      setImageFile(null);
      setPreview(null);
    }
  }, [blogData]);

  const imageThumbnail = preview ? preview : getImageUrl(existingImage);
  console.log(imageThumbnail);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target;
    const name = target.name;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setIsImageRemoved(false);
  };

  const handleRemoveImage = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setImageFile(null);
    setPreview(null);
    setExistingImage(null);
    setIsImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blogData?.id) {
      showErrorToast("Blog data not loaded. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("excerpt", form.excerpt);
    formData.append("content", form.content);
    formData.append("category", form.category);
    formData.append("is_featured", String(form.is_featured));
    formData.append("is_publish", String(form.is_publish));

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (isImageRemoved) {
      formData.append("image", "");
    }

    try {
      const res = await updateBlog({
        id: blogData.id,
        data: formData,
      }).unwrap();
      showSuccessToast(res.message || "Blog updated successfully!");
      navigate(-1);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleChangeImage = () => {
    setImageFile(null);
    setPreview(null);
    setExistingImage(null);

    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Invalid blog slug.</p>
          <button
            onClick={() => navigate("/blogs")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (isError || !blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">
            Blog not found or an error occurred.
          </p>
          <button
            onClick={() => navigate("/blogs")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl italic text-black">Edit Blog</h1>
          <p
            className="text-gray-600 mt-2"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            Update your story
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter an amazing title..."
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Excerpt
              </label>
              <textarea
                name="excerpt"
                placeholder="Write a brief summary of your blog..."
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Content
              </label>
              <textarea
                name="content"
                placeholder="Write your amazing content here..."
                value={form.content}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image
              </label>
              {!imageThumbnail ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition bg-gray-50 hover:bg-gray-100"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
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
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-600">Click to upload an image</p>
                      <p className="text-sm text-gray-400 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={imageThumbnail}
                    alt="Preview"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={handleChangeImage}
                      className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                      Change Image
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium truncate">
                      {imageFile?.name || (existingImage && "Current image")}
                    </p>
                    {imageFile && (
                      <p className="text-white/80 text-xs">
                        {(imageFile.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <div className="flex gap-3">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categoriesLoading ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium flex items-center gap-1"
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
            </div>

            {/* Checkboxes: Is Featured & Is Published */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700 font-medium">Featured Blog</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_publish"
                  checked={form.is_publish}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700 font-medium">
                  Publish Immediately
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Update Blog"}
            </button>
          </form>
        </div>
      </div>

      {/* Category Modal */}
      <CreateCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategoryCreated={() => {
          refetchCategories();
        }}
      />
    </div>
  );
};

export default EditBlogPage;
