'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Loader2, User, Mail, Calendar, Activity, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfileData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  age?: number | null;
  bloodGroup?: string | null;
  allergies?: string | null;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    allergies: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [isAuthenticated, router]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
      
      const res = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.success && data.user) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || '',
          age: data.user.age ? data.user.age.toString() : '',
          bloodGroup: data.user.bloodGroup || '',
          allergies: data.user.allergies || ''
        });
      }
    } catch (error) {
      toast({
        title: 'Error loading profile',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
      
      const payload: any = {
        name: formData.name.trim(),
        bloodGroup: formData.bloodGroup || null,
        allergies: formData.allergies || null
      };
      
      if (formData.age) {
        payload.age = parseInt(formData.age, 10);
      } else {
        payload.age = null;
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({ title: 'Profile updated successfully' });
        fetchProfile(); // Refresh data
        setIsEditing(false);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age ? profile.age.toString() : '',
        bloodGroup: profile.bloodGroup || '',
        allergies: profile.allergies || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit2 className="h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>

          <Card className="shadow-md">
            <CardHeader className="bg-white dark:bg-gray-800 border-b pb-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {profile.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Member since {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={profile.email} disabled className="bg-gray-100 dark:bg-gray-800" />
                      <p className="text-xs text-gray-500">Email cannot be changed.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        min="1" 
                        max="150"
                        placeholder="e.g. 30"
                        value={formData.age} 
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select 
                        value={formData.bloodGroup} 
                        onValueChange={(val) => setFormData({...formData, bloodGroup: val})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Textarea 
                      id="allergies" 
                      placeholder="List any known allergies (e.g. Peanuts, Penicillin)"
                      rows={3}
                      value={formData.allergies} 
                      onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Activity className="h-5 w-5 text-blue-600" /> Health Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 mb-1">Age</p>
                        <p className="font-medium">{profile.age ? `${profile.age} years` : 'Not specified'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                        <p className="font-medium">{profile.bloodGroup || 'Not specified'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 sm:col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Known Allergies</p>
                        <p className="font-medium">{profile.allergies || 'None specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {isEditing && (
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 rounded-b-xl border-t p-4">
                <Button variant="outline" onClick={cancelEdit} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />} 
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
