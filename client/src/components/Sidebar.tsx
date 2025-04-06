import { useState, useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Database, RefreshCw } from "lucide-react";

export interface JobSource {
  id: number;
  name: string;
  key: string;
  enabled: boolean;
  logo: string | null;
}

interface SidebarProps {
  onSourcesChange: (sources: string[]) => void;
  onSearch: (query: string, location: string) => void;
  jobTitle: string;
  location: string;
}

export default function Sidebar({ onSourcesChange, onSearch, jobTitle, location }: SidebarProps) {
  const { toast } = useToast();
  const [sources, setSources] = useState<JobSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchJobTitle, setSearchJobTitle] = useState(jobTitle);
  const [searchLocation, setSearchLocation] = useState(location);

  useEffect(() => {
    // Update local state when props change
    setSearchJobTitle(jobTitle);
    setSearchLocation(location);
  }, [jobTitle, location]);

  useEffect(() => {
    const fetchSources = async () => {
      setIsLoading(true);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ["/api/job-sources"],
          queryFn: async () => {
            const res = await fetch("/api/job-sources");
            if (!res.ok) {
              throw new Error("Failed to fetch job sources");
            }
            return res.json();
          },
        });
        
        setSources(response.jobSources);
        
        // Notify parent about enabled sources
        const enabledSources = response.jobSources
          .filter((source: JobSource) => source.enabled)
          .map((source: JobSource) => source.key);
        onSourcesChange(enabledSources);
      } catch (error) {
        console.error("Error fetching job sources:", error);
        toast({
          title: "Error",
          description: "Failed to load job search sources. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSources();
  }, [onSourcesChange, toast]);

  const handleToggleSource = async (id: number, enabled: boolean) => {
    try {
      const response = await fetch(`/api/job-sources/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job source");
      }

      // Update local state
      setSources(prevSources =>
        prevSources.map(source =>
          source.id === id ? { ...source, enabled } : source
        )
      );

      // Notify parent about enabled sources
      const enabledSources = sources
        .map(source => (source.id === id ? { ...source, enabled } : source))
        .filter(source => source.enabled)
        .map(source => source.key);
      onSourcesChange(enabledSources);

      toast({
        title: "Success",
        description: `${enabled ? "Enabled" : "Disabled"} ${sources.find(s => s.id === id)?.name} as a job source`,
      });
    } catch (error) {
      console.error("Error updating job source:", error);
      toast({
        title: "Error",
        description: "Failed to update job source. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    onSearch(searchJobTitle, searchLocation);
  };

  return (
    <div className="flex flex-col space-y-4 w-full md:w-64">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Job Search</CardTitle>
          <CardDescription>Find your perfect role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="job-title"
                  placeholder="e.g. Frontend Developer"
                  className="pl-8"
                  value={searchJobTitle}
                  onChange={(e) => setSearchJobTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="location"
                  placeholder="e.g. Remote, San Francisco"
                  className="pl-8"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSearch}
            >
              <Filter className="mr-2 h-4 w-4" />
              Search Jobs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Job Sources</CardTitle>
          <CardDescription>Choose where to search</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-gray-500" />
                    <Label htmlFor={`source-${source.id}`} className="cursor-pointer">
                      {source.name}
                    </Label>
                  </div>
                  <Switch
                    id={`source-${source.id}`}
                    checked={source.enabled}
                    onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                  />
                </div>
              ))}

              {sources.length === 0 && (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500">No job sources available</p>
                </div>
              )}

              <div className="pt-2">
                <Badge variant="outline" className="w-full justify-center">
                  <RefreshCw className="mr-1 h-3 w-3" /> 
                  Auto-refresh every 30 minutes
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}