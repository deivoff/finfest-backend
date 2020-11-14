import { ArgsType, Field } from 'type-graphql';
import { GraphQLJSON } from '$helpers/scalars';

@ArgsType()
export class Answers {

  @Field(() => GraphQLJSON)
  answers!: Map<string, number>

}
