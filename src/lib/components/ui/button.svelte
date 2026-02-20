<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { tv, type VariantProps } from 'tailwind-variants';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const buttonVariants = tv({
		base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		variants: {
			variant: {
				default: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg active:scale-95',
				secondary: 'bg-white border-2 border-amber-400 text-gray-900 shadow hover:bg-amber-50 active:scale-95',
				ghost: 'hover:bg-amber-50 active:scale-95',
				success: 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
			},
			size: {
				default: 'h-11 px-6 min-w-[44px]',
				sm: 'h-9 px-4 text-xs',
				lg: 'h-14 px-8 text-base',
				icon: 'h-11 w-11'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	type Props = HTMLButtonAttributes & {
		variant?: VariantProps<typeof buttonVariants>['variant'];
		size?: VariantProps<typeof buttonVariants>['size'];
		class?: string;
		children?: any;
	};

	let { variant, size, class: className, children, ...restProps }: Props = $props();
</script>

<ButtonPrimitive.Root
	class={cn(buttonVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children?.()}
</ButtonPrimitive.Root>
