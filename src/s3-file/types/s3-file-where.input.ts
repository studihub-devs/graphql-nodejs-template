import { InputType, Field } from 'type-graphql';
import { FileType } from './file-type';

@InputType()
export class S3FileWhereInput {
  @Field({ nullable: true })
  id?:number;

  @Field(() => FileType, { nullable: true })
  fileType?: FileType;
}
