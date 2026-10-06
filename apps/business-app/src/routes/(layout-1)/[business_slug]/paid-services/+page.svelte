<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	const phoneDisplay = '+91 89830 66701';
	const phoneHref = 'tel:+918983066701';
	const whatsappHref = `https://wa.me/918983066701?text=${encodeURIComponent(
		'Hi, I want to book a solar plant design for ₹500.'
	)}`;

	const deliverables = [
		'Panel layout and row spacing',
		'String design',
		'Cable sizing and protection',
		'Single line diagram',
		'Earthing and lightning arrester',
		'Bill of materials',
		'AutoCAD-ready drawings (DXF + PDF)'
	];

	const steps = [
		{ title: 'Call us', text: 'Tell us the site location, roof or land size and the plant capacity in kW.' },
		{ title: 'We design', text: 'Our team prepares the layout, electrical design and bill of materials.' },
		{ title: 'You get the files', text: 'Receive AutoCAD-ready drawings, single line diagram and BOM as PDF and DXF.' }
	];
</script>

<div>
	<header class="mb-6">
		<h1 class="text-2xl font-semibold text-foreground">Paid Services</h1>
		<p class="mt-1 text-sm text-muted-foreground">Expert help for your solar projects</p>
	</header>

	<section class="mb-8">
		<div class="bg-card rounded-lg p-6 border shadow-card flex flex-col gap-6">
			<div class="flex flex-col md:flex-row justify-between items-start gap-4">
				<div class="flex flex-col gap-2">
					<Badge class="w-fit">Introductory price</Badge>
					<h2 class="text-xl font-semibold">Complete solar plant design for ₹500</h2>
					<p class="text-sm text-muted-foreground">Rooftop and ground-mount plants, 1 kW to 125 kW</p>
				</div>
				<div class="flex flex-col items-start md:items-end gap-1">
					<p class="text-2xl font-semibold">₹500 <span class="text-sm font-normal text-muted-foreground">per project</span></p>
					<p class="text-sm text-muted-foreground">Up to 3 projects per account</p>
				</div>
			</div>

			<div>
				<p class="text-sm text-muted-foreground mb-2">What you get</p>
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
					{#each deliverables as item}
						<li class="flex items-center gap-2">
							<span class="size-1.5 rounded-full bg-primary flex-none"></span>
							{item}
						</li>
					{/each}
				</ul>
			</div>

			<div class="flex flex-col md:flex-row md:items-center gap-3">
				<Button href={phoneHref} class="w-full md:w-auto">Call {phoneDisplay} to book</Button>
				<Button
					href={whatsappHref}
					target="_blank"
					rel="noopener noreferrer"
					variant="outline"
					class="w-full md:w-auto"
				>
					WhatsApp us
				</Button>
			</div>
		</div>
	</section>

	<section>
		<h2 class="text-lg font-semibold mb-4">How it works</h2>
		<ol class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each steps as step, i}
				<li class="bg-card rounded-lg p-4 border flex flex-col gap-1">
					<p class="text-sm text-muted-foreground">Step {i + 1}</p>
					<p class="font-medium">{step.title}</p>
					<p class="text-sm text-muted-foreground">{step.text}</p>
				</li>
			{/each}
		</ol>
	</section>
</div>
