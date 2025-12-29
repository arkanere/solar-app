<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { jsPDF } from 'jspdf';
	import DrawingModal from './DrawingModal.svelte';

	let {
		show = $bindable(false),
		business = {},
		proposal = null,
		onClose = () => {},
		onGenerated = () => {}
	} = $props();

	// Drawing modal state
	let showDrawingModal = $state(false);

	// Form state - initialize with proposal data if editing
	let formData = $state({
		// Customer Information
		customerName: '',
		customerAddress: '',
		customerPhone: '',
		customerEmail: '',

		// System Specifications
		systemCapacity: '',
		panelType: '',
		numberOfPanels: '',
		inverterType: '',

		// Additional Notes
		additionalNotes: ''
	});

	let previousProposal = $state(null);

	// Update form data when proposal changes (only when it's a different proposal)
	$effect(() => {
		if (proposal && proposal !== previousProposal) {
			previousProposal = proposal;
			formData = {
				customerName: proposal.customer_name || '',
				customerAddress: proposal.address || '',
				customerPhone: proposal.phone_number || '',
				customerEmail: proposal.email || '',
				systemCapacity: proposal.system_capacity_kw || '',
				panelType: proposal.panels_brand_model || '',
				numberOfPanels: proposal.number_of_panels || '',
				inverterType: proposal.inverter_brand_model || '',
				additionalNotes: proposal.notes || ''
			};
		}
	});

	let isGenerating = $state(false);
	let isSaving = $state(false);

	// Form validation - reactive
	let isFormValid = $derived(formData.customerName.trim() !== '' && formData.systemCapacity.trim() !== '');

	function handleOpenChange(open) {
		if (!open) {
			onClose();
		}
	}

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
		onClose();
	}

	// Open drawing modal
	function openDrawingModal() {
		showDrawingModal = true;
	}

	// Close drawing modal
	function closeDrawingModal() {
		showDrawingModal = false;
	}

	// Save/Update proposal to database
	async function saveProposal() {
		if (!isFormValid) return;

		try {
			isSaving = true;

			const proposalData = {
				id: proposal?.id,
				lead_id: proposal?.lead_id,
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

			const response = await fetch('/in/api/saveProposal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(proposalData)
			});

			const result = await response.json();

			if (result.success) {
				toast.success(proposal?.id ? 'Proposal updated successfully!' : 'Proposal created successfully!');
				onGenerated();
				closeModal();
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Error saving proposal:', error);
			toast.error('Failed to save proposal. Please try again.');
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

			// Notify success
			onGenerated();

			// Reset form and close modal
			resetForm();
			closeModal();
		} catch (error) {
			console.error('Error generating PDF:', error);
			toast.error('Error generating PDF. Please try again.');
			isGenerating = false;
		}
	}
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[800px] max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="text-accent">{proposal ? 'Update Proposal' : 'Create Proposal'}</Dialog.Title>
		</Dialog.Header>

		<form onsubmit={(e) => { e.preventDefault(); generatePDF(); }}>
			<!-- Customer Information Section -->
			<section class="mb-6 pb-6 border-b border-border">
				<h3 class="text-lg font-semibold mb-4 text-accent">Customer Information</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="flex flex-col sm:col-span-2">
						<Label for="customerName" class="mb-2">Customer Name <span class="text-destructive">*</span></Label>
						<Input
							type="text"
							id="customerName"
							bind:value={formData.customerName}
							placeholder="Enter customer name"
							required
						/>
					</div>

					<div class="flex flex-col sm:col-span-2">
						<Label for="customerPhone" class="mb-2">Phone Number</Label>
						<Input
							type="tel"
							id="customerPhone"
							bind:value={formData.customerPhone}
							placeholder="Enter phone number"
						/>
					</div>

					<div class="flex flex-col sm:col-span-2">
						<Label for="customerAddress" class="mb-2">Address</Label>
						<Input
							type="text"
							id="customerAddress"
							bind:value={formData.customerAddress}
							placeholder="Enter customer address"
						/>
					</div>

					<div class="flex flex-col sm:col-span-2">
						<Label for="customerEmail" class="mb-2">Email</Label>
						<Input
							type="email"
							id="customerEmail"
							bind:value={formData.customerEmail}
							placeholder="Enter email address"
						/>
					</div>
				</div>
			</section>

			<!-- System Specifications Section -->
			<section class="mb-6 pb-6 border-b border-border">
				<h3 class="text-lg font-semibold mb-4 text-accent">System Specifications</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="flex flex-col sm:col-span-2">
						<Label for="systemCapacity" class="mb-2">System Capacity (kW) <span class="text-destructive">*</span></Label>
						<Input
							type="text"
							id="systemCapacity"
							bind:value={formData.systemCapacity}
							placeholder="e.g., 5 kW"
							required
						/>
					</div>

					<div class="flex flex-col sm:col-span-2">
						<Label for="panelType" class="mb-2">Panels</Label>
						<Input
							type="text"
							id="panelType"
							bind:value={formData.panelType}
							placeholder="Brand and Model"
						/>
					</div>

					<div class="flex flex-col sm:col-span-2">
						<Label for="numberOfPanels" class="mb-2">Number of Panels</Label>
						<Input
							type="text"
							id="numberOfPanels"
							bind:value={formData.numberOfPanels}
							placeholder="e.g., 15"
						/>
					</div>

					<div class="flex flex-col sm:col-span-2">
						<Label for="inverterType" class="mb-2">Inverter</Label>
						<Input
							type="text"
							id="inverterType"
							bind:value={formData.inverterType}
							placeholder="Brand and Model"
						/>
					</div>
				</div>
			</section>

			<!-- Additional Notes Section -->
			<section class="mb-6">
				<h3 class="text-lg font-semibold mb-4 text-accent">Additional Notes</h3>
				<div class="flex flex-col">
					<Label for="additionalNotes" class="mb-2">Notes</Label>
					<Textarea
						id="additionalNotes"
						bind:value={formData.additionalNotes}
						placeholder="Enter any additional information, terms, or special requirements..."
						rows={4}
					/>
				</div>
			</section>

			<!-- Action Buttons -->
			<Dialog.Footer class="max-sm:flex-col gap-2">
				<Button type="button" variant="secondary" onclick={resetForm} class="max-sm:w-full">
					Reset Form
				</Button>
				<Button
					type="button"
					variant="outline"
					onclick={openDrawingModal}
					disabled={!isFormValid}
					class="max-sm:w-full"
				>
					Create Drawing
				</Button>
				<Button
					type="button"
					class="bg-success text-success-foreground hover:bg-success/90 max-sm:w-full"
					onclick={saveProposal}
					disabled={!isFormValid || isSaving}
				>
					{isSaving ? 'Saving...' : (proposal?.id ? 'Update Proposal' : 'Save Proposal')}
				</Button>
				<Button type="submit" disabled={!isFormValid || isGenerating} class="max-sm:w-full">
					{isGenerating ? 'Downloading PDF...' : 'Download PDF'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Drawing Modal -->
<DrawingModal
	bind:show={showDrawingModal}
	proposalData={{
		customer_name: formData.customerName,
		system_capacity_kw: formData.systemCapacity,
		number_of_panels: formData.numberOfPanels || 15
	}}
	onClose={closeDrawingModal}
/>
