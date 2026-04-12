import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Plus, Layout, ExternalLink, Globe, Loader2 } from 'lucide-react';
import { studentApi } from '../../../services/api';

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
        // Mock data
        setPortfolios([
          {
            id: 1,
            title: "Backend Engineering Portfolio",
            summary: "Collection of backend and cloud-native projects",
            is_public: true,
            projects: 4
          }
        ]);
      } else {
        const data = await studentApi.getAllPortfolio();
        setPortfolios(data.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
        setPortfolios([{
          id: Date.now(),
          title: "New AI Project Collection",
          summary: "Exploring machine learning integration",
          is_public: false,
          projects: 0
        }, ...portfolios]);
      } else {
        const newPortfolio = {
          title: "New Portfolio",
          summary: "My latest works",
          is_public: false
        };
        await studentApi.addPortfolio(newPortfolio);
        fetchPortfolios(); // Refresh
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create portfolio');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
            Portfolio System
          </div>
          <h1 className="text-7xl font-heading font-extrabold text-primary leading-[1.05] tracking-tight">
            Showcase <span className="text-secondary">Excellence</span>.
          </h1>
        </div>
        <Button className="h-14 px-8" onClick={handleCreateNew}>
          <Plus className="w-5 h-5 mr-2" />
          Create New Collection
        </Button>
      </div>

      {error && <div className="text-red-500 mb-8">{error}</div>}
      
      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((item) => (
            <Card key={item.id} className="group overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-surface-container-low rounded-sq-sm group-hover:bg-secondary/10 transition-colors">
                    <Layout className="w-8 h-8 text-secondary" />
                  </div>
                  {item.is_public && (
                    <div className="flex items-center text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                      <Globe className="w-3 h-3 mr-1.5" />
                      Public
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-heading font-extrabold text-primary leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-customText/60 leading-relaxed font-body">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm font-bold text-primary">
                    {item.projects || 0} Projects
                  </div>
                  <Button variant="ghost" className="text-secondary p-0 h-auto hover:bg-transparent hover:translate-x-1 transition-transform">
                    View Portfolio
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
