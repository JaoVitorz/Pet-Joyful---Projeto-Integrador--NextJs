import { useState } from "react";

type Comment = {
  id: number;
  user: string;
  text: string;
};

type Props = {
  comments: Comment[];
  onAddComment: (text: string) => void;
};

export default function Comments({ comments, onAddComment }: Props) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
    }
  };

  return (
    <div className="mt-2">
      <h6>Comentários</h6>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.user}:</strong> {c.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="d-flex gap-2 mt-2">
        <input
          type="text"
          className="form-control"
          placeholder="Adicionar comentário..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit" className="btn btn-success">
          Comentar
        </button>
      </form>
    </div>
  );
}