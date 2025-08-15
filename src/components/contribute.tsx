// components/contribute.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, GitBranch } from 'lucide-react';
import { TopContributors } from './topcontributors';

const demoContributors = [
    { name: 'Aayush Raj', github: 'aayushraj1010' },
    { name: 'Omkadu', github: 'omkadu8767' },
    { name: 'Sara Kim', github: 'sararkim' },
    { name: 'John Doe', github: 'johndoe' },  // add latest
];

export function Contribute() {
    return (
        <div className="min-h-screen bg-background text-foreground flex justify-center p-6">
            <Card className="max-w-3xl w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold flex items-center gap-2">
                        <GitBranch className="h-8 w-8 text-primary" />
                        Contribute to Med Genie
                    </CardTitle>
                    <CardDescription>
                        Join our open-source community and help improve Med Genie! Here’s how to get started and who’s already contributing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-lg leading-relaxed">
                    <section>
                        <h2 className="font-semibold text-xl mb-3 flex items-center gap-2">
                            <Code className="h-5 w-5 text-primary" />
                            How to Contribute
                        </h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Fork the <a href="https://github.com/aayushraj1010/med-genie" target="_blank" rel="noreferrer" className="text-primary underline dark:text-blue-600">Med Genie repo</a>.</li>
                            <li>Clone your fork locally: <code>git clone https://github.com/your-username/med-genie.git</code></li>
                            <li>Create a new branch for your feature: <code>git checkout -b feature-name</code></li>
                            <li>Make improvements and commit with meaningful messages.</li>
                            <li>Push your branch and open a Pull Request to the main repo.</li>
                            <li>Discuss, review, and refine until your contribution is merged.</li>
                        </ol>
                    </section>

                    {/* <section>
                        <h2 className="font-semibold text-xl mb-3 flex items-center gap-2">
                            <User2 className="h-5 w-5 text-primary" />
                            Contributors
                        </h2>
                        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {demoContributors.map((contributor) => (
                                <li key={contributor.github} className="bg-muted p-3 rounded-lg text-center hover:bg-primary/10 transition">
                                    <a
                                        href={`https://github.com/${contributor.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-primary hover:underline block text-blue-600"
                                    >
                                        {contributor.name}
                                    </a>
                                    <span className="text-xs text-muted-foreground">@{contributor.github}</span>
                                </li>
                            ))}
                        </ul>
                    </section> */}
                    <TopContributors />
                </CardContent>
            </Card>
        </div>
    );
}
