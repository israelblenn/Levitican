import contentfulClient from '@/src/lib/contentful';
import { DesignEntry } from '@/src/types/contentful';
import DesignMasonry from '@/src/components/masonry';

export default async function DesignPage() {
  const entries = await contentfulClient.getEntries<DesignEntry>({ content_type: 'design' });

  const designs = entries.items.map((design) => ({
    id: design.sys.id,
    images: design.fields.images,
    name: design.fields.name,
    date: design.fields.date,
  }));

  return <DesignMasonry designs={designs} />;
}
