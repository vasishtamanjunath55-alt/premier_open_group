import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, Award, FileText, Bell, Check } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { format } from 'date-fns';

function MemberDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: progress } = useQuery({
    queryKey: ['member-progress', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('member_progress')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: memberNotifications } = useQuery({
    queryKey: ['member-notifications', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('member_notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: latestNews } = useQuery({
    queryKey: ['member-news'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('member_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-notifications'] });
    },
  });

  const unreadCount = memberNotifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Welcome, {profile?.full_name || 'Scout Member'}!
            </h1>
            <p className="text-muted-foreground">Your BSG member dashboard</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    My Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
                      <User className="w-12 h-12 text-primary-foreground" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{profile?.full_name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>

                    {profile?.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Member since {format(new Date(profile?.created_at || new Date()), 'MMM yyyy')}</span>
                    </div>

                    <div className="pt-4 border-t">
                      <Badge variant="secondary" className="text-sm">
                        {profile?.role === 'admin' ? 'Admin' : 'Member'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    My Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Badges Earned</span>
                    <span className="text-2xl font-bold text-primary">{progress?.badges_earned || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Events Attended</span>
                    <span className="text-2xl font-bold text-primary">{progress?.events_attended || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Service Hours</span>
                    <span className="text-2xl font-bold text-primary">{progress?.service_hours || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Notifications */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    My Notifications
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">{unreadCount}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {memberNotifications && memberNotifications.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {memberNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 rounded-lg border ${notification.is_read ? 'bg-muted/50' : 'bg-primary/5 border-primary/20'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-primary' : ''}`}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(notification.created_at), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            {!notification.is_read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4 text-sm">
                      No notifications yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Latest Updates */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Latest Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {latestNews && latestNews.length > 0 ? (
                    <div className="space-y-4">
                      {latestNews.map((post) => (
                        <div key={post.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-4">
                            {post.image_url && (
                              <img 
                                src={post.image_url} 
                                alt={post.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{post.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{post.category}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(post.created_at), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No updates available at the moment.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function Member() {
  return (
    <ProtectedRoute>
      <MemberDashboard />
    </ProtectedRoute>
  );
}
