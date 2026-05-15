'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Tree from 'react-d3-tree';

export default function AuditPage() {
  const { user } = useAuth();
  const [treeData, setTreeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch audit history when page loads
    const fetchAuditHistory = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(
          `/api/audit/history?userId=${user.id}`
        );
        const data = await response.json();

        if (data.success) {
          setTreeData(data.data);
        } else {
          setError('Failed to load health history');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditHistory();
  }, [user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading your health history...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Show empty state
  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">
          No health history yet. Start a conversation!
        </p>
      </div>
    );
  }

  // Show tree map
  return (
    <div className="w-full h-screen bg-white">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          My Health Audit Log
        </h1>
        <p className="text-gray-500 text-sm">
          Visual history of your AI health consultations
        </p>
      </div>
      <div style={{ width: '100%', height: '90vh' }}>
        <Tree
          data={treeData}
          orientation="vertical"
          pathFunc="step"
          translate={{ x: 400, y: 50 }}
          nodeSize={{ x: 200, y: 100 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
        />
      </div>
    </div>
  );
}
