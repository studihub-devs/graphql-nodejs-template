import { Field, InputType, Int } from 'type-graphql';
import { FileType } from './file-type';

@InputType()
export class S3FileCreateInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  name: string;

  @Field()
  url: string;
  
  @Field(() => FileType)
  fileType: FileType;

  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;
}
