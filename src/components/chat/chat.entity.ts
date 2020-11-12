import { ObjectType, Field } from 'type-graphql';
import { UserName, UserPhoto } from '$components/user';

@ObjectType()
export class Message {
  @Field(() => UserName)
  author!: UserName;

  @Field(() => UserPhoto,{ nullable: true })
  avatar?: UserPhoto;

  @Field()
  message!: string;

  @Field(() => Date)
  date!: Date;
}
