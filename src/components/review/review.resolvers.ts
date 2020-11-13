import { Resolver, Query, FieldResolver, Root } from 'type-graphql';
import CONFIG from '$configs/index';
import { Review, ReviewModel } from '.';

@Resolver(() => Review)
export class ReviewResolver {

  @Query(() => [Review])
  async reviews() {
    try {
      return await ReviewModel.find();
    } catch (e) {
      throw e
    }
  }

  @FieldResolver()
  async avatar(
    @Root() { avatar }: Review
  ) {
    return CONFIG.urls.http + 'static/' + avatar;
  }
}
