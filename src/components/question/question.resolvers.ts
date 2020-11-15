import { Args, Authorized, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import _ from 'lodash';
import { ApolloContext } from '$types/index';
import { getUserLoader, User } from '$components/user';

import { Question, Result } from './question.entity';

import { questions, correctAnswers } from './questions';
import { Answers } from '$components/question/question.args';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(() => Question)
export class QuestionResolver {

  @Authorized()
  @Query(() => [Question])
  async questions(
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Question[]> {
    try {
      const dl = getUserLoader(info.fieldNodes, context);
      const user = await dl.load(context.state.decodedUser?.id!);
      const userObj = user.toJSON();
      if (userObj?.answers) {
        const questionsWithoutAnswers = questions
          .filter(question => {
            // @ts-ignore
            const answer = userObj.answers[String(question.id)];
            console.log(answer);
            return answer === undefined
          });
        return _.shuffle(questionsWithoutAnswers).slice(0, 10);
      }

      return _.shuffle(questions).slice(0, 10);
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => Result)
  async answers(
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
    @Args() { answers}: Answers,
  ): Promise<Result> {
    try {
      const dl = getUserLoader(info.fieldNodes, context);
      const user = await dl.load(context.state.decodedUser?.id!);
      // For work with map
      // from mongodb
      const userObj: User = user.toJSON();
      const newUserAnswers = userObj?.answers ? {
        ...answers,
        ...userObj.answers,
      } : answers;

      const result = Object.keys(answers).reduce((acc, answerKey) => {
        if (correctAnswers[answerKey] === answers[answerKey]) {
          return acc + 1;
        }

        return acc;
      }, 0);

      const newUserScore = userObj?.score ? userObj.score + result : result;
      user!.score = newUserScore;
      user!.answers = newUserAnswers;
      await user!.save();

      return {
        newUserScore,
        correctAnswers: result
      }
    } catch (error) {
      throw error;
    }
  }

}
