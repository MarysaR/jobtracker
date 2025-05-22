import React from "react";
import type { Application } from "../utils/types";

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "Pas encore postulé":
        return "bg-gray-100 text-gray-800";
      case "Postulé":
        return "bg-blue-100 text-blue-800";
      case "Relance":
        return "bg-yellow-100 text-yellow-800";
      case "Entretien":
        return "bg-green-100 text-green-800";
      case "Refusé":
        return "bg-red-100 text-red-800";
      case "Accepté":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {application.entreprise}
          </h3>
          <p className="text-gray-600">{application.poste}</p>
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            application.statut
          )}`}
        >
          {application.statut}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div>
          <span className="font-medium">Contact:</span> {application.contacts}
        </div>
        <div>
          <span className="font-medium">Source:</span>{" "}
          {application.sourceReseau}
        </div>
        <div>
          <span className="font-medium">Date:</span>{" "}
          {formatDate(application.dateCandidature)}
        </div>
        {application.notes && (
          <div>
            <span className="font-medium">Notes:</span> {application.notes}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="flex space-x-4 mb-4">
        {application.linkedinUrl && (
          <a
            href={application.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            LinkedIn
          </a>
        )}
        {application.siteWeb && (
          <a
            href={application.siteWeb}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Site web
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(application)}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(application.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
