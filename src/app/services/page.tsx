// app/services/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, Shield, User, HeartPulse,
  MessageSquare, Stethoscope, Phone, Pill,
  Lock, RefreshCw, ShieldCheck, Users,
  History, ArrowRight, Zap, Clock, CheckCircle,
  Star, Sparkles, Brain, Heart, Activity, FileText, Globe, Smartphone, Key, Database, UserPlus,
  Award, TrendingUp, Target, Layers
} from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function ServicesPage() {
  const services = [
    {
      title: "AI Health Assistant",
      icon: Bot,
      badge: { text: "AI Powered", icon: Brain },
      description: "Advanced AI providing instant, personalized health guidance",
      features: [
        { icon: Heart, title: "Instant Health Info", desc: "Get immediate answers to health questions" },
        { icon: Stethoscope, title: "Symptom Analysis", desc: "Advanced symptom checker with recommendations" },
        { icon: Phone, title: "Emergency Protocols", desc: "Quick access to emergency procedures" },
        { icon: Pill, title: "Medication Lookup", desc: "Comprehensive drug information database" }
      ],
      color: "blue"
    },
    {
      title: "Advanced Security",
      icon: Shield,
      badge: { text: "Enterprise Security", icon: Lock },
      description: "Military-grade security protecting your health data",
      features: [
        { icon: Key, title: "JWT Authentication", desc: "Secure token-based authentication system" },
        { icon: Lock, title: "Password Encryption", desc: "bcrypt hashing for maximum security" },
        { icon: RefreshCw, title: "Session Management", desc: "Automatic token refresh and cleanup" },
        { icon: Database, title: "Protected APIs", desc: "Middleware-based endpoint protection" }
      ],
      color: "green"
    },
    {
      title: "Personalized Care",
      icon: User,
      badge: { text: "Premium Experience", icon: Star },
      description: "Tailored healthcare experience just for you",
      features: [
        { icon: UserPlus, title: "Personal Accounts", desc: "Secure individual user profiles" },
        { icon: Activity, title: "Health Profiles", desc: "Customized health tracking and insights" },
        { icon: History, title: "Chat History", desc: "Access all your previous conversations" },
        { icon: MessageSquare, title: "Smart Responses", desc: "Context-aware AI conversations" }
      ],
      color: "purple"
    },
    {
      title: "Privacy & Compliance",
      icon: ShieldCheck,
      badge: { text: "HIPAA Compliant", icon: FileText },
      description: "Industry-leading privacy protection standards",
      features: [
        { icon: Lock, title: "End-to-End Encryption", desc: "Military-grade data protection" },
        { icon: FileText, title: "HIPAA Compliance", desc: "Strict healthcare privacy standards" },
        { icon: Shield, title: "Secure Policies", desc: "Advanced password validation" },
        { icon: Globe, title: "Global Standards", desc: "International privacy compliance" }
      ],
      color: "orange"
    }
  ];

  const stats = [
    { value: "<1s", label: "Response Time", icon: Zap, detail: "Average latency" },
    { value: "99.9%", label: "Uptime", icon: CheckCircle, detail: "Last 12 months" },
    { value: "10K+", label: "Active Users", icon: Users, detail: "Monthly active" },
    { value: "24/7", label: "Support", icon: HeartPulse, detail: "Always available" }
  ];

  const benefits = [
    { icon: Target, title: "Precision Healthcare", desc: "AI-driven accurate health insights" },
    { icon: TrendingUp, title: "Continuous Learning", desc: "Improves with every interaction" },
    { icon: Award, title: "Industry Leading", desc: "Trusted by healthcare professionals" },
    { icon: Layers, title: "Comprehensive Platform", desc: "All-in-one healthcare solution" }
  ];

  return (
    <>
      <SiteHeader />
      <main className="bg-gradient-to-b from-background via-background to-muted/20 text-foreground min-h-screen">
        
        {/* Hero Section - Completely New Design */}
        <section className="relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-6 py-24 md:py-32 relative">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge className="px-5 py-2.5 rounded-full bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors">
                  <span className="relative flex h-2 w-2 mr-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="font-semibold">Transforming Healthcare with AI</span>
                </Badge>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
                  <span className="block bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                    Enterprise-Grade
                  </span>
                  <span className="block mt-2">Healthcare Services</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                  Empower your healthcare journey with AI-powered solutions trusted by thousands. 
                  Available 24/7, HIPAA compliant, and built for the future.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105" asChild>
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-muted transition-all hover:scale-105" asChild>
                  <Link href="/chat">
                    Try Demo
                    <MessageSquare className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 pt-8">
                {[
                  { icon: Clock, text: "24/7 Available" },
                  { icon: Shield, text: "HIPAA Certified" },
                  { icon: Zap, text: "<1s Response" },
                  { icon: CheckCircle, text: "99.9% Uptime" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - New Card Design */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 rounded-full" variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Core Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare solutions powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, idx) => (
              <Card key={idx} className="group border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/50 backdrop-blur">
                <CardHeader className="space-y-4 pb-6">
                  <div className="flex items-start justify-between">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                      <service.icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <Badge variant="secondary" className="gap-1.5">
                      <service.badge.icon className="h-3.5 w-3.5" />
                      {service.badge.text}
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-2xl md:text-3xl mb-3">{service.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {service.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section - New Layout */}
        <section className="container mx-auto px-6 py-20">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-secondary/5">
            <CardContent className="p-12 md:p-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Performance That Matters
                </h2>
                <p className="text-xl text-muted-foreground">
                  Real-time metrics powering your healthcare experience
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <stat.icon className="h-10 w-10 text-primary-foreground" strokeWidth={2} />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold mb-1">{stat.value}</div>
                    <div className="font-semibold mb-1">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.detail}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Benefits Section - New Grid */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 rounded-full" variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for Healthcare Professionals
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section - Redesigned */}
        <section className="container mx-auto px-6 py-20">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary via-purple-600 to-secondary text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
            
            <CardContent className="relative py-20 md:py-24 text-center px-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm mb-8">
                <HeartPulse className="h-12 w-12" strokeWidth={1.5} />
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Ready to Transform Your Healthcare?
              </h2>

              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
                Join 10,000+ users who trust Med Genie for intelligent healthcare assistance.
                Start your free trial today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-6 rounded-full shadow-2xl hover:scale-105 transition-all font-semibold" asChild>
                  <Link href="/login">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-10 py-6 rounded-full hover:scale-105 transition-all font-semibold" asChild>
                  <Link href="/chat">
                    Schedule Demo
                    <MessageSquare className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-primary-foreground/20">
                {[
                  { icon: Shield, text: "HIPAA Certified" },
                  { icon: CheckCircle, text: "SOC 2 Compliant" },
                  { icon: Lock, text: "256-bit Encryption" },
                  { icon: Award, text: "ISO 27001" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}