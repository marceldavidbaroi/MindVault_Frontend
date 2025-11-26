"use client";

import React, { useState } from "react";
import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subYears } from "date-fns";
import { StatementReport } from "@/components/reports/StatementReport";

const StatementPage = () => {
  const accountStore = useAccountStore();
  const transactionStore = useTransactionStore();

  const today = new Date();
  const oneYearAgo = subYears(today, 1);

  const [fromDate, setFromDate] = useState(oneYearAgo);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!accountStore.selectedAccountId) return;

    const payload = {
      from: format(fromDate, "yyyy-MM-dd"),
      to: format(toDate, "yyyy-MM-dd"),
    };

    setLoading(true);
    await accountStore.getAccount(Number(accountStore.selectedAccountId));
    const res = await transactionStore.getStatements(
      Number(accountStore.selectedAccountId),
      payload
    );
    setLoading(false);

    console.log("Statement API Response:", res);
  };

  return (
    <div className="p-4 space-y-5">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Account Selector */}
        <div className="w-full md:w-auto">
          <AccountsList mode="mini" enableRedirect={false} />
        </div>

        {/* From Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-44 justify-start border-gray-300 bg-white text-gray-700"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-xs text-gray-500">From</span>
                <span>
                  {fromDate ? format(fromDate, "yyyy-MM-dd") : "Select date"}
                </span>
              </div>
              <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(d) => d && setFromDate(d)}
            />
          </PopoverContent>
        </Popover>

        {/* To Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-44 justify-start border-gray-300 bg-white text-gray-700"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-xs text-gray-500">To</span>
                <span>
                  {toDate ? format(toDate, "yyyy-MM-dd") : "Select date"}
                </span>
              </div>
              <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(d) => d && setToDate(d)}
            />
          </PopoverContent>
        </Popover>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!accountStore.selectedAccountId || loading}
          className="w-full md:w-auto bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
        >
          {loading ? "Loading..." : "Generate"}
        </Button>
      </div>

      <div className="pt-4 ">
        <StatementReport />
      </div>
    </div>
  );
};

export default StatementPage;
