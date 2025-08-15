import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Layout } from "@/components/Layout";
import { mockAnnouncements } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const musicianAnnouncements = mockAnnouncements.filter(
    (a) => a.type === "musician"
  );
  const bandAnnouncements = mockAnnouncements.filter((a) => a.type === "band");

  return (
    <Layout title="MusiConnect">
      <Tabs defaultValue="musicians" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="musicians">Músicos Procurando</TabsTrigger>
          <TabsTrigger value="bands">Bandas Procurando</TabsTrigger>
        </TabsList>
        <TabsContent value="musicians" className="mt-4 space-y-4">
          {musicianAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </TabsContent>
        <TabsContent value="bands" className="mt-4 space-y-4">
          {bandAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;