
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ApiStatus {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: string;
}

const ApiStatusChecker = () => {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkApis = async () => {
    setIsChecking(true);
    const statuses: ApiStatus[] = [];

    // Check Reddit API
    try {
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa('-7EV03N1xVXY3vda_h_Dzw:jat9LYjzT_G52kMIpPcTIUdLIqBdhA')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'SentiBet/1.0'
        },
        body: 'grant_type=client_credentials'
      });

      if (response.ok) {
        statuses.push({
          name: 'Reddit API',
          status: 'success',
          message: 'Connected successfully',
          details: 'Authentication working'
        });
      } else {
        statuses.push({
          name: 'Reddit API',
          status: 'error',
          message: `Authentication failed: ${response.status}`,
          details: response.statusText
        });
      }
    } catch (error) {
      statuses.push({
        name: 'Reddit API',
        status: 'error',
        message: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check DeepSeek API
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        })
      });

      if (response.ok) {
        statuses.push({
          name: 'DeepSeek API (OpenRouter)',
          status: 'success',
          message: 'Connected successfully',
          details: 'API responding normally'
        });
      } else {
        const errorText = await response.text();
        statuses.push({
          name: 'DeepSeek API (OpenRouter)',
          status: 'error',
          message: `Request failed: ${response.status}`,
          details: errorText.substring(0, 200)
        });
      }
    } catch (error) {
      statuses.push({
        name: 'DeepSeek API (OpenRouter)',
        status: 'error',
        message: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check Groq API
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        })
      });

      if (response.ok) {
        statuses.push({
          name: 'Groq API',
          status: 'success',
          message: 'Connected successfully',
          details: 'API responding normally'
        });
      } else {
        const errorText = await response.text();
        statuses.push({
          name: 'Groq API',
          status: 'error',
          message: `Request failed: ${response.status}`,
          details: errorText.substring(0, 200)
        });
      }
    } catch (error) {
      statuses.push({
        name: 'Groq API',
        status: 'error',
        message: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check Gemini API
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBwOpQX1WH5c_aJWtfYZZIU5Bq3WADT5jo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'test' }] }]
        })
      });

      if (response.ok) {
        statuses.push({
          name: 'Gemini API',
          status: 'success',
          message: 'Connected successfully',
          details: 'API responding normally'
        });
      } else {
        const errorText = await response.text();
        statuses.push({
          name: 'Gemini API',
          status: 'error',
          message: `Request failed: ${response.status}`,
          details: errorText.substring(0, 200)
        });
      }
    } catch (error) {
      statuses.push({
        name: 'Gemini API',
        status: 'error',
        message: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setApiStatuses(statuses);
    setIsChecking(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'loading': return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 border-green-400';
      case 'error': return 'text-red-400 border-red-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      case 'loading': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          API Status Checker
          <Button 
            onClick={checkApis} 
            disabled={isChecking}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isChecking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Check APIs
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {apiStatuses.length === 0 ? (
          <p className="text-slate-400">Click "Check APIs" to test all API connections</p>
        ) : (
          <div className="space-y-4">
            {apiStatuses.map((api, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(api.status)}
                    <span className="font-medium text-white">{api.name}</span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(api.status)}>
                    {api.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm">{api.message}</p>
                {api.details && (
                  <p className="text-slate-500 text-xs mt-1">{api.details}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiStatusChecker;
