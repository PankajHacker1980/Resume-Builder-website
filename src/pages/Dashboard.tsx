import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Brain, Plus, FileText, Download, Share2, Edit, Trash2, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';

interface Resume {
  id: string;
  title: string;
  template: string;
  lastModified: string;
  score?: number;
  isPublic: boolean;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load resumes from localStorage
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      setResumes(JSON.parse(savedResumes));
    } else {
      // Create sample resumes
      const sampleResumes: Resume[] = [
        {
          id: '1',
          title: 'Software Engineer Resume',
          template: 'Modern Professional',
          lastModified: '2024-01-15',
          score: 85,
          isPublic: false
        },
        {
          id: '2',
          title: 'Marketing Manager Resume',
          template: 'Creative',
          lastModified: '2024-01-10',
          score: 92,
          isPublic: true
        }
      ];
      setResumes(sampleResumes);
      localStorage.setItem('resumes', JSON.stringify(sampleResumes));
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const createNewResume = () => {
    const newResume: Resume = {
      id: Date.now().toString(),
      title: 'New Resume',
      template: 'Modern Professional',
      lastModified: new Date().toISOString().split('T')[0],
      isPublic: false
    };
    const updatedResumes = [...resumes, newResume];
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    navigate(`/builder/${newResume.id}`);
  };

  const deleteResume = (id: string) => {
    const updatedResumes = resumes.filter(resume => resume.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white dark:bg-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Resume Builder
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your resumes and create new ones with AI assistance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={createNewResume}>
            <CardHeader className="text-center py-8">
              <Plus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Create New Resume</CardTitle>
              <CardDescription>
                Start building a new resume with AI assistance
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Link to="/templates">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center py-8">
                <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Browse Templates</CardTitle>
                <CardDescription>
                  Explore our collection of professional templates
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center py-8">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Get personalized tips and suggestions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Resume List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Resumes</h2>
            <Button onClick={createNewResume}>
              <Plus className="mr-2 h-4 w-4" />
              New Resume
            </Button>
          </div>

          {resumes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No resumes yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Create your first resume to get started
                </p>
                <Button onClick={createNewResume}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{resume.title}</CardTitle>
                        <CardDescription>
                          Template: {resume.template}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/builder/${resume.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteResume(resume.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">
                        Last modified: {new Date(resume.lastModified).toLocaleDateString()}
                      </span>
                      {resume.score && (
                        <Badge variant={resume.score >= 80 ? 'default' : 'secondary'}>
                          Score: {resume.score}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/builder/${resume.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumes.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resumes.filter(r => r.score).length > 0 
                  ? Math.round(resumes.filter(r => r.score).reduce((acc, r) => acc + (r.score || 0), 0) / resumes.filter(r => r.score).length)
                  : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Resumes</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resumes.filter(r => r.isPublic).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}