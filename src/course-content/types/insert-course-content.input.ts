import { InputType, Field, Int } from 'type-graphql';
import { ContentType } from './content-type';
import { S3FileCreateInput } from '../../s3-file/types/create-s3-file.input';

@InputType()
export class InsertCourseContentInput {
  @Field()
  title: string;

  @Field(() => Int)
  courseId: number;

  @Field(() => Int, { nullable: true })
  seqId: number;

  @Field(() => Int, { nullable: true })
  parentId: number;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  content: string;

  @Field(() => S3FileCreateInput, { nullable: true })
  video?: S3FileCreateInput;

  @Field(() => S3FileCreateInput, { nullable: true })
  file?: S3FileCreateInput;

  @Field(() => Int, { nullable: true })
  duration: number;

  @Field(() => ContentType, { nullable: true })
  contentType: ContentType; 
}
