<template>
	<button
		v-if="geoLocationIsSupported"
		class="absolute right-16 z-1 w-8 h-8 bg-yellow-400 text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500"
		@click="getLocation">
		<UTooltip text="Find Me">
			<span class="flex items-center">
				<Icon
					name="uil:location-point"
					class="w-12 h-12" />
				<!-- Text only appears on medium screens and above -->
				<span class="hidden md:inline ml-2 text-sm font-medium">
					Find Me
				</span>
			</span>
		</UTooltip>
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
