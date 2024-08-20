import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';
import { ContentType } from '../types/content-type';
import { CourseContentStatus } from '../types/course-content-status';

@ObjectType()
export class CourseContent {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'course_id' })
  courseId: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'seq_id' })
  seqId: number;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  @Expose({ name: 'video_id' })
  videoId: number;  

  @Field({ nullable: true })
  @Expose({ name: 'file_id' })
  fileId: number;  

  @Field(() => Int, { nullable: true })
  duration: number;

  @Field(() => ContentType, { nullable: true })
  @Expose({ name: 'content_type' })
  contentType: ContentType;

  @Field(() => CourseContentStatus, { nullable: true })
  status: CourseContentStatus;

  @Field({ nullable: true })
  @Expose({ name: 'parent_path' })
  parentPath: string;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
