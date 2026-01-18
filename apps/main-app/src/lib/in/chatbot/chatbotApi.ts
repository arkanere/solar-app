/**
 * API integration layer for chatbot
 */

import type {
  SendMessageRequest,
  SendMessageResponse,
  SubmitLeadRequest,
  SubmitLeadResponse,
} from "./types";

/**
 * Send a chat message to the backend and get AI response
 */
export async function sendChatMessage(
  request: SendMessageRequest
): Promise<SendMessageResponse> {
  try {
    const response = await fetch("/chatbot121212", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: request.userMessage,
        leadProfile: request.leadProfile,
        ...(request.conversationContext && {
          conversationContext: request.conversationContext,
        }),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      reply: data.reply || "",
      success: true,
    };
  } catch (error) {
    console.error("Error communicating with chatbot:", error);
    return {
      reply: "",
      success: false,
    };
  }
}

/**
 * Submit lead form to backend
 */
export async function submitLeadForm(
  request: SubmitLeadRequest
): Promise<SubmitLeadResponse> {
  try {
    const response = await fetch("/api/submitLead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: result.success === true,
      message: result.message,
    };
  } catch (error) {
    console.error("Error submitting lead form:", error);
    return {
      success: false,
      message: "Network error",
    };
  }
}
