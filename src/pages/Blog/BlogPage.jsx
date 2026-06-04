import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo/Seo";
import PageHero from "../../components/PageHero/PageHero";
import PageIntro from "../../components/PageIntro/PageIntro";
import { pageSeo } from "../../seo/siteMeta";
import "./BlogPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const json = await res.json();
  return json.data;
}

function BlogPage() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/blog-categories").then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = activeCategory !== "all" ? `?category=${activeCategory}` : "";
    apiFetch(`/blogs${qs}`)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const allCategories = [{ id: "all", name: "All", slug: "all" }, ...categories];

  return (
    <div className="blog-page">
      <Seo {...pageSeo.blog} />
      <PageHero imageUrl="https://images.pexels.com/photos/27988858/pexels-photo-27988858.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop" />
      <PageIntro
        eyebrow="Our Blog"
        headingAs="h1"
        heading="Insights, stories and updates from UFS Digital"
        paragraphs={[
          "Stay informed with the latest thinking from our team — covering financial inclusion, rural banking, technology, and the stories of communities we serve across India.",
          "From on-ground agent experiences to policy insights and product updates, our blog is where knowledge meets purpose.",
        ]}
      />
      <div className="content-wrap blog-grid-wrap">
        <div className="blog-filter blog-filter--desktop" role="tablist" aria-label="Blog categories">
          {allCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              className={`blog-filter__btn${activeCategory === cat.slug ? " is-active" : ""}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="blog-filter blog-filter--mobile">
          <label className="blog-filter__select-wrap" htmlFor="blog-category-select">
            <span className="sr-only">Select blog category</span>
            <select
              id="blog-category-select"
              className="blog-filter__select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {allCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down" aria-hidden="true" />
          </label>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#667287", padding: "2rem 0" }}>Loading...</p>
        ) : posts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#667287", padding: "2rem 0" }}>No blogs found.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-card-link"
                aria-label={`Open blog: ${post.title}`}
              >
                <article className="blog-card">
                  <div className="blog-card-bg" />
                  <div className="blog-card-mask" />
                  <div className="blog-card__hero">
                    {post.cover_image_url && (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="blog-card__heroImage"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="blog-card__footer">
                      <div className="blog-card__details">
                        <div className="blog-card__top-meta">
                          <p className="blog-card__dept">{post.category_name || post.tag || "Update"}</p>
                          <span className="blog-card__date-top">
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                              : ""}
                          </span>
                        </div>
                        <h3 className="blog-card__title">{post.title}</h3>
                        <p className="blog-card__excerpt-two-line">{post.excerpt}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
