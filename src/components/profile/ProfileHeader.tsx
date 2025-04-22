
import { User } from "@supabase/supabase-js";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <h1 className="text-2xl font-bold">Perfil</h1>
      </CardHeader>
      <CardContent>
        <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-4`}>
          <Avatar className={`${isMobile ? "h-16 w-16" : "h-20 w-20"}`}>
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              <UserIcon className={`${isMobile ? "h-8 w-8" : "h-10 w-10"}`} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{user.email}</h2>
            <p className="text-muted-foreground">
              Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
