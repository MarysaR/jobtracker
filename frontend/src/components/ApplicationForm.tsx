import React, { useState } from "react";
import type { Application, CreateApplicationData } from "../utils/types";
import { STATUTS, SOURCES_RESEAU } from "../utils/types";

interface ApplicationFormProps {
  application?: Application; // undefined = création, défini = modification
  onSubmit: (data: CreateApplicationData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateApplicationData>({
    entreprise: application?.entreprise || "",
    poste: application?.poste || "",
    emailEntreprise: application?.emailEntreprise || "",
    contacts: application?.contacts || "",
    dateCandidature: application?.dateCandidature
      ? application.dateCandidature.split("T")[0]
      : new Date().toISOString().split("T")[0],
    statut: application?.statut || "Pas encore postulé",
    sourceReseau: application?.sourceReseau || "",
    lettreMotivation: application?.lettreMotivation || "",
    notes: application?.notes || "",
    linkedinUrl: application?.linkedinUrl || "",
    siteWeb: application?.siteWeb || "",
    rappelDate: application?.rappelDate
      ? application.rappelDate.split("T")[0]
      : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-orange-200/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-orange-200/50">
        <div className="p-6">
          <h2 className="text-xl font-bold text-orange-900 mb-6">
            {application ? "Modifier la candidature" : "Nouvelle candidature"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Entreprise & Poste */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="entreprise"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Entreprise *
                </label>
                <input
                  type="text"
                  id="entreprise"
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="poste"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Poste *
                </label>
                <input
                  type="text"
                  id="poste"
                  name="poste"
                  value={formData.poste}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email & Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="emailEntreprise"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email entreprise
                </label>
                <input
                  type="email"
                  id="emailEntreprise"
                  name="emailEntreprise"
                  value={formData.emailEntreprise}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Email entreprise"
                />
              </div>

              <div>
                <label
                  htmlFor="contacts"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contacts
                </label>
                <input
                  type="text"
                  id="contacts"
                  name="contacts"
                  value={formData.contacts}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Contacts"
                />
              </div>
            </div>

            {/* Date, Statut, Source */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="dateCandidature"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date candidature *
                </label>
                <input
                  type="date"
                  id="dateCandidature"
                  name="dateCandidature"
                  value={formData.dateCandidature}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="statut"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Statut
                </label>
                <select
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {STATUTS.map((statut) => (
                    <option key={statut} value={statut}>
                      {statut}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sourceReseau"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Source *
                </label>
                <select
                  id="sourceReseau"
                  name="sourceReseau"
                  value={formData.sourceReseau}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  {SOURCES_RESEAU.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="linkedinUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="siteWeb"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Site web
                </label>
                <input
                  type="url"
                  id="siteWeb"
                  name="siteWeb"
                  value={formData.siteWeb}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Texte areas */}
            <div>
              <label
                htmlFor="lettreMotivation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lettre de motivation
              </label>
              <textarea
                id="lettreMotivation"
                name="lettreMotivation"
                rows={3}
                value={formData.lettreMotivation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="rappelDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date de rappel
              </label>
              <input
                type="date"
                id="rappelDate"
                name="rappelDate"
                value={formData.rappelDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-6 py-3 text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-lg font-medium disabled:opacity-50 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-bold disabled:opacity-50 transition-all shadow-lg"
              >
                {loading
                  ? "⏳ Enregistrement..."
                  : application
                  ? "Modifier"
                  : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
