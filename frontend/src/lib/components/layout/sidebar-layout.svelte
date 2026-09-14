<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";

	let { children, page = $bindable() } = $props();

</script>

<Sidebar.Provider open={false} style="--sidebar-width: 350px; --sidebar-width-icon: 2.25rem;" class="h-svh overflow-hidden">
	<Sidebar.Inset class="h-full overflow-y-auto" style="overflow-y: overlay;">
	    {@render children()}
	</Sidebar.Inset>
	<AppSidebar bind:page />
</Sidebar.Provider>
