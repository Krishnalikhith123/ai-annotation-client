export const API_URL = 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'admin',
  ANNOTATOR: 'annotator',
  REVIEWER: 'reviewer',
};

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const PROJECT_TYPES = ['image', 'text', 'audio', 'video'];

export const PROJECT_STATUS = ['active', 'completed', 'paused'];