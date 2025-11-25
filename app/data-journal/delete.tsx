"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteJournal } from "@/app/store/journalStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteJournalButtonProps {
  journalId: string;
  onSuccess?: () => void;
}

export function DeleteJournal({ journalId, onSuccess }: DeleteJournalButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteJournal(journalId);
      if (res.status) {
        toast.success("Journal berhasil dihapus!");
        setOpen(false);
        if (onSuccess) onSuccess(); // <-- panggil callback dari parent
      } else {
        toast.error(res.message || "Gagal menghapus journal");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus journal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Journal?</AlertDialogTitle>
          <AlertDialogDescription>
            Data journal akan dihapus secara permanen. Apakah kamu yakin?
          </AlertDialogDescription>
        </AlertDialogHeader>
       <div className="flex justify-end gap-2 mt-4">
  <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
  <Button
    onClick={handleDelete} // async
    disabled={loading}
    className="flex items-center gap-2"
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {loading ? "Menghapus..." : "Hapus"}
  </Button>
</div>

      </AlertDialogContent>
    </AlertDialog>
  );
}
