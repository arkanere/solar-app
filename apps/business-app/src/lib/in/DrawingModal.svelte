<script>
	import { createEventDispatcher } from 'svelte';

	export let show = false;
	export let proposalData = {};

	const dispatch = createEventDispatcher();

	// Form inputs
	let roofType = 'flat';
	let panelOrientation = 'landscape';
	let tiltAngle = 45; // degrees

	// Drawing state
	let drawingGenerated = false;
	let svgContent = '';
	let isGenerating = false;
	let isDownloading = false;

	// Calculate panel arrangement
	function calculateLayout(numberOfPanels) {
		// Find best rows x columns arrangement
		const sqrt = Math.sqrt(numberOfPanels);
		let rows = Math.floor(sqrt);
		let cols = Math.ceil(numberOfPanels / rows);

		// Adjust for better fit
		while (rows * cols < numberOfPanels) {
			cols++;
		}

		return { rows, cols };
	}

	// Generate SVG drawing
	function generateDrawing() {
		isGenerating = true;

		try {
			const numberOfPanels = proposalData.number_of_panels || 15;
			const systemCapacity = proposalData.system_capacity_kw || '5';
			const layout = calculateLayout(numberOfPanels);

			// SVG dimensions - wider to accommodate both views
			const svgWidth = 1200;
			const svgHeight = 600;
			const viewWidth = svgWidth / 2; // 600px for each view

			// Panel dimensions (larger for better visibility)
			const panelWidth = panelOrientation === 'landscape' ? 60 : 45;
			const panelHeight = panelOrientation === 'landscape' ? 45 : 60;
			const spacing = 8;

			// Calculate total grid size
			const gridWidth = layout.cols * (panelWidth + spacing);
			const gridHeight = layout.rows * (panelHeight + spacing);

			// Position top view in left half
			const topViewStartX = (viewWidth - gridWidth) / 2;
			const topViewStartY = (svgHeight - gridHeight) / 2 + 60;

			let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;

			// Background
			svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="#f8f9fa"/>`;

			// Title
			svg += `<text x="${svgWidth/2}" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#0056b3">Solar Panel Layout</text>`;

			// System info
			svg += `<text x="${svgWidth/2}" y="55" text-anchor="middle" font-size="14" fill="#333">System: ${systemCapacity} kW | Panels: ${numberOfPanels} | ${roofType === 'flat' ? 'Flat' : 'Sloped'} Roof | Tilt: ${tiltAngle}°</text>`;

			// View labels
			svg += `<text x="${viewWidth/2}" y="90" text-anchor="middle" font-size="16" font-weight="bold" fill="#0056b3">Top View</text>`;
			svg += `<text x="${viewWidth + viewWidth/2}" y="90" text-anchor="middle" font-size="16" font-weight="bold" fill="#0056b3">Side View</text>`;

			// Divider line between views
			svg += `<line x1="${viewWidth}" y1="100" x2="${viewWidth}" y2="${svgHeight - 50}" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>`;

			// TOP VIEW - Draw panels
			let panelCount = 0;
			for (let row = 0; row < layout.rows; row++) {
				for (let col = 0; col < layout.cols; col++) {
					if (panelCount >= numberOfPanels) break;

					const x = topViewStartX + col * (panelWidth + spacing);
					const y = topViewStartY + row * (panelHeight + spacing);

					// Panel rectangle
					svg += `<rect x="${x}" y="${y}" width="${panelWidth}" height="${panelHeight}" fill="#2c3e50" stroke="#34495e" stroke-width="1.5" rx="2"/>`;

					// Panel grid lines (to show solar cells)
					const cellRows = 3;
					const cellCols = 4;
					for (let i = 1; i < cellRows; i++) {
						const lineY = y + (panelHeight / cellRows) * i;
						svg += `<line x1="${x}" y1="${lineY}" x2="${x + panelWidth}" y2="${lineY}" stroke="#34495e" stroke-width="0.5"/>`;
					}
					for (let i = 1; i < cellCols; i++) {
						const lineX = x + (panelWidth / cellCols) * i;
						svg += `<line x1="${lineX}" y1="${y}" x2="${lineX}" y2="${y + panelHeight}" stroke="#34495e" stroke-width="0.5"/>`;
					}

					panelCount++;
				}
			}

			// TOP VIEW - North arrow (pointing upward)
			const arrowX = topViewStartX + gridWidth + 30;
			const arrowY = topViewStartY + 40;
			svg += `<text x="${arrowX}" y="${arrowY - 20}" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc3545">N</text>`;
			svg += `<line x1="${arrowX}" y1="${arrowY}" x2="${arrowX}" y2="${arrowY - 15}" stroke="#dc3545" stroke-width="2" marker-end="url(#arrowhead)"/>`;
			svg += `<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto"><polygon points="0 0, 5 3, 0 6" fill="#dc3545"/></marker></defs>`;

			// SIDE VIEW - Draw tilted panels
			const sideViewCenterX = viewWidth + viewWidth / 2;
			const sideViewCenterY = svgHeight / 2 + 20;

			// Panel dimensions for side view
			const sidePanelLength = panelOrientation === 'landscape' ? 60 : 45;
			const sidePanelThickness = 8;

			// Calculate tilt in radians
			const tiltRad = (tiltAngle * Math.PI) / 180;

			// Draw a row of panels from side view
			const numPanelsToShow = Math.min(layout.cols, 5); // Show max 5 panels in side view
			const panelSpacingSide = 15;

			for (let i = 0; i < numPanelsToShow; i++) {
				const baseX = sideViewCenterX - (numPanelsToShow * (sidePanelLength * Math.cos(tiltRad) + panelSpacingSide)) / 2 + i * (sidePanelLength * Math.cos(tiltRad) + panelSpacingSide);
				const baseY = sideViewCenterY;

				// Calculate panel corners for tilted rectangle
				const x1 = baseX;
				const y1 = baseY;
				const x2 = baseX + sidePanelLength * Math.cos(tiltRad);
				const y2 = baseY - sidePanelLength * Math.sin(tiltRad);
				const x3 = x2 + sidePanelThickness * Math.sin(tiltRad);
				const y3 = y2 + sidePanelThickness * Math.cos(tiltRad);
				const x4 = x1 + sidePanelThickness * Math.sin(tiltRad);
				const y4 = y1 + sidePanelThickness * Math.cos(tiltRad);

				// Draw tilted panel as polygon
				svg += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}" fill="#2c3e50" stroke="#34495e" stroke-width="1.5"/>`;

				// Add support line
				svg += `<line x1="${x1}" y1="${y1}" x2="${x1}" y2="${baseY + 30}" stroke="#6c757d" stroke-width="2"/>`;
			}

			// Ground line for side view
			const groundY = sideViewCenterY + 30;
			svg += `<line x1="${sideViewCenterX - 200}" y1="${groundY}" x2="${sideViewCenterX + 200}" y2="${groundY}" stroke="#333" stroke-width="3"/>`;

			// Tilt angle annotation
			const annotationX = sideViewCenterX - 150;
			const annotationY = sideViewCenterY;
			svg += `<text x="${annotationX}" y="${annotationY - 60}" font-size="12" fill="#dc3545" font-weight="bold">Tilt: ${tiltAngle}°</text>`;

			// Draw angle arc
			const arcRadius = 40;
			const arcStartX = annotationX + arcRadius;
			const arcStartY = annotationY;
			const arcEndX = annotationX + arcRadius * Math.cos(tiltRad);
			const arcEndY = annotationY - arcRadius * Math.sin(tiltRad);
			svg += `<path d="M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 0 1 ${arcEndX} ${arcEndY}" stroke="#dc3545" stroke-width="2" fill="none"/>`;
			svg += `<line x1="${annotationX}" y1="${annotationY}" x2="${arcStartX}" y2="${arcStartY}" stroke="#dc3545" stroke-width="1.5"/>`;
			svg += `<line x1="${annotationX}" y1="${annotationY}" x2="${arcEndX}" y2="${arcEndY}" stroke="#dc3545" stroke-width="1.5"/>`;

			// Legend
			const legendY = svgHeight - 40;
			svg += `<text x="20" y="${legendY}" font-size="11" fill="#666">Legend:</text>`;
			svg += `<rect x="70" y="${legendY - 10}" width="15" height="12" fill="#2c3e50" stroke="#34495e"/>`;
			svg += `<text x="90" y="${legendY}" font-size="10" fill="#666">Solar Panel</text>`;

			// Footer
			svg += `<text x="${svgWidth/2}" y="${svgHeight - 10}" text-anchor="middle" font-size="9" fill="#999">Generated on Solarvipani.com</text>`;

			svg += '</svg>';

			svgContent = svg;
			drawingGenerated = true;
		} catch (error) {
			console.error('Error generating drawing:', error);
			alert('Failed to generate drawing. Please try again.');
		} finally {
			isGenerating = false;
		}
	}

	// Download as PNG
	async function downloadPNG() {
		isDownloading = true;

		try {
			// Create temporary div to hold SVG
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = svgContent;
			document.body.appendChild(tempDiv);
			const svgElement = tempDiv.querySelector('svg');

			if (!svgElement) {
				throw new Error('SVG element not found');
			}

			// Get SVG dimensions from viewBox
			const viewBox = svgElement.getAttribute('viewBox');
			let svgWidth = 1200;
			let svgHeight = 600;
			if (viewBox) {
				const viewBoxValues = viewBox.split(' ');
				svgWidth = parseInt(viewBoxValues[2]) || 1200;
				svgHeight = parseInt(viewBoxValues[3]) || 600;
			}

			// Use 4x scale factor for high-quality output (suitable for print)
			const scaleFactor = 4;

			// Convert SVG to data URL
			const svgData = new XMLSerializer().serializeToString(svgElement);
			const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(svgBlob);

			// Create image and canvas with higher resolution
			const img = new Image();
			const canvas = document.createElement('canvas');
			canvas.width = svgWidth * scaleFactor;
			canvas.height = svgHeight * scaleFactor;
			const ctx = canvas.getContext('2d');

			// Load and draw image at higher resolution
			await new Promise((resolve, reject) => {
				img.onload = () => {
					// Scale the context to draw at higher resolution
					ctx.scale(scaleFactor, scaleFactor);
					ctx.drawImage(img, 0, 0);
					resolve();
				};
				img.onerror = (error) => {
					console.error('Image load error:', error);
					reject(new Error('Failed to load SVG as image'));
				};
				img.src = url;
			});

			// Convert canvas to PNG blob with high quality
			const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));

			// Generate filename
			const customerName = proposalData.customer_name || 'customer';
			const filename = `solar_layout_${customerName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.png`;

			// Download
			const downloadUrl = URL.createObjectURL(pngBlob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Cleanup
			URL.revokeObjectURL(url);
			URL.revokeObjectURL(downloadUrl);
			document.body.removeChild(tempDiv);
		} catch (error) {
			console.error('Error generating PNG:', error);
			alert('Failed to generate PNG. Please try again.');
		} finally {
			isDownloading = false;
		}
	}

	// Close modal
	function closeModal() {
		drawingGenerated = false;
		svgContent = '';
		dispatch('close');
	}

	// Reset drawing
	function resetDrawing() {
		drawingGenerated = false;
		svgContent = '';
	}
