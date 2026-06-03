const SITE_NAME = "UFS Digital";
const LEGAL_NAME = "UFS - DIGITAL LIMITED";
const SITE_URL = "https://ufsdigital.one";
const DEFAULT_DESCRIPTION =
  "UFS Digital helps communities access banking, insurance, government and digital financial services through a trusted BC agent network across India.";
const DEFAULT_KEYWORDS = [
  "UFS Digital",
  "banking services India",
  "insurance services India",
  "BC agent network",
  "financial inclusion",
  "digital payments",
  "government services",
];

const CONTACT = {
  email: "connect@ufsdigital.one",
  phone: "+91 98765 43210",
  linkedin: "https://in.linkedin.com/company/ufs-digital-ltd-ufs",
  address: {
    streetAddress: "7th floor, Summit Building, Vibhuti Khand",
    addressLocality: "Gomti Nagar",
    addressRegion: "Uttar Pradesh",
    postalCode: "226010",
    addressCountry: "IN",
  },
};

const DEFAULT_IMAGE_PATH = "/og-image.svg";

function absoluteUrl(pathname) {
  return new URL(pathname, SITE_URL).toString();
}

function fullTitle(pageTitle) {
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.png"),
    image: absoluteUrl(DEFAULT_IMAGE_PATH),
    email: CONTACT.email,
    telephone: CONTACT.phone,
    sameAs: [CONTACT.linkedin],
    address: {
      "@type": "PostalAddress",
      ...CONTACT.address,
    },
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Banking, insurance and financial services",
    serviceType: "Banking, insurance and financial services",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: LEGAL_NAME,
    url: SITE_URL,
    image: absoluteUrl(DEFAULT_IMAGE_PATH),
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      ...CONTACT.address,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CONTACT.phone,
        email: CONTACT.email,
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
  };
}

export const siteMeta = {
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS.join(", "),
  imagePath: DEFAULT_IMAGE_PATH,
  imageUrl: absoluteUrl(DEFAULT_IMAGE_PATH),
  contact: CONTACT,
  fullTitle,
  absoluteUrl,
  organizationSchema,
  websiteSchema,
  serviceSchema,
  localBusinessSchema,
  breadcrumbSchema,
};

export const pageSeo = {
  home: {
    title: "UFS Digital | Banking, Insurance and BC Agent Network in India",
    description:
      "Discover UFS Digital, a trusted financial services platform helping communities access banking, insurance and government services through BC agents across India.",
    canonicalPath: "/",
    keywords:
      "UFS Digital, banking services India, insurance services India, BC agent network, financial inclusion, rural banking",
    imagePath: DEFAULT_IMAGE_PATH,
    type: "website",
    schema: [organizationSchema(), websiteSchema()],
  },
  entrepreneurs: {
    title: "Entrepreneurs",
    description:
      "Build a trusted BC business with UFS Digital and create income by delivering banking, insurance and financial services to your local community.",
    canonicalPath: "/entrepreneurs",
    keywords:
      "BC agent opportunity, entrepreneur business India, UFS Digital entrepreneurs, banking correspondent, financial inclusion",
    imagePath: DEFAULT_IMAGE_PATH,
    type: "website",
    schema: [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Entrepreneurs", path: "/entrepreneurs" },
      ]),
    ],
  },
  services: {
    title: "Services",
    description:
      "Explore UFS Digital banking, insurance and financial services designed for accessible, trusted and technology-driven customer support.",
    canonicalPath: "/services",
    keywords:
      "banking services, insurance services, financial services, UFS Digital services, customer support India",
    imagePath: DEFAULT_IMAGE_PATH,
    type: "website",
    schema: [
      organizationSchema(),
      serviceSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
  },
  blog: {
    title: "Blog",
    description:
      "Read insights, stories and updates from UFS Digital on financial inclusion, rural banking, digital payments and entrepreneurship.",
    canonicalPath: "/blog",
    keywords:
      "UFS Digital blog, financial inclusion blog, rural banking insights, digital payments India, entrepreneurship stories",
    imagePath: DEFAULT_IMAGE_PATH,
    type: "website",
    schema: [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]),
    ],
  },
  team: {
    title: "Team",
    description:
      "Meet the team behind UFS Digital and the people building financial inclusion, service trust and operational excellence across India.",
    canonicalPath: "/team",
    keywords:
      "UFS Digital team, leadership team, financial inclusion company, banking services company India",
    imagePath: DEFAULT_IMAGE_PATH,
    type: "website",
    schema: [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Team", path: "/team" },
      ]),
    ],
  },
  careers: {
    title: "Careers",
    description:
      "Explore opportunities at UFS Digital. We’re not hiring right now, but we’ll share new openings here soon.",
    canonicalPath: "/careers",
    keywords:
      "UFS Digital careers, jobs at UFS Digital, career opportunities, BC agent jobs",
    imagePath: DEFAULT_IMAGE_PATH,
    type: "website",
    schema: [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Careers", path: "/careers" },
      ]),
    ],
  },
  contact: {
    title: "Contact",
    description:
      "Get in touch with UFS Digital for banking, insurance, partnership and BC agent inquiries.",
    canonicalPath: "/contact",
    keywords:
      "contact UFS Digital, banking services contact, insurance services contact, BC agent support",
    imagePath: DEFAULT_IMAGE_PATH,
    type: "website",
    schema: [
      organizationSchema(),
      localBusinessSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  },
  becomeAgent: {
    title: "Become a BC Agent",
    description:
      "Apply to join UFS Digital as a BC Agent and start a business built around banking access, support and community trust.",
    canonicalPath: "/become-agent",
    keywords:
      "become a BC agent, apply BC agent, UFS Digital application, banking correspondent opportunity",
    imagePath: DEFAULT_IMAGE_PATH,
    type: "website",
    schema: [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Become a BC Agent", path: "/become-agent" },
      ]),
    ],
  },
};
