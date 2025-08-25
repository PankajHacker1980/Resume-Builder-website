import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText, Zap, Target, Award, Share2, Download, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Resume Builder
              </span>
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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            AI-Powered Resume Building
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create Professional Resumes
            <br />
            with AI Assistance
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Build ATS-friendly resumes with intelligent keyword suggestions, real-time editing, 
            and professional templates. Get hired faster with AI-optimized content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="mr-2 h-5 w-5" />
                Start Building Now
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <FileText className="mr-2 h-5 w-5" />
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Get Hired
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features designed to make your resume stand out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>AI-Powered Content</CardTitle>
                <CardDescription>
                  Get intelligent suggestions for professional wording and industry-specific keywords
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>ATS Optimization</CardTitle>
                <CardDescription>
                  Ensure your resume passes Applicant Tracking Systems with smart formatting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Multiple Templates</CardTitle>
                <CardDescription>
                  Choose from modern, professional templates and switch between them instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Real-time Editing</CardTitle>
                <CardDescription>
                  WYSIWYG editor with drag-and-drop sections for effortless customization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Resume Scoring</CardTitle>
                <CardDescription>
                  Get feedback on structure, grammar, and ATS compatibility with improvement tips
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Share2 className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Easy Sharing</CardTitle>
                <CardDescription>
                  Export as PDF, Word, or share via unique links with potential employers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Take your resume to the next level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Job-Specific Customization</h3>
              <ul className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <Target className="h-5 w-5 text-green-600 mr-3" />
                  Upload job descriptions for AI analysis
                </li>
                <li className="flex items-center">
                  <Brain className="h-5 w-5 text-blue-600 mr-3" />
                  Automatic resume tailoring for specific roles
                </li>
                <li className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-600 mr-3" />
                  AI-generated cover letters
                </li>
              </ul>
            </div>
            <div>
              <Card className="p-8">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Multiple Export Options</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Mobile-Friendly Design</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Portfolio Integration</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Dream Resume?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who've landed their dream jobs with our AI-powered resume builder
          </p>
          <Link to={user ? "/dashboard" : "/register"}>
            <Button size="lg" variant="secondary" className="text-blue-600">
              <Zap className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">AI Resume Builder</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 AI Resume Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}