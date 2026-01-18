/**
 * Lead profile management and localStorage persistence
 */

import type { LeadProfile } from "./types";

/**
 * Create a new lead profile with default values
 */
export function createLeadProfile(): LeadProfile {
  return {
    // Personal (from form)
    name: null,
    phone: null,
    email: null,
    pincode: null,

    // Property Details
    propertyType: null,
    propertySubtype: null,

    // Electricity Profile
    monthlyConsumption: null,
    monthlyBill: null,
    powerCutHours: null,

    // System Recommendation
    recommendedSystemSize: null,
    systemType: null,

    // Financial
    systemCost: null,
    subsidyAmount: null,
    netInvestment: null,
  };
}

/**
 * Update a single field in the lead profile
 */
export function updateLeadProfile(
  profile: LeadProfile,
  field: string,
  value: any
): LeadProfile {
  const updated = { ...profile, [field]: value };
  console.log(`Lead Profile Updated: ${field} = ${value}`);
  console.log("Current Lead Profile:", updated);
  return updated;
}

/**
 * Save lead profile to localStorage
 */
export function saveLeadProfile(profile: LeadProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("leadProfile", JSON.stringify(profile));
  }
}

/**
 * Load lead profile from localStorage
 */
export function loadLeadProfile(): LeadProfile | null {
  if (typeof window !== "undefined") {
    const savedProfile = localStorage.getItem("leadProfile");
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error("Failed to parse lead profile from localStorage", e);
        return null;
      }
    }
  }
  return null;
}

/**
 * Clear lead profile from localStorage
 */
export function clearLeadProfile(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("leadProfile");
  }
}

/**
 * Add entry to user journey tracking
 * Excludes form submission details and form field inputs
 */
export function addToUserJourney(
  journey: string[],
  type: string,
  value: string
): string[] {
  // Don't track form submission details or form field inputs
  if (
    type === "formSubmission" ||
    (type === "input" &&
      [
        "customerName",
        "customerPhone",
        "customerPinCode",
        "customerEmail",
        "customerComment",
      ].includes(value))
  ) {
    return journey;
  }

  const journeyEntry = type === "input" ? `${value}` : value;
  return [...journey, journeyEntry];
}
