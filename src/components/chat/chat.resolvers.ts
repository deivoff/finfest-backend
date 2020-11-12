import { PubSubEngine } from "graphql-subscriptions";
import {
  Resolver,
  Mutation,
  Arg,
  PubSub,
  Subscription,
  Root,
  Ctx,
  Authorized,
} from 'type-graphql';
import { Message } from './chat.entity';
import { ApolloContext } from '$types/index';


@Resolver()
export class ChatResolver {

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

    const payload: Message = {
      message,
      author,
      avatar,
      date: new Date()
    };

    await pubSub.publish(topic, payload);
    return true
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
