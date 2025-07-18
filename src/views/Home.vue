<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Lyingman</h1>
        <p class="text-lg text-gray-600">The Ultimate Party Game</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Get Started</h2>
          <p class="text-gray-600">Create a new room or join an existing one</p>
        </div>

        <div class="space-y-4">
          <router-link
            to="/create"
            class="w-full bg-primary-600 hover:bg-primary-700 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Room</span>
          </router-link>

          <router-link
            to="/join"
            class="w-full bg-accent-600 hover:bg-accent-700 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span>Join Room</span>
          </router-link>
        </div>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-500">
          Up to 8 players • Real-time gameplay • Mobile friendly
        </p>
      </div>
    </div>
  </div>
</template>
