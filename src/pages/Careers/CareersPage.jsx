import { useEffect, useState, useRef } from "react";
import Seo from "../../components/Seo/Seo";
import PageHero from "../../components/PageHero/PageHero";
import PageIntro from "../../components/PageIntro/PageIntro";
import { pageSeo } from "../../seo/siteMeta";
import { useToast } from "../../context/ToastContext";
import "./CareersPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function CareersPage() {
  const formRef = useRef(null);
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    current_location: "",
    experience_years: "",
    current_ctc: "",
    expected_ctc: "",
    notice_period: "",
    linkedin_url: "",
    portfolio_url: "",
    cover_letter: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/jobs`)
      .then((res) => res.json())
      .then((json) => {
        setJobs(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleJobClick = async (job) => {
    try {
      const response = await fetch(`${API_BASE}/jobs/${job.id}`);
      const json = await response.json();
      setSelectedJob(json.data);
      setIsApplying(true);
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to fetch job details", err);
    }
  };

  const handleBackToJobs = () => {
    setIsApplying(false);
    setSelectedJob(null);
    setShowForm(false);
  };

  const handleBackToDetail = () => {
    setShowForm(false);
  };

  const handleApplyNow = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!resumeFile) {
      showToast("Please upload your resume.", "error");
      setSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append("job_id", selectedJob.id);
      formDataToSend.append("resume", resumeFile);

      const response = await fetch(`${API_BASE}/job-applications`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        showToast("Application submitted successfully!", "success");
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          current_location: "",
          experience_years: "",
          current_ctc: "",
          expected_ctc: "",
          notice_period: "",
          linkedin_url: "",
          portfolio_url: "",
          cover_letter: "",
        });
        setResumeFile(null);
        setTimeout(() => {
          handleBackToJobs();
        }, 3000);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || "Failed to submit application. Please try again.", "error");
      }
    } catch (err) {
      showToast("Something went wrong. Please check your connection.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const heroImage = selectedJob?.image_url || "https://images.pexels.com/photos/20988575/pexels-photo-20988575.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop";

  return (
    <div className="careers-page">
      <Seo {...pageSeo.careers} />
      <PageHero imageUrl={heroImage} />
      
      {!isApplying ? (
        <>
          <PageIntro
            eyebrow="Careers"
            headingAs="h1"
            heading="Work with UFS Digital"
            paragraphs={[
              "At UFS Digital, we believe great ideas come from talented people. We are always looking for passionate professionals who are eager to innovate, grow, and make an impact.",
              "UFS Digital offers opportunities to learn, contribute, and thrive in a fast-paced digital environment.",
            ]}
          />

          <section className="careers-page__jobs content-wrap">
            {loading ? (
              <div className="careers-page__loading">Loading opportunities...</div>
            ) : jobs.length > 0 ? (
              <div className="careers-grid">
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="job-card"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="job-card-bg" />
                    <div className="job-card-mask" />
                    <div className="job-card__hero">
                      {job.image_url ? (
                        <img
                          src={job.image_url}
                          alt={job.title}
                          className="job-card__heroImage"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="job-card__heroAvatar" aria-hidden="true">
                          <span>{job.department?.slice(0, 2).toUpperCase() || "JD"}</span>
                        </div>
                      )}
                      
                      <div className="job-card__footer">
                        <div className="job-card__details">
                          <p className="job-card__dept">{job.department}</p>
                          <h3 className="job-card__title">{job.title}</h3>
                          <div className="job-card__meta-row">
                            <span className="job-card__meta-item">
                              <i className="fa-solid fa-location-dot" /> {job.location}
                            </span>
                            <span className="job-card__meta-item">
                              <i className="fa-solid fa-briefcase" /> {job.experience_required}
                            </span>
                            <span className="job-card__meta-item">
                               <i className="fa-solid fa-calendar-days" /> Posted on {new Date(job.created_at).toLocaleDateString()}
                             </span>
                          </div>
                        </div>
                        
                        <div className="job-card__side">
                          <div className="job-card__badge-v2">
                            <div className="job-card__badge-v2-icon">
                              <i className="fa-solid fa-award" />
                            </div>
                            <div className="job-card__badge-v2-info">
                              <span className="job-card__badge-v2-number">{job.experience_required?.split(' ')[0] || "0"}</span>
                              <span className="job-card__badge-v2-text">YRS EXP</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="careers-page__notice-inner">
                <p>There are no job openings at the moment. Please check back later.</p>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="application-section content-wrap">
          <div className="job-detail-view">
            <button className="back-btn" onClick={handleBackToJobs}>
              <i className="fa-solid fa-arrow-left" /> Back to Jobs
            </button>
            
            <div className="job-detail-container">
              <div className="job-detail-header">
                <div className="job-detail-header__main">
                  <span className="job-detail-dept">{selectedJob.department}</span>
                  <h1 className="job-detail-title">{selectedJob.title}</h1>
                  <div className="job-detail-meta">
                    <span className="meta-item location"><i className="fa-solid fa-location-dot" /> {selectedJob.location}</span>
                    <span className="meta-item experience"><i className="fa-solid fa-briefcase" /> {selectedJob.experience_required}</span>
                    <span className="meta-item date"><i className="fa-solid fa-calendar-days" /> Posted on {new Date(selectedJob.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {!showForm && (
                  <button className="apply-now-btn" onClick={handleApplyNow}>
                    Apply for this Position
                  </button>
                )}
              </div>

              <div className="job-detail-content" ref={formRef}>
                {!showForm ? (
                  <div className="job-detail-body">
                    <h3>Job Description</h3>
                    <div className="job-info-summary__desc" dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                  </div>
                ) : (
                  <div className="application-form-wrapper">
                    <div className="application-form-header">
                      <h3>Submit your Application</h3>
                      <button className="cancel-form-btn-circle" onClick={handleBackToDetail} title="Cancel">
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>

                    <form className="application-form-minimal" onSubmit={handleSubmit}>
                      <div className="form-row-triple">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required placeholder="Your full name" />
                        </div>
                        <div className="form-group">
                          <label>Email Address *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@example.com" />
                        </div>
                        <div className="form-group">
                          <label>Mobile Number *</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91 00000 00000" />
                        </div>
                      </div>

                      <div className="form-row-double">
                        <div className="form-group">
                          <label>Current Location *</label>
                          <input type="text" name="current_location" value={formData.current_location} onChange={handleInputChange} required placeholder="City, State" />
                        </div>
                        <div className="form-group">
                          <label>Total Experience (Years) *</label>
                          <input type="number" step="0.1" name="experience_years" value={formData.experience_years} onChange={handleInputChange} required placeholder="e.g. 2.5" />
                        </div>
                      </div>

                      <div className="form-row-double">
                        <div className="form-group">
                          <label>Current CTC</label>
                          <input type="text" name="current_ctc" value={formData.current_ctc} onChange={handleInputChange} placeholder="Your current CTC" />
                        </div>
                        <div className="form-group">
                          <label>Expected CTC</label>
                          <input type="text" name="expected_ctc" value={formData.expected_ctc} onChange={handleInputChange} placeholder="Your expected CTC" />
                        </div>
                      </div>

                      <div className="form-row-double">
                        <div className="form-group">
                          <label>Notice Period</label>
                          <input type="text" name="notice_period" value={formData.notice_period} onChange={handleInputChange} placeholder="e.g. 30 days" />
                        </div>
                        <div className="form-group">
                          <label>LinkedIn Profile URL</label>
                          <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." />
                        </div>
                      </div>

                      <div className="form-group wide">
                        <label>Portfolio / GitHub URL</label>
                        <input type="url" name="portfolio_url" value={formData.portfolio_url} onChange={handleInputChange} placeholder="https://github.com/..." />
                      </div>

                      <div className="form-group wide">
                        <label>Upload Resume (PDF/DOC) *</label>
                        <div className="custom-file-upload-v2">
                          <input 
                            type="file" 
                            id="resume-upload"
                            name="resume" 
                            onChange={handleFileChange} 
                            accept=".pdf,.doc,.docx" 
                            required 
                            className="file-input-hidden" 
                          />
                          {!resumeFile ? (
                            <label htmlFor="resume-upload" className="file-upload-label-v2">
                              <i className="fa-solid fa-paperclip"></i>
                              <span>Choose your file</span>
                            </label>
                          ) : (
                            <div className="file-selected-display-v2">
                              <i className="fa-solid fa-file-pdf"></i>
                              <span className="file-name-v2">{resumeFile.name}</span>
                              <button 
                                type="button" 
                                className="clear-file-btn-v2" 
                                onClick={() => setResumeFile(null)}
                                title="Remove file"
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group wide">
                        <label>Cover Letter</label>
                        <textarea name="cover_letter" value={formData.cover_letter} onChange={handleInputChange} rows="4" placeholder="Write your cover letter here..."></textarea>
                      </div>

                      <div className="application-form-actions">
                        <button type="submit" className="submit-btn" disabled={submitting}>
                          {submitting ? "Submitting..." : "Submit Application"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default CareersPage;
