import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '$helpers/scalars';

@ObjectType()
export class Review {

  @Field(() => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field(() => String)
  @Property({ required: true})
  author!: string;

  @Field(() => String)
  @Property({ required: true})
  subtitle!: string;

  @Field(() => String)
  @Property({ required: true})
  message!: string;

  @Field(() => String)
  @Property({ required: true})
  avatar!: string;

}

export const ReviewModel = getModelForClass(Review);
