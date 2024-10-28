<!-- BottomNavigation.vue -->
<template>
	<UAppBar
		class="bottom-0 fixed w-full flex justify-between bg-primary text-white">
		<button
			class="flex-1 flex justify-center items-center"
			@click="$emit('go-to', 'messages')">
			<UIcon
				name="mail"
				class="text-xl text-white" />
			<UTooltip>Account</UTooltip>
		</button>
		<button
			class="flex-1 flex justify-center items-center"
			@click="$emit('go-to', 'myStore')">
			<UIcon
				name="storefront"
				class="text-xl text-white" />
			<UTooltip>My Store</UTooltip>
		</button>
		<button
			class="flex-1 flex justify-center items-center"
			@click="$emit('go-to', 'wishlist')">
			<UIcon
				name="heart"
				class="text-xl text-white" />
			<UTooltip>Wishlist</UTooltip>
		</button>
		<button
			class="flex-1 flex justify-center items-center"
			@click="$emit('go-to', 'requests')">
			<UIcon
				name="mail"
				class="text-xl text-white" />
			<UTooltip>Requests</UTooltip>
		</button>
	</UAppBar>
</template>

<script setup>

</script>
