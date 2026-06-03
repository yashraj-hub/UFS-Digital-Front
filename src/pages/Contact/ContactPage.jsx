import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../../components/Seo/Seo";
import PageHero from "../../components/PageHero/PageHero";
import { pageSeo } from "../../seo/siteMeta";
import "./ContactPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };

function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#contact-form") {
      const el = document.getElementById("contact-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location.hash]);

  useEffect(() => {
    if (!submitted) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSubmitted(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [submitted]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()])
    );

    try {
      const response = await fetch(`${API_BASE_URL}/contact-submissions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || result.error || "Unable to send message");
      }

      setForm(emptyForm);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Seo {...pageSeo.contact} />
      <PageHero imageUrl="https://images.pexels.com/photos/11576307/pexels-photo-11576307.jpeg" />

      <div className="contact-section" id="contact-form">
        <div className="content-wrap">
          <div className="contact-intro">
            <p className="contact-eyebrow">Get In Touch</p>
            <h1 className="contact-heading">Contact Us</h1>
          </div>

          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <i className="fa-solid fa-circle-check" />
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <div className="contact-success__timer" aria-hidden="true">
                  <span />
                </div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label htmlFor="name">Full Name</label>
                    <input id="name" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="phone">Mobile Number</label>
                    <input id="phone" name="phone" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="contact-form__field">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" type="text" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} placeholder="Write your message here..." value={form.message} onChange={handleChange} required />
                </div>
                {error ? <p className="contact-form__error">{error}</p> : null}
                <div className="contact-form__actions">
                  <button type="submit" className="contact-form__submit" aria-label="Send message" disabled={isSubmitting}>
                    <i className={`fa-solid ${isSubmitting ? "fa-spinner fa-spin" : "fa-paper-plane"}`} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
