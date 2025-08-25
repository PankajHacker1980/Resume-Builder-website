import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft, Eye, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  preview: string;
  recommended: boolean;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and business roles',
    category: 'Professional',
    features: ['ATS-Friendly', 'Modern Design', 'Tech Focus'],
    preview: '/api/placeholder/300/400',
    recommended: true
  },
  {
    id: '2',
    name: 'Executive',
    description: 'Sophisticated layout designed for senior management positions',
    category: 'Executive',
    features: ['Leadership Focus', 'Premium Design', 'Achievement Emphasis'],
    preview: '/api/placeholder/300/400',
    recommended: false
  },
  {
    id: '3',
    name: 'Creative',
    description: 'Vibrant and artistic template for creative professionals',
    category: 'Creative',
    features: ['Visual Appeal', 'Portfolio Integration', 'Color Customization'],
    preview: '/api/placeholder/300/400',
    recommended: false
  },
  {
    id: '4',
    name: 'Academic',
    description: 'Traditional format ideal for academic and research positions',
    category: 'Academic',
    features: ['Research Focus', 'Publication Lists', 'Traditional Layout'],
    preview: '/api/placeholder/300/400',
    recommended: false
  },
  {
    id: '5',
    name: 'Startup',
    description: 'Dynamic and innovative design for startup environments',
    category: 'Startup',
    features: ['Innovation Focus', 'Skill Highlights', 'Growth Metrics'],
    preview: '/api/placeholder/300/400',
    recommended: true
  },
  {
    id: '6',
    name: 'Healthcare',
    description: 'Professional template tailored for healthcare professionals',
    category: 'Healthcare',
    features: ['Certification Focus', 'Clean Layout', 'Trust Building'],
    preview: '/api/placeholder/300/400',
    recommended: false
  }
];

const categories = ['All', 'Professional', 'Executive', 'Creative', 'Academic', 'Startup', 'Healthcare'];

export default function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleUseTemplate = (templateId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Create new resume with selected template
    const newResume = {
      id: Date.now().toString(),
      title: 'New Resume',
      template: templates.find(t => t.id === templateId)?.name || 'Modern Professional',
      lastModified: new Date().toISOString().split('T')[0],
      isPublic: false
    };
    
    const savedResumes = localStorage.getItem('resumes');
    const resumes = savedResumes ? JSON.parse(savedResumes) : [];
    resumes.push(newResume);
    localStorage.setItem('resumes', JSON.stringify(resumes));
    
    navigate(`/builder/${newResume.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white dark:bg-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to={user ? "/dashboard" : "/"}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Link to="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Resume Builder
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resume Templates
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from our collection of professionally designed, ATS-friendly templates. 
            Each template is optimized for different industries and career levels.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-5/6 bg-white dark:bg-gray-800 rounded shadow-lg border">
                    <div className="p-3 space-y-2">
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                      <div className="pt-2">
                        <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                        <div className="mt-1 space-y-1">
                          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {template.recommended && (
                  <Badge className="absolute top-3 right-3 bg-yellow-500">
                    <Zap className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">
                Need a Custom Template?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our AI can create personalized templates based on your industry and career goals.
              </p>
              <Button size="lg">
                <Brain className="mr-2 h-5 w-5" />
                Create Custom Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}