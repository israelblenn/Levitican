import { Document } from '@contentful/rich-text-types'
import { EntrySkeletonType } from 'contentful'

export interface GlobalFields {about: Document}
export interface GlobalEntry extends EntrySkeletonType<GlobalFields> {contentTypeId: 'global'}

export interface VideoFields {videoID: string; date: string}
export interface VideoEntry extends EntrySkeletonType<VideoFields> {contentTypeId: 'video'}

export interface ImageFields {
  name: string;
  date: string;
  type: string;
  media: Array<{
    sys: { id: string };
    fields: {
      file: {
        url: string;
        details?: {
          image?: {
            width?: number;
            height?: number;
          };
        };
      };
      title?: string;
    };
  }>;
}
export interface ImageEntry extends EntrySkeletonType<ImageFields> {contentTypeId: 'image'}