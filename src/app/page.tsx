'use client';

import {Video, getVideoList} from '@/services/video-service';
import {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Icons} from '@/components/icons';
import Link from 'next/link';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videoList = await getVideoList();
      setVideos(videoList);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const filterVideos = () => {
      const filtered = videos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    };

    filterVideos();
  }, [searchTerm, videos]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <Input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(filteredVideos.length > 0 ? filteredVideos : videos).map((video) => (
          <Link key={video.id} href={`/videos/${video.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
                <CardDescription>{video.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <img
                  src={video.thumbnailUrl || `https://picsum.photos/id/${video.id}/300/200`}
                  alt={video.title}
                  className="rounded-md mb-2 w-full h-40 object-cover"
                />
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.user className="mr-1 h-4 w-4" />
                  {video.uploadDate}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.messageSquare className="mr-1 h-4 w-4" />
                  {video.views} views
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
