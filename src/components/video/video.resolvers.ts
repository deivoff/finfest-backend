import { PubSubEngine } from 'graphql-subscriptions';
import { Arg, Authorized, Mutation, PubSub, Query, Resolver, Root, Subscription } from 'type-graphql';
import { Video, VideoModel } from '.';
import { ObjectIdScalar } from '$helpers/scalars';

@Resolver(() => Video)
export class VideoResolver {

  @Authorized()
  @Query(() => [Video])
  async videos(): Promise<Video[]> {
    try {
      return await VideoModel.find();
    } catch (e) {
      throw e;
    }
  }

  @Authorized()
  @Query(() => Video)
  async video(
    @Arg('videoName') videoName: string
  ) {
    try {
      return await VideoModel.findOne({ placeName: videoName })
    } catch (e) {
      throw e;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async changeVideo(
    @PubSub() pubSub: PubSubEngine,
    @Arg('videoId',() => ObjectIdScalar) videoId: string,
    @Arg('newUrl') newUrl: string,
  ): Promise<boolean> {
    try {
      const video = await VideoModel.findByIdAndUpdate(videoId, { url: newUrl}, {
        new: true
      });

      await pubSub.publish(video!.placeName, video!.toJSON());
      return true;
    } catch (e) {
      throw e;
    }
  }

  @Subscription(() => Video, {
    topics: ({ args }) => args.topic,
  })
  subscribeToVideoChange(
    @Arg("topic") topic: string,
    @Root() video: Video,
  ) {
    return video;
  }
}
