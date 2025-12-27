import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Heart, Users, Award, Globe, User } from 'lucide-react';
import groupPhoto from '@/assets/group-photo.jpg';

type MemberProfile = {
  id: string;
  name: string;
  role: string | null;
  category: string;
  photo_url: string | null;
  display_order: number;
};

export default function About() {
  const { data: memberProfiles } = useQuery({
    queryKey: ['member-profiles'],
    queryFn: async () => {
      const { data } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('published', true)
        .order('display_order');
      return (data || []) as MemberProfile[];
    },
  });

  const getMembersByCategory = (category: string) => {
    return memberProfiles?.filter((m) => m.category === category) || [];
  };

  const renderMemberPhoto = (member: MemberProfile, size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    const sizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-24 h-24',
      lg: 'w-32 h-32',
      xl: 'w-40 h-40',
    };

    if (member.photo_url) {
      return (
        <img
          src={member.photo_url}
          alt={member.name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      );
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center`}>
        <User className="w-1/2 h-1/2 text-muted-foreground" />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
<section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
    <img
      src={groupPhoto}
      alt="Premier Open Group members"
      className="w-full h-full object-contain bg-black"
    />
    <div className="absolute inset-0 bg-gradient-primary/40"></div>
  </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">About Us</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Serving the youth of Karnataka since 1987-88
          </p>
        </div>
      </section>

      {/* Establishment Info */}
      <section className="py-20 container mx-auto px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Establishment of Premier Open Group</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="text-6xl font-bold text-primary mb-4">1986</div>
                <h3 className="text-2xl font-semibold mb-2">Scout Group Started</h3>
                <p className="text-muted-foreground">16th December 1986 (39 Years)</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="text-6xl font-bold text-primary mb-4">1989</div>
                <h3 className="text-2xl font-semibold mb-2">Guide Group Started</h3>
                <p className="text-muted-foreground">(36 Years)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founding Members */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Founding Members</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {getMembersByCategory('founding_members').map((member) => (
              <Card key={member.id} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4">
                    {renderMemberPhoto(member, 'md')}
                  </div>
                  <h3 className="font-semibold text-sm">{member.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stalwarts */}
      <section className="py-20 container mx-auto px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Stalwarts</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {getMembersByCategory('stalwarts').map((member) => (
              <Card key={member.id} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="mx-auto mb-4 flex justify-center">
                    {renderMemberPhoto(member, 'lg')}
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Contributors</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {getMembersByCategory('contributors').map((member) => (
              <Card key={member.id} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex justify-center">
                    {renderMemberPhoto(member, 'md')}
                  </div>
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Group Leaders */}
      <section className="py-20 container mx-auto px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Group Leaders</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {getMembersByCategory('group_leaders').map((member) => (
              <Card key={member.id} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="mx-auto mb-4 flex justify-center">
                    {renderMemberPhoto(member, 'xl')}
                  </div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-muted-foreground mt-2">{member.role || 'Group Leader'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Current Members by Category */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Current Members</h2>
          
          {/* Cubs & Bulbuls */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-8 text-secondary text-center">Cubs & Bulbuls</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-primary">Cubs</h4>
                <div className="grid grid-cols-1 gap-4">
                  {getMembersByCategory('cubs').map((member) => (
                    <Card key={member.id} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {renderMemberPhoto(member, 'sm')}
                          </div>
                          <div>
                            <h5 className="font-bold">{member.name}</h5>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4 text-primary">Bulbuls</h4>
                <div className="grid grid-cols-1 gap-4">
                  {getMembersByCategory('bulbuls').map((member) => (
                    <Card key={member.id} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {renderMemberPhoto(member, 'sm')}
                          </div>
                          <div>
                            <h5 className="font-bold">{member.name}</h5>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scouts & Guides */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-8 text-secondary text-center">Scouts & Guides</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-primary">Scouts</h4>
                <div className="grid grid-cols-1 gap-4">
                  {getMembersByCategory('scouts').map((member) => (
                    <Card key={member.id} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {renderMemberPhoto(member, 'sm')}
                          </div>
                          <div>
                            <h5 className="font-bold">{member.name}</h5>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4 text-primary">Guides</h4>
                <div className="grid grid-cols-1 gap-4">
                  {getMembersByCategory('guides').map((member) => (
                    <Card key={member.id} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {renderMemberPhoto(member, 'sm')}
                          </div>
                          <div>
                            <h5 className="font-bold">{member.name}</h5>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rovers & Rangers */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-8 text-secondary text-center">Rovers & Rangers</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-primary">Rovers</h4>
                <div className="grid grid-cols-1 gap-4">
                  {getMembersByCategory('rovers').map((member) => (
                    <Card key={member.id} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {renderMemberPhoto(member, 'sm')}
                          </div>
                          <div>
                            <h5 className="font-bold">{member.name}</h5>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4 text-primary">Rangers</h4>
                <div className="grid grid-cols-1 gap-4">
                  {getMembersByCategory('rangers').map((member) => (
                    <Card key={member.id} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {renderMemberPhoto(member, 'sm')}
                          </div>
                          <div>
                            <h5 className="font-bold">{member.name}</h5>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Achievements */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Leadership Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {getMembersByCategory('leadership').map((member) => (
              <Card key={member.id} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex justify-center">
                    {renderMemberPhoto(member, 'lg')}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To contribute to the education of young people through a value system based on 
                  the Scout Promise and Law, helping them realize their full potential and become 
                  responsible citizens.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To create a better world where young people are self-fulfilled, responsible, 
                  and active citizens who play constructive roles in their communities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Integrity, Respect, Care, and Belief in the potential of every young person 
                  to make a positive difference in society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Awards Statistics */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Awards & Achievements</h2>
          
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-secondary text-center">Rajyapuraskar Awards</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { category: 'Cubs', count: 54 },
                { category: 'Bulbuls', count: 18 },
                { category: 'Scouts', count: 51 },
                { category: 'Guides', count: 20 },
              ].map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Award className="w-12 h-12 text-scout-gold mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">{item.count}</div>
                    <p className="text-muted-foreground">{item.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-secondary text-center">Rastrapathi Awards</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { category: 'Scouts', count: 5 },
                { category: 'Guides', count: 3 },
                { category: 'Rovers', count: 4 },
                { category: 'Rangers', count: 2 },
              ].map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Award className="w-12 h-12 text-saffron-orange mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">{item.count}</div>
                    <p className="text-muted-foreground">{item.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Activities */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Weekly Classes & Meetings</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 justify-center">
              <Globe className="w-8 h-8" />
              <span className="text-xl">Every Sunday</span>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Users className="w-8 h-8" />
              <span className="text-xl">10:30 AM - 1:00 PM</span>
            </div>
          </div>
          <p className="mt-6 text-lg opacity-90">
            at Sri Jayachamarajendra Scouts & Guides Headquarters, Mysuru
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
