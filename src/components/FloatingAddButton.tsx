import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow z-40 transition-all hover:scale-110"
      size="icon"
    >
      <Plus className="w-8 h-8" />
    </Button>
  );
}
