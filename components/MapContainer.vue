<!-- MapContainer.vue -->
<template>
	<div
		id="map"
		class="flex-grow h-full w-full">
		<MapboxMap
			map-id="map"
			style="position: absolute; top: 0; bottom: 0; left: 250px; width: 500px;"
			:options="{
				style: 'mapbox://styles/mapbox/light-v11', // style URL
				center: [-68.137343, 45.137451], // starting position
				zoom: 5, // starting zoom
			}" />
	</div>
</template>

<script setup lang="ts"></script>

<style scoped>

</style>
