<script module lang="ts">
	export type DrawingModalProps = {
		show?: boolean;
		proposalData?: Record<string, any>;
		onClose?: () => void;
	};
</script>

<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	// SVG Drawing Colours (aligned with design system)
	const SVG_COLORS = {
		background: '#f8f9fa',
		title: '#3B82F6',
		text: '#171717',
		textMuted: '#737373',
		textSecondary: '#525252',
		divider: '#E5E5E5',
		panel: '#2c3e50',
		panelBorder: '#34495e',
		annotation: '#F59E0B',
		support: '#6c757d',
		footer: '#A3A3A3'
	};

	let { show = $bindable(false), proposalData = {}, onClose = () => {} }: DrawingModalProps =
		$props();

	// Form inputs
	let roofType = $state('flat');
	let panelOrientation = $state('landscape');
	let tiltAngle = $state(45);

	// Drawing state
	let drawingGenerated = $state(false);
	let svgContent = $state('');
	let isGenerating = $state(false);
	let isDownloading = $state(false);

	function handleOpenChange(open: boolean) {
		if (!open) {
			drawingGenerated = false;
			svgContent = '';
			onClose();
		}
	}

	function close() {
		show = false;
		onClose();
	}

	function calculateLayout(numberOfPanels: number) {
		const sqrt = Math.sqrt(numberOfPanels);
		let rows = Math.floor(sqrt);
		let cols = Math.ceil(numberOfPanels / rows);

		while (rows * cols < numberOfPanels) {
			cols++;
		}

		return { rows, cols };
	}

	function generateDrawing() {
		isGenerating = true;

		try {
			const numberOfPanels = proposalData.number_of_panels || 15;
			const systemCapacity = proposalData.system_capacity_kw || '5';
			const layout = calculateLayout(numberOfPanels);

			const svgWidth = 1200;
			const svgHeight = 600;
			const viewWidth = svgWidth / 2;

			const panelWidth = panelOrientation === 'landscape' ? 60 : 45;
			const panelHeight = panelOrientation === 'landscape' ? 45 : 60;
			const spacing = 8;

			const gridWidth = layout.cols * (panelWidth + spacing);
			const gridHeight = layout.rows * (panelHeight + spacing);

			const topViewStartX = (viewWidth - gridWidth) / 2;
			const topViewStartY = (svgHeight - gridHeight) / 2 + 60;

			let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;

			svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="${SVG_COLORS.background}"/>`;

			svg += `<text x="${svgWidth / 2}" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="${SVG_COLORS.title}">Solar Panel Layout</text>`;

			svg += `<text x="${svgWidth / 2}" y="55" text-anchor="middle" font-size="14" fill="${SVG_COLORS.text}">System: ${systemCapacity} kW | Panels: ${numberOfPanels} | ${roofType === 'flat' ? 'Flat' : 'Sloped'} Roof | Tilt: ${tiltAngle}°</text>`;

			svg += `<text x="${viewWidth / 2}" y="90" text-anchor="middle" font-size="16" font-weight="bold" fill="${SVG_COLORS.title}">Top View</text>`;
			svg += `<text x="${viewWidth + viewWidth / 2}" y="90" text-anchor="middle" font-size="16" font-weight="bold" fill="${SVG_COLORS.title}">Side View</text>`;

			svg += `<line x1="${viewWidth}" y1="100" x2="${viewWidth}" y2="${svgHeight - 50}" stroke="${SVG_COLORS.divider}" stroke-width="2" stroke-dasharray="5,5"/>`;

			// TOP VIEW - Draw panels
			let panelCount = 0;
			for (let row = 0; row < layout.rows; row++) {
				for (let col = 0; col < layout.cols; col++) {
					if (panelCount >= numberOfPanels) break;

					const x = topViewStartX + col * (panelWidth + spacing);
					const y = topViewStartY + row * (panelHeight + spacing);

					svg += `<rect x="${x}" y="${y}" width="${panelWidth}" height="${panelHeight}" fill="${SVG_COLORS.panel}" stroke="${SVG_COLORS.panelBorder}" stroke-width="1.5" rx="2"/>`;

					const cellRows = 3;
					const cellCols = 4;
					for (let i = 1; i < cellRows; i++) {
						const lineY = y + (panelHeight / cellRows) * i;
						svg += `<line x1="${x}" y1="${lineY}" x2="${x + panelWidth}" y2="${lineY}" stroke="${SVG_COLORS.panelBorder}" stroke-width="0.5"/>`;
					}
					for (let i = 1; i < cellCols; i++) {
						const lineX = x + (panelWidth / cellCols) * i;
						svg += `<line x1="${lineX}" y1="${y}" x2="${lineX}" y2="${y + panelHeight}" stroke="${SVG_COLORS.panelBorder}" stroke-width="0.5"/>`;
					}

					panelCount++;
				}
			}

			// TOP VIEW - North arrow
			const arrowX = topViewStartX + gridWidth + 30;
			const arrowY = topViewStartY + 40;
			svg += `<text x="${arrowX}" y="${arrowY - 20}" text-anchor="middle" font-size="12" font-weight="bold" fill="${SVG_COLORS.annotation}">N</text>`;
			svg += `<line x1="${arrowX}" y1="${arrowY}" x2="${arrowX}" y2="${arrowY - 15}" stroke="${SVG_COLORS.annotation}" stroke-width="2" marker-end="url(#arrowhead)"/>`;
			svg += `<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto"><polygon points="0 0, 5 3, 0 6" fill="${SVG_COLORS.annotation}"/></marker></defs>`;

			// SIDE VIEW - Draw tilted panels
			const sideViewCenterX = viewWidth + viewWidth / 2;
			const sideViewCenterY = svgHeight / 2 + 20;

			const sidePanelLength = panelOrientation === 'landscape' ? 60 : 45;
			const sidePanelThickness = 8;

			const tiltRad = (tiltAngle * Math.PI) / 180;

			const numPanelsToShow = Math.min(layout.cols, 5);
			const panelSpacingSide = 15;

			for (let i = 0; i < numPanelsToShow; i++) {
				const baseX =
					sideViewCenterX -
					(numPanelsToShow * (sidePanelLength * Math.cos(tiltRad) + panelSpacingSide)) / 2 +
					i * (sidePanelLength * Math.cos(tiltRad) + panelSpacingSide);
				const baseY = sideViewCenterY;

				const x1 = baseX;
				const y1 = baseY;
				const x2 = baseX + sidePanelLength * Math.cos(tiltRad);
				const y2 = baseY - sidePanelLength * Math.sin(tiltRad);
				const x3 = x2 + sidePanelThickness * Math.sin(tiltRad);
				const y3 = y2 + sidePanelThickness * Math.cos(tiltRad);
				const x4 = x1 + sidePanelThickness * Math.sin(tiltRad);
				const y4 = y1 + sidePanelThickness * Math.cos(tiltRad);

				svg += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}" fill="${SVG_COLORS.panel}" stroke="${SVG_COLORS.panelBorder}" stroke-width="1.5"/>`;

				svg += `<line x1="${x1}" y1="${y1}" x2="${x1}" y2="${baseY + 30}" stroke="${SVG_COLORS.support}" stroke-width="2"/>`;
			}

			// Ground line
			const groundY = sideViewCenterY + 30;
			svg += `<line x1="${sideViewCenterX - 200}" y1="${groundY}" x2="${sideViewCenterX + 200}" y2="${groundY}" stroke="${SVG_COLORS.text}" stroke-width="3"/>`;

			// Tilt angle annotation
			const annotationX = sideViewCenterX - 150;
			const annotationY = sideViewCenterY;
			svg += `<text x="${annotationX}" y="${annotationY - 60}" font-size="12" fill="${SVG_COLORS.annotation}" font-weight="bold">Tilt: ${tiltAngle}°</text>`;

			const arcRadius = 40;
			const arcStartX = annotationX + arcRadius;
			const arcStartY = annotationY;
			const arcEndX = annotationX + arcRadius * Math.cos(tiltRad);
			const arcEndY = annotationY - arcRadius * Math.sin(tiltRad);
			svg += `<path d="M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 0 1 ${arcEndX} ${arcEndY}" stroke="${SVG_COLORS.annotation}" stroke-width="2" fill="none"/>`;
			svg += `<line x1="${annotationX}" y1="${annotationY}" x2="${arcStartX}" y2="${arcStartY}" stroke="${SVG_COLORS.annotation}" stroke-width="1.5"/>`;
			svg += `<line x1="${annotationX}" y1="${annotationY}" x2="${arcEndX}" y2="${arcEndY}" stroke="${SVG_COLORS.annotation}" stroke-width="1.5"/>`;

			// Legend
			const legendY = svgHeight - 40;
			svg += `<text x="20" y="${legendY}" font-size="11" fill="${SVG_COLORS.textMuted}">Legend:</text>`;
			svg += `<rect x="70" y="${legendY - 10}" width="15" height="12" fill="${SVG_COLORS.panel}" stroke="${SVG_COLORS.panelBorder}"/>`;
			svg += `<text x="90" y="${legendY}" font-size="10" fill="${SVG_COLORS.textMuted}">Solar Panel</text>`;

			// Footer
			svg += `<text x="${svgWidth / 2}" y="${svgHeight - 10}" text-anchor="middle" font-size="9" fill="${SVG_COLORS.footer}">Generated on Solarvipani.com</text>`;

			svg += '</svg>';

			svgContent = svg;
			drawingGenerated = true;
		} catch (error) {
			console.error('Error generating drawing:', error);
			toast.error('Failed to generate drawing. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	async function downloadPNG() {
		isDownloading = true;

		try {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = svgContent;
			document.body.appendChild(tempDiv);
			const svgElement = tempDiv.querySelector('svg');

			if (!svgElement) {
				throw new Error('SVG element not found');
			}

			const viewBox = svgElement.getAttribute('viewBox');
			let svgWidth = 1200;
			let svgHeight = 600;
			if (viewBox) {
				const viewBoxValues = viewBox.split(' ');
				svgWidth = parseInt(viewBoxValues[2]) || 1200;
				svgHeight = parseInt(viewBoxValues[3]) || 600;
			}

			const scaleFactor = 4;

			const svgData = new XMLSerializer().serializeToString(svgElement);
			const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(svgBlob);

			const img = new Image();
			const canvas = document.createElement('canvas');
			canvas.width = svgWidth * scaleFactor;
			canvas.height = svgHeight * scaleFactor;
			const ctx = canvas.getContext('2d');

			await new Promise((resolve, reject) => {
				img.onload = () => {
					ctx!.scale(scaleFactor, scaleFactor);
					ctx!.drawImage(img, 0, 0);
					resolve(undefined);
				};
				img.onerror = (error) => {
					console.error('Image load error:', error);
					reject(new Error('Failed to load SVG as image'));
				};
				img.src = url;
			});

			const pngBlob = await new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, 'image/png', 1.0)
			);

			if (!pngBlob) {
				throw new Error('Failed to generate PNG blob');
			}

			const customerName = proposalData.customer_name || 'customer';
			const filename = `solar_layout_${customerName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.png`;

			const downloadUrl = URL.createObjectURL(pngBlob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			URL.revokeObjectURL(url);
			URL.revokeObjectURL(downloadUrl);
			document.body.removeChild(tempDiv);
		} catch (error) {
			console.error('Error generating PNG:', error);
			toast.error('Failed to generate PNG. Please try again.');
		} finally {
			isDownloading = false;
		}
	}

	function resetDrawing() {
		drawingGenerated = false;
		svgContent = '';
	}
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="sm:max-w-[1000px] max-h-[95vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="text-accent">Create Solar System Drawing</Dialog.Title>
		</Dialog.Header>

		{#if !drawingGenerated}
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-accent mb-2">Drawing Parameters</h3>
					<p class="text-muted-foreground text-sm">
						Provide basic information to generate the layout diagram
					</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<!-- Roof Type -->
					<div class="space-y-2">
						<Label for="roofType">Roof Type</Label>
						<div class="border border-input rounded-md">
							<button class="w-full px-3 py-2 text-sm text-left" onclick={() => (roofType = roofType === 'flat' ? 'sloped' : 'flat')}>
								{roofType === 'flat' ? 'Flat Roof' : 'Sloped Roof'}
							</button>
						</div>
					</div>

					<!-- Panel Orientation -->
					<div class="space-y-2">
						<Label for="panelOrientation">Panel Orientation</Label>
						<div class="border border-input rounded-md">
							<button class="w-full px-3 py-2 text-sm text-left" onclick={() => (panelOrientation = panelOrientation === 'landscape' ? 'portrait' : 'landscape')}>
								{panelOrientation === 'landscape' ? 'Landscape' : 'Portrait'}
							</button>
						</div>
					</div>

					<!-- Tilt Angle -->
					<div class="space-y-2">
						<Label for="tiltAngle">Panel Tilt Angle (degrees)</Label>
						<Input type="number" id="tiltAngle" bind:value={tiltAngle} min="0" max="90" />
					</div>
				</div>

				<div class="bg-accent-muted border-l-4 border-accent p-4 rounded text-sm leading-relaxed">
					<strong>System Info:</strong><br />
					Capacity: {proposalData.system_capacity_kw || 'N/A'} kW<br />
					Panels: {proposalData.number_of_panels || 'N/A'}<br />
					Customer: {proposalData.customer_name || 'N/A'}
				</div>

				<Dialog.Footer class="max-sm:flex-col">
					<Button variant="secondary" onclick={close} class="max-sm:w-full">Cancel</Button>
					<Button onclick={generateDrawing} disabled={isGenerating} class="max-sm:w-full">
						{isGenerating ? 'Generating...' : 'Generate Drawing'}
					</Button>
				</Dialog.Footer>
			</div>
		{:else}
			<div class="space-y-6">
				<h3 class="text-lg font-semibold text-accent">Preview</h3>

				<div
					class="border-2 border-border rounded-lg p-4 bg-card flex justify-center items-center overflow-hidden [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-full"
				>
					{@html svgContent}
				</div>

				<Dialog.Footer class="max-sm:flex-col">
					<Button variant="secondary" onclick={resetDrawing} class="max-sm:w-full"
						>Edit Parameters</Button
					>
					<Button
						variant="default"
						class="max-sm:w-full"
						onclick={downloadPNG}
						disabled={isDownloading}
					>
						{isDownloading ? 'Downloading...' : 'Download PNG'}
					</Button>
				</Dialog.Footer>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
