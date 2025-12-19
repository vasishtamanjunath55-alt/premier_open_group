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
import { Pencil, Trash2, Users, FileText, Award as AwardIcon, Image, Bell, UserCog, Send, Save, Check, X, UserPlus } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ImageUpload from '@/components/ImageUpload';
import GalleryBatchUpload from '@/components/GalleryBatchUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ContentType = 'posts' | 'programs' | 'awards' | 'gallery' | 'notifications' | 'users' | 'members';

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
          <TabsList className="grid grid-cols-7 w-full">
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
            <TabsTrigger value="members" className="flex items-center gap-2">
              <AwardIcon className="w-4 h-4" />
              Members
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
          <TabsContent value="users">
            <UsersManagement users={users || []} />
          </TabsContent>
        </Tabs>
      </div>

      {activeTab !== 'users' && activeTab !== 'members' && <FloatingAddButton onClick={handleAdd} />}
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
