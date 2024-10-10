import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type LogoutDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const LogoutDialog = ({ isOpen, onOpenChange }: LogoutDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="You will be logged out of the application.">
        <DialogHeader>
          <DialogTitle>Logging Out</DialogTitle>
        </DialogHeader>
        <LoadingSpinner className="w-12 h-12" />
      </DialogContent>
    </Dialog>
  );
};
