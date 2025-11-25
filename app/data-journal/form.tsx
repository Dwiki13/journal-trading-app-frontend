"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { convertModalToIDR } from "@/lib/currencyConverter";
import { createJournal, updateJournal } from "@/app/store/journalStore";
import { toast } from "sonner";
import { Journal } from "@/app/type/journal";
import { useRouter } from "next/navigation";
import { PairParams, PairsResponse, PairType } from "../type/pairs";
import { getPairs } from "../store/pairsStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface JournalFormModalProps {
  mode: "create" | "edit";
  journal?: Journal;
  triggerText: string;
  onSuccess?: () => void;
}

const journalSchema = z.object({
  modal: z.string().optional(),
  modal_type: z.enum(["", "usd", "usc", "idr"] as const).optional(),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  pair: z.string().min(1, "Pair wajib dipilih"),
  side: z.enum(["", "buy", "sell"] as const),
  lot: z.string().optional(),
  harga_entry: z.string().optional(),
  harga_take_profit: z.string().optional(),
  harga_stop_loss: z.string().optional(),
  reason: z.string().optional(),
  win_lose: z.enum(["", "win", "lose", "draw"] as const).optional(),
  profit: z.string().optional(),
});

type JournalFormValues = z.infer<typeof journalSchema>;

