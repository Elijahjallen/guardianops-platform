import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../services/api";

type Message = {
  id: string;
  caseId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt: string;
};

type MessagesPanelProps = {
  caseId: string;
};

function MessagesPanel({ caseId }: MessagesPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadMessages() {
    try {
      const data = await getMessages(caseId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setErrorMessage("Failed to load messages.");
    }
  }

  useEffect(() => {
    loadMessages();
  }, [caseId]);

  async function handleSendMessage() {
    setErrorMessage("");

    if (!content.trim()) {
      setErrorMessage("Message cannot be empty.");
      return;
    }

    try {
      await sendMessage({
        caseId,
        content,
      });

      setContent("");
      await loadMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrorMessage("Failed to send message.");
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Messages</h2>

      <p className="mt-1 text-sm text-slate-500">
        Secure case messaging between parents and operations.
      </p>

      {errorMessage && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 max-h-[360px] space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4">
        {messages.map((message) => (
          <div key={message.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-950">
                  {message.senderName}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {message.senderRole}
                </p>
              </div>

              <p className="text-xs font-semibold text-slate-400">
                {formatDateTime(message.createdAt)}
              </p>
            </div>

            <p className="text-sm text-slate-700">{message.content}</p>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center font-semibold text-slate-500">
            No messages yet.
          </div>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Type a message..."
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSendMessage}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Send Message
          </button>
        </div>
      </div>
    </section>
  );
}

function formatDateTime(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default MessagesPanel;