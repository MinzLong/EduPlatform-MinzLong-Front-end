<template>
  <div>
    <div class="text-center mb-5 hero-section">
      <h1 class="display-4">Welcome to EduPlatform</h1>
      <p class="lead">This is the best platform to find and enroll in online courses.</p>
    </div>
    <!-- Features Section -->
    <section class="features py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <div class="feature-box p-4 bg-light shadow">
              <h4>Wide Range of Courses</h4>
              <p>Choose from a wide variety of courses across different subjects and skill levels.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-box p-4 bg-light shadow">
              <h4>Expert Instructors</h4>
              <p>Learn from industry experts and experienced educators.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-box p-4 bg-light shadow">
              <h4>Flexible Learning</h4>
              <p>Study at your own pace with lifetime access to your courses.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Featured Courses Section -->
    <section class="featured-courses py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-4">Featured Courses</h2>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div class="col" v-for="course in featuredCourses" :key="course.id">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ course.title }}</h5>
                <p class="card-text">{{ course.description }}</p>
                <div class="mt-auto">
                  <router-link :to="{ name: 'CourseDetails', params: { title: course.title } }" class="btn btn-primary">Enroll Now</router-link>
                  <div class="d-flex align-items-center justify-content-between mt-3">
                    <div class="like-section">
                      <button @click="toggleLike(course)" :class="{ liked: isLiked(course.id) }" class="like-button">
                        <i :class="['fa', 'fa-thumbs-up']"></i>
                      </button>
                      <span>{{ course.likes }} likes</span>
                    </div>
                    <span v-if="isCompleted(course.id)" class="completed-badge">✔ Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Special Courses Section -->
    <section v-if="user" class="special-courses py-5">
      <div class="container">
        <h2 class="text-center mb-4">Special Courses</h2>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div class="col" v-for="course in specialCourses" :key="course.id">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ course.title }}</h5>
                <p class="card-text">{{ course.description }}</p>
                <div class="mt-auto">
                  <router-link :to="{ name: 'CourseDetails', params: { title: course.title } }" class="btn btn-primary">Enroll Now</router-link>
                  <div class="d-flex align-items-center justify-content-between mt-3">
                    <div class="like-section">
                      <button @click="toggleLike(course)" :class="{ liked: isLiked(course.id) }" class="like-button">
                        <i :class="['fa', 'fa-thumbs-up']"></i>
                      </button>
                      <span>{{ course.likes }} likes</span>
                    </div>
                    <span v-if="isCompleted(course.id)" class="completed-badge">✔ Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- User Testimonials Section -->
    <section class="testimonials py-5">
      <div class="container">
        <h2 class="text-center mb-4">What Our Students Say</h2>
        <div v-if="user" class="mb-4">
          <form @submit.prevent="postTestimonial" class="testimonial-form">
            <div class="mb-3">
              <label for="testimonialMessage" class="form-label">Your Thoughts</label>
              <textarea v-model="newTestimonial.message" class="form-control" id="testimonialMessage" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Post</button>
          </form>
        </div>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div class="col" v-for="testimonial in testimonials" :key="testimonial._id">
            <div class="card p-3 h-100 shadow-sm">
              <div class="card-body">
                <p class="card-text">"{{ testimonial.message }}"</p>
                <h5 class="card-title">{{ testimonial.userEmail }}</h5>
              </div>
              <div class="card-footer text-end">
                <button v-if="user && user.email === testimonial.userEmail" @click="editTestimonial(testimonial)" class="btn btn-secondary">Edit</button>
                <button v-if="user && user.email === testimonial.userEmail" @click="deleteTestimonial(testimonial._id)" class="btn btn-danger ms-2">Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="editMode" class="edit-form mt-4">
          <h3>Edit Testimonial</h3>
          <form @submit.prevent="updateTestimonial">
            <div class="mb-3">
              <label for="editMessage" class="form-label">Edit Your Thoughts</label>
              <textarea v-model="editableTestimonial.message" class="form-control" id="editMessage" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
            <button @click="cancelEdit" class="btn btn-secondary ms-2">Cancel</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  setup() {
    const store = useStore();
    const featuredCourses = ref([
      { id: '1', title: 'VueJS Basics', description: 'Learn the basics of VueJS.', likes: 0, likedBy: [] },
      { id: '2', title: 'Advanced VueJS', description: 'Master advanced concepts of VueJS.', likes: 0, likedBy: [] },
      { id: '3', title: 'JavaScript Essentials', description: 'Learn the fundamentals of JavaScript.', likes: 0, likedBy: [] },
      { id: '4', title: 'Full-Stack Development', description: 'Become a full-stack developer.', likes: 0, likedBy: [] },
      { id: '5', title: 'Exclusive VueJS Tips', description: 'Learn exclusive tips and tricks in VueJS.', likes: 0, likedBy: [] },
      { id: '6', title: 'Advanced JavaScript Techniques', description: 'Master advanced JavaScript techniques.', likes: 0, likedBy: [] },
      { id: '7', title: 'Node.js Fundamentals', description: 'Learn the fundamentals of Node.js.', likes: 0, likedBy: [] }
    
    ]);

    const specialCourses = ref([
      { id: '8', title: 'ReactJS Basics', description: 'Learn the basics of ReactJS.', likes: 0, likedBy: [] },
      { id: '9', title: 'Python for Data Science', description: 'Learn Python for data science applications.', likes: 0, likedBy: [] },
      { id: '10', title: 'Machine Learning Fundamentals', description: 'Learn the basics of machine learning.', likes: 0, likedBy: [] },
      { id: '11', title: 'Introduction to Cloud Computing', description: 'Learn the basics of cloud computing.', likes: 0, likedBy: [] },
      { id: '12', title: 'Cybersecurity Essentials', description: 'Learn the essentials of cybersecurity.', likes: 0, likedBy: [] },
      { id: '13', title: 'Introduction to Artificial Intelligence', description: 'Learn the basics of artificial intelligence.', likes: 0, likedBy: [] },
      { id: '14', title: 'Web Development with HTML & CSS', description: 'Learn the basics of web development with HTML and CSS.', likes: 0, likedBy: [] },
      { id: '15', title: 'Data Structures and Algorithms', description: 'Learn the fundamentals of data structures and algorithms.', likes: 0, likedBy: [] },
    ]);

    const testimonials = ref([]);
    const newTestimonial = ref({ message: '' });
    const editMode = ref(false);
    const editableTestimonial = ref(null);

    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/testimonials');
        testimonials.value = response.data;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    const postTestimonial = async () => {
      if (!store.state.isAuthenticated) {
        alert('You need to login to post a testimonial.');
        this.$router.push('/login');
        return;
      }
      const testimonial = {
        user: store.state.user._id,
        userEmail: store.state.user.email,
        message: newTestimonial.value.message,
      };

      try {
        const response = await axios.post('http://localhost:3000/api/testimonials', testimonial, {
          headers: { Authorization: `Bearer ${store.state.token}` }
        });
        testimonials.value.push(response.data);
        newTestimonial.value.message = '';
      } catch (error) {
        console.error('Error posting testimonial:', error);
      }
    };

    const editTestimonial = (testimonial) => {
      editMode.value = true;
      editableTestimonial.value = { ...testimonial };
    };

    const cancelEdit = () => {
      editMode.value = false;
      editableTestimonial.value = null;
    };

    const updateTestimonial = async () => {
      if (!store.state.isAuthenticated) {
        alert('You need to login to update a testimonial.');
        this.$router.push('/login');
        return;
      }
      try {
        const response = await axios.patch(`http://localhost:3000/api/testimonials/${editableTestimonial.value._id}`, {
          message: editableTestimonial.value.message
        }, {
          headers: { Authorization: `Bearer ${store.state.token}` }
        });
        const index = testimonials.value.findIndex(t => t._id === editableTestimonial.value._id);
        testimonials.value[index] = response.data;
        editMode.value = false;
        editableTestimonial.value = null;
      } catch (error) {
        console.error('Error updating testimonial:', error);
      }
    };

    const deleteTestimonial = async (id) => {
      if (!store.state.isAuthenticated) {
        alert('You need to login to delete a testimonial.');
        this.$router.push('/login');
        return;
      }
      try {
        await axios.delete(`http://localhost:3000/api/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${store.state.token}` }
        });
        testimonials.value = testimonials.value.filter(testimonial => testimonial._id !== id);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    };

    const toggleLike = async (course) => {
      if (!store.state.isAuthenticated) {
        alert('You need to login to like a course.');
        this.$router.push('/login');
        return;
      }
      try {
        const response = await axios.post(`http://localhost:3000/api/courses/${course.id}/like`, {}, {
          headers: { Authorization: `Bearer ${store.state.token}` }
        });
        if (course.likedBy.includes(store.state.user._id)) {
          course.likes -= 1;
          course.likedBy = course.likedBy.filter(id => id !== store.state.user._id);
        } else {
          course.likes += 1;
          course.likedBy.push(store.state.user._id);
        }
      } catch (error) {
        console.error('Error liking/unliking course:', error);
      }
    };

    const isLiked = (courseId) => {
      const course = featuredCourses.value.find(c => c.id === courseId) || specialCourses.value.find(c => c.id === courseId);
      return store.state.user && course && course.likedBy ? course.likedBy.includes(store.state.user._id) : false;
    };

    const fetchLikes = async () => {
      try {
        const allCourses = [...featuredCourses.value, ...specialCourses.value];
        for (const course of allCourses) {
          const response = await axios.get(`http://localhost:3000/api/courses/${course.id}/likes`);
          course.likes = response.data.likes;
          course.likedBy = response.data.likedBy;
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    onMounted(() => {
      fetchTestimonials();
      fetchLikes();
      if (store.state.isAuthenticated) {
        store.dispatch('fetchCompletedCourses');
      }
    });

    const isCompleted = (courseId) => {
      return store.state.completedCourses.includes(courseId);
    };

    return { featuredCourses, specialCourses, testimonials, newTestimonial, postTestimonial, editMode, editableTestimonial, editTestimonial, cancelEdit, updateTestimonial, deleteTestimonial, isCompleted, toggleLike, isLiked };
  }
};
</script>

<style scoped>
/* General Styles */
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  color: #343a40;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  background-color: #ffffff;
  color: #000000;
  padding: 60px 20px;
  border-radius: 10px;
}

