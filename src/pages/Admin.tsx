import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import FloatingAddButton from '@/components/FloatingAddButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Users, FileText, Award as AwardIcon, Image, Bell, UserCog, Send, Save, Check, X, UserPlus, Mail, ClipboardList, Eye, Key, UserCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ImageUpload from '@/components/ImageUpload';
import GalleryBatchUpload from '@/components/GalleryBatchUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import MemberProfilesManagement from '@/components/MemberProfilesManagement';

type ContentType = 'posts' | 'programs' | 'awards' | 'gallery' | 'notifications' | 'users' | 'members' | 'contacts' | 'registrations' | 'member_profiles';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ContentType>('posts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();

  // Queries for each content type
  const { data: posts } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: programs } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: async () => {
      const { data } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: awards } = useQuery({
    queryKey: ['admin-awards'],
    queryFn: async () => {
      const { data } = await supabase.from('awards').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: gallery } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });


  const { data: notifications } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: memberProgress } = useQuery({
    queryKey: ['admin-member-progress'],
    queryFn: async () => {
      const { data } = await supabase.from('member_progress').select('*');
      return data || [];
    },
  });

  const { data: memberNotifications } = useQuery({
    queryKey: ['admin-member-notifications'],
    queryFn: async () => {
      const { data } = await supabase.from('member_notifications').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: contactInquiries } = useQuery({
    queryKey: ['admin-contact-inquiries'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: memberRegistrations } = useQuery({
    queryKey: ['admin-member-registrations'],
    queryFn: async () => {
      const { data } = await supabase.from('member_registrations').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      const { error } = await supabase.from(table as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-awards'] });
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-member-progress'] });
      queryClient.invalidateQueries({ queryKey: ['admin-member-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contact-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-member-registrations'] });
      toast.success('Item deleted successfully');
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      const { error } = await supabase
        .from('member_progress')
        .upsert({ user_id: userId, ...data }, { onConflict: 'user_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-progress'] });
      toast.success('Progress updated');
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async ({ userId, title, message }: { userId: string; title: string; message: string }) => {
      const { error } = await supabase.from('member_notifications').insert({
        user_id: userId,
        title,
        message,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-notifications'] });
      toast.success('Notification sent');
    },
  });

  const handleDelete = (table: string, id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate({ table, id });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const renderContentList = (items: any[], table: string) => (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex-1">
              <h3 className="font-semibold">{item.title || item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.description || item.content}
              </p>
              <span className={`text-xs ${item.published ? 'text-green-600' : 'text-red-600'}`}>
                {item.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(table, item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all BSG website content</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentType)} className="space-y-6">
          <TabsList className="grid grid-cols-10 w-full">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Programs
            </TabsTrigger>
            <TabsTrigger value="awards" className="flex items-center gap-2">
              <AwardIcon className="w-4 h-4" />
              Awards
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Registrations
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <AwardIcon className="w-4 h-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="member_profiles" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              About Profiles
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">{posts && renderContentList(posts, 'posts')}</TabsContent>
          <TabsContent value="notifications">{notifications && renderContentList(notifications, 'notifications')}</TabsContent>
          <TabsContent value="programs">{programs && renderContentList(programs, 'programs')}</TabsContent>
          <TabsContent value="awards">{awards && renderContentList(awards, 'awards')}</TabsContent>
          <TabsContent value="gallery">
            <div className="mb-4">
              <Button
                onClick={() => setIsBatchUploadOpen(true)}
                variant="outline"
                className="w-full md:w-auto"
              >
                <Image className="w-4 h-4 mr-2" />
                Batch Upload Gallery Items
              </Button>
            </div>
            {gallery && renderContentList(gallery, 'gallery')}
          </TabsContent>
          
          <TabsContent value="contacts">
            <ContactInquiriesManagement inquiries={contactInquiries || []} />
          </TabsContent>
          <TabsContent value="registrations">
            <MemberRegistrationsManagement registrations={memberRegistrations || []} />
          </TabsContent>
          <TabsContent value="members">
            <MembersManagement 
              users={users || []} 
              memberProgress={memberProgress || []}
              memberNotifications={memberNotifications || []}
              onUpdateProgress={(userId, data) => updateProgressMutation.mutate({ userId, data })}
              onSendNotification={(userId, title, message) => sendNotificationMutation.mutate({ userId, title, message })}
              onDeleteNotification={(id) => handleDelete('member_notifications', id)}
            />
          </TabsContent>
          <TabsContent value="member_profiles">
            <MemberProfilesManagement />
          </TabsContent>
          <TabsContent value="users">
            <UsersManagement users={users || []} />
          </TabsContent>
        </Tabs>
      </div>

      {activeTab !== 'users' && activeTab !== 'members' && activeTab !== 'contacts' && activeTab !== 'registrations' && activeTab !== 'member_profiles' && <FloatingAddButton onClick={handleAdd} />}
      <ContentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentType={activeTab}
        editingItem={editingItem}
      />
      <GalleryBatchUpload
        isOpen={isBatchUploadOpen}
        onClose={() => setIsBatchUploadOpen(false)}
      />
    </div>
  );
}

// Members Management Component
function MembersManagement({ 
  users, 
  memberProgress, 
  memberNotifications,
  onUpdateProgress, 
  onSendNotification,
  onDeleteNotification,
}: {
  users: any[];
  memberProgress: any[];
  memberNotifications: any[];
  onUpdateProgress: (userId: string, data: any) => void;
  onSendNotification: (userId: string, title: string, message: string) => void;
  onDeleteNotification: (id: string) => void;
}) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingProgress, setEditingProgress] = useState<any>({});
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '' });

  const getUserProgress = (userId: string) => {
    return memberProgress.find(p => p.user_id === userId) || { badges_earned: 0, events_attended: 0, service_hours: 0 };
  };

  const getUserNotifications = (userId: string) => {
    return memberNotifications.filter(n => n.user_id === userId);
  };

  const handleEditProgress = (user: any) => {
    const progress = getUserProgress(user.id);
    setSelectedUser(user);
    setEditingProgress({
      badges_earned: progress.badges_earned,
      events_attended: progress.events_attended,
      service_hours: progress.service_hours,
    });
  };

  const handleSaveProgress = () => {
    if (selectedUser) {
      onUpdateProgress(selectedUser.id, editingProgress);
      setSelectedUser(null);
    }
  };

  const handleSendNotification = (userId: string) => {
    if (notificationForm.title && notificationForm.message) {
      onSendNotification(userId, notificationForm.title, notificationForm.message);
      setNotificationForm({ title: '', message: '' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Member Progress & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Badges</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.filter(u => u.role !== 'admin').map((user: any) => {
                const progress = getUserProgress(user.id);
                const notifications = getUserNotifications(user.id);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                    <TableCell>{progress.badges_earned}</TableCell>
                    <TableCell>{progress.events_attended}</TableCell>
                    <TableCell>{progress.service_hours}</TableCell>
                    <TableCell>{notifications.length}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditProgress(user)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Progress Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Progress Section */}
            <div className="space-y-4">
              <h4 className="font-semibold">Update Progress</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="badges">Badges</Label>
                  <Input
                    id="badges"
                    type="number"
                    value={editingProgress.badges_earned || 0}
                    onChange={(e) => setEditingProgress({ ...editingProgress, badges_earned: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="events">Events</Label>
                  <Input
                    id="events"
                    type="number"
                    value={editingProgress.events_attended || 0}
                    onChange={(e) => setEditingProgress({ ...editingProgress, events_attended: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={editingProgress.service_hours || 0}
                    onChange={(e) => setEditingProgress({ ...editingProgress, service_hours: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveProgress} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Progress
              </Button>
            </div>

            {/* Send Notification Section */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">Send Notification</h4>
              <div>
                <Label htmlFor="notif-title">Title</Label>
                <Input
                  id="notif-title"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                  placeholder="Notification title"
                />
              </div>
              <div>
                <Label htmlFor="notif-message">Message</Label>
                <Textarea
                  id="notif-message"
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                  placeholder="Notification message"
                />
              </div>
              <Button 
                onClick={() => selectedUser && handleSendNotification(selectedUser.id)} 
                className="w-full"
                disabled={!notificationForm.title || !notificationForm.message}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </div>

            {/* Sent Notifications */}
            {selectedUser && getUserNotifications(selectedUser.id).length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <h4 className="font-semibold text-sm">Sent Notifications</h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {getUserNotifications(selectedUser.id).map((notif: any) => (
                    <div key={notif.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <div>
                        <p className="font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.is_read ? 'Read' : 'Unread'}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => onDeleteNotification(notif.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Users Management Component
function UsersManagement({ users }: { users: any[] }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ email: '', password: '', fullName: '' });
  const [passwordResetUserId, setPasswordResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const queryClient = useQueryClient();

  const pendingUsers = users.filter(u => u.status === 'pending');
  const approvedUsers = users.filter(u => u.status === 'approved');
  const rejectedUsers = users.filter(u => u.status === 'rejected');

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update user status: ' + error.message);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
    },
    onError: (error: any) => {
      toast.error('Failed to delete user: ' + error.message);
    },
  });

  const handleApprove = (userId: string) => {
    updateStatusMutation.mutate({ userId, status: 'approved' });
  };

  const handleReject = (userId: string) => {
    updateStatusMutation.mutate({ userId, status: 'rejected' });
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordResetUserId || !newPassword) return;
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsResettingPassword(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            userId: passwordResetUserId,
            newPassword: newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      toast.success('Password reset successfully');
      setPasswordResetUserId(null);
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status as keyof typeof styles] || 'bg-muted'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Pending Users Alert */}
      {pendingUsers.length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {pendingUsers.length} Pending Registration{pendingUsers.length > 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(user.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(user.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* All Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.status !== 'approved' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600"
                              onClick={() => handleApprove(user.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Approve User</TooltipContent>
                        </Tooltip>
                      )}
                      {user.status !== 'rejected' && user.role !== 'admin' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-amber-600"
                              onClick={() => handleReject(user.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reject User</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setPasswordResetUserId(user.id)}
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reset Password</TooltipContent>
                        </Tooltip>
                      {user.role !== 'admin' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete User</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog open={!!passwordResetUserId} onOpenChange={() => { setPasswordResetUserId(null); setNewPassword(''); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Reset Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User</Label>
              <p className="text-sm text-muted-foreground">
                {users.find(u => u.id === passwordResetUserId)?.full_name || 'Unknown'}
              </p>
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                minLength={6}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Passwords cannot be viewed for security reasons. You can only set a new password.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setPasswordResetUserId(null); setNewPassword(''); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleResetPassword} 
                disabled={isResettingPassword || newPassword.length < 6}
              >
                {isResettingPassword ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Contact Inquiries Management Component
function ContactInquiriesManagement({ inquiries }: { inquiries: any[] }) {
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status, admin_notes })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-inquiries'] });
      toast.success('Inquiry updated');
      setSelectedInquiry(null);
    },
    onError: (error: any) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-inquiries'] });
      toast.success('Inquiry deleted');
    },
  });

  const handleView = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || '');
  };

  const handleUpdateStatus = (status: string) => {
    if (selectedInquiry) {
      updateStatusMutation.mutate({ id: selectedInquiry.id, status, admin_notes: adminNotes });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      unread: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800',
    };
    return <Badge className={styles[status] || 'bg-muted'}>{status}</Badge>;
  };

  const unreadCount = inquiries.filter(i => i.status === 'unread').length;

  return (
    <div className="space-y-6">
      {unreadCount > 0 && (
        <Card className="border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {unreadCount} New Message{unreadCount > 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry: any) => (
                <TableRow key={inquiry.id} className={inquiry.status === 'unread' ? 'bg-blue-50' : ''}>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>{inquiry.phone || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell>{new Date(inquiry.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleView(inquiry)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => {
                              if (confirm('Delete this inquiry?')) deleteMutation.mutate(inquiry.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View/Edit Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Inquiry</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Name</Label>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Email</Label>
                  <p className="font-medium">{selectedInquiry.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Phone</Label>
                  <p className="font-medium">{selectedInquiry.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Date</Label>
                  <p className="font-medium">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Message</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedInquiry.message}</p>
              </div>
              <div>
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Textarea 
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this inquiry..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleUpdateStatus('read')} disabled={updateStatusMutation.isPending}>
                  Mark as Read
                </Button>
                <Button variant="default" onClick={() => handleUpdateStatus('replied')} disabled={updateStatusMutation.isPending}>
                  Mark as Replied
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Member Registrations Management Component
function MemberRegistrationsManagement({ registrations }: { registrations: any[] }) {
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('member_registrations')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-registrations'] });
      toast.success('Registration updated');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('member_registrations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-registrations'] });
      toast.success('Registration deleted');
      setSelectedRegistration(null);
    },
  });

  const handleView = (reg: any) => {
    setSelectedRegistration(reg);
    setEditForm(reg);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (selectedRegistration) {
      updateMutation.mutate({ 
        id: selectedRegistration.id, 
        data: {
          registration_number: editForm.registration_number,
          section: editForm.section,
          name: editForm.name,
          father_name: editForm.father_name,
          mother_name: editForm.mother_name,
          date_of_birth: editForm.date_of_birth,
          blood_group: editForm.blood_group,
          mobile_no: editForm.mobile_no,
          email: editForm.email,
          communication_address: editForm.communication_address,
          permanent_address: editForm.permanent_address,
          alternate_contact: editForm.alternate_contact,
          school_college: editForm.school_college,
          status: editForm.status,
          admin_notes: editForm.admin_notes,
        }
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={styles[status] || 'bg-muted'}>{status}</Badge>;
  };

  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {pendingCount > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              {pendingCount} Pending Registration{pendingCount > 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Member Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg: any) => (
                <TableRow key={reg.id} className={reg.status === 'pending' ? 'bg-amber-50' : ''}>
                  <TableCell className="font-medium">{reg.name}</TableCell>
                  <TableCell className="capitalize">{reg.section}</TableCell>
                  <TableCell>{reg.mobile_no}</TableCell>
                  <TableCell>{reg.email}</TableCell>
                  <TableCell>{getStatusBadge(reg.status)}</TableCell>
                  <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleView(reg)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View/Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => {
                              if (confirm('Delete this registration?')) deleteMutation.mutate(reg.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View/Edit Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Member Registration</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Pencil className="w-4 h-4 mr-1" />
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Registration Number</Label>
                  {isEditing ? (
                    <Input 
                      value={editForm.registration_number || ''} 
                      onChange={(e) => setEditForm({...editForm, registration_number: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{selectedRegistration.registration_number || 'Not assigned'}</p>
                  )}
                </div>
                <div>
                  <Label>Section</Label>
                  {isEditing ? (
                    <Select value={editForm.section} onValueChange={(v) => setEditForm({...editForm, section: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bunny">Bunny</SelectItem>
                        <SelectItem value="cub">Cub</SelectItem>
                        <SelectItem value="bulbul">Bulbul</SelectItem>
                        <SelectItem value="scout">Scout</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="rover">Rover</SelectItem>
                        <SelectItem value="ranger">Ranger</SelectItem>
                        <SelectItem value="unit-leader">Unit Leader</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium capitalize">{selectedRegistration.section}</p>
                  )}
                </div>
                <div>
                  <Label>Name</Label>
                  {isEditing ? (
                    <Input 
                      value={editForm.name || ''} 
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{selectedRegistration.name}</p>
                  )}
                </div>
                <div>
                  <Label>Father's Name</Label>
                  {isEditing ? (
                    <Input 
                      value={editForm.father_name || ''} 
                      onChange={(e) => setEditForm({...editForm, father_name: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{selectedRegistration.father_name}</p>
                  )}
                </div>
                <div>
                  <Label>Mother's Name</Label>
                  {isEditing ? (
                    <Input 
                      value={editForm.mother_name || ''} 
                      onChange={(e) => setEditForm({...editForm, mother_name: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{selectedRegistration.mother_name}</p>
                  )}
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  {isEditing ? (
                    <Input 
                      type="date"
                      value={editForm.date_of_birth || ''} 
                      onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{new Date(selectedRegistration.date_of_birth).toLocaleDateString()}</p>
                  )}
                </div>
                <div>
                  <Label>Blood Group</Label>
                  {isEditing ? (
                    <Select value={editForm.blood_group} onValueChange={(v) => setEditForm({...editForm, blood_group: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{selectedRegistration.blood_group}</p>
                  )}
                </div>
                <div>
                  <Label>Mobile</Label>
                  {isEditing ? (
                    <Input 
                      value={editForm.mobile_no || ''} 
                      onChange={(e) => setEditForm({...editForm, mobile_no: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{selectedRegistration.mobile_no}</p>
                  )}
                </div>
                <div>
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={editForm.email || ''} 
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{selectedRegistration.email}</p>
                  )}
                </div>
                <div>
                  <Label>Alternate Contact</Label>
                  {isEditing ? (
                    <Input 
                      value={editForm.alternate_contact || ''} 
                      onChange={(e) => setEditForm({...editForm, alternate_contact: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{selectedRegistration.alternate_contact || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <Label>School/College</Label>
                  {isEditing ? (
                    <Input 
                      value={editForm.school_college || ''} 
                      onChange={(e) => setEditForm({...editForm, school_college: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium">{selectedRegistration.school_college || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <Label>Status</Label>
                  {isEditing ? (
                    <Select value={editForm.status} onValueChange={(v) => setEditForm({...editForm, status: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    getStatusBadge(selectedRegistration.status)
                  )}
                </div>
              </div>
              <div>
                <Label>Communication Address</Label>
                {isEditing ? (
                  <Textarea 
                    value={editForm.communication_address || ''} 
                    onChange={(e) => setEditForm({...editForm, communication_address: e.target.value})}
                    rows={2}
                  />
                ) : (
                  <p className="font-medium">{selectedRegistration.communication_address}</p>
                )}
              </div>
              <div>
                <Label>Permanent Address</Label>
                {isEditing ? (
                  <Textarea 
                    value={editForm.permanent_address || ''} 
                    onChange={(e) => setEditForm({...editForm, permanent_address: e.target.value})}
                    rows={2}
                  />
                ) : (
                  <p className="font-medium">{selectedRegistration.permanent_address}</p>
                )}
              </div>
              <div>
                <Label>Admin Notes</Label>
                {isEditing ? (
                  <Textarea 
                    value={editForm.admin_notes || ''} 
                    onChange={(e) => setEditForm({...editForm, admin_notes: e.target.value})}
                    placeholder="Add notes for this registration..."
                    rows={2}
                  />
                ) : (
                  <p className="font-medium">{selectedRegistration.admin_notes || 'No notes'}</p>
                )}
              </div>
              {isEditing && (
                <Button onClick={handleSave} disabled={updateMutation.isPending} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
              {!isEditing && (
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      updateMutation.mutate({ id: selectedRegistration.id, data: { status: 'approved' } });
                    }}
                    disabled={updateMutation.isPending || selectedRegistration.status === 'approved'}
                  >
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      updateMutation.mutate({ id: selectedRegistration.id, data: { status: 'rejected' } });
                    }}
                    disabled={updateMutation.isPending || selectedRegistration.status === 'rejected'}
                  >
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContentModal({ isOpen, onClose, contentType, editingItem }: any) {
  const [formData, setFormData] = useState<any>(editingItem || {});
  const [showImageUpload, setShowImageUpload] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const table = contentType === 'shop' ? 'shop_items' : contentType;
      
      if (editingItem) {
        const { error } = await supabase.from(table as any).update(data).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as any).insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-awards'] });
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['admin-shop'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      toast.success(editingItem ? 'Updated successfully' : 'Created successfully');
      onClose();
      setFormData({});
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add author_id for posts if creating new
    if (contentType === 'posts' && !editingItem) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        formData.author_id = user.id;
      }
    }
    
    saveMutation.mutate(formData);
  };

  const renderFormFields = () => {
    switch (contentType) {
      case 'posts':
        return (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={formData.content || ''} onChange={(e) => setFormData({...formData, content: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Image</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  {showImageUpload ? 'Enter URL Instead' : 'Upload Image'}
                </Button>
              </div>
              {showImageUpload ? (
                <ImageUpload
                  bucket="posts"
                  multiple={false}
                  onUploadComplete={(urls) => {
                    setFormData({...formData, image_url: urls[0]});
                    setShowImageUpload(false);
                  }}
                />
              ) : (
                <Input 
                  id="image_url" 
                  value={formData.image_url || ''} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Enter image URL or click 'Upload Image'"
                />
              )}
              {formData.image_url && !showImageUpload && (
                <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-md" />
              )}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.category || 'news'} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.published ?? true} onCheckedChange={(checked) => setFormData({...formData, published: checked})} />
              <Label>Published</Label>
            </div>
          </>
        );
      case 'notifications':
        return (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={formData.content || ''} onChange={(e) => setFormData({...formData, content: e.target.value})} required />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.published ?? true} onCheckedChange={(checked) => setFormData({...formData, published: checked})} />
              <Label>Published</Label>
            </div>
          </>
        );
      case 'programs':
        return (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="age_group">Age Group</Label>
              <Input id="age_group" value={formData.age_group || ''} onChange={(e) => setFormData({...formData, age_group: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" value={formData.duration || ''} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Image</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  {showImageUpload ? 'Enter URL Instead' : 'Upload Image'}
                </Button>
              </div>
              {showImageUpload ? (
                <ImageUpload
                  bucket="programs"
                  multiple={false}
                  onUploadComplete={(urls) => {
                    setFormData({...formData, image_url: urls[0]});
                    setShowImageUpload(false);
                  }}
                />
              ) : (
                <Input 
                  id="image_url" 
                  value={formData.image_url || ''} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Enter image URL or click 'Upload Image'"
                />
              )}
              {formData.image_url && !showImageUpload && (
                <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-md" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.published ?? true} onCheckedChange={(checked) => setFormData({...formData, published: checked})} />
              <Label>Published</Label>
            </div>
          </>
        );
      case 'awards':
        return (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Badge Image</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  {showImageUpload ? 'Enter URL Instead' : 'Upload Image'}
                </Button>
              </div>
              {showImageUpload ? (
                <ImageUpload
                  bucket="awards"
                  multiple={false}
                  onUploadComplete={(urls) => {
                    setFormData({...formData, badge_image_url: urls[0]});
                    setShowImageUpload(false);
                  }}
                />
              ) : (
                <Input 
                  id="badge_image_url" 
                  value={formData.badge_image_url || ''} 
                  onChange={(e) => setFormData({...formData, badge_image_url: e.target.value})}
                  placeholder="Enter badge image URL or click 'Upload Image'"
                />
              )}
              {formData.badge_image_url && !showImageUpload && (
                <img src={formData.badge_image_url} alt="Preview" className="w-full h-32 object-cover rounded-md" />
              )}
            </div>
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea id="requirements" value={formData.requirements || ''} onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.published ?? true} onCheckedChange={(checked) => setFormData({...formData, published: checked})} />
              <Label>Published</Label>
            </div>
          </>
        );
      case 'gallery':
        return (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="description">Caption/Description</Label>
              <Textarea id="description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Image</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  {showImageUpload ? 'Enter URL Instead' : 'Upload Images'}
                </Button>
              </div>
              {showImageUpload ? (
                <ImageUpload
                  bucket="gallery"
                  multiple={true}
                  maxFiles={10}
                  onUploadComplete={(urls) => {
                    setFormData({...formData, image_url: urls[0]});
                    setShowImageUpload(false);
                    toast.success('Image uploaded! Add more items to upload additional images.');
                  }}
                />
              ) : (
                <Input 
                  id="image_url" 
                  value={formData.image_url || ''} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Enter image URL or click 'Upload Images'"
                  required
                />
              )}
              {formData.image_url && !showImageUpload && (
                <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-md" />
              )}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.published ?? true} onCheckedChange={(checked) => setFormData({...formData, published: checked})} />
              <Label>Published</Label>
            </div>
          </>
        );
      default:
        return <p className="text-muted-foreground">Content management form for {contentType}</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add'} {contentType}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
