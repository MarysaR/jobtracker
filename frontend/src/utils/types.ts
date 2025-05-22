export interface Application {
  id: string;
  entreprise: string;
  poste: string;
  emailEntreprise: string;
  contacts: string;
  dateCandidature: string;
  statut: string;
  sourceReseau: string;
  lettreMotivation?: string;
  notes?: string;
  cvFilePath?: string;
  lettreFilePath?: string;
  linkedinUrl?: string;
  siteWeb?: string;
  rappelDate?: string;
  rappelFait: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface ApplicationWithPagination {
  applications: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateApplicationData {
  entreprise: string;
  poste: string;
  emailEntreprise?: string; // Optionnel
  contacts?: string; // Optionnel
  dateCandidature: string;
  statut?: string;
  sourceReseau: string;
  lettreMotivation?: string;
  notes?: string;
  linkedinUrl?: string;
  siteWeb?: string;
  rappelDate?: string;
}

export const STATUTS = [
  "Pas encore postulé",
  "Postulé",
  "Relance",
  "Entretien",
  "Refusé",
  "Accepté",
] as const;

export const SOURCES_RESEAU = [
  "LinkedIn",
  "Indeed",
  "Cooptation",
  "Site entreprise",
  "Autre",
] as const;
