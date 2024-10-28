<template>
  <div class="flex flex-col min-h-screen bg-primary">
    <!-- Top Navbar -->
    <TopNavbar @toggle-menu="toggleMenu" />

    <!-- Sidebar Menu -->
    <SidebarMenu :open="menuOpen" @close="menuOpen = false" @go-to="goTo" />

    <!-- Map Container -->
    <MapContainer />

    <!-- Bottom Navigation -->
    <BottomNavigation @go-to="goTo" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const router = useRouter();
const goTo = (path) => {
  router.push(path);
};
</script>
