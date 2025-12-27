import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';
import groupPhoto from '@/assets/group-photo.jpg';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data } = await supabase
        .from('gallery')
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
          <Camera className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">Gallery</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Moments of adventure, service, and growth
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 container mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : galleryItems && galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setSelectedImage(item.image_url)}
              >
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/90 text-sm line-clamp-2">{item.description}</p>
                  )}
                  {item.category && (
                    <Badge variant="secondary" className="mt-2 w-fit">
                      {item.category}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No gallery items available at the moment.</p>
          </div>
        )}
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Gallery preview"
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
