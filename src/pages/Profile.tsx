
import { useAuthStore } from "@/lib/store";
import { useProjects } from "@/hooks/useProjects";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAnalytics } from "@/components/profile/ProfileAnalytics";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const { projects } = useProjects();

  if (!user) return null;

  return (
    <MainLayout className="p-6 space-y-6">
      <ProfileHeader user={user} />
      <ProfileAnalytics projects={projects || []} />
    </MainLayout>
  );
}
