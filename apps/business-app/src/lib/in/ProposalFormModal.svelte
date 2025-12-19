<script>
	import { createEventDispatcher } from 'svelte';
	import { jsPDF } from 'jspdf';

	export let show = false;
	export let business = {};
	export let proposal = null;

	const dispatch = createEventDispatcher();

	// Form state - initialize with proposal data if editing
	let formData = {
		// Customer Information
		customerName: proposal?.customer_name || '',
		customerAddress: proposal?.address || '',
		customerPhone: proposal?.phone_number || '',
		customerEmail: proposal?.email || '',

		// System Specifications
		systemCapacity: proposal?.system_capacity_kw || '',
		panelType: proposal?.panels_brand_model || '',
		numberOfPanels: proposal?.number_of_panels || '',
		inverterType: proposal?.inverter_brand_model || '',

		// Additional Notes
		additionalNotes: proposal?.notes || ''
	};

	let isGenerating = false;
	let isSaving = false;

	// Form validation - reactive
	$: isFormValid = formData.customerName.trim() !== '' && formData.systemCapacity.trim() !== '';

	// Reset form
	function resetForm() {
		formData = {
			customerName: '',
			customerAddress: '',
			customerPhone: '',
			customerEmail: '',
			systemCapacity: '',
			panelType: '',
			numberOfPanels: '',
			inverterType: '',
			additionalNotes: ''
		};
	}

	// Close modal
	function closeModal() {
		dispatch('close');
	}

	// Save/Update proposal to database
	async function saveProposal() {
		if (!isFormValid) return;

		try {
			isSaving = true;

			const proposalData = {
				id: proposal?.id,
				customer_name: formData.customerName,
				phone_number: formData.customerPhone,
				address: formData.customerAddress,
				email: formData.customerEmail,
				system_capacity_kw: formData.systemCapacity,
				panels_brand_model: formData.panelType,
				number_of_panels: formData.numberOfPanels,
				inverter_brand_model: formData.inverterType,
				notes: formData.additionalNotes
			};

			const response = await fetch('/in/api/updateProposal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(proposalData)
			});

			const result = await response.json();

			if (result.success) {
				alert('Proposal updated successfully!');
				dispatch('generated');
				closeModal();
			} else {
				alert(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Error saving proposal:', error);
			alert('Failed to save proposal. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	// Generate PDF
	async function generatePDF() {
		try {
			isGenerating = true;

			const doc = new jsPDF();
			const pageWidth = doc.internal.pageSize.getWidth();
			const pageHeight = doc.internal.pageSize.getHeight();
			const margin = 20;
			let yPos = 20;

			// Header - Business Name
			doc.setFontSize(20);
			doc.setTextColor(0, 86, 179);
			doc.text(business?.businessname || 'Solar Panel Installation', margin, yPos);
			yPos += 10;

			// Title
			doc.setFontSize(16);
			doc.setTextColor(0, 0, 0);
			doc.text('Solar Installation Proposal', margin, yPos);
			yPos += 5;

			// Line separator
			doc.setLineWidth(0.5);
			doc.setDrawColor(0, 86, 179);
			doc.line(margin, yPos, pageWidth - margin, yPos);
			yPos += 10;

			// Date
			doc.setFontSize(10);
			doc.setTextColor(100, 100, 100);
			const today = new Date().toLocaleDateString('en-IN', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
			doc.text(`Date: ${today}`, margin, yPos);
			yPos += 15;

			// Customer Information Section
			doc.setFontSize(14);
			doc.setTextColor(0, 86, 179);
			doc.text('Customer Information', margin, yPos);
			yPos += 8;

			doc.setFontSize(11);
			doc.setTextColor(0, 0, 0);

			if (formData.customerName) {
				doc.text(`Name: ${formData.customerName}`, margin + 5, yPos);
				yPos += 7;
			}

			if (formData.customerAddress) {
				const addressLines = doc.splitTextToSize(
					`Address: ${formData.customerAddress}`,
					pageWidth - margin * 2 - 10
				);
				doc.text(addressLines, margin + 5, yPos);
				yPos += addressLines.length * 7;
			}

			if (formData.customerPhone) {
				doc.text(`Phone: ${formData.customerPhone}`, margin + 5, yPos);
				yPos += 7;
			}

			if (formData.customerEmail) {
				doc.text(`Email: ${formData.customerEmail}`, margin + 5, yPos);
				yPos += 7;
			}

			yPos += 5;

			// System Specifications Section
			doc.setFontSize(14);
			doc.setTextColor(0, 86, 179);
			doc.text('System Specifications', margin, yPos);
			yPos += 8;

			doc.setFontSize(11);
			doc.setTextColor(0, 0, 0);

			if (formData.systemCapacity) {
				doc.text(`System Capacity: ${formData.systemCapacity} kW`, margin + 5, yPos);
				yPos += 7;
			}

			if (formData.panelType) {
				doc.text(`Panel Type: ${formData.panelType}`, margin + 5, yPos);
				yPos += 7;
			}

			if (formData.numberOfPanels) {
				doc.text(`Number of Panels: ${formData.numberOfPanels}`, margin + 5, yPos);
				yPos += 7;
			}

			if (formData.inverterType) {
				doc.text(`Inverter Type: ${formData.inverterType}`, margin + 5, yPos);
				yPos += 7;
			}

			yPos += 5;

			// Additional Notes Section
			if (formData.additionalNotes) {
				// Check if we need a new page
				if (yPos > pageHeight - 60) {
					doc.addPage();
					yPos = 20;
				}

				doc.setFontSize(14);
				doc.setTextColor(0, 86, 179);
				doc.text('Additional Notes', margin, yPos);
				yPos += 8;

				doc.setFontSize(11);
				doc.setTextColor(0, 0, 0);
				const notesLines = doc.splitTextToSize(
					formData.additionalNotes,
					pageWidth - margin * 2 - 10
				);
				doc.text(notesLines, margin + 5, yPos);
				yPos += notesLines.length * 7;
			}

			// Footer
			const footerY = pageHeight - 20;
			doc.setFontSize(9);
			doc.setTextColor(100, 100, 100);
			doc.text('Generated by Solar Vipani', pageWidth / 2, footerY, { align: 'center' });

			if (business?.phonenumber || business?.email) {
				let contactInfo = [];
				if (business?.phonenumber) contactInfo.push(`Phone: ${business.phonenumber}`);
				if (business?.email) contactInfo.push(`Email: ${business.email}`);
				doc.text(contactInfo.join(' | '), pageWidth / 2, footerY + 5, { align: 'center' });
			}

			// Generate filename
			const customerNameSlug = formData.customerName
				? formData.customerName.replace(/\s+/g, '_').toLowerCase()
				: 'customer';
			const filename = `solar_proposal_${customerNameSlug}_${Date.now()}.pdf`;

			// Save PDF
			doc.save(filename);

			isGenerating = false;

			// Dispatch success event
			dispatch('generated');

			// Reset form and close modal
			resetForm();
			closeModal();
		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Error generating PDF. Please try again.');
			isGenerating = false;
		}
	}
</script>

{#if show}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-overlay" on:click={(e) => e.target === e.currentTarget && closeModal()}>
		<div class="modal-content">
			<div class="modal-header">
				<h2>{proposal ? 'Update Proposal' : 'Create Proposal'}</h2>
				<button class="close-btn" on:click={closeModal}>&times;</button>
			</div>

			<div class="modal-body">
				<form on:submit|preventDefault={generatePDF}>
					<!-- Customer Information Section -->
					<section class="form-section">
						<h3>Customer Information</h3>
						<div class="form-grid">
							<div class="form-group full-width">
								<label for="customerName">Customer Name *</label>
								<input
									type="text"
									id="customerName"
									bind:value={formData.customerName}
									placeholder="Enter customer name"
									required
								/>
							</div>

							<div class="form-group full-width">
								<label for="customerPhone">Phone Number</label>
								<input
									type="tel"
									id="customerPhone"
									bind:value={formData.customerPhone}
									placeholder="Enter phone number"
								/>
							</div>

							<div class="form-group full-width">
								<label for="customerAddress">Address</label>
								<input
									type="text"
									id="customerAddress"
									bind:value={formData.customerAddress}
									placeholder="Enter customer address"
								/>
							</div>

							<div class="form-group full-width">
								<label for="customerEmail">Email</label>
								<input
									type="email"
									id="customerEmail"
									bind:value={formData.customerEmail}
									placeholder="Enter email address"
								/>
							</div>
						</div>
					</section>

					<!-- System Specifications Section -->
					<section class="form-section">
						<h3>System Specifications</h3>
						<div class="form-grid">
							<div class="form-group full-width">
								<label for="systemCapacity">System Capacity (kW) *</label>
								<input
									type="text"
									id="systemCapacity"
									bind:value={formData.systemCapacity}
									placeholder="e.g., 5 kW"
									required
								/>
							</div>

							<div class="form-group full-width">
								<label for="panelType">Panels</label>
								<input
									type="text"
									id="panelType"
									bind:value={formData.panelType}
									placeholder="Brand and Model"
								/>
							</div>

							<div class="form-group full-width">
								<label for="numberOfPanels">Number of Panels</label>
								<input
									type="text"
									id="numberOfPanels"
									bind:value={formData.numberOfPanels}
									placeholder="e.g., 15"
								/>
							</div>

							<div class="form-group full-width">
								<label for="inverterType">Inverter</label>
								<input
									type="text"
									id="inverterType"
									bind:value={formData.inverterType}
									placeholder="Brand and Model"
								/>
							</div>
						</div>
					</section>

					<!-- Additional Notes Section -->
					<section class="form-section">
						<h3>Additional Notes</h3>
						<div class="form-group">
							<label for="additionalNotes">Notes</label>
							<textarea
								id="additionalNotes"
								bind:value={formData.additionalNotes}
								placeholder="Enter any additional information, terms, or special requirements..."
								rows="4"
							></textarea>
						</div>
					</section>

					<!-- Action Buttons -->
					<div class="action-buttons">
						<button type="button" class="btn btn-secondary" on:click={resetForm}>
							Reset Form
						</button>
						<button
							type="button"
							class="btn btn-success"
							on:click={saveProposal}
							disabled={!isFormValid || isSaving}
						>
							{isSaving ? 'Saving...' : 'Update Proposal'}
						</button>
						<button type="submit" class="btn btn-primary" disabled={!isFormValid || isGenerating}>
							{isGenerating ? 'Generating PDF...' : 'Generate PDF'}
						</button>
					</div>
				</form>
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
		z-index: 2000;
		padding: 1rem;
		overflow-y: auto;
	}

	.modal-content {
		background: white;
		border-radius: 8px;
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
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

	.form-section {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.form-section:last-of-type {
		border-bottom: none;
	}

	.form-section h3 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: #0056b3;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-weight: 500;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		color: #333;
	}

	.form-group input,
	.form-group textarea {
		padding: 0.65rem;
		border: 1px solid #ddd;
		border-radius: 5px;
		font-size: 0.95rem;
		font-family: inherit;
		transition: border-color 0.3s ease;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #0056b3;
	}

	.form-group textarea {
		resize: vertical;
		min-height: 80px;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1.5rem;
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
			gap: 0.5rem;
		}

		.btn {
			width: 100%;
		}
	}
</style>
