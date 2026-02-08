const USERS_KEY = 'hdmovies_users';
const SESSION_KEY = 'hdmovies_session';

const getUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const registerUser = (name, email, password) => {
  const users = getUsers();
  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    throw new Error('Email already exists. Please login instead.');
  }

  const nextUser = { name, email, password };
  saveUsers([...users, nextUser]);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));

  return { name, email };
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password.');
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  return { name: user.name, email: user.email };
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};
