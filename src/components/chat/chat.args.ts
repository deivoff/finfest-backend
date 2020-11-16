import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class MessageArgs {

  @Field(() => String)
  topic!: string;

}
