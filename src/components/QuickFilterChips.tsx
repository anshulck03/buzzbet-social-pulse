
import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, X, ChevronDown } from 'lucide-react';
import PlayerDropdown from './PlayerDropdown';

interface QuickFilterChipsProps {
  onFilterSelect: (filter: string) => void;
  activeFilters: string[];
  onFilterRemove: (filter: string) => void;
  onClearAll: () => void;
  onPlayerSelect?: (playerName: string) => void;
}

const QuickFilterChips = ({ 
  onFilterSelect, 
  activeFilters, 
  onFilterRemove, 
  onClearAll,
  onPlayerSelect 
}: QuickFilterChipsProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const quickFilters = [
    // Status filters
    { 
      label: '🔥 Trending', 
      value: 'trending', 
      icon: Flame, 
      color: 'text-orange-400 border-orange-400/50 bg-orange-400/10 hover:bg-orange-400/20',
      hasDropdown: true
    },
    { 
      label: '⭐ All-Stars', 
      value: 'elite', 
      icon: Star, 
      color: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10 hover:bg-yellow-400/20',
      hasDropdown: true
    },
    
    // Sport filters
    { 
      label: 'NBA', 
      value: 'NBA', 
      icon: null, 
      color: 'text-orange-400 border-orange-400/50 bg-orange-400/10 hover:bg-orange-400/20',
      hasDropdown: true
    },
    { 
      label: 'NFL', 
      value: 'NFL', 
      icon: null, 
      color: 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10 hover:bg-emerald-400/20',
      hasDropdown: true
    },
    { 
      label: 'MLB', 
      value: 'MLB', 
      icon: null, 
      color: 'text-blue-400 border-blue-400/50 bg-blue-400/10 hover:bg-blue-400/20',
      hasDropdown: true
    },
    { 
      label: 'NHL', 
      value: 'NHL', 
      icon: null, 
      color: 'text-purple-400 border-purple-400/50 bg-purple-400/10 hover:bg-purple-400/20',
      hasDropdown: true
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(ref => 
        !ref?.contains(event.target as Node)
      );
      
      if (clickedOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFilterActive = (filterValue: string) => activeFilters.includes(filterValue);

  const getActiveFilterStyle = (filter: any) => {
    if (isFilterActive(filter.value)) {
      return filter.color.replace('text-', 'bg-').replace('/10', '/80').replace('border-', 'border-').replace('/50', '') + ' text-white';
    }
    return filter.color;
  };

  const handleFilterClick = (filter: any, event: React.MouseEvent) => {
    if (filter.hasDropdown && !isFilterActive(filter.value)) {
      event.stopPropagation();
      setOpenDropdown(openDropdown === filter.value ? null : filter.value);
    } else {
      setOpenDropdown(null);
      onFilterSelect(filter.value);
    }
  };

  const handlePlayerSelect = (playerName: string) => {
    setOpenDropdown(null);
    if (onPlayerSelect) {
      onPlayerSelect(playerName);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => {
          const active = isFilterActive(filter.value);
          return (
            <div 
              key={filter.value} 
              className="relative"
              ref={el => dropdownRefs.current[filter.value] = el}
            >
              <Badge
                variant="outline"
                className={`cursor-pointer transition-all flex items-center gap-1 ${getActiveFilterStyle(filter)} ${
                  filter.hasDropdown ? 'pr-1' : ''
                }`}
                onClick={(e) => handleFilterClick(filter, e)}
              >
                {filter.icon && <filter.icon className="w-3 h-3" />}
                <span>{filter.label}</span>
                {active && (
                  <X 
                    className="w-3 h-3 ml-1 hover:bg-white/20 rounded" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterRemove(filter.value);
                      setOpenDropdown(null);
                    }}
                  />
                )}
                {filter.hasDropdown && !active && (
                  <ChevronDown className="w-3 h-3 ml-1" />
                )}
              </Badge>
              
              {filter.hasDropdown && (
                <PlayerDropdown
                  filterType={filter.value}
                  onPlayerSelect={handlePlayerSelect}
                  isOpen={openDropdown === filter.value}
                  onClose={() => setOpenDropdown(null)}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {activeFilters.length > 1 && (
        <button
          onClick={() => {
            onClearAll();
            setOpenDropdown(null);
          }}
          className="mt-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default QuickFilterChips;
