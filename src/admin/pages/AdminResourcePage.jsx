import { useEffect, useMemo, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import RichEditor from "../components/RichEditor";
import { adminApi } from "../services/adminApi";
import ConfirmDialog from "../components/ConfirmDialog";

const todayForInput = () => new Date().toISOString().slice(0, 16);

const resourceConfig = {
  "blog-categories": {
    resource: "blog-categories",
    title: "Blog Categories",
    eyebrow: "Blogs",
    createLabel: "New Category",
    allowCreate: true,
    switchEditor: true,
    columns: ["name", "slug", "display_order", "is_active"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "display_order", label: "Display Order", type: "number", defaultValue: 0 },
      { name: "is_active", label: "Active", type: "checkbox", defaultValue: true },
    ],
  },
  blogs: {
    resource: "blogs",
    title: "Blogs",
    eyebrow: "Publishing",
    createLabel: "New Blog",
    allowCreate: true,
    switchEditor: true,
    isBlogsPage: true,
    columns: ["title", "tag", "status"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "tag", label: "Tag", type: "text" },
      { name: "category_id", label: "Category", type: "blog-category-select" },
      { name: "cover_image_url", label: "Cover Image URL", type: "url" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "quill", wide: true },
    ],
  },
  "team-members": {
    resource: "team-members",
    title: "Team",
    eyebrow: "People",
    createLabel: "Create New Member",
    allowCreate: true,
    switchEditor: true,
    columns: ["photo_url", "name", "role", "experience_years", "display_order", "is_active"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "experience_years", label: "Experience (years)", type: "number", defaultValue: 0 },
      { name: "photo_url", label: "Photo URL", type: "url" },
      { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
      { name: "bio", label: "Bio", type: "textarea", wide: true },
      { name: "display_order", label: "Display Order", type: "number", defaultValue: 0 },
      { name: "is_active", label: "Active", type: "checkbox", defaultValue: true },
    ],
  },
  partners: {
    resource: "partners",
    title: "Partners",
    eyebrow: "Home Page",
    createLabel: "New Partner",
    allowCreate: true,
    switchEditor: true,
    columns: ["name", "logo_url", "website_url", "display_order", "is_active"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo_url", label: "Logo URL", type: "url", required: true, wide: true },
      { name: "website_url", label: "Website URL", type: "url" },
      { name: "display_order", label: "Display Order", type: "number", defaultValue: 0 },
      { name: "is_active", label: "Show on Home", type: "checkbox", defaultValue: true },
    ],
  },
  "contact-submissions": {
    resource: "contact-submissions",
    title: "Contact Messages",
    eyebrow: "Inbox",
    createLabel: "",
    allowCreate: false,
    hideEditor: true,
    previewOnRowClick: true,
    previewTitleField: "subject",
    previewTitleFallback: "Contact Message",
    previewKicker: "Message Preview",
    previewFields: ["name", "email", "phone", "status", "created_at"],
    previewBodyFields: ["message"],
    columns: ["name", "email", "phone", "subject", "message", "status", "created_at"],
    searchPlaceholder: "Search by name, email, phone, subject, message, or status",
    fields: [
      { name: "name", label: "Name", type: "text", readOnly: true },
      { name: "email", label: "Email", type: "email", readOnly: true },
      { name: "phone", label: "Phone", type: "text", readOnly: true },
      { name: "subject", label: "Subject", type: "text", readOnly: true },
      { name: "message", label: "Message", type: "textarea", wide: true, readOnly: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["new", "reviewed", "archived"],
      },
    ],
  },
  "bc-agent-applications": {
    resource: "bc-agent-applications",
    title: "BC Agent Applications",
    eyebrow: "Leads",
    createLabel: "",
    allowCreate: false,
    hideEditor: true,
    previewOnRowClick: true,
    previewTitleField: "full_name",
    previewTitleFallback: "BC Agent Application",
    previewKicker: "Application Preview",
    previewFields: [
      "full_name",
      "phone",
      "email",
      "pan_number",
      "aadhar_number",
      "bank_name",
      "state",
      "district",
      "city",
      "pincode",
      "address",
      "status",
      "created_at",
    ],
    columns: ["full_name", "phone", "email", "bank_name", "state", "district", "status", "created_at"],
    searchPlaceholder: "Search by name, phone, email, PAN, Aadhar, bank, district, area, pincode, or status",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", readOnly: true },
      { name: "phone", label: "Phone", type: "text", readOnly: true },
      { name: "email", label: "Email", type: "email", readOnly: true },
      { name: "pan_number", label: "PAN", type: "text", readOnly: true },
      { name: "aadhar_number", label: "Aadhar", type: "text", readOnly: true },
      { name: "bank_name", label: "Bank", type: "text", readOnly: true },
      { name: "state", label: "State", type: "text", readOnly: true },
      { name: "district", label: "District", type: "text", readOnly: true },
      { name: "city", label: "Area", type: "text", readOnly: true },
      { name: "pincode", label: "Pincode", type: "text", readOnly: true },
      { name: "address", label: "Address", type: "textarea", wide: true, readOnly: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["new", "contacted", "approved", "rejected", "archived"],
      },
    ],
  },
  jobs: {
    resource: "jobs",
    title: "Job Openings",
    eyebrow: "Careers",
    createLabel: "Post New Job",
    allowCreate: true,
    switchEditor: true,
    columns: ["title", "department", "location", "status", "applications_count", "created_at"],
    fields: [
      { name: "title", label: "Job Title", type: "text", required: true },
      {
        name: "department",
        label: "Department",
        type: "select",
        required: true,
        options: [
          { value: "Development", label: "Development" },
          { value: "HR", label: "HR" },
          { value: "Marketing", label: "Marketing" },
          { value: "Sales", label: "Sales" },
          { value: "Operations", label: "Operations" },
          { value: "Finance", label: "Finance" },
          { value: "Design", label: "Design" },
        ],
      },
      { name: "location", label: "Location", type: "text", defaultValue: "Remote" },
      { name: "experience_required", label: "Experience Required", type: "text", placeholder: "e.g. 2-4 years" },
      { name: "image_url", label: "Poster/Image URL", type: "url" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "draft", label: "Draft" },
          { value: "active", label: "Active" },
          { value: "closed", label: "Closed" },
        ],
      },
      { name: "description", label: "Job Description", type: "quill", wide: true },
    ],
  },
  "job-applications": {
    resource: "job-applications",
    title: "Applications",
    eyebrow: "Careers",
    allowCreate: false,
    hideEditor: true,
    previewOnRowClick: true,
    previewTitleField: "full_name",
    previewTitleFallback: "Applicant",
    previewKicker: "Job Application Details",
    previewFields: [
      "email",
      "phone",
      "current_location",
      "experience_years",
      "current_ctc",
      "expected_ctc",
      "notice_period",
      "status",
      "applied_at",
    ],
    previewBodyFields: ["resume_url", "linkedin_url", "portfolio_url", "cover_letter"],
    columns: ["full_name", "email", "phone", "experience_years", "status", "applied_at"],
    fields: [
      { name: "full_name", label: "Full Name", type: "text", readOnly: true },
      { name: "email", label: "Email", type: "email", readOnly: true },
      { name: "phone", label: "Phone", type: "text", readOnly: true },
      { name: "current_location", label: "Current Location", type: "text", readOnly: true },
      { name: "experience_years", label: "Exp (Years)", type: "number", readOnly: true },
      { name: "current_ctc", label: "Current CTC", type: "text", readOnly: true },
      { name: "expected_ctc", label: "Expected CTC", type: "text", readOnly: true },
      { name: "notice_period", label: "Notice Period", type: "text", readOnly: true },
      { name: "resume_url", label: "Resume Link", type: "url", readOnly: true },
      { name: "linkedin_url", label: "LinkedIn", type: "url", readOnly: true },
      { name: "portfolio_url", label: "Portfolio", type: "url", readOnly: true },
      { name: "cover_letter", label: "Cover Letter", type: "textarea", wide: true, readOnly: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "new", label: "New" },
          { value: "reviewed", label: "Reviewed" },
          { value: "shortlisted", label: "Shortlisted" },
          { value: "rejected", label: "Rejected" },
        ],
      },
    ],
  },
};

