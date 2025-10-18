'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Stethoscope, MapPin, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InputSanitizer } from '@/lib/input-sanitizer';

import Layout from '@/components/layout';

interface SpecialistRecommendation {
  specialty: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
  additionalInfo?: string;
}

interface UserInput {
  symptoms: string;
  age: string;
  gender: string;
  location: string;
  medicalHistory: string;
  duration: string;
  severity: string;
}

export default function SpecialistRecommendationPage() {
  const [userInput, setUserInput] = useState<UserInput>({
    symptoms: '',
    age: '',
    gender: '',
    location: '',
    medicalHistory: '',
    duration: '',
    severity: ''
  });

  const [recommendations, setRecommendations] = useState<SpecialistRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (field: keyof UserInput, value: string) => {
    // Clear field error
    setFieldErrors(prev => ({ ...prev, [field]: '' }));

    // Validate input for XSS patterns
    if (field === 'symptoms' || field === 'medicalHistory' || field === 'location') {
      const validation = InputSanitizer.validateInput(value, 2000);
      if (!validation.isValid) {
        setFieldErrors(prev => ({ ...prev, [field]: validation.errors[0] || 'Invalid input detected' }));
        // Still allow typing but show warning
      }
    }

    setUserInput(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let hasErrors = false;

    // Validate required fields
    if (!userInput.symptoms.trim()) {
      errors.symptoms = 'Symptoms are required';
      hasErrors = true;
    }

    // Validate text fields for XSS
    if (userInput.symptoms.trim()) {
      const symptomsValidation = InputSanitizer.validateInput(userInput.symptoms, 2000);
      if (!symptomsValidation.isValid) {
        errors.symptoms = symptomsValidation.errors[0] || 'Invalid input detected';
        hasErrors = true;
      }
    }

    if (userInput.medicalHistory.trim()) {
      const medicalHistoryValidation = InputSanitizer.validateInput(userInput.medicalHistory, 2000);
      if (!medicalHistoryValidation.isValid) {
        errors.medicalHistory = medicalHistoryValidation.errors[0] || 'Invalid input detected';
        hasErrors = true;
      }
    }

    if (userInput.location.trim()) {
      const locationValidation = InputSanitizer.validateInput(userInput.location, 500);
      if (!locationValidation.isValid) {
        errors.location = locationValidation.errors[0] || 'Invalid input detected';
        hasErrors = true;
      }
    }

    setFieldErrors(errors);
    return !hasErrors;
  };

  const getRecommendations = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the input errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Sanitize all input data before sending to API
      const sanitizedInput = {
        symptoms: InputSanitizer.sanitizeString(userInput.symptoms, 2000),
        age: userInput.age,
        gender: userInput.gender,
        location: InputSanitizer.sanitizeString(userInput.location, 500),
        medicalHistory: InputSanitizer.sanitizeString(userInput.medicalHistory, 2000),
        duration: userInput.duration,
        severity: userInput.severity
      };

      // Log security events if any sanitization occurred
      Object.keys(sanitizedInput).forEach((key) => {
        const originalValue = userInput[key as keyof UserInput];
        const sanitizedValue = sanitizedInput[key as keyof UserInput];
        if (originalValue !== sanitizedValue) {
          InputSanitizer.logSecurityEvent(
            `Specialist recommendation field ${key} sanitized`,
            originalValue,
            sanitizedValue
          );
        }
      });

      const response = await fetch('/api/specialist-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedInput),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      setHasSearched(true);

      toast({
        title: "Recommendations Generated",
        description: "We've found the best specialists for your condition.",
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get specialist recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearForm = () => {
    setUserInput({
      symptoms: '',
      age: '',
      gender: '',
      location: '',
      medicalHistory: '',
      duration: '',
      severity: ''
    });
    setRecommendations([]);
    setHasSearched(false);
    setFieldErrors({});
  };

  return (
    <Layout>
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Stethoscope className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Specialist Recommendation</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized doctor specialist recommendations based on your symptoms and health profile.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Health Information
              </CardTitle>
              <CardDescription>
                Please provide details about your symptoms and health profile for accurate recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms or Health Concerns *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms, pain, or health concerns in detail..."
                  value={userInput.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  className={`min-h-[100px] ${fieldErrors.symptoms ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {fieldErrors.symptoms && (
                  <div className="text-red-500 text-xs">
                    ⚠️ {fieldErrors.symptoms}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={userInput.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={userInput.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State or Country"
                    value={userInput.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`pl-10 ${fieldErrors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                {fieldErrors.location && (
                  <div className="text-red-500 text-xs">
                    ⚠️ {fieldErrors.location}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={userInput.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="few-hours">A few hours</SelectItem>
                      <SelectItem value="1-2-days">1-2 days</SelectItem>
                      <SelectItem value="3-7-days">3-7 days</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1-month">About a month</SelectItem>
                      <SelectItem value="several-months">Several months</SelectItem>
                      <SelectItem value="chronic">Chronic/Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={userInput.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pain level?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild (1-3)</SelectItem>
                      <SelectItem value="moderate">Moderate (4-6)</SelectItem>
                      <SelectItem value="severe">Severe (7-8)</SelectItem>
                      <SelectItem value="extreme">Extreme (9-10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Any relevant medical conditions, allergies, medications..."
                  value={userInput.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  className={`min-h-[80px] ${fieldErrors.medicalHistory ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {fieldErrors.medicalHistory && (
                  <div className="text-red-500 text-xs">
                    ⚠️ {fieldErrors.medicalHistory}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={getRecommendations}
                  disabled={isLoading || Object.keys(fieldErrors).some(key => fieldErrors[key])}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    'Get Specialist Recommendations'
                  )}
                </Button>
                <Button variant="outline" onClick={clearForm}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Specialists</CardTitle>
              <CardDescription>
                {hasSearched ?
                  "Based on your symptoms and profile, here are our recommendations:" :
                  "Your specialist recommendations will appear here after submission."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!hasSearched && !isLoading && (
                <Alert>
                  <Stethoscope className="h-4 w-4" />
                  <AlertDescription>
                    Please fill out the form and submit to get personalized specialist recommendations.
                  </AlertDescription>
                </Alert>
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Analyzing your symptoms...</span>
                </div>
              )}

              {hasSearched && recommendations.length === 0 && !isLoading && (
                <Alert>
                  <AlertDescription>
                    No specific specialist recommendations found. Please try providing more detailed symptoms.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold">
                          {rec.specialty}
                        </h3>
                        <Badge className={getUrgencyColor(rec.urgency)}>
                          {rec.urgency} priority
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{rec.description}</p>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">Why this specialist:</p>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                      {rec.additionalInfo && (
                        <div className="mt-3 p-3 bg-primary/10 rounded-md">
                          <p className="text-sm text-muted-foreground">{rec.additionalInfo}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Medical Disclaimer:</strong> This tool provides general guidance only and should not replace professional medical advice.
            Always consult with a healthcare provider for proper diagnosis and treatment. In case of emergency, call your local emergency number immediately.
          </AlertDescription>
        </Alert>
      </div>
    </div>
    </Layout>
  );
}
