"use client";

import { useState } from "react";
import Image from "next/image";
import { BiCheckCircle, BiEdit } from "react-icons/bi";
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

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        alert("Foto atualizada com sucesso!");
      }
    } catch (error: any) {
      console.error("[ProfileHeader] Erro ao enviar foto:", error);
      const msg =
        error?.response?.data?.message || error.message || String(error);
      setPhotoError(msg);
      alert("Erro ao enviar foto: " + msg);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="d-flex align-items-start">
        <div className="position-relative">
          <input
            id="profile-header-photo-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="d-none"
          />
          <label
            htmlFor="profile-header-photo-input"
            className="position-relative d-inline-block"
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                photoPreview && photoPreview !== ""
                  ? photoPreview
                  : avatar || "/assets/aatan-logo.jpg"
              }
              alt={`Foto do perfil de ${nome}`}
              className="rounded-circle border-3 border-success"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                display: "block",
              }}
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
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
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
                onClick={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="btn btn-success btn-sm"
              >
                {uploadingPhoto ? "Enviando..." : "Salvar Foto"}
              </button>
            </div>
          )}
          {photoError && (
            <div className="mt-2 text-danger small">{photoError}</div>
          )}
        </div>

        <div className="ms-4 flex-grow-1">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">{nome}</h2>
            <BiCheckCircle
              className="ms-2 text-success"
              size={20}
              aria-label="Conta verificada"
            />
          </div>

          <p className="text-muted mt-2">{bio}</p>
        </div>
      </div>
    </div>
  );
}
