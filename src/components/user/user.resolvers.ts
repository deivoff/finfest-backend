import { Resolver, Query, Subscription, Authorized, Ctx, Info } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import { getUserLoader, User, UserModel } from '.';
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


  @Authorized()
  @Query(() => [User])
  async usersWithCodes() {
    try {
      return await UserModel.find({'productCodes.0': { $exists: true } });
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
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ): Promise<number> {
    const dl = getUserLoader(info.fieldNodes, context);
    const user = await dl.load(context.state.decodedUser?.id!);
    return user?.score || 0
  }

  @Authorized()
  @Query(() => [String])
  async getUserProductCodes(
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ): Promise<string[]> {
    const dl = getUserLoader(info.fieldNodes, context);
    const user = await dl.load(context.state.decodedUser?.id!);
    return user?.productCodes || [];
  }

}
