export const ACTIONS = ["view", "create", "edit", "delete"];

export const PERMISSION_AREAS = [
  { key: "dashboard", label: "Overview" },
  { key: "blog-categories", label: "Blog Categories" },
  { key: "blogs", label: "Blogs" },
  { key: "team-members", label: "Team" },
  { key: "partners", label: "Partners" },
  { key: "contact-submissions", label: "Contact Messages" },
  { key: "bc-agent-applications", label: "BC Agent Leads" },
  { key: "admin-users", label: "Admin Users" },
  { key: "roles", label: "Roles" },
];

export function getBlankPermissions() {
  return PERMISSION_AREAS.map((area) => ({
    area: area.key,
    can_view: false,
    can_create: false,
    can_edit: false,
    can_delete: false,
  }));
}

export function getPermissionMap(permissions = []) {
  return Object.fromEntries(permissions.map((permission) => [permission.area, permission]));
}
