import { S3FileCreateInput } from '../../s3-file/types/create-s3-file.input';
import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class InsertCourseAttachFileInput {
  @Field({ nullable: true })
  description: string;

  @Field(() => S3FileCreateInput, { nullable: true})
  file: S3FileCreateInput;

  @Field(() => Int, { nullable: true })
  duration: number;

  @Field(() => Int, { nullable: true })
  seqId: number;
}
