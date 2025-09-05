import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/Layout';
import { createContentSchema, type CreateContentFormData } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { 
  Sparkles, 
  Upload, 
  Eye, 
  Save, 
  Send,
  Clock,
  FileText,
  Tag
} from 'lucide-react';

export default function CreateContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateContentFormData>({
    resolver: zodResolver(createContentSchema),
    defaultValues: {
      status: 'draft'
    }
  });

  const watchedBody = watch('body');

  // AI Analysis
  const analyzeContent = async () => {
    if (!watchedBody || watchedBody.length < 10) return;
    
    setIsAnalyzing(true);
    try {
      const response = await api.post('/content/analyze', { body: watchedBody });
      if (response.data.status) {
        setAiAnalysis(response.data.data);
        toast({
          title: "AI Analysis Complete",
          description: "Content analyzed successfully with AI insights.",
        });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createContentMutation = useMutation({
    mutationFn: async (data: CreateContentFormData) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('body', data.body);
      formData.append('status', data.status);
      
      if (data.tags) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      if (data.featuredImage) {
        formData.append('featuredImage', data.featuredImage);
      }

      const response = await api.post('/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Content created!",
        description: "Your content has been created successfully.",
      });
      navigate('/');
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create content",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateContentFormData) => {
    createContentMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create New Content</h1>
            <p className="text-muted-foreground">Share your ideas with the world</p>
          </div>
          <Button
            onClick={analyzeContent}
            variant="outline"
            disabled={isAnalyzing || !watchedBody}
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analyzing...' : 'AI Analysis'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Content Details</CardTitle>
                <CardDescription>Fill in the details for your new content</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a compelling title..."
                      {...register('title')}
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Content</Label>
                    <Textarea
                      id="body"
                      placeholder="Write your content here... Use HTML tags for formatting."
                      rows={12}
                      {...register('body')}
                      className={errors.body ? 'border-destructive' : ''}
                    />
                    {errors.body && (
                      <p className="text-sm text-destructive">{errors.body.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., technology, ai, programming"
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        setValue('tags', tags);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Featured Image</Label>
                    <Input
                      id="featuredImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue('featuredImage', file);
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      type="submit"
                      variant="gradient"
                      disabled={isSubmitting}
                      onClick={() => setValue('status', 'published')}
                      className="flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Publishing...' : 'Publish'}</span>
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => setValue('status', 'draft')}
                      className="flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save as Draft</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="space-y-6">
            {aiAnalysis && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{aiAnalysis.wordCount} words</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{aiAnalysis.readingTime} min read</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI Suggested Category
                    </h4>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {aiAnalysis.suggestedCategory}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      AI Suggested Tags
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {aiAnalysis.autoTags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Tips for Great Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p>Write a compelling title that clearly describes your content</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p>Use headings and paragraphs to structure your content</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p>Add relevant tags to help others discover your content</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p>Include a featured image to make your content more engaging</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}