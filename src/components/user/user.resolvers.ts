import { Resolver, Query, Subscription, Authorized, Ctx } from 'type-graphql';

import { User, UserModel } from '.';
import { ApolloContext } from '$types/index';

@Resolver(() => User)
export class UserResolvers {

  @Query(() => Number)
  async usersCount() {
    try {
      return await UserModel.countDocuments();
    } catch (error) {
      throw error;
    }
  }

  @Subscription(() => Boolean, {
    topics: 'NEW_USER',
  })
  async newUserRegistered() {
    return true;
  }

  @Authorized()
  @Query(() => Number)
  async getUserScore(
    @Ctx() { state }: ApolloContext,
  ): Promise<number> {
    const user = await UserModel.findById(state.decodedUser?.id);
    return user?.score || 0
  }

}
