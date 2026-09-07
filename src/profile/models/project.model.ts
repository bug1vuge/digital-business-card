import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Project')
export class ProjectModel {
  @Field(() => String)
  declare name: string;

  @Field(() => String, {
    nullable: true,
  })
  declare description: string | null;

  @Field(() => String, {
    nullable: true,
  })
  declare url: string | null;

  @Field(() => String, {
    nullable: true,
  })
  declare repositoryUrl: string | null;
}