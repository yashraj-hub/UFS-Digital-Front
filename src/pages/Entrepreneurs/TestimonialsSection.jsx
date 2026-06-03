import { useState } from "react";
import govindImg from "./govind.jpg";
import priyankaImg from "./priyanka.jpg";
import ramBalakImg from "./rab_balak.jpg";
import shanuImg from "./shanu1.jpg";
import "./TestimonialsSection.css";

const testimonials = [
  {
    quote:
      "My name is Priyanka Singh and I live in Bahurawa, a small village near Sultanpur. Earlier, reaching a bank was very difficult for people in our village. After the BC Sakhi service started, we got support for account opening, cash deposit, cash withdrawal, and business loan assistance in our own village. It has helped our village grow and made daily life easier.",
    name: "Priyanka Singh",
    role: "Bahurawa, Sultanpur",
    image: priyankaImg,
    highlightWords: [
      "village",
      "bank",
      "bc",
      "sakhi",
      "account",
      "cash",
      "business",
      "loan",
      "grow",
      "easier",
    ],
  },
  {
    quote:
      "My name is Mohammad Rashid. I have been working as a Banking Mitra with Punjab National Bank for the last two years. This work has given me a steady and trusted income. I earn commission on account opening, transactions, and financial products. This income has helped my family, my children's education, and our standard of living.",
    name: "Mohammad Rashid",
    role: "Banking Mitra, Punjab National Bank",
    image: shanuImg,
    highlightWords: [
      "banking",
      "mitra",
      "punjab",
      "national",
      "bank",
      "steady",
      "trusted",
      "income",
      "commission",
      "education",
    ],
  },
  {
    quote:
      "As a Banking Mitra, I feel proud that I am also doing social service. I help people in my village apply for Aadhaar, PAN card, Kisan Credit Card, and other schemes. I also guide them about e-banking, mobile banking, and digital payments, so they can use banking services with more confidence.",
    name: "Ram Balak",
    role: "BC, UCO Bank",
    image: ramBalakImg,
    highlightWords: [
      "banking",
      "mitra",
      "social",
      "service",
      "aadhaar",
      "pan",
      "kisan",
      "credit",
      "digital",
      "payments",
      "confidence",
    ],
  },
  {
    quote:
      "I work as a Bank Mitra and I want to share my experience. This work has given me more respect in society and also made me a partner in basic social service. I help people in my village apply for Aadhaar, PAN card, Kisan Credit Card, and other schemes. I also teach them about e-banking, mobile banking, and digital payments.",
    name: "Gulab Chandra",
    role: "BC, Bank of Baroda",
    image: govindImg,
    highlightWords: [
      "bank",
      "mitra",
      "respect",
      "society",
      "partner",
      "social",
      "service",
      "aadhaar",
      "pan",
      "kisan",
      "digital",
      "payments",
    ],
  },
];

const normalizeWord = (word) => word.toLowerCase().replace(/[^a-z0-9]/g, "");

function TestimonialQuote({ testimonial, activeIndex }) {
  const highlightWords = new Set(testimonial.highlightWords || []);
  const tokens = testimonial.quote.split(/(\s+)/);
  const wordCount = tokens.filter((token) => token.trim()).length;
  let wordIndex = 0;

  return (
    <p
      key={activeIndex}
      style={{ "--word-delay": `${Math.max(24, 4100 / Math.max(wordCount, 1))}ms` }}
    >
      {tokens.map((token, tokenIndex) => {
        if (!token.trim()) {
          return token;
        }

        const currentIndex = wordIndex;
        wordIndex += 1;
        const isHighlight = highlightWords.has(normalizeWord(token));

        return (
          <span
            key={`${activeIndex}-${tokenIndex}`}
            className={isHighlight ? "testimonial-word is-highlight" : "testimonial-word"}
            style={{ "--word-index": currentIndex }}
          >
            {token}
          </span>
        );
      })}
    </p>
  );
}

function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const activePerson = testimonials[activeTestimonial];

  return (
    <section className="entrepreneurs-section entrepreneurs-section--warm testimonials-section">
      <div className="content-wrap">
        <div className="entrepreneurs-section__intro testimonials-section__intro">
          <div>
            <p className="entrepreneurs-section__eyebrow">Success Stories</p>
            <h2>Entrepreneurs are already creating change</h2>
          </div>

          <div className="testimonials-section__nav">
            <div className="testimonials-section__avatars" aria-label="Testimonial navigation">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  className={
                    index === activeTestimonial
                      ? "testimonials-section__avatar is-active"
                      : "testimonials-section__avatar"
                  }
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Show ${testimonial.name} testimonial`}
                >
                  <img src={testimonial.image} alt={testimonial.name} />
                </button>
              ))}
            </div>
            <div className="testimonials-section__active-person">
              <strong>{activePerson.name}</strong>
              <span>{activePerson.role}</span>
            </div>
          </div>
        </div>

        <div className="testimonials-section__slider">
          <article className="testimonials-section__quote">
            <TestimonialQuote activeIndex={activeTestimonial} testimonial={activePerson} />
          </article>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
