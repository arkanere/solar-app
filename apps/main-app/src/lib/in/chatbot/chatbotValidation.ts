/**
 * Form and input validation functions for chatbot
 */

import type { ValidationResult, ConversationFlow } from "./types";

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): string {
  if (!phone || !/^\+?\d{10,16}$/.test(phone)) {
    return "Phone number must be between 10 and 16 digits, optionally starting with +";
  }
  return "";
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address";
  }
  return "";
}

/**
 * Validate pin code format
 */
export function validatePinCode(pinCode: string): string {
  if (!pinCode || !/^\d{6}$/.test(pinCode)) {
    return "Pin code must be exactly 6 digits";
  }
  return "";
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): string {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }
  return "";
}

/**
 * Validate entire form based on current flow inputs
 */
export function validateChatbotForm(
  currentFlow: ConversationFlow | null | undefined,
  formValues: Record<string, string>,
  showAllErrors: boolean
): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  if (!currentFlow || !currentFlow.inputs) {
    return { isValid: true, errors: {} };
  }

  currentFlow.inputs.forEach((input) => {
    const value = formValues[input.id] || "";
    let error = "";

    // Required field validation (only show if showAllErrors is true or hasAttemptedSubmit)
    if (input.required && showAllErrors) {
      error = validateRequired(value, input.label);
    }

    // Specific field validations (always show format errors if field has value)
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

    // For form validity check, consider all errors regardless of display
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

  return { isValid, errors };
}
