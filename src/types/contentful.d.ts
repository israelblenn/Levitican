import { Document } from '@contentful/rich-text-types'
import { EntrySkeletonType } from 'contentful'

export interface GlobalFields {
    about: Document
}

export interface GlobalEntry extends EntrySkeletonType<GlobalFields> {
    contentTypeId: 'global'
}

export interface VideoFields {
    videoID: string
}

export interface VideoEntry extends EntrySkeletonType<VideoFields> {
    contentTypeId: 'video'
}