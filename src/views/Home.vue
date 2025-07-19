<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4"
  >
    <div class="max-w-4xl w-full space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Lyingman</h1>
        <p class="text-lg text-gray-600">The Ultimate Party Game</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div
          class="bg-white/80 border border-gray-200 ring-1 ring-gray-100 hover:shadow-2xl transition-shadow rounded-2xl shadow-xl p-8 space-y-6 backdrop-blur-sm min-h-[420px] flex flex-col justify-center"
        >
          <div class="text-center">
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">
              Get Started
            </h2>
            <p class="text-gray-600">
              Create a new room or join an existing one
            </p>
          </div>
          <div class="space-y-4">
            <router-link
              to="/create"
              class="w-full bg-primary-600 hover:bg-primary-700 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm"
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
              class="w-full bg-accent-600 hover:bg-accent-700 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm"
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
        <section
          class="bg-white/80 border border-gray-200 ring-1 ring-gray-100 hover:shadow-2xl transition-shadow rounded-2xl shadow-xl p-8 min-h-[420px] flex flex-col justify-center backdrop-blur-sm lg:mt-0 mt-8 text-center"
        >
          <h2 class="text-2xl font-semibold text-gray-900 mb-3">How to Play</h2>
          <ol
            class="list-decimal list-inside text-gray-700 space-y-2 text-base mx-auto max-w-xs text-left"
          >
            <li>Join a room with at least 4 players.</li>
            <li>
              Each player receives a secret word. One player is the imposter
              with a different word.
            </li>
            <li>Take turns describing your word in the chat—be subtle!</li>
            <li>
              After everyone describes, vote for who you think is the imposter.
            </li>
            <li>
              If the imposter is caught, the others win. If not, the game
              continues!
            </li>
            <li>
              Try to blend in if you're the imposter, or catch the imposter if
              you're not!
            </li>
          </ol>
        </section>
      </div>
      <div class="text-center mt-8">
        <p class="text-sm text-gray-500">
          Up to 8 players • Real-time gameplay • Mobile friendly
        </p>
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
