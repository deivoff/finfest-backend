import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class Answer {

  @Field()
  value!: number;

  @Field()
  label!: string;
}

@ObjectType()
export class Result {

  @Field()
  newUserScore!: number;

  @Field()
  correctAnswers!: number;

}

@ObjectType()
export class Question {

  @Field()
  id!: number;

  @Field()
  question!: string;

  @Field(() => [Answer])
  values!: Answer[];

  correct!: number;

}
