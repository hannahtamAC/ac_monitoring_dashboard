import { useState } from "react";
import { CommentModal } from "./CommentModal";
import { FlightComment } from "../types/shared";
import { formatTime } from "../utils/timeUtils";

type CommentSectionProps = {
  comments: FlightComment[];
  onSubmit: (content: string) => void;
};

const CommentSection = ({ comments, onSubmit }: CommentSectionProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full">
      <div
        className="p-4 border rounded cursor-pointer hover:bg-gray-100"
        onClick={() => setShowModal(true)}
      >
        <p className="text-sm text-gray-700">
          {comments.length
            ? `${formatTime(comments[0].timestamp)}: ${comments[0].text}`
            : ""}
        </p>
      </div>

      {showModal && (
        <CommentModal
          comments={comments}
          onClose={() => setShowModal(false)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default CommentSection;
