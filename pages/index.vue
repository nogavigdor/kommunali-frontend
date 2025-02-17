<template>
  <div
    v-show="showPage"
    class="relative z-20 min-h-screen flex flex-col items-center md:pt-[100px] bg-gradient-to-br from-brandPrimary-500 to-brandPrimary-800 text-white overflow-hidden bg-top md:bg-cover md:bg-center"
    :style="{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: isDesktop ? '55%' : 'contain',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="absolute inset-0 bg-black/50" />
    <div class="relative z-10 text-center px-6 max-w-2xl animate-slide-in-down">
      <h1 class="text-2xl md:text-6xl font-heading mb-6 text-accent-light">
        Welcome to <span class="text-accent-">Kommunali</span>
      </h1>
      <p
        class="hidden text-1xl md:block md:text-2xl font-semibold mb-4 animate-fade-in"
      >
        Discover great second-hand deals near you and enjoy sustainable shopping
        within your community!
      </p>
      <p
        class="hidden text-lg text-secondary-light font-bold mb-8 animate-fade-in"
      >
        Experience the joy of sustainable second-hand shopping!
      </p>

      <!-- Call to Action Button -->
      <button class="btn-primary" @click="scrollToLocationInput">
        Find Your Community
      </button>
    </div>

    <!-- Floating Animated Decorative Elements -->
    <div
      class="absolute -bottom-10 -left-10 w-72 h-72 bg-accent-light opacity-30 rounded-full z-0 animate-float"
    />
    <div
      class="absolute top-10 right-20 w-48 h-48 bg-secondary-light opacity-40 rounded-full z-0 animate-float delay-1500"
    />
    <TheFooter />
  </div>
</template>

<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";
import { useUserStore } from "@/stores/user";
import TheFooter from "~/components/TheFooter.vue";
import bgImage from "@/assets/images/img3.webp"; // Import the image file

definePageMeta({
  title: "home",
  layout: "default",
});

// Detect screen width to apply different background sizes
const isDesktop = useMediaQuery("(min-width: 768px)");

const userStore = useUserStore();

const showPage = computed(() =>
  userStore.userLocation.every((value) => value === 0)
);

// const showPage = ref(true);

//
/*
watch (() => userStore.userLocation, () => {
	if (userStore.userLocation.every(value => value === 0)) {
		showPage.value = true;
		console.log("message from index page");
		console.log("user location is", userStore.userLocation);
		console.log("show page is", showPage.value);
	}
	else {
		console.log("message from index page");
		console.log("user location is", userStore.userLocation);
		console.log("show page is", showPage.value);
		showPage.value = false;
	}
}); */

const scrollToLocationInput = () => {
  const inputElement = document.getElementById("geolocation");
  if (!inputElement) return;
  inputElement.scrollIntoView({ block: "center", behavior: "smooth" });
  inputElement.focus({ preventScroll: true });
};
</script>

<style scoped>
@keyframes slide-in-left {
  from {
    transform: translateX(-100%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.animate-slide-in-left {
  animation: slide-in-left 1.5s ease-out forwards;
}
/* Animation Styles */
@keyframes slide-in-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Applying Animations */
.animate-slide-in-down {
  animation: slide-in-down 1.5s ease-in-out forwards;
}

.animate-fade-in {
  animation: fade-in 2.5s ease-in-out forwards;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float.delay-1500 {
  animation-delay: 1.5s;
}
</style>
