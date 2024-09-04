<template>
  <div>
    <div class="mb-3">
      <input v-model="searchQuery" class="form-control search-input" placeholder="Search courses...">
    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="course in paginatedCourses" :key="course.id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ course.title }}</h5>
            <p class="card-text">{{ course.description }}</p>
            <div class="mt-auto">
              <router-link :to="{ name: 'CourseDetails', params: { title: course.title } }" class="btn btn-primary mb-3">View Details</router-link>
              <div class="d-flex align-items-center justify-content-between">
                <div class="like-section">
                  <button @click="toggleLike(course)" :class="{ liked: likedCourses.includes(course.id) }" class="like-button">
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
    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-secondary">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-secondary">Next</button>
    </div>
  </div>
</template>



<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  setup() {
    const store = useStore();
    const searchQuery = ref('');
    const likedCourses = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(3);

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

    const filteredCourses = computed(() => {
      const allCourses = store.state.isAuthenticated
        ? [...featuredCourses.value, ...specialCourses.value]
        : featuredCourses.value;

      return allCourses.filter(course => {
        return course.title.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    });

    const paginatedCourses = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredCourses.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredCourses.value.length / itemsPerPage.value);
    });

    const isCompleted = (courseId) => {
      return store.state.completedCourses.includes(courseId);
    };

    const fetchLikes = async () => {
      const allCourses = [...featuredCourses.value, ...specialCourses.value];
      for (let course of allCourses) {
        try {
          const response = await axios.get(`http://localhost:3000/api/courses/${course.id}/likes`);
          course.likes = response.data.likes;
          if (store.state.user && response.data.likedBy.includes(store.state.user._id)) {
            likedCourses.value.push(course.id);
          }
        } catch (error) {
          console.error('Failed to fetch likes:', error);
        }
      }
    };

    const toggleLike = async (course) => {
      if (!store.state.isAuthenticated) {
        alert('You need to login to like a course.');
        this.$router.push('/login');
        return;
      }
      try {
        await axios.post(`http://localhost:3000/api/courses/${course.id}/like`, {}, {
          headers: { Authorization: `Bearer ${store.state.token}` }
        });
        if (likedCourses.value.includes(course.id)) {
          course.likes -= 1;
          likedCourses.value = likedCourses.value.filter(id => id !== course.id);
        } else {
          course.likes += 1;
          likedCourses.value.push(course.id);
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    onMounted(() => {
      fetchLikes();
      if (store.state.isAuthenticated) {
        store.dispatch('fetchCompletedCourses');
      }
    });

    return { searchQuery, paginatedCourses, isCompleted, likedCourses, toggleLike, nextPage, prevPage, currentPage, totalPages };
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

/* Search Input */
.search-input {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
}

/* Card Styles */
.card {
  margin-bottom: 1rem;
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
  margin-bottom: 1.25rem;
}

.completed-badge {
  display: inline-block;
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

/* Button Styles */
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  margin: 0 10px;
}

.pagination-controls span {
  font-size: 1rem;
  font-weight: 600;
}
</style>
