/**
 * Conversation flow management and transitions
 */

import type {
  ConversationFlows,
  LeadProfile,
} from "./types";
import { processMessageText } from "./messageProcessor";

export interface ConversationState {
  currentFlowId: string;
  conversationContext: string;
  contextSent: boolean;
}

/**
 * Serialize conversation context for LLM handoff
 */
export function serializeConversationContext(
  leadProfile: LeadProfile,
  currentFlowId: string,
  flows: ConversationFlows
): string {
  const contextLines: string[] = [];

  // Add lead profile information
  contextLines.push("=== Lead Profile ===");
  Object.entries(leadProfile).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      const formattedKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      contextLines.push(`${formattedKey}: ${value}`);
    }
  });
  contextLines.push("");

  // Add current flow information
  const currentFlow = flows.flows[currentFlowId];
  if (
    currentFlow &&
    currentFlowId !== "initial" &&
    currentFlowId !== "welcome"
  ) {
    contextLines.push(`Current Flow: ${currentFlowId}`);
    if (currentFlow.message) {
      contextLines.push(`Current Context: ${currentFlow.message}`);
    }
  }

  return contextLines.join("\n");
}

/**
 * Transition to a specific flow and return updated state
 */
export function transitionToFlow(
  flowId: string,
  flows: ConversationFlows,
  state: ConversationState,
  leadProfile: LeadProfile,
  inputValues: Record<string, any>,
  userJourney: string[]
): {
  updatedState: ConversationState;
  updatedProfile: LeadProfile;
  processedMessage: string;
  updatedInputValues: Record<string, any>;
  updatedJourney: string[];
} {
  console.log(`Transitioning to flow: ${flowId}`);

  const flow = flows.flows[flowId];

  if (!flow) {
    console.error(`❌ Flow '${flowId}' not found or is undefined!`);
    console.log(`Available flows:`, flows.flows);
    throw new Error(`Flow '${flowId}' not found`);
  }

  console.log(`Flow found:`, flow);

  // Add flow transition to user journey (exclude initial and welcome flows)
  let updatedJourney = [...userJourney];
  if (flowId !== "initial" && flowId !== "welcome") {
    updatedJourney.push(flowId);
  }

  // Update system type based on flow transitions
  let updatedProfile = { ...leadProfile };
  if (
    flowId === "residentialResultOnGrid" ||
    flowId === "noResidentialBatteryNeeded"
  ) {
    updatedProfile.systemType = "on-grid";
  } else if (flowId === "residentialResultHybrid") {
    updatedProfile.systemType = "hybrid";
  }

  // Reset context sent flag when transitioning to freeform
  let updatedState = { ...state, currentFlowId: flowId };
  if (
    flowId === "welcome" ||
    flowId === "initial" ||
    flow.flowType === "freeform"
  ) {
    updatedState.contextSent = false;
  }

  // Process the message text to replace variables with calculated values
  const processingResult = processMessageText(flow.message, {
    currentFlow: flow,
    inputValues,
    leadProfile: updatedProfile,
  });

  const processedMessage = processingResult.processedText;
  updatedProfile = processingResult.updatedProfile;
  const updatedInputValues = processingResult.updatedInputs;

  console.log(`Processed message:`, processedMessage);

  return {
    updatedState,
    updatedProfile,
    processedMessage,
    updatedInputValues,
    updatedJourney,
  };
}
