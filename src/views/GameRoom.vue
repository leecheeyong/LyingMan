<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 p-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Room {{ roomCode
              }}<span v-if="currentPlayerName"> - {{ currentPlayerName }}</span>
            </h1>
            <p class="text-gray-600">
              {{ players.length }} player{{ players.length !== 1 ? "s" : "" }}
              connected
            </p>
          </div>
          <button
            @click="leaveRoom"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            Leave Room
          </button>
        </div>
      </div>

      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
      >
        <div class="flex items-center">
          <svg
            class="w-6 h-6 text-red-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h3 class="text-red-800 font-semibold">Room Not Found</h3>
            <p class="text-red-600">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-if="!error" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2
            class="text-xl font-semibold text-gray-900 mb-4 flex items-center"
          >
            <svg
              class="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            Players
          </h2>

          <div class="space-y-3">
            <div
              v-for="player in players"
              :key="player.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3"
                >
                  <span class="text-primary-600 font-semibold">{{
                    player.name.charAt(0).toUpperCase()
                  }}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ player.name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ player.isHost ? "Host" : "Player" }}
                  </p>
                </div>
              </div>

              <div class="flex items-center">
                <div
                  class="w-3 h-3 bg-green-400 rounded-full animate-pulse"
                ></div>
                <span class="ml-2 text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>

          <div v-if="players.length === 0" class="text-center py-8">
            <svg
              class="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <p class="text-gray-500">No players connected</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2
            class="text-xl font-semibold text-gray-900 mb-4 flex items-center"
          >
            <svg
              class="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Game Status
          </h2>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
            >
              <span class="text-blue-800 font-medium">Status</span>
              <span class="text-blue-600 capitalize">{{
                gameState.status
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-4 bg-green-50 rounded-xl"
            >
              <span class="text-green-800 font-medium">Round</span>
              <span class="text-green-600">{{ gameState.round }}</span>
            </div>
            <div
              v-if="gameState.status === 'waiting' && gameState.round === 0"
              class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
            >
              <p v-if="players.length < 4" class="text-yellow-800 text-sm">
                Waiting for players to join. At least 4 players are required to
                start the game. Share the room code
                <strong>{{ roomCode }}</strong> with your friends!
              </p>
              <div v-else class="flex flex-col items-center">
                <p class="text-yellow-800 text-sm mb-2">
                  Minimum players reached! The game can now be started.
                </p>
                <button
                  @click="startGame"
                  class="bg-primary-600 hover:bg-primary-700 text-gray-900 font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  Start Game
                </button>
              </div>
            </div>
            <div
              v-if="gameState.status === 'describing'"
              class="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col items-center justify-between"
            >
              <span class="text-blue-800 text-sm mb-2"
                >Time left to describe your word:</span
              >
              <span class="text-blue-900 font-bold text-lg mb-2">{{
                timer
              }}</span>
              <span class="text-green-800 font-semibold text-lg"
                >Your word: <span class="underline">{{ myWord }}</span></span
              >
            </div>
            <div
              v-if="gameState.status === 'voting' && isAlive"
              class="p-4 bg-purple-50 border border-purple-200 rounded-xl"
            >
              <p class="text-purple-800 text-sm mb-2">
                Time to vote! Who do you think is the imposter?
              </p>
              <div class="flex flex-wrap gap-2">
                <template v-for="player in players" :key="player.id">
                  <button
                    v-if="player.id !== gameService.getCurrentPlayer()"
                    @click="voteForPlayer(player.id)"
                    :disabled="hasVoted"
                    class="bg-purple-600 hover:bg-purple-700 text-gray-900 font-semibold py-1 px-3 rounded-xl transition-colors"
                  >
                    {{ player.name }}
                  </button>
                </template>
              </div>
              <p v-if="hasVoted" class="text-purple-700 mt-2">
                You have voted.
              </p>
            </div>
          </div>
          <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Chat</h3>
            <div class="bg-gray-50 rounded-xl p-3 h-40 overflow-y-auto mb-2">
              <div
                v-for="msg in chatMessages"
                :key="msg.timestamp"
                class="mb-1"
              >
                <span class="font-semibold text-primary-700"
                  >{{ msg.name }}:</span
                >
                <span class="text-gray-800">{{ msg.text }}</span>
              </div>
            </div>
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <input
                v-model="chatInput"
                :disabled="
                  !canChat || hasSentMessage || gameState.status === 'voting'
                "
                class="flex-1 px-3 py-2 rounded-xl border border-gray-300"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                :disabled="
                  !canChat ||
                  !chatInput.trim() ||
                  hasSentMessage ||
                  gameState.status === 'voting'
                "
                class="bg-primary-600 hover:bg-primary-700 text-gray-900 font-semibold px-4 py-2 rounded-xl"
              >
                Send
              </button>
            </form>
            <p
              v-if="hasSentMessage && gameState.status === 'describing'"
              class="text-green-700 mt-2"
            >
              You have sent your message for this round.
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="
          (gameState.status === 'voting' || gameState.status === 'ended') &&
          voteSummary.length > 0
        "
        class="bg-white rounded-2xl shadow-xl p-6 mt-6"
      >
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Vote Summary</h2>
        <div class="space-y-2">
          <div
            v-for="(summary, index) in voteSummary"
            :key="index"
            class="p-4 bg-gray-50 rounded-xl"
          >
            <p class="text-gray-800">{{ summary }}</p>
          </div>
        </div>
      </div>

      <div v-if="winnerMessage" class="bg-white rounded-2xl shadow-xl p-6 mt-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Game Over</h2>
        <p class="text-gray-800">{{ winnerMessage }}</p>
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { gameService } from "../gameService.js";

const router = useRouter();
const route = useRoute();

const roomCode = computed(() => route.params.code);
const roomData = ref(null);
const error = ref("");
const unsubscribe = ref(null);

const players = computed(() => {
  if (!roomData.value?.players) return [];
  return Object.values(roomData.value.players);
});

const gameState = computed(() => {
  return roomData.value?.gameState || { status: "waiting", round: 0 };
});

const isHost = computed(() => {
  const currentPlayer = gameService.getCurrentPlayer();
  if (!currentPlayer) return false;
  const hostId = roomData.value?.host;
  if (hostId) return currentPlayer === hostId;
  const player = players.value.find((p) => p.id === currentPlayer);
  return player?.isHost || false;
});

const myWord = computed(() => {
  const playerId = gameService.getCurrentPlayer();
  return gameState.value.roles?.[playerId]?.word || "";
});

const allPlayerMap = computed(() => {
  const map = {};
  if (gameState.value.roles) {
    Object.entries(gameState.value.roles).forEach(([id, role]) => {
      map[id] = role.name || id;
    });
  }
  players.value.forEach((p) => {
    map[p.id] = p.name;
  });
  return map;
});

const voteSummary = computed(() => {
  if (!gameState.value.votes) return [];
  const map = allPlayerMap.value;
  return Object.entries(gameState.value.votes).map(([voterId, votedId]) => {
    return `${map[voterId] || "Unknown"} voted for ${map[votedId] || "Unknown"}`;
  });
});

const winnerMessage = computed(() => {
  if (gameState.value.status !== "ended") return "";
  const sysMsg = [...chatMessages.value]
    .reverse()
    .find((msg) => msg.playerId === "system" && msg.text?.includes("win"));
  return sysMsg ? sysMsg.text : "";
});

const setupRoomListener = () => {
  if (unsubscribe.value) unsubscribe.value();
  unsubscribe.value = gameService.listenToRoom(roomCode.value, (data) => {
    roomData.value = data;
    error.value = "";
  });
};

const leaveRoom = async () => {
  const currentPlayer = gameService.getCurrentPlayer();
  if (currentPlayer) {
    await gameService.leaveRoom(roomCode.value, currentPlayer);
  }
  if (unsubscribe.value) unsubscribe.value();
  if (chatUnsubscribe.value) chatUnsubscribe.value();
  roomData.value = null;
  error.value = "";
  router.push("/");
};

const timer = ref(60);
let timerInterval = null;

const chatMessages = ref([]);
let chatUnsubscribe = ref(null);
const chatInput = ref("");
const isAlive = computed(() => {
  const playerId = gameService.getCurrentPlayer();
  return players.value.some((p) => p.id === playerId);
});
const canChat = computed(
  () => gameState.value.status === "describing" && isAlive.value,
);
const hasVoted = ref(false);
const hasSentMessage = ref(false);

function setupChatListener() {
  if (chatUnsubscribe.value) chatUnsubscribe.value();
  const chatRef = gameService.getChatRef(roomCode.value);
  chatUnsubscribe.value = gameService.listenToChat(chatRef, (messages) => {
    chatMessages.value = messages;
  });
}

onMounted(async () => {
  try {
    await gameService.getRoomData(roomCode.value);
    setupRoomListener();
    setupChatListener();
  } catch (err) {
    error.value = err.message || "Room not found";
  }
});

onUnmounted(() => {
  if (unsubscribe.value) unsubscribe.value();
  if (timerInterval) clearInterval(timerInterval);
  if (chatUnsubscribe.value) chatUnsubscribe.value();
});

function startTimer() {
  timer.value = 60;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timer.value <= 0) {
      clearInterval(timerInterval);
      return;
    }
    timer.value--;
  }, 1000);
}

