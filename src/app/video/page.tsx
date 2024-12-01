import contentfulClient from '@/src/lib/contentful'
import { VideoEntry } from '@/src/types/contentful'

export default async function Videos() {
  const entries = await contentfulClient.getEntries<VideoEntry>({ content_type: 'video' })

  return (
    <div className="video-container">
      {entries.items.map((video) => (
        <div key={video.sys.id} className="video">
          <iframe
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
