"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getJournals } from "../store/journalStore";
import { GetJournalsResponse, Journal } from "../type/journal";
import { ArrowUp, ArrowDown, ImageOff } from "lucide-react";
import { DeleteJournal } from "./delete";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import JournalForm from "./form";
import { getPairs } from "../store/pairsStore";
import { PairParams, PairsResponse, PairType } from "../type/pairs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DataJournalPage() {
  const [type, setType] = useState<PairType>();
  const [journal, setJournal] = useState<Journal[]>([]);
  const [pair, setPair] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string | null>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [openPopover, setOpenPopover] = useState(false);

  const [sortBy, setSortBy] = useState<keyof Journal>("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [sideFilter, setSideFilter] = useState<"buy" | "sell" | undefined>(
    undefined
  );
  const [winLoseFilter, setWinLoseFilter] = useState<
    "win" | "lose" | undefined
  >(undefined);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchJournal = async () => {
    try {
      setLoading(true);
      const response: GetJournalsResponse = await getJournals({
        page,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
        pair: search ?? undefined,
        side: sideFilter || undefined,
        win_lose: winLoseFilter || undefined,
        date_from: dateFrom ? dateFrom.toISOString().split("T")[0] : undefined,
        date_to: dateTo ? dateTo.toISOString().split("T")[0] : undefined,
      });

      setJournal(response.data);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPair = async () => {
    try {
      const params: PairParams = {};
      if (type) params.type = type;
      const response: PairsResponse = await getPairs(params);
      setPair(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, [
    page,
    sortBy,
    sortOrder,
    search,
    sideFilter,
    winLoseFilter,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    fetchPair();
  }, [type]);

  useEffect(() => {
    setSearch("");
  }, [type]);

  const handleSort = (column: keyof Journal) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const renderSortIcon = (column: keyof Journal) => {
    if (sortBy !== column)
      return <span className="w-4 h-4 inline-block ml-1" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="inline-block w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline-block w-4 h-4 ml-1" />
    );
  };

  const isValidImage = (url?: string | null) =>
    !!url && !url.includes("undefined");

  return (
    <div className="p-6 md:p-10 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-7">
          Data Trading Journal
        </h1>
        <JournalForm
          mode="create"
          triggerText="Tambah Journal"
          onSuccess={() => fetchJournal()}
        />
      </header>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col">
          <Label className="mb-1 font-medium text-sm">Type</Label>
          <Select
            value={type ?? "all"}
            onValueChange={(val) =>
              setType(val === "all" ? undefined : (val as PairType))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="forex">Forex</SelectItem>
              <SelectItem value="commodity">Commodity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label className="mb-1 font-medium text-sm">Side</Label>
          <Select
            value={sideFilter ?? "all"}
            onValueChange={(val) =>
              setSideFilter(val === "all" ? undefined : (val as "buy" | "sell"))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label className="mb-1 font-medium text-sm">Result</Label>
          <Select
            value={winLoseFilter ?? "all"}
            onValueChange={(val) =>
              setWinLoseFilter(
                val === "all" ? undefined : (val as "win" | "lose")
              )
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="win">Win</SelectItem>
              <SelectItem value="lose">Lose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label className="mb-1 font-medium text-sm">Date from</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-36">
                {dateFrom ? dateFrom.toLocaleDateString() : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col">
          <Label className="mb-1 font-medium text-sm">Date to</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-36">
                {dateTo ? dateTo.toLocaleDateString() : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col min-w-[200px] flex-1 md:flex-none">
          <Label className="mb-1 font-medium text-sm">Pair</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full md:w-60 text-left" variant="outline">
                {search || "Select pair"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-60 p-2 overflow-auto">
              <Input
                placeholder="Search pair..."
                value={search ?? ""}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-2"
              />
              {pair
                .filter((p) =>
                  p.toLowerCase().includes((search ?? "").toLowerCase())
                )
                .map((p) => (
                  <Button
                    key={p}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setSearch(p);
                      setOpenPopover(false);
                    }}
                  >
                    {p}
                  </Button>
                ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow">
        <div className="max-h-[600px] overflow-auto relative">
          <Table>
            <TableHeader className="sticky top-0 bg-zinc-100 dark:bg-zinc-900 z-10">
              <TableRow>
                {[
                  { label: "Modal", key: "modal" },
                  { label: "Modal Type", key: "modal_type" },
                  { label: "Tanggal", key: "tanggal" },
                  { label: "Pair", key: "pair" },
                  { label: "Side", key: "side" },
                  { label: "Lot", key: "lot" },
                  { label: "Entry", key: "harga_entry" },
                  { label: "Stop Lose", key: "harga_stop_loss" },
                  { label: "Take Profit", key: "harga_take_profit" },
                  { label: "Reason", key: "reason" },
                  { label: "Before", key: "analisa_before" },
                  { label: "After", key: "analisa_after" },
                  { label: "Profit", key: "profit" },
                  { label: "Result", key: "win_lose" },
                  { label: "Action", key: "action" },
                ].map((col) => (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer font-bold text-zinc-700 dark:text-zinc-300"
                    onClick={() => handleSort(col.key as keyof Journal)}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {renderSortIcon(col.key as keyof Journal)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-6">
                    <Spinner className="h-6 w-6 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : journal.length > 0 ? (
                journal.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <TableCell>{item.modal}</TableCell>
                    <TableCell>{item.modal_type}</TableCell>
                    <TableCell>
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="uppercase">{item.pair}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          item.side === "buy"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                        }`}
                      >
                        {item.side.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>{item.lot.toFixed(2)}</TableCell>
                    <TableCell>{item.harga_entry}</TableCell>
                    <TableCell>{item.harga_stop_loss}</TableCell>
                    <TableCell>{item.harga_take_profit}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>
                      {isValidImage(item.analisa_before) ? (
                        <img
                          src={item.analisa_before!}
                          alt="before"
                          className="w-20 h-20 object-cover rounded cursor-zoom-in"
                          onClick={() => setPreviewImage(item.analisa_before!)}
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                          <ImageOff size={32} className="text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isValidImage(item.analisa_after) ? (
                        <img
                          src={item.analisa_after!}
                          alt="after"
                          className="w-20 h-20 object-cover rounded cursor-zoom-in"
                          onClick={() => setPreviewImage(item.analisa_after!)}
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                          <ImageOff size={32} className="text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell
                      className={`${
                        item.profit >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      } font-semibold`}
                    >
                      {(item.profit ?? 0).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-bold ${
                          item.win_lose === "win"
                            ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : item.win_lose === "lose"
                            ? "bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {(item.win_lose ?? "-").toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <JournalForm
                          mode="edit"
                          journal={item}
                          triggerText="Edit"
                          onSuccess={() => fetchJournal()}
                        />

                        <DeleteJournal
                          journalId={item.id}
                          onSuccess={() => fetchJournal()}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-6">
                    There is no journal data yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && <PaginationEllipsis />}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 p-4 rounded shadow-xl max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="preview"
              className="max-h-[80vh] rounded"
            />
            <Button
              className="mt-4 w-full py-2 rounded"
              onClick={() => setPreviewImage(null)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
