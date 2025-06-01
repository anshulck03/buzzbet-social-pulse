
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, Users, Activity } from 'lucide-react';

interface QuickFilterChipsProps {
  onFilterSelect: (filter: string) => void;
}

const QuickFilterChips = ({ onFilterSelect }: QuickFilterChipsProps) => {
  const quickFilters = [
    { label: 'Trending', value: 'trending', icon: Flame, color: 'text-orange-400 border-orange-400/50 bg-orange-400/10 hover:bg-orange-400/20' },
    { label: 'All-Stars', value: 'elite', icon: Star, color: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10 hover:bg-yellow-400/20' },
    { label: 'NBA', value: 'NBA', icon: null, color: 'text-orange-400 border-orange-400/50 bg-orange-400/10 hover:bg-orange-400/20' },
    { label: 'NFL', value: 'NFL', icon: null, color: 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10 hover:bg-emerald-400/20' },
    { label: 'MLB', value: 'MLB', icon: null, color: 'text-blue-400 border-blue-400/50 bg-blue-400/10 hover:bg-blue-400/20' },
    { label: 'NHL', value: 'NHL', icon: null, color: 'text-purple-400 border-purple-400/50 bg-purple-400/10 hover:bg-purple-400/20' },
    { label: 'Quarterbacks', value: 'QB', icon: null, color: 'text-slate-300 border-slate-600/50 bg-slate-600/10 hover:bg-slate-600/20' },
    { label: 'Point Guards', value: 'PG', icon: null, color: 'text-slate-300 border-slate-600/50 bg-slate-600/10 hover:bg-slate-600/20' },
    { label: 'Injured', value: 'injured', icon: Activity, color: 'text-red-400 border-red-400/50 bg-red-400/10 hover:bg-red-400/20' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {quickFilters.map((filter) => (
        <Badge
          key={filter.value}
          variant="outline"
          className={`cursor-pointer transition-all ${filter.color}`}
          onClick={() => onFilterSelect(filter.value)}
        >
          {filter.icon && <filter.icon className="w-3 h-3 mr-1" />}
          {filter.label}
        </Badge>
      ))}
    </div>
  );
};

export default QuickFilterChips;
