import "./PageIntro.css";

function PageIntro({ eyebrow, heading, paragraphs, stacked = false, headingAs = "h2" }) {
  const HeadingTag = headingAs;

  return (
    <section className={`page-intro${stacked ? " page-intro--stacked" : ""}`}>
      <div className="content-wrap">
        <div className="page-intro__inner">
          <div className="page-intro__left">
            <p className="page-intro__eyebrow">{eyebrow}</p>
            <HeadingTag className="page-intro__heading">{heading}</HeadingTag>
          </div>
          <div className="page-intro__right">
            {paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageIntro;
