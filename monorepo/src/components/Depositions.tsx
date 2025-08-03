import React, { useState, useEffect, JSX } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { useAccount } from 'wagmi';

// TypeScript interfaces
interface Deposition {
  amount: string;
  timestamp: string;
}

interface ChartDataPoint {
  id: number;
  date: string;
  fullDate: Date;
  amount: number;
  rawAmount: string;
}

interface DepositionsComponentProps {
  depositions: Deposition[];
}

export default function DepositionsComponent({ depositions }: any): JSX.Element {
  const { themeClasses: theme } = useTheme();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totalDeposition, setTotalDeposition] = useState<number>(0);
  const [depositionCount, setDepositionCount] = useState<number>(0);

  // Format timestamp to readable date
  const formatDate = (timestamp: string): string => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Convert Wei to ETH (assuming 18 decimals)
  const formatAmount = (amount: string): number => {
    return parseFloat(amount) / Math.pow(10, 18);
  };

  // Process depositions data
  useEffect(() => {
    const processDepositions = (): void => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const processedData: ChartDataPoint[] = depositions.map((dep: { timestamp: string; amount: string; }, index: any) => ({
          id: index,
          date: formatDate(dep.timestamp),
          fullDate: new Date(parseInt(dep.timestamp) * 1000),
          amount: formatAmount(dep.amount),
          rawAmount: dep.amount
        }));

        // Sort by date
        processedData.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
        
        setChartData(processedData);
        
        // Calculate totals
        const total = processedData.reduce((sum, dep) => sum + dep.amount, 0);
        setTotalDeposition(total);
        setDepositionCount(depositions.length);
      } catch (err) {
        console.error('Error processing depositions:', err);
      } finally {
        setLoading(false);
      }
    };

    processDepositions();
  }, [address, depositions]);

  // Custom tooltip component
  const CustomTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 rounded-lg border shadow-lg"
          style={{
            backgroundColor: theme.paper,
            borderColor: theme.border,
            color: theme.textPrimary
          }}
        >
          <p className="font-medium mb-1">{label}</p>
          <p style={{ color: theme.primary }}>
            Amount: {payload[0].value.toFixed(4)} ETH
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-2 mx-auto mb-4"
            style={{ 
              borderColor: theme.border,
              borderTopColor: theme.primary 
            }}
          ></div>
          <p style={{ color: theme.textSecondary }}>Loading depositions...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: theme.textPrimary }}>
            Connect Your Wallet
          </h2>
          <p style={{ color: theme.textSecondary }}>
            Please connect your wallet to view your depositions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.textPrimary }}>
            Your Depositions
          </h1>
          <p style={{ color: theme.textSecondary }}>
            Track your asset platform deposits over time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            className="p-6 rounded-lg border backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.paper,
              borderColor: theme.border 
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: theme.textPrimary }}>
              Total Deposited
            </h3>
            <p className="text-3xl font-bold" style={{ color: theme.primary }}>
              {totalDeposition.toFixed(4)} ETH
            </p>
          </div>
          
          <div 
            className="p-6 rounded-lg border backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.paper,
              borderColor: theme.border 
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: theme.textPrimary }}>
              Number of Deposits
            </h3>
            <p className="text-3xl font-bold" style={{ color: theme.primary }}>
              {depositionCount}
            </p>
          </div>
          
          <div 
            className="p-6 rounded-lg border backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.paper,
              borderColor: theme.border 
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: theme.textPrimary }}>
              Average Deposit
            </h3>
            <p className="text-3xl font-bold" style={{ color: theme.primary }}>
              {depositionCount > 0 ? (totalDeposition / depositionCount).toFixed(4) : '0.0000'} ETH
            </p>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div 
            className="p-6 rounded-lg border backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.paper,
              borderColor: theme.border 
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: theme.textPrimary }}>
              Deposition History
            </h2>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={theme.border}
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="date"
                    stroke={theme.textSecondary}
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke={theme.textSecondary}
                    fontSize={12}
                    label={{ 
                      value: 'Amount (ETH)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: theme.textSecondary }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill={theme.primary}
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div 
            className="p-12 rounded-lg border backdrop-blur-sm text-center"
            style={{ 
              backgroundColor: theme.paper,
              borderColor: theme.border 
            }}
          >
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.textPrimary }}>
              No Depositions Found
            </h3>
            <p style={{ color: theme.textSecondary }}>
              You haven't made any deposits yet. Start by making your first deposit to see your data here.
            </p>
          </div>
        )}

        {/* Transaction History Table */}
        {chartData.length > 0 && (
          <div 
            className="mt-8 p-6 rounded-lg border backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.paper,
              borderColor: theme.border 
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: theme.textPrimary }}>
              Transaction History
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottomColor: theme.border }} className="border-b">
                    <th className="text-left p-3" style={{ color: theme.textPrimary }}>Date</th>
                    <th className="text-right p-3" style={{ color: theme.textPrimary }}>Amount (ETH)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((dep, index) => (
                    <tr 
                      key={dep.id} 
                      className="border-b hover:bg-opacity-50 transition-colors"
                      style={{ 
                        borderBottomColor: theme.border
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td className="p-3" style={{ color: theme.textSecondary }}>
                        {dep.date}
                      </td>
                      <td className="text-right p-3 font-mono" style={{ color: theme.primary }}>
                        {dep.amount.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}