'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Heart, Brain, Apple, Activity, Shield, Star, Loader2 } from 'lucide-react';

interface HealthTip {
  id: string;
  title: string;
  summary: string;
  icon: string;
  category: string;
  verifiedBy?: string;
  link: string;
}

interface HealthTipsData {
  tips: HealthTip[];
  categories: string[];
}

export default function HealthVaultPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTips, setFilteredTips] = useState<HealthTip[]>([]);
  const [allTips, setAllTips] = useState<HealthTip[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load health tips data
  useEffect(() => {
    const loadHealthTips = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/health-tips.json');
        if (!response.ok) {
          throw new Error('Failed to load health tips');
        }
        const data: HealthTipsData = await response.json();
        setAllTips(data.tips);
        setCategories(data.categories);
        setFilteredTips(data.tips);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load health tips');
      } finally {
        setIsLoading(false);
      }
    };

    loadHealthTips();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredTips(allTips);
    } else {
      setFilteredTips(allTips.filter(tip => tip.category === selectedCategory));
    }
  }, [selectedCategory, allTips]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nutrition':
        return <Apple className="w-4 h-4" />;
      case 'Mental Health':
        return <Brain className="w-4 h-4" />;
      case 'Fitness':
        return <Activity className="w-4 h-4" />;
      case 'Wellness':
        return <Heart className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Loading health tips...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Health Vault
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Curated tips and trusted wellness resources to help you maintain a healthy lifestyle. 
            Each tip is verified by reputable health organizations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" data-aos="fade-up">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full px-6 py-2 transition-all duration-200 hover:scale-105"
            >
              {getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
            </Button>
          ))}
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip, index) => (
            <Card 
              key={tip.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{tip.icon}</div>
                  <Badge variant="secondary" className="text-xs">
                    {tip.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {tip.summary}
                </p>
                
                {tip.verifiedBy && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <Shield className="w-3 h-3" />
                    <span>Verified by {tip.verifiedBy}</span>
                  </div>
                )}
                
                <Button 
                  asChild
                  size="sm" 
                  className="w-full group-hover:bg-blue-600 transition-colors"
                >
                  <a 
                    href={tip.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Read More
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="text-center py-12" data-aos="fade-up">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No tips found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try selecting a different category or check back later for new tips.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 