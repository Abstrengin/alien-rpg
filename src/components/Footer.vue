<template>
  <footer
    class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 py-3 sm:py-8">
      <div class="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About Section -->
        <div>
          <h3
            class="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide"
          >
            About
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Alien RPG Tools is a comprehensive suite of generators and
            calculators for the Alien RPG tabletop game.
          </p>
        </div>

        <!-- Links Section -->
        <div>
          <h3
            class="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide"
          >
            Links
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                href="https://www.tiesthatbindgaming.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ties That Bind Gaming
              </a>
            </li>
            <li>
              <a
                href="https://terminal.tiesthatbindgaming.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Alien RPG Terminal Simulator
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Abstrengin/alien-rpg"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>

        <!-- Info Section -->
        <div>
          <h3
            class="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide"
          >
            Info
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Version:</strong> 1.1.2
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <strong>License:</strong> MIT
          </p>
        </div>
      </div>

      <!-- Divider -->
      <div
        class="hidden sm:block border-t border-gray-200 dark:border-gray-700 my-6"
      />

      <!-- Bottom Section -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4"
      >
        <p
          class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left"
        >
          © 2025 Ties That Bind Gaming™. All rights reserved.
        </p>
        <p
          class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left"
        >
          Fan-made tool for Alien RPG.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component - no logic needed
</script>
