<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { REGISTER_MUTATION } from '@/graphql/auth';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { setAuth } = useAuth();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const { mutate: register, loading } = useMutation(REGISTER_MUTATION);

async function handleSubmit() {
  error.value = '';
  try {
    const result = await register({
      input: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    });

    if (result?.data?.register) {
      setAuth(result.data.register.accessToken, result.data.register.user);
      router.push('/');
    }
  } catch (e: any) {
    error.value = e.message || 'Registration failed';
  }
}
</script>

<template>
  <div class="auth-container">
    <h1>Register</h1>
    
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div v-if="error" class="error">{{ error }}</div>
      
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="Enter your name"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          minlength="6"
          placeholder="At least 6 characters"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Register' }}
      </button>

      <p class="switch-auth">
        Already have an account? 
        <router-link to="/login">Login</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #555;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #42b883;
}

button {
  padding: 0.75rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover:not(:disabled) {
  background: #3aa876;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  background: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
}

.switch-auth {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}
</style>

