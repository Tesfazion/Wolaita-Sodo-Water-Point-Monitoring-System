export const ROLES = {
  ADMIN: 'admin',
  OFFICE: 'office_user',
  TECHNICIAN: 'technician'
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isOfficeUser = (user) => user?.role === ROLES.OFFICE;
export const isTechnician = (user) => user?.role === ROLES.TECHNICIAN;

export const canManageWaterPoints = (user) => isAdmin(user) || isOfficeUser(user);
export const canViewAnalytics = (user) => isAdmin(user) || isOfficeUser(user);
export const canManageOffices = (user) => isAdmin(user);

export const getRoleLabel = (t, role) => {
  switch (role) {
    case ROLES.ADMIN: return t('admin.roleAdmin');
    case ROLES.OFFICE: return t('admin.roleOffice');
    case ROLES.TECHNICIAN: return t('admin.roleTechnician');
    default: return role || '';
  }
};
