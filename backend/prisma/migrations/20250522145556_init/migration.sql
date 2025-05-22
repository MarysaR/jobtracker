-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "google_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "entreprise" TEXT NOT NULL,
    "poste" TEXT NOT NULL,
    "email_entreprise" TEXT NOT NULL,
    "contacts" TEXT NOT NULL,
    "date_candidature" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'Postulé',
    "source_reseau" TEXT NOT NULL,
    "lettre_motivation" TEXT,
    "notes" TEXT,
    "cv_file_path" TEXT,
    "lettre_file_path" TEXT,
    "linkedin_url" TEXT,
    "site_web" TEXT,
    "rappel_date" TIMESTAMP(3),
    "rappel_fait" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
