"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum,
} from "@/services/albumApi";
import { Album, Foto } from "@/types/album.types";
import { FaArrowLeft, FaUpload, FaTrash, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AlbumViewProps {
  albumId: string;
}

export default function AlbumView({ albumId }: AlbumViewProps) {
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Foto | null>(null);

  const loadAlbum = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAlbum(albumId);
      setAlbum(response.data);
    } catch (error) {
      console.error("Erro ao carregar álbum:", error);
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => {
    loadAlbum();
  }, [loadAlbum]);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await addPhotoToAlbum(albumId, file);
      await loadAlbum();
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload da foto");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async (fotoId: string) => {
    if (!confirm("Deseja remover esta foto?")) return;

    try {
      await removePhotoFromAlbum(albumId, fotoId);
      await loadAlbum();
      setSelectedPhoto(null);
    } catch (error) {
      console.error("Erro ao remover foto:", error);
      alert("Erro ao remover foto");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!album) {
    return <div className="text-center py-5">Álbum não encontrado</div>;
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 mb-3"
        >
          <FaArrowLeft size={16} />
          Voltar
        </button>

        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <h1 className="h3 mb-2">{album.titulo}</h1>
            {album.descricao && (
              <p className="text-muted mb-2">{album.descricao}</p>
            )}
            <p className="small text-muted mb-0">
              {album.total_fotos} {album.total_fotos === 1 ? "foto" : "fotos"}
            </p>
          </div>

          <label className="btn btn-success d-flex align-items-center gap-2">
            <FaUpload size={16} />
            {uploading ? "Enviando..." : "Adicionar Fotos"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
              disabled={uploading}
              className="d-none"
            />
          </label>
        </div>
      </div>

      {/* Grid de Fotos */}
      {album.fotos.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-3">Nenhuma foto neste álbum ainda</p>
          <label className="btn btn-success">
            Adicionar Primeira Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
              disabled={uploading}
              className="d-none"
            />
          </label>
        </div>
      ) : (
        <div className="row g-3">
          {album.fotos.map((foto) => (
            <div key={foto._id} className="col-6 col-md-4 col-lg-3">
              <div
                className="position-relative overflow-hidden rounded"
                style={{ aspectRatio: "1", cursor: "pointer" }}
                onClick={() => setSelectedPhoto(foto)}
              >
                <Image
                  src={foto.url}
                  alt={foto.legenda || "Foto"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "rgba(0,0,0,0)",
                    transition: "background-color 0.3s ease",
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)";
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
                    e.currentTarget.style.opacity = "0";
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(foto._id);
                    }}
                    className="btn btn-danger btn-sm rounded-circle"
                    title="Remover foto"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Visualização de Foto */}
      {selectedPhoto && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-transparent border-0">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="btn btn-link text-white position-absolute top-0 end-0 m-3"
                style={{ zIndex: 1 }}
              >
                <FaTimes size={24} />
              </button>

              <div
                className="text-center"
                style={{ position: "relative", minHeight: "400px" }}
              >
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.legenda || "Foto"}
                  width={1200}
                  height={800}
                  className="img-fluid"
                  style={{
                    maxHeight: "80vh",
                    objectFit: "contain",
                    width: "auto",
                    height: "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                {selectedPhoto.legenda && (
                  <p className="text-white mt-3">{selectedPhoto.legenda}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
