"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { convertModalToIDR } from "@/lib/currencyConverter";
import { createJournal, updateJournal } from "@/app/store/journalStore";
import { toast } from "sonner";
import { Journal } from "@/app/type/journal";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface JournalFormModalProps {
  mode: "create" | "edit";
  journal?: Journal;
  triggerText: string;
  onSuccess?: () => void;
}

export default function Form({
  mode,
  journal,
  triggerText,
  onSuccess,
}: JournalFormModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convertedModal, setConvertedModal] = useState<string>("");
  const router = useRouter();

  const [form, setForm] = useState({
    modal: "",
    modal_type: "",
    tanggal: "",
    pair: "",
    side: "",
    lot: "",
    harga_entry: "",
    harga_take_profit: "",
    harga_stop_loss: "",
    reason: "",
    win_lose: "",
    profit: "",
    analisaBefore: null as File | null,
    analisaAfter: null as File | null,
  });

  // === Populate form when editing ===
  useEffect(() => {
    if (mode === "edit" && journal) {
      setForm({
        modal: journal.modal?.toString() ?? "",
        modal_type: journal.modal_type ?? "",
        tanggal: journal.tanggal ?? "",
        pair: journal.pair ?? "",
        side: journal.side ?? "",
        lot: journal.lot?.toString() ?? "",
        harga_entry: journal.harga_entry?.toString() ?? "",
        harga_take_profit: journal.harga_take_profit?.toString() ?? "",
        harga_stop_loss: journal.harga_stop_loss?.toString() ?? "",
        reason: journal.reason ?? "",
        win_lose: journal.win_lose ?? "",
        profit: journal.profit?.toString() ?? "",
        analisaBefore: null,
        analisaAfter: null,
      });
    }
  }, [mode, journal]);

  // === Auto convert modal when value or type changes ===
  useEffect(() => {
    const doConvert = async () => {
      if (!form.modal || !form.modal_type) {
        setConvertedModal("");
        return;
      }

      if (form.modal_type === "idr") {
        setConvertedModal("");
        return;
      }

      try {
        const result = await convertModalToIDR(
          Number(form.modal),
          form.modal_type as any
        );
        setConvertedModal("≈ Rp " + result.toLocaleString("id-ID"));
      } catch (err) {
        setConvertedModal("");
      }
    };

    doConvert();
  }, [form.modal, form.modal_type]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (
    name: "analisaBefore" | "analisaAfter",
    file: File | null
  ) => {
    setForm({ ...form, [name]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalModal = form.modal;

      if (form.modal_type === "usc" || form.modal_type === "usd") {
        const result = await convertModalToIDR(
          Number(form.modal),
          form.modal_type as any
        );
        finalModal = result.toString();
      }

      const body = {
        ...form,
        modal: form.modal,
        modal_type: form.modal_type,
      };

      if (mode === "create") {
        await createJournal(body as any);
        toast.success("Journal added successfully!");
      } else {
        if (!journal?.id) throw new Error("Missing journal ID");
        await updateJournal(journal.id, body as any);
        toast.success("Journal updated successfully!");
      }

      if (onSuccess) onSuccess();
      setOpen(false);
      router.push("/data-journal");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit journal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Journal" : "Edit Journal"}
          </DialogTitle>
        </DialogHeader>

        <Card className="mt-2 border rounded-xl bg-background shadow-sm">
          <CardContent className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Row 1 - Modal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Modal</Label>
                  <Input
                    name="modal"
                    value={form.modal}
                    onChange={handleChange}
                    placeholder="ex: 2000"
                    className="mt-1"
                  />
                  {convertedModal && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {convertedModal}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Tipe Modal</Label>
                  <select
                    name="modal_type"
                    value={form.modal_type}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border bg-background p-2"
                  >
                    <option value="">Pilih</option>
                    <option value="usd">USD</option>
                    <option value="usc">US Cent</option>
                    <option value="idr">IDR</option>
                  </select>
                </div>

                <div>
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Pair</Label>
                   <select
                    name="pair"
                    value={form.pair}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border bg-background p-2"
                    required
                  >
                    <option value="">Pilih</option>
                    <option value="XAUUSD">XAUUSD</option>
                    <option value="BTCUSD">BTCUSD</option>
                  </select>
                </div>

                <div>
                  <Label>Side</Label>
                  <select
                    name="side"
                    value={form.side}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border bg-background p-2"
                    required
                  >
                    <option value="">Pilih</option>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Entry</Label>
                  <Input
                    name="harga_entry"
                    value={form.harga_entry}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Take Profit</Label>
                  <Input
                    name="harga_take_profit"
                    value={form.harga_take_profit}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Stop Loss</Label>
                  <Input
                    name="harga_stop_loss"
                    value={form.harga_stop_loss}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Lot */}
              <div>
                <Label>Lot</Label>
                <Input
                  name="lot"
                  value={form.lot}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Reason */}
              <div>
                <Label>Reason</Label>
                <Textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className="min-h-[90px] mt-1"
                />
              </div>

              {/* Win / Lose */}
              <div>
                <Label>Hasil</Label>
                <select
                  name="win_lose"
                  value={form.win_lose}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border bg-background p-2"
                >
                  <option value="">Pilih Hasil</option>
                  <option value="win">Win</option>
                  <option value="lose">Lose</option>
                  <option value="draw">Draw</option>
                </select>
              </div>

              {/* Profit */}
              <div>
                <Label>Profit</Label>
                <Input
                  name="profit"
                  value={form.profit}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Photos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Analisa Sebelum</Label>
                  <label
                    htmlFor="analisa-before"
                    className="mt-2 flex items-center justify-center border rounded-lg p-3 cursor-pointer bg-muted hover:bg-muted/70 text-sm"
                  >
                    {form.analisaBefore
                      ? form.analisaBefore.name
                      : "Pilih Gambar"}
                  </label>
                  <input
                    id="analisa-before"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFile("analisaBefore", e.target.files?.[0] || null)
                    }
                  />

                  {form.analisaBefore && (
                    <img
                      src={URL.createObjectURL(form.analisaBefore)}
                      className="mt-2 h-32 rounded border object-cover"
                    />
                  )}
                </div>

                <div>
                  <Label>Analisa Sesudah</Label>
                  <label
                    htmlFor="analisa-after"
                    className="mt-2 flex items-center justify-center border rounded-lg p-3 cursor-pointer bg-muted hover:bg-muted/70 text-sm"
                  >
                    {form.analisaAfter
                      ? form.analisaAfter.name
                      : "Pilih Gambar"}
                  </label>
                  <input
                    id="analisa-after"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFile("analisaAfter", e.target.files?.[0] || null)
                    }
                  />

                  {form.analisaAfter && (
                    <img
                      src={URL.createObjectURL(form.analisaAfter)}
                      className="mt-2 h-32 rounded border object-cover"
                    />
                  )}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-6">
                {loading
                  ? "Processing..."
                  : mode === "create"
                  ? "Tambah Journal"
                  : "Update Journal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
