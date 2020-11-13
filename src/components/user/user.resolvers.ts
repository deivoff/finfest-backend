import { Resolver, Query, Subscription } from 'type-graphql';

import { User, UserModel } from '.';

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

}
