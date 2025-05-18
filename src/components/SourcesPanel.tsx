
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Source {
  url: string;
  title: string;
  content: string;
}

interface SourcesPanelProps {
  sources: Source[];
}

const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <Card className="border-leaf-100 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-leaf-800">Sources</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {sources.map((source, index) => (
            <div key={index} className="border-b border-leaf-100 pb-2 last:border-0">
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="source-link flex items-start gap-1 group"
              >
                <span className="flex-shrink-0 mt-1">
                  <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="font-medium">{source.title || "Source " + (index + 1)}</span>
              </a>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {source.content}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourcesPanel;
