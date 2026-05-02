export const isAdmin = (user) => user?.role === 'admin';
export const isAnnotator = (user) => user?.role === 'annotator';
export const isReviewer = (user) => user?.role === 'reviewer';

export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'annotator': return '/annotator/dashboard';
    case 'reviewer': return '/reviewer/dashboard';
    default: return '/login';
  }
};