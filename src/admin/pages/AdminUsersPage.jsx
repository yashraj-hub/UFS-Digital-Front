import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { PERMISSION_AREAS, getBlankPermissions, getPermissionMap } from "../permissions";
import ConfirmDialog from "../components/ConfirmDialog";
import { adminApi } from "../services/adminApi";

const blankUserForm = {
  name: "",
  email: "",
  password: "",
  role_id: "",
  is_active: true,
};

const blankRoleForm = {
  name: "",
  description: "",
  is_active: true,
  permissions: getBlankPermissions(),
};

function mergePermissions(permissions = []) {
  const permissionMap = getPermissionMap(permissions);

  return getBlankPermissions().map((permission) => {
    const existing = permissionMap[permission.area];
    const hasAccess = Boolean(
      existing?.can_view ||
      existing?.can_create ||
      existing?.can_edit ||
      existing?.can_delete
    );

    return {
      ...permission,
      can_view: hasAccess,
      can_create: hasAccess,
      can_edit: hasAccess,
      can_delete: hasAccess,
    };
  });
}

function hasPageAccess(permission) {
  return Boolean(
    permission?.can_view ||
    permission?.can_create ||
    permission?.can_edit ||
    permission?.can_delete
  );
}

function AdminUsersPage() {
  const { session, can } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tableMode, setTableMode] = useState("users");
  const [formMode, setFormMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userForm, setUserForm] = useState(blankUserForm);
  const [roleForm, setRoleForm] = useState(blankRoleForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const canViewUsers = can("admin-users", "view");
  const canCreateUsers = can("admin-users", "create");
  const canEditUsers = can("admin-users", "edit");
  const canDeleteUsers = can("admin-users", "delete");
  const canViewRoles = can("roles", "view");
  const canCreateRoles = can("roles", "create");
  const canEditRoles = can("roles", "edit");
  const canDeleteRoles = can("roles", "delete");

  const selectedUser = useMemo(
    () => users.find((user) => formMode === "user" && user.id === editingId),
    [editingId, formMode, users]
  );

  const selectedRole = useMemo(
    () => roles.find((role) => formMode === "role" && role.id === editingId),
    [editingId, formMode, roles]
  );

  const isSuperAdminRole = selectedRole?.slug === "super_admin";
  const canChangeUser = editingId ? canEditUsers : canCreateUsers;
  const canChangeRole = editingId ? canEditRoles && !isSuperAdminRole : canCreateRoles;

  const visibleUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query || tableMode !== "users") {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email, user.role_name, user.role, user.is_active ? "active" : "inactive"]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchTerm, tableMode, users]);

  const visibleRoles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query || tableMode !== "roles") {
      return roles;
    }

    return roles.filter((role) =>
      [role.name, role.slug, role.description, role.is_active ? "active" : "inactive"]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [roles, searchTerm, tableMode]);

  const loadData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [nextUsers, nextRoles] = await Promise.all([
        canViewUsers ? adminApi.listUsers() : Promise.resolve([]),
        canViewRoles || canViewUsers || canCreateUsers || canEditUsers
          ? adminApi.listRoles()
          : Promise.resolve([]),
      ]);
      setUsers(nextUsers);
      setRoles(nextRoles);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!canViewUsers && canViewRoles) {
      setTableMode("roles");
    }
    loadData();
  }, []);

  const resetForms = () => {
    setFormMode(null);
    setEditingId(null);
    setUserForm(blankUserForm);
    setRoleForm(blankRoleForm);
  };

  const openUserForm = () => {
    setTableMode("users");
    setFormMode("user");
    setEditingId(null);
    setUserForm(blankUserForm);
    setNotice("");
    setError("");
  };

  const openRoleForm = () => {
    setTableMode("roles");
    setFormMode("role");
    setEditingId(null);
    setRoleForm(blankRoleForm);
    setNotice("");
    setError("");
  };

  const editUser = (user) => {
    setTableMode("users");
    setFormMode("user");
    setEditingId(user.id);
    setUserForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role_id: user.role_id || "",
      is_active: Boolean(user.is_active),
    });
    setNotice("");
    setError("");
  };

  const editRole = (role) => {
    setTableMode("roles");
    setFormMode("role");
    setEditingId(role.id);
    setRoleForm({
      name: role.name || "",
      description: role.description || "",
      is_active: Boolean(role.is_active),
      permissions: mergePermissions(role.permissions),
    });
    setNotice("");
    setError("");
  };

  const changeUserForm = (name, value) => {
    setUserForm((current) => ({ ...current, [name]: value }));
  };

  const changeRoleForm = (name, value) => {
    setRoleForm((current) => ({ ...current, [name]: value }));
  };

  const changeRolePermission = (area, checked) => {
    setRoleForm((current) => ({
      ...current,
      permissions: current.permissions.map((permission) => {
        if (permission.area !== area) {
          return permission;
        }

        return {
          ...permission,
          can_view: checked,
          can_create: checked,
          can_edit: checked,
          can_delete: checked,
        };
      }),
    }));
  };

  const saveUser = async (event) => {
    event.preventDefault();

    if (!canChangeUser) {
      setError("You do not have permission to save admin users.");
      return;
    }

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...userForm,
        role_id: Number(userForm.role_id),
      };

      if (editingId && !payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await adminApi.updateUser(editingId, payload);
        setNotice("Admin user updated.");
      } else {
        await adminApi.createUser(payload);
        setNotice("Admin user registered.");
      }

      resetForms();
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveRole = async (event) => {
    event.preventDefault();

    if (!canChangeRole) {
      setError("You do not have permission to save roles.");
      return;
    }

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        name: roleForm.name,
        description: roleForm.description,
        is_active: roleForm.is_active,
        permissions: roleForm.permissions.map((permission) => {
          const allowed = hasPageAccess(permission);

          return {
            area: permission.area,
            can_view: allowed,
            can_create: allowed,
            can_edit: allowed,
            can_delete: allowed,
          };
        }),
      };

      if (editingId) {
        await adminApi.updateRole(editingId, payload);
        setNotice("Role updated.");
      } else {
        await adminApi.createRole(payload);
        setNotice("Role created.");
      }

      resetForms();
      setTableMode("roles");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = (user) => {
    if (!canDeleteUsers) {
      setError("You do not have permission to delete admin users.");
      return;
    }

    if (user.id === session?.admin?.id) {
      setError("You cannot delete your own account.");
      return;
    }

    setPendingDelete({ type: "user", item: user });
  };

  const deleteRole = (role) => {
    if (!canDeleteRoles) {
      setError("You do not have permission to delete roles.");
      return;
    }

    setPendingDelete({ type: "role", item: role });
  };

  const performDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const { type, item } = pendingDelete;
    setPendingDelete(null);
    setError("");
    setNotice("");

    try {
      if (type === "user") {
        await adminApi.removeUser(item.id);
        setNotice("Admin user deleted.");
        if (formMode === "user" && editingId === item.id) {
          resetForms();
        }
      } else {
        await adminApi.removeRole(item.id);
        setNotice("Role deleted.");
        if (formMode === "role" && editingId === item.id) {
          resetForms();
        }
      }
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const switchTable = (mode) => {
    setTableMode(mode);
    setSearchTerm("");
    resetForms();
  };

  if (!canViewUsers && !canViewRoles) {
    return <p className="admin-error">You do not have permission to view users or roles.</p>;
  }

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div>
          <h2 style={{color:'#fff'}} >Users & Roles</h2>
        </div>

        <div className="admin-action-row">
          {canCreateUsers ? (
            <button type="button" className="admin-secondary-btn" onClick={openUserForm}>
              <i className="fa-solid fa-user-plus" aria-hidden="true" />
              <span>Create User</span>
            </button>
          ) : null}
          {canCreateRoles ? (
            <button type="button" className="admin-secondary-btn" onClick={openRoleForm}>
              <i className="fa-solid fa-key" aria-hidden="true" />
              <span>Create Role</span>
            </button>
          ) : null}
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      {formMode === "user" ? (
        <form className="admin-editor-panel admin-editor-panel--inline" onSubmit={saveUser}>
          <div className="admin-editor-panel__header">
            <div>
              <p className="admin-kicker">{editingId ? "Edit User" : "Register User"}</p>
              <h3>{selectedUser?.name || "Admin account"}</h3>
            </div>
            <button type="button" className="admin-icon-btn" onClick={resetForms} title="Close">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Name</span>
              <input
                type="text"
                value={userForm.name}
                onChange={(event) => changeUserForm("name", event.target.value)}
                readOnly={!canChangeUser}
                required
              />
            </label>

            <label className="admin-field">
              <span>Email</span>
              <input
                type="email"
                value={userForm.email}
                onChange={(event) => changeUserForm("email", event.target.value)}
                readOnly={!canChangeUser}
                required
              />
            </label>

            <label className="admin-field">
              <span>Role</span>
              <select
                value={userForm.role_id}
                onChange={(event) => changeUserForm("role_id", event.target.value)}
                disabled={!canChangeUser}
                required
              >
                <option value="">Select role</option>
                {roles.filter((role) => role.is_active).map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              <span>{editingId ? "New Password" : "Password"}</span>
              <input
                type="password"
                value={userForm.password}
                onChange={(event) => changeUserForm("password", event.target.value)}
                readOnly={!canChangeUser}
                required={!editingId}
                autoComplete="new-password"
              />
            </label>

            <label className="admin-field admin-field--checkbox">
              <span>Active</span>
              <input
                type="checkbox"
                checked={userForm.is_active}
                onChange={(event) => changeUserForm("is_active", event.target.checked)}
                disabled={!canChangeUser}
              />
            </label>
          </div>

          {canChangeUser ? (
            <button type="submit" className="admin-primary-btn" disabled={isSaving}>
              <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
              <span>{isSaving ? "Saving..." : editingId ? "Save Changes" : "Register User"}</span>
            </button>
          ) : null}
        </form>
      ) : null}

      {formMode === "role" ? (
        <form className="admin-editor-panel admin-editor-panel--inline" onSubmit={saveRole}>
          <div className="admin-editor-panel__header">
            <div>
              <p className="admin-kicker">{editingId ? "Edit Role" : "Create Role"}</p>
              <h3>{selectedRole?.name || "Role access"}</h3>
            </div>
            <button type="button" className="admin-icon-btn" onClick={resetForms} title="Close">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>

          {isSuperAdminRole ? (
            <p className="admin-empty-state">Super Admin always has full access and cannot be edited.</p>
          ) : null}

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Name</span>
              <input
                type="text"
                value={roleForm.name}
                onChange={(event) => changeRoleForm("name", event.target.value)}
                readOnly={!canChangeRole}
                required
              />
            </label>

            <label className="admin-field admin-field--checkbox">
              <span>Active</span>
              <input
                type="checkbox"
                checked={roleForm.is_active}
                onChange={(event) => changeRoleForm("is_active", event.target.checked)}
                disabled={!canChangeRole}
              />
            </label>

            <label className="admin-field admin-field--wide">
              <span>Description</span>
              <textarea
                rows="3"
                value={roleForm.description}
                onChange={(event) => changeRoleForm("description", event.target.value)}
                readOnly={!canChangeRole}
              />
            </label>
          </div>

          <div className="admin-permission-panel">
            <div className="admin-permission-panel__header">
              <p className="admin-kicker">Page Access</p>
            </div>

            <div className="admin-permission-table-wrap">
              <table className="admin-permission-table">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Access</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_AREAS.map((area) => {
                    const permission = roleForm.permissions.find((item) => item.area === area.key);
                    const checked = hasPageAccess(permission) || isSuperAdminRole;

                    return (
                      <tr key={area.key}>
                        <td>{area.label}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!canChangeRole}
                            onChange={(event) => changeRolePermission(area.key, event.target.checked)}
                            aria-label={`${area.label} access`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {canChangeRole ? (
            <button type="submit" className="admin-primary-btn" disabled={isSaving}>
              <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
              <span>{isSaving ? "Saving..." : editingId ? "Save Changes" : "Create Role"}</span>
            </button>
          ) : null}
        </form>
      ) : null}

      {!formMode ? (
        <>
          <div className="admin-toolbar">
            <div className="admin-table-switch" role="tablist" aria-label="Access table">
              {canViewUsers ? (
                <button
                  type="button"
                  className={tableMode === "users" ? "is-active" : ""}
                  onClick={() => switchTable("users")}
                >
                  Users
                </button>
              ) : null}
              {canViewRoles ? (
                <button
                  type="button"
                  className={tableMode === "roles" ? "is-active" : ""}
                  onClick={() => switchTable("roles")}
                >
                  Roles
                </button>
              ) : null}
            </div>

            <label className="admin-search">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={tableMode === "users" ? "Search users" : "Search roles"}
                aria-label={tableMode === "users" ? "Search users" : "Search roles"}
              />
            </label>

            <span className="admin-result-count">
              {tableMode === "users"
                ? `${visibleUsers.length} of ${users.length} records`
                : `${visibleRoles.length} of ${roles.length} records`}
            </span>
          </div>

          <div className="admin-table-panel">
            <div className="admin-table-wrap">
              {tableMode === "users" ? (
                <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table__serial">S.No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : visibleUsers.length ? (
                  visibleUsers.map((user, index) => (
                    <tr key={user.id} className={formMode === "user" && editingId === user.id ? "is-selected" : ""}>
                      <td className="admin-table__serial">{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role_name}</td>
                      <td>{user.is_active ? "Active" : "Inactive"}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button type="button" onClick={() => editUser(user)} title={canEditUsers ? "Edit" : "View"}>
                            <i className={`fa-solid ${canEditUsers ? "fa-pen" : "fa-eye"}`} aria-hidden="true" />
                          </button>
                          {canDeleteUsers ? (
                            <button type="button" onClick={() => deleteUser(user)} title="Delete">
                              <i className="fa-solid fa-trash" aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">{users.length ? "No users match your search." : "No users yet."}</td>
                  </tr>
                )}
              </tbody>
            </table>
              ) : (
                <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table__serial">S.No.</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : visibleRoles.length ? (
                  visibleRoles.map((role, index) => (
                    <tr key={role.id} className={formMode === "role" && editingId === role.id ? "is-selected" : ""}>
                      <td className="admin-table__serial">{index + 1}</td>
                      <td>{role.name}</td>
                      <td>{role.description || "-"}</td>
                      <td>{role.is_active ? "Active" : "Inactive"}</td>
                      <td>{role.is_system ? "System" : "Custom"}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button type="button" onClick={() => editRole(role)} title={canEditRoles ? "Edit" : "View"}>
                            <i className={`fa-solid ${canEditRoles ? "fa-pen" : "fa-eye"}`} aria-hidden="true" />
                          </button>
                          {canDeleteRoles && !role.is_system ? (
                            <button type="button" onClick={() => deleteRole(role)} title="Delete">
                              <i className="fa-solid fa-trash" aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">{roles.length ? "No roles match your search." : "No roles yet."}</td>
                  </tr>
                )}
              </tbody>
            </table>
              )}
            </div>
          </div>
          <ConfirmDialog
            open={Boolean(pendingDelete)}
            title="Confirm delete"
            message={`Are you sure you want to delete "${pendingDelete?.type === "user" ? pendingDelete?.item?.email : pendingDelete?.item?.name}"?`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={performDelete}
            onCancel={() => setPendingDelete(null)}
          />
        </>
      ) : null}
    </section>
  );
}

export default AdminUsersPage;
