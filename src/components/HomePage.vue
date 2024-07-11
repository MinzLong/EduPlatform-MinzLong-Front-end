<template>
  <div>
    <div class="text-center mb-5">
      <h1>Welcome to EduPlatform</h1>
      <p>This is the best platform to find and enroll in online courses.</p>
    </div>
    <!-- Features Section -->
    <section class="features py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <div class="feature-box p-4 bg-light">
              <h4>Wide Range of Courses</h4>
              <p>Choose from a wide variety of courses across different subjects and skill levels.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-box p-4 bg-light">
              <h4>Expert Instructors</h4>
              <p>Learn from industry experts and experienced educators.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-box p-4 bg-light">
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
        <div class="row">
          <div class="col-md-4 pb-3" v-for="course in featuredCourses" :key="course.id">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ course.title }}</h5>
                <p class="card-text">{{ course.description }}</p>
                <router-link :to="{ name: 'CourseDetails', params: { title: course.title } }" class="btn btn-primary">Enroll Now</router-link>
                <span v-if="isCompleted(course.id)" class="completed-badge">✔ Completed</span>
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
        <div class="row">
          <div class="col-md-4" v-for="course in specialCourses" :key="course.id">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ course.title }}</h5>
                <p class="card-text">{{ course.description }}</p>
                <router-link :to="{ name: 'CourseDetails', params: { title: course.title } }" class="btn btn-primary">Enroll Now</router-link>
                <span v-if="isCompleted(course.id)" class="completed-badge">✔ Completed</span>
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
          <form @submit.prevent="postTestimonial">
            <div class="mb-3">
              <label for="testimonialMessage" class="form-label">Your Thoughts</label>
              <textarea v-model="newTestimonial.message" class="form-control" id="testimonialMessage" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Post</button>
          </form>
        </div>
        <div class="row">
          <div class="col-md-4" v-for="testimonial in testimonials" :key="testimonial._id">
            <div class="card p-3 h-100">
              <div class="card-body">
                <p class="card-text">"{{ testimonial.message }}"</p>
                <h5 class="card-title">{{ testimonial.userEmail }}</h5>
              </div>
              <div class="card-footer">
                <button v-if="user && user.email === testimonial.userEmail" @click="editTestimonial(testimonial)" class="btn btn-secondary">Edit</button>
                <button v-if="user && user.email === testimonial.userEmail" @click="deleteTestimonial(testimonial._id)" class="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="editMode" class="edit-form">
          <h3>Edit Testimonial</h3>
          <form @submit.prevent="updateTestimonial">
            <div class="mb-3">
              <label for="editMessage" class="form-label">Edit Your Thoughts</label>
              <textarea v-model="editableTestimonial.message" class="form-control" id="editMessage" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
            <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
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
      { id: '1', title: 'VueJS Basics', description: 'Learn the basics of VueJS.', details: 'This course covers the basics of VueJS, including its core concepts and syntax. It is suitable for beginners.', tasks: [{ title: 'Introduction to VueJS', description: 'An overview of VueJS and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }, { title: 'Getting Started with VueJS', description: 'Setting up your first VueJS project...', type: 'text', content: 'To get started with VueJS, you need to set up your development environment...' }, { title: 'VueJS Basics Quiz', description: 'Test your knowledge of VueJS basics.', type: 'quiz', content: { questions: [{ question: 'What is VueJS?', answers: ['A JavaScript framework', 'A CSS framework', 'A programming language'] }, { question: 'How do you create a Vue instance?', answers: ['new Vue()', 'create Vue()', 'Vue.create()'] }] } }] },
      { id: '2', title: 'Advanced VueJS', description: 'Master advanced concepts of VueJS.', details: 'This course dives into advanced VueJS concepts such as state management, routing, and Vuex.', tasks: [{ title: 'Advanced Vue Techniques', description: 'Deep dive into advanced VueJS techniques.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }, { title: 'State Management with Vuex', description: 'Learn how to manage state with Vuex.', type: 'text', content: 'Vuex is a state management pattern + library for Vue.js applications...' }, { title: 'Advanced VueJS Quiz', description: 'Test your knowledge of advanced VueJS concepts.', type: 'quiz', content: { questions: [{ question: 'What is Vuex?', answers: ['A state management library', 'A routing library', 'A CSS framework'] }, { question: 'What is the main purpose of Vue Router?', answers: ['To manage state', 'To handle HTTP requests', 'To manage application routing'] }] } }] },
      { id: '3', title: 'JavaScript Essentials', description: 'Learn the fundamentals of JavaScript.', details: 'This course covers the basics of JavaScript, including variables, functions, and control structures.', tasks: [{ title: 'Introduction to JavaScript', description: 'An overview of JavaScript and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }, { title: 'JavaScript Variables and Data Types', description: 'Learn about variables and data types in JavaScript.', type: 'text', content: 'JavaScript variables are used to store data values. In this section, we will learn about different data types...' }, { title: 'JavaScript Basics Quiz', description: 'Test your knowledge of JavaScript basics.', type: 'quiz', content: { questions: [{ question: 'What is a variable in JavaScript?', answers: ['A storage location', 'A type of function', 'A CSS selector'] }, { question: 'How do you declare a variable in JavaScript?', answers: ['var', 'def', 'let'] }] } }] },
      { id: '4', title: 'Full-Stack Development', description: 'Become a full-stack developer.', details: 'This course covers both front-end and back-end development skills needed to become a full-stack developer.', tasks: [{ title: 'Introduction to Full-Stack Development', description: 'An overview of full-stack development and required skills.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }, { title: 'Front-End Technologies', description: 'Learn about front-end technologies like HTML, CSS, and JavaScript.', type: 'text', content: 'Front-end development involves creating the user interface and user experience aspects of web applications...' }, { title: 'Full-Stack Development Quiz', description: 'Test your knowledge of full-stack development.', type: 'quiz', content: { questions: [{ question: 'What is full-stack development?', answers: ['Developing both client and server software', 'Only front-end development', 'Only back-end development'] }, { question: 'Which of the following is a front-end technology?', answers: ['HTML', 'Node.js', 'Express.js'] }] } }] },
    ]);

    const specialCourses = ref([
      { id: '5', title: 'Exclusive VueJS Tips', description: 'Learn exclusive tips and tricks in VueJS.', details: 'This course provides exclusive insights and advanced techniques in VueJS.', tasks: [{ title: 'Exclusive Tips', description: 'Learn exclusive tips and tricks in VueJS.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' }, { title: 'Advanced Tips', description: 'Advanced tips for mastering VueJS.', type: 'text', content: 'In this section, we will go through some advanced tips for mastering VueJS...' }, { title: 'VueJS Tips Quiz', description: 'Test your knowledge of VueJS tips.', type: 'quiz', content: { questions: [{ question: 'What is a VueJS tip?', answers: ['An advanced concept', 'A basic concept', 'A tool for state management'] }, { question: 'How can you optimize your VueJS app?', answers: ['Using computed properties', 'Ignoring Vue lifecycle hooks', 'Avoiding Vue Router'] }] } }] },
      { id: '6', title: 'Advanced JavaScript Techniques', description: 'Master advanced JavaScript techniques.', details: 'This course dives into advanced JavaScript topics such as closures, async/await, and ES6 features.', tasks: [{ title: 'Understanding Closures', description: 'Deep dive into closures in JavaScript.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' }, { title: 'Async/Await in JavaScript', description: 'Learn about asynchronous programming with async/await.', type: 'text', content: 'Async/await makes it easier to write promises in a way that looks synchronous. In this section, we will explore how to use async/await...' }, { title: 'Advanced JavaScript Quiz', description: 'Test your knowledge of advanced JavaScript techniques.', type: 'quiz', content: { questions: [{ question: 'What is a closure in JavaScript?', answers: ['A function with preserved data', 'A loop', 'A condition statement'] }, { question: 'What does async/await help with?', answers: ['Handling asynchronous operations', 'Creating variables', 'Styling elements'] }] } }] },
      { id: '7', title: 'Node.js Fundamentals', description: 'Learn the fundamentals of Node.js.', details: 'This course covers the basics of Node.js, including setting up a server, routing, and middleware.', tasks: [{ title: 'Introduction to Node.js', description: 'An overview of Node.js and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }, { title: 'Setting Up a Node.js Server', description: 'Learn how to set up a server with Node.js.', type: 'text', content: 'Node.js allows you to run JavaScript on the server side. In this section, we will learn how to set up a basic server...' }, { title: 'Node.js Basics Quiz', description: 'Test your knowledge of Node.js basics.', type: 'quiz', content: { questions: [{ question: 'What is Node.js?', answers: ['JavaScript runtime built on Chrome\'s V8', 'A database', 'A CSS framework'] }, { question: 'How do you create a server in Node.js?', answers: ['Using the http module', 'Using the fs module', 'Using the express module'] }] } }] },
    ]);

    const testimonials = ref([]);
    const newTestimonial = ref({ message: '' });
    const editMode = ref(false);
    const editableTestimonial = ref(null);

    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('https://edu-platform-minz-long-back-end.vercel.app/api/testimonials');
        testimonials.value = response.data;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    const postTestimonial = async () => {
      const testimonial = {
        user: store.state.user._id,
        userEmail: store.state.user.email,
        message: newTestimonial.value.message,
      };

      try {
        const response = await axios.post('https://edu-platform-minz-long-back-end.vercel.app/api/testimonials', testimonial, {
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
      try {
        const response = await axios.patch(`https://edu-platform-minz-long-back-end.vercel.app/api/testimonials/${editableTestimonial.value._id}`, {
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
      try {
        await axios.delete(`https://edu-platform-minz-long-back-end.vercel.app/api/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${store.state.token}` }
        });
        testimonials.value = testimonials.value.filter(testimonial => testimonial._id !== id);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    };

    onMounted(() => {
      fetchTestimonials();
      if (store.state.isAuthenticated) {
        store.dispatch('fetchCompletedCourses');
      }
    });

    const isCompleted = (courseId) => {
      return store.state.completedCourses.includes(courseId);
    };

    return { featuredCourses, specialCourses, testimonials, newTestimonial, postTestimonial, editMode, editableTestimonial, editTestimonial, cancelEdit, updateTestimonial, deleteTestimonial, isCompleted };
  }
};
</script>


<style scoped>
.card {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.card-text {
  font-size: 1rem;
  margin-bottom: 1.25rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-danger {
  margin-left: 1rem;
}

.completed-badge {
  display: inline-block;
  margin-top: 10px;
  margin-left: 20px;
  padding: 8px 10px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  font-size: 0.9rem;
}
</style>
