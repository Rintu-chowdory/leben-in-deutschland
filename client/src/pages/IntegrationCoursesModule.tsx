import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, BookOpen, Calendar, DollarSign, ExternalLink, AlertCircle } from "lucide-react";

const courseTypes = [
  { value: 'language', label: 'Language Courses' },
  { value: 'culture', label: 'Culture & Civics' },
  { value: 'civic', label: 'Civic Orientation' },
  { value: 'combined', label: 'Combined Programs' },
];

export default function IntegrationCoursesModule() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const { data: cities, isLoading: citiesLoading } = trpc.integrationCourses.getCities.useQuery();
  const { data: courses, isLoading: coursesLoading } = trpc.integrationCourses.getCourses.useQuery(
    { city: selectedCity || undefined, courseType: selectedType || undefined },
    { enabled: !!selectedCity || !!selectedType }
  );

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const allCourses = !selectedCity && !selectedType ? [] : courses;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container py-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Integration Course Finder</h1>
          <p className="text-lg text-muted-foreground">
            Find integration courses in your city
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Overview */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Integration Courses (Integrationskurse)</h2>
          <p className="text-foreground mb-4">
            Integration courses are government-funded programs designed to help newcomers learn German and understand German culture and society. 
            They typically consist of language lessons and civic orientation modules.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="font-semibold text-foreground mb-2">✓ Government Funded</p>
              <p className="text-sm text-muted-foreground">Subsidized or free for eligible participants</p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="font-semibold text-foreground mb-2">✓ Flexible Schedules</p>
              <p className="text-sm text-muted-foreground">Full-time and part-time options available</p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="font-semibold text-foreground mb-2">✓ Recognized Certification</p>
              <p className="text-sm text-muted-foreground">Official certificate upon completion</p>
            </div>
          </div>
        </Card>

        {/* Search Filters */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Find Courses</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                City
              </label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a city..." />
                </SelectTrigger>
                <SelectContent>
                  {citiesLoading ? (
                    <div className="p-2 text-center text-muted-foreground">Loading cities...</div>
                  ) : (
                    cities?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Course Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course type..." />
                </SelectTrigger>
                <SelectContent>
                  {courseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(selectedCity || selectedType) && (
            <p className="text-sm text-muted-foreground">
              {coursesLoading ? 'Loading courses...' : `Found ${allCourses?.length || 0} course(s)`}
            </p>
          )}
        </Card>

        {/* Courses List */}
        {(selectedCity || selectedType) && (
          <div className="mb-12">
            {coursesLoading ? (
              <Card className="p-8 text-center text-muted-foreground">
                Loading courses...
              </Card>
            ) : allCourses && allCourses.length > 0 ? (
              <div className="space-y-4">
                {allCourses.map((course) => (
                  <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{course.provider}</p>
                        
                        <div className="space-y-2 text-sm">
                          {course.city && (
                            <div className="flex items-center gap-2 text-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{course.city}, {course.state}</span>
                            </div>
                          )}
                          
                          {course.courseType && (
                            <div className="flex items-center gap-2 text-foreground">
                              <BookOpen className="w-4 h-4" />
                              <span className="capitalize">{course.courseType}</span>
                            </div>
                          )}
                          
                          {course.startDate && (
                            <div className="flex items-center gap-2 text-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(course.startDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {course.price && (
                            <div className="flex items-center gap-2 text-foreground">
                              <DollarSign className="w-4 h-4" />
                              <span>€{course.price}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between">
                        {course.description && (
                          <p className="text-sm text-foreground mb-4">
                            {course.description}
                          </p>
                        )}
                        
                        <div className="flex flex-col gap-2">
                          {course.bamfLink && (
                            <a 
                              href={course.bamfLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button className="w-full">
                                BAMF Details
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            </a>
                          )}
                          {course.website && (
                            <a 
                              href={course.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" className="w-full">
                                Provider Website
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                No courses found for the selected filters. Try different options.
              </Card>
            )}
          </div>
        )}

        {/* Course Information */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Course Structure</h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Language Module</p>
              <p className="text-sm text-foreground">
                600 hours of German language instruction, typically 6 months of full-time study
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Orientation Module</p>
              <p className="text-sm text-foreground">
                100 hours covering German culture, history, legal system, and social norms
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Certification</p>
              <p className="text-sm text-foreground">
                Official certificate (Integrationskurszertifikat) upon successful completion
              </p>
            </div>
          </div>
        </Card>

        {/* BAMF Resources */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Official Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="https://www.bamf.de/EN/Themen/Integration/Integrationskurse/integrationskurse-node.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
            >
              <p className="font-semibold text-foreground">BAMF Integration Courses</p>
              <p className="text-sm text-muted-foreground mt-1">Official BAMF information about integration courses</p>
            </a>
            <a 
              href="https://www.bamf.de/EN/Themen/Integration/Integrationskurse/Kurstraeger/kurstraeger-node.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
            >
              <p className="font-semibold text-foreground">Find Course Providers</p>
              <p className="text-sm text-muted-foreground mt-1">Search BAMF database for approved providers</p>
            </a>
          </div>
        </Card>

        {/* Pro Tips */}
        <Card className="p-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Pro Tips</p>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• Many courses are free or heavily subsidized for eligible participants</li>
                <li>• Enroll as early as possible, as courses often have waiting lists</li>
                <li>• Some employers offer time off for course participation</li>
                <li>• Childcare may be available during course hours</li>
                <li>• Successful completion can help with citizenship applications</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
