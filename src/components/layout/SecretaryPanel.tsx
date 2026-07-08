"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SecretaryPanelProps {
  projectId?: string | null;
}

export function SecretaryPanel({ projectId }: SecretaryPanelProps) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/secretary/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, projectId: projectId ?? null }),
      });
      const data: unknown = await response.json();
      const parsed = data as {
        success: boolean;
        data?: { reply: string };
        error?: { message: string };
      };

      if (!parsed.success || !parsed.data) {
        setError(parsed.error?.message ?? "Secretary AI 応答に失敗しました");
        return;
      }

      setReply(parsed.data.reply);
      setMessage("");
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Secretary AI</CardTitle>
        <CardDescription>Task整理・次のアクション提案</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {reply && (
          <div className="max-h-48 overflow-y-auto rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">
            {reply}
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-auto space-y-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="今日やることを相談..."
            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "送信中..." : "Secretary に相談"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
