export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: User;
  postId: string;
  likes?: number;
  likedByUser?: boolean;
}

export interface CreateCommentData {
  content: string;
  postId: string;
}

export interface UpdateCommentData {
  content: string;
}