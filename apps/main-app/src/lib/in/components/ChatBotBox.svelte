<script lang="ts">
  import { tick } from "svelte";
  import { writable, get } from "svelte/store";
  import conversationFlows from "$lib/in/conversationFlows.json";
  import { page } from "$app/stores";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Badge } from "$lib/components/ui/badge";
  import { X, Send } from "@lucide/svelte";

  let { messages = writable<any[]>([]), onClose = null }: { messages?: any; onClose?: any } = $props();

  // Chat state
  let userInput = $state("");
  let isLoading = $state(false);
  let currentFlowId = $state("initial");

  // Helper to get current flow with proper typing
  let currentFlow = $derived((conversationFlows.flows as Record<string, any>)[currentFlowId]);
  let inputValues: Record<string, any> = $state({});

  // Form state
  let formValues: Record<string, any> = $state({});
  let formErrors: Record<string, string> = $state({});
  let isFormValid = $state(false);
  let isSubmittingForm = $state(false);
  let hasAttemptedSubmit = $state(false);

  // URL parameter and journey tracking
  let urlParam = $state("");
  let userJourney: (string | any)[] = $state([]);

  // Conversation context
  let conversationContext = $state("");
  let contextSent = $state(false);

  // Scroll and animation state
  let chatHistoryContainer: HTMLDivElement | undefined;
  let isUserScrolledUp = $state(false);
  let lastScrollHeight = $state(0);

  // Lead Profile Data
  let leadProfile: Record<string, any> = {
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
    netInvestment: null,
  };

  // Reactive effect for URL parameter
  $effect(() => {
    urlParam = $page.url.pathname;
  });

  function stopBackgroundAnimation() {}

  function updateLeadProfile(field: string, value: any) {
    leadProfile[field] = value;
    console.log(`Lead Profile Updated: ${field} = ${value}`);
    saveLeadProfile();
  }

  function saveLeadProfile() {
    if (typeof window !== "undefined") {
      localStorage.setItem("leadProfile", JSON.stringify(leadProfile));
    }
  }

  function loadLeadProfile() {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("leadProfile");
      if (savedProfile) {
        leadProfile = JSON.parse(savedProfile);
      }
    }
  }

  function addToUserJourney(type: string, value: any) {
    if (type === "formSubmission" || (type === "input" && ["customerName", "customerPhone", "customerPinCode", "customerEmail", "customerComment"].includes(value))) {
      return;
    }
    const journeyEntry = type === "input" ? `${value}` : value;
    userJourney.push(journeyEntry);
  }

  function serializeConversationContext() {
    let contextLines = [];
    contextLines.push("=== Lead Profile ===");
    Object.entries(leadProfile).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
        contextLines.push(`${formattedKey}: ${value}`);
      }
    });
    contextLines.push("");
    const currentFlow = (conversationFlows.flows as Record<string, any>)[currentFlowId];
    if (currentFlow && currentFlowId !== "initial" && currentFlowId !== "welcome") {
      contextLines.push(`Current Flow: ${currentFlowId}`);
      if (currentFlow.message) {
        contextLines.push(`Current Context: ${processMessageText(currentFlow.message)}`);
      }
    }
    return contextLines.join("\n");
  }

  // Form validation functions
  function validatePhoneNumber(phone: any) {
    if (!phone || !/^\+?\d{10,16}$/.test(phone)) {
      return "Phone number must be between 10 and 16 digits, optionally starting with +";
    }
    return "";
  }

  function validateEmail(email: any) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email address";
    }
    return "";
  }

  function validatePinCode(pinCode: any) {
    if (!pinCode || !/^\d{6}$/.test(pinCode)) {
      return "Pin code must be exactly 6 digits";
    }
    return "";
  }

  function validateRequired(value: any, fieldName: string) {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return "";
  }

  function validateForm(showAllErrors = true) {
    const currentFlow = (conversationFlows.flows as Record<string, any>)[currentFlowId];
    if (!currentFlow || !currentFlow.inputs) {
      return false;
    }

    let isValid = true;
    const errors: Record<string, string> = {};

    currentFlow.inputs.forEach((input: any) => {
      const value = formValues[input.id] || "";
      let error = "";

      if (input.required && (showAllErrors || hasAttemptedSubmit)) {
        error = validateRequired(value, input.label);
      }

      if (!error && value) {
        switch (input.id) {
          case "customerPhone":
            error = validatePhoneNumber(value);
            break;
          case "customerEmail":
            error = validateEmail(value);
            break;
          case "customerPinCode":
            error = validatePinCode(value);
            break;
        }
      }

      let allErrors = "";
      if (input.required) {
        allErrors = validateRequired(value, input.label);
      }
      if (!allErrors && value) {
        switch (input.id) {
          case "customerPhone":
            allErrors = validatePhoneNumber(value);
            break;
          case "customerEmail":
            allErrors = validateEmail(value);
            break;
          case "customerPinCode":
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

  // Scroll functions
  async function scrollToBottom() {
    await tick();
    if (!isUserScrolledUp && chatHistoryContainer) {
      chatHistoryContainer.scrollTo({
        top: chatHistoryContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  function handleScroll() {
    if (!chatHistoryContainer) return;
    const scrollBottom = chatHistoryContainer.scrollHeight - chatHistoryContainer.scrollTop - chatHistoryContainer.clientHeight;
    isUserScrolledUp = scrollBottom > 100;
    if (scrollBottom < 20) {
      isUserScrolledUp = false;
    }
    lastScrollHeight = chatHistoryContainer.scrollHeight;
  }

  function simulateDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // User interaction handlers
  async function startGuidedFlow() {
    stopBackgroundAnimation();
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("chatbot-guided-flow-started");
    }

    messages.update((m: any[]) => [...m, { role: "user", content: "Yes, start assessment" }]);
    await scrollToBottom();

    isLoading = true;
    await simulateDelay(800 + Math.random() * 1200);

    await transitionToFlow("guidedAssessmentStart");

    isLoading = false;
    await scrollToBottom();
  }

  function dismissGuidedSuggestion(messageIndex: number) {
    stopBackgroundAnimation();
    messages.update((m: any[]) => {
      const updated = [...m];
      if (updated[messageIndex]) {
        updated[messageIndex] = { ...updated[messageIndex], showGuidedOption: false };
      }
      return updated;
    });
  }

  async function sendMessage() {
    if (!userInput.trim()) return;
    stopBackgroundAnimation();

    if (typeof window !== "undefined" && window.umami) {
      (window.umami as any).track("chatbot-freeform-message", { flow: currentFlowId });
    }

    messages.update((m: any[]) => [...m, { role: "user", content: userInput }]);
    isLoading = true;
    await scrollToBottom();

    try {
      let requestPayload: Record<string, any> = {
        userMessage: userInput,
        leadProfile: leadProfile,
      };

      if (!contextSent) {
        conversationContext = serializeConversationContext();
        if (conversationContext.trim()) {
          requestPayload.conversationContext = conversationContext;
        }
        contextSent = true;
      }

      const response = await fetch("/chatbot121212", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      const { reply } = await response.json();

      if (reply.includes("SUGGEST_GUIDED_FLOW:")) {
        const [mainReply, suggestion] = reply.split("SUGGEST_GUIDED_FLOW:");
        messages.update((m: any[]) => [...m, { role: "assistant", content: mainReply.trim() }]);
        await scrollToBottom();

        setTimeout(async () => {
          messages.update((m: any[]) => [...m, { role: "assistant", content: suggestion.trim(), showGuidedOption: true }]);
          await scrollToBottom();
        }, 1000);
      } else {
        messages.update((m: any[]) => [...m, { role: "assistant", content: reply }]);
        await scrollToBottom();
      }
    } catch (err) {
      console.error("Error communicating with chatbot:", err);
      messages.update((m: any[]) => [...m, { role: "assistant", content: "Something went wrong. Please try again later." }]);
      await scrollToBottom();
    } finally {
      userInput = "";
      isLoading = false;
    }
  }

  async function submitForm() {
    stopBackgroundAnimation();
    hasAttemptedSubmit = true;

    if (!validateForm()) {
      if (typeof window !== "undefined" && window.umami) {
        (window.umami as any).track("chatbot-form-validation-failed", { flow: currentFlowId });
      }
      return;
    }

    const currentFlow = (conversationFlows.flows as Record<string, any>)[currentFlowId];
    if (!currentFlow) return;

    isSubmittingForm = true;

    if (typeof window !== "undefined" && window.umami) {
      (window.umami as any).track("chatbot-form-submitted", { flow: currentFlowId });
    }

    try {
      if (formValues.customerName) updateLeadProfile("name", formValues.customerName);
      if (formValues.customerPhone) updateLeadProfile("phone", formValues.customerPhone);
      if (formValues.customerEmail) updateLeadProfile("email", formValues.customerEmail);
      if (formValues.customerPinCode) updateLeadProfile("pincode", formValues.customerPinCode);

      const userJourneyString = userJourney.join(", ");
      const formData = {
        name: formValues.customerName || "",
        phone: formValues.customerPhone || "",
        pinCode: formValues.customerPinCode || "",
        email: formValues.customerEmail || "",
        comment: formValues.customerComment || "",
        type: userJourneyString,
        urlParam: urlParam,
      };

      const response = await fetch("/api/submitLead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        const formSummary = Object.entries(formValues)
          .filter(([_key, value]) => value && value.trim())
          .map(([key, value]: [string, any]) => {
            const input = currentFlow.inputs.find((inp: any) => inp.id === key);
            return `${input?.label || key}: ${value}`;
          })
          .join("\n");

        messages.update((m: any[]) => [...m, { role: "user", content: `Form submitted:\n${formSummary}` }]);
        await scrollToBottom();

        Object.keys(formValues).forEach((key: string) => {
          inputValues[key] = formValues[key];
        });

        isLoading = true;
        await simulateDelay(800 + Math.random() * 1200);

        formValues = {};
        formErrors = {};
        hasAttemptedSubmit = false;

        if (currentFlow.nextFlow) {
          await transitionToFlow(currentFlow.nextFlow);
        }

        isLoading = false;
        await scrollToBottom();
      } else {
        messages.update((m: any[]) => [...m, { role: "assistant", content: "Sorry, there was an error submitting your form. Please try again or contact us directly." }]);
        await scrollToBottom();
      }
    } catch (error) {
      messages.update((m: any[]) => [...m, { role: "assistant", content: "Sorry, there was a network error. Please check your connection and try again." }]);
      await scrollToBottom();
    } finally {
      isSubmittingForm = false;
    }
  }

  async function selectOption(optionId: string) {
    stopBackgroundAnimation();

    if (typeof window !== "undefined" && window.umami) {
      (window.umami as any).track("chatbot-option-selected", { flow: currentFlowId, option: optionId });
    }

    addToUserJourney("option", optionId);

    if (currentFlowId === "guidedAssessmentStart") {
      if (["residential", "business", "agriculture"].includes(optionId)) {
        updateLeadProfile("propertyType", optionId);
      }
    }

    if (currentFlowId === "residentialType") {
      updateLeadProfile("propertySubtype", optionId);
    }

    const currentFlow = (conversationFlows.flows as Record<string, any>)[currentFlowId];
    if (!currentFlow || !currentFlow.options) return;

    const selectedOption = currentFlow.options.find((opt: any) => opt.id === optionId);
    if (!selectedOption) return;

    messages.update((m: any[]) => [...m, { role: "user", content: selectedOption.label }]);
    await scrollToBottom();

    inputValues[currentFlowId] = optionId;

    isLoading = true;
    await simulateDelay(800 + Math.random() * 1200);

    if (selectedOption.nextFlow) {
      await transitionToFlow(selectedOption.nextFlow);
    }

    isLoading = false;
    await scrollToBottom();
  }

  async function submitInput(inputId: string, value: string) {
    stopBackgroundAnimation();

    if (typeof window !== "undefined" && window.umami) {
      (window.umami as any).track("chatbot-input-submitted", { flow: currentFlowId, inputId: inputId });
    }

    addToUserJourney("input", `${inputId} = ${value}`);

    if (inputId === "monthlyConsumption") {
      updateLeadProfile("monthlyConsumption", Number(value));
    } else if (inputId === "monthlyBill") {
      updateLeadProfile("monthlyBill", Number(value));
    } else if (inputId === "powerCuts") {
      updateLeadProfile("powerCutHours", Number(value));
    }

    const currentFlow = (conversationFlows.flows as Record<string, any>)[currentFlowId];
    if (!currentFlow || !currentFlow.inputs) return;

    const inputDef = currentFlow.inputs.find((inp: any) => inp.id === inputId);
    if (!inputDef) return;

    let userMessage = inputDef.label ? `${inputDef.label}: ${value}` : `${value}`;
    if (inputDef.unit) userMessage += ` ${inputDef.unit}`;

    messages.update((m: any[]) => [...m, { role: "user", content: userMessage }]);
    await scrollToBottom();

    if (inputDef.type === "number") {
      inputValues[inputId] = Number(value);
    } else {
      inputValues[inputId] = value;
    }

    isLoading = true;
    await simulateDelay(800 + Math.random() * 1200);

    if (inputDef.nextFlow) {
      await transitionToFlow(inputDef.nextFlow);
    }

    isLoading = false;
    await scrollToBottom();
  }

  function saveState() {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatMessages", JSON.stringify(get(messages)));
      localStorage.setItem("currentFlowId", currentFlowId);
      localStorage.setItem("inputValues", JSON.stringify(inputValues));
      localStorage.setItem("conversationContext", conversationContext);
      localStorage.setItem("contextSent", JSON.stringify(contextSent));
      localStorage.setItem("leadProfile", JSON.stringify(leadProfile));
    }
  }

  function processMessageText(text: string) {
    if (!text || typeof text !== "string") {
      return text;
    }

    const currentFlow = (conversationFlows.flows as Record<string, any>)[currentFlowId];
    if (!currentFlow) {
      return text;
    }

    const regex = /\{([^}]+)\}/g;
    let match;
    let processedText = text;
    const variables = [];
    while ((match = regex.exec(text)) !== null) {
      variables.push(match[1]);
    }

    for (const variableName of variables) {
      let variableValue;

      if (inputValues[variableName] !== undefined) {
        variableValue = inputValues[variableName];
      } else if (currentFlow[variableName]) {
        const formula = currentFlow[variableName];
        let processedFormula = formula;
        const nestedVars = [];
        let nestedMatch;
        const nestedRegex = /\{([^}]+)\}/g;

        while ((nestedMatch = nestedRegex.exec(formula)) !== null) {
          nestedVars.push(nestedMatch[1]);
        }

        for (const nestedVar of nestedVars) {
          let nestedValue;

          if (inputValues[nestedVar] !== undefined) {
            nestedValue = inputValues[nestedVar];
          } else if (currentFlow[nestedVar]) {
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

          processedFormula = processedFormula.replace(`{${nestedVar}}`, nestedValue);
        }

        try {
          variableValue = Function('"use strict"; return (' + processedFormula + ")")();
          inputValues[variableName] = variableValue;

          if (variableName === "systemSize") {
            updateLeadProfile("recommendedSystemSize", variableValue);
          } else if (variableName === "systemCost") {
            updateLeadProfile("systemCost", variableValue);
          } else if (variableName === "subsidyAmount") {
            updateLeadProfile("subsidyAmount", variableValue);
          } else if (variableName === "netCost" || variableName === "totalCost") {
            updateLeadProfile("netInvestment", variableValue);
          }
        } catch (e) {
          variableValue = 0;
          inputValues[variableName] = 0;
        }
      } else {
        variableValue = 0;
      }

      const formattedValue = typeof variableValue === "number" ? (Number.isInteger(variableValue) ? variableValue : parseFloat(variableValue.toFixed(2))) : variableValue;
      processedText = processedText.replace(`{${variableName}}`, formattedValue);
    }

    return processedText;
  }

  async function transitionToFlow(flowId: string) {
    const flow = (conversationFlows.flows as Record<string, any>)[flowId];
    if (!flow) {
      console.error(`❌ Flow '${flowId}' not found!`);
      return;
    }

    if (flowId !== "initial" && flowId !== "welcome") {
      addToUserJourney("flow", flowId);
    }

    if (flowId === "residentialResultOnGrid" || flowId === "noResidentialBatteryNeeded") {
      updateLeadProfile("systemType", "on-grid");
    } else if (flowId === "residentialResultHybrid") {
      updateLeadProfile("systemType", "hybrid");
    }

    if (flowId === "welcome" || flowId === "initial" || (conversationFlows.flows as Record<string, any>)[flowId]?.flowType === "freeform") {
      contextSent = false;
    }

    currentFlowId = flowId;
    const processedMessage = processMessageText(flow.message);

    messages.update((m: any[]) => [...m, { role: "assistant", content: processedMessage }]);
    saveState();
    await scrollToBottom();
  }

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
      netInvestment: null,
    };

    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("currentFlowId");
      localStorage.removeItem("inputValues");
      localStorage.removeItem("conversationContext");
      localStorage.removeItem("contextSent");
      localStorage.removeItem("leadProfile");
    }

    await transitionToFlow("initial");
    isUserScrolledUp = false;
    await scrollToBottom();
  }

  function initializeChat() {
    if (typeof window !== "undefined") {
      loadLeadProfile();

      const savedMessages = localStorage.getItem("chatMessages");
      const savedFlowId = localStorage.getItem("currentFlowId");
      const savedInputs = localStorage.getItem("inputValues");
      const savedContext = localStorage.getItem("conversationContext");
      const savedContextSent = localStorage.getItem("contextSent");

      if (savedMessages && savedFlowId) {
        messages.set(JSON.parse(savedMessages));
        currentFlowId = savedFlowId;

        if (savedContext) {
          conversationContext = savedContext;
        }
        if (savedContextSent) {
          contextSent = JSON.parse(savedContextSent);
        }

        if (savedInputs) {
          const parsedInputs = JSON.parse(savedInputs);
          Object.keys(parsedInputs).forEach((key) => {
            const value = parsedInputs[key];
            if (typeof value === "string" && !isNaN(Number(value))) {
              inputValues[key] = Number(value);
            } else {
              inputValues[key] = value;
            }
          });
        } else {
          inputValues = {};
        }
      } else {
        transitionToFlow("initial");
      }
    }
  }

  // Lifecycle effects
  $effect(() => {
    if (typeof window !== "undefined") {
      (window as any).resetChat = resetChat;
      initializeChat();
      scrollToBottom();
    }
  });

  $effect(() => {
    if (chatHistoryContainer && chatHistoryContainer.scrollHeight > lastScrollHeight && !isUserScrolledUp) {
      scrollToBottom();
    }
  });

  $effect(() => {
    if ((conversationFlows.flows as Record<string, any>)[currentFlowId]?.flowType === "form" && formValues) {
      validateForm(false);
    }
  });

  $effect(() => {
    if (hasAttemptedSubmit && (conversationFlows.flows as Record<string, any>)[currentFlowId]?.flowType === "form") {
      validateForm(true);
    }
  });
</script>

<div class="flex flex-col w-full h-[700px] min-h-[600px] max-h-screen rounded-[theme(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
  <!-- Header -->
  <div class="flex items-center justify-between p-[theme(--card-padding-y)] border-b border-[hsl(var(--border))] bg-[hsl(var(--primary))]">
    <h3 class="text-[length:var(--font-size-lg)] font-semibold text-[hsl(var(--primary-foreground))] leading-[var(--font-size-lg--line-height)]">Calculate Price and Savings</h3>
    {#if onClose}
      <Button variant="ghost" size="sm" onclick={onClose} class="rounded-[theme(--badge-radius)] w-[2rem] h-[2rem] p-0">
        <X class="w-[1.25rem] h-[1.25rem]" />
      </Button>
    {/if}
  </div>

  <!-- Chat History -->
  <div class="flex-1 overflow-y-auto p-[theme(--card-padding-y)] gap-[theme(--card-gap)] flex flex-col bg-[hsl(var(--background))]" bind:this={chatHistoryContainer} onscroll={handleScroll}>
    {#each $messages as message, i}
      <div class="flex gap-[theme(--form-element-field-gap)] {message.role === 'user' ? 'justify-end' : 'justify-start'}">
        {#if message.role === "assistant"}
          <img src="https://api.dicebear.com/9.x/bottts/svg?seed=SolarBot" alt="Bot" class="w-[2rem] h-[2rem] rounded-[theme(--badge-radius)] flex-shrink-0 mt-[theme(--form-element-field-gap)]" />
        {/if}
        <Card class="max-w-[85%] {message.role === 'user' ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--card))]'} border border-[hsl(var(--border))]">
          <CardContent class="pt-[theme(--card-padding-y)] text-[length:var(--font-size-sm)] {message.role === 'user' ? 'text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--foreground))]'}">
            <p class="whitespace-pre-wrap break-words">{@html message.content}</p>

            <!-- Guided flow suggestion -->
            {#if message.showGuidedOption && message.role === "assistant"}
              <div class="mt-[theme(--card-gap)] gap-[theme(--form-element-field-gap)] flex flex-col">
                <Button onclick={startGuidedFlow} class="w-full" variant="default">Yes, start assessment</Button>
                <Button onclick={() => dismissGuidedSuggestion(i)} variant="outline" class="w-full">No, continue chatting</Button>
              </div>
            {/if}

            <!-- Options display -->
            {#if message.role === "assistant" && i === $messages.length - 1 && currentFlow?.flowType === "options" && currentFlow?.options?.length > 0 && !message.showGuidedOption}
              <div class="mt-[theme(--card-gap)] gap-[theme(--form-element-field-gap)] flex flex-col">
                {#each currentFlow.options as option}
                  <Button onclick={() => selectOption(option.id)} variant="outline" class="w-full justify-start text-left">
                    {option.label}
                  </Button>
                {/each}
              </div>
            {/if}

            <!-- Input fields -->
            {#if message.role === "assistant" && i === $messages.length - 1 && (conversationFlows.flows as Record<string, any>)[currentFlowId]?.flowType === "inputs" && (conversationFlows.flows as Record<string, any>)[currentFlowId]?.inputs?.length > 0 && !message.showGuidedOption}
              <div class="mt-[theme(--card-gap)] gap-[theme(--form-element-field-gap)] flex flex-col">
                {#each (conversationFlows.flows as Record<string, any>)[currentFlowId].inputs as input}
                  <div class="gap-[theme(--form-element-field-gap)] flex flex-col">
                    {#if input.label}
                      <Label class="text-[hsl(var(--foreground))]">{input.label}</Label>
                    {/if}
                    <div class="flex gap-[theme(--form-element-field-gap)] items-center">
                      {#if input.type === "number"}
                        <Input type="number" bind:value={inputValues[input.id]} placeholder={input.placeholder || ""} class="flex-1" />
                      {:else if input.type === "email"}
                        <Input type="email" bind:value={inputValues[input.id]} placeholder={input.placeholder || ""} class="flex-1" />
                      {:else if input.type === "tel"}
                        <Input type="tel" bind:value={inputValues[input.id]} placeholder={input.placeholder || ""} class="flex-1" />
                      {:else}
                        <Input type="text" bind:value={inputValues[input.id]} placeholder={input.placeholder || ""} class="flex-1" />
                      {/if}
                      {#if input.unit}
                        <span class="text-[length:var(--font-size-sm)] text-[hsl(var(--muted-foreground))]">{input.unit}</span>
                      {/if}
                    </div>
                    <Button onclick={() => submitInput(input.id, inputValues[input.id])} disabled={!inputValues[input.id]} class="w-full" variant="default">
                      Submit
                    </Button>
                  </div>
                {/each}
              </div>
            {/if}

            <!-- Form display -->
            {#if message.role === "assistant" && i === $messages.length - 1 && (conversationFlows.flows as Record<string, any>)[currentFlowId]?.flowType === "form" && (conversationFlows.flows as Record<string, any>)[currentFlowId]?.inputs?.length > 0 && !message.showGuidedOption}
              <div class="mt-[theme(--card-gap)] p-[theme(--card-padding-y)] rounded-[theme(--radius-lg)] gap-[theme(--form-element-field-gap)] flex flex-col bg-[hsl(var(--background-secondary))]">
                {#each (conversationFlows.flows as Record<string, any>)[currentFlowId].inputs as input}
                  <div class="gap-[theme(--form-element-field-gap)] flex flex-col">
                    <Label class="text-[hsl(var(--foreground))]">
                      {input.label}{input.required ? " *" : ""}
                    </Label>

                    {#if input.type === "text"}
                      <Input id={input.id} type="text" bind:value={formValues[input.id]} placeholder={input.placeholder || ""} class={formErrors[input.id] ? "border-[hsl(var(--destructive))]" : ""} />
                    {:else if input.type === "tel"}
                      <Input id={input.id} type="tel" bind:value={formValues[input.id]} placeholder={input.placeholder || ""} class={formErrors[input.id] ? "border-[hsl(var(--destructive))]" : ""} />
                    {:else if input.type === "email"}
                      <Input id={input.id} type="email" bind:value={formValues[input.id]} placeholder={input.placeholder || ""} class={formErrors[input.id] ? "border-[hsl(var(--destructive))]" : ""} />
                    {:else if input.type === "number"}
                      <Input id={input.id} type="number" bind:value={formValues[input.id]} placeholder={input.placeholder || ""} class={formErrors[input.id] ? "border-[hsl(var(--destructive))]" : ""} />
                    {:else}
                      <Input id={input.id} type="text" bind:value={formValues[input.id]} placeholder={input.placeholder || ""} class={formErrors[input.id] ? "border-[hsl(var(--destructive))]" : ""} />
                    {/if}

                    {#if formErrors[input.id]}
                      <span class="text-[length:var(--font-size-xs)] text-[hsl(var(--destructive))]">{formErrors[input.id]}</span>
                    {/if}
                  </div>
                {/each}

                <Button onclick={submitForm} disabled={!isFormValid || isLoading || isSubmittingForm} class="w-full" variant="default">
                  {#if isSubmittingForm}
                    Submitting...
                  {:else if isLoading}
                    Processing...
                  {:else}
                    Submit Consultation Request
                  {/if}
                </Button>
              </div>
            {/if}
          </CardContent>
        </Card>
      </div>
    {/each}

    {#if isLoading}
      <div class="flex gap-[theme(--form-element-field-gap)] items-center">
        <Badge variant="outline" class="animate-pulse-subtle bg-[hsl(var(--background-secondary))]">●</Badge>
        <Badge variant="outline" class="animate-pulse-subtle bg-[hsl(var(--muted))]" style="animation-delay: 200ms">●</Badge>
        <Badge variant="outline" class="animate-pulse-subtle bg-[hsl(var(--muted))]" style="animation-delay: 400ms">●</Badge>
      </div>
    {/if}

    <div class="h-[1.25rem]"></div>
  </div>

  <!-- Chat Input -->
  {#if currentFlow?.flowType === "freeform"}
    <div class="flex gap-[theme(--form-element-field-gap)] p-[theme(--card-padding-y)] border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <Input bind:value={userInput} placeholder="Ask a question about solar installation..." onkeypress={(e) => e.key === "Enter" && sendMessage()} />
      <Button onclick={sendMessage} disabled={isLoading || !userInput.trim()} variant="default" size="sm">
        <Send class="w-[1rem] h-[1rem]" />
      </Button>
    </div>
  {/if}

  <!-- Reset Button -->
  <div class="p-[theme(--form-element-field-gap)] border-t border-[hsl(var(--border))] text-center bg-[hsl(var(--card))]">
    <Button onclick={resetChat} variant="outline" size="sm">Reset Chat</Button>
  </div>
</div>
