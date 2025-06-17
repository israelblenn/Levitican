import contentfulClient from '@/src/lib/contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { GlobalEntry } from '@/src/types/contentful'
import logoform from "@/public/logoform.svg";
import Image from "next/image";

export const revalidate = 10;

export default async function About() {
  const response = await contentfulClient.getEntries<GlobalEntry>({
    content_type: 'global',
    limit: 1,
  });

  const aboutEntry = response.items[0];
  const aboutData = aboutEntry?.fields.about;

  return (
    <div className="about-container">
      <Image className='dropcap' src={logoform} alt="leviael logo" height={72} />
      <div dangerouslySetInnerHTML={{ __html: documentToHtmlString(aboutData) }} /> 
    </div>
  );
}
