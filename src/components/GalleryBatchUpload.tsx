import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';
import { X } from 'lucide-react';

interface GalleryBatchUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GalleryItem {
  image_url: string;
  title: string;
  description: string;
  category: string;
  published: boolean;
}

export default function GalleryBatchUpload({ isOpen, onClose }: GalleryBatchUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [globalCategory, setGlobalCategory] = useState('');
  const [globalPublished, setGlobalPublished] = useState(true);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (items: GalleryItem[]) => {
      const { error } = await supabase.from('gallery').insert(items);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success(`${galleryItems.length} gallery items created successfully`);
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create gallery items');
    },
  });

  const handleUploadComplete = (urls: string[]) => {
    setUploadedImages(urls);
    setGalleryItems(urls.map(url => ({
      image_url: url,
      title: '',
      description: '',
      category: globalCategory,
      published: globalPublished,
    })));
  };

  const updateItem = (index: number, field: keyof GalleryItem, value: any) => {
    setGalleryItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setGalleryItems(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const applyGlobalSettings = () => {
    setGalleryItems(prev => prev.map(item => ({
      ...item,
      category: globalCategory,
      published: globalPublished,
    })));
    toast.success('Global settings applied to all items');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all items have titles
    const missingTitles = galleryItems.some(item => !item.title.trim());
    if (missingTitles) {
      toast.error('All items must have a title');
      return;
    }

    saveMutation.mutate(galleryItems);
  };

  const handleClose = () => {
    setUploadedImages([]);
    setGalleryItems([]);
    setGlobalCategory('');
    setGlobalPublished(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Batch Upload Gallery Items</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {galleryItems.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload multiple images at once. You'll be able to add titles, descriptions, and categories for each image.
              </p>
              <ImageUpload
                bucket="gallery"
                multiple={true}
                maxFiles={20}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          ) : (
            <>
              {/* Global Settings */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-sm">Apply to All Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="global-category">Category</Label>
                    <Input
                      id="global-category"
                      value={globalCategory}
                      onChange={(e) => setGlobalCategory(e.target.value)}
                      placeholder="e.g., Events, Training, Camping"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={globalPublished}
                        onCheckedChange={setGlobalPublished}
                      />
                      <Label>Published</Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applyGlobalSettings}
                    >
                      Apply to All
                    </Button>
                  </div>
                </div>
              </div>

              {/* Individual Items */}
              <div className="space-y-4">
                <h3 className="font-semibold">Gallery Items ({galleryItems.length})</h3>
                {galleryItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex gap-4">
                      <img
                        src={item.image_url}
                        alt={`Gallery item ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label htmlFor={`title-${index}`}>
                            Title <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`title-${index}`}
                            value={item.title}
                            onChange={(e) => updateItem(index, 'title', e.target.value)}
                            placeholder="Enter a title for this image"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`description-${index}`}>Caption/Description</Label>
                          <Textarea
                            id={`description-${index}`}
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Add a caption or description"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`category-${index}`}>Category</Label>
                            <Input
                              id={`category-${index}`}
                              value={item.category}
                              onChange={(e) => updateItem(index, 'category', e.target.value)}
                              placeholder="Category"
                            />
                          </div>
                          <div className="flex items-end">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.published}
                                onCheckedChange={(checked) => updateItem(index, 'published', checked)}
                              />
                              <Label>Published</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Creating...' : `Create ${galleryItems.length} Items`}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
