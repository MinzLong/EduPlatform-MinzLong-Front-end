<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input v-model="firstName" v-focus type="text" class="form-control" id="firstName" required aria-label="First Name">
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input v-model="lastName" type="text" class="form-control" id="lastName" required aria-label="Last Name">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" required aria-label="Email">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" required minlength="6" aria-label="Password">
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword" required minlength="6" aria-label="Confirm Password">
        </div>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">Phone Number</label>
          <input v-model="phoneNumber" type="text" class="form-control" id="phoneNumber" aria-label="Phone Number">
        </div>
        <button type="submit" class="btn btn-primary" aria-label="Register">Register</button>
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
    const confirmPassword = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const phoneNumber = ref('');

    const register = async () => {
      if (validateEmail(email.value) && password.value.length >= 6 && firstName.value.trim() !== '' && lastName.value.trim() !== '' && validatePhoneNumber(phoneNumber.value)) {
        if (password.value === confirmPassword.value) {
          try {
            await store.dispatch('register', {
              email: email.value,
              password: password.value,
              firstName: firstName.value,
              lastName: lastName.value,
              phoneNumber: phoneNumber.value
            });
            router.push('/');
          } catch (error) {
            alert('Error registering user');
          }
        } else {
          alert("Passwords don't match!");
        }
      } else {
        alert('Please enter valid information for all required fields');
      }
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
      return re.test(email);
    };

    const validatePhoneNumber = (phone) => {
      const re = /^[0-9]{10,11}$/;
      return re.test(phone);
    };

    return { email, password, confirmPassword, firstName, lastName, phoneNumber, register };
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>