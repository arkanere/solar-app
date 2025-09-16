<script>
	import { onMount, afterUpdate, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { isDarkMode } from '$lib/themeStore';
	import conversationFlows from '$lib/conversationFlows.json';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Store to maintain message history
	export let messages = writable([]);

	// Chat state
	let userInput = '';
	let isLoading = false;
	let currentFlowId = 'initial'; // Start with freeform initial
	let inputValues = {};

	// Form state for new form flow type
	let formValues = {};
	let formErrors = {};
	let isFormValid = false;
	let isSubmittingForm = false;
	let hasAttemptedSubmit = false;

	// URL parameter for tracking
	let urlParam = '';

	// Track user journey for type field
	let userJourney = [];

	// Context handoff for LLM chatbot
	let conversationContext = '';
	let contextSent = false;

	// Reference to chat history container for scrolling
	let chatHistoryContainer;

	// Track if user has manually scrolled up
	let isUserScrolledUp = false;
	let lastScrollHeight = 0;
	let lastScrollTop = 0;

	// Animation state management
	let hasUserInteracted = false;

	// Function to stop background animation on user interaction
	function stopBackgroundAnimation() {
		hasUserInteracted = true;
	}

	// Lead Profile Data Structure
	let leadProfile = {
		// Personal (from form)
		name: null,
		phone: null,
		email: null,
		pincode: null,

		// Property Details
		propertyType: null, // residential/commercial/agriculture
		propertySubtype: null, // bungalow/apartment/society

		// Electricity Profile
		monthlyConsumption: null,
		monthlyBill: null,
		powerCutHours: null,

		// System Recommendation
		recommendedSystemSize: null,
		systemType: null, // on-grid/hybrid/off-grid

		// Financial
		systemCost: null,
		subsidyAmount: null,
		netInvestment: null
	};

	// Reactive statement to get URL parameter
	$: {
		urlParam = $page.url.pathname;
	}

	// Function to update lead profile
	function updateLeadProfile(field, value) {
		leadProfile[field] = value;

		// Log profile update for debugging
		console.log(`Lead Profile Updated: ${field} = ${value}`);
		console.log('Current Lead Profile:', leadProfile);

		// Save to localStorage
		saveLeadProfile();
	}

	// Function to save lead profile to localStorage
	function saveLeadProfile() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('leadProfile', JSON.stringify(leadProfile));
		}
	}

	// Function to load lead profile from localStorage
	function loadLeadProfile() {
		if (typeof window !== 'undefined') {
			const savedProfile = localStorage.getItem('leadProfile');
			if (savedProfile) {
				leadProfile = JSON.parse(savedProfile);
			}
		}
	}

	// Function to add to user journey (excluding form inputs)
	function addToUserJourney(type, value) {
		// Don't track form submission details or form field inputs
		if (
			type === 'formSubmission' ||
			(type === 'input' &&
				[
					'customerName',
					'customerPhone',
					'customerPinCode',
					'customerEmail',
					'customerComment'
				].includes(value))
		) {
			return;
		}

		const journeyEntry = type === 'input' ? `${value}` : value;
		userJourney.push(journeyEntry);
	}

	// Enhanced function to serialize conversation context for LLM handoff
	function serializeConversationContext() {
		let contextLines = [];

		// Add lead profile information
		contextLines.push('=== Lead Profile ===');
		Object.entries(leadProfile).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				const formattedKey = key
					.replace(/([A-Z])/g, ' $1')
					.replace(/^./, (str) => str.toUpperCase());
				contextLines.push(`${formattedKey}: ${value}`);
			}
		});
		contextLines.push('');

		// Add current flow information
		const currentFlow = conversationFlows.flows[currentFlowId];
		if (currentFlow && currentFlowId !== 'initial' && currentFlowId !== 'welcome') {
			contextLines.push(`Current Flow: ${currentFlowId}`);
			if (currentFlow.message) {
				contextLines.push(`Current Context: ${processMessageText(currentFlow.message)}`);
			}
		}

		return contextLines.join('\n');
	}

	// Form validation functions
	function validatePhoneNumber(phone) {
		if (!phone || !/^\+?\d{10,16}$/.test(phone)) {
			return 'Phone number must be between 10 and 16 digits, optionally starting with +';
		}
		return '';
	}

	function validateEmail(email) {
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return 'Invalid email address';
		}
		return '';
	}

	function validatePinCode(pinCode) {
		if (!pinCode || !/^\d{6}$/.test(pinCode)) {
			return 'Pin code must be exactly 6 digits';
		}
		return '';
	}

	function validateRequired(value, fieldName) {
		if (!value || value.trim() === '') {
			return `${fieldName} is required`;
		}
		return '';
	}

	function validateForm(showAllErrors = true) {
		const currentFlow = conversationFlows.flows[currentFlowId];
		if (!currentFlow || !currentFlow.inputs) {
			return false;
		}

		let isValid = true;
		const errors = {};

		currentFlow.inputs.forEach((input) => {
			const value = formValues[input.id] || '';
			let error = '';

			// Required field validation (only show if showAllErrors is true or hasAttemptedSubmit)
			if (input.required && (showAllErrors || hasAttemptedSubmit)) {
				error = validateRequired(value, input.label);
			}

			// Specific field validations (always show format errors if field has value)
			if (!error && value) {
				switch (input.id) {
					case 'customerPhone':
						error = validatePhoneNumber(value);
						break;
					case 'customerEmail':
						error = validateEmail(value);
						break;
					case 'customerPinCode':
						error = validatePinCode(value);
						break;
				}
			}

			// For form validity check, consider all errors regardless of display
			let allErrors = '';
			if (input.required) {
				allErrors = validateRequired(value, input.label);
			}
			if (!allErrors && value) {
				switch (input.id) {
					case 'customerPhone':
						allErrors = validatePhoneNumber(value);
						break;
					case 'customerEmail':
						allErrors = validateEmail(value);
						break;
					case 'customerPinCode':
						allErrors = validatePinCode(value);
						break;
				}
			}

			errors[input.id] = error;
			if (allErrors) {
				isValid = false;
			}
		});

		formErrors = errors;
		isFormValid = isValid;

		return isValid;
	}

	// Function to scroll to bottom
	async function scrollToBottom() {
		await tick(); // Wait for DOM update

		// Only auto-scroll if user is already at the bottom or hasn't manually scrolled up
		if (!isUserScrolledUp && chatHistoryContainer) {
			chatHistoryContainer.scrollTo({
				top: chatHistoryContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	}

	// Handle scroll events to detect manual scrolling
	function handleScroll() {
		if (!chatHistoryContainer) return;

		// Calculate how far from bottom (in pixels)
		const scrollBottom =
			chatHistoryContainer.scrollHeight -
			chatHistoryContainer.scrollTop -
			chatHistoryContainer.clientHeight;

		// Consider user scrolled up if more than 100px from bottom
		isUserScrolledUp = scrollBottom > 100;

		// If user scrolls to bottom, reset the flag
		if (scrollBottom < 20) {
			isUserScrolledUp = false;
		}

		// Save last positions
		lastScrollHeight = chatHistoryContainer.scrollHeight;
		lastScrollTop = chatHistoryContainer.scrollTop;
	}

	// Function to start guided assessment flow
	async function startGuidedFlow() {
		// Stop background animation on user interaction
		stopBackgroundAnimation();

		console.log('Starting guided flow transition to: guidedAssessmentStart');
		console.log('Available flows:', Object.keys(conversationFlows.flows));

		// Add this debug line
		console.log('About to call transitionToFlow with: guidedAssessmentStart');
		console.log('guidedAssessmentStart flow:', conversationFlows.flows.guidedAssessmentStart);

		// Add message showing user chose guided flow
		messages.update((m) => [
			...m,
			{
				role: 'user',
				content: 'Yes, start assessment'
			}
		]);

		await scrollToBottom();

		// Set loading state
		isLoading = true;

		// Simulate delay for natural feel
		await simulateDelay(800 + Math.random() * 1200);

		// Add this debug line too
		console.log('Now calling transitionToFlow...');

		// Transition to guided assessment start flow
		await transitionToFlow('guidedAssessmentStart');

		isLoading = false;
		await scrollToBottom();
	}

	// Function to dismiss guided flow suggestion
	function dismissGuidedSuggestion(messageIndex) {
		// Stop background animation on user interaction
		stopBackgroundAnimation();

		messages.update((m) => {
			const updated = [...m];
			if (updated[messageIndex]) {
				updated[messageIndex] = {
					...updated[messageIndex],
					showGuidedOption: false
				};
			}
			return updated;
		});
	}

	// Function to send free-form user message to the backend
	async function sendMessage() {
		if (!userInput.trim()) return;

		// Stop background animation on user interaction
		stopBackgroundAnimation();

		// Add the user's message to the message history
		messages.update((m) => [...m, { role: 'user', content: userInput }]);

		// Set loading state
		isLoading = true;

		// Scroll to bottom after adding user message
		await scrollToBottom();

		try {
			// Prepare request payload
			let requestPayload = {
				userMessage: userInput,
				leadProfile: leadProfile // Include lead profile in every request
			};

			// Include conversation context if this is the first freeform message
			if (!contextSent) {
				conversationContext = serializeConversationContext();
				if (conversationContext.trim()) {
					requestPayload.conversationContext = conversationContext;
				}
				contextSent = true; // Mark context as sent
			}

			// Send message to backend
			const response = await fetch('/chatbot121212', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestPayload)
			});

			const { reply } = await response.json();

			// Check if AI suggests guided flow
			if (reply.includes('SUGGEST_GUIDED_FLOW:')) {
				const [mainReply, suggestion] = reply.split('SUGGEST_GUIDED_FLOW:');

				// Add main reply
				messages.update((m) => [...m, { role: 'assistant', content: mainReply.trim() }]);
				await scrollToBottom();

				// Add slight delay before showing suggestion
				setTimeout(async () => {
					// Add suggestion with guided flow option
					messages.update((m) => [
						...m,
						{
							role: 'assistant',
							content: suggestion.trim(),
							showGuidedOption: true
						}
					]);
					await scrollToBottom();
				}, 1000);
			} else {
				messages.update((m) => [...m, { role: 'assistant', content: reply }]);
				await scrollToBottom();
			}
		} catch (err) {
			console.error('Error communicating with chatbot:', err);

			messages.update((m) => [
				...m,
				{ role: 'assistant', content: 'Something went wrong. Please try again later.' }
			]);

			// Scroll to bottom after error message
			await scrollToBottom();
		} finally {
			userInput = ''; // Clear input field
			isLoading = false;
		}
	}

	// Helper function to simulate a delay for natural conversation
	function simulateDelay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Function to handle form submission
	async function submitForm() {
		// Stop background animation on user interaction
		stopBackgroundAnimation();

		// Set the flag to show validation errors from now on
		hasAttemptedSubmit = true;

		if (!validateForm()) {
			return; // Don't submit if validation fails
		}

		// Get current flow
		const currentFlow = conversationFlows.flows[currentFlowId];
		if (!currentFlow) {
			return;
		}

		// Set submitting state
		isSubmittingForm = true;

		try {
			// Update lead profile with form values
			if (formValues.customerName) updateLeadProfile('name', formValues.customerName);
			if (formValues.customerPhone) updateLeadProfile('phone', formValues.customerPhone);
			if (formValues.customerEmail) updateLeadProfile('email', formValues.customerEmail);
			if (formValues.customerPinCode) updateLeadProfile('pincode', formValues.customerPinCode);

			// Create user journey string from tracked interactions
			const userJourneyString = userJourney.join(', ');

			// Prepare data for API submission
			const formData = {
				name: formValues.customerName || '',
				phone: formValues.customerPhone || '',
				pinCode: formValues.customerPinCode || '',
				email: formValues.customerEmail || '',
				comment: formValues.customerComment || '',
				type: userJourneyString, // Save user journey instead of conversation
				urlParam: urlParam
			};

			// Submit to API
			const response = await fetch('/api/submitLead', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (result.success) {
				// Create a summary message for user
				const formSummary = Object.entries(formValues)
					.filter(([key, value]) => value && value.trim())
					.map(([key, value]) => {
						const input = currentFlow.inputs.find((inp) => inp.id === key);
						return `${input?.label || key}: ${value}`;
					})
					.join('\n');

				// Add user form submission as a message
				messages.update((m) => [
					...m,
					{
						role: 'user',
						content: `Form submitted:\n${formSummary}`
					}
				]);

				// Scroll after adding the message
				await scrollToBottom();

				// Store form values in inputValues for template processing
				Object.keys(formValues).forEach((key) => {
					inputValues[key] = formValues[key];
				});

				// Set loading state for transition
				isLoading = true;

				// Simulate delay for natural feel
				await simulateDelay(800 + Math.random() * 1200);

				// Clear form values
				formValues = {};
				formErrors = {};
				hasAttemptedSubmit = false;

				// If there's a next flow, transition to it
				if (currentFlow.nextFlow) {
					await transitionToFlow(currentFlow.nextFlow);
				}

				// End loading state
				isLoading = false;

				// Scroll after response
				await scrollToBottom();
			} else {
				// Show error message to user
				messages.update((m) => [
					...m,
					{
						role: 'assistant',
						content:
							'Sorry, there was an error submitting your form. Please try again or contact us directly.'
					}
				]);

				await scrollToBottom();
			}
		} catch (error) {
			// Show error message to user
			messages.update((m) => [
				...m,
				{
					role: 'assistant',
					content: 'Sorry, there was a network error. Please check your connection and try again.'
				}
			]);

			await scrollToBottom();
		} finally {
			isSubmittingForm = false;
		}
	}

	// Enhanced function to handle option selection (button clicks)
	async function selectOption(optionId) {
		// Stop background animation on user interaction
		stopBackgroundAnimation();

		// Add to user journey tracking
		addToUserJourney('option', optionId);

		// Update lead profile based on option selection
		// Property type selection
		if (currentFlowId === 'guidedAssessmentStart') {
			if (['residential', 'business', 'agriculture'].includes(optionId)) {
				updateLeadProfile('propertyType', optionId);
			}
		}

		// Property subtype selection
		if (currentFlowId === 'residentialType') {
			updateLeadProfile('propertySubtype', optionId);
		}

		// Get current flow
		const currentFlow = conversationFlows.flows[currentFlowId];
		if (!currentFlow || !currentFlow.options) return;

		// Find the selected option
		const selectedOption = currentFlow.options.find((opt) => opt.id === optionId);
		if (!selectedOption) return;

		// Add user selection as a message
		messages.update((m) => [
			...m,
			{
				role: 'user',
				content: selectedOption.label
			}
		]);

		// Scroll after adding the message
		await scrollToBottom();

		// Store the selection if needed
		inputValues[currentFlowId] = optionId;

		// Set loading state
		isLoading = true;

		// Simulate delay for natural feel
		await simulateDelay(800 + Math.random() * 1200);

		// If there's a next flow, transition to it
		if (selectedOption.nextFlow) {
			await transitionToFlow(selectedOption.nextFlow);
		}

		// End loading state
		isLoading = false;

		// Scroll after response
		await scrollToBottom();
	}

	// Enhanced function to handle input submission
	async function submitInput(inputId, value) {
		// Stop background animation on user interaction
		stopBackgroundAnimation();

		// Add to user journey tracking (with value for non-form inputs)
		addToUserJourney('input', `${inputId} = ${value}`);

		// Update lead profile based on input
		if (inputId === 'monthlyConsumption') {
			updateLeadProfile('monthlyConsumption', Number(value));
		} else if (inputId === 'monthlyBill') {
			updateLeadProfile('monthlyBill', Number(value));
		} else if (inputId === 'powerCuts') {
			updateLeadProfile('powerCutHours', Number(value));
		}

		// Get current flow
		const currentFlow = conversationFlows.flows[currentFlowId];
		if (!currentFlow || !currentFlow.inputs) return;

		// Find the input definition
		const inputDef = currentFlow.inputs.find((inp) => inp.id === inputId);
		if (!inputDef) return;

		// Format the user message based on input type
		let userMessage = inputDef.label ? `${inputDef.label}: ${value}` : `${value}`;
		if (inputDef.unit) userMessage += ` ${inputDef.unit}`;

		// Add user input as a message
		messages.update((m) => [
			...m,
			{
				role: 'user',
				content: userMessage
			}
		]);

		// Scroll after adding the message
		await scrollToBottom();

		// Store the input value for potential later use
		// Convert to number if numeric input
		if (inputDef.type === 'number') {
			inputValues[inputId] = Number(value);
		} else {
			inputValues[inputId] = value;
		}

		// Set loading state
		isLoading = true;

		// Simulate delay for natural feel
		await simulateDelay(800 + Math.random() * 1200);

		// If there's a next flow, transition to it
		if (inputDef.nextFlow) {
			await transitionToFlow(inputDef.nextFlow);
		}

		// End loading state
		isLoading = false;

		// Scroll after response
		await scrollToBottom();
	}

	// Save state to localStorage
	function saveState() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('chatMessages', JSON.stringify(get(messages)));
			localStorage.setItem('currentFlowId', currentFlowId);
			localStorage.setItem('inputValues', JSON.stringify(inputValues));
			localStorage.setItem('conversationContext', conversationContext);
			localStorage.setItem('contextSent', JSON.stringify(contextSent));
			localStorage.setItem('leadProfile', JSON.stringify(leadProfile));
		}
	}

	// Get store value helper
	function get(store) {
		let value;
		const unsubscribe = store.subscribe((v) => (value = v));
		unsubscribe();
		return value;
	}

	// Enhanced process message text function to update lead profile
	function processMessageText(text) {
		if (!text || typeof text !== 'string') {
			return text;
		}

		// Get the current flow
		const currentFlow = conversationFlows.flows[currentFlowId];
		if (!currentFlow) {
			return text;
		}

		// Regular expression to find all placeholders like {variableName}
		const regex = /\{([^}]+)\}/g;

		// First, get all variables that need to be replaced
		let match;
		let processedText = text;
		const variables = [];
		while ((match = regex.exec(text)) !== null) {
			variables.push(match[1]);
		}

		// Process each variable
		for (const variableName of variables) {
			let variableValue;

			// Check if variable exists in inputValues
			if (inputValues[variableName] !== undefined) {
				variableValue = inputValues[variableName];
			}
			// If not in inputValues, check if it has a formula
			else if (currentFlow[variableName]) {
				const formula = currentFlow[variableName];

				// Replace any nested variables in the formula
				let processedFormula = formula;
				const nestedVars = [];
				let nestedMatch;
				const nestedRegex = /\{([^}]+)\}/g;

				while ((nestedMatch = nestedRegex.exec(formula)) !== null) {
					nestedVars.push(nestedMatch[1]);
				}

				// Process each nested variable first
				for (const nestedVar of nestedVars) {
					let nestedValue;

					if (inputValues[nestedVar] !== undefined) {
						nestedValue = inputValues[nestedVar];
					} else if (currentFlow[nestedVar]) {
						// Recursively process the nested variable's formula
						const tempText = `{${nestedVar}}`;
						processMessageText(tempText);

						if (inputValues[nestedVar] !== undefined) {
							nestedValue = inputValues[nestedVar];
						} else {
							nestedValue = 0;
							inputValues[nestedVar] = 0;
						}
					} else {
						nestedValue = 0;
					}

					// Replace in the formula
					processedFormula = processedFormula.replace(`{${nestedVar}}`, nestedValue);
				}

				// Evaluate the formula
				try {
					// Use Function for safer evaluation
					variableValue = Function('"use strict"; return (' + processedFormula + ')')();

					// Store for future calculations
					inputValues[variableName] = variableValue;

					// Update lead profile with calculated values
					if (variableName === 'systemSize') {
						updateLeadProfile('recommendedSystemSize', variableValue);
					} else if (variableName === 'systemCost') {
						updateLeadProfile('systemCost', variableValue);
					} else if (variableName === 'subsidyAmount') {
						updateLeadProfile('subsidyAmount', variableValue);
					} else if (variableName === 'netCost' || variableName === 'totalCost') {
						updateLeadProfile('netInvestment', variableValue);
					}
				} catch (e) {
					variableValue = 0;
					inputValues[variableName] = 0;
				}
			} else {
				variableValue = 0;
			}

			// Format the value for display
			const formattedValue =
				typeof variableValue === 'number'
					? Number.isInteger(variableValue)
						? variableValue
						: parseFloat(variableValue.toFixed(2))
					: variableValue;

			// Replace in the text
			processedText = processedText.replace(`{${variableName}}`, formattedValue);
		}

		return processedText;
	}

	// Enhanced function to transition to a specific flow
	async function transitionToFlow(flowId) {
		console.log(`Transitioning to flow: ${flowId}`);

		// Enhanced debugging version
		const flow = conversationFlows.flows[flowId];
		console.log(`Looking for flow: ${flowId}`);
		console.log(`Flow found:`, flow);
		console.log(`Flow type:`, typeof flow);
		console.log(`All available flows:`, Object.keys(conversationFlows.flows));

		if (!flow) {
			console.error(`❌ Flow '${flowId}' not found or is undefined!`);
			console.log(`Available flows:`, conversationFlows.flows);
			return;
		}

		console.log(`Flow message:`, flow.message);

		// Add flow transition to user journey (exclude initial and welcome flows)
		if (flowId !== 'initial' && flowId !== 'welcome') {
			addToUserJourney('flow', flowId);
		}

		// Update system type based on flow transitions
		if (flowId === 'residentialResultOnGrid' || flowId === 'noResidentialBatteryNeeded') {
			updateLeadProfile('systemType', 'on-grid');
		} else if (flowId === 'residentialResultHybrid') {
			updateLeadProfile('systemType', 'hybrid');
		}

		// Reset context sent flag when transitioning to freeform
		if (
			flowId === 'welcome' ||
			flowId === 'initial' ||
			conversationFlows.flows[flowId]?.flowType === 'freeform'
		) {
			contextSent = false;
		}

		// Update current flow
		currentFlowId = flowId;

		// Process the message text to replace variables with calculated values
		const processedMessage = processMessageText(flow.message);

		console.log(`Processed message:`, processedMessage);

		// Add bot message with processed text
		messages.update((m) => [
			...m,
			{
				role: 'assistant',
				content: processedMessage
			}
		]);

		// Save state to localStorage
		saveState();

		// Scroll to bottom after adding the message
		await scrollToBottom();
	}

	// Function to clear chat and reset to initial state
	async function resetChat() {
		messages.set([]);
		currentFlowId = 'initial'; // Start with freeform initial
		inputValues = {};
		formValues = {};
		formErrors = {};
		hasAttemptedSubmit = false;
		userJourney = []; // Reset user journey tracking
		conversationContext = ''; // Reset conversation context
		contextSent = false; // Reset context sent flag

		// Reset lead profile
		leadProfile = {
			name: null,
			phone: null,
			email: null,
			pincode: null,
			propertyType: null,
			propertySubtype: null,
			monthlyConsumption: null,
			monthlyBill: null,
			powerCutHours: null,
			recommendedSystemSize: null,
			systemType: null,
			systemCost: null,
			subsidyAmount: null,
			netInvestment: null
		};

		// Clear localStorage
		if (typeof window !== 'undefined') {
			localStorage.removeItem('chatMessages');
			localStorage.removeItem('currentFlowId');
			localStorage.removeItem('inputValues');
			localStorage.removeItem('conversationContext');
			localStorage.removeItem('contextSent');
			localStorage.removeItem('leadProfile');
		}

		// Start with initial flow (freeform)
		await transitionToFlow('initial');

		// Ensure we scroll to bottom after resetting
		isUserScrolledUp = false;
		await scrollToBottom();
	}

	// Initialize the chat
	function initializeChat() {
		if (typeof window !== 'undefined') {
			// Load lead profile
			loadLeadProfile();

			// Attempt to restore from localStorage
			const savedMessages = localStorage.getItem('chatMessages');
			const savedFlowId = localStorage.getItem('currentFlowId');
			const savedInputs = localStorage.getItem('inputValues');
			const savedContext = localStorage.getItem('conversationContext');
			const savedContextSent = localStorage.getItem('contextSent');

			if (savedMessages && savedFlowId) {
				messages.set(JSON.parse(savedMessages));
				currentFlowId = savedFlowId;

				// Restore conversation context state
				if (savedContext) {
					conversationContext = savedContext;
				}
				if (savedContextSent) {
					contextSent = JSON.parse(savedContextSent);
				}

				// Parse and convert numeric values correctly
				if (savedInputs) {
					const parsedInputs = JSON.parse(savedInputs);

					// Convert numeric strings to numbers
					Object.keys(parsedInputs).forEach((key) => {
						const value = parsedInputs[key];
						if (typeof value === 'string' && !isNaN(Number(value))) {
							inputValues[key] = Number(value);
						} else {
							inputValues[key] = value;
						}
					});
				} else {
					inputValues = {};
				}
			} else {
				// Start fresh with initial flow (freeform)
				transitionToFlow('initial');
			}
		}
	}

	// Load state from localStorage on mount and set up scroll handler
	onMount(() => {
		if (typeof window !== 'undefined') {
			window.resetChat = resetChat;

			initializeChat();

			// Initial scroll to bottom on startup
			scrollToBottom();
		}
	});

	// After any update, check if we should scroll
	afterUpdate(() => {
		// If new content was added (scrollHeight increased), and user was at bottom before
		if (
			chatHistoryContainer &&
			chatHistoryContainer.scrollHeight > lastScrollHeight &&
			!isUserScrolledUp
		) {
			scrollToBottom();
		}
	});

	// Reactive statement to validate form whenever formValues change
	$: if (conversationFlows.flows[currentFlowId]?.flowType === 'form' && formValues) {
		// Always validate, but control which errors to show based on hasAttemptedSubmit
		validateForm(false); // Don't show required field errors until submit attempt
	}

	// Also reactive on hasAttemptedSubmit to show all errors when user attempts submit
	$: if (hasAttemptedSubmit && conversationFlows.flows[currentFlowId]?.flowType === 'form') {
		validateForm(true); // Show all errors including required field errors
	}
