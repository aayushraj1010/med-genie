# Doctor Specialist Recommendation Feature

## Overview

This feature provides AI-powered recommendations for medical specialists based on user symptoms, demographics, and medical history. It integrates seamlessly with the existing Med-Genie architecture.

## Implementation

### 1. AI Flow (`src/ai/flows/specialist-recommendation.ts`)

- **Purpose**: Core AI logic for analyzing symptoms and recommending specialists
- **Input**: Symptoms, age, gender, location, medical history, urgency level
- **Output**: List of recommended specialists with reasons, urgency levels, and additional info
- **Technology**: Genkit with Gemini AI model

### 2. API Endpoint (`src/app/api/specialist-recommendation/route.ts`)

- **Route**: `/api/specialist-recommendation`
- **Methods**: GET (info), POST (get recommendations)
- **Validation**: Zod schema validation for input data
- **Error Handling**: Proper error responses for validation and server errors

### 3. User Interface (`src/app/specialist-recommendation/page.tsx`)

- **Features**:
  - Responsive form for symptom input
  - Optional demographic fields (age, gender, location)
  - Medical history input
  - Urgency level selection
  - Results display with specialist cards
  - Urgency badges and additional information
  - Medical disclaimer

### 4. Integration

- **Navigation**: Added to site header as "Specialist Finder"
- **Features List**: Added as feature #4 in the landing page
- **Quick Replies**: Added prompt for specialist recommendation

## User Flow

1. User navigates to `/specialist-recommendation`
2. User fills out the form with symptoms and optional information
3. Form submits to API endpoint with validation
4. AI analyzes input and returns specialist recommendations
5. Results displayed with specialist types, reasons, and urgency levels
6. Medical disclaimer ensures user understands limitations

## Specialist Types Supported

The AI can recommend various specialists including:
- Cardiologist (heart conditions)
- Dermatologist (skin conditions)
- Orthopedic Surgeon (bone/joint issues)
- Neurologist (nervous system)
- Gastroenterologist (digestive system)
- Endocrinologist (hormonal conditions)
- Pulmonologist (lung conditions)
- Rheumatologist (autoimmune/joint conditions)
- Urologist (urinary system)
- Gynecologist (women's health)
- Ophthalmologist (eye conditions)
- ENT Specialist (ear, nose, throat)
- Psychiatrist (mental health)
- General Practitioner (primary care)

## Security & Privacy

- Protected route requiring authentication
- Input validation prevents malicious data
- No sensitive data storage
- Clear medical disclaimers
- Privacy-first approach consistent with Med-Genie values

## Testing

The API endpoint has been validated:
- ✅ GET request returns proper information
- ✅ Input validation works correctly
- ✅ Error handling for invalid data
- ⚠️ AI integration requires proper API keys (expected in production)

## Future Enhancements

- Integration with doctor directory APIs
- Location-based specialist search
- Appointment booking integration
- User preference learning
- Multi-language support