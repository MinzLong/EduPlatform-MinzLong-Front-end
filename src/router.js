import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import CourseDetails from './components/CourseDetails.vue';
import CoursesPage from './components/CoursesPage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import ExamPage from './components/ExamPage.vue';
import LeaderboardPage from './components/Leaderboard.vue';
import ChatPage from './components/ChatPage.vue';
import store from './store/store';

const routes = [
  { path: '/', component: HomePage, name: 'HomePage' },
  { path: '/course/:title', component: CourseDetails, name: 'CourseDetails', props: true },
  { path: '/courses', component: CoursesPage, props: true },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/exam', component: ExamPage, meta: { requiresAuth: true } },
  { path: '/leaderboard', component: LeaderboardPage, meta: { requiresAuth: true } },
  { path: '/chat', component: ChatPage, meta: { requiresAuth: true } } // Chat page route
];

const router = createRouter({
  history: createWebHistory('/EduPlatform-MinzLong/'),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!store.state.isAuthenticated && localStorage.getItem('token')) {
    await store.dispatch('fetchUserData');
  }
  if (to.meta.requiresAuth && !store.state.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
