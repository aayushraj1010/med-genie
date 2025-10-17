// app/services/page.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Shield, 
  User, 
  HeartPulse,
  MessageSquare, 
  Stethoscope, 
  Phone, 
  Pill,
  Lock,
  RefreshCw,
  ShieldCheck,
  Users,
  History,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle,
  Star,
  Sparkles,
  Brain,
  Heart,
  Activity,
  FileText,
  Globe,
  Smartphone,
  Key,
  Database,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function ServicesPage() {
    return (
        <>
            <SiteHeader />
            <div className="min-h-screen bg-background text-foreground">
                <div className="container mx-auto px-4 py-12 space-y-16">
                {/* Hero Section */}
                <div className="text-center space-y-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-secondary/20 blur-3xl rounded-full transform scale-150 opacity-30"></div>
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="p-4 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/20 backdrop-blur-sm shadow-2xl">
                                <Sparkles className="h-16 w-16 text-blue-100" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent mb-6">
                            Our Services
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Experience the future of healthcare with our comprehensive AI-powered solutions
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        <Badge className="px-6 py-2 text-base bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 shadow-lg">
                            <Clock className="h-4 w-4 mr-2" />
                            24/7 Available
                        </Badge>
                        <Badge className="px-6 py-2 text-base bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg">
                            <Shield className="h-4 w-4 mr-2" />
                            HIPAA Compliant
                        </Badge>
                        <Badge className="px-6 py-2 text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg">
                            <Zap className="h-4 w-4 mr-2" />
                            Instant Response
                        </Badge>
                    </div>
                </div>

                {/* Main Services Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* AI Health Assistant */}
                    <Card className="group relative overflow-hidden border shadow-lg bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardHeader className="relative pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-primary/20 group-hover:from-blue-300 group-hover:to-primary/10 transition-all duration-300">
                                    <Bot className="h-8 w-8 text-primary" />
                                </div>
                                <Badge className="bg-primary/10 text-blue-200 border-blue-100 hover:bg-primary/20">
                                    <Brain className="h-3 w-3 mr-1" />
                                    AI Powered
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-bold group-hover:text-blue-300 transition-colors">
                                AI Health Assistant
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Advanced AI providing instant, personalized health guidance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative space-y-4">
                            {[
                                { icon: Heart, title: "Instant Health Info", desc: "Get immediate answers to health questions" },
                                { icon: Stethoscope, title: "Symptom Analysis", desc: "Advanced symptom checker with recommendations" },
                                { icon: Phone, title: "Emergency Protocols", desc: "Quick access to emergency procedures" },
                                { icon: Pill, title: "Medication Lookup", desc: "Comprehensive drug information database" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-muted/30 border hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                                    <div className="p-2 rounded-lg bg-blue-200">
                                        <item.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Security & Authentication */}
                    <Card className="group relative overflow-hidden border shadow-lg bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardHeader className="relative pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/20 group-hover:from-green-500/20 group-hover:to-green-500/30 transition-all duration-300">
                                    <Shield className="h-8 w-8 text-green-500" />
                                </div>
                                <Badge className="bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Enterprise Security
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-bold group-hover:text-green-600 transition-colors">
                                Advanced Security
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Military-grade security protecting your health data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative space-y-4">
                            {[
                                { icon: Key, title: "JWT Authentication", desc: "Secure token-based authentication system" },
                                { icon: Lock, title: "Password Encryption", desc: "bcrypt hashing for maximum security" },
                                { icon: RefreshCw, title: "Session Management", desc: "Automatic token refresh and cleanup" },
                                { icon: Database, title: "Protected APIs", desc: "Middleware-based endpoint protection" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-muted/30 border hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <item.icon className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Personalized Experience */}
                    <Card className="group relative overflow-hidden border shadow-lg bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardHeader className="relative pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/20 group-hover:from-purple-500/20 group-hover:to-purple-500/30 transition-all duration-300">
                                    <User className="h-8 w-8 text-purple-500" />
                                </div>
                                <Badge className="bg-purple-500/10 text-purple-700 border-purple-500/20 hover:bg-purple-500/20">
                                    <Star className="h-3 w-3 mr-1" />
                                    Premium Experience
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-bold group-hover:text-purple-600 transition-colors">
                                Personalized Care
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Tailored healthcare experience just for you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative space-y-4">
                            {[
                                { icon: UserPlus, title: "Personal Accounts", desc: "Secure individual user profiles" },
                                { icon: Activity, title: "Health Profiles", desc: "Customized health tracking and insights" },
                                { icon: History, title: "Chat History", desc: "Access all your previous conversations" },
                                { icon: MessageSquare, title: "Smart Responses", desc: "Context-aware AI conversations" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-muted/30 border hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <item.icon className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Privacy & Compliance */}
                    <Card className="group relative overflow-hidden border shadow-lg bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardHeader className="relative pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/20 group-hover:from-orange-500/20 group-hover:to-orange-500/30 transition-all duration-300">
                                    <ShieldCheck className="h-8 w-8 text-orange-500" />
                                </div>
                                <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20">
                                    <FileText className="h-3 w-3 mr-1" />
                                    HIPAA Compliant
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-bold group-hover:text-orange-600 transition-colors">
                                Privacy & Compliance
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Industry-leading privacy protection standards
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative space-y-4">
                            {[
                                { icon: Lock, title: "End-to-End Encryption", desc: "Military-grade data protection" },
                                { icon: FileText, title: "HIPAA Compliance", desc: "Strict healthcare privacy standards" },
                                { icon: Shield, title: "Secure Policies", desc: "Advanced password validation" },
                                { icon: Globe, title: "Global Standards", desc: "International privacy compliance" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-muted/30 border hover:bg-muted/50 transition-all duration-300 hover:shadow-md">
                                    <div className="p-2 rounded-lg bg-orange-500/10">
                                        <item.icon className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Stats */}
                <Card className="border shadow-lg bg-card overflow-hidden">
                    <CardContent className="py-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Trusted by Thousands
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Experience unmatched performance and reliability
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: "<1s", label: "Response Time", icon: Zap, color: "text-yellow-500" },
                                { value: "99.9%", label: "Uptime", icon: CheckCircle, color: "text-green-500" },
                                { value: "10K+", label: "Active Users", icon: Users, color: "text-blue-500" },
                                { value: "24/7", label: "Support", icon: HeartPulse, color: "text-red-500" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-muted/30 border group-hover:shadow-lg transition-all duration-300 mb-4 ${stat.color}`}>
                                        <stat.icon className="h-8 w-8" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="border shadow-lg bg-gradient-to-br from-primary via-purple-600 to-secondary overflow-hidden relative">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-primary-foreground/5 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
                    </div>
                    <CardContent className="relative py-16 text-center text-primary-foreground">
                        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm mb-8">
                            <HeartPulse className="h-16 w-16" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Start Your Health Journey Today
                        </h2>
                        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join thousands who trust Med Genie for intelligent healthcare assistance. 
                            Experience the future of personalized health support.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" asChild>
                                <Link href="/login">
                                    Get Started Free
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8 py-4 text-lg rounded-2xl transition-all duration-300 transform hover:-translate-y-1" asChild>
                                <Link href="/chat">
                                    Try Demo
                                    <MessageSquare className="h-5 w-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <SiteFooter />
        </>
    );
}