/**
 * Message text processing with variable substitution and formula evaluation
 */

import type { ProcessingContext, ProcessingResult, LeadProfile } from "./types";

/**
 * Process message text with variable substitution and formula evaluation
 * Replaces {variableName} placeholders with values from inputValues or calculated formulas
 * Auto-updates lead profile with calculated values
 */
export function processMessageText(
  text: string,
  context: ProcessingContext
): ProcessingResult {
  const { currentFlow, inputValues, leadProfile } = context;
  const updatedInputs = { ...inputValues };
  let updatedProfile = { ...leadProfile };

  if (!text || typeof text !== "string" || !currentFlow) {
    return {
      processedText: text,
      updatedProfile,
      updatedInputs,
    };
  }

  // Regular expression to find all placeholders like {variableName}
  const regex = /\{([^}]+)\}/g;

  // First, get all variables that need to be replaced
  let match;
  let processedText = text;
  const variables: string[] = [];

  while ((match = regex.exec(text)) !== null) {
    variables.push(match[1]);
  }

  // Process each variable
  for (const variableName of variables) {
    let variableValue;

    // Check if variable exists in inputValues
    if (updatedInputs[variableName] !== undefined) {
      variableValue = updatedInputs[variableName];
    }
    // If not in inputValues, check if it has a formula
    else if (currentFlow[variableName]) {
      const formula = currentFlow[variableName];

      // Replace any nested variables in the formula
      let processedFormula = formula;
      const nestedVars: string[] = [];
      let nestedMatch;
      const nestedRegex = /\{([^}]+)\}/g;

      while ((nestedMatch = nestedRegex.exec(formula)) !== null) {
        nestedVars.push(nestedMatch[1]);
      }

      // Process each nested variable first
      for (const nestedVar of nestedVars) {
        let nestedValue;

        if (updatedInputs[nestedVar] !== undefined) {
          nestedValue = updatedInputs[nestedVar];
        } else if (currentFlow[nestedVar]) {
          // Recursively process the nested variable's formula using nested processing
          const tempResult = processMessageText(
            `{${nestedVar}}`,
            { ...context, inputValues: updatedInputs }
          );
          updatedInputs[nestedVar] = tempResult.updatedInputs[nestedVar];

          if (updatedInputs[nestedVar] !== undefined) {
            nestedValue = updatedInputs[nestedVar];
          } else {
            nestedValue = 0;
            updatedInputs[nestedVar] = 0;
          }
        } else {
          nestedValue = 0;
        }

        // Replace in the formula
        processedFormula = processedFormula.replace(
          `{${nestedVar}}`,
          String(nestedValue)
        );
      }

      // Evaluate the formula
      try {
        // Use Function for safer evaluation
        variableValue = Function(
          '"use strict"; return (' + processedFormula + ")"
        )();

        // Store for future calculations
        updatedInputs[variableName] = variableValue;

        // Update lead profile with calculated values
        updatedProfile = updateLeadProfileWithCalculatedValue(
          updatedProfile,
          variableName,
          variableValue
        );
      } catch (e) {
        console.error(`Error evaluating formula for ${variableName}:`, e);
        variableValue = 0;
        updatedInputs[variableName] = 0;
      }
    } else {
      variableValue = 0;
    }

    // Format the value for display
    const formattedValue =
      typeof variableValue === "number"
        ? Number.isInteger(variableValue)
          ? variableValue
          : parseFloat(variableValue.toFixed(2))
        : variableValue;

    // Replace in the text
    processedText = processedText.replace(
      `{${variableName}}`,
      String(formattedValue)
    );
  }

  return {
    processedText,
    updatedProfile,
    updatedInputs,
  };
}

/**
 * Update lead profile based on calculated variable values
 */
function updateLeadProfileWithCalculatedValue(
  profile: LeadProfile,
  variableName: string,
  variableValue: any
): LeadProfile {
  const updated = { ...profile };

  if (variableName === "systemSize") {
    updated.recommendedSystemSize = variableValue;
  } else if (variableName === "systemCost") {
    updated.systemCost = variableValue;
  } else if (variableName === "subsidyAmount") {
    updated.subsidyAmount = variableValue;
  } else if (variableName === "netCost" || variableName === "totalCost") {
    updated.netInvestment = variableValue;
  }

  return updated;
}
