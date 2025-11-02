"use client";

import React, { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SecurityQuestion = () => {
  const userStore = useUserStore();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState<
    { id: number; question: string }[]
  >([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [step, setStep] = useState<"username" | "questions">("username");

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username entered:", username);

    const res = await userStore.forgetPassQuestions(username);
    if (res?.data?.length) {
      setQuestions(res.data);
      setStep("questions");
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[q.id] && answers[q.id].trim().length > 0);

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password.length > 50) {
      return "Password must be at most 50 characters";
    }
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!strongPasswordRegex.test(password)) {
      return "Password too weak. Must contain uppercase, lowercase, number, and special character";
    }
    return null;
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    setPasswordError("");

    const payload = {
      username,
      answers: questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || "",
      })),
      newPassword,
    };

    console.log("Payload:", payload);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Security Questions</CardTitle>
      </CardHeader>

      <CardContent>
        {step === "username" ? (
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Next
            </Button>

            {/* Back to Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => router.push("/auth/sign-in")}
            >
              Back to Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="grid gap-2">
                <Label
                  htmlFor={`q-${q.id}`}
                  className="text-base font-semibold text-gray-800"
                >
                  {q.question}
                </Label>
                <Input
                  id={`q-${q.id}`}
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Enter your answer"
                  required
                />
              </div>
            ))}

            {/* New password field */}
            <div className="grid gap-2 mt-4">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={!allAnswered}
                className={cn(!allAnswered && "opacity-70 cursor-not-allowed")}
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={!allAnswered}
            >
              Submit Answers
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter>
        {step === "questions" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setStep("username")}
          >
            Back
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SecurityQuestion;
