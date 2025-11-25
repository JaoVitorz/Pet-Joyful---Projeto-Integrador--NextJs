"use client";
import { useState, useEffect } from "react";
import { getMyAlbums, createAlbum, deleteAlbum } from "@/services/albumApi";
import { Album } from "@/types/album.types";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";
import Image from "next/image";

export default function AlbumsList() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlbumData, setNewAlbumData] = useState({
    titulo: "",
    descricao: "",
    privacidade: "publico" as "publico" | "privado" | "amigos",
  });

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const response = await getMyAlbums();
      setAlbums(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar álbuns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("[AlbumsList] Tentando criar álbum:", newAlbumData);
      await createAlbum(newAlbumData);
      console.log("[AlbumsList] Álbum criado com sucesso!");
      setShowCreateModal(false);
      setNewAlbumData({ titulo: "", descricao: "", privacidade: "publico" });
      loadAlbums();
    } catch (error: any) {
      console.error("[AlbumsList] Erro ao criar álbum:", error);

      let errorMessage = "Erro ao criar álbum";

      if (error.response) {
        // Erro da API
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = "Você precisa fazer login novamente";
        } else if (status === 400) {
          errorMessage = `Dados inválidos: ${
            data.message || data.error || "Verifique os campos"
          }`;
        } else if (status === 500) {
          errorMessage = "Erro no servidor. Tente novamente mais tarde.";
        } else {
          errorMessage = data.message || data.error || `Erro ${status}`;
        }
      } else if (error.request) {
        // Requisição enviada mas sem resposta
        errorMessage =
          "Não foi possível conectar ao servidor. Verifique sua internet.";
      } else {
        // Erro ao configurar requisição
        errorMessage = error.message || "Erro desconhecido";
      }

      alert(errorMessage);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (
      !confirm(
        "Tem certeza que deseja deletar este álbum? Todas as fotos serão removidas."
      )
    ) {
      return;
    }
    try {
      await deleteAlbum(albumId);
      loadAlbums();
    } catch (error) {
      console.error("Erro ao deletar álbum:", error);
      alert("Erro ao deletar álbum");
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Meus Álbuns</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-success d-flex align-items-center gap-2"
        >
          <FaPlus size={16} />
          Novo Álbum
        </button>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-5">
          <FaImage size={64} className="text-muted mb-3" />
          <h3 className="h5 mb-2">Nenhum álbum ainda</h3>
          <p className="text-muted mb-3">
            Crie seu primeiro álbum para começar a organizar suas fotos
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-success"
          >
            Criar Álbum
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {albums.map((album) => (
            <div key={album._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <a
                  href={`/albums/${album._id}`}
                  className="text-decoration-none"
                >
                  <div
                    style={{
                      aspectRatio: "1",
                      position: "relative",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    {album.capa ? (
                      <Image
                        src={album.capa}
                        alt={album.titulo}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <FaImage size={48} className="text-muted" />
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        padding: "1rem",
                      }}
                    >
                      <p className="text-white small mb-0">
                        {album.total_fotos}{" "}
                        {album.total_fotos === 1 ? "foto" : "fotos"}
                      </p>
                    </div>
                  </div>
                </a>

                <div className="card-body">
                  <h5 className="card-title text-truncate">{album.titulo}</h5>
                  {album.descricao && (
                    <p
                      className="card-text text-muted small"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {album.descricao}
                    </p>
                  )}
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="badge bg-secondary text-capitalize">
                      {album.privacidade}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAlbum(album._id);
                      }}
                      className="btn btn-link text-danger p-0"
                      title="Deletar álbum"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criar Álbum */}
      {showCreateModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Novo Álbum</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateAlbum}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Título *</label>
                    <input
                      type="text"
                      value={newAlbumData.titulo}
                      onChange={(e) =>
                        setNewAlbumData({
                          ...newAlbumData,
                          titulo: e.target.value,
                        })
                      }
                      className="form-control"
                      required
                      placeholder="Ex: Fotos com meu pet"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea
                      value={newAlbumData.descricao}
                      onChange={(e) =>
                        setNewAlbumData({
                          ...newAlbumData,
                          descricao: e.target.value,
                        })
                      }
                      className="form-control"
                      rows={3}
                      placeholder="Descreva seu álbum..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Privacidade</label>
                    <select
                      value={newAlbumData.privacidade}
                      onChange={(e) =>
                        setNewAlbumData({
                          ...newAlbumData,
                          privacidade: e.target.value as any,
                        })
                      }
                      className="form-select"
                    >
                      <option value="publico">Público</option>
                      <option value="amigos">Amigos</option>
                      <option value="privado">Privado</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewAlbumData({
                        titulo: "",
                        descricao: "",
                        privacidade: "publico",
                      });
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Criar Álbum
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
