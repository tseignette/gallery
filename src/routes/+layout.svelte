<script lang="ts">
	import '@skeletonlabs/skeleton/styles/all.css';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '../app.postcss';

	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { useColorScheme } from './color-scheme';

	useColorScheme();
</script>

<AppShell
	regionPage="relative"
	slotPageHeader="sticky top-0 z-10"
	slotSidebarLeft="bg-surface-100-800-token w-60 py-14 px-4 border-r border-surface-500/30"
	slotPageContent="p-4"
>
	<svelte:fragment slot="pageHeader">
		<AppBar background="bg-surface-50-900-token">
			<svelte:fragment slot="lead">
				<p>TODO: pageHeader</p>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<p>TODO: sidebarLeft</p>
	</svelte:fragment>

	<slot />
</AppShell>
