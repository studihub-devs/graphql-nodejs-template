import { registerEnumType } from 'type-graphql';

export enum ContentType {
  VIDEO = 'video',
  TEXT = 'text',
  HTML = 'html',
  MARKDOWN = 'markdown',
  SLIDE = 'slide',
  VIDEO_SLIDE = 'video_slide',
}

registerEnumType(ContentType, {
  name: 'ContentType',
});
