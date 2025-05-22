import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationForm from "../components/ApplicationForm";
import ConfirmationModal from "../components/ConfirmationModal";
import { applicationApi } from "../services/api";

import type {
  Application,
  ApplicationWithPagination,
  CreateApplicationData,
} from "../utils/types";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ApplicationWithPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState<
    Application | undefined
  >();
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingApplicationId, setDeletingApplicationId] = useState<
    string | null
  >(null);
  const [deletingApplicationName, setDeletingApplicationName] =
    useState<string>("");

  const fetchApplications = async () => {
    setLoading(true);

    const result = await applicationApi.getAll();

    if (result.isOk()) {
      setData(result.value);
      setError(null);
    } else {
      setError(result.error.message);
      setData(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleNewApplication = () => {
    setEditingApplication(undefined);
    setShowForm(true);
  };

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: CreateApplicationData) => {
    setFormLoading(true);

    let result;
    if (editingApplication) {
      // Modification
      result = await applicationApi.update(editingApplication.id, formData);
    } else {
      // Création
      result = await applicationApi.create(formData);
    }

    if (result.isOk()) {
      setShowForm(false);
      setEditingApplication(undefined);
      await fetchApplications(); // Recharger la liste
    } else {
      alert(`Erreur: ${result.error.message}`);
    }

    setFormLoading(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingApplication(undefined);
  };

  const handleDelete = async (id: string) => {
    const application = data?.applications.find((app) => app.id === id);
    if (application) {
      setDeletingApplicationId(id);
      setDeletingApplicationName(application.entreprise);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!deletingApplicationId) return;

    const result = await applicationApi.delete(deletingApplicationId);

    if (result.isOk()) {
      await fetchApplications(); // Recharger la liste
    } else {
      alert(`Erreur: ${result.error.message}`);
    }

    setShowDeleteModal(false);
    setDeletingApplicationId(null);
    setDeletingApplicationName("");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingApplicationId(null);
    setDeletingApplicationName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
        <div className="text-lg text-orange-800 font-medium">
          🔄 Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <div className="text-red-600 font-medium">❌ {error}</div>
          <button
            onClick={fetchApplications}
            className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-orange-200">
      <Header onNewApplication={handleNewApplication} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-orange-900 mb-4">
            Vos candidatures ({data?.pagination.total || 0})
          </h2>
        </div>

        {/* Applications Grid */}
        {data?.applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200">
              <p className="text-orange-700 text-lg mb-6 font-medium">
                Aucune candidature pour le moment
              </p>
              <button
                onClick={handleNewApplication}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all text-lg"
              >
                Créer votre première candidature
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Formulaire */}
      {showForm && (
        <ApplicationForm
          application={editingApplication}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}

      {/* Modal Confirmation Suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Supprimer la candidature"
        message={`Êtes-vous sûr de vouloir supprimer définitivement la candidature chez "${deletingApplicationName}" ? Cette action ne peut pas être annulée.`}
        confirmText="🗑️ Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger={true}
      />
    </div>
  );
};

export default Dashboard;
