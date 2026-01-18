<script>
  import { tick } from "svelte";
  import { writable, get } from "svelte/store";
  import { isDarkMode } from "$lib/themeStore.svelte";
  import conversationFlows from "$lib/in/conversationFlows.json";
  import { page } from "$app/stores";

  // Import utility modules
  import * as leadProfileMgr from "$lib/in/chatbot/leadProfileManager";
  import * as validation from "$lib/in/chatbot/chatbotValidation";
  import * as scrollMgr from "$lib/in/chatbot/scrollManager";
  import * as messageMgr from "$lib/in/chatbot/messageProcessor";
  import * as conversationMgr from "$lib/in/chatbot/conversationManager";
  import * as api from "$lib/in/chatbot/chatbotApi";
  import * as stateMgr from "$lib/in/chatbot/stateManager";

  let { messages = writable([]), onClose = null } = $props();

  // Chat state
  let userInput = $state("");
  let isLoading = $state(false);
  let currentFlowId = $state("initial");
  let inputValues = $state({});

  // Form state
  let formValues = $state({});
  let formErrors = $state({});
  let isFormValid = $state(false);
  let isSubmittingForm = $state(false);
  let hasAttemptedSubmit = $state(false);

  // URL parameter for tracking
  let urlParam = $state("");

  // Track user journey for type field
  let userJourney = $state([]);

  // Context handoff for LLM chatbot
  let conversationContext = $state("");
  let contextSent = $state(false);

  // Reference to chat history container for scrolling
  let chatHistoryContainer;

  // Scroll state management
  let scrollState = $state(scrollMgr.createScrollState());

  // Animation state management
  let hasUserInteracted = $state(false);

  // Lead profile state
  let leadProfile = $state(leadProfileMgr.createLeadProfile());

  // Reactive statement to get URL parameter
  $effect(() => {
    urlParam = $page.url.pathname;
  });

  // Orchestration: Update lead profile and save
  function updateLeadProfileLocal(field, value) {
    leadProfile = leadProfileMgr.updateLeadProfile(leadProfile, field, value);
    leadProfileMgr.saveLeadProfile(leadProfile);
  }

  // Orchestration: Add to user journey
  function addToUserJourneyLocal(type, value) {
    userJourney = leadProfileMgr.addToUserJourney(userJourney, type, value);
  }

  // Orchestration: Stop background animation
  function stopBackgroundAnimationLocal() {
    scrollState = scrollMgr.stopBackgroundAnimation(scrollState);
    hasUserInteracted = scrollState.hasUserInteracted;
  }

  // Orchestration: Start guided assessment flow
  async function startGuidedFlow() {
    stopBackgroundAnimationLocal();

    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("chatbot-guided-flow-started");
    }

    messages.update((m) => [
      ...m,
      { role: "user", content: "Yes, start assessment" },
    ]);

    await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
    isLoading = true;
    await simulateDelay(800 + Math.random() * 1200);
    await transitionToFlowWrapper("guidedAssessmentStart");
    isLoading = false;
    await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
  }

  // Orchestration: Dismiss guided flow suggestion
  function dismissGuidedSuggestion(messageIndex) {
    stopBackgroundAnimationLocal();

    messages.update((m) => {
      const updated = [...m];
      if (updated[messageIndex]) {
        updated[messageIndex] = {
          ...updated[messageIndex],
          showGuidedOption: false,
        };
      }
      return updated;
    });
  }

  // Orchestration: Send free-form user message to backend
  async function sendMessage() {
    if (!userInput.trim()) return;

    stopBackgroundAnimationLocal();

    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("chatbot-freeform-message", { flow: currentFlowId });
    }

    messages.update((m) => [...m, { role: "user", content: userInput }]);
    isLoading = true;
    await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);

    try {
      if (!contextSent) {
        conversationContext = conversationMgr.serializeConversationContext(
          leadProfile,
          currentFlowId,
          conversationFlows
        );
        contextSent = true;
      }

      const response = await api.sendChatMessage({
        userMessage: userInput,
        leadProfile,
        conversationContext: contextSent ? conversationContext : undefined,
      });

      if (response.success) {
        const reply = response.reply;
        if (reply.includes("SUGGEST_GUIDED_FLOW:")) {
          const [mainReply, suggestion] = reply.split("SUGGEST_GUIDED_FLOW:");
          messages.update((m) => [
            ...m,
            { role: "assistant", content: mainReply.trim() },
          ]);
          await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);

          setTimeout(async () => {
            messages.update((m) => [
              ...m,
              {
                role: "assistant",
                content: suggestion.trim(),
                showGuidedOption: true,
              },
            ]);
            await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
          }, 1000);
        } else {
          messages.update((m) => [...m, { role: "assistant", content: reply }]);
          await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
        }
      }
    } catch (err) {
      console.error("Error communicating with chatbot:", err);
      messages.update((m) => [
        ...m,
        {
          role: "assistant",
          content: "Something went wrong. Please try again later.",
        },
      ]);
      await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
    } finally {
      userInput = "";
      isLoading = false;
    }
  }

  // Helper function to simulate a delay for natural conversation
  function simulateDelay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Orchestration: Handle form submission
  async function submitForm() {
    stopBackgroundAnimationLocal();
    hasAttemptedSubmit = true;

    const currentFlow = conversationFlows.flows[currentFlowId];
    const validationResult = validation.validateChatbotForm(
      currentFlow,
      formValues,
      hasAttemptedSubmit
    );

    formErrors = validationResult.errors;
    isFormValid = validationResult.isValid;

    if (!validationResult.isValid) {
      if (typeof window !== "undefined" && window.umami) {
        window.umami.track("chatbot-form-validation-failed", {
          flow: currentFlowId,
        });
      }
      return;
    }

    isSubmittingForm = true;

    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("chatbot-form-submitted", { flow: currentFlowId });
    }

    try {
      // Update lead profile with form values
      if (formValues.customerName)
        leadProfile = leadProfileMgr.updateLeadProfile(
          leadProfile,
          "name",
          formValues.customerName
        );
      if (formValues.customerPhone)
        leadProfile = leadProfileMgr.updateLeadProfile(
          leadProfile,
          "phone",
          formValues.customerPhone
        );
      if (formValues.customerEmail)
        leadProfile = leadProfileMgr.updateLeadProfile(
          leadProfile,
          "email",
          formValues.customerEmail
        );
      if (formValues.customerPinCode)
        leadProfile = leadProfileMgr.updateLeadProfile(
          leadProfile,
          "pincode",
          formValues.customerPinCode
        );

      leadProfileMgr.saveLeadProfile(leadProfile);

      const userJourneyString = userJourney.join(", ");

      const result = await api.submitLeadForm({
        name: formValues.customerName || "",
        phone: formValues.customerPhone || "",
        pinCode: formValues.customerPinCode || "",
        email: formValues.customerEmail || "",
        comment: formValues.customerComment || "",
        type: userJourneyString,
        urlParam: urlParam,
      });

      if (result.success) {
        const formSummary = Object.entries(formValues)
          .filter(([key, value]) => value && value.trim())
          .map(([key, value]) => {
            const input = currentFlow.inputs.find((inp) => inp.id === key);
            return `${input?.label || key}: ${value}`;
          })
          .join("\n");

        messages.update((m) => [
          ...m,
          { role: "user", content: `Form submitted:\n${formSummary}` },
        ]);

        await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);

        Object.keys(formValues).forEach((key) => {
          inputValues[key] = formValues[key];
        });

        isLoading = true;
        await simulateDelay(800 + Math.random() * 1200);

        formValues = {};
        formErrors = {};
        hasAttemptedSubmit = false;

        if (currentFlow.nextFlow) {
          await transitionToFlowWrapper(currentFlow.nextFlow);
        }

        isLoading = false;
        await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
      } else {
        messages.update((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Sorry, there was an error submitting your form. Please try again or contact us directly.",
          },
        ]);
        await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
      }
    } catch (error) {
      messages.update((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry, there was a network error. Please check your connection and try again.",
        },
      ]);
      await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
    } finally {
      isSubmittingForm = false;
    }
  }

  // Orchestration: Handle option selection
  async function selectOption(optionId) {
    stopBackgroundAnimationLocal();

    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("chatbot-option-selected", {
        flow: currentFlowId,
        option: optionId,
      });
    }

    addToUserJourneyLocal("option", optionId);

    if (currentFlowId === "guidedAssessmentStart") {
      if (["residential", "business", "agriculture"].includes(optionId)) {
        leadProfile = leadProfileMgr.updateLeadProfile(
          leadProfile,
          "propertyType",
          optionId
        );
      }
    }

    if (currentFlowId === "residentialType") {
      leadProfile = leadProfileMgr.updateLeadProfile(
        leadProfile,
        "propertySubtype",
        optionId
      );
    }

    const currentFlow = conversationFlows.flows[currentFlowId];
    if (!currentFlow || !currentFlow.options) return;

    const selectedOption = currentFlow.options.find(
      (opt) => opt.id === optionId
    );
    if (!selectedOption) return;

    messages.update((m) => [
      ...m,
      { role: "user", content: selectedOption.label },
    ]);

    await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
    inputValues[currentFlowId] = optionId;
    isLoading = true;
    await simulateDelay(800 + Math.random() * 1200);

    if (selectedOption.nextFlow) {
      await transitionToFlowWrapper(selectedOption.nextFlow);
    }

    isLoading = false;
    await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
  }

  // Orchestration: Handle input submission
  async function submitInput(inputId, value) {
    stopBackgroundAnimationLocal();

    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("chatbot-input-submitted", {
        flow: currentFlowId,
        inputId: inputId,
      });
    }

    addToUserJourneyLocal("input", `${inputId} = ${value}`);

    if (inputId === "monthlyConsumption") {
      leadProfile = leadProfileMgr.updateLeadProfile(
        leadProfile,
        "monthlyConsumption",
        Number(value)
      );
    } else if (inputId === "monthlyBill") {
      leadProfile = leadProfileMgr.updateLeadProfile(
        leadProfile,
        "monthlyBill",
        Number(value)
      );
    } else if (inputId === "powerCuts") {
      leadProfile = leadProfileMgr.updateLeadProfile(
        leadProfile,
        "powerCutHours",
        Number(value)
      );
    }

    const currentFlow = conversationFlows.flows[currentFlowId];
    if (!currentFlow || !currentFlow.inputs) return;

    const inputDef = currentFlow.inputs.find((inp) => inp.id === inputId);
    if (!inputDef) return;

    let userMessage = inputDef.label
      ? `${inputDef.label}: ${value}`
      : `${value}`;
    if (inputDef.unit) userMessage += ` ${inputDef.unit}`;

    messages.update((m) => [...m, { role: "user", content: userMessage }]);
    await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);

    if (inputDef.type === "number") {
      inputValues[inputId] = Number(value);
    } else {
      inputValues[inputId] = value;
    }

    isLoading = true;
    await simulateDelay(800 + Math.random() * 1200);

    if (inputDef.nextFlow) {
      await transitionToFlowWrapper(inputDef.nextFlow);
    }

    isLoading = false;
    await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
  }

  // Orchestration: Wrapper for transitionToFlow from conversationManager
  async function transitionToFlowWrapper(flowId) {
    try {
      const result = conversationMgr.transitionToFlow(
        flowId,
        conversationFlows,
        { currentFlowId, conversationContext, contextSent },
        leadProfile,
        inputValues,
        userJourney
      );

      currentFlowId = result.updatedState.currentFlowId;
      contextSent = result.updatedState.contextSent;
      conversationContext = result.updatedState.conversationContext;
      leadProfile = result.updatedProfile;
      inputValues = result.updatedInputValues;
      userJourney = result.updatedJourney;

      messages.update((m) => [
        ...m,
        { role: "assistant", content: result.processedMessage },
      ]);

      stateMgr.saveChatState({
        messages: get(messages),
        currentFlowId,
        inputValues,
        conversationContext,
        contextSent,
        leadProfile,
        formValues,
        userJourney,
      });

      await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
    } catch (error) {
      console.error("Error transitioning to flow:", error);
    }
  }

  // Orchestration: Reset chat to initial state
  async function resetChat() {
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("chatbot-reset");
    }

    messages.set([]);
    currentFlowId = "initial";
    inputValues = {};
    formValues = {};
    formErrors = {};
    hasAttemptedSubmit = false;
    userJourney = [];
    conversationContext = "";
    contextSent = false;
    leadProfile = leadProfileMgr.createLeadProfile();
    scrollState = scrollMgr.createScrollState();

    stateMgr.clearChatState();
    leadProfileMgr.clearLeadProfile();

    await transitionToFlowWrapper("initial");
    await scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
  }

  // Orchestration: Initialize chat from localStorage
  async function initializeChat() {
    if (typeof window === "undefined") return;

    const savedProfile = leadProfileMgr.loadLeadProfile();
    if (savedProfile) {
      leadProfile = savedProfile;
    }

    const savedState = stateMgr.loadChatState();
    if (savedState && savedState.messages.length > 0) {
      messages.set(savedState.messages);
      currentFlowId = savedState.currentFlowId;
      inputValues = savedState.inputValues;
      conversationContext = savedState.conversationContext;
      contextSent = savedState.contextSent;
      leadProfile = savedState.leadProfile;
      formValues = savedState.formValues;
      userJourney = savedState.userJourney;
    } else {
      await transitionToFlowWrapper("initial");
    }
  }

  // Load state and set up scroll handler on mount
  $effect(() => {
    if (typeof window !== "undefined") {
      window.resetChat = resetChat;
      initializeChat();
      scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
    }
  });

  // Check if we should auto-scroll after new content
  $effect(() => {
    if (chatHistoryContainer) {
      scrollState = scrollMgr.handleScroll(chatHistoryContainer, scrollState);
      if (
        chatHistoryContainer.scrollHeight > scrollState.lastScrollHeight &&
        !scrollState.isUserScrolledUp
      ) {
        scrollMgr.scrollToBottom(chatHistoryContainer, scrollState);
      }
    }
  });

  // Validate form whenever formValues change
  $effect(() => {
    if (
      conversationFlows.flows[currentFlowId]?.flowType === "form" &&
      formValues
    ) {
      const result = validation.validateChatbotForm(
        conversationFlows.flows[currentFlowId],
        formValues,
        hasAttemptedSubmit
      );
      formErrors = result.errors;
      isFormValid = result.isValid;
    }
  });

  // Handle scroll events
  function handleScroll() {
    if (chatHistoryContainer) {
      scrollState = scrollMgr.handleScroll(chatHistoryContainer, scrollState);
    }
  }
