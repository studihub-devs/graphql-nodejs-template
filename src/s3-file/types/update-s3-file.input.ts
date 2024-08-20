import { Field, InputType, Int } from 'type-graphql';
import { FileType } from './file-type';

@InputType()
export class S3FileUpdateInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  url?: string;
  
  @Field(() => FileType, { nullable: true })
  fileType?: FileType;

  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;
}
