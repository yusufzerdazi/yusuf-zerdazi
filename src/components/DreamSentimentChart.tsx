import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  ReferenceLine
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
  tags: {
    count: number;
    top_tags: Record<string, number>;
  }
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
  quarter: string; // Add quarter property
  isGap?: boolean; // Flag to identify gap months/quarters
}

interface TagDataPoint {
  date: string;
  month: string;
  tag: string;
  count: number;
}

const DreamSentimentChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<ChartDataPoint[]>([]);
  const [tagData, setTagData] = useState<TagDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Update the lockdown dates array to only include the first lockdown
  const lockdownDates = [
    {
      date: "Mar 2020",
      label: "UK Lockdown"
    }
  ];

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
          .filter(([date]) => date !== '_metadata')
          .map(([date, dreamData]) => {
            const dreamDate = new Date(date);
            const quarterNum = Math.floor(dreamDate.getMonth() / 3) + 1;
            
            return {
              date: formatDate(date),
              positive: dreamData.sentiment.avg_positive,
              neutral: dreamData.sentiment.avg_neutral,
              negative: dreamData.sentiment.avg_negative,
              dream_count: dreamData.dream_count,
              // Create month identifier for grouping (YYYY-MM)
              month: `${dreamDate.getFullYear()}-${String(dreamDate.getMonth() + 1).padStart(2, '0')}`,
              // Create quarter identifier (YYYY-Q1, YYYY-Q2, etc.)
              quarter: `${dreamDate.getFullYear()}-Q${quarterNum}`
            };
          });
        
        // Process tag data
        const tagsData = extractTagData(responseData);
        
        // Group data by month
        const monthlyData = groupByMonth(rawData);
        
        // Group data by quarter
        const quarterData = groupByQuarter(rawData);
        
        // Fill in missing months/quarters in the timeline
        const completeMonthlyData = fillMissingMonths(monthlyData);
        const completeQuarterlyData = fillMissingQuarters(quarterData);
        
        setData(completeMonthlyData);
        setQuarterlyData(completeQuarterlyData);
        setTagData(tagsData);
      } catch (err) {
        console.error('Error fetching dream data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDreamData();
  }, []);

  // Extract tag data from the API response
  const extractTagData = (responseData: DreamSummaryResponse): TagDataPoint[] => {
    const tagCounts: Record<string, Record<string, number>> = {}; // month -> tag -> count
    
    Object.entries(responseData)
      .filter(([date]) => date !== '_metadata')
      .forEach(([date, dreamData]) => {
        const dreamDate = new Date(date);
        // Add quarter information
        const quarterNum = Math.floor(dreamDate.getMonth() / 3) + 1;
        const quarter = `${dreamDate.getFullYear()}-Q${quarterNum}`;
        
        // Initialize quarter data structure if not exists
        if (!tagCounts[quarter]) {
          tagCounts[quarter] = {};
        }
        
        // Check if we have explicit tags
        if (dreamData.tags && Object.keys(dreamData.tags.top_tags).length > 0) {
          Object.entries(dreamData.tags.top_tags).forEach(([tag, count]) => {
            tagCounts[quarter][tag] = (tagCounts[quarter][tag] || 0) + count;
          });
        } 
        // Otherwise extract from entities (if available)
        else if (dreamData.entities && Object.keys(dreamData.entities.top_entities).length > 0) {
          Object.entries(dreamData.entities.top_entities).forEach(([entity, count]) => {
            tagCounts[quarter][entity] = (tagCounts[quarter][entity] || 0) + count;
          });
        } 
        // If no tags or entities, count as "Dream"
        else {
          tagCounts[quarter]["Dream"] = (tagCounts[quarter]["Dream"] || 0) + dreamData.dream_count;
        }
      });
    
    // Convert to array format for the chart
    const result: TagDataPoint[] = [];
    
    Object.entries(tagCounts).forEach(([quarter, tags]) => {
      Object.entries(tags).forEach(([tag, count]) => {
        result.push({
          month: '', // Not used for quarterly data
          date: quarter, // Use quarter as the date
          tag,
          count
        });
      });
    });
    
    return result;
  };

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
    const currentDate = new Date(startYear, startMonth - 1, 1); // Month is 0-indexed in JS Date
    const endDate = new Date(endYear, endMonth - 1, 1);
    
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Convert back to 1-indexed
      const quarterNum = Math.floor((month - 1) / 3) + 1;
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
          quarter: `${year}-Q${quarterNum}`,
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

  // Fill in missing quarters in the timeline
  const fillMissingQuarters = (quarterlyData: ChartDataPoint[]): ChartDataPoint[] => {
    if (quarterlyData.length === 0) return [];
    
    // Sort data chronologically first
    quarterlyData.sort((a, b) => {
      const [aYear, aQuarter] = a.quarter.split('-Q');
      const [bYear, bQuarter] = b.quarter.split('-Q');
      
      if (aYear !== bYear) return Number(aYear) - Number(bYear);
      return Number(aQuarter) - Number(bQuarter);
    });
    
    const result: ChartDataPoint[] = [];
    const firstQuarter = quarterlyData[0].quarter;
    const lastQuarter = quarterlyData[quarterlyData.length - 1].quarter;
    
    // Extract the start and end dates
    const [startYear, startQuarterFull] = firstQuarter.split('-');
    const startQuarter = Number(startQuarterFull.substring(1));
    
    const [endYear, endQuarterFull] = lastQuarter.split('-');
    const endQuarter = Number(endQuarterFull.substring(1));
    
    // Create a map of existing data points for quick lookup
    const quarterDataMap = new Map<string, ChartDataPoint>();
    quarterlyData.forEach(item => quarterDataMap.set(item.quarter, item));
    
    // Iterate through all quarters in the range
    let currentYear = Number(startYear);
    let currentQuarter = startQuarter;
    
    while (
      currentYear < Number(endYear) || 
      (currentYear === Number(endYear) && currentQuarter <= endQuarter)
    ) {
      const quarterKey = `${currentYear}-Q${currentQuarter}`;
      
      if (quarterDataMap.has(quarterKey)) {
        // Add the existing data point
        result.push(quarterDataMap.get(quarterKey)!);
      } else {
        // Create a gap data point
        result.push({
          month: '', // Not applicable for quarterly data
          quarter: quarterKey,
          date: quarterKey, // Display the quarter directly
          positive: 0,
          neutral: 0,
          negative: 0,
          dream_count: 0,
          isGap: true
        });
      }
      
      // Move to next quarter
      currentQuarter++;
      if (currentQuarter > 4) {
        currentQuarter = 1;
        currentYear++;
      }
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
      
      // Get the quarter from any one of the dreams
      const quarter = dreams[0].quarter;
      
      return {
        month,
        quarter,
        date: displayMonth,
        positive: totalDreams > 0 ? totalPositive / totalDreams : 0,
        neutral: totalDreams > 0 ? totalNeutral / totalDreams : 0,
        negative: totalDreams > 0 ? totalNegative / totalDreams : 0,
        dream_count: totalDreams
      };
    });
  };

  // Group data by quarter and calculate averages
  const groupByQuarter = (data: ChartDataPoint[]): ChartDataPoint[] => {
    const quarterGroups: Record<string, ChartDataPoint[]> = {};
    
    // Group dreams by quarter
    data.forEach(dream => {
      if (!quarterGroups[dream.quarter]) {
        quarterGroups[dream.quarter] = [];
      }
      quarterGroups[dream.quarter].push(dream);
    });
    
    // Calculate quarterly averages
    return Object.entries(quarterGroups).map(([quarter, dreams]) => {
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
      
      return {
        month: '', // Not applicable for quarterly data
        quarter,
        date: quarter, // Use the quarter directly as the display date
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

  // Get top tags for the tag chart
  const getTopTags = () => {
    const tagCounts: Record<string, number> = {};
    
    tagData.forEach(item => {
      if (!tagCounts[item.tag]) {
        tagCounts[item.tag] = 0;
      }
      tagCounts[item.tag] += item.count;
    });
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  };
  
  const topTags = getTopTags();
  
  // Prepare data for the tag chart - modified for quarterly data with percentages
  const prepareTagChartData = () => {
    const tagsByQuarter: Record<string, Record<string, number>> = {};
    const quarters = new Set<string>();
    
    // Collect all quarters from the data
    tagData.forEach(item => {
      quarters.add(item.date);
    });
    
    // Sort quarters chronologically
    const sortedQuarters = Array.from(quarters).sort((a, b) => {
      const [aYear, aQ] = a.split('-Q');
      const [bYear, bQ] = b.split('-Q');
      if (aYear !== bYear) return Number(aYear) - Number(bYear);
      return Number(aQ) - Number(bQ);
    });
    
    // Initialize all quarters with zero counts for all top tags
    sortedQuarters.forEach(quarter => {
      tagsByQuarter[quarter] = {};
      topTags.forEach(tag => {
        tagsByQuarter[quarter][tag] = 0;
      });
    });
    
    // Fill in actual tag counts
    tagData.forEach(item => {
      if (topTags.includes(item.tag) && tagsByQuarter[item.date]) {
        tagsByQuarter[item.date][item.tag] = item.count;
      }
    });
    
    // Convert to array format for the chart and calculate percentages
    return sortedQuarters.map(quarter => {
      const quarterData = tagsByQuarter[quarter];
      const totalTagsInQuarter = Object.values(quarterData).reduce((sum, count) => sum + count, 0);
      
      // Convert raw counts to percentages
      const percentageData: Record<string, number> = {};
      
      // If there are no tags in this quarter, distribute evenly
      if (totalTagsInQuarter === 0) {
        topTags.forEach(tag => {
          percentageData[tag] = 100 / topTags.length; // Equal distribution
        });
      } else {
        // Calculate percentage for each tag
        topTags.forEach(tag => {
          percentageData[tag] = (quarterData[tag] / totalTagsInQuarter) * 100;
        });
      }
      
      return {
        date: quarter,
        ...percentageData,
        _totalCount: totalTagsInQuarter // Keep the total count for tooltips
      };
    });
  };
  
  const tagChartData = prepareTagChartData();

  return (
    <div className="space-y-8">
      {/* Sentiment Analysis Chart by Quarter */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Dream Sentiment
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={quarterlyData}
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
                  // Don't show tooltips for gap quarters
                  if (props.payload.isGap) return ['-', name];
                  return [`${Math.round(Number(value) * 100)}%`, name];
                }}
                labelFormatter={(label) => `Quarter: ${label}`}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    
                    // Don't show detailed tooltip for gap quarters
                    if (data.isGap) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
                          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">No dreams recorded this quarter</p>
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
      </div>
      
      {/* Dream Count Chart */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Dream Count
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 30, right: 30, left: 10, bottom: 30 }}
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
                allowDecimals={false}
                label={{ value: 'Dream Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip
                formatter={(value) => [`${value} dreams`, 'Count']}
                labelFormatter={(label) => `Month: ${label}`}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const lockdown = lockdownDates.find(ld => ld.date === label);
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
                        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                        {lockdown && (
                          <p className="text-sm text-red-500 font-medium">
                            {lockdown.label}
                          </p>
                        )}
                        {data.isGap || data.dream_count === 0 ? (
                          <p className="text-gray-600 dark:text-gray-400">
                            No dreams recorded
                          </p>
                        ) : (
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                            {data.dream_count} dreams recorded
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Updated ReferenceLine */}
              {lockdownDates.map((lockdown, index) => (
                <ReferenceLine
                  key={index}
                  x={lockdown.date}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{
                    value: lockdown.label,
                    position: 'insideTopRight',
                    fill: '#ef4444',
                    fontSize: 12,
                    dy: -20,
                    dx: 10,
                  }}
                />
              ))}
              <Line 
                type="monotone"
                dataKey="dream_count" 
                stroke="#8884d8" 
                name="Dreams Recorded" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Tag Counts Chart - Remove Interactivity */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Tags
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={tagChartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
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
                tickFormatter={(value) => `${Math.round(value)}%`}
                domain={[0, 100]} 
              />
              <Tooltip
                formatter={(value, name, props) => {
                  // Show both percentage and absolute count
                  const totalCount = props.payload._totalCount || 0;
                  const absoluteCount = Math.round((Number(value) * totalCount) / 100);
                  return [
                    `${Math.round(Number(value))}% (${absoluteCount} occurrences)`, 
                    name
                  ];
                }}
                labelFormatter={(label) => `Quarter: ${label}`}
              />
              <Legend />
              {topTags.map((tag, index) => {
                // Generate a color based on the index
                const hue = (index * 137) % 360; // Use golden angle approximation for better distribution
                const color = `hsl(${hue}, 70%, 60%)`;
                
                return (
                  <Area 
                    key={tag}
                    type="monotone"
                    dataKey={tag} 
                    name={tag} 
                    fill={color}
                    stroke={color}
                    stackId="1"
                    fillOpacity={0.8}
                    strokeWidth={1}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DreamSentimentChart; 