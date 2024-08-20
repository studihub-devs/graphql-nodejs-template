import { S3FileCreateInput } from '../../s3-file/types/create-s3-file.input';
import { InputType, Field, Int, Float } from 'type-graphql';
import { CourseContentStatus } from './course-content-status';
import { ContentType } from './content-type';

@InputType()
export class UpdateCourseContentInput {
  @Field(() => CourseContentStatus, { nullable: true })
  status?: CourseContentStatus;

  @Field({ nullable: true })
  title?: string;  

  @Field(() => Int, { nullable: true })
  seqId?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => S3FileCreateInput, { nullable: true })
  video?: S3FileCreateInput;

  @Field(() => S3FileCreateInput, { nullable: true })
  file?: S3FileCreateInput;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => ContentType, { nullable: true })
  contentType?: ContentType; 
}
