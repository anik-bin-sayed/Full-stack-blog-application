import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { usePublicFeatureBlogsQuery } from "../../features/blogs/blogApi";
import { formatDate, getImageUrl } from "../../helper";

const FeatureBlogs = () => {
  const { data: featureBlogs, isLoading: featureBlogLoading } =
    usePublicFeatureBlogsQuery();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const needCarousel = featureBlogs && featureBlogs.length > 3;

  const checkScrollButtons = useCallback(() => {
    if (!carouselRef.current || !needCarousel) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, [needCarousel]);

  useEffect(() => {
    const container = carouselRef.current;
    if (container && needCarousel) {
      const timer = setTimeout(checkScrollButtons, 100);
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      const observer = new ResizeObserver(checkScrollButtons);
      observer.observe(container);
      return () => {
        clearTimeout(timer);
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
        observer.disconnect();
      };
    }
  }, [needCarousel, checkScrollButtons]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const scrollAmount = container.clientWidth * 0.9;
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const scrollAmount = container.clientWidth * 0.9;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-50 text-blue-700",
      Design: "bg-pink-50 text-pink-700",
      JavaScript: "bg-yellow-50 text-yellow-700",
      React: "bg-cyan-50 text-cyan-700",
      CSS: "bg-green-50 text-green-700",
      Productivity: "bg-purple-50 text-purple-700",
    };
    return colors[categoryName] || "bg-gray-50 text-gray-700";
  };

  const getPlainText = (html: string) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const getContentPreview = (post: any) => {
    const rawContent = post.content || post.body || post.excerpt || "";
    const plainText = getPlainText(rawContent);
    const words = plainText.split(/\s+/).filter((w) => w.length > 0);
    const previewWords = words.slice(0, 25);
    let preview = previewWords.join(" ");
    if (words.length > 25) preview += "...";
    return preview || "Read more";
  };

  if (featureBlogLoading) {
    return (
      <div className="py-12">
        <div className="text-center mb-10">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto" />
          <div className="w-16 h-0.5 bg-gray-200 mx-auto mt-3 rounded-full" />
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto mt-3" />
        </div>
        <div className="flex justify-center px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!featureBlogs || featureBlogs.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
        <div className="w-16 h-0.5 bg-indigo-500 mx-auto mt-3 rounded-full" />
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Hand-picked stories to inspire and educate
        </p>
      </div>

      <div className="relative px-4 md:px-8">
        {needCarousel && (
          <>
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 transition-all ${
                canScrollLeft
                  ? "hover:bg-gray-50 hover:shadow-lg cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
              aria-label="Previous"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 transition-all ${
                canScrollRight
                  ? "hover:bg-gray-50 hover:shadow-lg cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
              aria-label="Next"
            >
              <FiChevronRight size={20} />
            </button>
          </>
        )}

        <div
          ref={carouselRef}
          className={`
            ${
              needCarousel
                ? "flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-5 pb-4"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          `}
          style={
            needCarousel
              ? {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }
              : {}
          }
        >
          {featureBlogs.map((post) => {
            const date = formatDate(post?.created_at);
            const image = getImageUrl(post.image);
            const categoryColor = getCategoryColor(post.category?.name);
            const contentPreview = getContentPreview(post);

            return (
              <article
                key={post.id}
                className={`
                  flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col
                  ${
                    needCarousel
                      ? "snap-start w-[85vw] sm:w-[calc(50%-20px)] lg:w-[calc(33.33%-20px)]"
                      : "w-full"
                  }
                `}
              >
                <Link to={`/blog/details/${post.slug}`} className="block">
                  <img
                    src={image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  {/* Meta */}
                  <div className="flex items-center text-xs text-gray-500 mb-2 space-x-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} /> {date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser size={12} />{" "}
                      {post.author?.profile?.fullname ||
                        post.author?.username ||
                        "Anonymous"}
                    </span>
                  </div>

                  <Link to={`/blog/details/${post.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {contentPreview}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${categoryColor}`}
                    >
                      <FiTag className="mr-1" size={12} />
                      {post.category?.name || "General"}
                    </span>
                    <Link
                      to={`/blog/details/${post.slug}`}
                      className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition flex items-center gap-1"
                    >
                      Read more
                      <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureBlogs;