function getInitialForm(config) {
  return Object.fromEntries(
    config.fields.map((field) => {
      if (field.name === "published_at") {
        return [field.name, ""];
      }
      if (field.type === "quill") {
        return [field.name, ""];
      }
      if (field.type === "blog-category-select") {
        return [field.name, ""];
      }
      return [field.name, field.defaultValue ?? (field.type === "checkbox" ? false : "")];
    })
  );
}

function formatValue(value, fieldName) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (fieldName === "is_active") {
    return Number(value) === 1 || value === true ? "Active" : "Hidden";
  }

  if (fieldName?.endsWith("_at")) {
    return new Date(value).toLocaleDateString();
  }

  if (fieldName === "applications_count") {
    return <strong style={{ color: "#2563eb", fontSize: "1rem" }}>{value}</strong>;
  }

  return String(value);
}

function getFieldLabel(config, fieldName) {
  const field = config.fields.find((item) => item.name === fieldName);
  return field?.label || fieldName.replaceAll("_", " ");
}

function getColumnLabel(config, column) {
  if (column === "photo_url") return "Photo";
  if (column === "logo_url") return "Logo";
  if (column === "is_active") return config.resource === "partners" ? "Visible" : "Active";
  if (column === "status" && config.isBlogsPage) return "Live";
  if (column === "applications_count") return "Total Apps";
  return column.replaceAll("_", " ");
}

