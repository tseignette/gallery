import { onDestroy } from 'svelte';

function updateDocumentClass({ matches }: { matches: boolean }) {
	if (matches) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}

export function useColorScheme() {
	const query = window.matchMedia('(prefers-color-scheme: dark)');

	updateDocumentClass(query);

	query.addEventListener('change', updateDocumentClass);

	onDestroy(() => {
		query.removeEventListener('change', updateDocumentClass);
	});
}
