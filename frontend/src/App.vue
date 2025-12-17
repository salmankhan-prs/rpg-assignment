<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { isLoggedIn, user, logout } = useAuth();

function handleLogout() {
  logout();
  router.push('/login');
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="logo">📝 Blog App</div>
      <nav v-if="isLoggedIn">
        <span class="user-name">Hello, {{ user?.name }}</span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.app-header {
  background: #35495e;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #42b883;
}

.logout-btn {
  background: transparent;
  color: white;
  border: 1px solid white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.1);
}

main {
  padding: 1rem;
}
</style>
