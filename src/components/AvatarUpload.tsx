import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';
import { showError } from '@/utils/toast';

interface AvatarUploadProps {
  initialUrl: string | null;
  onUpload: (url: string) => void;
}

export const AvatarUpload = ({ initialUrl, onUpload }: AvatarUploadProps) => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setAvatarUrl(initialUrl);
  }, [initialUrl]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setIsUploading(true);

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      showError('Erro ao enviar o avatar.');
      console.error(uploadError);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    setAvatarUrl(publicUrl);
    onUpload(publicUrl);
    setIsUploading(false);
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24 border-4 border-primary">
        <AvatarImage src={avatarUrl || undefined} alt="Avatar do usuário" />
        <AvatarFallback>{userInitial}</AvatarFallback>
      </Avatar>
      <Button asChild variant="outline">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isUploading ? 'Enviando...' : 'Trocar Foto'}
          <Input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </Button>
    </div>
  );
};