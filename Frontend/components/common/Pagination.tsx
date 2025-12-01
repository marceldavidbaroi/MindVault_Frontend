"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  total: number; // total items
  page: number; // current page (1-indexed)
  pageSize: number; // items per page
  onPageChange?: (newPage: number) => void; // callback on page change
  onPageSizeChange?: (newSize: number) => void; // callback on page size change
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1 && total <= pageSize) return null; // no pagination needed

  const handlePrev = () => {
    if (page > 1) {
      onPageChange?.(page - 1);
      console.log("Page changed to:", page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange?.(page + 1);
      console.log("Page changed to:", page + 1);
    }
  };

  const handlePageClick = (p: number) => {
    if (p !== page) {
      onPageChange?.(p);
      console.log("Page changed to:", p);
    }
  };

  // generate page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
      {/* Prev / Next */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Prev
        </Button>

        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => handlePageClick(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span>Per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(val) => {
            const newSize = Number(val);
            onPageSizeChange?.(newSize);
            console.log("Page size changed to:", newSize);
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
