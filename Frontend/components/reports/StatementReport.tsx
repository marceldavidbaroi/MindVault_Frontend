"use client";

import React from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { useAccountStore } from "@/store/accountStore";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const StatementReport: React.FC = () => {
  const transactionStore = useTransactionStore();
  const accountStore = useAccountStore();

  const handlePrint = () => {
    const printContent = document.getElementById("statement-report")?.innerHTML;
    const win = window.open("", "_blank");
    if (!printContent || !win) return;
    win.document.write(`
      <html>
        <head>
          <title>MIND VAULT - Statement Report</title>
          <style>
            body { font-family: 'Helvetica', Arial, sans-serif; padding: 20px; color: #333; }
            h1,h2,h3 { margin: 0; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { font-size: 28px; font-weight: bold; color: #111; }
            .header h2 { font-size: 20px; margin-top: 5px; color: #555; }
            .account-info { border: 1px solid #ccc; padding: 15px; border-radius: 6px; margin-bottom: 20px; background: #f9f9f9; }
            .balances { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .balance-box { padding: 12px 20px; border-radius: 6px; font-weight: 600; background: #f1f5f9; border: 1px solid #ddd; width: 48%; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
            th, td { border: 1px solid #e0e0e0; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: 600; }
            tbody tr:nth-child(even) { background-color: #f9fafb; }
            .income { color: green; font-weight: 500; }
            .expense { color: red; font-weight: 500; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: right; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const statement = transactionStore.statements;
  const account = accountStore.selectedAccount;

  if (!statement || !account)
    return (
      <div className="text-center py-10 text-gray-500">
        No statement available
      </div>
    );

  const { openingBalance, closingBalance, transactions } = statement;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          MIND VAULT - Statement
        </h2>
        <Button
          onClick={handlePrint}
          className="bg-black text-white hover:bg-gray-800"
        >
          Print
        </Button>
      </div>

      <div
        id="statement-report"
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        {/* Account Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
          <div>
            <p className="font-semibold">
              Account Name: <span className="font-normal">{account.name}</span>
            </p>
            <p className="font-semibold">
              Type: <span className="font-normal">{account.type?.name}</span>
            </p>
            <p className="font-semibold">
              Currency:{" "}
              <span className="font-normal">
                {account.currency?.code} ({account.currency?.symbol})
              </span>
            </p>
          </div>
          <div>
            <p className="font-semibold">
              Owner:{" "}
              <span className="font-normal">
                {account.users?.[0]?.username || "-"}
              </span>
            </p>
            <p className="font-semibold">
              Current Balance:{" "}
              <span className="font-normal">{account.balance}</span>
            </p>
          </div>
        </div>

        {/* Balances */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center font-semibold">
            Opening Balance: {openingBalance}
          </div>
          <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 text-center font-semibold">
            Closing Balance: {closingBalance}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-left">Currency</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="p-2">
                    {format(new Date(tx.transactionDate), "yyyy-MM-dd")}
                  </td>
                  <td className="p-2">{tx.category?.name || "-"}</td>
                  <td
                    className={`p-2 ${
                      tx.type === "income" ? "income" : "expense"
                    }`}
                  >
                    {tx.type}
                  </td>
                  <td className="p-2 text-right">
                    {tx.amount.toLocaleString()}
                  </td>
                  <td className="p-2">{tx.currency?.code || "-"}</td>
                  <td className="p-2">{tx.description || "-"}</td>
                  <td className="p-2 text-right">{tx.runningBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right text-gray-500 text-sm">
          Generated by MIND VAULT
        </div>
      </div>
    </div>
  );
};
