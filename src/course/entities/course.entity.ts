import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';
import { CourseType } from '../types/course-type';
import { CourseLevel } from '../types/course-level';
import { CourseStatus } from '../types/course-status';

@ObjectType()
export class Course {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  title: string;

  @Field(() => Int, { nullable: true })
  duration: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'thumbnail_id' })
  thumbnailId: number;

  @Field(() => CourseType, { nullable: true })
  type: CourseType;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'category_id' })
  categoryId: number;

  @Field(() => Float, { nullable: true })
  @Expose({ name: 'reward_point' })
  rewardPoint: number;

  @Field(() => CourseLevel, { nullable: true })
  level: CourseLevel;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'badge_image_id' })
  badgeImageId: number;

  @Field(() => Float, { nullable: true })
  price: number;

  @Field(() => CourseStatus, { nullable: true })
  status: CourseStatus;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'teacher_id' })
  teacherId: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'created_by' })
  createdBy: number;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
