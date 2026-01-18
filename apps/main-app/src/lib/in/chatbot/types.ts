/**
 * Central type definitions for all chatbot modules
 */

export interface Message {
  role: "user" | "assistant";
  content: string;
  showGuidedOption?: boolean;
}

export interface LeadProfile {
  // Personal (from form)
  name: string | null;
  phone: string | null;
  email: string | null;
  pincode: string | null;

  // Property Details
  propertyType: string | null; // residential/commercial/agriculture
  propertySubtype: string | null; // bungalow/apartment/society

  // Electricity Profile
  monthlyConsumption: number | null;
  monthlyBill: number | null;
  powerCutHours: number | null;

  // System Recommendation
  recommendedSystemSize: number | null;
  systemType: string | null; // on-grid/hybrid/off-grid

  // Financial
  systemCost: number | null;
  subsidyAmount: number | null;
  netInvestment: number | null;
}

export interface ConversationInput {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "number" | "textarea";
  required?: boolean;
  placeholder?: string;
  unit?: string;
  nextFlow?: string;
}

export interface ConversationOption {
  id: string;
  label: string;
  nextFlow?: string;
}

export interface ConversationFlow {
  id: string;
  message: string;
  flowType: "initial" | "freeform" | "guided" | "form" | "input" | "options";
  nextFlow?: string;
  inputs?: ConversationInput[];
  options?: ConversationOption[];
  [key: string]: any; // For formulas like systemSize, systemCost, etc.
}

export interface ConversationFlows {
  flows: {
    [flowId: string]: ConversationFlow;
  };
}

export interface ChatState {
  messages: Message[];
  currentFlowId: string;
  inputValues: Record<string, any>;
  conversationContext: string;
  contextSent: boolean;
  leadProfile: LeadProfile;
  formValues: Record<string, string>;
  userJourney: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SendMessageRequest {
  userMessage: string;
  leadProfile: LeadProfile;
  conversationContext?: string;
}

export interface SendMessageResponse {
  reply: string;
  success: boolean;
}

export interface SubmitLeadRequest {
  name: string;
  phone: string;
  pinCode: string;
  email: string;
  comment: string;
  type: string;
  urlParam: string;
}

export interface SubmitLeadResponse {
  success: boolean;
  message?: string;
}

export interface ScrollState {
  isUserScrolledUp: boolean;
  lastScrollHeight: number;
  lastScrollTop: number;
  hasUserInteracted: boolean;
}

export interface ProcessingContext {
  currentFlow: ConversationFlow;
  inputValues: Record<string, any>;
  leadProfile: LeadProfile;
}

export interface ProcessingResult {
  processedText: string;
  updatedProfile: LeadProfile;
  updatedInputs: Record<string, any>;
}
