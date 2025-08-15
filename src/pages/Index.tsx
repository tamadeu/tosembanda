import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Layout } from "@/components/Layout";
import { mockAnnouncements } from "@/lib/mock-data";

const Index = () => {
  return (
    <Layout title="MusiConnect">
      {mockAnnouncements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </Layout>
  );
};

export default Index;