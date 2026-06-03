import { useEffect, useState } from "react";
import "./BlogSheet.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function BlogSheet({ post, onClose }) {
  const [fullPost, setFullPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!post?.slug) return;
    setLoading(true);
    setFullPost(null);
    fetch(`${API_BASE}/blogs/${post.slug}`)
      .then((r) => r.json())
      .then((json) => setFullPost(json.data))
      .catch(() => setFullPost(post))
      .finally(() => setLoading(false));
  }, [post?.slug]);

  if (!post) return null;

  const data = fullPost || post;
  const publishedDate = data.published_at
    ? new Date(data.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="blog-sheet">
      <div className="blog-sheet__header" style={{ backgroundImage: data.cover_image_url ? `url(${data.cover_image_url})` : undefined }}>
        <div className="blog-sheet__overlay" />
        <div className="blog-sheet__header-content">
          <div className="blog-sheet__header-left">
            <span className="blog-sheet__tag">{data.category_name || data.tag || ""}</span>
            <h1 className="blog-sheet__title">{data.title}</h1>
          </div>
          <div className="blog-sheet__header-right">
            <p className="blog-sheet__date">{publishedDate}</p>
          </div>
        </div>
        <button type="button" className="blog-sheet__close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      <div className="blog-sheet__body">
        <div className="blog-sheet__content">
          {data.excerpt && <p className="blog-sheet__lead">{data.excerpt}</p>}
          {loading ? (
            <p style={{ color: "#667287" }}>Loading...</p>
          ) : data.content ? (
            <div className="blog-sheet__html ql-editor" dangerouslySetInnerHTML={{ __html: data.content }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BlogSheet;
