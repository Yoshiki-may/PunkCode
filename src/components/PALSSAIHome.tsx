import { Search, FileText, Lightbulb, FileOutput, ChevronRight, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoIcon from 'figma:asset/4c79bd22e3170ee36ac26c93a0ac2fc0bdbb54c5.png';

interface PALSSAIHomeProps {
  onNavigate: (page: string, clientId: string) => void;
  theme?: 'light' | 'dark' | 'feminine' | 'palss';
}

interface Client {
  id: string;
  name: string;
  avatar: string;
  industry: string;
  instagramHandle?: string;
}

const aiFeatures = [
  {
    id: 'ai-research',
    icon: Search,
    title: '企業リサーチ',
    description: 'SNS内で輝きつつ企業文化や時をお伝え致します',
    iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'ai-proposal',
    icon: FileText,
    title: '提案ドラフト作成',
    description: '課題分析や効果を提案しレポートを作成致します',
    iconBg: 'bg-accent',
    iconColor: 'text-primary',
  },
  {
    id: 'ai-ideas',
    icon: Lightbulb,
    title: 'アイデア作成',
    description: 'プロ目線での施策エンジニアの効率化施策提案',
    iconBg: 'bg-amber-50 dark:bg-amber-950/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'ai-document',
    icon: FileOutput,
    title: 'レポート作成依頼',
    description: '課題分析や効果を資産しレポートを作成致します',
    iconBg: 'bg-purple-50 dark:bg-purple-950/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
];

// Real client data from Clients component
const mockClients: Client[] = [
  { id: '1', name: 'AXAS株式会社', avatar: 'AX', industry: 'Technology & SaaS', instagramHandle: '@axas_official' },
  { id: '2', name: 'BAYMAX株式会社', avatar: 'BM', industry: 'Technology & SaaS' },
  { id: '3', name: 'LUNETTA BEAUTY', avatar: 'LB', industry: 'Beauty & Cosmetics', instagramHandle: '@lunetta_beauty' },
  { id: '4', name: 'URBAN THREADS', avatar: 'UT', industry: 'Fashion & Apparel', instagramHandle: '@urban_threads' },
  { id: '5', name: 'GREEN WELLNESS', avatar: 'GW', industry: 'Health & Wellness', instagramHandle: '@green_wellness' },
  { id: '6', name: 'TECH INNOVATIONS', avatar: 'TI', industry: 'Technology & SaaS', instagramHandle: '@tech_innovations' },
  { id: '7', name: 'GOURMET DELIGHT', avatar: 'GD', industry: 'Food & Beverage', instagramHandle: '@gourmet_delight' },
  { id: '8', name: 'FITNESS PRO', avatar: 'FP', industry: 'Fitness & Sports', instagramHandle: '@fitness_pro' },
  { id: '9', name: 'ECO LIVING', avatar: 'EL', industry: 'Lifestyle & Sustainability', instagramHandle: '@eco_living' },
  { id: '10', name: 'PET PARADISE', avatar: 'PP', industry: 'Pet Care & Products', instagramHandle: '@pet_paradise' },
  { id: '11', name: 'デジタルフロンティア株式会社', avatar: 'DF', industry: 'Technology & SaaS' },
  { id: '12', name: 'グローバルソリューションズ', avatar: 'GS', industry: 'Business Consulting' },
  { id: '13', name: 'クリエイティブワークス', avatar: 'CW', industry: 'Creative & Design' },
  { id: '14', name: 'エンタープライズ株式会社', avatar: 'EP', industry: 'Enterprise Software' },
  { id: '15', name: 'フューチャーデザイン', avatar: 'FD', industry: 'Creative & Design' },
];

export function PALSSAIHome({ onNavigate, theme }: PALSSAIHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'feminine' | 'palss'>('palss');

  // Detect theme from document or use prop
  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
    } else {
      // Auto-detect theme from document
      if (document.documentElement.classList.contains('dark')) {
        setCurrentTheme('dark');
      } else if (document.documentElement.classList.contains('feminine')) {
        setCurrentTheme('feminine');
      } else if (document.documentElement.classList.contains('palss')) {
        setCurrentTheme('palss');
      } else {
        setCurrentTheme('light');
      }
    }
  }, [theme]);

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (client.instagramHandle && client.instagramHandle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSearchQuery(client.name);
    setShowDropdown(false);
  };

  const handleFeatureClick = (featureId: string) => {
    if (selectedClient) {
      onNavigate(featureId, selectedClient.id);
    }
  };

  // Get background gradient classes based on theme
  const getBackgroundGradient = () => {
    switch (currentTheme) {
      case 'palss':
      case 'light':
        return 'palss-ai-bg';
      case 'dark':
        return 'dark-ai-bg';
      case 'feminine':
        return 'feminine-ai-bg';
      default:
        return 'palss-ai-bg';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-8 px-6 relative overflow-hidden ${getBackgroundGradient()}`}>
      {/* Animated Gradient Background - Removed static layer */}
      <div className="w-full max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Header - Centered */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl tracking-tight">
            <span className="text-card-foreground">PALSS AI </span>
            <span className="text-primary">SYSTEM</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {selectedClient ? `${selectedClient.name}の成長戦略を、AIと共に` : 'クライアントの未来を、AIと共に描く'}
          </p>
        </div>

        {/* Client Search - Centered */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <img src={logoIcon} alt="PALSS AI" className="w-8 h-8" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
                if (!e.target.value) {
                  setSelectedClient(null);
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="クライアントを検索して指定..."
              className="w-full h-14 pl-16 pr-16 bg-card/40 backdrop-blur-xl border-2 border-border/30 rounded-2xl focus:border-primary/50 focus:bg-card/50 focus:outline-none transition-all text-card-foreground placeholder:text-muted-foreground/60 shadow-lg hover:border-border/50"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Dropdown */}
            {showDropdown && searchQuery && filteredClients.length > 0 && (
              <div className="absolute z-20 w-full mt-3 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
                {filteredClients.map((client, index) => (
                  <button
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className="w-full px-6 py-4 text-left hover:bg-accent/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b border-border/30 last:border-0"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                          <span className="text-sm text-primary">{client.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-card-foreground truncate">{client.name}</div>
                          {client.instagramHandle && (
                            <div className="text-xs text-muted-foreground mt-0.5">{client.instagramHandle}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground/80 px-3 py-1.5 bg-accent/30 rounded-lg whitespace-nowrap flex-shrink-0">
                        {client.industry}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Feature Cards - Grid Layout */}
        <div className="grid grid-cols-2 gap-5 max-w-5xl mx-auto">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;
            const isDisabled = !selectedClient;

            return (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                disabled={isDisabled}
                className={`relative bg-card/40 backdrop-blur-xl border border-border/30 rounded-2xl p-8 text-center transition-all group overflow-hidden shadow-lg ${
                  isDisabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:border-primary/40 hover:bg-card/50 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Background gradient effect */}
                {!isDisabled && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                {/* Content */}
                <div className="relative flex flex-col items-center">
                  <div className="mb-4">
                    <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center transition-transform ${
                      !isDisabled && 'group-hover:scale-110 group-hover:rotate-3'
                    }`}>
                      <Icon className={`w-7 h-7 ${feature.iconColor}`} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-card-foreground text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Help Text - Centered */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground/70">
            クライアントを選択してAI機能をご利用ください
          </p>
        </div>
      </div>
    </div>
  );
}