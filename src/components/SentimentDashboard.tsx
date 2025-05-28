
import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const SentimentDashboard = ({ player }) => {
  // Mock sentiment data
  const sentimentData = {
    overall: 7.2,
    trend: 'up',
    volume: 1247,
    volumeChange: 23,
    sources: {
      reddit: { score: 6.8, volume: 342, trend: 'down' },
      twitter: { score: 7.5, volume: 621, trend: 'up' },
      youtube: { score: 7.1, volume: 89, trend: 'neutral' },
      news: { score: 7.8, volume: 195, trend: 'up' }
    },
    alerts: [
      { type: 'injury', message: 'Ankle concern mentioned 12 times in last hour', severity: 'medium' },
      { type: 'contrarian', message: 'Sentiment 15% higher than betting odds suggest', severity: 'high' }
    ],
    timeline: [
      { time: '2h ago', score: 6.9, event: 'Practice report' },
      { time: '4h ago', score: 7.1, event: 'Interview posted' },
      { time: '6h ago', score: 7.3, event: 'Game highlights' },
      { time: '8h ago', score: 6.8, event: 'Trade rumors' },
    ]
  };

  const getSentimentColor = (score) => {
    if (score >= 7) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentBg = (score) => {
    if (score >= 7) return 'bg-green-400/20';
    if (score >= 5) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  return (
    <div className="space-y-6">
      {/* Main Sentiment Score */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-white">Overall Sentiment</span>
            <div className="flex items-center space-x-2">
              {sentimentData.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                {sentimentData.volume.toLocaleString()} mentions
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className={`text-6xl font-bold ${getSentimentColor(sentimentData.overall)}`}>
              {sentimentData.overall}
            </div>
            <div className="flex-1">
              <Progress 
                value={sentimentData.overall * 10} 
                className="h-3 bg-slate-700"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Bearish</span>
                <span>Neutral</span>
                <span>Bullish</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sentimentData.alerts.map((alert, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border ${
                alert.severity === 'high' ? 'bg-red-900/20 border-red-700' : 'bg-yellow-900/20 border-yellow-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge 
                    variant="outline" 
                    className={`mb-2 ${
                      alert.type === 'injury' ? 'text-red-400 border-red-400' : 'text-blue-400 border-blue-400'
                    }`}
                  >
                    {alert.type === 'injury' ? 'Injury Watch' : 'Contrarian Signal'}
                  </Badge>
                  <p className="text-slate-300 text-sm">{alert.message}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  alert.severity === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                } animate-pulse`}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Source Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Source Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(sentimentData.sources).map(([source, data]) => (
              <div key={source} className="p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-slate-300 capitalize font-medium">{source}</h4>
                  <span className={`text-sm font-bold ${getSentimentColor(data.score)}`}>
                    {data.score}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Volume: {data.volume}</span>
                    <span className={`${
                      data.trend === 'up' ? 'text-green-400' : 
                      data.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {data.trend === 'up' ? '↗' : data.trend === 'down' ? '↘' : '→'}
                    </span>
                  </div>
                  <Progress value={data.score * 10} className="h-2 bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Sentiment Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentimentData.timeline.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-xs text-slate-400">{item.time}</div>
                <div className={`w-3 h-3 rounded-full ${getSentimentBg(item.score)} ${getSentimentColor(item.score)}`}>
                  <div className="w-full h-full rounded-full bg-current opacity-50"></div>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-slate-300 text-sm">{item.event}</span>
                  <span className={`font-bold ${getSentimentColor(item.score)}`}>
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentDashboard;
