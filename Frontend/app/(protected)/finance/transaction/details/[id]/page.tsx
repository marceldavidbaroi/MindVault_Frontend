"use client";

import TransactionDetailsSkeleton from "@/components/transaction/skeleton/TransactionDetailsSkeleton";
import TransactionDetails from "@/components/transaction/TransactionDetails";
import { useTransactionRefresh } from "@/composables/finance/transaction/useTransactionRefresh";
import { useTransactionStore } from "@/store/transactionStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TransactionDetailsPage() {
  const transactionStore = useTransactionStore();
  const { id } = useParams<{ id: string }>();
  const { loadBaseData } = useTransactionRefresh();
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const init = async () => {
      await loadBaseData(); // <-- IMPORTANT
      const data = await transactionStore.getTransaction(Number(id));
      setTransaction(data);
    };

    init();
  }, [id]); // runs once per page param change

  return (
    <div>
      {transaction ? (
        <TransactionDetails data={transaction} />
      ) : (
        <TransactionDetailsSkeleton />
      )}
    </div>
  );
}
