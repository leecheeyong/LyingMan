<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <router-link
          to="/"
          class="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">Join Room</h1>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="joinRoom" class="space-y-6">
          <div>
            <label
              for="roomCode"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Room Code
            </label>
            <input
              id="roomCode"
              v-model="roomCode"
              type="text"
              required
              maxlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors uppercase tracking-wider text-center text-lg font-mono"
              placeholder="ABC123"
              :disabled="loading"
              @input="formatRoomCode"
            />
          </div>

          <div>
            <label
              for="playerName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name
            </label>
            <input
              id="playerName"
              v-model="playerName"
              type="text"
              required
              maxlength="20"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter your name..."
              :disabled="loading"
            />
          </div>

          <button
            type="submit"
            :disabled="loading || !isValidForm"
            class="w-full bg-accent-600 hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Joining Room...
            </span>
            <span v-else>Join Room</span>
          </button>
        </form>

        <div
          v-if="error"
          class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
  <footer class="py-8 text-center text-gray-500 text-sm">
    <p>
      Made with <span class="text-red-500">❤️</span> by
      <a
        href="https://github.com/leecheeyong"
        target="_blank"
        class="text-gray-700 hover:underline"
      >
        Chee Yong Lee
      </a>
    </p>
    <p class="mt-1">
      Project available as open source under the terms of
      <a
        href="https://github.com/leecheeyong/lyingman/blob/main/LICENSE"
        target="_blank"
        class="text-gray-700 hover:underline"
        >MIT License</a
      >
    </p>
  </footer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { gameService } from "../gameService.js";
import { validateRoomCode, validatePlayerName } from "../gameUtils.js";

const router = useRouter();

const roomCode = ref("");
const playerName = ref("");
const loading = ref(false);
const error = ref("");

const isValidForm = computed(() => {
  return (
    validateRoomCode(roomCode.value) && validatePlayerName(playerName.value)
  );
});

const formatRoomCode = () => {
  roomCode.value = roomCode.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
};

const joinRoom = async () => {
  if (!isValidForm.value) {
    error.value = "Please enter a valid room code and name";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await gameService.joinRoom(roomCode.value, playerName.value.trim());
    router.push(`/room/${roomCode.value}`);
  } catch (err) {
    error.value =
      err.message ||
      "Failed to join room. Please check the room code and try again.";
  } finally {
    loading.value = false;
  }
};
</script>
