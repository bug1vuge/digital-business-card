import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Profile')
export class ProfileModel {
  @Field()
  declare name: string;

  @Field()
  declare description: string;
}