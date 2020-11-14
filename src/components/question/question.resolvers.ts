import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import _ from 'lodash';
import { ApolloContext } from '$types/index';
import { GraphQLJSON } from '$helpers/scalars';
import { User, UserModel } from '$components/user';

import { Question, Result } from './question.entity';

import { questions, correctAnswers } from './questions';
import { Answers } from '$components/question/question.args';

@Resolver(() => Question)
export class QuestionResolver {

  @Authorized()
  @Query(() => [Question])
  async questions(
    @Ctx() { state }: ApolloContext,
  ): Promise<Question[]> {
    try {
      const user = await UserModel.findById(state.decodedUser!.id!);
      if (user?.answers) {
        const questionsWithoutAnswers = questions
          .filter(question =>
            // @ts-ignore
            user.answers[question.id] === undefined
          );
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
    @Ctx() { state }: ApolloContext,
    @Args() { answers}: Answers,
  ): Promise<Result> {
    try {
      const user = await UserModel.findById(state.decodedUser!.id!);

      // For work with map
      // from mongodb
      const userObj: User = user?.toObject();
      const newUserAnswers = userObj?.answers ? {
        ...userObj.answers,
        ...answers,
      } : answers;

      const result = Object.keys(answers).reduce((acc, answerKey) => {
        if (correctAnswers[answerKey] === answers[answerKey]) {
          return acc + 1;
        }

        return acc;
      }, 0);

      const newUserScores = userObj?.score ? userObj.score + result : result;
      user!.score = newUserScores;
      user!.answers = newUserAnswers;
      await user!.save();

      return {
        score: newUserScores
      }
    } catch (error) {
      throw error;
    }
  }

}
