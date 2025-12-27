import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  bucket: string;
  onUploadComplete: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export default function ImageUpload({ 
  bucket, 
  onUploadComplete, 
  multiple = true,
  maxFiles = 10 
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];
    
    const validFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Only JPG, PNG, WEBP, and GIF images are allowed`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File size must be less than 5MB`);
        return;
      }
      validFiles.push(file);
    });

    return validFiles;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    const filesToAdd = multiple ? validFiles.slice(0, maxFiles) : [validFiles[0]];
    
    if (filesToAdd.length + previews.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const newPreviews = filesToAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
  }, [previews, multiple, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadImages = async () => {
    if (previews.length === 0) {
      toast.error('Please select images to upload');
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      for (const { file } of previews) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully`);
      onUploadComplete(uploadedUrls);
      
      // Clean up
      previews.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setPreviews([]);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <p className="text-lg font-medium mb-1">
              Drag and drop {multiple ? 'images' : 'an image'} here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse (JPG, PNG, WEBP, GIF • Max 5MB each)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Select {multiple ? 'Images' : 'Image'}
            </Button>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">
              {previews.length} image{previews.length > 1 ? 's' : ''} selected
            </p>
            <Button
              type="button"
              onClick={uploadImages}
              disabled={uploading}
              size="sm"
            >
              {uploading ? 'Uploading...' : 'Upload All'}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previews.map((item, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
              >
                <img
                  src={item.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs text-white truncate">{item.file.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
