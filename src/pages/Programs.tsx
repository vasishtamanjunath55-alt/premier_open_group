import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';
import groupPhoto from '@/assets/group-photo.jpg';

export default function Programs() {
  const { data: programs, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('programs')
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
<section className="relative w-full min-h-[70vh] overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src={groupPhoto}
      alt="Premier Open Group"
      className="w-full h-full object-contain bg-black"
    />
    <div className="absolute inset-0 bg-gradient-primary/40"></div>
  </div>

  {/* Text at TOP */}
  <div className="relative z-10 container mx-auto px-4 pt-36 text-center text-primary-foreground">
    <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
      Our Programs
    </h1>
    <p className="text-xl md:text-2xl max-w-2xl mx-auto">
      Discover exciting opportunities for growth and adventure
    </p>
  </div>
</section>


      {/* Programs Grid */}
      <section className="py-20 container mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : programs && programs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="hover:shadow-xl transition-shadow overflow-hidden">
                {program.image_url && (
                  <img 
                    src={program.image_url} 
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{program.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    {program.age_group && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {program.age_group}
                      </Badge>
                    )}
                    {program.duration && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {program.duration}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No programs available at the moment.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
