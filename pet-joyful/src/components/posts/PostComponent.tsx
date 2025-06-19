'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BiLike, BiChat, BiShare, BiDotsVertical } from 'react-icons/bi';
import { Button } from 'react-bootstrap';

interface Post {
  id: string | number;
  user: {
    avatar: string;
    name: string;
  };
  time: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
  isAdoption?: boolean;
}

interface PostComponentProps {
  post: Post;
  onLike: (postId: string | number, liked: boolean) => void;
  onComment: (postId: string | number) => void;
  onShare: (postId: string | number) => void;
}

export default function PostComponent({ post, onLike, onComment, onShare }: PostComponentProps) {
  const [liked, setLiked] = useState(false);
  
  const handleLike = () => {
    setLiked(!liked);
    onLike(post.id, !liked);
  };

  return (
    <div className="bg-white p-3 rounded shadow mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <Image
            src={post.user.avatar}
            alt={post.user.name}
            width={50}
            height={50}
            className="rounded-circle me-3"
          />
          <div>
            <h5 className="mb-0">{post.user.name}</h5>
            <small className="text-muted">{post.time}</small>
          </div>
        </div>
        <BiDotsVertical className="text-muted" />
      </div>
      
      <p className="mb-3">{post.text}</p>
      
      {post.image && (
        <Image
          src={post.image}
          alt="Postagem"
          width={600}
          height={400}
          className="img-fluid rounded mb-3"
          priority
        />
      )}
      
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2">
          <Button 
            variant={liked ? "primary" : "light"} 
            className="rounded-circle p-2"
            onClick={handleLike}
          >
            <BiLike size={20} className={liked ? "text-white" : ""} />
            <span className="ms-1">{post.likes + (liked ? 1 : 0)}</span>
          </Button>
          <Button variant="light" className="rounded-circle p-2" onClick={() => onComment(post.id)}>
            <BiChat size={20} />
            <span className="ms-1">{post.comments}</span>
          </Button>
          <Button variant="light" className="rounded-circle p-2" onClick={() => onShare(post.id)}>
            <BiShare size={20} />
          </Button>
        </div>
        
        {post.isAdoption && (
          <Button variant="success" className="rounded-pill">
            Adotar
          </Button>
        )}
      </div>
    </div>
  );
}