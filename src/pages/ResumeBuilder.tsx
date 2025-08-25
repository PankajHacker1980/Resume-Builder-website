import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Brain, Save, Download, Share2, ArrowLeft, Plus, X, Lightbulb, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
  projects: string[];
}

export default function ResumeBuilder() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: []
  });

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [resumeScore, setResumeScore] = useState(0);
  const [newSkill, setNewSkill] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (id) {
      const savedResumes = localStorage.getItem('resumes');
      if (savedResumes) {
        const resumes = JSON.parse(savedResumes);
        const currentResume = resumes.find((r: { id: string; data?: ResumeData }) => r.id === id);
        if (currentResume && currentResume.data) {
          setResumeData(currentResume.data);
        }
      }
    }
  }, [id, user, navigate]);

  const generateAiSuggestions = () => {
    const suggestions = [
      "Consider adding quantifiable achievements to your experience descriptions",
      "Include relevant keywords for your target industry",
      "Add a professional summary that highlights your unique value proposition",
      "Ensure your skills align with current job market demands",
      "Consider adding certifications relevant to your field"
    ];
    setAiSuggestions(suggestions.slice(0, 3));
  };

  const calculateResumeScore = () => {
    let score = 0;
    
    const personalFields = Object.values(resumeData.personalInfo).filter(field => field.trim() !== '');
    score += (personalFields.length / 8) * 20;
    
    if (resumeData.summary.length > 50) score += 15;
    else if (resumeData.summary.length > 0) score += 7;
    
    if (resumeData.experience.length >= 2) score += 25;
    else if (resumeData.experience.length >= 1) score += 15;
    
    if (resumeData.education.length >= 1) score += 15;
    
    if (resumeData.skills.length >= 5) score += 15;
    else if (resumeData.skills.length >= 3) score += 10;
    
    if (resumeData.certifications.length > 0 || resumeData.projects.length > 0) score += 10;
    
    setResumeScore(Math.round(score));
  };

  useEffect(() => {
    calculateResumeScore();
  }, [resumeData]);

  const saveResume = () => {
    const savedResumes = localStorage.getItem('resumes');
    const resumes = savedResumes ? JSON.parse(savedResumes) : [];
    
    const resumeIndex = resumes.findIndex((r: { id: string }) => r.id === id);
    if (resumeIndex >= 0) {
      resumes[resumeIndex].data = resumeData;
      resumes[resumeIndex].lastModified = new Date().toISOString().split('T')[0];
      resumes[resumeIndex].score = resumeScore;
    }
    
    localStorage.setItem('resumes', JSON.stringify(resumes));
    toast.success('Resume saved successfully!');
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const optimizeForJob = () => {
    if (jobDescription.trim()) {
      // Mock AI optimization
      const keywords = ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'];
      const suggestedSkills = keywords.filter(skill => 
        !resumeData.skills.includes(skill) && 
        jobDescription.toLowerCase().includes(skill.toLowerCase())
      );
      
      if (suggestedSkills.length > 0) {
        setResumeData(prev => ({
          ...prev,
          skills: [...prev.skills, ...suggestedSkills]
        }));
        toast.success(`Added ${suggestedSkills.length} relevant skills based on job description`);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white dark:bg-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">Resume Builder</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={resumeScore >= 80 ? 'default' : 'secondary'}>
                Score: {resumeScore}%
              </Badge>
              <Button onClick={saveResume} variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resume Editor</CardTitle>
                <CardDescription>
                  Fill in your information to build your professional resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={resumeData.personalInfo.firstName}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={resumeData.personalInfo.lastName}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, email: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={resumeData.personalInfo.github}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, github: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary" className="space-y-4">
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        placeholder="Write a compelling professional summary..."
                        value={resumeData.summary}
                        onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                        rows={6}
                      />
                    </div>
                    <Button onClick={generateAiSuggestions} variant="outline">
                      <Brain className="mr-2 h-4 w-4" />
                      Get AI Suggestions
                    </Button>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    {resumeData.experience.map((exp) => (
                      <Card key={exp.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold">Experience {resumeData.experience.indexOf(exp) + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label>Company</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Position</Label>
                              <Input
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Switch
                                checked={exp.current}
                                onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                              />
                              <Label>Current</Label>
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button onClick={addExperience} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Experience
                    </Button>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4">
                    {resumeData.education.map((edu) => (
                      <Card key={edu.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold">Education {resumeData.education.indexOf(edu) + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label>Institution</Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Field of Study</Label>
                              <Input
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Graduation Year</Label>
                              <Input
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button onClick={addEducation} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div>
                      <Label>Add Skills</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Enter a skill"
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button onClick={addSkill}>Add</Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer">
                          {skill}
                          <X
                            className="ml-1 h-3 w-3"
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Job Description (Optional)</Label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description for AI optimization..."
                    rows={3}
                  />
                  <Button onClick={optimizeForJob} className="mt-2 w-full" variant="outline">
                    <Target className="mr-2 h-4 w-4" />
                    Optimize for Job
                  </Button>
                </div>
                
                {aiSuggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      AI Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume Score */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {resumeScore}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${resumeScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {resumeScore >= 80 ? 'Excellent!' : resumeScore >= 60 ? 'Good progress' : 'Keep improving'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Resume
                </Button>
                <Button className="w-full" variant="outline">
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Cover Letter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}