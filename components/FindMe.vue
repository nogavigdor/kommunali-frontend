<template>
	<button
		v-if="geoLocationIsSupported"
		class="btn-primary"
		@click="getLocation">
		<Icon name="uil:location-point" />Find Me
	</button>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const geoLocationIsSupported = computed(() => navigator && "geolocation" in navigator);

const getLocation = () => {
	navigator.geolocation.getCurrentPosition((position) => {
		userStore.userLocation = [position.coords.longitude, position.coords.latitude];
	});
};
</script>
