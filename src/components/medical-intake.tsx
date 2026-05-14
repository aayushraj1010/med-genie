"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronLeft, Heart, Activity, AlertCircle, User } from 'lucide-react';

interface MedicalIntakeProps {
  onComplete: (data: MedicalIntakeData) => void;
  onSkip: () => void;
}

export interface MedicalIntakeData {
  hasMedicalHistory: boolean;
  conditions: string[];
  currentMedications: string;
  allergies: string;
  lifestyle: string;
  emergencyContact: string;
  hasRegularSpecialist: boolean;
  specialistType: string;
  alertEnabled: boolean;
  alertConditions: string[];
}

const CONDITION_OPTIONS = [
  'Diabetes', 'Heart Disease', 'High Blood Pressure', 'Asthma', 
  'Arthritis', 'Cancer', 'Epilepsy/Seizures', 'Mental Health Condition',
  'Thyroid Disorder', 'Kidney Disease', 'Liver Disease', 'None of the above'
];

const SPECIALIST_TYPES = [
  'Neurologist', 'Cardiologist', 'Endocrinologist', 'Psychiatrist',
  'Neurologist (for seizures)', 'Other'
];

export function MedicalIntake({ onComplete, onSkip }: MedicalIntakeProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<MedicalIntakeData>({
    hasMedicalHistory: false,
    conditions: [],
    currentMedications: '',
    allergies: '',
    lifestyle: '',
    emergencyContact: '',
    hasRegularSpecialist: false,
    specialistType: '',
    alertEnabled: false,
    alertConditions: []
  });

  const updateFormData = (field: keyof MedicalIntakeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCondition = (condition: string) => {
    const newConditions = formData.conditions.includes(condition)
      ? formData.conditions.filter(c => c !== condition)
      : [...formData.conditions, condition];
    // If selecting "None", clear all other conditions
    if (condition === 'None of the above') {
      updateFormData('conditions', newConditions.includes('None of the above') ? ['None of the above'] : []);
    } else {
      updateFormData('conditions', newConditions.filter(c => c !== 'None of the above'));
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) return !formData.hasMedicalHistory || formData.conditions.length > 0;
    if (step === 3) return true;
    return true;
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Welcome! Let's Get to Know You
        </CardTitle>
        <CardDescription>
          This helps Med Genie provide better personalized health advice. You can skip or update anytime.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress indicator */}
        <div className="flex mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Do you have any medical conditions or history?
              </Label>
              <RadioGroup 
                value={formData.hasMedicalHistory ? 'yes' : 'no'}
                onValueChange={(v) => updateFormData('hasMedicalHistory', v === 'yes')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-conditions-yes" />
                  <Label htmlFor="has-conditions-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="has-conditions-no" />
                  <Label htmlFor="has-conditions-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Current Medications (optional)</Label>
              <Textarea 
                placeholder="List any medications you're currently taking..."
                value={formData.currentMedications}
                onChange={(e) => updateFormData('currentMedications', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Known Allergies (optional)</Label>
              <Input 
                placeholder="e.g., Penicillin, Peanuts..."
                value={formData.allergies}
                onChange={(e) => updateFormData('allergies', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Lifestyle (optional)
              </Label>
              <Textarea 
                placeholder="Exercise, diet, work stress, sleep patterns..."
                value={formData.lifestyle}
                onChange={(e) => updateFormData('lifestyle', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Conditions */}
        {step === 2 && formData.hasMedicalHistory && (
          <div className="space-y-4">
            <Label>Select all that apply:</Label>
            <div className="grid grid-cols-2 gap-2">
              {CONDITION_OPTIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={formData.conditions.includes(condition)}
                    onCheckedChange={() => toggleCondition(condition)}
                  />
                  <Label htmlFor={condition} className="text-sm cursor-pointer">{condition}</Label>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4">
              <Label className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Emergency Contact Name/Phone (optional)
              </Label>
              <Input 
                placeholder="Name and phone number..."
                value={formData.emergencyContact}
                onChange={(e) => updateFormData('emergencyContact', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Specialist & Alerts */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Do you see a specialist regularly?
              </Label>
              <RadioGroup 
                value={formData.hasRegularSpecialist ? 'yes' : 'no'}
                onValueChange={(v) => updateFormData('hasRegularSpecialist', v === 'yes')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-specialist-yes" />
                  <Label htmlFor="has-specialist-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="has-specialist-no" />
                  <Label htmlFor="has-specialist-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.hasRegularSpecialist && (
              <div className="space-y-2">
                <Label>Specialist Type:</Label>
                <RadioGroup 
                  value={formData.specialistType}
                  onValueChange={(v) => updateFormData('specialistType', v)}
                >
                  {SPECIALIST_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alert-enabled"
                  checked={formData.alertEnabled}
                  onCheckedChange={(checked) => updateFormData('alertEnabled', checked)}
                />
                <Label htmlFor="alert-enabled" className="font-medium cursor-pointer">
                  🔔 Enable Emergency Alerts
                </Label>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                Alert your emergency contact if certain symptoms are detected (e.g., seizure-related keywords)
              </p>
            </div>

            {formData.alertEnabled && (
              <div className="space-y-2 pt-2">
                <Label>Alert me when symptoms suggest:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Seizure Activity', 'Chest Pain', 'Severe Bleeding', 'Difficulty Breathing', 'Allergic Reaction', 'Mental Health Crisis'].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.alertConditions.includes(condition)}
                        onCheckedChange={(checked) => {
                          const newConditions = checked
                            ? [...formData.alertConditions, condition]
                            : formData.alertConditions.filter(c => c !== condition);
                          updateFormData('alertConditions', newConditions);
                        }}
                      />
                      <Label htmlFor={condition} className="text-sm cursor-pointer">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
          
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step === 3 ? 'Complete' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}