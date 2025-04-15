'use server';

import {Video, getVideo} from '@/services/video-service';
import {generateVideoSummary} from '@/ai/flows/generate-video-summary';
import {generateVideoTags} from '@/ai/flows/generate-video-tags';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

interface Props {
  params: {
    id: string;
  };
}

export default async function VideoDetail({params}: Props) {
  const {id} = params;
  const video: Video | null = await getVideo(id);

  if (!video) {
    return <div>Video not found</div>;
  }

  const summary = await generateVideoSummary({
    title: video.title,
    description: video.description,
  });

  const tags = await generateVideoTags({
    title: video.title,
    description: video.description,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          <video src={video.url} controls className="w-full aspect-video rounded-md"></video>
          <Card>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Uploaded: {video.uploadDate}</p>
              <p className="text-sm text-muted-foreground">Views: {video.views}</p>
              <p className="mt-4">
                <strong>Summary:</strong> {summary?.summary}
              </p>
              <p className="mt-4">
                <strong>Tags:</strong> {tags?.tags.join(', ')}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Related Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: Implement related videos list here */}
              <p className="text-sm text-muted-foreground">No related videos yet.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
