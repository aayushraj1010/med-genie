// app/about/page.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  HeartPulse, 
  MessageSquare, 
  Hospital, 
  ShieldCheck, 
  Globe2, 
  Target,
  Users,
  Heart,
  Lightbulb,
  Code,
  Github,
  ExternalLink,
  Brain,
  Stethoscope,
  Shield,
  Zap,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout';

export default function AboutPage() {
    return (
        <Layout>
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 space-y-8">
                
                {/* Hero Section */}
                <Card className="mt-13 relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
                    <CardHeader className="text-center pb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 rounded-full bg-primary/10 border-2 border-primary/20">
                                <HeartPulse className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Med Genie
                        </CardTitle>
                        <CardDescription className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Your intelligent AI health companion, making healthcare information accessible to everyone
                        </CardDescription>
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            <Badge variant="outline" className="text-sm px-3 py-1">
                                <Github className="h-3 w-3 mr-1" />
                                Open Source
                            </Badge>
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                <Award className="h-3 w-3 mr-1" />
                                GSSoC'25 Project
                            </Badge>
                            <Badge variant="default" className="text-sm px-3 py-1">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Health Assistant
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                {/* Why We Exist Section */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-bold">
                            <Target className="h-6 w-6 text-primary mr-3" />
                            Why Do We Exist?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-base leading-relaxed">
                        <p>
                            Healthcare information should be accessible to everyone, but navigating complex medical resources can be overwhelming. 
                            <span className="font-semibold text-primary"> Med Genie bridges this gap</span> by providing instant, AI-powered health guidance 
                            in a conversational, easy-to-understand format.
                        </p>
                        <div className="bg-muted/30 p-4 rounded-lg border">
                            <p className="text-sm">
                                <strong>Our Vision:</strong> A world where basic healthcare information is available 24/7, helping people make informed decisions 
                                about their health while emphasizing the importance of professional medical care.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* What We Provide Section */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-bold">
                            <Heart className="h-6 w-6 text-primary mr-3" />
                            What We Provide
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Conversational AI Health Support</h3>
                                        <p className="text-sm text-muted-foreground">Natural conversations about symptoms, conditions, and general health queries</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Hospital className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Emergency Guidance</h3>
                                        <p className="text-sm text-muted-foreground">Quick access to hospital information and emergency contact guidance</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Stethoscope className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Symptom Analysis</h3>
                                        <p className="text-sm text-muted-foreground">AI-powered symptom checker with personalized health suggestions</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Privacy-First Approach</h3>
                                        <p className="text-sm text-muted-foreground">Your health data stays private - we don't store personal information</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Globe2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Accessible Design</h3>
                                        <p className="text-sm text-muted-foreground">Responsive, modern interface accessible on any device</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Instant Responses</h3>
                                        <p className="text-sm text-muted-foreground">Get immediate answers to your health questions, day or night</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mission & Values */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl font-bold">
                                <Lightbulb className="h-5 w-5 text-primary mr-2" />
                                Our Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base leading-relaxed">
                                To democratize healthcare information by providing an intelligent, accessible, and trustworthy AI assistant 
                                that empowers individuals to make informed health decisions while promoting professional medical consultation.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl font-bold">
                                <Users className="h-5 w-5 text-primary mr-2" />
                                Our Values
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                    <span><strong>Accessibility:</strong> Healthcare for everyone</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                    <span><strong>Privacy:</strong> Your data, your control</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                    <span><strong>Transparency:</strong> Open-source development</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                    <span><strong>Innovation:</strong> AI-powered healthcare</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Technology Stack */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-bold">
                            <Code className="h-6 w-6 text-primary mr-3" />
                            Built with Modern Technology
                        </CardTitle>
                        <CardDescription>
                            Powered by cutting-edge technologies for optimal performance and user experience
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <Badge variant="secondary" className="justify-center py-2">Next.js 14</Badge>
                            <Badge variant="secondary" className="justify-center py-2">TypeScript</Badge>
                            <Badge variant="secondary" className="justify-center py-2">Google AI</Badge>
                            <Badge variant="secondary" className="justify-center py-2">Tailwind CSS</Badge>
                            <Badge variant="secondary" className="justify-center py-2">Radix UI</Badge>
                            <Badge variant="secondary" className="justify-center py-2">Vercel</Badge>
                            <Badge variant="secondary" className="justify-center py-2">Prisma</Badge>
                            <Badge variant="secondary" className="justify-center py-2">React Hook Form</Badge>
                            <Badge variant="secondary" className="justify-center py-2">Zod</Badge>
                            <Badge variant="secondary" className="justify-center py-2">Lucide Icons</Badge>
                            <Badge variant="secondary" className="justify-center py-2">PWA Ready</Badge>
                            <Badge variant="secondary" className="justify-center py-2">Analytics</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Open Source & Community */}
                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-bold">
                            <BookOpen className="h-6 w-6 text-primary mr-3" />
                            Open Source & Community
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-base leading-relaxed">
                            Med Genie is proudly part of <strong>GirlScript Summer of Code 2025 (GSSoC'25)</strong>, 
                            fostering open-source contribution and collaborative development in the healthcare technology space.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="outline" asChild>
                                <Link href="https://github.com/aayushraj1010/med-genie" target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4 mr-2" />
                                    View on GitHub
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/contribute">
                                    <Users className="h-4 w-4 mr-2" />
                                    Contribute
                                </Link>
                            </Button>
                        </div>
                        <Separator />
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p><strong>License:</strong> MIT License - Feel free to use, modify, and distribute</p>
                            <p><strong>Contributors:</strong> Open to developers, designers, and healthcare professionals worldwide</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Important Disclaimer */}
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-lg bg-destructive/10">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-destructive">Important Medical Disclaimer</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Med Genie provides general health information for educational purposes only and should not be considered as 
                                    professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals 
                                    for medical concerns. In case of emergencies, contact your local emergency services immediately.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
            </div>
        </div>
        </Layout>

    );
}
