'use client';

import { useState } from 'react';
import { BiImage, BiPlusCircle } from 'react-icons/bi';
import { Form } from 'react-bootstrap';

export default function PostForm() {
  const [postText, setPostText] = useState("");

  return (
    <div className="bg-white p-3 rounded shadow mb-4">
      <Form.Control
        type="text"
        placeholder="Faça uma publicação"
        className="rounded-pill"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <div className="d-flex justify-content-end mt-2 gap-2">
        <BiImage size={24} />
        <BiPlusCircle size={24} />
      </div>
    </div>
  );
}