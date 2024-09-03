<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" v-focus type="email" class="form-control" id="email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" required minlength="6">
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const login = async () => {
      if (validateEmail(email.value) && password.value.length >= 6) {
        try {
          await store.dispatch('login', {
            email: email.value,
            password: password.value
          });
          router.push('/');
        } catch (error) {
          alert('Invalid email or password');
        }
      } else {
        alert('Please enter a valid email and password (at least 6 characters)');
      }
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    return { email, password, login };
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>