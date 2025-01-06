<!-- pages/help.vue -->
<template>
	<div class="page-transition dark-mode">
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">
				FAQ Page
			</h1>
			<ToLink
				link="/"
				icon="arrow-left"
				tooltip-text="Back to Home Page" />
		</div>
		<p>Find answers to frequently asked questions.</p>
		<UAccordion
			:items="faqItems"
			multiple
			color="brand-primary"
			variant="soft"
			size="lg"
			class="w-full lg:w-3/4 mx-auto">
			<template #default="{ item, index, open }">
				<UButton
					color="brandPrimary"
					variant="ghost"
					class="w-full text-left flex justify-between items-center py-4 border-b border-brandGray-300 dark:border-brandGray-700">
					<span class="font-bold text-lg">{{ index + 1 }}. {{ item.label }}</span>
					<Icon
						:name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
						class="w-6 h-6 transition-transform" />
				</UButton>
			</template>

			<template #item="{ item }">
				<p
					class="text-brandGray-700 dark:text-brandGray-300 leading-relaxed px-6 py-4 bg-brandGray-100 dark:bg-brandGray-800 rounded-lg shadow-soft">
					{{ item.content }}
				</p>
			</template>
		</UAccordion>
	</div>
</template>

<script setup lang="ts">
const faqItems = [
	{
		label: "What is Kommunali?",
		content:
      "Kommunali is a map-based second-hand marketplace that promotes sustainability and local item exchanges. We believe that making second-hand trading a fun and engaging experience not only helps people find what they need but also reduces waste, strengthens community connections, and fosters a more sustainable future.",
	},
	{
		label: "How do I create a shop?",
		content:
      "Register your account, log in and click 'My Shop' on the menu. Enter your shop's details, including it's address. You can then start uploading products and see your shop marked in red on the map",
	},
	{
		label: "Is Kommunali free to use?",
		content:
      "Yes, creating a store and listing products is free. Premium features will be added in the future but the core functionality will remain free.",
	},
	{
		label: "How can I contact a shop owner?",
		content:
      "Each shop marker on the map is interactive and you can contact the shop owner by clicking the chat option after opening the shop window on the map. This opetion is available for registered users.",
	},
	{
		label: "What makes Kommunali unique?",
		content:
      "Kommunali focuses on trust and sustainability by promoting local exchanges. The interactive map makes it easier to explore nearby stores and discover second-hand items conveniently.",
	},
	{
		label: "How can I ensure my safety when trading?",
		content:
      "Please avoid sharing sensitive information. For example, when publishing a product, be carefull not to include any addtional information of valuable items that you don't want to share. Also, in case of any suspicious behavior of one of the users, please contact us.",
	},
	{
		label: "Can I list items for free?",
		content:
      "Yes! You can list both free and paid items. Giving away unused items for free helps reduce waste and builds stronger community connections.",
	},
	{
		label: "How does the map works?",
		content:
      "As guest user or as a newly registered user, the map will be revealed either by entering an address in the input filed at the top of the screen, or by adding your shop. The red house marker on the map symbolyze your shop and a blue house marker symbolyze other shops. The markers are interactive and anable you to request products and contact the shop owner if you wish to discuss about additional information.",
	},
	{
		label: "How can I search for products?",
		content:
      "On the top left corner of the map you can find the search input field. You can search for products by typing the name of the product you are looking for. The map will show you the shops that have the product you are looking for. By clicking on the product, the shop which has the product will be highlighted in yellow. If you click the 'Show Shops' button, all the shops which contains the products in the resuls list will be highlighted in yellow. ",
	},
	{
		label: "What premium features are available?",
		content:
      "Premium features will be added in the future and will include garage sale option and  other exta features that will help you promote your shop and products. The core functionality will remain free.",
	},
];
</script>

<style scoped></style>
