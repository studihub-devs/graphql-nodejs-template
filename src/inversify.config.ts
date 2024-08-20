import { Container } from 'inversify';

import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { CourseAttachFileModule } from './course-attach-file/course-attach-file.module';
import { CourseCategoryModule } from './course-category/course-category.module';
import { CourseContentModule } from './course-content/course-content.module';
import { CourseReactModule } from './course-react/course-react.module';
import { CourseReviewModule } from './course-review/course-review.module';
import { CourseModule } from './course/course.module';
import { NewsModule } from './news/news.module';
import { QuizAnswerModule } from './quiz-answer/quiz-answer.module';
import { QuizQuestionModule } from './quiz-question/quiz-question.module';
import { QuizModule } from './quiz/quiz.module';
import { SharedModule } from './shared/share.module';
import { APIResourceModule } from './system-resource/api-resource/api-resource.module';
import { ResourceModule } from './system-resource/resource/resource.module';
import { RoleResourceModule } from './system-resource/role-resource/role-resource.module';
import { RoleModule } from './system-resource/role/role.module';
import { UserCourseModule } from './user-course/user-course.module';
import { UserModule } from './user/user.module';
import { S3FileModule } from './s3-file/s3-file.module';
import { CourseViewershipModule } from './course-viewership/course-viewership.module';
import { UserQuizModule } from './user-quiz/user-quiz.module';
import { UserQuizAnswerModule } from './user-quiz-answer/user-quiz-answer.module';

export const container = new Container();

container.load(
  CoreModule,
  AuthModule,
  SharedModule,
  UserModule,
  APIResourceModule,
  RoleModule,
  ResourceModule,
  RoleResourceModule,
  CourseModule,
  NewsModule,
  CourseCategoryModule,
  CourseContentModule,
  CourseReviewModule,
  CourseReactModule,
  CourseViewershipModule,
  CourseAttachFileModule,
  QuizModule,
  QuizQuestionModule,
  QuizAnswerModule,
  UserCourseModule,
  S3FileModule,
  UserQuizModule,
  UserQuizAnswerModule,
);
