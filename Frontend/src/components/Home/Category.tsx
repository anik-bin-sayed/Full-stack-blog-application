import { useGetCategoriesQuery } from "../../features/blogs/blogApi";
import { Link } from "react-router-dom";
import type { CategoryType } from "../../types/category/categoryMap";

const Category = () => {
  const { data: categories } = useGetCategoriesQuery();
  return (
    <aside className="lg:w-1/3">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories &&
            categories.map((cat: CategoryType) => {
              return (
                <Link
                  key={cat.id}
                  to={`/blogs?category=${cat.id}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-indigo-100 hover:text-indigo-700 transition hover:outline outline-indigo-600 cursor-pointer"
                >
                  {cat?.name
                    ? cat.name.charAt(0).toUpperCase() + cat?.name.slice(1)
                    : ""}
                </Link>
              );
            })}
        </div>
      </div>

      <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Newsletter</h3>
        <p className="text-gray-600 text-sm mb-4">
          Get the latest posts delivered right to your inbox.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Newsletter subscription demo");
          }}
        >
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Category;
