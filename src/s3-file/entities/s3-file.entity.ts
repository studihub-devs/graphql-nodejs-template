import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';
import { FileType } from '../types/file-type';

@ObjectType()
export class S3File {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field({ nullable: true })
  width?: number;

  @Field({ nullable: true })
  height?: number;

  @Field(() => FileType, { nullable: true })
  @Expose({ name: 'type' })
  fileType?: FileType;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;
}
