import { Field, ObjectType } from '@nestjs/graphql';

import { ExperienceModel } from './experience.model.js';
import { ProfessionalLinkModel } from './professional-link.model.js';
import { ProjectModel } from './project.model.js';
import { SkillModel } from './skill.model.js';

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => String)
  declare name: string;

  @Field(() => String)
  declare description: string;

  @Field(() => [ProfessionalLinkModel])
  declare links: ProfessionalLinkModel[];

  @Field(() => [SkillModel])
  declare skills: SkillModel[];

  @Field(() => [ExperienceModel])
  declare experience: ExperienceModel[];

  @Field(() => [ProjectModel])
  declare projects: ProjectModel[];
}