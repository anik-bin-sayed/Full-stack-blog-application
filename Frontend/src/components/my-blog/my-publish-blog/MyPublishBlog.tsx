import MyBlogList from "../MyBlogList";

const MyPublishBlog = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MyBlogList type="published" />
    </div>
  );
};

export default MyPublishBlog;
