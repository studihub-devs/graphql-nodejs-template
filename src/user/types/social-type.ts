import { registerEnumType } from 'type-graphql';

export enum SocialType {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Tiktok = 'Tiktok',
  Twitter = 'Twitter',
  Youtube = 'Youtube',
  Skype = 'Skype',
  Zalo = 'Zalo',
  OTHER = 'OTHER',
}

registerEnumType(SocialType, {
  name: 'SocialType',
});