function isRecordActive(record) {
  return Number(record?.is_active) === 1 || record?.is_active === true;
}

function normalizeRecordForForm(config, record) {
  const next = getInitialForm(config);

  config.fields.forEach((field) => {
    if (!Object.prototype.hasOwnProperty.call(record, field.name)) {
      return;
    }

    const value = record[field.name];

    if (field.type === "checkbox") {
      next[field.name] = Number(value) === 1 || value === true;
    } else if (field.type === "datetime-local" && value) {
      next[field.name] = new Date(value).toISOString().slice(0, 16);
    } else if (field.type === "blog-category-select") {
      next[field.name] = value ? String(value) : "";
    } else {
      next[field.name] = value ?? "";
    }
  });

  return next;
}

function preparePayload(config, form) {
  return Object.fromEntries(
    config.fields.map((field) => {
      let value = form[field.name];

      if (field.type === "checkbox") {
        value = value ? 1 : 0;
      }

      if (field.type === "number") {
        value = Number(value || 0);
      }

      if (field.type === "blog-category-select") {
        value = value ? Number(value) : null;
      }

      if (field.type === "datetime-local") {
        value = value ? value.replace("T", " ") + ":00" : null;
      }

      if (value === "") {
        value = null;
      }

      return [field.name, value];
    })
  );
}

