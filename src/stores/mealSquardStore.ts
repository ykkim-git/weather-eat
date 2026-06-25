import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase.config";

export interface Restaurant {
  id?: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  rating: number;
  review: string;
  imageUrl?: string;
  createdAt: Date;
}

export const usemealSquardStore = defineStore("restaurant", () => {
  const restaurants = ref<Restaurant[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const restaurantsCollection = collection(db, "restaurants");

  const addRestaurant = async (
    restaurant: Omit<Restaurant, "id" | "createdAt">,
  ) => {
    try {
      loading.value = true;
      error.value = null;
      const docRef = await addDoc(restaurantsCollection, {
        ...restaurant,
        createdAt: new Date(),
      });
      restaurants.value.push({
        id: docRef.id,
        ...restaurant,
        createdAt: new Date(),
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "식당 추가 실패";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchRestaurants = async () => {
    try {
      loading.value = true;
      error.value = null;
      const q = query(restaurantsCollection);
      const querySnapshot = await getDocs(q);
      restaurants.value = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Restaurant,
      );
    } catch (err) {
      error.value = err instanceof Error ? err.message : "식당 조회 실패";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;
      await deleteDoc(doc(db, "restaurants", id));
      restaurants.value = restaurants.value.filter((r) => r.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "식당 삭제 실패";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateRestaurant = async (id: string, updates: Partial<Restaurant>) => {
    try {
      loading.value = true;
      error.value = null;
      await updateDoc(doc(db, "restaurants", id), updates);
      const index = restaurants.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        restaurants.value[index] = { ...restaurants.value[index], ...updates };
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "식당 수정 실패";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getRestaurantById = (id: string) => {
    return restaurants.value.find((r) => r.id === id);
  };

  const restaurantCount = computed(() => restaurants.value.length);

  return {
    restaurants,
    loading,
    error,
    addRestaurant,
    fetchRestaurants,
    deleteRestaurant,
    updateRestaurant,
    getRestaurantById,
    restaurantCount,
  };
});
