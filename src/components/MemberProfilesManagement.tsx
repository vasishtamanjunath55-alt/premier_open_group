import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Upload, User } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const CATEGORIES = [
  { value: 'founding_members', label: 'Founding Members' },
  { value: 'stalwarts', label: 'Stalwarts' },
  { value: 'contributors', label: 'Contributors' },
  { value: 'group_leaders', label: 'Group Leaders' },
  { value: 'cubs', label: 'Cubs' },
  { value: 'bulbuls', label: 'Bulbuls' },
  { value: 'scouts', label: 'Scouts' },
  { value: 'guides', label: 'Guides' },
  { value: 'rovers', label: 'Rovers' },
  { value: 'rangers', label: 'Rangers' },
  { value: 'leadership', label: 'Leadership Achievements' },
];

type MemberProfile = {
  id: string;
  name: string;
  role: string | null;
  category: string;
  photo_url: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export default function MemberProfilesManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberProfile | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'founding_members',
    photo_url: '',
    display_order: 0,
    published: true,
  });

  const queryClient = useQueryClient();

  const { data: memberProfiles, isLoading } = useQuery({
    queryKey: ['admin-member-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_profiles')
        .select('*')
        .order('category')
        .order('display_order');
      if (error) throw error;
      return data as MemberProfile[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('member_profiles')
          .update({
            name: data.name,
            role: data.role || null,
            category: data.category,
            photo_url: data.photo_url || null,
            display_order: data.display_order,
            published: data.published,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('member_profiles')
          .insert({
            name: data.name,
            role: data.role || null,
            category: data.category,
            photo_url: data.photo_url || null,
            display_order: data.display_order,
            published: data.published,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-profiles'] });
      toast.success(editingMember ? 'Member updated' : 'Member added');
      handleCloseModal();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save member');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('member_profiles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-profiles'] });
      toast.success('Member deleted');
    },
  });

  const handleEdit = (member: MemberProfile) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role || '',
      category: member.category,
      photo_url: member.photo_url || '',
      display_order: member.display_order,
      published: member.published,
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      category: 'founding_members',
      photo_url: '',
      display_order: 0,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setShowImageUpload(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingMember?.id,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProfiles = memberProfiles?.filter(
    (m) => filterCategory === 'all' || m.category === filterCategory
  );

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find((c) => c.value === value)?.label || value;
  };

  if (isLoading) {
    return <div className="p-4">Loading member profiles...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Member Profiles for About Page</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Filter by Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role || '-'}</TableCell>
                  <TableCell>{getCategoryLabel(member.category)}</TableCell>
                  <TableCell>{member.display_order}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        member.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {member.published ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit' : 'Add'} Member Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role/Title</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Group Leader, HWB (S)"
              />
            </div>

            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Photo</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {showImageUpload ? 'Enter URL' : 'Upload Photo'}
                </Button>
              </div>
              {showImageUpload ? (
                <ImageUpload
                  bucket="members"
                  onUploadComplete={(urls) => {
                    setFormData({ ...formData, photo_url: urls[0] });
                    setShowImageUpload(false);
                    toast.success('Photo uploaded!');
                  }}
                />
              ) : (
                <Input
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="Enter photo URL or upload"
                />
              )}
              {formData.photo_url && (
                <img
                  src={formData.photo_url}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label>Published</Label>
            </div>

            <Button type="submit" disabled={saveMutation.isPending} className="w-full">
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
