
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProjects } from "./useProjects";

// Mocks necessários
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: {}, error: null }),
    }),
  },
}));

vi.mock("@/lib/store", () => ({
  useAuthStore: () => ({ user: { id: "user-id" } }),
}));

// Renderização básica
describe("useProjects", () => {
  it("deve retornar projects (array) e flags de loading/error", async () => {
    const { result, waitFor } = renderHook(() => useProjects());

    await waitFor(() => result.current.isLoading === false);

    expect(Array.isArray(result.current.projects)).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeFalsy();
  });

  it("método createProject deveria permitir criar projeto", async () => {
    const { result } = renderHook(() => useProjects());
    const spy = vi.spyOn(result.current.createProject, "mutateAsync");

    await act(async () => {
      await result.current.createProject.mutateAsync({
        name: "Teste",
        type: "web",
        technologies: ["React"],
      });
    });

    expect(spy).toHaveBeenCalled();
  });

  it("updateProject e deleteProject devem estar disponíveis no hook", () => {
    const { result } = renderHook(() => useProjects());
    expect(typeof result.current.updateProject.mutateAsync).toBe("function");
    expect(typeof result.current.deleteProject.mutateAsync).toBe("function");
  });
});
