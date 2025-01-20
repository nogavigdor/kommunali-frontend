<template>
	<button
		v-if="geoLocationIsSupported"
		class=" btn-primary  text-gray-800 rounded-2px p-2 md:p-2 md:align-middle justify-center shadow-lg hover:bg-yellow-500"
		@click="getLocation">
		<UTooltip text="Find Me">
			<span class="flex items-center gap-1">
				<Icon
					name="uil:location-point"
					class="w-6 h-6 text-secondary-light" />
				<!-- Text only appears on medium screens and above -->
				<span class="hidden md:inline ml-2 text-xl text-white font-bold ">
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
