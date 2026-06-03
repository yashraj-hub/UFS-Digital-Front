import React, { useEffect, useRef, useState } from "react";
import "./BFSIServicesSection.css";

const BFSI_SERVICES = [
  {
    title: "Banking & Payments",
    icon: "fa-building-columns",
    colorClass: "bfsi-banking",
    items: [
      "Account Opening Assistance",
      "AEPS & Micro ATM Services",
      "Cash Deposit & Withdrawal",
      "UPI Setup & Bill Payments",
      "Mobile Recharge & FASTag"
    ]
  },
  {
    title: "Financial Services",
    icon: "fa-chart-pie",
    colorClass: "bfsi-financial",
    items: [
      "PAN Card Services",
      "Credit Card Application",
      "Loan Assistance",
      "Mutual Fund Guidance",
      "EMI / Finance Support"
    ]
  },
  {
    title: "Insurance Services",
    icon: "fa-shield-halved",
    colorClass: "bfsi-insurance",
    items: [
      "Life Insurance Plans",
      "Health Insurance",
      "Vehicle Insurance",
      "Insurance Claim Assistance",
      "General Insurance Cover"
    ]
  }
];

function BFSIServicesSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`bfsi-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="content-wrap bfsi-wrapper">
        <div className="bfsi-header">
          <p className="bfsi-eyebrow">What is BFSI?</p>
          <h2 className="bfsi-title">Comprehensive <span>BFSI</span> Services</h2>
          <p className="bfsi-subtitle">
            We provide a wide range of Banking, Financial Services, and Insurance solutions designed to make everyday financial access simple and reliable. From account opening and digital payments to insurance and loan assistance, our services ensure convenience, transparency, and trust for individuals and businesses alike.
          </p>
        </div>

        <div className="bfsi-simple-grid">
          {BFSI_SERVICES.map((category, index) => (
            <div
              key={category.title}
              className={`bfsi-simple-item ${category.colorClass}`}
              style={{ '--delay': `${index * 0.15}s` }}
            >
              <h3 className="bfsi-simple-title">
                <i className={`fa-solid ${category.icon}`}></i>
                <span>{category.title}</span>
              </h3>
              <ul className="bfsi-simple-list">
                {category.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BFSIServicesSection;
