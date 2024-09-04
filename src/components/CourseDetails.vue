<template>
  <div v-if="course" class="course-details container my-5">
    <div class="course-header mb-4">
      <h2>{{ course.title }}</h2>
      <p class="course-description">{{ course.description }}</p>
      <p class="course-details">{{ course.details }}</p>
    </div>
    <div class="course-content mb-4">
      <h4>Course Content</h4>
      <div class="accordion" id="courseContent">
        <div class="accordion-item" v-for="(task, index) in course.tasks" :key="index">
          <h2 class="accordion-header" :id="'heading' + index">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" aria-expanded="true" :aria-controls="'collapse' + index">
              {{ task.title }}
            </button>
          </h2>
          <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index" data-bs-parent="#courseContent">
            <div class="accordion-body">
              <p>{{ task.description }}</p>
              <div v-if="task.type === 'video'" class="video-container">
                <video :src="task.content" controls class="w-100"></video>
              </div>
              <div v-if="task.type === 'text'" class="text-content">
                <p>{{ task.content }}</p>
              </div>
              <div v-if="task.type === 'quiz'" class="quiz-section">
                <h5>Quiz</h5>
                <ul class="list-group">
                  <li class="list-group-item" v-for="(question, qIndex) in task.content.questions" :key="qIndex">
                    <p>{{ question.question }}</p>
                    <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="form-check">
                      <input type="radio" :name="'question' + qIndex" :value="answer" :id="'question' + qIndex + 'answer' + aIndex" class="form-check-input">
                      <label :for="'question' + qIndex + 'answer' + aIndex" class="form-check-label">{{ answer }}</label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="completion-section mt-4">
        <button v-if="isAuthenticated && !isCompleted" @click="markAsCompleted" class="btn btn-primary">Mark as Completed</button>
        <span v-else-if="isCompleted" class="badge bg-success">Completed</span>
      </div>
    </div>
    <div class="like-section mt-3">
      <button @click="likeCourse" :class="{ liked: liked }" class="like-button">
        <i :class="['fa', 'fa-thumbs-up']"></i>
      </button>
      <span>{{ likes }} likes</span>
    </div>
    <router-link class="btn btn-secondary mt-3" to="/courses">Back to Courses</router-link>
  </div>
  <div v-else class="container my-5">
    <p>Course not found</p>
    <router-link class="btn btn-secondary" to="/courses">Back to Courses</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  props: ['title'],
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const courses = ref([
      { id: '1', title: 'VueJS Basics', description: 'Learn the basics of VueJS.', details: 'This course covers the basics of VueJS, including its core concepts and syntax. It is suitable for beginners.', tasks: [{ title: 'Introduction to VueJS', description: 'An overview of VueJS and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }, { title: 'Getting Started with VueJS', description: 'Setting up your first VueJS project.', type: 'text', content: 'To get started with VueJS, you need to set up your development environment...' }, { title: 'VueJS Basics Quiz', description: 'Test your knowledge of VueJS basics.', type: 'quiz', content: { questions: [{ question: 'What is VueJS?', answers: ['A JavaScript framework', 'A CSS framework', 'A programming language'] }, { question: 'How do you create a Vue instance?', answers: ['new Vue()', 'create Vue()', 'Vue.create()'] }] } }] },
      { id: '2', title: 'Advanced VueJS', description: 'Master advanced concepts of VueJS.', details: 'This course dives into advanced VueJS concepts such as state management, routing, và Vuex.', tasks: [{ title: 'Advanced Vue Techniques', description: 'Deep dive into advanced VueJS techniques.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }, { title: 'State Management with Vuex', description: 'Learn how to manage state with Vuex.', type: 'text', content: 'Vuex is a state management pattern + library for Vue.js applications...' }, { title: 'Advanced VueJS Quiz', description: 'Test your knowledge of advanced VueJS concepts.', type: 'quiz', content: { questions: [{ question: 'What is Vuex?', answers: ['A state management library', 'A routing library', 'A CSS framework'] }, { question: 'What is the main purpose of Vue Router?', answers: ['To manage state', 'To handle HTTP requests', 'To manage application routing'] }] } }] },
      { id: '3', title: 'JavaScript Essentials', description: 'Learn the fundamentals of JavaScript.', details: 'This course covers the basics of JavaScript, including variables, functions, and control structures.', tasks: [{ title: 'Introduction to JavaScript', description: 'An overview of JavaScript and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }, { title: 'JavaScript Variables and Data Types', description: 'Learn about variables and data types in JavaScript.', type: 'text', content: 'JavaScript variables are used to store data values. In this section, we will learn about different data types...' }, { title: 'JavaScript Basics Quiz', description: 'Test your knowledge of JavaScript basics.', type: 'quiz', content: { questions: [{ question: 'What is a variable in JavaScript?', answers: ['A storage location', 'A type of function', 'A CSS selector'] }, { question: 'How do you declare a variable in JavaScript?', answers: ['var', 'def', 'let'] }] } }] },
      { id: '4', title: 'Full-Stack Development', description: 'Become a full-stack developer.', details: 'This course covers both front-end and back-end development skills needed to become a full-stack developer.', tasks: [{ title: 'Introduction to Full-Stack Development', description: 'An overview of full-stack development and required skills.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }, { title: 'Front-End Technologies', description: 'Learn about front-end technologies like HTML, CSS, and JavaScript.', type: 'text', content: 'Front-end development involves creating the user interface and user experience aspects of web applications...' }, { title: 'Full-Stack Development Quiz', description: 'Test your knowledge of full-stack development.', type: 'quiz', content: { questions: [{ question: 'What is full-stack development?', answers: ['Developing both client and server software', 'Only front-end development', 'Only back-end development'] }, { question: 'Which of the following is a front-end technology?', answers: ['HTML', 'Node.js', 'Express.js'] }] } }] },
      { id: '5', title: 'Exclusive VueJS Tips', description: 'Learn exclusive tips and tricks in VueJS.', details: 'This course provides exclusive insights and advanced techniques in VueJS.', tasks: [{ title: 'Exclusive Tips', description: 'Learn exclusive tips and tricks in VueJS.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' }, { title: 'Advanced Tips', description: 'Advanced tips for mastering VueJS.', type: 'text', content: 'In this section, we will go through some advanced tips for mastering VueJS...' }, { title: 'VueJS Tips Quiz', description: 'Test your knowledge of VueJS tips.', type: 'quiz', content: { questions: [{ question: 'What is a VueJS tip?', answers: ['An advanced concept', 'A basic concept', 'A tool for state management'] }, { question: 'How can you optimize your VueJS app?', answers: ['Using computed properties', 'Ignoring Vue lifecycle hooks', 'Avoiding Vue Router'] }] } }] },
      { id: '6', title: 'Advanced JavaScript Techniques', description: 'Master advanced JavaScript techniques.', details: 'This course dives into advanced JavaScript topics such as closures, async/await, and ES6 features.', tasks: [{ title: 'Understanding Closures', description: 'Deep dive into closures in JavaScript.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' }, { title: 'Async/Await in JavaScript', description: 'Learn about asynchronous programming with async/await.', type: 'text', content: 'Async/await makes it easier to write promises in a way that looks synchronous. In this section, we will explore how to use async/await...' }, { title: 'Advanced JavaScript Quiz', description: 'Test your knowledge of advanced JavaScript techniques.', type: 'quiz', content: { questions: [{ question: 'What is a closure in JavaScript?', answers: ['A function with preserved data', 'A loop', 'A condition statement'] }, { question: 'What does async/await help with?', answers: ['Handling asynchronous operations', 'Creating variables', 'Styling elements'] }] } }] },
      { id: '7', title: 'Node.js Fundamentals', description: 'Learn the fundamentals of Node.js.', details: 'This course covers the basics of Node.js, including setting up a server, routing, and middleware.', tasks: [{ title: 'Introduction to Node.js', description: 'An overview of Node.js and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }, { title: 'Setting Up a Node.js Server', description: 'Learn how to set up a server with Node.js.', type: 'text', content: 'Node.js allows you to run JavaScript on the server side. In this section, we will learn how to set up a basic server...' }, { title: 'Node.js Basics Quiz', description: 'Test your knowledge of Node.js basics.', type: 'quiz', content: { questions: [{ question: 'What is Node.js?', answers: ['JavaScript runtime built on Chrome\'s V8', 'A database', 'A CSS framework'] }, { question: 'How do you create a server in Node.js?', answers: ['Using the http module', 'Using the fs module', 'Using the express module'] }] } }] },
      { id: '8', title: 'ReactJS Basics', description: 'Learn the basics of ReactJS.', details: 'This course covers the fundamentals of ReactJS, including components, state, and props.', tasks: [{ title: 'Introduction to ReactJS', description: 'An overview of ReactJS and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }, { title: 'Setting Up ReactJS', description: 'Setting up your first ReactJS project.', type: 'text', content: 'To get started with ReactJS, you need to set up your development environment with Node.js and create-react-app...' }, { title: 'ReactJS Basics Quiz', description: 'Test your knowledge of ReactJS basics.', type: 'quiz', content: { questions: [{ question: 'What is ReactJS?', answers: ['A JavaScript library', 'A CSS framework', 'A programming language'] }, { question: 'How do you create a React component?', answers: ['function Component()', 'new Component()', 'create React.Component()'] }] } }] },
      { id: '9', title: 'Python for Data Science', description: 'Learn Python for data science applications.', details: 'This course covers the use of Python for data analysis, including libraries such as NumPy, pandas, and Matplotlib.', tasks: [{ title: 'Introduction to Python', description: 'An overview of Python and its use in data science.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }, { title: 'Python Basics', description: 'Learn the basics of Python programming.', type: 'text', content: 'Python is a versatile language used in various fields. In this section, we will cover basic syntax, data types, and control structures...' }, { title: 'Python for Data Science Quiz', description: 'Test your knowledge of Python for data science.', type: 'quiz', content: { questions: [{ question: 'What is NumPy used for?', answers: ['Data manipulation', 'Data visualization', 'Machine learning'] }, { question: 'Which library is used for data visualization?', answers: ['Matplotlib', 'pandas', 'NumPy'] }] } }] },
      { id: '10', title: 'Machine Learning Fundamentals', description: 'Learn the basics of machine learning.', details: 'This course covers the foundational concepts of machine learning, including supervised and unsupervised learning.', tasks: [{ title: 'Introduction to Machine Learning', description: 'An overview of machine learning and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' }, { title: 'Supervised vs Unsupervised Learning', description: 'Understand the difference between supervised and unsupervised learning.', type: 'text', content: 'Machine learning can be broadly classified into supervised and unsupervised learning. In this section, we will explore both approaches...' }, { title: 'Machine Learning Fundamentals Quiz', description: 'Test your knowledge of machine learning fundamentals.', type: 'quiz', content: { questions: [{ question: 'What is supervised learning?', answers: ['Learning from labeled data', 'Learning from unlabeled data', 'Learning from user input'] }, { question: 'Which algorithm is used for classification?', answers: ['Linear Regression', 'K-Means', 'Decision Tree'] }] } }] },
      { id: '11', title: 'Introduction to Cloud Computing', description: 'Learn the basics of cloud computing.', details: 'This course covers the fundamental concepts of cloud computing, including cloud services and deployment models.', tasks: [{ title: 'Introduction to Cloud Computing', description: 'An overview of cloud computing and its benefits.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }, { title: 'Cloud Service Models', description: 'Learn about different cloud service models: IaaS, PaaS, and SaaS.', type: 'text', content: 'Cloud computing offers various service models. In this section, we will cover Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS)...' }, { title: 'Cloud Computing Quiz', description: 'Test your knowledge of cloud computing.', type: 'quiz', content: { questions: [{ question: 'What is IaaS?', answers: ['Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service'] }, { question: 'Which service model provides software over the internet?', answers: ['SaaS', 'PaaS', 'IaaS'] }] } }] },
      { id: '12', title: 'Cybersecurity Essentials', description: 'Learn the essentials of cybersecurity.', details: 'This course covers the basic principles of cybersecurity, including common threats and best practices.', tasks: [{ title: 'Introduction to Cybersecurity', description: 'An overview of cybersecurity and its importance.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' }, { title: 'Common Cyber Threats', description: 'Learn about common cyber threats and how to protect against them.', type: 'text', content: 'Cyber threats are constantly evolving. In this section, we will cover some of the most common threats and how to mitigate them...' }, { title: 'Cybersecurity Quiz', description: 'Test your knowledge of cybersecurity.', type: 'quiz', content: { questions: [{ question: 'What is a common method of cyber attack?', answers: ['Phishing', 'Deforestation', 'Networking'] }, { question: 'Which practice helps protect against cyber attacks?', answers: ['Using strong passwords', 'Sharing passwords', 'Ignoring software updates'] }] } }] },
      { id: '13', title: 'Introduction to Artificial Intelligence', description: 'Learn the basics of artificial intelligence.', details: 'This course covers the fundamental concepts of AI, including machine learning, natural language processing, and robotics.', tasks: [{ title: 'Introduction to AI', description: 'An overview of artificial intelligence and its applications.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }, { title: 'AI Techniques and Algorithms', description: 'Learn about different AI techniques and algorithms.', type: 'text', content: 'Artificial intelligence encompasses a range of techniques and algorithms. In this section, we will explore some of the key methods used in AI...' }, { title: 'AI Basics Quiz', description: 'Test your knowledge of artificial intelligence.', type: 'quiz', content: { questions: [{ question: 'What is natural language processing?', answers: ['Interaction between computers and human language', 'A method of data storage', 'A type of software engineering'] }, { question: 'Which area of AI involves machines learning from data?', answers: ['Machine Learning', 'Cloud Computing', 'Cybersecurity'] }] } }] },
      { id: '14', title: 'Web Development with HTML & CSS', description: 'Learn the basics of web development with HTML and CSS.', details: 'This course covers the foundational concepts of web development, including HTML structure and CSS styling.', tasks: [{ title: 'Introduction to HTML', description: 'An overview of HTML and its structure.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }, { title: 'Styling with CSS', description: 'Learn how to style web pages using CSS.', type: 'text', content: 'CSS is used to style and layout web pages. In this section, we will cover basic CSS properties and techniques...' }, { title: 'HTML & CSS Quiz', description: 'Test your knowledge of HTML and CSS.', type: 'quiz', content: { questions: [{ question: 'What does HTML stand for?', answers: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'] }, { question: 'Which property is used to change the background color in CSS?', answers: ['background-color', 'color', 'bgcolor'] }] } }] },
      { id: '15', title: 'Data Structures and Algorithms', description: 'Learn the fundamentals of data structures and algorithms.', details: 'This course covers essential data structures and algorithms, including arrays, linked lists, and sorting algorithms.', tasks: [{ title: 'Introduction to Data Structures', description: 'An overview of data structures and their importance.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }, { title: 'Common Algorithms', description: 'Learn about common algorithms and their applications.', type: 'text', content: 'Algorithms are step-by-step procedures for solving problems. In this section, we will explore some common algorithms and their uses...' }, { title: 'Data Structures and Algorithms Quiz', description: 'Test your knowledge of data structures and algorithms.', type: 'quiz', content: { questions: [{ question: 'What is an array?', answers: ['A collection of elements identified by index', 'A sequence of characters', 'A type of loop'] }, { question: 'Which algorithm is used for sorting?', answers: ['Bubble Sort', 'Binary Search', 'Breadth-First Search'] }] } }] },
]);

    const course = computed(() => {
      return courses.value.find(course => course.title.toLowerCase() === props.title.toLowerCase());
    });

    const isCompleted = computed(() => {
      if (!course.value) return false;
      return store.state.completedCourses.includes(course.value.id.toString());
    });

    const isAuthenticated = computed(() => store.state.isAuthenticated);

    const markAsCompleted = async () => {
      if (!isAuthenticated.value) {
        router.push('/login');
        return;
      }
      if (course.value) {
        await store.dispatch('markCourseAsCompleted', course.value.id.toString());
        router.push('/courses');
      }
    };

    const likes = ref(0);
    const liked = ref(false);

    const fetchLikes = async () => {
      if (course.value) {
        try {
          const response = await axios.get(`http://localhost:3000/api/courses/${course.value.id}/likes`);
          likes.value = response.data.likes;
          liked.value = response.data.likedBy.includes(store.state.user._id);
        } catch (error) {
          console.error('Failed to fetch likes:', error);
        }
      }
    };

    const likeCourse = async () => {
      if (!isAuthenticated.value) {
        router.push('/login');
        return;
      }
      if (course.value) {
        try {
          await axios.post(`http://localhost:3000/api/courses/${course.value.id}/like`, {}, {
            headers: { Authorization: `Bearer ${store.state.token}` }
          });
          if (liked.value) {
            likes.value -= 1;
            liked.value = false;
          } else {
            likes.value += 1;
            liked.value = true;
          }
        } catch (error) {
          console.error('Failed to like/unlike the course:', error);
        }
      }
    };

    onMounted(() => {
      if (store.state.isAuthenticated) {
        store.dispatch('fetchCompletedCourses');
      }
      fetchLikes();
    });

    return { course, likes, liked, isCompleted, isAuthenticated, markAsCompleted, likeCourse };
  }
};
</script>

<style scoped>
.course-details {
  max-width: 800px;
  margin: 0 auto;
}

.course-header {
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.course-description {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.course-content {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 5px;
}

.accordion-item {
  margin-bottom: 1rem;
  border-radius: 5px;
}

.accordion-button {
  cursor: pointer;
  background-color: #88c1fef7;
  color: rgb(0, 0, 0);
  border: none;
  transition: background-color 0.3s ease;
}

.accordion-button:hover {
  background-color: #0262cadd;
}

.accordion-body {
  background-color: #ffffff;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-top: none;
  border-radius: 0 0 5px 5px;
}

.accordion-body p {
  margin: 0;
}

.accordion-body video {
  width: 100%;
  border-radius: 5px;
  margin-top: 1rem;
}

.badge.bg-success {
  background-color: #28a745;
  border-color: #28a745;
  font-size: 1rem;
  padding: 0.5rem;
  display: inline-block;
  margin-top: 1rem;
}

.like-section {
  display: flex;
  align-items: center;
}

.like-button {
  background-color: transparent;
  border: none;
  color: #6c757d; /* Gray color for not liked */
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

.btn {
  border-radius: 50px;
  font-size: 1rem;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
</style>