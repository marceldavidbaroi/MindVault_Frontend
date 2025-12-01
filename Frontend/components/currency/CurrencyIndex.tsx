"use client";
import React, { useEffect } from "react";
import { Currency } from "../../types/Currency.type";
import { useCurrencyStore } from "@/store/currencyStore";
import CurrencyList from "./CurrencyList";
import CurrencyViewSkeleton from "./skeleton/CurrencyListSkeleton";

interface CurrencyIndexProps {
  currencies: Currency[];
}

const CurrencyIndex: React.FC<CurrencyIndexProps> = ({ currencies }) => {
  const currencyStore = useCurrencyStore();

  useEffect(() => {
    currencyStore.setCurrencies(currencies);
  }, [currencies]);
  return (
    <div>
      {currencyStore.currencies.length ? (
        <CurrencyList />
      ) : (
        <CurrencyViewSkeleton />
      )}
    </div>
  );
};

export default CurrencyIndex;
