import contentfulClient from '@/src/lib/contentful'
import { VideoEntry } from '@/src/types/contentful'

export const revalidate = 10;

export default async function Videos() {
  const entries = await contentfulClient.getEntries<VideoEntry>({ content_type: 'video' });

  const sortedVideos = entries.items.sort((a, b) => {
    const dateA = new Date(a.fields.date).getTime();
    const dateB = new Date(b.fields.date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="video-container">
      {sortedVideos.map((video) => (
        <div key={video.sys.id} className="video">
          <iframe
            style={{ aspectRatio: '16/9' }}
            src={`https://www.youtube.com/embed/${video.fields.videoID}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}
