import { useState } from "react";

type CommentInputProps = {
  onSubmit: (message: string) => void;
  disabled: boolean;
};

const CommentInput = ({ onSubmit, disabled }: CommentInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Message submitted:", message);
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setMessage((prev) => prev + "\n");
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[700px] min-w-[300px] rounded-2xl">
      <form onSubmit={handleSubmit} aria-disabled={disabled} className="w-full">
        <div className="w-full rounded-2xl">
          <textarea
            disabled={disabled}
            placeholder="Leave a comment..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-w-[300px] p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
