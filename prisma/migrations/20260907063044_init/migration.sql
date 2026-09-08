-- CreateTable
CREATE TABLE "Profile" (
    "id" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "name" STRING NOT NULL,
    "description" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
) WITH (schema_locked = false);

-- CreateTable
CREATE TABLE "ProfessionalLink" (
    "id" STRING NOT NULL,
    "label" STRING NOT NULL,
    "url" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL DEFAULT 0,
    "profileId" STRING NOT NULL,

    CONSTRAINT "ProfessionalLink_pkey" PRIMARY KEY ("id")
) WITH (schema_locked = false);

-- CreateTable
CREATE TABLE "Skill" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL DEFAULT 0,
    "profileId" STRING NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
) WITH (schema_locked = false);

-- CreateTable
CREATE TABLE "Experience" (
    "id" STRING NOT NULL,
    "company" STRING NOT NULL,
    "position" STRING NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOL NOT NULL DEFAULT false,
    "achievements" STRING[] DEFAULT ARRAY[]::STRING[],
    "sortOrder" INT4 NOT NULL DEFAULT 0,
    "profileId" STRING NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
) WITH (schema_locked = false);

-- CreateTable
CREATE TABLE "Project" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "description" STRING,
    "url" STRING,
    "repositoryUrl" STRING,
    "sortOrder" INT4 NOT NULL DEFAULT 0,
    "profileId" STRING NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
) WITH (schema_locked = false);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_profileId_name_key" ON "Skill"("profileId", "name");

-- AddForeignKey
ALTER TABLE "ProfessionalLink"
ADD CONSTRAINT "ProfessionalLink_profileId_fkey"
FOREIGN KEY ("profileId")
REFERENCES "Profile"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill"
ADD CONSTRAINT "Skill_profileId_fkey"
FOREIGN KEY ("profileId")
REFERENCES "Profile"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience"
ADD CONSTRAINT "Experience_profileId_fkey"
FOREIGN KEY ("profileId")
REFERENCES "Profile"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project"
ADD CONSTRAINT "Project_profileId_fkey"
FOREIGN KEY ("profileId")
REFERENCES "Profile"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;