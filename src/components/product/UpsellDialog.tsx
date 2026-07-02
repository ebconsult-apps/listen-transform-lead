import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UpsellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The server's 402 message, shown verbatim (quota, credits, or cost cap). */
  message: string;
}

/**
 * The friendly upgrade moment when a run is refused with HTTP 402 — instead of a
 * raw error toast. Copy stays limit-generic because several distinct 402s funnel
 * here (free-run quota, out of credits, monthly cost cap) and the right next step
 * is the same: look at the plans.
 */
export default function UpsellDialog({ open, onOpenChange, message }: UpsellDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>You've hit this month's limit</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-foreground/60">
          Paid plans include monthly report credits — each one unlocks a project's full
          report, plus Experiment and Research on it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to="/pricing" className="btn-primary" onClick={() => onOpenChange(false)}>
            See plans
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <button className="btn-secondary" onClick={() => onOpenChange(false)}>
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
