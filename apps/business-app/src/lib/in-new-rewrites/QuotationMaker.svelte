<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Table,
		TableBody,
		TableHead,
		TableHeader,
		TableRow,
		TableCell
	} from '$lib/components/ui/table';
	import { toast } from 'svelte-sonner';
	import { jsPDF } from 'jspdf';
	import { Plus, Trash2, Download } from '@lucide/svelte';
	import {
		defaultLineItems,
		lineTotal,
		computeTotals,
		pmSuryaGharSubsidy,
		formatINR,
		formatRs,
		type LineItem
	} from '$lib/in-new-rewrites/quotation';

	type QuotationMakerProps = {
		business?: Record<string, any>;
	};

	let { business = {} }: QuotationMakerProps = $props();

	// Quote meta
	const today = new Date();
	const quoteNumber = `QT-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(today.getHours()).padStart(2, '0')}${String(today.getMinutes()).padStart(2, '0')}`;

	let meta = $state({
		quoteNumber,
		date: today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
		validityDays: 15,
		gstin: ''
	});

	let customer = $state({ name: '', address: '', phone: '', email: '' });

	let system = $state({ capacityKw: '', type: 'On-Grid', phase: 'Single Phase' });

	let items = $state<LineItem[]>(defaultLineItems());

	let gstRate = $state<number | string>(13.8);

	// Subsidy: auto-derived from capacity, with manual override.
	let subsidyOverride = $state<string>('');
	let autoSubsidy = $derived(pmSuryaGharSubsidy(system.capacityKw));
	let subsidy = $derived(subsidyOverride.trim() === '' ? autoSubsidy : Number(subsidyOverride) || 0);

	let terms = $state(
		'1. 70% advance along with the order, balance before commissioning.\n2. Prices are inclusive of installation and standard structure.\n3. Subsidy is subject to PM Surya Ghar approval and DISCOM net-metering.\n4. Warranty as per manufacturer terms.'
	);

	let totals = $derived(computeTotals(items, gstRate, subsidy));

	function addItem() {
		items = [...items, { description: '', qty: 1, unit: 'Nos', rate: 0 }];
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
	}

	let isGenerating = $state(false);

	let isValid = $derived(
		customer.name.trim() !== '' &&
			String(system.capacityKw).trim() !== '' &&
			items.some((i) => lineTotal(i) > 0)
	);

	function generatePDF() {
		if (!isValid) return;
		try {
			isGenerating = true;
			const doc = new jsPDF();
			const pageW = doc.internal.pageSize.getWidth();
			const pageH = doc.internal.pageSize.getHeight();
			const margin = 14;
			const right = pageW - margin;
			let y = 18;

			const accent: [number, number, number] = [0, 86, 179];

			// Header: business name + quote label
			doc.setFontSize(18);
			doc.setTextColor(...accent);
			doc.text(business?.businessname || 'Solar Installation', margin, y);
			doc.setFontSize(16);
			doc.setTextColor(120, 120, 120);
			doc.text('QUOTATION', right, y, { align: 'right' });
			y += 6;

			doc.setFontSize(9);
			doc.setTextColor(90, 90, 90);
			const contact: string[] = [];
			if (business?.email) contact.push(business.email);
			if (business?.website) contact.push(business.website);
			if (meta.gstin) contact.push(`GSTIN: ${meta.gstin}`);
			if (contact.length) doc.text(contact.join('  |  '), margin, y);
			y += 6;

			doc.setDrawColor(...accent);
			doc.setLineWidth(0.5);
			doc.line(margin, y, right, y);
			y += 8;

			// Meta + customer (two columns)
			doc.setFontSize(10);
			doc.setTextColor(0, 0, 0);
			const colR = pageW / 2 + 6;
			doc.setFont('helvetica', 'bold');
			doc.text('Quotation Details', margin, y);
			doc.text('Customer', colR, y);
			doc.setFont('helvetica', 'normal');
			y += 6;
			const leftLines = [
				`Quote No: ${meta.quoteNumber}`,
				`Date: ${meta.date}`,
				`Valid for: ${meta.validityDays} days`,
				`System: ${system.capacityKw} kW ${system.type} (${system.phase})`
			];
			const rightLines = [
				customer.name,
				customer.phone,
				customer.email,
				customer.address
			].filter(Boolean);
			const rows = Math.max(leftLines.length, rightLines.length);
			for (let i = 0; i < rows; i++) {
				if (leftLines[i]) doc.text(doc.splitTextToSize(leftLines[i], 85), margin, y + i * 5);
				if (rightLines[i]) doc.text(doc.splitTextToSize(rightLines[i], 80), colR, y + i * 5);
			}
			y += rows * 5 + 6;

			// Line items table
			const cols = { sno: margin, desc: margin + 8, qty: 120, unit: 138, rate: 168, amt: right };
			doc.setFillColor(...accent);
			doc.setTextColor(255, 255, 255);
			doc.setFontSize(9);
			doc.setFont('helvetica', 'bold');
			doc.rect(margin, y - 4, right - margin, 7, 'F');
			doc.text('#', cols.sno + 1, y);
			doc.text('Description', cols.desc, y);
			doc.text('Qty', cols.qty, y, { align: 'right' });
			doc.text('Unit', cols.unit, y);
			doc.text('Rate', cols.rate, y, { align: 'right' });
			doc.text('Amount', cols.amt, y, { align: 'right' });
			y += 7;

			doc.setFont('helvetica', 'normal');
			doc.setTextColor(0, 0, 0);
			let sno = 1;
			for (const item of items) {
				if (lineTotal(item) <= 0 && !item.description.trim()) continue;
				if (y > pageH - 50) {
					doc.addPage();
					y = 20;
				}
				const descLines = doc.splitTextToSize(item.description || '-', 70);
				const rowH = Math.max(6, descLines.length * 5);
				doc.text(String(sno), cols.sno + 1, y);
				doc.text(descLines, cols.desc, y);
				doc.text(String(item.qty), cols.qty, y, { align: 'right' });
				doc.text(item.unit, cols.unit, y);
				doc.text(formatRs(item.rate), cols.rate, y, { align: 'right' });
				doc.text(formatRs(lineTotal(item)), cols.amt, y, { align: 'right' });
				doc.setDrawColor(225, 225, 225);
				doc.setLineWidth(0.1);
				doc.line(margin, y + rowH - 4, right, y + rowH - 4);
				y += rowH;
				sno++;
			}
			y += 4;

			// Totals block (right aligned)
			const labelX = pageW - 80;
			const drawTotal = (label: string, value: string, bold = false) => {
				if (y > pageH - 30) {
					doc.addPage();
					y = 20;
				}
				doc.setFont('helvetica', bold ? 'bold' : 'normal');
				doc.setFontSize(bold ? 11 : 10);
				doc.text(label, labelX, y);
				doc.text(value, right, y, { align: 'right' });
				y += bold ? 8 : 6;
			};
			drawTotal('Subtotal', formatRs(totals.subtotal));
			drawTotal(`GST (${gstRate}%)`, formatRs(totals.gst));
			drawTotal('Gross Total', formatRs(totals.gross));
			if (totals.subsidy > 0) drawTotal('Less: PM Surya Ghar Subsidy', `- ${formatRs(totals.subsidy)}`);
			doc.setDrawColor(...accent);
			doc.setLineWidth(0.4);
			doc.line(labelX, y - 4, right, y - 4);
			y += 2;
			drawTotal('Net Payable', formatRs(totals.netPayable), true);
			y += 4;

			// Terms
			if (terms.trim()) {
				if (y > pageH - 40) {
					doc.addPage();
					y = 20;
				}
				doc.setFont('helvetica', 'bold');
				doc.setFontSize(10);
				doc.setTextColor(...accent);
				doc.text('Terms & Conditions', margin, y);
				y += 6;
				doc.setFont('helvetica', 'normal');
				doc.setFontSize(9);
				doc.setTextColor(60, 60, 60);
				const termLines = doc.splitTextToSize(terms, right - margin);
				doc.text(termLines, margin, y);
				y += termLines.length * 5;
			}

			// Footer
			doc.setFontSize(8);
			doc.setTextColor(140, 140, 140);
			doc.text('Generated by Solar Vipani', pageW / 2, pageH - 10, { align: 'center' });

			const slug = customer.name ? customer.name.replace(/\s+/g, '_').toLowerCase() : 'customer';
			doc.save(`solar_quotation_${slug}_${meta.quoteNumber}.pdf`);
			toast.success('Quotation downloaded');
		} catch (error) {
			console.error('Error generating quotation PDF:', error);
			toast.error('Failed to generate quotation. Please try again.');
		} finally {
			isGenerating = false;
		}
	}
