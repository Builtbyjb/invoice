import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function DownloadButton({ children = "Download App", ...props }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button {...props} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogDescription>Still in development.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setOpen(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
