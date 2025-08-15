import { NextRequest, NextResponse } from 'next/server';

// Temporarily use a mock function for testing until AI is configured
async function getMockRecommendations(input: any) {
  const { symptoms, age, gender, severity, duration } = input;
  const symptomsLower = symptoms.toLowerCase();
  const mockRecommendations = [];

  // Emergency conditions - high priority
  if (symptomsLower.includes('chest pain') && (symptomsLower.includes('shortness of breath') || symptomsLower.includes('breathing'))) {
    mockRecommendations.push({
      specialty: 'Emergency Medicine',
      description: 'Immediate medical attention for chest pain with breathing issues',
      urgency: 'high',
      reason: 'Chest pain with breathing difficulties can indicate a serious cardiac emergency',
      additionalInfo: 'Call 911 or go to the nearest emergency room immediately'
    });
  } else if (symptomsLower.includes('stroke') || symptomsLower.includes('paralysis') || symptomsLower.includes('slurred speech')) {
    mockRecommendations.push({
      specialty: 'Emergency Medicine',
      description: 'Immediate medical attention for potential stroke symptoms',
      urgency: 'high',
      reason: 'These symptoms may indicate a stroke requiring immediate intervention',
      additionalInfo: 'Time is critical - seek emergency care immediately'
    });
  }
  // Heart-related symptoms
  else if (symptomsLower.includes('chest pain') || symptomsLower.includes('heart palpitation') || symptomsLower.includes('irregular heartbeat')) {
    mockRecommendations.push({
      specialty: 'Cardiologist',
      description: 'Heart and cardiovascular system specialist',
      urgency: severity === 'severe' || severity === 'extreme' ? 'high' : 'medium',
      reason: 'Your symptoms suggest a potential heart or cardiovascular issue',
      additionalInfo: 'A cardiologist can perform tests like ECG, echocardiogram, and stress tests'
    });
  }
  // Skin conditions
  else if (symptomsLower.includes('rash') || symptomsLower.includes('itching') || symptomsLower.includes('skin') || symptomsLower.includes('acne') || symptomsLower.includes('mole')) {
    mockRecommendations.push({
      specialty: 'Dermatologist',
      description: 'Skin, hair, and nail specialist',
      urgency: symptomsLower.includes('changing mole') || symptomsLower.includes('bleeding') ? 'high' : 'low',
      reason: 'Your symptoms are related to skin conditions',
      additionalInfo: 'A dermatologist can diagnose and treat various skin conditions'
    });
  }
  // Joint and bone issues
  else if (symptomsLower.includes('joint pain') || symptomsLower.includes('back pain') || symptomsLower.includes('arthritis') || symptomsLower.includes('bone')) {
    mockRecommendations.push({
      specialty: 'Orthopedic Surgeon',
      description: 'Bone, joint, and musculoskeletal specialist',
      urgency: severity === 'severe' || severity === 'extreme' ? 'medium' : 'low',
      reason: 'Your symptoms suggest musculoskeletal issues',
      additionalInfo: 'An orthopedist can evaluate bone and joint problems'
    });
  }
  // Neurological symptoms
  else if (symptomsLower.includes('headache') || symptomsLower.includes('dizziness') || symptomsLower.includes('seizure') || symptomsLower.includes('numbness')) {
    mockRecommendations.push({
      specialty: 'Neurologist',
      description: 'Brain and nervous system specialist',
      urgency: symptomsLower.includes('seizure') || severity === 'extreme' ? 'high' : 'medium',
      reason: 'Your symptoms may be related to the nervous system',
      additionalInfo: 'A neurologist can evaluate brain and nerve function'
    });
  }
  // Digestive issues
  else if (symptomsLower.includes('stomach') || symptomsLower.includes('abdominal pain') || symptomsLower.includes('nausea') || symptomsLower.includes('diarrhea')) {
    mockRecommendations.push({
      specialty: 'Gastroenterologist',
      description: 'Digestive system specialist',
      urgency: severity === 'severe' || severity === 'extreme' ? 'medium' : 'low',
      reason: 'Your symptoms are related to the digestive system',
      additionalInfo: 'A gastroenterologist can diagnose digestive disorders'
    });
  }
  // Respiratory issues
  else if (symptomsLower.includes('cough') || symptomsLower.includes('breathing') || symptomsLower.includes('lung') || symptomsLower.includes('asthma')) {
    mockRecommendations.push({
      specialty: 'Pulmonologist',
      description: 'Lung and respiratory system specialist',
      urgency: symptomsLower.includes('difficulty breathing') ? 'high' : 'medium',
      reason: 'Your symptoms are related to respiratory function',
      additionalInfo: 'A pulmonologist specializes in lung diseases and breathing disorders'
    });
  }
  // Eye problems
  else if (symptomsLower.includes('eye') || symptomsLower.includes('vision') || symptomsLower.includes('blurred') || symptomsLower.includes('blind')) {
    mockRecommendations.push({
      specialty: 'Ophthalmologist',
      description: 'Eye and vision specialist',
      urgency: symptomsLower.includes('sudden vision loss') ? 'high' : 'medium',
      reason: 'Your symptoms are related to eye or vision problems',
      additionalInfo: 'An ophthalmologist can diagnose and treat eye conditions'
    });
  }
  // ENT issues
  else if (symptomsLower.includes('ear') || symptomsLower.includes('nose') || symptomsLower.includes('throat') || symptomsLower.includes('hearing')) {
    mockRecommendations.push({
      specialty: 'ENT Specialist',
      description: 'Ear, nose, and throat specialist',
      urgency: 'medium',
      reason: 'Your symptoms are related to ear, nose, or throat issues',
      additionalInfo: 'An ENT specialist can treat conditions affecting these areas'
    });
  }
  // Women's health
  else if (gender === 'female' && (symptomsLower.includes('menstrual') || symptomsLower.includes('pregnancy') || symptomsLower.includes('pelvic'))) {
    mockRecommendations.push({
      specialty: 'Gynecologist',
      description: 'Women\'s reproductive health specialist',
      urgency: 'medium',
      reason: 'Your symptoms are related to women\'s health',
      additionalInfo: 'A gynecologist specializes in women\'s reproductive health'
    });
  }
  // Mental health
  else if (symptomsLower.includes('depression') || symptomsLower.includes('anxiety') || symptomsLower.includes('stress') || symptomsLower.includes('mental')) {
    mockRecommendations.push({
      specialty: 'Psychiatrist',
      description: 'Mental health specialist',
      urgency: symptomsLower.includes('suicidal') ? 'high' : 'medium',
      reason: 'Your symptoms suggest mental health concerns',
      additionalInfo: 'A psychiatrist can provide mental health evaluation and treatment'
    });
  }
  
  // Default recommendation if no specific match
  if (mockRecommendations.length === 0) {
    mockRecommendations.push({
      specialty: 'Primary Care Physician',
      description: 'General medicine doctor for initial evaluation',
      urgency: 'medium',
      reason: 'A primary care physician can evaluate your symptoms and refer to specialists if needed',
      additionalInfo: 'Start with a general health checkup to determine next steps.'
    });
  }
  
  return {
    recommendations: mockRecommendations,
    disclaimers: [
      'These recommendations are for informational purposes only and should not replace professional medical advice.',
      'Please consult with a healthcare provider for proper diagnosis and treatment.',
      'If you experience severe or worsening symptoms, seek immediate medical attention.'
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      symptoms,
      age,
      gender,
      location,
      medicalHistory,
      duration,
      severity
    } = body;

    if (!symptoms || symptoms.trim() === '') {
      return NextResponse.json(
        { error: 'Symptoms are required' },
        { status: 400 }
      );
    }

    const input = {
      symptoms: symptoms.trim(),
      age: age || '',
      gender: gender || '',
      location: location || '',
      medicalHistory: medicalHistory || '',
      duration: duration || '',
      severity: severity || ''
    };

    // Use mock function for now
    const result = await getMockRecommendations(input);

    return NextResponse.json({
      recommendations: result.recommendations,
      disclaimers: result.disclaimers
    });

  } catch (error) {
    console.error('Error in specialist recommendation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
