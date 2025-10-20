"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, ArrowDown, User, Users } from "lucide-react";
import CategoryDialog from "./CategoryDetailDialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/Category.type";

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const openDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedCategory(null);
    setIsDialogOpen(false);
  };

  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => setIsCreateDialogOpen(false);

  const renderCategoryItem = (cat: Category) => (
    <li
      key={cat.id}
      onClick={() => openDialog(cat)}
      className="flex items-center justify-between px-3 py-2 rounded-md border border-border/50 bg-muted hover:bg-muted-foreground/10 transition-colors cursor-pointer"
    >
      <span className="font-medium text-foreground">{cat.displayName}</span>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {cat.user ? (
          <>
            <User className="w-4 h-4" /> User
          </>
        ) : (
          <>
            <Users className="w-4 h-4" /> System
          </>
        )}
      </div>
    </li>
  );

  const renderCard = (
    title: string,
    categories: Category[],
    type: "income" | "expense"
  ) => (
    <Card className="flex-1 border border-border shadow-md bg-card h-full">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === "income" ? (
            <ArrowUp className="w-5 h-5 text-primary" />
          ) : (
            <ArrowDown className="w-5 h-5 text-destructive" />
          )}
          <CardTitle
            className={`text-lg font-semibold ${
              type === "income" ? "text-primary" : "text-destructive"
            }`}
          >
            {title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {categories.length} items
          </span>
          <Button
            variant="outline"
            size="sm"
            className=" text-primary"
            onClick={openCreateDialog}
          >
            +
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <ScrollArea className="max-h-full w-full">
          <ul className="flex flex-col gap-1 p-2">
            {categories.map(renderCategoryItem)}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
        {renderCard("Income", incomeCategories, "income")}
        {renderCard("Expense", expenseCategories, "expense")}
      </div>

      {/* Edit Dialog */}
      {selectedCategory && (
        <CategoryDialog
          category={selectedCategory}
          isOpen={isDialogOpen}
          onClose={closeDialog}
          mode="edit"
        />
      )}

      {/* Create Dialog */}
      <CategoryDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
        mode="create"
      />
    </ScrollArea>
  );
};

export default CategoryList;
