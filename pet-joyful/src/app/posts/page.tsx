"use client";

import React, { useState } from 'react';
import CreatePostForm from '@/app/components/CreatePostForm';
import PostsFeed from '@/app/components/PostsFeed';

export default function PostsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    // increment key to force PostsFeed to reload
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12 col-md-8 mx-auto">
          <CreatePostForm onSuccess={handleSuccess} />
          <PostsFeed refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
