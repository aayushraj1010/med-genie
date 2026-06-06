'use client';

import { useEffect, useState } from 'react';

interface Contributor {
    id: number;
    name: string;
    profileUrl: string;
    contributions: number;
    avatarUrl: string;
}

export function TopContributors() {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Initialize AbortController to handle component unmounts
        const controller = new AbortController();
        const { signal } = controller;

        const fetchContributors = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const res = await fetch('https://api.github.com/repos/aayushraj1010/med-genie/contributors', { signal });

                // 2. Check if the network response is ok (handles rate limits or API errors)
                if (!res.ok) {
                    throw new Error(`Failed to fetch contributors: ${res.statusText}`);
                }

                const data = await res.json();
                
                const sorted = data
                    .map((c: any, index: number) => ({
                        id: index + 1,
                        name: c.login,
                        profileUrl: c.html_url,
                        contributions: c.contributions,
                        avatarUrl: c.avatar_url,
                    }))
                    .sort((a: any, b: any) => b.contributions - a.contributions)
                    .slice(0, 7);

                setContributors(sorted);
            } catch (err: any) {
                // 3. Ignore errors caused by manual code abortion on unmount
                if (err.name !== 'AbortError') {
                    console.error('GitHub API Error:', err);
                    setError('Failed to load contributors. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchContributors();

        // 4. Cleanup function: Aborts the fetch request if the component unmounts
        return () => {
            controller.abort();
        };
    }, []);

    // 5. Display loading state
    if (isLoading) {
        return (
            <div className="mt-6 p-4 text-center text-gray-500 animate-pulse bg-white rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
                Loading contributors...
            </div>
        );
    }

    // 6. Display error fallback state
    if (error) {
        return (
            <div className="mt-6 p-4 text-center text-red-500 font-medium bg-white rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
                {error}
            </div>
        );
    }

    return (
        <div className="grid gap-4 mt-6">
            {contributors.map((contributor) => (
                <div
                    key={contributor.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 hover:border-blue-200 dark:bg-gray-900 dark:border-gray-700"
                >
                    <div className="flex items-center space-x-4">
                        <img
                            src={contributor.avatarUrl}
                            alt={contributor.name}
                            className="w-12 h-12 rounded-full shadow-lg"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {contributor.name}
                            </h3>
                            <p className="text-sm text-blue-800 font-medium dark:text-blue-300">
                                {contributor.contributions} Contributions
                            </p>
                        </div>
                    </div>
                    <a
                        href={contributor.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        View Profile
                    </a>
                </div>
            ))}
        </div>
    );
}
