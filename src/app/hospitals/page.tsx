'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Phone, AlertCircle, Map, Navigation } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Hospital {
  name: string;
  contact: string;
  address: string;
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleFindNearby = () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setHospitals([]);
    setLocationName(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 1. Reverse geocode to get the state
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!geoRes.ok) throw new Error("Failed to determine location from coordinates.");
          const geoData = await geoRes.json();
          
          const state = geoData.address.state;
          if (!state) {
            throw new Error("Could not determine your state from the location data.");
          }
          
          setLocationName(geoData.address.city || geoData.address.town || geoData.address.county || state);

          // 2. Fetch hospitals for the state
          const hospRes = await fetch(`/api/nearby-hospitals?state=${encodeURIComponent(state)}`);
          const hospData = await hospRes.json();

          if (!hospRes.ok) {
            throw new Error(hospData.error || hospData.message || "Failed to fetch hospitals.");
          }

          if (hospData.hospitals && hospData.hospitals.length > 0) {
            setHospitals(hospData.hospitals);
          } else {
            setError(`We couldn't find any hospitals in our database for ${state}.`);
          }

        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.");
          toast({
            title: "Error",
            description: err.message || "Failed to find hospitals.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        setIsLoading(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError("Location access was denied. Please allow location access to find nearby hospitals.");
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case geoError.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError("An unknown error occurred while requesting location.");
            break;
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <MapPin className="h-8 w-8 text-blue-600" />
              Find Nearby Hospitals
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Get instant access to a list of hospitals in your state. We use your device's location to query the national database for medical facilities.
            </p>
            
            <div className="pt-6">
              <Button 
                onClick={handleFindNearby} 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md px-8 py-6 rounded-full text-lg transition-transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Locating you...
                  </>
                ) : (
                  <>
                    <Navigation className="mr-2 h-6 w-6" />
                    Locate Hospitals Near Me
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {hasSearched && !isLoading && !error && hospitals.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Hospitals in your region {locationName && `(${locationName})`}
                </h2>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
                  {hospitals.length} Found
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hospitals.map((hospital, idx) => {
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.name} ${hospital.address}`)}`;
                  
                  return (
                    <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-800 flex flex-col">
                      <div className="h-2 bg-blue-600 w-full" />
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                          {hospital.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow flex flex-col">
                        <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                          <MapPin className="h-5 w-5 shrink-0 text-gray-400 mt-0.5" />
                          <span className="text-sm line-clamp-3">{hospital.address}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 mt-auto pt-4">
                          <Phone className="h-5 w-5 shrink-0 text-gray-400" />
                          <span className="text-sm font-medium">{hospital.contact}</span>
                        </div>
                        
                        <Button variant="outline" className="w-full mt-4" asChild>
                          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                            <Map className="mr-2 h-4 w-4" />
                            View on Map
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