export default function JournalForm({
  mode,
  journal,
  triggerText,
  onSuccess,
}: JournalFormModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convertedModal, setConvertedModal] = useState<string>("");
  const [pair, setPair] = useState<string[]>([]);
  const [type, setType] = useState<PairType>();
  const [search, setSearch] = useState<string | null>();
  const [openPopover, setOpenPopover] = useState(false);

  const isEdit = mode === "edit";

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
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
    },
  });

  const [analisaBefore, setAnalisaBefore] = useState<File | null>(null);
  const [analisaAfter, setAnalisaAfter] = useState<File | null>(null);
  const [existingBefore, setExistingBefore] = useState<string | null>(null);
  const [existingAfter, setExistingAfter] = useState<string | null>(null);

  const fetchTypeByPair = async (pair: string) => {
    try {
      if (!pair) return;
      const response: PairsResponse = await getPairs({ search: pair });
      if (response.data.includes(pair)) {
        setType(response.type as PairType);
      } else {
        setType(undefined);
      }
    } catch (err) {
      console.error(err);
      setType(undefined);
    }
  };

  useEffect(() => {
    if (open) {
      if (!isEdit) {
        // Mode create → reset form & file states
        form.reset({
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
        });
        setAnalisaBefore(null);
        setAnalisaAfter(null);
        setExistingBefore(null);
        setExistingAfter(null);
        setType(undefined);
        setSearch("");
        setConvertedModal("");
      } else if (journal) {
        // Mode edit → reset form ke journal
        form.reset({
          modal: journal.modal?.toString() ?? "",
          modal_type:
            journal.modal_type === "usd" ||
            journal.modal_type === "usc" ||
            journal.modal_type === "idr"
              ? journal.modal_type
              : "",
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
        });
        setExistingBefore(journal.analisa_before || null);
        setExistingAfter(journal.analisa_after || null);
        setAnalisaBefore(null);
        setAnalisaAfter(null);
        setSearch("");
        if (journal.pair) fetchTypeByPair(journal.pair);

        if (
          journal.modal &&
          journal.modal_type &&
          journal.modal_type !== "idr"
        ) {
          convertModalToIDR(Number(journal.modal), journal.modal_type as any)
            .then((res) =>
              setConvertedModal("≈ Rp " + res.toLocaleString("id-ID"))
            )
            .catch(() => setConvertedModal(""));
        } else {
          setConvertedModal("");
        }
      }
    }
  }, [open, isEdit, journal, form]);

  const fetchPair = async () => {
    try {
      const params: PairParams = {};
      if (type) params.type = type;
      const response: PairsResponse = await getPairs(params);

      let pairList = response.data;
      if (isEdit && journal?.pair && !pairList.includes(journal.pair)) {
        pairList = [journal.pair, ...pairList];
      }

      setPair(pairList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPair();
  }, [type]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  useEffect(() => {
    if (!isEdit) {
      form.setValue("pair", "");
      setSearch("");
    }
  }, [type]);

  useEffect(() => {
    const vModal = form.getValues("modal");
    const vType = form.getValues("modal_type");
    const doConvert = async () => {
      if (!vModal || !vType) {
        setConvertedModal("");
        return;
      }
      if (vType === "idr") {
        setConvertedModal("");
        return;
      }
      try {
        const result = await convertModalToIDR(Number(vModal), vType as any);
        setConvertedModal("≈ Rp " + result.toLocaleString("id-ID"));
      } catch {
        setConvertedModal("");
      }
    };

    doConvert();
    const subs = form.watch((val, { name }) => {
      if (name === "modal" || name === "modal_type") {
        const m = form.getValues("modal");
        const t = form.getValues("modal_type");
        if (!m || !t) {
          setConvertedModal("");
          return;
        }
        if (t === "idr") {
          setConvertedModal("");
          return;
        }
        convertModalToIDR(Number(m), t as any)
          .then((res) =>
            setConvertedModal("≈ Rp " + res.toLocaleString("id-ID"))
          )
          .catch(() => setConvertedModal(""));
      }
    });

    return () => subs.unsubscribe();
  }, [form]);

  const handleFile = (
    name: "analisaBefore" | "analisaAfter",
    file: File | null
  ) => {
    if (name === "analisaBefore") setAnalisaBefore(file);
    else setAnalisaAfter(file);
  };

  const onSubmit = async (values: JournalFormValues) => {
    setLoading(true);
    try {
      let finalModal = values.modal;

      const formData = new FormData();
      formData.append("modal", finalModal || "");
      formData.append("modal_type", values.modal_type || "");
      formData.append("tanggal", values.tanggal);
      formData.append("pair", values.pair);
      formData.append("side", values.side);
      formData.append("lot", values.lot || "");
      formData.append("harga_entry", values.harga_entry || "");
      formData.append("harga_take_profit", values.harga_take_profit || "");
      formData.append("harga_stop_loss", values.harga_stop_loss || "");
      formData.append("reason", values.reason || "");
      formData.append("win_lose", values.win_lose || "");
      formData.append("profit", values.profit || "");

      if (analisaBefore) {
        formData.append("analisaBefore", analisaBefore);
      }

      if (analisaAfter) {
        formData.append("analisaAfter", analisaAfter);
      }

      if (isEdit) {
        if (!journal?.id) throw new Error("Missing journal ID");
        await updateJournal(journal.id, formData);
        toast.success("Journal updated successfully!");
      } else {
        await createJournal(formData);
        toast.success("Journal added successfully!");
      }

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit journal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>{triggerText}</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-3xl sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Journal" : "Tambah Journal"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="modal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modal</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: 2000" {...field} />
                    </FormControl>
                    <FormMessage />
                    {convertedModal && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {convertedModal}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modal_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Modal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="usc">US Cent</SelectItem>
                        <SelectItem value="idr">IDR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* TYPE FIELD */}
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  value={type ?? "all"}
                  onValueChange={(val) =>
                    setType(val === "all" ? undefined : (val as PairType))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="commodity">Commodity</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              {/* PAIR FIELD */}
              <FormField
                control={form.control}
                name="pair"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pair</FormLabel>
                    <Popover open={openPopover} onOpenChange={setOpenPopover}>
                      <PopoverTrigger asChild>
                        <Button className="w-full text-left" variant="outline">
                          {field.value || "Select pair"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        sideOffset={4}
                        className="max-h-60 p-2 overflow-y-auto overscroll-contain"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <Input
                          placeholder="Search pair..."
                          value={search ?? ""}
                          onChange={(e) => setSearch(e.target.value)}
                          className="mb-2"
                        />

                        {pair
                          .filter((p) =>
                            p
                              .toLowerCase()
                              .includes((search ?? "").toLowerCase())
                          )
                          .map((p) => (
                            <Button
                              key={p}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                field.onChange(p);
                                setSearch(p);
                                setOpenPopover(false);
                              }}
                            >
                              {p}
                            </Button>
                          ))}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SIDE FIELD */}
              <FormField
                control={form.control}
                name="side"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="harga_entry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Harga entry" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="harga_take_profit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Take Profit</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Harga TP" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="harga_stop_loss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Loss</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Harga SL" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="lot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Lot" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[90px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="win_lose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasil</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);

                      // Jika pilih lose, tambahkan minus ke profit jika belum ada
                      if (val === "lose") {
                        const profitVal = form.getValues("profit") || "";
                        if (!profitVal.startsWith("-") && profitVal !== "") {
                          form.setValue("profit", "-" + profitVal);
                        }
                      } else if (val === "win") {
                        // Jika sebelumnya minus, hapus
                        const profitVal = form.getValues("profit") || "";
                        if (profitVal.startsWith("-")) {
                          form.setValue("profit", profitVal.slice(1));
                        }
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Hasil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="win">Win</SelectItem>
                      <SelectItem value="lose">Lose</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Profit"
                      onChange={(e) => {
                        let val = e.target.value;

                        // Otomatis minus jika win_lose lose
                        if (form.getValues("win_lose") === "lose") {
                          if (!val.startsWith("-") && val !== "")
                            val = "-" + val;
                        }
                        field.onChange(val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormLabel>Analisa Sebelum</FormLabel>

                <label
                  htmlFor="analisa-before"
                  className="mt-2 flex items-center justify-center border rounded-lg p-3 cursor-pointer bg-muted hover:bg-muted/70 text-sm"
                >
                  {analisaBefore ? analisaBefore.name : "Pilih Gambar"}
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

                {existingBefore && !analisaBefore && (
                  <img
                    src={existingBefore}
                    className="mt-2 h-32 rounded border object-cover"
                    alt="analisa before existing"
                  />
                )}

                {/* Show NEW uploaded image */}
                {analisaBefore && (
                  <img
                    src={URL.createObjectURL(analisaBefore)}
                    className="mt-2 h-32 rounded border object-cover"
                    alt="analisa before"
                  />
                )}
              </div>

              <div>
                <FormLabel>Analisa Sesudah</FormLabel>

                <label
                  htmlFor="analisa-after"
                  className="mt-2 flex items-center justify-center border rounded-lg p-3 cursor-pointer bg-muted hover:bg-muted/70 text-sm"
                >
                  {analisaAfter ? analisaAfter.name : "Pilih Gambar"}
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

                {existingAfter && !analisaAfter && (
                  <img
                    src={existingAfter}
                    className="mt-2 h-32 rounded border object-cover"
                    alt="analisa after existing"
                  />
                )}

                {analisaAfter && (
                  <img
                    src={URL.createObjectURL(analisaAfter)}
                    className="mt-2 h-32 rounded border object-cover"
                    alt="analisa after"
                  />
                )}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Updating..." : "Processing..."}
                </>
              ) : isEdit ? (
                "Update Journal"
              ) : (
                "Tambah Journal"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