</script>

<div class="chatbot-container {$isDarkMode ? 'dark-theme' : 'light-theme'}">
  <div class="chatbot-header">
    <h3>Calculate Price and Savings</h3>
    {#if onClose}
      <button class="header-close-button" onclick={onClose} aria-label="Close chatbot">
        ×
      </button>
    {/if}
  </div>

  <!-- Chat history -->
  <div
    class="chat-history {!hasUserInteracted ? 'breathing-background' : ''}"
    bind:this={chatHistoryContainer}
    onscroll={handleScroll}
  >
    {#each $messages as message, i}
      <div class="message {message.role}">
        {#if message.role === "assistant"}
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
            <span
              >{message.role === "user" ? "You" : "SolarVipani Assistant"}</span
            >
          </div>
          <div class="message-content">
            <p>{@html message.content}</p>

            <!-- Show guided flow suggestion -->
            {#if message.showGuidedOption}
              <div class="guided-flow-suggestion">
                <button class="start-guided-btn" onclick={startGuidedFlow}>
                  Yes, start assessment
                </button>
                <button
                  class="continue-chat-btn"
                  onclick={() => dismissGuidedSuggestion(i)}
                >
                  No, continue chatting
                </button>
              </div>
            {/if}

            <!-- Show interactive elements for the last assistant message if it matches current flow -->
            {#if message.role === "assistant" && i === $messages.length - 1 && conversationFlows.flows[currentFlowId] && !message.showGuidedOption}
              <!-- Display options (buttons) -->
              {#if conversationFlows.flows[currentFlowId]?.flowType === "options" && conversationFlows.flows[currentFlowId]?.options?.length > 0}
                <div class="inline-options">
                  {#each conversationFlows.flows[currentFlowId].options as option}
                    <button onclick={() => selectOption(option.id)}>
                      {option.label}
                    </button>
                  {/each}
                </div>
              {/if}

              <!-- Display input fields -->
              {#if conversationFlows.flows[currentFlowId]?.flowType === "inputs" && conversationFlows.flows[currentFlowId]?.inputs?.length > 0}
                <div class="input-options">
                  {#each conversationFlows.flows[currentFlowId].inputs as input}
                    <div class="input-option">
                      {#if input.label}
                        <p>{input.label}</p>
                      {/if}

                      <div class="input-group">
                        {#if input.type === "number"}
                          <input
                            type="number"
                            bind:value={inputValues[input.id]}
                            placeholder={input.placeholder || ""}
                          />
                        {:else if input.type === "text"}
                          <input
                            type="text"
                            bind:value={inputValues[input.id]}
                            placeholder={input.placeholder || ""}
                          />
                        {:else if input.type === "tel"}
                          <input
                            type="tel"
                            bind:value={inputValues[input.id]}
                            placeholder={input.placeholder || ""}
                          />
                        {:else if input.type === "email"}
                          <input
                            type="email"
                            bind:value={inputValues[input.id]}
                            placeholder={input.placeholder || ""}
                          />
                        {:else if input.type === "button"}
                          <!-- Button-type input, no actual input field needed -->
                        {:else}
                          <input
                            type="text"
                            bind:value={inputValues[input.id]}
                            placeholder={input.placeholder || ""}
                          />
                        {/if}
                        {#if input.unit}
                          <span>{input.unit}</span>
                        {/if}
                      </div>

                      {#if input.type !== "button"}
                        <button
                          onclick={() =>
                            submitInput(input.id, inputValues[input.id])}
                          disabled={!inputValues[input.id]}
                        >
                          Submit
                        </button>
                      {:else}
                        <button
                          onclick={() =>
                            submitInput(input.id, input.label || true)}
                        >
                          {input.label || "Submit"}
                        </button>
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}

              <!-- Display form (NEW) -->
              {#if conversationFlows.flows[currentFlowId]?.flowType === "form" && conversationFlows.flows[currentFlowId]?.inputs?.length > 0}
                <div class="form-container">
                  {#each conversationFlows.flows[currentFlowId].inputs as input}
                    <div class="form-field">
                      <label for={input.id}>
                        {input.label}{input.required ? " *" : ""}
                      </label>

                      {#if input.type === "text"}
                        <input
                          id={input.id}
                          type="text"
                          bind:value={formValues[input.id]}
                          placeholder={input.placeholder || ""}
                          class:error={formErrors[input.id]}
                        />
                      {:else if input.type === "tel"}
                        <input
                          id={input.id}
                          type="tel"
                          bind:value={formValues[input.id]}
                          placeholder={input.placeholder || ""}
                          class:error={formErrors[input.id]}
                        />
                      {:else if input.type === "email"}
                        <input
                          id={input.id}
                          type="email"
                          bind:value={formValues[input.id]}
                          placeholder={input.placeholder || ""}
                          class:error={formErrors[input.id]}
                        />
                      {:else if input.type === "number"}
                        <input
                          id={input.id}
                          type="number"
                          bind:value={formValues[input.id]}
                          placeholder={input.placeholder || ""}
                          class:error={formErrors[input.id]}
                        />
                      {:else}
                        <input
                          id={input.id}
                          type="text"
                          bind:value={formValues[input.id]}
                          placeholder={input.placeholder || ""}
                          class:error={formErrors[input.id]}
                        />
                      {/if}

                      {#if formErrors[input.id]}
                        <span class="error-message">{formErrors[input.id]}</span
                        >
                      {/if}
                    </div>
                  {/each}

                  <button
                    class="form-submit-button"
                    onclick={submitForm}
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
  {#if conversationFlows.flows[currentFlowId]?.flowType === "freeform"}
    <div class="chat-input">
      <input
        type="text"
        bind:value={userInput}
        placeholder="Ask a question about solar installation..."
        onkeypress={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onclick={sendMessage} disabled={isLoading || !userInput.trim()}>
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  {/if}

  <div class="reset-container">
    <button class="reset-button" onclick={resetChat}>Reset Chat</button>
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
    font-family: var(--font-family, "Poppins", Arial, sans-serif);
  }

  .chatbot-header {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #ddd;
    background-color: var(--primary-color, #0056b3);
    color: white;
    border-radius: var(--border-radius-md, 8px) var(--border-radius-md, 8px) 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .header-close-button {
    position: absolute;
    right: 10px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    color: white;
    font-size: 1.5rem;
    line-height: 1;
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .header-close-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
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
