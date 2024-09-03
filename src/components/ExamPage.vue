<template>
  <div class="exam-page container my-5">
    <h2 class="text-center mb-5">Select a Quiz</h2>
    <div v-if="!quizSelected">
      <div class="quiz-selection-container">
        <div v-for="quiz in quizzes" :key="quiz.id" class="quiz-selection card p-4 mb-3 shadow">
          <h3>{{ quiz.title }}</h3>
          <button @click="confirmQuizSelection(quiz)" class="btn btn-primary">Start Quiz</button>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="text-center mb-4">{{ currentQuiz.title }}</h2>
      <div v-if="!examFinished">
        <div class="timer text-center mb-4">
          <p><strong>Time Elapsed:</strong> {{ formattedTime }}</p>
        </div>
        <div v-for="(question, index) in currentQuiz.questions" :key="index" class="question card p-4 mb-3 shadow">
          <p>{{ index + 1 }}. {{ question.question }}</p>
          <div class="answers">
            <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="form-check">
              <input type="radio" :name="'question' + index" :value="answer" @change="selectAnswer(index, answer)" class="form-check-input">
              <label class="form-check-label">{{ answer }}</label>
            </div>
          </div>
          <div v-if="feedback[index]" class="feedback mt-3">
            <p :class="{'text-success': feedback[index].correct, 'text-danger': !feedback[index].correct}">
              {{ feedback[index].message }}
            </p>
          </div>
        </div>
        <button @click="submitExam" class="btn btn-success mt-4">Submit Exam</button>
      </div>
      <div v-else>
        <h3 class="text-center mt-4">Exam Results</h3>
        <div class="results card p-4 mt-4 shadow">
          <p><strong>Total Correct:</strong> {{ correctAnswers }}</p>
          <p><strong>Total Questions:</strong> {{ currentQuiz.questions.length }}</p>
          <p><strong>Time Taken:</strong> {{ formattedTime }}</p>
          <router-link to="/leaderboard" class="btn btn-secondary mt-3">View Leaderboard</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const quizzes = ref([
      {
        id: '1',
        title: 'Quiz 1',
        questions: [
          { question: 'What is Vue.js?', answers: ['A JavaScript framework', 'A CSS framework', 'A programming language'], correctAnswer: 'A JavaScript framework' },
          { question: 'What is the capital of France?', answers: ['Berlin', 'Madrid', 'Paris'], correctAnswer: 'Paris' },
          { question: 'Who created Vue.js?', answers: ['Evan You', 'Dan Abramov', 'Jordan Walke'], correctAnswer: 'Evan You' },
          { question: 'Which of the following is a Vue.js directive?', answers: ['v-bind', 'ng-bind', 'ng-model'], correctAnswer: 'v-bind' },
          { question: 'What is the default file extension for Vue components?', answers: ['.vue', '.js', '.jsx'], correctAnswer: '.vue' },
          { question: 'Which company maintains Vue.js?', answers: ['Google', 'Facebook', 'None of the above'], correctAnswer: 'None of the above' },
          { question: 'What is a Vue instance?', answers: ['A root Vue object', 'A component', 'A directive'], correctAnswer: 'A root Vue object' },
          { question: 'What is the capital of Germany?', answers: ['Berlin', 'Madrid', 'Paris'], correctAnswer: 'Berlin' },
          { question: 'What is the primary language of Vue.js?', answers: ['JavaScript', 'TypeScript', 'Python'], correctAnswer: 'JavaScript' },
          { question: 'What is Vue Router used for?', answers: ['State management', 'Routing', 'Styling'], correctAnswer: 'Routing' }
        ]
      },
      {
        id: '2',
        title: 'Quiz 2',
        questions: [
          { question: 'What is React?', answers: ['A JavaScript library', 'A CSS library', 'A programming language'], correctAnswer: 'A JavaScript library' },
          { question: 'What is the capital of Spain?', answers: ['Berlin', 'Madrid', 'Paris'], correctAnswer: 'Madrid' },
          { question: 'Who created React?', answers: ['Facebook', 'Google', 'Microsoft'], correctAnswer: 'Facebook' },
          { question: 'Which of the following is a React hook?', answers: ['useState', 'ng-model', 'ng-bind'], correctAnswer: 'useState' },
          { question: 'What is the file extension for React components?', answers: ['.jsx', '.js', '.ts'], correctAnswer: '.jsx' },
          { question: 'Which company maintains React?', answers: ['Google', 'Facebook', 'Microsoft'], correctAnswer: 'Facebook' },
          { question: 'What is JSX?', answers: ['JavaScript XML', 'JavaScript', 'TypeScript'], correctAnswer: 'JavaScript XML' },
          { question: 'What is the capital of Italy?', answers: ['Berlin', 'Madrid', 'Rome'], correctAnswer: 'Rome' },
          { question: 'What is React Router used for?', answers: ['State management', 'Routing', 'Styling'], correctAnswer: 'Routing' },
          { question: 'What is the primary language of React?', answers: ['JavaScript', 'TypeScript', 'Python'], correctAnswer: 'JavaScript' }
        ]
      },
      {
        id: '3',
        title: 'Quiz 3',
        questions: [
          { question: 'What is Angular?', answers: ['A JavaScript framework', 'A CSS framework', 'A programming language'], correctAnswer: 'A JavaScript framework' },
          { question: 'What is the capital of Canada?', answers: ['Toronto', 'Ottawa', 'Vancouver'], correctAnswer: 'Ottawa' },
          { question: 'Who created Angular?', answers: ['Google', 'Facebook', 'Microsoft'], correctAnswer: 'Google' },
          { question: 'Which of the following is an Angular directive?', answers: ['ng-bind', 'v-bind', 'useState'], correctAnswer: 'ng-bind' },
          { question: 'What is the file extension for Angular components?', answers: ['.ts', '.js', '.jsx'], correctAnswer: '.ts' },
          { question: 'Which company maintains Angular?', answers: ['Google', 'Facebook', 'Microsoft'], correctAnswer: 'Google' },
          { question: 'What is TypeScript?', answers: ['A superset of JavaScript', 'A type of CSS', 'A programming language'], correctAnswer: 'A superset of JavaScript' },
          { question: 'What is the capital of the USA?', answers: ['New York', 'Los Angeles', 'Washington, D.C.'], correctAnswer: 'Washington, D.C.' },
          { question: 'What is Angular Router used for?', answers: ['State management', 'Routing', 'Styling'], correctAnswer: 'Routing' },
          { question: 'What is the primary language of Angular?', answers: ['JavaScript', 'TypeScript', 'Python'], correctAnswer: 'TypeScript' }
        ]
      }
    ]);

    const currentQuiz = ref(null);
    const quizSelected = ref(false);
    const selectedAnswers = ref([]);
    const feedback = ref([]);
    const correctAnswers = ref(0);
    const examFinished = ref(false);
    const startTime = ref(null);
    const timeTaken = ref(0);
    const router = useRouter();
    const elapsedTime = ref(0);

    const formattedTime = computed(() => {
      const minutes = Math.floor(elapsedTime.value / 60);
      const seconds = elapsedTime.value % 60;
      return `${minutes}m ${seconds}s`;
    });

    const updateTime = () => {
      if (quizSelected.value && !examFinished.value) {
        elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
        requestAnimationFrame(updateTime);
      }
    };

    const selectAnswer = (questionIndex, answer) => {
      selectedAnswers.value[questionIndex] = answer;
    };

    const confirmQuizSelection = (quiz) => {
      if (confirm(`Are you sure you want to start ${quiz.title}?`)) {
        currentQuiz.value = quiz;
        quizSelected.value = true;
        selectedAnswers.value = Array(quiz.questions.length).fill(null);
        startTime.value = Date.now();
        requestAnimationFrame(updateTime);
      }
    };

    const submitExam = () => {
      correctAnswers.value = 0;
      feedback.value = [];

      currentQuiz.value.questions.forEach((question, index) => {
        const correct = question.correctAnswer === selectedAnswers.value[index];
        feedback.value[index] = {
          correct,
          message: correct ? 'Correct!' : `Incorrect. The correct answer is ${question.correctAnswer}.`
        };
        if (correct) correctAnswers.value++;
      });

      timeTaken.value = Math.floor((Date.now() - startTime.value) / 1000);

      saveExamResults();

      examFinished.value = true;
    };

    const saveExamResults = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/exam/submit', {
          quizId: currentQuiz.value.id,
          correctAnswers: correctAnswers.value,
          totalQuestions: currentQuiz.value.questions.length,
          timeTaken: timeTaken.value
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Exam result saved:', response.data);
      } catch (error) {
        console.error('Error saving exam results:', error.response ? error.response.data : error.message);
      }
    };

    return { quizzes, currentQuiz, quizSelected, selectedAnswers, feedback, correctAnswers, examFinished, selectAnswer, confirmQuizSelection, submitExam, formattedTime, elapsedTime };
  }
};
</script>

<style scoped>
.exam-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quiz-selection-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.quiz-selection {
  flex: 1 1 calc(30% - 20px);
  margin: 10px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

.question {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
}

.answers .form-check {
  margin-bottom: 10px;
}

.results {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
}

.timer {
  font-size: 1.25rem;
  color: #007bff;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
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
