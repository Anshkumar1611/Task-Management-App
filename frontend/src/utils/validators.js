export const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(String(email || '').trim());

export const validateSignup = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!validateEmail(email)) errors.email = 'Enter a valid email address';
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (confirmPassword !== undefined && confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!validateEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
};

export const validateTask = ({ title, description }) => {
  const errors = {};
  if (!title || !title.trim()) errors.title = 'Title is required';
  else if (title.length > 120) errors.title = 'Title must be 120 characters or less';
  if (description && description.length > 2000) errors.description = 'Description is too long';
  return errors;
};
