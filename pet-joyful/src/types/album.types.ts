export interface Foto {
  _id: string;
  url: string;
  public_id: string;
  legenda?: string;
  ordem: number;
  data_upload: string;
}

export interface Album {
  _id: string;
  userId: string;
  titulo: string;
  descricao?: string;
  fotos: Foto[];
  capa?: string;
  privacidade: "publico" | "privado" | "amigos";
  total_fotos: number;
  createdAt: string;
  updatedAt: string;
}
