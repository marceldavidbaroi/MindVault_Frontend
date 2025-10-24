"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, Layers, Plus } from "lucide-react";
import { ButtonGroup } from "../ui/button-group";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionModal from "./TransactionModal";

interface Transaction {
  id: number;
  date: string;
  category: {
    id: number;
    name: string;
    displayName: string;
    type: string;
    createdAt: string;
  };
  description: string;
  amount: string;
}

interface TransactionTableProps {
  data: Transaction[];
  loading?: boolean;
}

const TransactionTableMini: React.FC<TransactionTableProps> = ({
  data,
  loading = false,
}) => {
  const handleRowClick = (tx: Transaction) => {
    console.log("Clicked transaction:", tx);
  };
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div
      className="
        w-full overflow-x-auto rounded-2xl 
        border border-border 
        bg-card/60 backdrop-blur-md 
        shadow-md 
        transition-all duration-300 
        hover:border-ring/40
      "
    >
      <div className="flex justify-between items-center p-3">
        <div className="text-left text-2xl font-bold text-foreground">
          Recent Transactions
        </div>
        <ButtonGroup>
          <Button
            variant="default"
            className="bg-primary text-primary-foreground"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button
            variant="default"
            className="bg-secondary text-secondary-foreground"
          >
            <Layers className="w-5 h-5" />
          </Button>
          <Button
            variant="default"
            className="bg-accent text-accent-foreground"
          >
            <Info className="w-5 h-5" />
          </Button>
        </ButtonGroup>
      </div>

      <Table>
        <TableCaption className="text-muted-foreground"></TableCaption>
        <TableHeader>
          <TableRow className="border-border/60">
            <TableHead className="w-[120px] text-foreground/90">Date</TableHead>
            <TableHead className="hidden sm:table-cell text-foreground/90">
              Category
            </TableHead>
            <TableHead className="hidden sm:table-cell text-foreground/90">
              Description
            </TableHead>
            <TableHead className="text-right text-foreground/90">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <Skeleton className="h-4 w-20 bg-muted" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-24 bg-muted" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-full max-w-[200px] bg-muted" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto bg-muted" />
                  </TableCell>
                </TableRow>
              ))
            : data.map((tx) => (
                <TableRow
                  key={tx.id}
                  onClick={() => handleRowClick(tx)}
                  className="
                    cursor-pointer transition-colors 
                    hover:bg-muted/40
                  "
                >
                  <TableCell className="font-medium text-foreground">
                    {tx.date}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-foreground/90">
                    {tx.category?.displayName}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell truncate max-w-[200px] text-muted-foreground">
                    {tx.description || "-"}
                  </TableCell>
                  <TableCell className="text-right text-primary font-semibold">
                    {tx.amount}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <TransactionModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default TransactionTableMini;
