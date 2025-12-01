"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAccountStore } from "@/store/accountStore";
import { AccountType } from "@/types/Account.type";

export const AccountTypeList = () => {
  const accountStore = useAccountStore();

  const [search, setSearch] = useState("");

  // Group data by scope
  const grouped = useMemo(() => {
    const group: Record<string, AccountType[]> = {};
    accountStore.accountTypes.forEach((type) => {
      if (!group[type.scope]) group[type.scope] = [];
      group[type.scope].push(type);
    });
    return group;
  }, [accountStore.accountTypes]);

  // Filtered grouped data based on search
  const filteredGrouped = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(grouped).map(([scope, types]) => [
          scope,
          types.filter((type) =>
            type.name.toLowerCase().includes(search.toLowerCase())
          ),
        ])
      ),
    [grouped, search]
  );

  return (
    <div className="space-y-6">
      <div className="max-w-sm mx-auto">
        <Input
          placeholder="Search account types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {Object.entries(filteredGrouped).map(([scope, types]) =>
        types.length ? (
          <div key={scope} className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground capitalize">
              {scope}
            </h2>
            <ul className="space-y-2">
              {types.map((type) => (
                <li
                  key={type.id}
                  className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {type.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                    {type.scope.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
};