.hero-section h1 {
  font-size: 3rem;
  font-weight: 700;
}

.hero-section p {
  font-size: 1.25rem;
}

/* Features Section */
.features .feature-box {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.features .feature-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.features .feature-box h4 {
  font-size: 1.5rem;
  font-weight: 600;
}

.features .feature-box p {
  font-size: 1rem;
}

/* Courses Section */
.featured-courses,
.special-courses {
  background-color: #fff;
  border-radius: 10px;
  padding: 40px 20px;
}

.featured-courses h2,
.special-courses h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 30px;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.card-text {
  font-size: 1rem;
}

.completed-badge {
  display: inline-block;
  margin-left: 20px;
  padding: 8px 10px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  font-size: 0.9rem;
}

/* Like Section */
.like-section {
  display: flex;
  align-items: center;
}

.like-button {
  background-color: transparent;
  border: none;
  color: #6c757d; /* Grey color for not liked */
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  margin-right: 10px;
  transition: color 0.3s ease;
}

.like-button.liked {
  color: #007bff; /* Blue color for liked */
}

.like-button i {
  margin-right: 5px;
  font-size: 24px; /* Set font size here */
}

.like-button:hover {
  color: #0056b3;
}

.like-button.liked:hover {
  color: #0056b3;
}

.like-button:focus {
  outline: none;
}

/* Testimonials Section */
.testimonials {
  background-color: #fff;
  border-radius: 10px;
  padding: 40px 20px;
}

.testimonials h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 30px;
}

.testimonial-form {
  margin-bottom: 40px;
}

.testimonials .card {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.testimonials .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.testimonials .card-body p {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 15px;
}

.testimonials .card-body h5 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #343a40;
}

.testimonials .card-footer {
  background-color: transparent;
  border-top: 1px solid #dee2e6;
  border-radius: 0 0 10px 10px;
}

.edit-form {
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
}
</style>
