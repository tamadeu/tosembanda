import { useState, useEffect, useRef, useCallback } from "react";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Layout } from "@/components/Layout";
import { mockAnnouncements, Announcement } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

const allMusicianAnnouncements = mockAnnouncements.filter(
  (a) => a.type === "musician"
);
const allBandAnnouncements = mockAnnouncements.filter((a) => a.type === "band");

const Index = () => {
  const [activeTab, setActiveTab] = useState("musicians");

  const [musicianAnnouncements, setMusicianAnnouncements] = useState<Announcement[]>([]);
  const [bandAnnouncements, setBandAnnouncements] = useState<Announcement[]>([]);

  const [musicianPage, setMusicianPage] = useState(1);
  const [bandPage, setBandPage] = useState(1);

  const [hasMoreMusicians, setHasMoreMusicians] = useState(true);
  const [hasMoreBands, setHasMoreBands] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);

  const observer = useRef<IntersectionObserver>();

  const loadMoreAnnouncements = useCallback((type: string) => {
    if (isLoading) return;
    setIsLoading(true);

    // Simula um pequeno atraso de rede para a experiência ser mais clara
    setTimeout(() => {
      if (type === "musicians") {
        const nextPage = musicianPage + 1;
        const newAnnouncements = allMusicianAnnouncements.slice(
          (nextPage - 1) * PAGE_SIZE,
          nextPage * PAGE_SIZE
        );
        setMusicianAnnouncements((prev) => [...prev, ...newAnnouncements]);
        setMusicianPage(nextPage);
        if (newAnnouncements.length < PAGE_SIZE) {
          setHasMoreMusicians(false);
        }
      } else if (type === "bands") {
        const nextPage = bandPage + 1;
        const newAnnouncements = allBandAnnouncements.slice(
          (nextPage - 1) * PAGE_SIZE,
          nextPage * PAGE_SIZE
        );
        setBandAnnouncements((prev) => [...prev, ...newAnnouncements]);
        setBandPage(nextPage);
        if (newAnnouncements.length < PAGE_SIZE) {
          setHasMoreBands(false);
        }
      }
      setIsLoading(false);
    }, 500);
  }, [isLoading, musicianPage, bandPage]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      const hasMore = activeTab === 'musicians' ? hasMoreMusicians : hasMoreBands;
      if (!hasMore) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreAnnouncements(activeTab);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreAnnouncements, activeTab, hasMoreMusicians, hasMoreBands]
  );

  // Carregamento inicial
  useEffect(() => {
    setMusicianAnnouncements(allMusicianAnnouncements.slice(0, PAGE_SIZE));
    setBandAnnouncements(allBandAnnouncements.slice(0, PAGE_SIZE));
  }, []);

  const renderAnnouncements = (announcements: Announcement[], hasMore: boolean) => (
    <div className="mt-4 space-y-4">
      {announcements.map((announcement, index) => {
        if (index === announcements.length - 1) {
          return (
            <div ref={lastElementRef} key={announcement.id}>
              <AnnouncementCard announcement={announcement} />
            </div>
          );
        }
        return <AnnouncementCard key={announcement.id} announcement={announcement} />;
      })}
      {isLoading && (
        <>
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </>
      )}
      {!hasMore && announcements.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Você chegou ao fim.
        </p>
      )}
    </div>
  );

  return (
    <Layout title="MusiConnect">
      <Tabs 
        defaultValue="musicians" 
        className="w-full" 
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="musicians">Músicos Procurando</TabsTrigger>
          <TabsTrigger value="bands">Bandas Procurando</TabsTrigger>
        </TabsList>
        <TabsContent value="musicians">
          {renderAnnouncements(musicianAnnouncements, hasMoreMusicians)}
        </TabsContent>
        <TabsContent value="bands">
          {renderAnnouncements(bandAnnouncements, hasMoreBands)}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;