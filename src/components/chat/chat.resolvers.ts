import { PubSubEngine } from 'graphql-subscriptions';
import { Arg, Args, Authorized, Ctx, Mutation, PubSub, Query, Resolver, Root, Subscription } from 'type-graphql';
import { Message, MessageArgs, MessageModel } from '.';
import { ApolloContext } from '$types/index';


@Resolver()
export class ChatResolver {

  @Query(() => [Message])
  async getLastTwentyMessages(
    @Args() { topic }: MessageArgs,
  ): Promise<Message[]> {
    try {
      return await MessageModel.find({
        topic,
      }, null, {
        limit: 20,
        sort: { $natural: -1 }
      });
    } catch (e) {
      throw e;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async sendChatMessage(
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { state }: ApolloContext,
    @Arg('topic') topic: string,
    @Arg('message') message: string,
  ) {
    const author = state.decodedUser!.name;
    const avatar = state.decodedUser?.photos?.length ?
      state.decodedUser?.photos[0] : undefined;

    const messageModel = new MessageModel({
      message,
      author,
      avatar,
      topic,
    });

    try {
      const messageObj = await messageModel.save();
      await pubSub.publish(topic, messageObj.toJSON());
      return true
    } catch (e) {
      throw e
    }
  }


  @Subscription(() => Message, {
    topics: ({ args }) => args.topic,
  })
  subscribeToChat(
    @Arg("topic") topic: string,
    @Root() chatMessage: Message,
  ): Message {
    return chatMessage;
  }
}