</script>

<div class="min-h-screen p-4 md:p-8 bg-background text-foreground">
	<header class="mb-8 text-center">
		<h1 class="text-3xl font-bold mb-2">Quotation Maker</h1>
		<p class="text-muted-foreground">Build an itemized solar quotation and download it as a PDF</p>
	</header>

	<div class="mx-auto max-w-4xl flex flex-col gap-6">
		<!-- Customer + System -->
		<section class="bg-card border border-border rounded-lg p-6">
			<h2 class="text-lg font-semibold mb-4 text-accent">Customer & System</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="flex flex-col">
					<Label for="custName" class="mb-2">Customer Name <span class="text-destructive">*</span></Label>
					<Input id="custName" bind:value={customer.name} placeholder="Enter customer name" />
				</div>
				<div class="flex flex-col">
					<Label for="custPhone" class="mb-2">Phone</Label>
					<Input id="custPhone" type="tel" bind:value={customer.phone} placeholder="Phone number" />
				</div>
				<div class="flex flex-col sm:col-span-2">
					<Label for="custAddr" class="mb-2">Address</Label>
					<Input id="custAddr" bind:value={customer.address} placeholder="Installation address" />
				</div>
				<div class="flex flex-col">
					<Label for="custEmail" class="mb-2">Email</Label>
					<Input id="custEmail" type="email" bind:value={customer.email} placeholder="Email address" />
				</div>
				<div class="flex flex-col">
					<Label for="cap" class="mb-2">System Capacity (kW) <span class="text-destructive">*</span></Label>
					<Input id="cap" type="number" min="0" step="0.1" bind:value={system.capacityKw} placeholder="e.g. 5" />
				</div>
				<div class="flex flex-col">
					<Label for="sysType" class="mb-2">System Type</Label>
					<select
						id="sysType"
						bind:value={system.type}
						class="h-9 rounded-md border border-input bg-background px-3 text-sm"
					>
						<option>On-Grid</option>
						<option>Off-Grid</option>
						<option>Hybrid</option>
					</select>
				</div>
				<div class="flex flex-col">
					<Label for="phase" class="mb-2">Phase</Label>
					<select
						id="phase"
						bind:value={system.phase}
						class="h-9 rounded-md border border-input bg-background px-3 text-sm"
					>
						<option>Single Phase</option>
						<option>Three Phase</option>
					</select>
				</div>
			</div>
		</section>

		<!-- Line items -->
		<section class="bg-card border border-border rounded-lg p-6">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold text-accent">Bill of Materials</h2>
				<Button variant="outline" size="sm" onclick={addItem}>
					<Plus size={16} /> Add Item
				</Button>
			</div>
			<div class="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead class="min-w-[200px]">Description</TableHead>
							<TableHead class="w-20">Qty</TableHead>
							<TableHead class="w-24">Unit</TableHead>
							<TableHead class="w-28">Rate (₹)</TableHead>
							<TableHead class="w-28 text-right">Amount</TableHead>
							<TableHead class="w-10"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each items as item, i}
							<TableRow>
								<TableCell><Input bind:value={item.description} placeholder="Item description" /></TableCell>
								<TableCell><Input type="number" min="0" bind:value={item.qty} /></TableCell>
								<TableCell><Input bind:value={item.unit} /></TableCell>
								<TableCell><Input type="number" min="0" bind:value={item.rate} /></TableCell>
								<TableCell class="text-right tabular-nums">{formatINR(lineTotal(item))}</TableCell>
								<TableCell>
									<Button variant="ghost" size="icon-sm" onclick={() => removeItem(i)} aria-label="Remove item">
										<Trash2 size={16} class="text-destructive" />
									</Button>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</section>

		<!-- Pricing + Terms -->
		<section class="bg-card border border-border rounded-lg p-6">
			<h2 class="text-lg font-semibold mb-4 text-accent">Pricing</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<div class="flex flex-col gap-4">
					<div class="flex flex-col">
						<Label for="gst" class="mb-2">GST Rate (%)</Label>
						<Input id="gst" type="number" min="0" step="0.1" bind:value={gstRate} />
					</div>
					<div class="flex flex-col">
						<Label for="subsidy" class="mb-2">
							PM Surya Ghar Subsidy (₹)
							<span class="text-xs text-muted-foreground">— auto: {formatINR(autoSubsidy)}</span>
						</Label>
						<Input id="subsidy" type="number" min="0" bind:value={subsidyOverride} placeholder={String(autoSubsidy)} />
					</div>
				</div>
				<div class="flex flex-col gap-2 justify-center bg-muted/40 rounded-md p-4 text-sm">
					<div class="flex justify-between"><span>Subtotal</span><span class="tabular-nums">{formatINR(totals.subtotal)}</span></div>
					<div class="flex justify-between"><span>GST ({gstRate}%)</span><span class="tabular-nums">{formatINR(totals.gst)}</span></div>
					<div class="flex justify-between"><span>Gross Total</span><span class="tabular-nums">{formatINR(totals.gross)}</span></div>
					{#if totals.subsidy > 0}
						<div class="flex justify-between text-accent"><span>Less: Subsidy</span><span class="tabular-nums">- {formatINR(totals.subsidy)}</span></div>
					{/if}
					<div class="flex justify-between font-bold text-base border-t border-border pt-2 mt-1">
						<span>Net Payable</span><span class="tabular-nums">{formatINR(totals.netPayable)}</span>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
				<div class="flex flex-col">
					<Label for="gstin" class="mb-2">Your GSTIN (optional)</Label>
					<Input id="gstin" bind:value={meta.gstin} placeholder="Shown in quote header" />
				</div>
				<div class="flex flex-col">
					<Label for="validity" class="mb-2">Validity (days)</Label>
					<Input id="validity" type="number" min="1" bind:value={meta.validityDays} />
				</div>
				<div class="flex flex-col sm:col-span-2">
					<Label for="terms" class="mb-2">Terms & Conditions</Label>
					<Textarea id="terms" rows={4} bind:value={terms} />
				</div>
			</div>
		</section>

		<div class="flex justify-end pb-8">
			<Button onclick={generatePDF} disabled={!isValid || isGenerating} size="lg">
				<Download size={18} /> {isGenerating ? 'Generating…' : 'Download Quotation PDF'}
			</Button>
		</div>
	</div>
</div>
