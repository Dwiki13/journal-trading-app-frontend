"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getJournals } from "../store/journalStore";
import { GetJournalsResponse, Journal } from "../type/journal";
import { ImageOff, ArrowUp, ArrowDown } from "lucide-react";
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

function isValidImage(url: string | null | undefined) {
  if (!url) return false;
  if (url.includes("undefined")) return false;
  return true;
}

type SortOrder = "asc" | "desc";

export default function DataJournalPage() {
  const [journal, setJournal] = useState<Journal[]>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const [sortBy, setSortBy] = useState<keyof Journal>("tanggal");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchJournal = async () => {
    try {
      setLoading(true);
      const response: GetJournalsResponse = await getJournals({
        page,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      setJournal(response.data);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error("Failed to fetch journal", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, [page, sortBy, sortOrder]);

  const handleSort = (column: keyof Journal) => {
    if (sortBy === column) {
      // toggle order
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1); // reset page saat ganti sorting
  };

  const renderSortIcon = (column: keyof Journal) => {
    if (sortBy !== column) {
      return <span className="w-4 h-4 inline-block ml-1" />; // placeholder
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="inline-block w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline-block w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="p-6 md:p-10 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-7">
          Data Trading Journal
        </h1>
      </header>

      <p>
        <JournalForm mode="create" triggerText="Tambah Journal" />
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow">
        <div className="max-h-[600px] overflow-auto relative">
          <Table>
            <TableHeader className="sticky top-0 bg-zinc-100 dark:bg-zinc-900 z-10">
              <TableRow>
                {[
                  { label: "Tanggal", key: "tanggal" },
                  { label: "Pair", key: "pair" },
                  { label: "Side", key: "side" },
                  { label: "Lot", key: "lot" },
                  { label: "Entry", key: "harga_entry" },
                  { label: "Stop Lose", key: "harga_stop_loss" },
                  { label: "Take Profit", key: "harga_take_profit" },
                  { label: "Before", key: "analisa_before" },
                  { label: "After", key: "analisa_after" },
                  { label: "Profit", key: "profit" },
                  { label: "Result", key: "win_lose" },
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
                  <TableCell
                    colSpan={11}
                    className="text-center py-6 text-zinc-500 dark:text-zinc-400"
                  >
                    <Spinner className="h-6 w-6 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : journal && journal.length > 0 ? (
                journal.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="uppercase tracking-wide font-semibold text-zinc-700 dark:text-zinc-200">
                      {item.pair}
                    </TableCell>
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
                    <TableCell>
                      {isValidImage(item.analisa_before) ? (
                        <img
                          src={item.analisa_before}
                          alt="before"
                          className="w-20 h-20 object-cover rounded cursor-zoom-in"
                          onClick={() => setPreviewImage(item.analisa_before)}
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                          <ImageOff className="text-gray-400" size={32} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isValidImage(item.analisa_after) ? (
                        <img
                          src={item.analisa_after}
                          alt="after"
                          className="w-20 h-20 object-cover rounded cursor-zoom-in"
                          onClick={() => setPreviewImage(item.analisa_after)}
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                          <ImageOff className="text-gray-400" size={32} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        item.profit >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center py-6 text-zinc-500 dark:text-zinc-400"
                  >
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
            <button
              className="mt-4 w-full py-2 bg-red-500 text-white rounded"
              onClick={() => setPreviewImage(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
