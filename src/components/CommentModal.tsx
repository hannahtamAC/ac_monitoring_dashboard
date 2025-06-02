import React, { useEffect } from "react";
import CommentInput from "./CommentInput";
import { FlightComment } from "../types/shared";
import { formatLongTime } from "../utils/timeUtils";

interface CommentModalProps {
  comments: FlightComment[];
  onClose?: () => void;
  onSubmit: (content: string) => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  comments,
  onClose,
  onSubmit,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh] min-h-[60vh]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 mb-4 overflow-y-scroll min-h-[50vh]">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-2">
              <p className="text-sm">
                <span className="text-gray-500 text-xs">
                  {formatLongTime(comment.timestamp)}
                </span>
              </p>
              <p className="text-gray-700 text-sm">{comment.text}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <CommentInput onSubmit={onSubmit} disabled={false} />
        </div>
      </div>
    </div>
  );
};
