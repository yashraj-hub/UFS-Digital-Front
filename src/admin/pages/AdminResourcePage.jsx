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
    return new Date(value).toLocaleString();
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
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
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

function AdminResourcePage({ resourceKey }) {
  const { can } = useOutletContext();
  const config = resourceConfig[resourceKey];
  const [rows, setRows] = useState([]);
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
  const [previewRecord, setPreviewRecord] = useState(null);
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
      const [data, cats] = await Promise.all([
        adminApi.list(config.resource),
        config.resource === "blogs" ? adminApi.listBlogCategories() : Promise.resolve([]),
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
    setForm(getInitialForm(config));
    setEditingId(null);
    setPreviewRecord(null);
    setIsEditorOpen(!config.switchEditor);
    loadRows();
  }, [config.resource]);

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

  const handleEdit = (record) => {
    if (config.previewOnRowClick) {
      setPreviewRecord(record);
      return;
    }

    setForm(normalizeRecordForForm(config, record));
    setEditingId(record.id);
    setNotice("");
    setError("");
    setIsEditorOpen(true);
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
    if (!canDelete) {
      setError("You do not have permission to delete this record.");
      return;
    }

    setPendingDelete(record);
  };

  const performDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const record = pendingDelete;
    setPendingDelete(null);
    setError("");
    setNotice("");

    try {
      await adminApi.remove(config.resource, record.id);
      setNotice("Record deleted.");
      if (editingId === record.id) {
        if (config.switchEditor) {
          closeEditor();
        } else {
          handleNew();
        }
      }
      await loadRows();
    } catch (err) {
      setError(err.message);
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
        <div>
          <p className="admin-kicker">{config.eyebrow}</p>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>{config.title}</h2>
        </div>

        <div className="admin-action-row">
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
          <div className="admin-table-wrap">
            <table className={`admin-table${config.resource === "team-members" ? " admin-table--team-members" : ""}`}>
              <thead>
                <tr>
                  <th className="admin-table__serial">S.No.</th>
                  {config.columns.map((column) => (
                    <th key={column}>{getColumnLabel(config, column)}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={config.columns.length + 2}>Loading...</td>
                  </tr>
                ) : filteredRows.length ? (
                  filteredRows.map((record, index) => (
                    <tr
                      key={record.id}
                      className={[
                        editingId === record.id ? "is-selected" : "",
                        config.previewOnRowClick ? "is-clickable" : "",
                      ].filter(Boolean).join(" ")}
                      onClick={config.previewOnRowClick ? () => setPreviewRecord(record) : undefined}
                    >
                      <td className="admin-table__serial">{index + 1}</td>
                      {config.columns.map((column) => (
                        <td key={column}>{renderTableCell(record, column, config)}</td>
                      ))}
                      <td>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEdit(record);
                            }}
                            title={config.previewOnRowClick ? "Preview" : canEdit ? "Edit" : "View"}
                          >
                            <i className={`fa-solid ${config.previewOnRowClick || !canEdit ? "fa-eye" : "fa-pen"}`} aria-hidden="true" />
                          </button>
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
                    <td colSpan={config.columns.length + 2}>
                      {rows.length ? "No records match your search." : "No records yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

      {previewRecord ? (
        <div className="admin-preview-overlay" role="presentation" onClick={() => setPreviewRecord(null)}>
          <section
            className="admin-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-preview-modal__header">
              <div>
                <p className="admin-kicker">{config.previewKicker || "Record Preview"}</p>
                <h3 id="admin-preview-title">
                  {previewRecord[config.previewTitleField] || config.previewTitleFallback || config.title}
                </h3>
              </div>
              <button type="button" className="admin-icon-btn" onClick={() => setPreviewRecord(null)} title="Close">
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <dl className="admin-preview-list">
              {(config.previewFields || config.columns).map((fieldName) => (
                <div key={fieldName}>
                  <dt>{getFieldLabel(config, fieldName)}</dt>
                  <dd>{formatValue(previewRecord[fieldName], fieldName)}</dd>
                </div>
              ))}
            </dl>

            {(config.previewBodyFields || []).map((fieldName) => (
              <div key={fieldName} className="admin-preview-message">
                <p className="admin-kicker">{getFieldLabel(config, fieldName)}</p>
                <p>{formatValue(previewRecord[fieldName], fieldName)}</p>
              </div>
            ))}
          </section>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Confirm delete"
        message={`Are you sure you want to delete "${pendingDelete?.name || pendingDelete?.title || pendingDelete?.full_name || pendingDelete?.email}"?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={performDelete}
        onCancel={() => setPendingDelete(null)}
      />

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
