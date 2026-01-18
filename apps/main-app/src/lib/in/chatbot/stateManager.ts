/**
 * Chat state persistence to localStorage
 */

import type { ChatState, Message, LeadProfile, ConversationFlows } from "./types";
import { createLeadProfile } from "./leadProfileManager";

/**
 * Save partial chat state to localStorage
 */
export function saveChatState(state: Partial<ChatState>): void {
  if (typeof window === "undefined") return;

  if (state.messages !== undefined) {
    localStorage.setItem("chatMessages", JSON.stringify(state.messages));
  }
  if (state.currentFlowId !== undefined) {
    localStorage.setItem("currentFlowId", state.currentFlowId);
  }
  if (state.inputValues !== undefined) {
    localStorage.setItem("inputValues", JSON.stringify(state.inputValues));
  }
  if (state.conversationContext !== undefined) {
    localStorage.setItem("conversationContext", state.conversationContext);
  }
  if (state.contextSent !== undefined) {
    localStorage.setItem("contextSent", JSON.stringify(state.contextSent));
  }
  if (state.leadProfile !== undefined) {
    localStorage.setItem("leadProfile", JSON.stringify(state.leadProfile));
  }
  if (state.formValues !== undefined) {
    localStorage.setItem("formValues", JSON.stringify(state.formValues));
  }
  if (state.userJourney !== undefined) {
    localStorage.setItem("userJourney", JSON.stringify(state.userJourney));
  }
}

/**
 * Load chat state from localStorage
 */
export function loadChatState(): ChatState | null {
  if (typeof window === "undefined") return null;

  try {
    const savedMessages = localStorage.getItem("chatMessages");
    const savedFlowId = localStorage.getItem("currentFlowId");

    // Only restore if we have at least messages and flow ID
    if (!savedMessages || !savedFlowId) {
      return null;
    }

    const savedInputs = localStorage.getItem("inputValues");
    const savedContext = localStorage.getItem("conversationContext");
    const savedContextSent = localStorage.getItem("contextSent");
    const savedLeadProfile = localStorage.getItem("leadProfile");
    const savedFormValues = localStorage.getItem("formValues");
    const savedUserJourney = localStorage.getItem("userJourney");

    // Parse and convert numeric values correctly for inputValues
    let inputValues: Record<string, any> = {};
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
    }

    return {
      messages: JSON.parse(savedMessages),
      currentFlowId: savedFlowId,
      inputValues,
      conversationContext: savedContext || "",
      contextSent: savedContextSent ? JSON.parse(savedContextSent) : false,
      leadProfile: savedLeadProfile
        ? JSON.parse(savedLeadProfile)
        : createLeadProfile(),
      formValues: savedFormValues ? JSON.parse(savedFormValues) : {},
      userJourney: savedUserJourney ? JSON.parse(savedUserJourney) : [],
    };
  } catch (error) {
    console.error("Error loading chat state from localStorage:", error);
    return null;
  }
}

/**
 * Clear all chat state from localStorage
 */
export function clearChatState(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("chatMessages");
  localStorage.removeItem("currentFlowId");
  localStorage.removeItem("inputValues");
  localStorage.removeItem("conversationContext");
  localStorage.removeItem("contextSent");
  localStorage.removeItem("leadProfile");
  localStorage.removeItem("formValues");
  localStorage.removeItem("userJourney");
}

/**
 * Initialize chat state with default values from flows
 */
export function initializeChatState(
  flows: ConversationFlows
): ChatState {
  return {
    messages: [],
    currentFlowId: "initial",
    inputValues: {},
    conversationContext: "",
    contextSent: false,
    leadProfile: createLeadProfile(),
    formValues: {},
    userJourney: [],
  };
}
