import "./ServiceShowcase.css";

const WHY_UFS = [
  {
    icon: "fa-solid fa-chart-line",
    title: "Technology-Driven Financial Ecosystem",
    text: "We combine digital innovation with practical financial service delivery to create efficient and scalable solutions.",
  },
  {
    icon: "fa-solid fa-user-check",
    title: "Customer-Centric Service Model",
    text: "Every service is designed to improve accessibility, convenience and customer satisfaction.",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Secure & Reliable Infrastructure",
    text: "Security, transparency and operational reliability remain central to our financial ecosystem.",
  },
  {
    icon: "fa-solid fa-chart-simple",
    title: "Scalable Growth Support",
    text: "Our solutions are developed to support long-term business expansion and evolving customer needs.",
  },
  {
    icon: "fa-solid fa-hand-holding-heart",
    title: "Financial Inclusion Commitment",
    text: "We focus on expanding financial accessibility across urban, rural and underserved communities.",
  },
  {
    icon: "fa-solid fa-arrow-trend-up",
    title: "Trusted Service Delivery",
    text: "We are committed to delivering reliable and consistent financial services that build trust and confidence.",
  },
];

function ServicesShowcase() {
  return (
    <section className="services-support-section" id="services-support">
      <div className="content-wrap services-support__shell">
        <div className="services-support__header">
          <p className="services-support__eyebrow">Why UFS</p>
          <h2>Why Businesses &amp; Customers Choose UFS</h2>
          <p className="services-support__lead">
            UFS brings together technology, trust and service design to create
            a smarter, more dependable financial ecosystem for both businesses
            and everyday customers. By combining modern digital infrastructure
            with customer-focused experiences, UFS helps organisations
            simplify operations, improve accessibility and deliver services
            with greater speed and confidence. From banking and insurance to
            enterprise financial solutions, every service is designed to ensure
            clarity, security and long-term scalability.
          </p>
        </div>

        <div className="services-support__cards" aria-label="Why UFS benefits">
          {WHY_UFS.map((card) => (
            <article key={card.title} className="services-support__benefit">
              <h3>
                <i className={card.icon} aria-hidden="true" />
                <span>{card.title}</span>
              </h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesShowcase;
