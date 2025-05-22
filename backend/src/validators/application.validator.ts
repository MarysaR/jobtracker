import { Err, Ok, Result } from "../errorHandling";
import { ValidationError } from "../errorHandling/genericError";

export interface CreateApplicationData {
  entreprise: string;
  poste: string;
  emailEntreprise?: string; // Optionnel
  contacts?: string; // Optionnel
  dateCandidature: Date;
  statut?: string;
  sourceReseau: string;
  lettreMotivation?: string;
  notes?: string;
  linkedinUrl?: string;
  siteWeb?: string;
  rappelDate?: Date;
}

export interface UpdateApplicationData {
  entreprise?: string;
  poste?: string;
  emailEntreprise?: string;
  contacts?: string;
  dateCandidature?: Date;
  statut?: string;
  sourceReseau?: string;
  lettreMotivation?: string;
  notes?: string;
  linkedinUrl?: string;
  siteWeb?: string;
  rappelDate?: Date;
}

export const validateCreateApplication = (
  body: any
): Result<CreateApplicationData, ValidationError> => {
  const { entreprise, poste, dateCandidature, sourceReseau } = body;

  if (!entreprise) {
    return Err.of(new ValidationError("Entreprise is required"));
  }

  if (!poste) {
    return Err.of(new ValidationError("Poste is required"));
  }

  if (!dateCandidature) {
    return Err.of(new ValidationError("Date candidature is required"));
  }

  if (!sourceReseau) {
    return Err.of(new ValidationError("Source réseau is required"));
  }

  const validatedData: CreateApplicationData = {
    entreprise,
    poste,
    emailEntreprise: body.emailEntreprise || undefined,
    contacts: body.contacts || undefined,
    dateCandidature: new Date(dateCandidature),
    statut: body.statut || "Pas encore postulé",
    sourceReseau,
    lettreMotivation: body.lettreMotivation,
    notes: body.notes,
    linkedinUrl: body.linkedinUrl,
    siteWeb: body.siteWeb,
    rappelDate: body.rappelDate ? new Date(body.rappelDate) : undefined,
  };

  return Ok.of(validatedData);
};

export const validateUpdateApplication = (
  body: any
): Result<UpdateApplicationData, ValidationError> => {
  const updateData: UpdateApplicationData = {};

  if (body.entreprise) updateData.entreprise = body.entreprise;
  if (body.poste) updateData.poste = body.poste;
  if (body.emailEntreprise) updateData.emailEntreprise = body.emailEntreprise;
  if (body.contacts) updateData.contacts = body.contacts;
  if (body.dateCandidature)
    updateData.dateCandidature = new Date(body.dateCandidature);
  if (body.statut) updateData.statut = body.statut;
  if (body.sourceReseau) updateData.sourceReseau = body.sourceReseau;
  if (body.lettreMotivation !== undefined)
    updateData.lettreMotivation = body.lettreMotivation;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.linkedinUrl !== undefined) updateData.linkedinUrl = body.linkedinUrl;
  if (body.siteWeb !== undefined) updateData.siteWeb = body.siteWeb;
  if (body.rappelDate) updateData.rappelDate = new Date(body.rappelDate);

  return Ok.of(updateData);
};