function FieldControl({ field, value, onChange, readOnly = false, blogCategories = [] }) {
  const commonProps = {
    id: field.name,
    name: field.name,
    value: value ?? "",
    required: field.required,
    readOnly: field.readOnly || readOnly,
    onChange: (event) => onChange(field.name, event.target.value),
  };

  if (field.type === "quill") {
    return readOnly
      ? <div className="admin-quill-readonly" dangerouslySetInnerHTML={{ __html: value || "" }} />
      : <RichEditor value={value} onChange={(html) => onChange(field.name, html)} />;
  }

  if (field.type === "blog-category-select") {
    return (
      <select {...commonProps}>
        <option value="">No category</option>
        {blogCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return <textarea {...commonProps} rows={field.wide ? 7 : 4} />;
  }

  if (field.type === "select") {
    return (
      <select {...commonProps}>
        <option value="">Select</option>
        {field.options.map((option) => {
          const optValue = typeof option === "object" ? option.value : option;
          const optLabel = typeof option === "object" ? option.label : option;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <input
        id={field.name}
        name={field.name}
        type="checkbox"
        checked={Boolean(value)}
        disabled={field.readOnly || readOnly}
        onChange={(event) => onChange(field.name, event.target.checked)}
      />
    );
  }

  return <input {...commonProps} type={field.type || "text"} />;
}

function getColumnStyle(column) {
  if (column === "title" || column === "full_name") return { width: "30%", textAlign: "left", whiteSpace: "normal", wordBreak: "break-word" };
  if (column === "department" || column === "location") return { width: "12%" };
  if (column === "status") return { width: "8%" };
  if (column === "applications_count") return { width: "10%", textAlign: "center" };
  if (column === "created_at" || column === "applied_at") return { width: "10%" };
  return {};
}

function AdminResourcePage({ resourceKey }) {
  const { can } = useOutletContext();
  const [activeResourceKey, setActiveResourceKey] = useState(resourceKey);
  const [drilldownJob, setDrilldownJob] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  const config = useMemo(() => {
    if (viewingRecord) {
      const baseConfig = resourceConfig[activeResourceKey];
      return {
        ...baseConfig,
        title: `Details: ${viewingRecord.full_name || viewingRecord.name || viewingRecord.title || "Record"}`,
        eyebrow: drilldownJob ? drilldownJob.title : baseConfig.title,
      };
    }
    if (activeResourceKey === "job-applications" && drilldownJob) {
      return {
        ...resourceConfig["job-applications"],
        title: `Applications for ${drilldownJob.title}`,
        eyebrow: "Careers",
      };
    }
    return resourceConfig[activeResourceKey];
  }, [activeResourceKey, drilldownJob, viewingRecord]);

  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", slug: "", display_order: 0, is_active: true });
  const [catEditId, setCatEditId] = useState(null);
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(() => getInitialForm(config));
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, ids: [], isBulk: false });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(!config.switchEditor);

  const selectedRecord = useMemo(
    () => rows.find((row) => row.id === editingId),
    [editingId, rows]
  );
  const canView = can(config.resource, "view");
  const canCreate = can(config.resource, "create");
  const canEdit = can(config.resource, "edit");
  const canDelete = can(config.resource, "delete");

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((record) =>
      Object.values(record).some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [rows, searchTerm]);

  const loadRows = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      if (activeResourceKey === "job-applications" && drilldownJob) {
        params.job_id = drilldownJob.id;
      }

      const [data, cats] = await Promise.all([
        adminApi.list(activeResourceKey, params),
        activeResourceKey === "blogs" ? adminApi.listBlogCategories() : Promise.resolve([]),
      ]);
      setRows(data);
      if (cats.length) setBlogCategories(cats);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setRows([]);
    setSearchTerm("");
    setForm(getInitialForm(resourceConfig[resourceKey]));
    setEditingId(null);
    setIsEditorOpen(!resourceConfig[resourceKey].switchEditor);
    setActiveResourceKey(resourceKey);
    setDrilldownJob(null);
    setViewingRecord(null);
    setSelectedIds([]);
  }, [resourceKey]);

  useEffect(() => {
    loadRows();
    setSelectedIds([]);
  }, [activeResourceKey, drilldownJob]);

  const handleChange = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleNew = () => {
    const next = getInitialForm(config);
    if (Object.prototype.hasOwnProperty.call(next, "published_at")) {
      next.published_at = todayForInput();
    }
    setForm(next);
    setEditingId(null);
    setNotice("");
    setError("");
    setIsEditorOpen(true);
  };

  const handleEdit = (record, mode = "auto") => {
    if (activeResourceKey === "jobs" && mode !== "edit") {
      setDrilldownJob(record);
      setActiveResourceKey("job-applications");
      return;
    }

    if (config.previewOnRowClick) {
      setViewingRecord(record);
      return;
    }

    setForm(normalizeRecordForForm(config, record));
    setEditingId(record.id);
    setNotice("");
    setError("");
    setIsEditorOpen(true);
  };

  const handleBack = () => {
    if (viewingRecord) {
      setViewingRecord(null);
    } else if (drilldownJob) {
      setDrilldownJob(null);
      setActiveResourceKey("jobs");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(rows.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkDelete = () => {
    setDeleteConfirm({ show: true, ids: selectedIds, isBulk: true });
  };

  const handleToggleStatus = async (record) => {
    const newStatus = record.status === "active" ? "inactive" : "active";
    try {
      await adminApi.update(activeResourceKey, record.id, { status: newStatus });
      setRows((prev) =>
        prev.map((row) => (row.id === record.id ? { ...row, status: newStatus } : row))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const closeEditor = () => {
    setForm(getInitialForm(config));
    setEditingId(null);
    setIsEditorOpen(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!config.allowCreate && !editingId) {
      setError("Select a record before saving changes.");
      return;
    }

    if ((editingId && !canEdit) || (!editingId && !canCreate)) {
      setError("You do not have permission to save this record.");
      return;
    }

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = preparePayload(config, form);
      if (config.isBlogsPage) {
        payload.status = "published";
        if (!editingId) {
          payload.published_at = new Date().toISOString().slice(0, 19).replace("T", " ");
        }
      }
      if (editingId) {
        await adminApi.update(config.resource, editingId, payload);
        setNotice("Record updated.");
      } else {
        await adminApi.create(config.resource, payload);
        setNotice("Record created.");
      }
      await loadRows();
      if (config.switchEditor) {
        closeEditor();
      } else if (!editingId) {
        handleNew();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (record) => {
    setDeleteConfirm({ show: true, ids: [record.id], isBulk: false });
  };

  const confirmDelete = async () => {
    const { ids, isBulk } = deleteConfirm;
    setIsLoading(true);
    try {
      if (isBulk) {
        await adminApi.bulkDelete(activeResourceKey, ids);
        setNotice(`${ids.length} items deleted successfully`);
        setSelectedIds([]);
      } else {
        await adminApi.remove(config.resource, ids[0]);
        setNotice("Item deleted successfully");
        if (selectedIds.includes(ids[0])) {
          setSelectedIds(prev => prev.filter(i => i !== ids[0]));
        }
      }
      await loadRows();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setDeleteConfirm({ show: false, ids: [], isBulk: false });
    }
  };

  const handleToggleActive = async (record) => {
    if (!canEdit) {
      setError("You do not have permission to update this record.");
      return;
    }

    setError("");
    setNotice("");

    const nextValue = !isRecordActive(record);

    try {
      await adminApi.update(config.resource, record.id, { is_active: nextValue ? 1 : 0 });
      const itemLabel = config.resource === "team-members" ? "Member" : "Partner";
      setNotice(`${itemLabel} ${nextValue ? "activated" : "hidden"}.`);
      await loadRows();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleBlogStatus = async (record) => {
    if (!canEdit) {
      setError("You do not have permission to update this record.");
      return;
    }
    setError("");
    setNotice("");
    const isLive = record.status === "published";
    const payload = { status: isLive ? "draft" : "published" };
    if (!isLive) payload.published_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
      await adminApi.update(config.resource, record.id, payload);
      setNotice(`Blog ${isLive ? "hidden" : "published"}.`);
      await loadRows();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderTableCell = (record, column) => {
    const value = record[column];

    if (column === "status" && activeResourceKey === "jobs") {
      return (
        <label className="admin-status-toggle" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={value === "active"}
            onChange={() => handleToggleStatus(record)}
          />
          <span className="admin-status-toggle__slider"></span>
        </label>
      );
    }

    if (column === "status" && config.isBlogsPage) {
      const isLive = record.status === "published";
      return (
        <button
          type="button"
          className={`admin-toggle ${isLive ? "is-active" : "is-inactive"}`}
          aria-pressed={isLive}
          aria-label={`Mark ${record.title || "blog"} ${isLive ? "inactive" : "active"}`}
          onClick={(event) => {
            event.stopPropagation();
            handleToggleBlogStatus(record);
          }}
        >
          <span className="sr-only">{isLive ? "Live" : "Hidden"}</span>
        </button>
      );
    }

    if (column === "photo_url" && config.resource === "team-members") {
      return record.photo_url ? (
        <img
          src={record.photo_url}
          alt={record.name ? `${record.name} profile` : "Team member profile"}
          className="admin-team-photo"
        />
      ) : (
        <span className="admin-team-photo admin-team-photo--empty">
          {record.name?.slice(0, 2).toUpperCase() || "?"}
        </span>
      );
    }

    if (column === "name" && record.logo_url && config.resource === "partners") {
      return (
        <div className="admin-partner-preview">
          <img
            src={record.logo_url}
            alt={record.name || "Partner logo"}
            className="admin-partner-preview__logo"
          />
          <span>{formatValue(record.name, "name")}</span>
        </div>
      );
    }

    if (column === "is_active" && ["partners", "team-members"].includes(config.resource)) {
      return (
        <button
          type="button"
          className={`admin-toggle ${isRecordActive(record) ? "is-active" : "is-inactive"}`}
          aria-pressed={isRecordActive(record)}
          aria-label={`Mark ${record.name || record.title || "item"} ${isRecordActive(record) ? "inactive" : "active"}`}
          onClick={(event) => {
            event.stopPropagation();
            handleToggleActive(record);
          }}
        >
          <span className="sr-only">
            {isRecordActive(record) ? "Active" : "Inactive"}
          </span>
        </button>
      );
    }

    return formatValue(record[column], column);
  };

  const openCatModal = (cat = null) => {
    setCatEditId(cat?.id || null);
    setCatForm(cat
      ? { name: cat.name, slug: cat.slug, display_order: cat.display_order, is_active: Boolean(cat.is_active) }
      : { name: "", slug: "", display_order: 0, is_active: true }
    );
    setCatError("");
    setShowCatModal(true);
  };

  const saveCat = async (e) => {
    e.preventDefault();
    setCatSaving(true);
    setCatError("");
    try {
      const payload = { ...catForm, display_order: Number(catForm.display_order), is_active: catForm.is_active ? 1 : 0 };
      if (catEditId) {
        await adminApi.update("blog-categories", catEditId, payload);
      } else {
        await adminApi.create("blog-categories", payload);
      }
      const cats = await adminApi.listBlogCategories();
      setBlogCategories(cats);
      setShowCatModal(false);
    } catch (err) {
      setCatError(err.message);
    } finally {
      setCatSaving(false);
    }
  };

  const deleteCat = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await adminApi.remove("blog-categories", id);
      const cats = await adminApi.listBlogCategories();
      setBlogCategories(cats);
    } catch (err) {
      setCatError(err.message);
    }
  };

  if (!canView) {
    return <p className="admin-error">You do not have permission to view this page.</p>;
  }

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {(drilldownJob || viewingRecord) && (
            <button 
              type="button" 
              className="admin-btn admin-btn--outline" 
              onClick={handleBack} 
              title={viewingRecord ? "Back to List" : "Back to Job Openings"} 
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              <span>Back</span>
            </button>
          )}
          <div>
            <p className="admin-kicker">{config.eyebrow}</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>{config.title}</h2>
          </div>
        </div>

        <div className="admin-action-row">
          {!viewingRecord && selectedIds.length > 0 && canDelete && (
            <button 
              type="button" 
              className="admin-btn admin-btn--danger" 
              onClick={handleBulkDelete}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <i className="fa-solid fa-trash" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          {config.isBlogsPage && can("blog-categories", "view") ? (
            <button type="button" className="admin-secondary-btn" onClick={() => openCatModal()}>
              <i className="fa-solid fa-tags" aria-hidden="true" />
              <span>Manage Categories</span>
            </button>
          ) : null}
          {config.allowCreate && canCreate ? (
            <button type="button" className="admin-secondary-btn" onClick={handleNew}>
              <i className="fa-solid fa-plus" aria-hidden="true" />
              <span>{config.createLabel}</span>
            </button>
          ) : null}
        </div>
      </div>

      {(!config.switchEditor || !isEditorOpen) ? (
      <div className="admin-toolbar">
        <label className="admin-search">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={config.searchPlaceholder || `Search ${config.title.toLowerCase()}`}
            aria-label={`Search ${config.title}`}
          />
        </label>
        <span className="admin-result-count">
          {filteredRows.length} of {rows.length} records
        </span>
      </div>
      ) : null}

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      {(!config.switchEditor || !isEditorOpen) ? (
      <div className={config.hideEditor || config.switchEditor ? "admin-resource-grid admin-resource-grid--table-only" : "admin-resource-grid"}>
        <div className="admin-table-panel">
          {viewingRecord ? (
            <div className="admin-details-view">
              <div className="admin-details-view__header">
                <div>
                  <h3>{viewingRecord[config.previewTitleField] || viewingRecord.full_name || viewingRecord.name || viewingRecord.title || "Details"}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                    Applied At: {formatValue(viewingRecord.applied_at || viewingRecord.created_at, "applied_at")}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {viewingRecord.resume_url && (
                    <a 
                      href={viewingRecord.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Download/View Resume"
                      style={{ 
                        color: '#2563eb', 
                        fontSize: '1.1rem',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                      }}
                      className="admin-header-icon-btn"
                    >
                      <i className="fa-solid fa-file-pdf" aria-hidden="true" />
                    </a>
                  )}
                  <button 
                    type="button" 
                    onClick={handleBack} 
                    title="Close"
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: '#64748b', 
                      fontSize: '1.2rem',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background 0.2s'
                    }}
                    className="admin-header-icon-btn"
                  >
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="admin-details-view__grid">
                {(config.previewFields || config.columns)
                  .filter(field => !["resume_url", "applied_at", "created_at", "status"].includes(field))
                  .map((field) => {
                  const fieldConfig = config.fields.find(f => f.name === field);
                  const value = viewingRecord[field];
                  
                  return (
                    <div key={field} className={`admin-details-item ${fieldConfig?.wide ? "admin-details-item--wide" : ""}`}>
                      <label>{getFieldLabel(config, field)}</label>
                      <p>
                        {fieldConfig?.type === "url" && value ? (
                          <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                            View Link
                          </a>
                        ) : formatValue(value, field)}
                      </p>
                    </div>
                  );
                })}
                
                {(config.previewBodyFields || [])
                  .filter(field => field !== "resume_url")
                  .map((field) => (
                  <div key={field} className="admin-details-item admin-details-item--full">
                    <label>{getFieldLabel(config, field)}</label>
                    <p className="admin-details-text">
                      {config.fields.find(f => f.name === field)?.type === "url" && viewingRecord[field] ? (
                        <a href={viewingRecord[field]} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                          {viewingRecord[field]}
                        </a>
                      ) : (viewingRecord[field] || "No content provided.")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className={`admin-table${config.resource === "team-members" ? " admin-table--team-members" : ""}`}>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={rows.length > 0 && selectedIds.length === rows.length} 
                      />
                    </th>
                    <th className="admin-table__serial">S.No.</th>
                    {config.columns.map((column) => (
                        <th key={column} style={getColumnStyle(column)}>{getColumnLabel(config, column)}</th>
                      ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={config.columns.length + 3}>Loading...</td>
                    </tr>
                  ) : filteredRows.length ? (
                    filteredRows.map((record, index) => (
                      <tr
                        key={record.id}
                        className={[
                          editingId === record.id ? "is-selected" : "",
                          (config.previewOnRowClick || activeResourceKey === "jobs" || activeResourceKey === "job-applications") ? "is-clickable" : "",
                          selectedIds.includes(record.id) ? "row-selected" : "",
                        ].filter(Boolean).join(" ")}
                        onClick={() => handleEdit(record)}
                      >
                        <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(record.id)} 
                            onChange={(e) => handleSelectRow(e, record.id)} 
                          />
                        </td>
                        <td className="admin-table__serial">{index + 1}</td>
                        {config.columns.map((column) => (
                          <td key={column} style={getColumnStyle(column)}>
                            {renderTableCell(record, column, config)}
                          </td>
                        ))}
                        <td>
                          <div className="admin-table-actions">
                            {activeResourceKey === "jobs" && (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleEdit(record, "edit");
                                }}
                                title="Edit Job"
                              >
                                <i className="fa-solid fa-pen" aria-hidden="true" />
                              </button>
                            )}
                            {config.isBlogsPage && record.slug ? (
                              <a
                                href={`/blog/${record.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-table-actions__link"
                                title="View on site"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                              </a>
                            ) : null}
                            {canDelete ? (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDelete(record);
                                }}
                                title="Delete"
                              >
                                <i className="fa-solid fa-trash" aria-hidden="true" />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={config.columns.length + 3}>
                        {rows.length ? "No records match your search." : "No records yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      ) : null}

      {!config.hideEditor && (!config.switchEditor || isEditorOpen) ? (
        <form className={config.switchEditor ? "admin-editor-panel admin-editor-panel--inline" : "admin-editor-panel"} onSubmit={handleSubmit}>
          <div className="admin-editor-panel__header">
            <div>
              <p className="admin-kicker">
                {editingId ? "Review" : config.allowCreate ? "Create" : "Details"}
              </p>
              <h3>{selectedRecord?.name || selectedRecord?.title || selectedRecord?.full_name || config.title}</h3>
            </div>
            {config.switchEditor ? (
              <button type="button" className="admin-icon-btn" onClick={closeEditor} title="Close">
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {!config.allowCreate && !editingId ? (
            <p className="admin-empty-state">
              Select a record from the table to review details and update its status.
            </p>
          ) : (
            <>
              <div className="admin-form-grid">
                {config.fields.map((field) => {
                  const fieldClasses = [
                    "admin-field",
                    field.wide ? "admin-field--wide" : "",
                    field.type === "checkbox" ? "admin-field--checkbox" : "",
                  ].filter(Boolean).join(" ");

                  if (field.type === "quill") {
                    return (
                      <div key={field.name} className={fieldClasses}>
                        <span>{field.label}</span>
                        <FieldControl
                          field={field}
                          value={form[field.name]}
                          onChange={handleChange}
                          readOnly={editingId ? !canEdit : !canCreate}
                          blogCategories={blogCategories}
                        />
                      </div>
                    );
                  }

                  return (
                    <label key={field.name} className={fieldClasses}>
                      <span>{field.label}</span>
                      <FieldControl
                        field={field}
                        value={form[field.name]}
                        onChange={handleChange}
                        readOnly={editingId ? !canEdit : !canCreate}
                        blogCategories={blogCategories}
                      />
                    </label>
                  );
                })}
              </div>

              {(editingId ? canEdit : canCreate) ? (
                <button type="submit" className="admin-primary-btn" disabled={isSaving}>
                  <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
                  <span>{isSaving ? "Saving..." : editingId ? "Save Changes" : "Create Record"}</span>
                </button>
              ) : null}
            </>
          )}
        </form>
      ) : null}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="admin-modal-overlay">
          <div className="admin-modal--confirm-dark">
            <div className="admin-modal__header">
              <h3>Confirm delete</h3>
            </div>
            <div className="admin-modal__body">
              <p>
                Are you sure you want to delete {deleteConfirm.isBulk ? `${deleteConfirm.ids.length} selected items` : "this item"}?
              </p>
            </div>
            <div className="admin-modal__footer">
              <button 
                className="admin-btn--cancel" 
                onClick={() => setDeleteConfirm({ show: false, ids: [], isBulk: false })}
              >
                Cancel
              </button>
              <button 
                className="admin-btn--delete" 
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showCatModal ? (
        <div className="admin-profile-dialog-overlay" onClick={() => setShowCatModal(false)}>
          <div className="admin-cat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-profile-dialog__header">
              <strong>Manage Blog Categories</strong>
              <button type="button" className="admin-profile-dialog__close" onClick={() => setShowCatModal(false)}>×</button>
            </div>

            <div className="admin-cat-modal__list">
              {blogCategories.map((cat) => (
                <div key={cat.id} className="admin-cat-modal__item">
                  <span>{cat.name}</span>
                  <div className="admin-table-actions">
                    <button type="button" title="Edit" onClick={() => openCatModal(cat)}>
                      <i className="fa-solid fa-pen" />
                    </button>
                    {can("blog-categories", "delete") ? (
                      <button type="button" title="Delete" onClick={() => deleteCat(cat.id)}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {blogCategories.length === 0 && <p style={{ color: "#94a3b8", margin: 0 }}>No categories yet.</p>}
            </div>

            <form onSubmit={saveCat} style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8", fontWeight: 700 }}>
                {catEditId ? "EDIT CATEGORY" : "ADD NEW CATEGORY"}
              </p>
              <input
                className="admin-profile-dialog__input"
                placeholder="Category name"
                value={catForm.name}
                required
                onChange={(e) => {
                  const name = e.target.value;
                  setCatForm((f) => ({
                    ...f,
                    name,
                    slug: catEditId ? f.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
                  }));
                }}
              />
              <input
                className="admin-profile-dialog__input"
                placeholder="Slug (auto-filled)"
                value={catForm.slug}
                required
                onChange={(e) => setCatForm((f) => ({ ...f, slug: e.target.value }))}
              />
              {catError ? <p style={{ color: "#fca5a5", margin: 0, fontSize: "0.88rem" }}>{catError}</p> : null}
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="admin-profile-dialog__button" disabled={catSaving} style={{ flex: 1 }}>
                  {catSaving ? "Saving..." : catEditId ? "Update" : "Add Category"}
                </button>
                {catEditId ? (
                  <button type="button" className="admin-profile-dialog__button" style={{ flex: 1, background: "#374151" }}
                    onClick={() => { setCatEditId(null); setCatForm({ name: "", slug: "", display_order: 0, is_active: true }); }}>
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AdminResourcePage;
