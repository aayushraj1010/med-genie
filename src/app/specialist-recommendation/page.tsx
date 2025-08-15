'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, MapPin, Heart, AlertCircle, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BackgroundParticles } from '@/components/background-particles';

type SpecialistRecommendation = {
  specialistType: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  additionalInfo?: string;
};

type SpecialistRecommendationResponse = {
  recommendedSpecialists: SpecialistRecommendation[];
  generalAdvice: string;
  disclaimer: string;
};

function SpecialistRecommendationPage() {
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    gender: '',
    location: '',
    medicalHistory: '',
    urgency: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SpecialistRecommendationResponse | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.symptoms.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please describe your symptoms or medical concerns.'
      });
      return;
    }

    setIsLoading(true);
    setRecommendations(null);

    try {
      const payload = {
        symptoms: formData.symptoms,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        location: formData.location || undefined,
        medicalHistory: formData.medicalHistory || undefined,
        urgency: formData.urgency
      };

      const response = await fetch('/api/specialist-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get recommendations');
      }

      if (result.success && result.data) {
        setRecommendations(result.data);
        toast({
          title: 'Recommendations Ready',
          description: 'Your specialist recommendations have been generated.'
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error getting specialist recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get specialist recommendations'
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

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '💡';
      default: return '💡';
    }
  };

  return (
    <div className="min-h-screen bg-med-genie-dark text-foreground">
      <BackgroundParticles />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Doctor Specialist Recommendation</h1>
          <p className="text-lg text-gray-300">Get AI-powered recommendations for medical specialists based on your symptoms</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Input Form */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Tell us about your symptoms</CardTitle>
              <CardDescription className="text-gray-300">
                Provide as much detail as possible for accurate recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="symptoms" className="text-white">Symptoms or Medical Concerns *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms, pain, concerns, or health issues..."
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder-white/50"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-white">Age (optional)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder-white/50"
                      min="0"
                      max="150"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-white">Gender (optional)</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
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

                <div>
                  <Label htmlFor="location" className="text-white">Location (optional)</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder-white/50"
                  />
                </div>

                <div>
                  <Label htmlFor="medicalHistory" className="text-white">Medical History (optional)</Label>
                  <Textarea
                    id="medicalHistory"
                    placeholder="Any relevant medical conditions, medications, or past treatments..."
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder-white/50"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="urgency" className="text-white">How urgent do you feel this is?</Label>
                  <Select value={formData.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, urgency: value })}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait for regular appointment</SelectItem>
                      <SelectItem value="medium">Medium - Should be seen soon</SelectItem>
                      <SelectItem value="high">High - Need urgent attention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.symptoms.trim()}
                  className="w-full bg-[rgb(63,181,244)] hover:bg-[rgb(63,181,244)]/80"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Get Specialist Recommendations
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {recommendations && (
              <>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">Recommended Specialists</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendations.recommendedSpecialists.map((specialist, index) => (
                      <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white">{specialist.specialistType}</h3>
                          <Badge className={getUrgencyColor(specialist.urgency)}>
                            {getUrgencyIcon(specialist.urgency)} {specialist.urgency}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{specialist.reason}</p>
                        {specialist.additionalInfo && (
                          <div className="mt-2 p-2 bg-blue-500/10 rounded text-blue-300 text-sm">
                            💡 {specialist.additionalInfo}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">General Advice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{recommendations.generalAdvice}</p>
                  </CardContent>
                </Card>

                <Alert className="bg-orange-500/10 border-orange-500/20">
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                  <AlertTitle className="text-orange-300">Important Medical Disclaimer</AlertTitle>
                  <AlertDescription className="text-orange-200">
                    {recommendations.disclaimer}
                  </AlertDescription>
                </Alert>
              </>
            )}

            {!recommendations && !isLoading && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Ready to Help</h3>
                  <p className="text-gray-300">Fill out the form on the left to get personalized specialist recommendations based on your symptoms.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with protected route
export default function ProtectedSpecialistRecommendationPage() {
  return (
    <ProtectedRoute>
      <SpecialistRecommendationPage />
    </ProtectedRoute>
  );
}