// app/about/page.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, MessageSquare, Hospital, ShieldCheck, Globe2 } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader>
                    <div className="flex items-center mb-2">
                        <HeartPulse className="h-8 w-8 text-primary mr-2" />
                        <CardTitle className="text-3xl font-extrabold tracking-tight">About Med Genie</CardTitle>
                    </div>
                    <CardDescription>
                        <Badge variant="outline" className="mr-2">Open Source</Badge>
                        <Badge variant="secondary" className="mr-2">GSSoC'25 Project</Badge>
                        <Badge variant="default">AI Health Assistant</Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-lg leading-relaxed">
                    <p>
                        <span className="font-semibold">Med Genie</span> is a smart AI-powered medical chatbot that helps you get clear, friendly answers to health-related questions and guides you during emergencies—all through a modern, private web experience.
                    </p>
                    <div>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <MessageSquare className="h-5 w-5 text-primary mr-2" />
                                Conversational AI for basic health questions
                            </li>
                            <li className="flex items-center">
                                <Hospital className="h-5 w-5 text-primary mr-2" />
                                Hospital &amp; emergency contact guidance
                            </li>
                            <li className="flex items-center">
                                <HeartPulse className="h-5 w-5 text-primary mr-2" />
                                Symptom-based health suggestions
                            </li>
                            <li className="flex items-center">
                                <Globe2 className="h-5 w-5 text-primary mr-2" />
                                Fully responsive, accessible UI
                            </li>
                            <li className="flex items-center">
                                <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                                Privacy-focused: No user data is stored
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl mb-1">Our Mission</h2>
                        <p>
                            We believe everyone should have easy and safe access to reliable healthcare information. Med Genie aims to
                            empower you with knowledge while reminding you that nothing can replace professional medical advice from a doctor.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl mb-1">Tech Stack</h2>
                        <div className="flex flex-wrap gap-2 text-base">
                            <Badge variant="secondary">Next.js</Badge>
                            <Badge variant="secondary">TypeScript</Badge>
                            <Badge variant="secondary">OpenAI API</Badge>
                            <Badge variant="secondary">Tailwind CSS</Badge>
                            <Badge variant="secondary">Vercel</Badge>
                        </div>
                    </div>
                </CardContent>
                <p className="text-xs text-center text-muted-foreground pb-4">
                    <span className="font-semibold">Disclaimer:</span> Med Genie is for informational purposes only and does not provide medical advice, diagnosis, or treatment.
                </p>
            </Card>
        </div>
    );
}
