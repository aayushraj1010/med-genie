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

    useEffect(() => {
        fetch('https://api.github.com/repos/aayushraj1010/med-genie/contributors')
            .then(res => res.json())
            .then((data: any[]) => {
                const sorted = data
                    .map((c, index) => ({
                        id: index + 1,
                        name: c.login,
                        profileUrl: c.html_url,
                        contributions: c.contributions,
                        avatarUrl: c.avatar_url,
                    }))
                    .sort((a, b) => b.contributions - a.contributions)
                    .slice(0, 7);
                setContributors(sorted);
            })
            .catch(err => console.error('GitHub API Error:', err));
    }, []);

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
