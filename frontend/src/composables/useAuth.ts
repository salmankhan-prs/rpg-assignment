import { ref, computed } from 'vue';

// Simple auth state (no Pinia needed for MVP)
const token = ref<string | null>(localStorage.getItem('token'));
const user = ref<{ id: string; name: string; email: string } | null>(null);

// Try to load user from localStorage on init
const savedUser = localStorage.getItem('user');
if (savedUser) {
  try {
    user.value = JSON.parse(savedUser);
  } catch {
    // Invalid JSON, ignore
  }
}

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value);

  function setAuth(newToken: string, newUser: { id: string; name: string; email: string }) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    token,
    user,
    isLoggedIn,
    setAuth,
    logout,
  };
}

