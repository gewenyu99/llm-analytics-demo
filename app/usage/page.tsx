'use client';

import { useState, useEffect } from 'react';

interface UsageData {
  usage: number;
  estimatedCost: number;
}

export default function UsagePage() {
  const [usageData, setUsageData] = useState<UsageData>({
    usage: 0,
    estimatedCost: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        // TODO: Replace with actual user ID from your auth system
        const userId = 'current-user-id';
        const response = await fetch(`/api/usage?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch usage data');
        }
        
        const data = await response.json();
        setUsageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Usage</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {isLoading ? (
            <div className="text-center">Loading usage data...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                  <h3 className="font-semibold">Usage in current billing cycle</h3>
                  <p className="text-2xl">{usageData.usage.toLocaleString()} messages</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                  <h3 className="font-semibold">Estimated Cost</h3>
                  <p className="text-2xl">${usageData.estimatedCost.toFixed(6)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}