watch(gameState, (newState, oldState) => {
  if (newState.status === "describing") {
    startTimer();
    hasVoted.value = false;
    hasSentMessage.value = false;
  } else {
    if (timerInterval) clearInterval(timerInterval);
  }
});

watch(
  () => route.params.code,
  (newCode) => {
    if (newCode && newCode !== roomCode.value) {
      roomCode.value = newCode;
    }
  },
);

watch(
  () => roomCode.value,
  async (newCode, oldCode) => {
    if (unsubscribe.value) unsubscribe.value();
    if (chatUnsubscribe.value) chatUnsubscribe.value();
    // Reset all relevant state when switching rooms
    roomData.value = null;
    chatMessages.value = [];
    chatInput.value = "";
    hasVoted.value = false;
    hasSentMessage.value = false;
    timer.value = 60;
    try {
      await gameService.getRoomData(newCode);
      setupRoomListener();
      setupChatListener();
    } catch (err) {
      error.value = err.message || "Room not found";
    }
  },
  { immediate: true },
);

async function sendMessage() {
  if (!chatInput.value.trim()) return;
  try {
    await gameService.sendChat(roomCode.value, chatInput.value);
    chatInput.value = "";
    hasSentMessage.value = true;
  } catch (e) {
    console.error("Failed to send message", e);
  }
}

async function startGame() {
  try {
    await gameService.startGame(roomCode.value);
  } catch (e) {
    error.value = e.message || "Failed to start game.";
    console.error("Failed to start game:", e);
  }
}

const voteForPlayer = async (playerId) => {
  try {
    await gameService.vote(roomCode.value, playerId);
    hasVoted.value = true;
  } catch (e) {
    error.value = e.message || "Failed to vote.";
    console.error("Failed to vote:", e);
  }
};

const currentPlayerName = computed(() => {
  const playerId = gameService.getCurrentPlayer();
  const player = players.value.find((p) => p.id === playerId);
  return player ? player.name : "";
});

watch(roomData, (newRoomData) => {
  const playerId = gameService.getCurrentPlayer();
  if (newRoomData && newRoomData.players && !newRoomData.players[playerId]) {
    // Player is no longer in the room (disconnected or removed)
    router.push("/");
  }
});
</script>
