
import React from 'react';
import { TrendingUp, MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TrendingSection = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Platform Coverage</h3>
        <p className="text-slate-400">Currently analyzing Reddit discussions with more sources coming soon</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Reddit - Active */}
        <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-400 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-orange-400" />
              <Badge variant="outline" className="text-green-400 border-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Live
              </Badge>
            </div>
            <h4 className="text-white font-semibold mb-2">Reddit</h4>
            <p className="text-slate-400 text-sm mb-3">NBA discussions, fantasy advice, injury reports</p>
            <div className="text-xs text-slate-500">
              <p>• r/nba community posts</p>
              <p>• r/fantasybball insights</p>
              <p>• Real-time sentiment analysis</p>
            </div>
          </CardContent>
        </Card>

        {/* Twitter - Coming Soon */}
        <Card className="bg-slate-800/50 border-slate-700 opacity-60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-slate-400 font-bold text-xs">X</span>
              </div>
              <Badge variant="outline" className="text-slate-500 border-slate-600">
                Coming Soon
              </Badge>
            </div>
            <h4 className="text-slate-300 font-semibold mb-2">Twitter/X</h4>
            <p className="text-slate-500 text-sm mb-3">Breaking news, insider reports, fan reactions</p>
            <div className="text-xs text-slate-600">
              <p>• Real-time updates</p>
              <p>• Verified accounts</p>
              <p>• Viral discussions</p>
            </div>
          </CardContent>
        </Card>

        {/* YouTube - Coming Soon */}
        <Card className="bg-slate-800/50 border-slate-700 opacity-60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-slate-400 font-bold text-xs">YT</span>
              </div>
              <Badge variant="outline" className="text-slate-500 border-slate-600">
                Coming Soon
              </Badge>
            </div>
            <h4 className="text-slate-300 font-semibold mb-2">YouTube</h4>
            <p className="text-slate-500 text-sm mb-3">Analysis videos, highlights, expert opinions</p>
            <div className="text-xs text-slate-600">
              <p>• Expert analysis</p>
              <p>• Highlight reels</p>
              <p>• Commentary channels</p>
            </div>
          </CardContent>
        </Card>

        {/* News - Coming Soon */}
        <Card className="bg-slate-800/50 border-slate-700 opacity-60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-slate-400 font-bold text-xs">📰</span>
              </div>
              <Badge variant="outline" className="text-slate-500 border-slate-600">
                Coming Soon
              </Badge>
            </div>
            <h4 className="text-slate-300 font-semibold mb-2">Sports News</h4>
            <p className="text-slate-500 text-sm mb-3">Official reports, injury updates, trades</p>
            <div className="text-xs text-slate-600">
              <p>• ESPN, Athletic</p>
              <p>• Team announcements</p>
              <p>• Beat reporters</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-slate-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>More data sources being integrated - stay tuned!</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
