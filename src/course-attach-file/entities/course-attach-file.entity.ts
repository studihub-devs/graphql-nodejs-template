import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';
import { S3File } from '../../s3-file/entities/s3-file.entity';

@ObjectType()
export class CourseAttachFile {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'content_id' })
  contentId: number;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  fileId: number;

  @Field(() => Int, { nullable: true })
  duration: number;

  @Field()
  @Expose({ name: 'uploaded_time' })
  @Type(() => Date)
  uploadedTime: Date;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
