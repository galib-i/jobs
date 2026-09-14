<script lang="ts" module>
	import BriefcaseIcon from "@lucide/svelte/icons/briefcase";
	import PieChartIcon from "@lucide/svelte/icons/pie-chart";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import BellIcon from "@lucide/svelte/icons/bell";

	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
		navMain: [
			{
				title: "Applications",
				url: "#",
				icon: BriefcaseIcon,
				isActive: true,
			},
		],
	};
</script>

<script lang="ts">
	import CommandIcon from"@lucide/svelte/icons/command";
	import * as Sidebar from"$lib/components/ui/sidebar/index.js";
	import { useSidebar } from"$lib/components/ui/sidebar/context.svelte.js";
	import type { ComponentProps } from"svelte";
	import { Window } from "@wailsio/runtime";

	let { ref = $bindable(null), page = $bindable(), ...restProps }: ComponentProps<typeof Sidebar.Root> & { page?: string } = $props();

	const sidebar = useSidebar();
	
	$effect(() => {
		let title = "Jobs";
		if (page === "diagrams") title = "Statistics";
		if (page === "settings") title = "Settings";
		Window.SetTitle(`${title} — Jahb`);
	});
</script>

<Sidebar.Root bind:ref collapsible="none" class="sticky top-0 h-svh w-[calc(var(--sidebar-width-icon)+1px)]! border-s" {...restProps}>
	<Sidebar.Content>
		<Sidebar.Group class="px-0">
			<Sidebar.GroupContent class="px-0">
				<Sidebar.Menu>
					{#each data.navMain as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								tooltipContentProps={{
									hidden: false,
								}}
								onclick={() => {
									page = item.title === "Statistics" ? "diagrams" : "jobs";
									sidebar.setOpen(true);
								}}
								isActive={page === (item.title === "Statistics" ? "diagrams" : "jobs")}
								class="h-7 w-7 p-0 mx-auto flex items-center justify-center">
								{#snippet tooltipContent()}
									{item.title}
								{/snippet}
								<item.icon />
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer class="px-0">
		<Sidebar.Menu class="gap-0">
			<Sidebar.MenuItem>
				<Sidebar.MenuButton tooltipContentProps={{ hidden: false }} class="h-7 w-7 p-0 mx-auto flex items-center justify-center">
					{#snippet tooltipContent()}
						Notifications
					{/snippet}
					<BellIcon />
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton tooltipContentProps={{ hidden: false }} class="h-7 w-7 p-0 mx-auto flex items-center justify-center" onclick={() => page = "settings"} isActive={page === "settings"}>
					{#snippet tooltipContent()}
						Settings
					{/snippet}
					<SettingsIcon />
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
