import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRIVACY_POLICY_VERSION, PrivacyPolicyContent } from "@/content/privacy-policy";

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Read-only modal that shows the current Privacy Policy text in the setup flow. */
export default function PrivacyPolicyDialog({ open, onOpenChange }: PrivacyPolicyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>Version {PRIVACY_POLICY_VERSION}</DialogDescription>
        </DialogHeader>
        <PrivacyPolicyContent />
      </DialogContent>
    </Dialog>
  );
}
