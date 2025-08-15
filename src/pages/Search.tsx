import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <Layout title="Buscar">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Busque por músicos, bandas..."
          className="pl-10 w-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground">Faça uma busca para encontrar músicos, bandas e oportunidades.</p>
      </div>
    </Layout>
  );
};

export default Search;