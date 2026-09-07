import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('ProfessionalLink')
export class ProfessionalLinkModel {
  @Field(() => String)
  declare label: string;

  @Field(() => String)
  declare url: string;
}