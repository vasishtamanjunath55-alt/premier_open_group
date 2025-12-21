import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Heart, Users, Award, Globe } from 'lucide-react';
import groupPhoto from '@/assets/group-photo.jpg';
import pandaLogo from '@/assets/logo.png';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
     {/* Hero Section */}
<section className="relative w-full h-[500px]">
  <img 
    src={groupPhoto}
    alt="Premier Open Group"
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
    <div className="text-center text-white px-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">About Us</h1>
      <p className="text-xl md:text-2xl">
        Serving the youth of Karnataka since 1987-88
      </p>
    </div>
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
            {[
              'Shri. Girish Rao',
              'Shri. Ramprasad K',
              'Shri. A M Shankar',
              'Shri. Subramanya',
              'Shri Udaykuamr',
              'Shri. Rangaswamy',
              'Shri. Girish Kumar',
              'Shri. Shyam Sudar Kustagi',
              'Smt. Sharadaraju',
              'Smt. Roopashree'
            ].map((name, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                    <img src={pandaLogo} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-sm">{name}</h3>
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
            {[
              'Girish Rao',
              'Ramprasad K',
              'R P Chandru'
            ].map((name, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-background">
                    <img src={pandaLogo} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold">{name}</h3>
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
            {[
              { name: 'A M Shankar', role: 'Leader Trainer (R)' },
              { name: 'H G Lakshmi Narayan Rao', role: 'ALT (C)' },
              { name: 'N Ashok Kumar', role: 'ALT (R)' },
              { name: 'Divakar', role: '' }
            ].map((person, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                    <img src={pandaLogo} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold mb-1">{person.name}</h3>
                  {person.role && <p className="text-sm text-muted-foreground">{person.role}</p>}
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
            {[
              'Girish Rao',
              'R P Chandru'
            ].map((name, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-background">
                    <img src={pandaLogo} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold">{name}</h3>
                  <p className="text-muted-foreground mt-2">Group Leader</p>
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
                  {[
                    { name: 'Naveen Kumar', role: 'HWB (C)' },
                    { name: 'Manu', role: 'ADV(C)' },
                    { name: 'Yashas', role: 'BASIC (C)' }
                  ].map((person, index) => (
                    <Card key={index} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <img src={pandaLogo} alt={person.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold">{person.name}</h5>
                            <p className="text-sm text-muted-foreground">{person.role}</p>
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
                  {[
                    { name: 'Shashikala', role: 'PRE-ALT (FL)' },
                    { name: 'Bhavyashree R', role: 'ADV(FL)' }
                    
                  ].map((person, index) => (
                    <Card key={index} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <img src={pandaLogo} alt={person.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold">{person.name}</h5>
                            <p className="text-sm text-muted-foreground">{person.role}</p>
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
                  {[
                    { name: 'R P Chandru', role: 'HWB (S)' },
                    { name: 'Emmanuel Samson A', role: 'HWB (S)' },
                    { name: 'Ajay S', role: 'BASIC (S)' }
                  ].map((person, index) => (
                    <Card key={index} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <img src={pandaLogo} alt={person.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold">{person.name}</h5>
                            <p className="text-sm text-muted-foreground">{person.role}</p>
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
                  {[
                    { name: 'Maria Leena', role: 'ADV (GC)' }
                    
                  ].map((person, index) => (
                    <Card key={index} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <img src={pandaLogo} alt={person.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold">{person.name}</h5>
                            <p className="text-sm text-muted-foreground">{person.role}</p>
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
                  {[
                    { name: 'Chandru P', role: 'HWB (R)' },
                    { name: 'Vishnu Prasad B G', role: 'HWB (R)' }
                  ].map((person, index) => (
                    <Card key={index} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <img src={pandaLogo} alt={person.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold">{person.name}</h5>
                            <p className="text-sm text-muted-foreground">{person.role}</p>
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
                  {[
                    { name: 'Tejaswini S', role: 'BASIC (RL)' },
                    { name: 'Anne L', role: 'BASIC (RL)' }
                  ].map((person, index) => (
                    <Card key={index} className="hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <img src={pandaLogo} alt={person.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold">{person.name}</h5>
                            <p className="text-sm text-muted-foreground">{person.role}</p>
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
            {[
              { name: 'R P Chandru', role: 'District Organizer' },
              { name: 'Suprith', role: 'SW RLY' },
              { name: 'Chandru P', role: 'ASOC' },
              { name: 'Sukesh', role: 'SW RLY' },
              { name: 'Manu', role: 'SGV' },
              { name: 'Vishnuprasad B G', role: 'SW RLY' }
            ].map((person, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                    <img src={pandaLogo} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{person.name}</h3>
                  <p className="text-sm text-muted-foreground">{person.role}</p>
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
                  and committed to making a positive difference in their communities and the nation.
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
                  Integrity, respect, care for others, belief in self, and cooperation. 
                  We promote physical, intellectual, emotional, social and spiritual development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Awards Statistics */}
      <section className="py-20 container mx-auto px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-primary text-center">Awards & Recognition</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Rajyapuraskar Awards */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <h3 className="text-3xl font-bold text-center mb-8 text-primary">Rajyapuraskar Award</h3>
                <div className="space-y-4">
                  {[
                    { category: 'Cubs', count: '25+' },
                    { category: 'Bulbuls', count: '15+' },
                    { category: 'Scouts', count: '650+' },
                    { category: 'Guides', count: '340+' },
                    { category: 'Rovers', count: '70+' },
                    { category: 'Rangers', count: '50+' }
                  ].map((award, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <span className="font-semibold">{award.category}</span>
                      <span className="text-2xl font-bold text-primary">{award.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rastrapathi Awards */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <h3 className="text-3xl font-bold text-center mb-8 text-primary">Rastrapathi Award</h3>
                <div className="space-y-4">
                  {[
                    { category: 'Scouts', count: '325+' },
                    { category: 'Guides', count: '235+' },
                    { category: 'Rovers', count: '32+' },
                    { category: 'Rangers', count: '16+' }
                  ].map((award, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <span className="font-semibold">{award.category}</span>
                      <span className="text-2xl font-bold text-primary">{award.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Weekly Classes & Meetings */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-primary">Weekly Classes & Meetings</h2>
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="pt-8">
              <p className="text-2xl font-semibold mb-4">Every Sunday</p>
              <p className="text-xl text-muted-foreground mb-4">10:30 AM - 1:00 PM</p>
              <p className="text-lg text-muted-foreground">Weekly Group Meeting Held at DHQ, Mysuru</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
