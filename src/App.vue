<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">EduPlatform</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/courses">Courses</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/exam">Exam</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/leaderboard">Leaderboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/chat">Chat</router-link> <!-- Thêm mục Chat -->
            </li>
          </ul>
          <div v-if="isAuthenticated" class="d-flex">
            <span class="navbar-text me-3">Welcome, {{ user?.email }}</span>
            <button class="btn btn-outline-secondary" @click="logout">Logout</button>
          </div>
          <div v-else class="d-flex">
            <router-link class="btn btn-outline-primary me-2" to="/login">Login</router-link>
            <router-link class="btn btn-outline-secondary" to="/register">Register</router-link>
          </div>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['user', 'isAuthenticated']),
  },
  methods: {
    ...mapActions(['logout']),
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
