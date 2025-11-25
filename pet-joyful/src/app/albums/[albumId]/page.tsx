import AlbumView from "@/app/components/albums/AlbumView";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;

  return (
    <>
      <Header />
      <AlbumView albumId={albumId} />
      <Footer />
    </>
  );
}
