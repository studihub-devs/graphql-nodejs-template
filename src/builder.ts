import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { authChecker } from './auth/auth-checker';
import { UserAuthResolver } from './auth/user-auth.resolver';
import { CourseAttachFileAggreateResolver } from './course-attach-file/course-aggregate.resolve';
import { CourseAttachFileResolver } from './course-attach-file/course-attach-file.resolve';
import { CourseCategoryAggreateResolver } from './course-category/course-category-aggregate.resolve';
import { CourseCategoryResolver } from './course-category/course-category.resolver';
import { CourseContentAggreateResolver } from './course-content/course-content-aggregate.resolve';
import { CourseContentMutationResolver } from './course-content/course-content-mutation.resolver';
import { CourseContentEdgeResolver } from './course-content/course-content-relay-edge.resolver';
import { CourseContentResolver } from './course-content/course-content.resolve';
import { CourseReviewAggreateResolver } from './course-review/course-review-aggregate.resolve';
import { CourseReviewResolver } from './course-review/course-review.resolver';
import { CourseReactAggreateResolver } from './course-react/course-react-aggregate.resolve';
import { CourseReactResolver } from './course-react/course-react.resolver';
import { CourseAggreateResolver } from './course/course-aggregate.resolver';
import { CourseMutationResolver } from './course/course-mutation.resolver';
import { CourseEdgeResolver } from './course/course-relay-edge.resolver';
import { CourseResolver } from './course/course.resolver';
import { container } from './inversify.config';
import { NewsAggreateResolver } from './news/news-aggregate.resolve';
import { NewsEdgeResolver } from './news/news-relay-edge.resolver';
import { NewsResolver } from './news/news.resolve';
import { QuizAnswerAggreateResolver } from './quiz-answer/quiz-answer-aggregate.resolve';
import { QuizAnswerResolver } from './quiz-answer/quiz-answer.resolve';
import { QuizQuestionAggreateResolver } from './quiz-question/quiz-question-aggregate.resolve';
import { QuizQuestionResolver } from './quiz-question/quiz-question.resolve';
import { QuizAggreateResolver } from './quiz/quiz-aggregate.resolver';
import { QuizMutationResolver } from './quiz/quiz-mutation.resolver';
import { QuizEdgeResolver } from './quiz/quiz-relay-edge.resolver';
import { QuizResolver } from './quiz/quiz.resolve';
import { S3FileEdgeResolver } from './s3-file/s3-file-relay.resolver';
import { S3FileAggregateResolver } from './s3-file/s3-file.aggregate.resolver';
import { S3FileResolver } from './s3-file/s3-file.resolver';
import { APIResouceAggregateResolver } from './system-resource/api-resource/api-resource-aggregate.resolver';
import { APIResourceResolver } from './system-resource/api-resource/api-resource.resolver';
import { ResourceAggregateResolver } from './system-resource/resource/resource-aggregate.resolver';
import { ResourceResolver } from './system-resource/resource/resource.resolver';
import { RoleResourceResolver } from './system-resource/role-resource/role-resource.resolver';
import { RoleResolver } from './system-resource/role/role.resolver';
import { RoleAggreateResolver } from './system-resource/role/roles-aggregate.resolver';
import { UserCourseResolver } from './user-course/user-course.resolver';
import { UserResolver } from './user/user.resolver';
import { CourseViewershipAggreateResolver } from './course-viewership/course-viewership-aggregate.resolve';
import { CourseViewershipResolver } from './course-viewership/course-viewership.resolver';
import { QuizQuestionEdgeResolver } from './quiz-question/quiz-question-relay-edge.resolver';
import { QuizQuestionMutationResolver } from './quiz-question/quiz-question-mutation.resolver';
import { QuizAnswerEdgeResolver } from './quiz-answer/quiz-answer-relay-edge.resolver';
import { UserQuizResolver } from './user-quiz/user-quiz.resolver';
import { UserQuizEdgeResolver } from './user-quiz/user-quiz-relay-edge.resolver';
import { UserQuizAggreateResolver } from './user-quiz/user-quiz-aggregate.resolver';
import { UserQuizAnswerResolver } from './user-quiz-answer/user-quiz-answer.resolver';
import { UserQuizAnswerAggreateResolver } from './user-quiz-answer/user-quiz-answer-aggregate.resolver';
import { UserQuizAnswerEdgeResolver } from './user-quiz-answer/user-quiz-answer-relay-edge.resolver';

export async function buildAppSchema() {
  return await buildSchema({
    resolvers: [
      UserAuthResolver,
      UserResolver,
      RoleResourceResolver,
      RoleResolver,
      RoleAggreateResolver,
      ResourceResolver,
      ResourceAggregateResolver,
      APIResourceResolver,
      APIResouceAggregateResolver,
      CourseResolver,  
      CourseMutationResolver,  
      CourseAggreateResolver,
      CourseEdgeResolver,
      NewsResolver,
      NewsAggreateResolver,
      CourseCategoryResolver,
      CourseCategoryAggreateResolver,
      CourseContentResolver,
      CourseContentAggreateResolver,
      CourseContentMutationResolver,
      CourseContentEdgeResolver, 
      CourseReviewResolver,
      CourseReviewAggreateResolver,
      CourseReactResolver,
      CourseReactAggreateResolver,
      CourseViewershipResolver,
      CourseViewershipAggreateResolver,
      CourseAttachFileResolver,
      CourseAttachFileAggreateResolver,
      QuizResolver,
      QuizMutationResolver,
      QuizEdgeResolver,
      QuizAggreateResolver,
      QuizQuestionResolver,
      QuizQuestionMutationResolver,
      QuizQuestionEdgeResolver,
      QuizQuestionAggreateResolver,
      QuizAnswerResolver,
      QuizAnswerEdgeResolver,
      QuizAnswerAggreateResolver,
      UserCourseResolver,      
      NewsEdgeResolver,
      S3FileResolver,
      S3FileAggregateResolver,
      S3FileEdgeResolver, 
      UserQuizResolver,
      UserQuizAggreateResolver,
      UserQuizEdgeResolver,   
      UserQuizAnswerResolver,
      UserQuizAnswerAggreateResolver,
      UserQuizAnswerEdgeResolver,   
    ],
    container,
    authChecker,
  });
}