"use client";

import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { profileService } from "@/services/profileApi";

interface ProfileHeaderProps {
  nome?: string;
  bio?: string;
  avatar?: string;
  onAvatarUpdate?: (newAvatar: string) => void;
}

export default function ProfileHeader({
  nome = "AATAN - Sorocaba",
  bio = "Associação de proteção animal oferecendo abrigo e cuidados para animais em situação de vulnerabilidade.",
  avatar = "/assets/aatan-logo.jpg",
  onAvatarUpdate,
}: ProfileHeaderProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(avatar);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string>("");
  const [photoMessage, setPhotoMessage] = useState<string>("");

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(avatar || "/assets/aatan-logo.jpg");
    }
  }, [avatar, photoFile]);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError("");
    setPhotoMessage("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("Escolha um arquivo de imagem válido.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("A foto deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    try {
      setPhotoError("");
      setUploadingPhoto(true);
      console.log("[ProfileHeader] Enviando foto, arquivo:", photoFile);
      const response = await profileService.uploadProfilePhoto(photoFile);
      console.log("[ProfileHeader] resposta upload:", response);
      if (response.success && response.data) {
        console.log(
          "[ProfileHeader] Nova URL da foto:",
          response.data.foto_perfil
        );
        setPhotoFile(null);
        setPhotoPreview(response.data.foto_perfil);
        onAvatarUpdate?.(response.data.foto_perfil);
        setPhotoMessage("Foto atualizada com sucesso.");
      }
    } catch (error: unknown) {
      console.error("[ProfileHeader] Erro ao enviar foto:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg = err?.response?.data?.message || err.message || String(error);
      setPhotoError(msg);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="bg-white p-3 p-md-4 rounded shadow mb-4">
      <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 gap-sm-4">
        <div className="position-relative flex-shrink-0 text-center">
          <input
            id="profile-header-photo-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="visually-hidden"
            aria-label="Escolher foto do perfil"
          />
          <label
            htmlFor="profile-header-photo-input"
            className="profile-photo-label position-relative d-inline-block"
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                photoPreview && photoPreview !== ""
                  ? photoPreview
                  : avatar || "/assets/aatan-logo.jpg"
              }
              alt={`Foto do perfil de ${nome}`}
              className="profile-header-avatar rounded-circle border border-3 border-success"
              onError={(e) => {
                e.currentTarget.src = "/assets/aatan-logo.jpg";
              }}
            />

            {/* Overlay ao passar o mouse */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
            >
              <div className="text-white text-center">
                <BiEdit size={24} className="mb-1" />
                <div style={{ fontSize: "12px" }}>Alterar</div>
              </div>
            </div>
          </label>

          {/* Botão para salvar a foto selecionada */}
          {photoFile && (
            <div className="mt-2">
              <button
                type="button"
                onClick={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="btn btn-success btn-sm"
              >
                {uploadingPhoto ? "Enviando..." : "Salvar Foto"}
              </button>
            </div>
          )}
          {photoError && (
            <div className="mt-2 text-danger small" role="alert">{photoError}</div>
          )}
          {photoMessage && (
            <div className="mt-2 text-success small" role="status">{photoMessage}</div>
          )}
        </div>

        <div className="flex-grow-1 text-center text-sm-start min-w-0">
          <h2 className="mb-0 text-break">{nome}</h2>

          <p className="text-muted mt-2 mb-0" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{bio}</p>
        </div>
      </div>
      <style jsx>{`
        .profile-header-avatar {
          width: 104px;
          height: 104px;
          object-fit: cover;
          display: block;
        }
        @media (min-width: 576px) {
          .profile-header-avatar {
            width: 120px;
            height: 120px;
          }
        }
        .profile-photo-label:hover > div:last-child,
        .profile-photo-label:focus-visible > div:last-child {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

