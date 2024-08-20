import { S3FileCreateInput } from '../../s3-file/types/create-s3-file.input';
import { InputType, Field, Int, Float } from 'type-graphql';
import { CourseStatus } from './course-status';
import { CourseType } from './course-type';
import { CourseLevel } from './course-level';

@InputType()
export class UpdateCourseInput {
  @Field(() => CourseStatus, { nullable: true })
  status?: CourseStatus;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  title: string;

  @Field(() => Int, { nullable: true })
  duration: number;

  @Field(() => S3FileCreateInput, { nullable: true })
  thumbnail?: S3FileCreateInput;

  @Field(() => CourseType, { nullable: true })
  type: CourseType;

  @Field(() => Int, { nullable: true })
  categoryId: number;

  @Field(() => Float, { nullable: true })
  rewardPoint: number;

  @Field(() => CourseLevel, { nullable: true })
  level: CourseLevel;

  @Field(() => S3FileCreateInput, { nullable: true })
  badgeImage?: S3FileCreateInput;

  @Field(() => Float, { nullable: true })
  price: number;
}
