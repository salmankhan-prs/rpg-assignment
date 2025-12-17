<script setup lang="ts">
import { ref } from 'vue';
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable';
import { GET_BLOGS_QUERY, CREATE_BLOG_MUTATION, BLOG_CREATED_SUBSCRIPTION } from '@/graphql/blog';
import { useAuth } from '@/composables/useAuth';

const { user } = useAuth();

// Fetch blogs
const { result, loading, refetch } = useQuery(GET_BLOGS_QUERY);

// Create blog mutation
const title = ref('');
const content = ref('');
const showForm = ref(false);
const { mutate: createBlog, loading: creating } = useMutation(CREATE_BLOG_MUTATION);

// Real-time subscription for new blogs
const notifications = ref<{ id: string; title: string; author: string }[]>([]);

const { result: subscriptionResult } = useSubscription(BLOG_CREATED_SUBSCRIPTION);

// Watch subscription results
import { watch } from 'vue';

watch(subscriptionResult, (data: any) => {
  if (data?.blogCreated) {
    const blog = data.blogCreated;
    // Only show notification if it's not from the current user
    if (blog.author?.id !== user.value?.id) {
      notifications.value.unshift({
        id: blog.id,
        title: blog.title,
        author: blog.author?.name || 'Unknown',
      });
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== blog.id);
      }, 5000);
    }
    // Refetch blogs to show the new one
    refetch();
  }
});

async function handleCreateBlog() {
  if (!title.value || !content.value) return;
  
  try {
    await createBlog({
      input: {
        title: title.value,
        content: content.value,
      },
    });
    // Reset form
    title.value = '';
    content.value = '';
    showForm.value = false;
    // Refetch to show new blog
    refetch();
  } catch (e: any) {
    alert(e.message || 'Failed to create blog');
  }
}

function dismissNotification(id: string) {
  notifications.value = notifications.value.filter(n => n.id !== id);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <div class="blogs-container">
    <!-- Real-time notifications -->
    <div class="notifications">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
      >
        <span>🔔 New blog: "<strong>{{ notification.title }}</strong>" by {{ notification.author }}</span>
        <button @click="dismissNotification(notification.id)" class="dismiss">×</button>
      </div>
    </div>

    <div class="header">
      <h1>Blog Posts</h1>
      <button @click="showForm = !showForm" class="create-btn">
        {{ showForm ? 'Cancel' : '+ New Blog' }}
      </button>
    </div>

    <!-- Create Blog Form -->
    <div v-if="showForm" class="create-form">
      <h2>Create New Blog</h2>
      <form @submit.prevent="handleCreateBlog">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            id="title"
            v-model="title"
            type="text"
            required
            placeholder="Enter blog title"
          />
        </div>
        <div class="form-group">
          <label for="content">Content</label>
          <textarea
            id="content"
            v-model="content"
            required
            rows="5"
            placeholder="Write your blog content..."
          ></textarea>
        </div>
        <button type="submit" :disabled="creating">
          {{ creating ? 'Publishing...' : 'Publish Blog' }}
        </button>
      </form>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">Loading blogs...</div>

    <!-- Blog list -->
    <div v-else-if="result?.blogs?.length" class="blog-list">
      <div v-for="blog in result.blogs" :key="blog.id" class="blog-card">
        <h3>{{ blog.title }}</h3>
        <p class="content">{{ blog.content }}</p>
        <div class="meta">
          <span class="author">By {{ blog.author?.name || 'Unknown' }}</span>
          <span class="date">{{ formatDate(blog.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty">
      <p>No blogs yet. Be the first to create one!</p>
    </div>
  </div>
</template>

<style scoped>
.blogs-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.notifications {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notification {
  background: #42b883;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideIn 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.dismiss {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  color: #333;
}

.create-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.create-btn:hover {
  background: #3aa876;
}

.create-form {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.create-form h2 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.create-form button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.create-form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading, .empty {
  text-align: center;
  color: #666;
  padding: 3rem;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.blog-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.blog-card h3 {
  margin: 0 0 1rem;
  color: #333;
}

.blog-card .content {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.blog-card .meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #888;
}

.author {
  font-weight: 500;
}
</style>

