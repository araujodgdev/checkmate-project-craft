
import { useAuthStore } from "@/lib/store";
import { useProjects } from "@/hooks/useProjects";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAnalytics } from "@/components/profile/ProfileAnalytics";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const { projects } = useProjects();
  const isMobile = useIsMobile();

  if (!user) return null;

  return (
    <MainLayout className={isMobile ? "p-1" : "p-6"}>
      <div className={`${isMobile ? "mx-2" : "mx-6"} max-w-7xl space-y-4`}>
        <ProfileHeader user={user} />
        <ProfileAnalytics projects={projects || []} />
      </div>
    </MainLayout>
  );
}
