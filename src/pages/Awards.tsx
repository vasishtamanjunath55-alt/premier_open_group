import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award as AwardIcon } from 'lucide-react';
import groupPhoto from '@/assets/group-photo.jpg';
import badgeImage from '@/assets/scout-badge.jpg';

export default function Awards() {
  const { data: awards, isLoading } = useQuery({
    queryKey: ['awards'],
    queryFn: async () => {
      const { data } = await supabase
        .from('awards')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={groupPhoto} 
            alt="Premier Open Group" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-90"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <AwardIcon className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">Awards & Badges</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Recognize excellence and achievement in scouting
          </p>
        </div>
      </section>

      {/* Awards Grid */}
      <section className="py-20 container mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : awards && awards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award) => (
              <Card key={award.id} className="hover:shadow-xl transition-shadow overflow-hidden">
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <img 
                    src={award.badge_image_url || badgeImage} 
                    alt={award.title}
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">{award.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{award.description}</p>
                  {award.requirements && (
                    <div>
                      <h4 className="font-semibold mb-2 text-primary">Requirements:</h4>
                      <p className="text-sm text-muted-foreground">{award.requirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No awards available at the moment.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
