import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Spinner } from 'flowbite-react';

// Define the expected data structure from the API
interface DreamData {
  dream_count: number;
  sentiment: {
    avg_positive: number;
    avg_neutral: number;
    avg_negative: number;
  };
  entities: {
    count: number;
    top_entities: Record<string, number>;
  };
  key_phrases: {
    count: number;
    sample: string[];
  };
}

interface DreamSummaryResponse {
  [date: string]: DreamData;
}

interface ChartDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  dream_count: number;
  month: string;
  isGap?: boolean; // Flag to identify gap months
}

const DreamSentimentChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDreamData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dreamtrackerfunctions.azurewebsites.net/api/summary');
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const responseData: DreamSummaryResponse = await response.json();
        
        // First transform data with date information
        const rawData: ChartDataPoint[] = Object.entries(responseData)
          .map(([date, dreamData]) => {
            const dreamDate = new Date(date);
            return {
              date: formatDate(date),
              positive: dreamData.sentiment.avg_positive,
              neutral: dreamData.sentiment.avg_neutral,
              negative: dreamData.sentiment.avg_negative,
              dream_count: dreamData.dream_count,
              // Create month identifier for grouping (YYYY-MM)
              month: `${dreamDate.getFullYear()}-${String(dreamDate.getMonth() + 1).padStart(2, '0')}`
            };
          });
        
        // Group data by month
        const monthlyData = groupByMonth(rawData);
        
        // Fill in missing months in the timeline
        const completeTimelineData = fillMissingMonths(monthlyData);
        
        setData(completeTimelineData);
      } catch (err) {
        console.error('Error fetching dream data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDreamData();
  }, []);

  // Fill in missing months in the timeline with null data points
  const fillMissingMonths = (monthlyData: ChartDataPoint[]): ChartDataPoint[] => {
    if (monthlyData.length === 0) return [];
    
    // Sort data chronologically first
    monthlyData.sort((a, b) => new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime());
    
    const result: ChartDataPoint[] = [];
    const firstMonth = monthlyData[0].month;
    const lastMonth = monthlyData[monthlyData.length - 1].month;
    
    // Extract the start and end dates
    const [startYear, startMonth] = firstMonth.split('-').map(Number);
    const [endYear, endMonth] = lastMonth.split('-').map(Number);
    
    // Create a map of existing data points for quick lookup
    const monthDataMap = new Map<string, ChartDataPoint>();
    monthlyData.forEach(item => monthDataMap.set(item.month, item));
    
    // Iterate through all months in the range
    let currentDate = new Date(startYear, startMonth - 1, 1); // Month is 0-indexed in JS Date
    const endDate = new Date(endYear, endMonth - 1, 1);
    
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Convert back to 1-indexed
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      
      const monthName = currentDate.toLocaleString('en-US', { month: 'short' });
      const displayMonth = `${monthName} ${year}`;
      
      if (monthDataMap.has(monthKey)) {
        // Add the existing data point
        result.push(monthDataMap.get(monthKey)!);
      } else {
        // Create a gap data point
        result.push({
          month: monthKey,
          date: displayMonth,
          positive: 0,
          neutral: 0,
          negative: 0,
          dream_count: 0,
          isGap: true
        });
      }
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return result;
  };

  // Group data by month and calculate averages
  const groupByMonth = (data: ChartDataPoint[]): ChartDataPoint[] => {
    const monthGroups: Record<string, ChartDataPoint[]> = {};
    
    // Group dreams by month
    data.forEach(dream => {
      if (!monthGroups[dream.month]) {
        monthGroups[dream.month] = [];
      }
      monthGroups[dream.month].push(dream);
    });
    
    // Calculate monthly averages
    return Object.entries(monthGroups).map(([month, dreams]) => {
      // Calculate the weighted average based on dream_count for more accurate results
      let totalDreams = 0;
      let totalPositive = 0;
      let totalNeutral = 0;
      let totalNegative = 0;
      
      dreams.forEach(dream => {
        totalDreams += dream.dream_count;
        totalPositive += dream.positive * dream.dream_count;
        totalNeutral += dream.neutral * dream.dream_count;
        totalNegative += dream.negative * dream.dream_count;
      });
      
      // Format the month for display (e.g., "Jan 2021")
      const [year, monthNum] = month.split('-');
      const monthName = new Date(`${year}-${monthNum}-01`).toLocaleString('en-US', { month: 'short' });
      const displayMonth = `${monthName} ${year}`;
      
      return {
        month,
        date: displayMonth,
        positive: totalDreams > 0 ? totalPositive / totalDreams : 0,
        neutral: totalDreams > 0 ? totalNeutral / totalDreams : 0,
        negative: totalDreams > 0 ? totalNegative / totalDreams : 0,
        dream_count: totalDreams
      };
    });
  };

  // Helper function to format the date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="xl" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading dream data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
        <p>Error loading dream data: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Dream Sentiment Analysis by Month
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }} 
            />
            <YAxis 
              tickFormatter={(value) => `${Math.round(value * 100)}%`} 
              domain={[0, 1]}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                // Don't show tooltips for gap months
                if (props.payload.isGap) return ['-', name];
                return [`${Math.round(Number(value) * 100)}%`, name];
              }}
              labelFormatter={(label) => `Month: ${label}`}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  
                  // Don't show detailed tooltip for gap months
                  if (data.isGap) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
                        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">No dreams recorded this month</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
                      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Dreams recorded: {data.dream_count}</p>
                      <div className="mt-2">
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {Math.round(Number(entry.value) * 100)}%
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="positive" 
              stackId="1" 
              stroke="#4ade80" 
              fill="#4ade80" 
              name="Positive" 
              connectNulls={false}
            />
            <Area 
              type="monotone" 
              dataKey="neutral" 
              stackId="1" 
              stroke="#93c5fd" 
              fill="#93c5fd" 
              name="Neutral" 
              connectNulls={false}
            />
            <Area 
              type="monotone" 
              dataKey="negative" 
              stackId="1" 
              stroke="#f87171" 
              fill="#f87171" 
              name="Negative" 
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>This chart shows the monthly average sentiment analysis of dreams, with gaps representing months where no dreams were recorded. The values represent weighted averages based on the number of dreams recorded each day.</p>
      </div>
    </div>
  );
};

export default DreamSentimentChart; 