import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
    completedCourses: [],
    likes: {},
    users: [] // List of users for chat
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    setCompletedCourses(state, courses) {
      state.completedCourses = courses;
    },
    clearAuthData(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = '';
      state.completedCourses = [];
      state.likes = {};
      state.users = []; // Reset users when logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setLikes(state, { courseId, likes }) {
      state.likes = { ...state.likes, [courseId]: likes };
    },
    setUsers(state, users) {
      state.users = users;
    }
  },
  actions: {
    async login({ commit }, userData) {
      try {
        const response = await axios.post('https://edu-platform-minz-long-back-end.vercel.app/api/auth/login', userData);
        const token = response.data.token;
        commit('setToken', token);
        commit('setAuthentication', true);
        await this.dispatch('fetchUserData');
      } catch (error) {
        console.error('Failed to log in:', error);
        throw error;
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post('https://edu-platform-minz-long-back-end.vercel.app/api/auth/register', userData);
        const token = response.data.token;
        commit('setToken', token);
        commit('setAuthentication', true);
        await this.dispatch('fetchUserData');
      } catch (error) {
        console.error('Failed to register:', error);
        throw error;
      }
    },
    async fetchUserData({ commit, state }) {
      try {
        if (state.token) {
          const response = await axios.get('https://edu-platform-minz-long-back-end.vercel.app/api/auth/user', {
            headers: { 'x-auth-token': state.token }
          });
          commit('setUser', response.data);
          await this.dispatch('fetchCompletedCourses');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        commit('clearAuthData');
      }
    },
    async fetchCompletedCourses({ commit, state }) {
      try {
        const response = await axios.get('https://edu-platform-minz-long-back-end.vercel.app/api/userCourses/completed', {
          headers: { 'x-auth-token': state.token }
        });
        commit('setCompletedCourses', response.data.completedCourses);
      } catch (error) {
        console.error('Failed to fetch completed courses:', error);
      }
    },
    async markCourseAsCompleted({ commit, state }, courseId) {
      try {
        await axios.post('https://edu-platform-minz-long-back-end.vercel.app/api/userCourses/complete', { courseId }, {
          headers: { 'x-auth-token': state.token }
        });
        await this.dispatch('fetchCompletedCourses');
      } catch (error) {
        console.error('Failed to mark course as completed:', error);
      }
    },
    async likeCourse({ commit, state }, courseId) {
      try {
        await axios.post(`https://edu-platform-minz-long-back-end.vercel.app/api/likes/${courseId}`, {}, {
          headers: { 'x-auth-token': state.token }
        });
        await this.dispatch('fetchLikes', courseId);
      } catch (error) {
        console.error('Failed to like course:', error);
      }
    },
    async fetchLikes({ commit }, courseId) {
      try {
        const response = await axios.get(`https://edu-platform-minz-long-back-end.vercel.app/api/likes/${courseId}`);
        commit('setLikes', { courseId, likes: response.data.likes });
      } catch (error) {
        console.error('Failed to fetch likes:', error);
      }
    },
    async fetchUsers({ commit, state }) {
      try {
        const response = await axios.get('https://edu-platform-minz-long-back-end.vercel.app/api/users', {
          headers: { 'x-auth-token': state.token }
        });
        commit('setUsers', response.data); // Update according to your backend response
      } catch (error) {
        console.error('Failed to fetch users:', error);
        if (error.response && error.response.status === 401) {
          commit('clearAuthData'); // Clear authentication data on 401 error
        }
      }
    },
    logout({ commit }) {
      commit('clearAuthData');
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    completedCourses: state => state.completedCourses,
    getLikes: state => (courseId) => state.likes[courseId] || 0,
    users: state => state.users // Getter for users
  },
});
