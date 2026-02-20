<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
		children?: any;
	}

	let { class: className, children }: Props = $props();
</script>

<div class={cn('rounded-xl bg-white p-4 shadow-md', className)}>
	{@render children?.()}
</div>
