<script lang="ts">
	import LandingPage from '$lib/components/LandingPage.svelte';

	let { data } = $props();
</script>

<LandingPage page={data.page} kind="solution" builtOn={data.builtOn} usedBy={[]} />
