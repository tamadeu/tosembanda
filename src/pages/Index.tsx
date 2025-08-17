import { useState, useEffect, useRef, useCallback } from "react";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Layout } from "@/components/Layout";
import { AnnouncementWithProfile } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 10;

const Index = () => {
  const [activeTab, setActiveTab] = useState("musicians");
  const [announcements, setAnnouncements] = useState<{ [key: string]: AnnouncementWithProfile[] }>({
    musicians: [],
    bands: [],
  });
  const [page, setPage] = useState<{ [key: string]: number }>({
    musicians: 1,
    bands: 1,
  });
  const [hasMore, setHasMore] = useState<{ [key: string]: boolean }>({
    musicians: true,
    bands: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const observer = useRef<IntersectionObserver>();

  const fetchAnnouncements = useCallback(async (tab: string, pageToFetch: number) => {
    if (isLoading || !hasMore[tab]) return;
    setIsLoading(true);

    const type = tab === 'musicians' ? 'musician' : 'band';
    const from = (pageToFetch - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('announcements')
      .select('*, profile:profiles(name, avatar_url)')
      .eq('type', type)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching announcements:", error);
    } else if (data) {
      setAnnouncements(prev => ({
        ...prev,
        [tab]: pageToFetch === 1 ? data : [...prev[tab], ...data],
      }));
      setPage(prev => ({ ...prev, [tab]: pageToFetch + 1 }));
      if (data.length < PAGE_SIZE) {
        setHasMore(prev => ({ ...prev, [tab]: false }));
      }
    }
    setIsLoading(false);
    if (initialLoad) setInitialLoad(false);
  }, [isLoading, hasMore, initialLoad]);

  useEffect(() => {
    fetchAnnouncements('musicians', 1);
    fetchAnnouncements('bands', 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      if (!hasMore[activeTab]) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchAnnouncements(activeTab, page[activeTab]);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, fetchAnnouncements, activeTab, hasMore, page]
  );

  const renderAnnouncements = (type: 'musicians' | 'bands') => {
    const data = announcements[type];
    const moreToLoad = hasMore[type];

    if (initialLoad && data.length === 0) {
      return (
        <div className="mt-4 space-y-4">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-4">
        {data.map((announcement, index) => {
          if (index === data.length - 1) {
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
        {!moreToLoad && data.length > 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Você chegou ao fim.
          </p>
        )}
        {!moreToLoad && data.length === 0 && !isLoading && (
            <p className="text-center text-sm text-muted-foreground py-4">
                Nenhum anúncio encontrado.
            </p>
        )}
      </div>
    );
  };

  return (
    <Layout title="To Sem Banda">
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
          {renderAnnouncements('musicians')}
        </TabsContent>
        <TabsContent value="bands">
          {renderAnnouncements('bands')}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;