</script>

<div class="chatbot-container {$isDarkMode ? 'dark-theme' : 'light-theme'}">
	<div class="chatbot-header">
		<h3>Calculate Price and Savings</h3>
	</div>

	<div class="disclaimer-banner">
		<p>Disclaimer: This chatbot is still in development phase. Responses may be incorrect.</p>
	</div>

	<!-- Chat history -->
	<div
		class="chat-history {!hasUserInteracted ? 'breathing-background' : ''}"
		bind:this={chatHistoryContainer}
		on:scroll={handleScroll}
	>
		{#each $messages as message, i}
			<div class="message {message.role}">
				{#if message.role === 'assistant'}
					<div class="bot-avatar">
						<img
							src="https://api.dicebear.com/9.x/bottts/svg?seed=SolarBot"
							alt="Solar Bot Avatar"
							width="32"
							height="32"
						/>
					</div>
				{/if}
				<div class="message-bubble">
					<div class="message-header">
						<span>{message.role === 'user' ? 'You' : 'SolarVipani Assistant'}</span>
					</div>
					<div class="message-content">
						<p>{@html message.content}</p>

						<!-- Show guided flow suggestion -->
						{#if message.showGuidedOption}
							<div class="guided-flow-suggestion">
								<button class="start-guided-btn" on:click={startGuidedFlow}>
									Yes, start assessment
								</button>
								<button class="continue-chat-btn" on:click={() => dismissGuidedSuggestion(i)}>
									No, continue chatting
								</button>
							</div>
						{/if}

						<!-- Show interactive elements for the last assistant message if it matches current flow -->
						{#if message.role === 'assistant' && i === $messages.length - 1 && conversationFlows.flows[currentFlowId] && !message.showGuidedOption}
							<!-- Display options (buttons) -->
							{#if conversationFlows.flows[currentFlowId]?.flowType === 'options' && conversationFlows.flows[currentFlowId]?.options?.length > 0}
								<div class="inline-options">
									{#each conversationFlows.flows[currentFlowId].options as option}
										<button on:click={() => selectOption(option.id)}>
											{option.label}
										</button>
									{/each}
								</div>
							{/if}

							<!-- Display input fields -->
							{#if conversationFlows.flows[currentFlowId]?.flowType === 'inputs' && conversationFlows.flows[currentFlowId]?.inputs?.length > 0}
								<div class="input-options">
									{#each conversationFlows.flows[currentFlowId].inputs as input}
										<div class="input-option">
											{#if input.label}
												<p>{input.label}</p>
											{/if}

											<div class="input-group">
												{#if input.type === 'number'}
													<input
														type="number"
														bind:value={inputValues[input.id]}
														placeholder={input.placeholder || ''}
													/>
												{:else if input.type === 'text'}
													<input
														type="text"
														bind:value={inputValues[input.id]}
														placeholder={input.placeholder || ''}
													/>
												{:else if input.type === 'tel'}
													<input
														type="tel"
														bind:value={inputValues[input.id]}
														placeholder={input.placeholder || ''}
													/>
												{:else if input.type === 'email'}
													<input
														type="email"
														bind:value={inputValues[input.id]}
														placeholder={input.placeholder || ''}
													/>
												{:else if input.type === 'button'}
													<!-- Button-type input, no actual input field needed -->
												{:else}
													<input
														type="text"
														bind:value={inputValues[input.id]}
														placeholder={input.placeholder || ''}
													/>
												{/if}
												{#if input.unit}
													<span>{input.unit}</span>
												{/if}
											</div>

											{#if input.type !== 'button'}
												<button
													on:click={() => submitInput(input.id, inputValues[input.id])}
													disabled={!inputValues[input.id]}
												>
													Submit
												</button>
											{:else}
												<button on:click={() => submitInput(input.id, input.label || true)}>
													{input.label || 'Submit'}
												</button>
											{/if}
										</div>
									{/each}
								</div>
							{/if}

							<!-- Display form (NEW) -->
							{#if conversationFlows.flows[currentFlowId]?.flowType === 'form' && conversationFlows.flows[currentFlowId]?.inputs?.length > 0}
								<div class="form-container">
									{#each conversationFlows.flows[currentFlowId].inputs as input}
										<div class="form-field">
											<label for={input.id}>
												{input.label}{input.required ? ' *' : ''}
											</label>

											{#if input.type === 'text'}
												<input
													id={input.id}
													type="text"
													bind:value={formValues[input.id]}
													placeholder={input.placeholder || ''}
													class:error={formErrors[input.id]}
												/>
											{:else if input.type === 'tel'}
												<input
													id={input.id}
													type="tel"
													bind:value={formValues[input.id]}
													placeholder={input.placeholder || ''}
													class:error={formErrors[input.id]}
												/>
											{:else if input.type === 'email'}
												<input
													id={input.id}
													type="email"
													bind:value={formValues[input.id]}
													placeholder={input.placeholder || ''}
													class:error={formErrors[input.id]}
												/>
											{:else if input.type === 'number'}
												<input
													id={input.id}
													type="number"
													bind:value={formValues[input.id]}
													placeholder={input.placeholder || ''}
													class:error={formErrors[input.id]}
												/>
											{:else}
												<input
													id={input.id}
													type="text"
													bind:value={formValues[input.id]}
													placeholder={input.placeholder || ''}
													class:error={formErrors[input.id]}
												/>
											{/if}

											{#if formErrors[input.id]}
												<span class="error-message">{formErrors[input.id]}</span>
											{/if}
										</div>
									{/each}

									<button
										class="form-submit-button"
										on:click={submitForm}
										disabled={!isFormValid || isLoading || isSubmittingForm}
									>
										{#if isSubmittingForm}
											Submitting...
										{:else if isLoading}
											Processing...
										{:else}
											Submit Consultation Request
										{/if}
									</button>
								</div>
							{/if}
						{/if}
					</div>
				</div>
			</div>
		{/each}

		{#if isLoading}
			<div class="loading-indicator">
				<span>●</span><span>●</span><span>●</span>
			</div>
		{/if}

		<!-- Extra space div after all messages -->
		<div class="chat-bottom-space"></div>
	</div>

	<!-- Chat input - only show for freeform conversations -->
	{#if conversationFlows.flows[currentFlowId]?.flowType === 'freeform'}
		<div class="chat-input">
			<input
				type="text"
				bind:value={userInput}
				placeholder="Ask a question about solar installation..."
				on:keypress={(e) => e.key === 'Enter' && sendMessage()}
			/>
			<button on:click={sendMessage} disabled={isLoading || !userInput.trim()}>
				{isLoading ? 'Sending...' : 'Send'}
			</button>
		</div>
	{/if}

	<div class="reset-container">
		<button class="reset-button" on:click={resetChat}>Reset Chat</button>
	</div>
</div>

<style>
	/* Updated ChatBot Styling */
	.chatbot-container {
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
		border: 1px solid #ddd;
		border-radius: var(--border-radius-md, 8px);
		box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.1));
		display: flex;
		flex-direction: column;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		height: 700px;
		min-height: 600px;
		max-height: 100vh;
		font-family: var(--font-family, 'Poppins', Arial, sans-serif);
	}

	.chatbot-header {
		padding: 1rem;
		text-align: center;
		border-bottom: 1px solid #ddd;
		background-color: var(--primary-color, #0056b3);
		color: white;
		border-radius: var(--border-radius-md, 8px) var(--border-radius-md, 8px) 0 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.chatbot-header h3 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	/* Disclaimer Banner Styles */
	.disclaimer-banner {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #ddd;
		font-size: 0.875rem;
		background-color: #f8f9fa;
	}

	.disclaimer-banner p {
		margin: 0;
		color: #6c757d;
		line-height: 1.4;
	}

	.chat-history {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		transition: background-color 0.3s ease;
		display: flex;
		flex-direction: column;
		min-height: 400px;
		scroll-behavior: smooth;
	}

	/* Space at the bottom of chat */
	.chat-bottom-space {
		height: 20px;
		min-height: 20px;
		padding-bottom: 20px;
		margin-bottom: 20px;
	}

	.message {
		margin-bottom: 1rem;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		word-wrap: break-word;
	}

	.message.user {
		justify-content: flex-end;
	}

	.message.assistant {
		justify-content: flex-start;
	}

	.bot-avatar {
		flex-shrink: 0;
		margin-top: 0.25rem;
	}

	.bot-avatar img {
		border-radius: 50%;
		display: block;
	}

	.message-bubble {
		max-width: 85%;
		border-radius: 18px;
		box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.message.user .message-bubble {
		border-bottom-right-radius: 4px;
	}

	.message.assistant .message-bubble {
		border-bottom-left-radius: 4px;
	}

	.message-header {
		padding: 0.5rem 1rem 0.25rem 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		opacity: 0.8;
		border-radius: 18px 18px 0 0;
	}

	.message-content {
		padding: 0.5rem 1rem 0.75rem 1rem;
		border-radius: 0 0 18px 18px;
	}

	.message-content p {
		margin: 0 0 0.5rem 0;
		line-height: 1.5;
		font-size: 1rem;
		/* ADD THIS LINE to preserve whitespace formatting */
		white-space: pre-wrap;
	}

	/* Inline options - buttons appear within messages */
	.inline-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.5rem;
		width: 100%;
	}

	.inline-options button {
		background-color: var(--primary-color, #0056b3);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.75rem 1rem;
		text-align: left;
		cursor: pointer;
		font-size: 1rem;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
		width: 100%;
		margin-bottom: 0.5rem;
	}

	.inline-options button:hover {
		background-color: var(--primary-hover, #004494);
		transform: translateY(-2px);
	}

	/* Input options styles */
	.input-options {
		margin-top: 1rem;
	}

	.input-option {
		margin-bottom: 1rem;
		padding: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.input-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.input-group input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.input-option button {
		background-color: var(--primary-color, #0056b3);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.input-option button:hover:not(:disabled) {
		background-color: var(--primary-hover, #004494);
	}

	.input-option button:disabled {
		background-color: #b7cce4;
		cursor: not-allowed;
	}

	/* Form Container Styles */
	.form-container {
		margin-top: 1rem;
		padding: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.form-field {
		margin-bottom: 1rem;
	}

	.form-field label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #333;
	}

	.form-field input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
		box-sizing: border-box;
	}

	.form-field input:focus {
		outline: none;
		border-color: var(--primary-color, #0056b3);
		box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.2);
	}

	.form-field input.error {
		border-color: #dc3545;
		box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
	}

	.error-message {
		display: block;
		color: #dc3545;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.form-submit-button {
		width: 100%;
		padding: 0.875rem;
		background-color: var(--primary-color, #0056b3);
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.3s ease;
		margin-top: 0.5rem;
	}

	.form-submit-button:hover:not(:disabled) {
		background-color: var(--primary-hover, #004494);
	}

	.form-submit-button:disabled {
		background-color: #b7cce4;
		cursor: not-allowed;
	}

	.loading-indicator {
		align-self: flex-start;
		padding: 0.5rem;
		display: flex;
		gap: 4px;
	}

	.loading-indicator span {
		animation: pulsate 1.5s infinite ease-in-out;
		opacity: 0.3;
		font-size: 0.75rem;
	}

	.loading-indicator span:nth-child(2) {
		animation-delay: 0.3s;
	}

	.loading-indicator span:nth-child(3) {
		animation-delay: 0.6s;
	}

	@keyframes pulsate {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 1;
		}
	}

	/* Subtle background breathing animation */
	@keyframes breathing-background {
		0%,
		100% {
			background-color: #f8f9fa;
		}
		50% {
			background-color: #bbdefb;
		}
	}

	@keyframes breathing-background-dark {
		0%,
		100% {
			background-color: #333;
		}
		50% {
			background-color: #1a365d;
		}
	}

	.breathing-background {
		animation: breathing-background 1.8s ease-in-out infinite;
	}

	.dark-theme .breathing-background {
		animation: breathing-background-dark 1.8s ease-in-out infinite;
	}

	.chat-input {
		display: flex;
		padding: 1rem;
		transition: border-color 0.3s ease;
		border-top: 1px solid #ddd;
		border-radius: 0 0 var(--border-radius-md, 8px) var(--border-radius-md, 8px);
	}

	input {
		flex: 1;
		padding: 0.75rem;
		border-radius: 4px 0 0 4px;
		font-size: 1rem;
		transition:
			background-color 0.3s ease,
			color 0.3s ease,
			border-color 0.3s ease;
		border: 1px solid #ddd;
		border-right: none;
		outline: none;
	}

	.chat-input button {
		padding: 0.75rem 1.25rem;
		background-color: var(--primary-color, #0056b3);
		color: white;
		border: none;
		border-radius: 0 4px 4px 0;
		cursor: pointer;
		font-weight: bold;
		font-size: 1rem;
		transition: background-color 0.3s ease;
	}

	.chat-input button:hover {
		background-color: var(--primary-hover, #004494);
	}

	.chat-input button:disabled {
		background-color: #b7cce4;
		cursor: not-allowed;
	}

	/* Reset button container */
	.reset-container {
		padding: 0.5rem 1rem;
		border-top: 1px solid #ddd;
		text-align: center;
	}

	.reset-button {
		background-color: #6c757d;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.reset-button:hover {
		background-color: #5a6268;
	}

	/* Light Theme */
	.light-theme {
		background-color: white;
		color: #333;
	}

	.light-theme .chat-history {
		background-color: #e9ecef;
	}

	.light-theme .message.user .message-bubble {
		background-color: #0056b3;
		color: white;
	}

	.light-theme .message.user .message-header {
		color: rgba(255, 255, 255, 0.9);
	}

	.light-theme .message.assistant .message-bubble {
		background-color: #f8f9fa;
		color: #333;
		border: 1px solid #e9ecef;
	}

	.light-theme .message.assistant .message-header {
		color: #6c757d;
	}

	.light-theme input {
		background-color: white;
		color: #333;
	}

	.light-theme .form-container {
		background-color: #f9f9f9;
		border-color: #e0e0e0;
	}

	.light-theme .input-option {
		background-color: #f9f9f9;
		border-color: #e0e0e0;
	}

	/* Dark Theme */
	.dark-theme {
		background-color: #1a1a1a;
		color: #f0f0f0;
		border-color: #444;
	}

	.dark-theme .chatbot-header {
		border-bottom-color: #444;
		background-color: #2a374a;
	}

	.dark-theme .chat-history {
		background-color: #333;
	}

	.dark-theme .message.user .message-bubble {
		background-color: #2c5282;
		color: white;
	}

	.dark-theme .message.user .message-header {
		color: rgba(255, 255, 255, 0.9);
	}

	.dark-theme .message.assistant .message-bubble {
		background-color: #374151;
		color: #f9fafb;
		border: 1px solid #4b5563;
	}

	.dark-theme .message.assistant .message-header {
		color: #9ca3af;
	}

	.dark-theme .inline-options button {
		background-color: #2e7bc4;
	}

	.dark-theme .inline-options button:hover {
		background-color: #3884cb;
	}

	.dark-theme .disclaimer-banner {
		background-color: #333;
		border-bottom: 1px solid #444;
	}

	.dark-theme .disclaimer-banner p {
		color: #adb5bd;
	}

	.dark-theme .chat-input {
		border-top: 1px solid #444;
	}

	.dark-theme input {
		border: 1px solid #555;
		background-color: #444;
		color: #fff;
	}

	.dark-theme .form-container {
		background-color: #2a2a2a;
		border-color: #555;
	}

	.dark-theme .form-field label {
		color: #f0f0f0;
	}

	.dark-theme .form-field input {
		background-color: #444;
		border-color: #555;
		color: #fff;
	}

	.dark-theme .form-field input:focus {
		border-color: #2e7bc4;
		box-shadow: 0 0 0 2px rgba(46, 123, 196, 0.2);
	}

	.dark-theme .input-option {
		background-color: #2a2a2a;
		border-color: #555;
	}

	.dark-theme .input-option button {
		background-color: #2e7bc4;
	}

	.dark-theme .input-option button:hover:not(:disabled) {
		background-color: #3884cb;
	}

	.dark-theme .reset-container {
		border-top: 1px solid #444;
	}

	.dark-theme .reset-button {
		background-color: #495057;
	}

	.dark-theme .reset-button:hover {
		background-color: #343a40;
	}

	/* Media queries for better responsiveness */
	@media (min-width: 768px) {
		.chatbot-container {
			max-width: 85%;
		}
	}

	@media (min-width: 992px) {
		.chatbot-container {
			max-width: 75%;
		}
	}

	@media (min-width: 1200px) {
		.chatbot-container {
			max-width: 65%;
		}
	}

	/* Media queries for mobile responsiveness */
	@media (max-width: 768px) {
		.chatbot-container {
			min-height: 450px;
			max-width: 100%;
			border-radius: 0;
			margin: 0;
			border-left: none;
			border-right: none;
		}

		.message {
			max-width: 90%;
		}

		.disclaimer-banner {
			padding: 0.5rem;
			font-size: 0.75rem;
		}

		.chat-input {
			padding: 0.75rem;
		}

		.chat-input button {
			padding: 0.75rem 1rem;
		}

		.chatbot-header {
			flex-direction: column;
			gap: 0.5rem;
		}

		.chatbot-header h3 {
			font-size: 1.25rem;
		}

		.inline-options button {
			padding: 0.6rem 0.75rem;
			font-size: 0.9rem;
		}

		.message-content p {
			font-size: 0.9rem;
		}

		input {
			font-size: 0.9rem;
		}

		.form-container {
			padding: 0.75rem;
		}

		.form-field input {
			padding: 0.6rem;
			font-size: 0.9rem;
		}

		.form-submit-button {
			padding: 0.75rem;
			font-size: 0.9rem;
		}

		.input-option {
			padding: 0.75rem;
		}
	}
</style>