</script>

{#if show}
	<div class="modal-overlay" on:click={(e) => e.target === e.currentTarget && closeModal()}>
		<div class="modal-content">
			<div class="modal-header">
				<h2>Create Solar System Drawing</h2>
				<button class="close-btn" on:click={closeModal}>&times;</button>
			</div>

			<div class="modal-body">
				{#if !drawingGenerated}
					<!-- Input Form -->
					<div class="form-section">
						<h3>Drawing Parameters</h3>
						<p class="form-hint">Provide basic information to generate the layout diagram</p>

						<div class="form-grid">
							<div class="form-group">
								<label for="roofType">Roof Type</label>
								<select id="roofType" bind:value={roofType}>
									<option value="flat">Flat Roof</option>
									<option value="sloped">Sloped Roof</option>
								</select>
							</div>

							<div class="form-group">
								<label for="panelOrientation">Panel Orientation</label>
								<select id="panelOrientation" bind:value={panelOrientation}>
									<option value="landscape">Landscape</option>
									<option value="portrait">Portrait</option>
								</select>
							</div>

							<div class="form-group">
								<label for="tiltAngle">Panel Tilt Angle (degrees)</label>
								<input type="number" id="tiltAngle" bind:value={tiltAngle} min="0" max="90" />
							</div>
						</div>

						<div class="info-box">
							<strong>System Info:</strong><br>
							Capacity: {proposalData.system_capacity_kw || 'N/A'} kW<br>
							Panels: {proposalData.number_of_panels || 'N/A'}<br>
							Customer: {proposalData.customer_name || 'N/A'}
						</div>

						<div class="action-buttons">
							<button class="btn btn-secondary" on:click={closeModal}>Cancel</button>
							<button class="btn btn-primary" on:click={generateDrawing} disabled={isGenerating}>
								{isGenerating ? 'Generating...' : 'Generate Drawing'}
							</button>
						</div>
					</div>
				{:else}
					<!-- Drawing Preview -->
					<div class="preview-section">
						<h3>Preview</h3>
						<div class="svg-preview">
							{@html svgContent}
						</div>

						<div class="action-buttons">
							<button class="btn btn-secondary" on:click={resetDrawing}>Edit Parameters</button>
							<button class="btn btn-success" on:click={downloadPNG} disabled={isDownloading}>
								{isDownloading ? 'Downloading...' : 'Download PNG'}
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 3000;
		padding: 1rem;
		overflow-y: auto;
	}

	.modal-content {
		background: white;
		border-radius: 8px;
		width: 100%;
		max-width: 900px;
		max-height: 95vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.modal-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #0056b3;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #666;
		line-height: 1;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		color: #333;
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.form-section h3,
	.preview-section h3 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		color: #0056b3;
	}

	.form-hint {
		color: #666;
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group label {
		font-weight: 500;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		color: #333;
	}

	.form-group input,
	.form-group select {
		padding: 0.65rem;
		border: 1px solid #ddd;
		border-radius: 5px;
		font-size: 0.95rem;
		font-family: inherit;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #0056b3;
	}

	.info-box {
		background: #e7f3ff;
		border-left: 4px solid #0056b3;
		padding: 1rem;
		margin-bottom: 1.5rem;
		border-radius: 4px;
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.svg-preview {
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		padding: 1rem;
		background: white;
		margin-bottom: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.svg-preview :global(svg) {
		width: 100%;
		height: auto;
		max-width: 100%;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.65rem 1.25rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 500;
		transition: background-color 0.3s ease;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #0056b3;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #00449e;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
	}

	.btn-secondary:hover {
		background: #5a6268;
	}

	.btn-success {
		background: #28a745;
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: #218838;
	}

	@media (max-width: 768px) {
		.modal-content {
			max-width: 100%;
			max-height: 100vh;
			border-radius: 0;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>
