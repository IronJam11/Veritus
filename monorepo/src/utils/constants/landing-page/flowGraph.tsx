import { Zap,  BarChart3, TrendingUp } from 'lucide-react';
export const FlowGraph = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <div className="flex items-center justify-center space-x-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm text-gray-300">Input</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm text-gray-300">Process</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm text-gray-300">Output</span>
        </div>
      </div>
    </div>
  );
};