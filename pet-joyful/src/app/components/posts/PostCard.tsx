'use client';

import Image from 'next/image';
import { Button } from 'react-bootstrap';
import { BiLike, BiChat, BiShare } from 'react-icons/bi';

interface PostCardProps {
  userImage: string;
  userName: string;
  userDescription: string;
  postImage: string;
  postAlt: string;
}

export default function PostCard({
  userImage,
  userName,
  userDescription,
  postImage,
  postAlt
}: PostCardProps) {
  return (
    <div className="bg-white p-3 rounded shadow mb-4">
      <div className="d-flex align-items-center gap-3 mb-3">
        <Image
          src={userImage}
          width={40}
          height={40}
          className="rounded-circle"
          alt="Profile"
        />
        <div>
          <h4 className="mb-0">{userName}</h4>
          <p className="text-muted small">{userDescription}</p>
        </div>
      </div>

      <Image
        src={postImage}
        width={500}
        height={300}
        className="rounded w-100"
        alt={postAlt}
        style={{ objectFit: 'cover' }}
      />

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex gap-2">
          <Button variant="light" className="rounded-circle p-2">
            <BiLike />
          </Button>
          <Button variant="light" className="rounded-circle p-2">
            <BiChat />
          </Button>
          <Button variant="light" className="rounded-circle p-2">
            <BiShare />
          </Button>
        </div>
        <Button variant="success" className="rounded-pill">
          Adotar
        </Button>
      </div>
    </div>
  );
}