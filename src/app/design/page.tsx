import contentfulClient from '@/src/lib/contentful';
import { ImageEntry } from '@/src/types/contentful';
import MasonryLayout from '@/src/components/masonry';

export const revalidate = 10;

export default async function DesignPage() {
  const entries = await contentfulClient.getEntries<ImageEntry>({ content_type: 'image' });

  const images = entries.items
    .filter((image) => image.fields.type === 'Design') // ONLY SHOW DESIGNS
    .map((image) => ({
      id: image.sys.id,
      name: image.fields.name,
      date: image.fields.date,
      media: image.fields.media,
    }));

  return <MasonryLayout images={images} />;
}
