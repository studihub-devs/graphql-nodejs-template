import { registerEnumType } from 'type-graphql';

export enum FileType {  
  VIDEO = 'video',
  EXCEL = 'excel', 
  PDF = 'pdf', 
  BANNER = 'banner',
  THUMBNAIL = 'thumbnail',
  BADGE_IMAGE = 'badge_image',
  AVATAR = 'avatar',
  OTHER = 'other',
}

registerEnumType(FileType, {
  name: 'FileType',
});
