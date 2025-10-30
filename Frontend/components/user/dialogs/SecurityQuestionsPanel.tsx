"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { SecurityQuestion } from "@/types/User.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";

interface Props {
  data: SecurityQuestion[];
}

const SecurityQuestionsSection: React.FC<Props> = ({ data }) => {
  const totalSlots = 3;
  const emptySlots = totalSlots - data.length;
  const userStore = useUserStore();

  // ---------------- STATE ----------------
  const [isOpen, setIsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<SecurityQuestion | null>(null);
  const [questionValue, setQuestionValue] = useState("");
  const [answerValue, setAnswerValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    // Validation for create/edit
    const valid =
      questionValue.trim().length >= 5 &&
      answerValue.trim().length >= 1 &&
      password.trim().length >= 6;
    setIsValid(valid);
  }, [questionValue, answerValue, password]);

  // ---------------- HANDLERS ----------------
  const handleEdit = (q: SecurityQuestion) => {
    setEditingQuestion(q);
    setQuestionValue(q.question);
    setAnswerValue(""); // Answer is never shown
    setPassword("");
    setShowPassword(false);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setQuestionValue("");
    setAnswerValue("");
    setPassword("");
    setShowPassword(false);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!isValid) return;

    console.log({
      id: editingQuestion?.id || null,
      question: questionValue,
      answer: answerValue,
      password,
    });

    if (editingQuestion) {
      userStore.updateSecurityQuestion(editingQuestion.id, {
        question: questionValue,
        answer: answerValue,
        password,
      });
    } else {
      userStore.createSecurityQuestion({
        question: questionValue,
        answer: answerValue,
        password,
      });
    }
    setIsOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeletePassword("");
    setShowDeletePassword(false);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePassword) return;

    console.log("Delete question ID:", deleteId, "Password:", deletePassword);

    if (deleteId) {
      // wrap in DTO object as required
      await userStore.deleteSecurityQuestion(deleteId, {
        password: deletePassword,
      });
    }

    setDeleteDialogOpen(false);
  };

  // ---------------- RENDER ----------------
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Existing questions */}
        {data.map((q) => (
          <Card key={q.id}>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 truncate pr-2">
                {q.question}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(q)}
                  title="Edit"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(q.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <Card
            key={`empty-${index}`}
            className="border-dashed border-2 border-gray-300 bg-gray-50"
          >
            <CardContent className="flex items-center justify-center">
              <Button
                variant="outline"
                onClick={handleCreate}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                Create
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------------- CREATE / EDIT DIALOG ---------------- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edit Question" : "Create Question"}
            </DialogTitle>
            <DialogDescription>
              Fill in your security question, answer, and password.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <Input
              placeholder="Question"
              value={questionValue}
              onChange={(e) => setQuestionValue(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Answer"
              value={answerValue}
              onChange={(e) => setAnswerValue(e.target.value)}
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- DELETE DIALOG ---------------- */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Security Question</DialogTitle>
            <DialogDescription>
              Enter your password to confirm deletion.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-2">
            <Input
              type={showDeletePassword ? "text" : "password"}
              placeholder="Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowDeletePassword((prev) => !prev)}
            >
              {showDeletePassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} disabled={!deletePassword}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecurityQuestionsSection;
