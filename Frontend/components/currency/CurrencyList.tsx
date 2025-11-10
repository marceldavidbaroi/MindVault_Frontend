"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useCurrencyStore } from "@/store/currencyStore";
import { Currency } from "../../types/Currency.type";
// Import UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

/**
 * CurrencyView is a self-contained component that handles fetching,
 * state management (via Zustand store), client-side searching, and rendering
 * of the currency list with a modern, elegant glassmorphism design.
 */
const CurrencyView: React.FC = () => {
  const currencyStore = useCurrencyStore();
  const [searchTerm, setSearchTerm] = useState("");

  const allCurrencies = currencyStore.currencies;

  useEffect(() => {
    if (allCurrencies.length === 0) {
      currencyStore.getAllCurrencies();
    }
  }, [allCurrencies.length, currencyStore]);

  // Filtering Logic (performed client-side)
  const filteredCurrencies = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    if (!lowerCaseSearch) {
      return allCurrencies;
    }
    return allCurrencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(lowerCaseSearch) ||
        currency.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [allCurrencies, searchTerm]);

  // Renders a single currency item row with prominent details
  const renderCurrencyItem = (currency: Currency) => (
    <div
      key={currency.code}
      // Glass Effect and Elegant Hover
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between 
                 p-4 border border-white/20 rounded-2xl mb-3 
                 bg-white/5 dark:bg-gray-900/5 shadow-inner "
    >
      {/* Left Group: Name and Code (Primary Identity) - Reduced size */}
      <div className="flex items-center gap-3 mb-2 sm:mb-0">
        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {currency.name}
        </span>
        <Badge
          variant="secondary"
          className="text-xs font-medium tracking-wider bg-white/20 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-none"
        >
          {currency.code}
        </Badge>
      </div>

      {/* Right Group: Details (Symbol and Decimal) - Prominent but refined */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {/* Symbol */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium uppercase">
            Symbol:
          </span>
          <span className="text-2xl font-mono font-bold text-primary dark:text-primary/80">
            {currency.symbol}
          </span>
        </div>

        {/* Decimal Places */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium uppercase">
            Decimals:
          </span>
          <span className="text-lg font-bold font-mono text-foreground/90 bg-white/10 dark:bg-gray-800/20 px-2 py-0.5 rounded-lg border border-white/10">
            {currency.decimal}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Card with Glassmorphism effect */}
      <Card
        className="shadow-xl border-2 border-white/20 
                   bg-white/5 dark:bg-gray-900/10 backdrop-blur-sm"
      >
        <CardHeader className="p-5 border-b border-white/20 dark:border-gray-700/50 bg-white/10 dark:bg-gray-900/10">
          <CardTitle className="text-2xl font-bold flex items-center justify-between text-foreground dark:text-white">
            <span>Supported Currencies ({allCurrencies.length})</span>
            {/* Displaying filter count if a search is active */}
            {searchTerm && (
              <Badge
                variant="outline"
                className="text-sm bg-white/20 border-white/50 text-foreground"
              >
                {filteredCurrencies.length} results
              </Badge>
            )}
          </CardTitle>
          {/* Search Input */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              placeholder="Search by currency code (USD) or name (Dollar)..."
              className="pl-10 h-10 border-white/30 focus-visible:ring-primary 
                         bg-white/30 dark:bg-gray-700/50 placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        {/* List Content Area */}
        <CardContent className="p-3">
          <ScrollArea className="h-[60vh] min-h-[300px] p-2">
            {filteredCurrencies.length > 0 ? (
              <div>{filteredCurrencies.map(renderCurrencyItem)}</div>
            ) : (
              <div className="p-8 text-center text-primary/70">
                <Search className="h-8 w-8 mx-auto mb-3 text-primary/50" />
                <p className="font-semibold text-lg">No currencies found.</p>
                <p>Try refining your search for "{searchTerm}".</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyView;
