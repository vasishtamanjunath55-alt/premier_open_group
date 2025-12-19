import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import heroImage from '@/assets/hero-main.jpg';
import scoutLogo from '@/assets/scout-logo.png';
import logo from '@/assets/logo.png';
import badenPowell from '@/assets/baden-powell-nobg.png';
import scoutSalute from '@/assets/scout-salute-nobg.png';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Index() {
  const { data: latestPosts } = useQuery({
    queryKey: ['latest-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      return data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#556B2F]">
          <img 
            src={scoutLogo} 
            alt="Bharat Scouts and Guides Logo" 
            className="w-full h-full object-contain opacity-10"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <div className="mb-2">
            <h2 className="text-lg md:text-xl font-serif tracking-wide mb-1">
              THE BHARAT SCOUTS AND GUIDES KARNATAKA
            </h2>
          </div>
          <div className="relative flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in tracking-tight">
              PREMIER OPEN GROUP
            </h1>
          </div>
          <p className="text-base md:text-lg mb-2 opacity-95">
            Sri Jayachamarajendra Scouts and Guides Headquarters, Mysuru - 570005
          </p>
          <p className="text-sm md:text-base mb-8 opacity-90">
            premieropengroup@gmail.com
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/programs">
              <Button size="lg" variant="secondary" className="text-lg px-8 shadow-glow hover:scale-105 transition-transform">
                Explore Programs <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Awards Achievement Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-primary">Our Achievements</h2>
            <p className="text-lg text-muted-foreground">Award Statistics by Category</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                category: 'Cubs', 
                awards: [
                  { name: 'Awards', count: '25+' }
                ]
              },
              { 
                category: 'Bulbuls', 
                awards: [
                  { name: 'Awards', count: '15+' }
                ]
              },
              { 
                category: 'Scouts', 
                awards: [
                  { name: 'Rajyapuraskar Award', count: '650+' },
                  { name: 'Rastrapathi Award', count: '325+' }
                ]
              },
              { 
                category: 'Guides', 
                awards: [
                  { name: 'Rajyapuraskar Award', count: '340+' },
                  { name: 'Rastrapathi Award', count: '235+' }
                ]
              },
              { 
                category: 'Rovers', 
                awards: [
                  { name: 'Rajyapuraskar Award', count: '70+' },
                  { name: 'Rastrapathi Award', count: '32+' }
                ]
              },
              { 
                category: 'Rangers', 
                awards: [
                  { name: 'Rajyapuraskar Award', count: '50+' },
                  { name: 'Rastrapathi Award', count: '16+' }
                ]
              },
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <img 
                    src={scoutLogo} 
                    alt="Scout Badge" 
                    className="w-12 h-12 mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-bold text-primary mb-4">{category.category}</h3>
                  <div className="space-y-3">
                    {category.awards.map((award, awardIndex) => (
                      <div key={awardIndex} className="border-t pt-3">
                        <p className="text-lg font-semibold text-muted-foreground mb-1">{award.name}</p>
                        <p className="text-3xl font-bold text-primary">{award.count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-primary">
              Serving Youth Since 1987-88
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Premier Open Group operates under The Bharat Scouts and Guides 
              Karnataka from the historic Sri Jayachamarajendra Scouts and Guides Headquarters in Mysuru. 
              We are a proud part of India's largest voluntary, non-political educational movement for young people.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              With over 1,150+ Rajyapuraskar Awards and 600+ Rastrapathi Awards, we have consistently 
              demonstrated excellence in youth development. Through adventure, service, and character-building 
              activities, we prepare youth to take constructive roles in society as responsible citizens.
            </p>
            <Link to="/about">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Learn More About Us <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-muted">
              <img 
                src={logo} 
                alt="Premier Open Group Logo" 
                className="w-full h-full object-contain p-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-primary">Latest News</h2>
              <p className="text-lg text-muted-foreground">Stay updated with BSG activities and achievements</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-xl transition-shadow">
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                    <Link to="/news">
                      <Button variant="link" className="px-0">
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/news">
                <Button size="lg" variant="outline">View All News</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
