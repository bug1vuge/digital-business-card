import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Experience')
export class ExperienceModel {
  @Field(() => String)
  declare company: string;

  @Field(() => String)
  declare position: string;

  @Field(() => Date)
  declare startDate: Date;

  @Field(() => Date, {
    nullable: true,
  })
  declare endDate: Date | null;

  @Field(() => Boolean)
  declare current: boolean;

  @Field(() => [String])
  declare achievements: string[];
}