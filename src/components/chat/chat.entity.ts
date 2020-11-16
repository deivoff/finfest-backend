import { ObjectType, Field } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { UserName, UserPhoto } from '$components/user';
import { ObjectIdScalar } from '$helpers/scalars';

@ObjectType()
export class Message {
  @Field(() => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field(() => Date)
  readonly createdAt!: Date;

  @Field(() => UserName)
  @Property({ required: true })
  author!: UserName;

  @Property({ required: true })
  topic!: string;

  @Field(() => UserPhoto,{ nullable: true })
  @Property({ required: false })
  avatar?: UserPhoto;

  @Field()
  @Property({ required: true })
  message!: string;

}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    }
  }
});
