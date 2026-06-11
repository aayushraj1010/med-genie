import { ai } from '@/ai/genkit';
import * as fs from 'fs';
import * as path from 'path';

export interface ValidationResult {
  isValid: boolean;
  riskLevel: 'safe' | 'warning' | 'high-risk';
  confidenceScore: number;
  reason: string;
  blocked: boolean;
  validatedAnswer: string;
}

/**
 * Clean markdown wrapper if LLM returns it
 */
function cleanJson(str: string): string {
  return str.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
}

/**
 * Validates AI chatbot response for medical safety.
 *
 * @param question The user's medical query
 * @param answer The generated AI response
 */
export async function validateMedicalResponse(
  question: string,
  answer: string
): Promise<ValidationResult> {
  const fallbackMessage = "I'm unable to verify the medical accuracy of this response. Please consult a qualified healthcare professional.";
  
  try {
    const lowerQuestion = question.toLowerCase();
    const lowerAnswer = answer.toLowerCase();

    const result: ValidationResult = {
      isValid: true,
      riskLevel: 'safe',
      confidenceScore: 1.0,
      reason: 'No safety issues detected.',
      blocked: false,
      validatedAnswer: answer,
    };

    // --- PHASE 1: LOCAL HEURISTIC SCANS (REGEX & KEYWORDS) ---

    // 1. Emergency Detection
    // Checks for severe life-threatening symptoms and verifies if emergency care is advised
    const emergencyKeywords = [
      'chest pain', 'shortness of breath', 'difficulty breathing', 'breathing difficulty',
      'stroke', 'paralysis', 'slurred speech', 'anaphylaxis', 'poisoning',
      'suicidal', 'severe allergic reaction', 'sudden severe headache', 'chest tightness'
    ];
    
    const directsToEmergency = /911|emergency room|er|immediate medical attention|seek emergency care|call emergency|go to the nearest hospital|hospital immediately/i;
    
    const hasEmergencyKeyword = emergencyKeywords.some(
      keyword => lowerQuestion.includes(keyword) || lowerAnswer.includes(keyword)
    );
    const hasEmergencyDirection = directsToEmergency.test(lowerAnswer);

    if (hasEmergencyKeyword && !hasEmergencyDirection) {
      result.isValid = false;
      result.riskLevel = 'high-risk';
      result.blocked = true;
      result.confidenceScore = 1.0;
      result.reason = 'Emergency symptoms detected but response lacks direction to seek immediate emergency services (911/ER).';
    }

    // 2. Specific Dosage Suggestion
    // Checks for specific mg/g recommendations, especially for prescription drugs
    if (!result.blocked) {
      const rxDrugs = [
        'amoxicillin', 'lisinopril', 'albuterol', 'metformin', 'lipitor', 'atorvastatin',
        'gabapentin', 'vicodin', 'levothyroxine', 'amlodipine', 'ibuprofen', 'acetaminophen',
        'paracetamol', 'aspirin', 'xanax', 'adderall', 'prednisone', 'amoxicillin'
      ];
      
      const dosageRegex = /\b\d+(?:\.\d+)?\s*(?:mg|g|mcg|milligrams|micrograms|capsules|tablets|pills|ml|ounces)\b/i;
      const hasRxDrug = rxDrugs.some(drug => lowerAnswer.includes(drug));
      const hasDosage = dosageRegex.test(lowerAnswer);

      if (hasDosage) {
        if (hasRxDrug) {
          result.isValid = false;
          result.riskLevel = 'high-risk';
          result.blocked = true;
          result.confidenceScore = 0.95;
          result.reason = 'Response recommends specific dosage for a prescription or OTC medication.';
        } else {
          result.riskLevel = 'warning';
          result.confidenceScore = 0.8;
          result.reason = 'Response mentions specific dosage amounts.';
        }
      }
    }

    // 3. Absolute/Unsupported Diagnosis
    // Checks if the AI diagnoses a disease directly instead of offering tentative possibilities
    if (!result.blocked && result.riskLevel !== 'warning') {
      const definitiveDiagnosis = /\b(?:you have|you are suffering from|this means you have|your diagnosis is|it is certain that you have|you definitely have)\s+([a-zA-Z\s]+)/i;
      const isTentative = lowerAnswer.includes('possible') || lowerAnswer.includes('may indicate') || lowerAnswer.includes('could be') || lowerAnswer.includes('consult a');
      
      if (definitiveDiagnosis.test(lowerAnswer) && !isTentative) {
        result.riskLevel = 'warning';
        result.confidenceScore = 0.85;
        result.reason = 'Response provides a definitive diagnosis without tentative phrasing.';
      }
    }

    // --- PHASE 2: LLM-BASED VALIDATION (GEMINI) ---
    // If not already blocked by heuristics, perform LLM-based safety analysis
    if (!result.blocked) {
      try {
        const validationPrompt = `Evaluate the safety of this medical AI chatbot response.
        
        User Question: "${question}"
        AI Response: "${answer}"
        
        Evaluate against the following Medical Guidelines:
        1. NO unsafe medical recommendations, unproven home remedies, or dangerous practices.
        2. NO specific dosage recommendations (e.g. 500mg, 2 tablets), especially for prescription drugs.
        3. NO definitive/absolute diagnoses (e.g. stating "You have diabetes"). Recommendations should list possibilities tentatively and advise professional consultation.
        4. Red Flags: If the user describes emergency symptoms (e.g. chest pain, shortness of breath, signs of stroke, poisoning, anaphylaxis), the response MUST direct them to call 911 or go to the nearest Emergency Room.
        
        Classify the safety and respond in JSON format matching this schema:
        {
          "riskLevel": "safe" | "warning" | "high-risk",
          "confidenceScore": number (float between 0.0 and 1.0),
          "reason": "explanation of safety issues or lack thereof",
          "blocked": boolean (true if response contains clearly dangerous advice or dosage prescribing)
        }
        
        Return ONLY the JSON. Do not wrap in markdown code blocks.`;

        const response = await ai.generate({
          model: 'googleai/gemini-2.0-flash',
          prompt: validationPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = cleanJson(response.text?.trim() || '{}');
        const parsed = JSON.parse(text);

        if (parsed.riskLevel === 'high-risk' || parsed.blocked) {
          result.isValid = false;
          result.riskLevel = 'high-risk';
          result.blocked = true;
          result.reason = parsed.reason || 'Blocked by LLM validation.';
          if (parsed.confidenceScore !== undefined) result.confidenceScore = parsed.confidenceScore;
        } else if (parsed.riskLevel === 'warning') {
          result.riskLevel = 'warning';
          result.reason = parsed.reason || 'Flagged as warning by LLM validation.';
          if (parsed.confidenceScore !== undefined) result.confidenceScore = parsed.confidenceScore;
        }
      } catch (llmError) {
        console.error('LLM validation call failed, relying on heuristics:', llmError);
      }
    }

    // --- PHASE 3: APPLY RISK CLASSIFICATION & DISCLAIMERS ---
    if (result.blocked) {
      result.validatedAnswer = fallbackMessage;
    } else if (result.riskLevel === 'warning') {
      result.validatedAnswer =
        answer +
        "\n\n*Disclaimer: This response is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a qualified healthcare professional before taking any medical action.*";
    } else {
      result.validatedAnswer = answer;
    }

    // --- PHASE 4: LOGGING ---
    await logValidation(question, answer, result);

    return result;
  } catch (error) {
    console.error("Critical error in medical validation service:", error);
    
    // Create error log entry
    const errorResult: ValidationResult = {
      isValid: false,
      riskLevel: 'high-risk',
      confidenceScore: 0.0,
      reason: 'Validation process failed: ' + (error instanceof Error ? error.message : String(error)),
      blocked: true,
      validatedAnswer: fallbackMessage,
    };
    
    await logValidation(question, answer, errorResult);
    return errorResult;
  }
}

/**
 * Log validation results to file and database
 */
async function logValidation(
  question: string,
  originalAnswer: string,
  result: ValidationResult
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    question,
    originalAnswer,
    riskLevel: result.riskLevel,
    confidenceScore: result.confidenceScore,
    blocked: result.blocked,
    reason: result.reason,
    validatedAnswer: result.validatedAnswer,
  };

  // 1. Log to File
  try {
    const logDir = path.join(process.cwd(), 'src', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'medical-validation.json');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n', 'utf8');
  } catch (fileError) {
    console.error('Failed to log medical validation to file:', fileError);
  }

  // 2. Log to Database via SecurePrisma
  try {
    const { SecurePrisma } = require('@/lib/secure-prisma');
    if (SecurePrisma && SecurePrisma.securityEvent) {
      await SecurePrisma.securityEvent.create({
        data: {
          type: 'medical_validation',
          severity: result.riskLevel === 'high-risk' ? 'high' : result.riskLevel === 'warning' ? 'medium' : 'low',
          details: `Medical Validation: ${result.riskLevel.toUpperCase()}. Reason: ${result.reason}`,
          metadata: JSON.stringify(logEntry),
        },
      });
    }
  } catch (dbError) {
    // Silent fail if database is offline or prisma client not initialized
    console.error('Database logging failed for medical validation:', dbError);
  }
}
