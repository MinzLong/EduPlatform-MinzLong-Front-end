<template>
  <div class="leaderboard-page">
    <h2 class="text-center mb-5">Leaderboard</h2>
    <div v-for="leaderboard in leaderboards" :key="leaderboard.quizId" class="leaderboard-section card p-4 mb-4 shadow">
      <h3 class="text-center mb-4">{{ leaderboard.title }}</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">User</th>
            <th scope="col">Correct Answers</th>
            <th scope="col">Time Taken (seconds)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in leaderboard.results" :key="result._id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ result.user.email }}</td>
            <td>{{ result.correctAnswers }}</td>
            <td>{{ result.timeTaken }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const leaderboards = ref([]);

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/exam/leaderboard');
        leaderboards.value = response.data;
      } catch (error) {
        console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
      }
    };

    onMounted(fetchLeaderboard);

    return { leaderboards };
  }
};
</script>

<style scoped>
.leaderboard-page {
  max-width: 1000px;
  margin: 0 auto;
}

.leaderboard-section {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  background-color: #fff;
}

.table th, .table td {
  padding: 1.25rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
