
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, Activity, X, Zap, Calendar } from 'lucide-react';

interface QuickFilterChipsProps {
  onFilterSelect: (filter: string) => void;
  activeFilters: string[];
  onFilterRemove: (filter: string) => void;
  onClearAll: () => void;
}

const QuickFilterChips = ({ onFilterSelect, activeFilters, onFilterRemove, onClearAll }: QuickFilterChipsProps) => {
  const quickFilters = [
    // Status filters only - removed position filters
    { label: 'Trending', value: 'trending', icon: Flame, color: 'text-orange-400 border-orange-400/50 bg-orange-400/10 hover:bg-orange-400/20' },
    { label: 'All-Stars', value: 'elite', icon: Star, color: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10 hover:bg-yellow-400/20' },
    { label: 'Breaking News', value: 'breaking', icon: Zap, color: 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10 hover:bg-cyan-400/20' },
    { label: 'Injured', value: 'injured', icon: Activity, color: 'text-red-400 border-red-400/50 bg-red-400/10 hover:bg-red-400/20' },
    { label: 'Rookies', value: 'rookies', icon: Calendar, color: 'text-green-400 border-green-400/50 bg-green-400/10 hover:bg-green-400/20' },
    
    // Sport filters
    { label: 'NBA', value: 'NBA', icon: null, color: 'text-orange-400 border-orange-400/50 bg-orange-400/10 hover:bg-orange-400/20' },
    { label: 'NFL', value: 'NFL', icon: null, color: 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10 hover:bg-emerald-400/20' },
    { label: 'MLB', value: 'MLB', icon: null, color: 'text-blue-400 border-blue-400/50 bg-blue-400/10 hover:bg-blue-400/20' },
    { label: 'NHL', value: 'NHL', icon: null, color: 'text-purple-400 border-purple-400/50 bg-purple-400/10 hover:bg-purple-400/20' }
  ];

  const isFilterActive = (filterValue: string) => activeFilters.includes(filterValue);

  const getActiveFilterStyle = (filter: any) => {
    if (isFilterActive(filter.value)) {
      // Active state - filled button with white text
      return filter.color.replace('text-', 'bg-').replace('/10', '/80').replace('border-', 'border-').replace('/50', '') + ' text-white';
    }
    return filter.color; // Inactive state
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => {
          const active = isFilterActive(filter.value);
          return (
            <Badge
              key={filter.value}
              variant="outline"
              className={`cursor-pointer transition-all flex items-center gap-1 ${getActiveFilterStyle(filter)}`}
              onClick={() => onFilterSelect(filter.value)}
            >
              {filter.icon && <filter.icon className="w-3 h-3" />}
              <span>{filter.label}</span>
              {active && (
                <X 
                  className="w-3 h-3 ml-1 hover:bg-white/20 rounded" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterRemove(filter.value);
                  }}
                />
              )}
            </Badge>
          );
        })}
      </div>
      
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="mt-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default QuickFilterChips;
