import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Skill')
export class SkillModel {
  @Field(() => String)
  declare name: string;
}