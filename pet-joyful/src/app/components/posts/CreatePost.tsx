'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { BiImage, BiPlusCircle, BiX } from 'react-icons/bi';
import { Button } from 'react-bootstrap';

interface CreatePostProps {
  user: {
    name: string;
    avatar: string;
  };
  onSubmit: (post: { text: string; image: string | null; user: { name: string; avatar: string } }) => void;
}

export default function CreatePost({ user, onSubmit }: CreatePostProps) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    const post = {
      text,
      image: preview, // Na aplicação real, você enviaria o arquivo para o servidor
      user: {
        name: user.name,
        avatar: user.avatar
      }
    };
    onSubmit(post);
    setText('');
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="bg-white p-3 rounded shadow mb-4">
      <div className="d-flex align-items-center mb-3">
        <Image
          src={user.avatar}
          alt="Sua foto"
          width={40}
          height={40}
          className="rounded-circle me-2"
        />
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Faça uma publicação"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      
      {preview && (
        <div className="position-relative mb-3">
          <Image
            src={preview}
            alt="Pré-visualização"
            width={600}
            height={400}
            className="img-fluid rounded"
          />
          <Button 
            variant="danger" 
            className="position-absolute top-0 end-0 rounded-circle p-1 m-1"
            onClick={removeImage}
          >
            <BiX size={20} />
          </Button>
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mt-2">
        <div className="d-flex gap-2">
          <Button 
            variant="light" 
            className="rounded-pill"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <BiImage size={20} className="me-1" />
            Foto
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="d-none"
            />
          </Button>
          <Button variant="light" className="rounded-pill">
            <BiPlusCircle size={20} className="me-1" />
            Álbum
          </Button>
        </div>
        
        <Button 
          variant="success" 
          disabled={!text && !image}
          onClick={handleSubmit}
        >
          Publicar
        </Button>
      </div>
    </div>
  );
}