<script setup lang="ts">
import { onMounted } from "vue";
import { useweatherEatStore } from "./stores/weatherEatStore";

const weatherEatStore = useweatherEatStore();

onMounted(() => {
  weatherEatStore.fetchRestaurants();
});
</script>

<template>
  <div id="app">
    <header class="header">
      <h1>🍽️ Weather Eat</h1>
      <p>맛집 공유 앱</p>
    </header>

    <main class="container">
      <section class="stats">
        <p>총 {{ weatherEatStore.restaurantCount }}개의 맛집</p>
      </section>

      <div v-if="weatherEatStore.loading" class="loading">로딩 중...</div>

      <div v-else class="restaurants-grid">
        <div
          v-for="restaurant in weatherEatStore.restaurants"
          :key="restaurant.id"
          class="restaurant-card"
        >
          <h3>{{ restaurant.name }}</h3>
          <p>📍 {{ restaurant.address }}</p>
          <p>⭐ {{ restaurant.rating }} / 5</p>
          <p class="review">{{ restaurant.review }}</p>
        </div>
      </div>

      <div
        v-if="
          weatherEatStore.restaurants.length === 0 && !weatherEatStore.loading
        "
      >
        <p>아직 등록된 맛집이 없습니다.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 2rem;
  text-align: center;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.header p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.stats {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.loading,
.container > p {
  color: white;
  text-align: center;
  padding: 2rem;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.restaurant-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
}

.restaurant-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.restaurant-card p {
  margin: 0.5rem 0;
  color: #666;
}

.review {
  color: #555;
  font-size: 0.95rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
</style>
