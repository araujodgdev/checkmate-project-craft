import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// Types
type ProjectType = 'web' | 'mobile' | 'backend' | 'fullstack' | 'desktop';

interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  technologies: string[];
  progress: number;
  createdAt: string;
  deadline?: string;
}

interface Category {
  id: string;
  name: string;
  progress: number;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  setSessionUser: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<boolean>;
  initializeAuth: () => void;
}

interface ProjectState {
  projects: Project[];
  checklists: Record<string, Category[]>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'progress'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateTaskStatus: (projectId: string, categoryId: string, taskId: string, completed: boolean) => void;
  addTask: (projectId: string, categoryId: string, task: Omit<Task, 'id'>) => void;
  deleteTask: (projectId: string, categoryId: string, taskId: string) => void;
}

interface UIState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeFilter: 'all' | 'incomplete' | 'completed';
  setActiveFilter: (filter: 'all' | 'incomplete' | 'completed') => void;
}

// Mock data generator
const generateMockProject = (): Project => ({
  id: Math.random().toString(36).substring(2, 9),
  name: "New Project",
  description: "Project description",
  type: "web",
  technologies: ["React", "TypeScript"],
  progress: 0,
  createdAt: new Date().toISOString(),
});

// Auth Store real com Supabase
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,

      setSessionUser: (session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
        });
      },

      // Real login com Supabase
      login: async (email, password) => {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error || !data.session) {
          set({ user: null, session: null, isAuthenticated: false });
          return false;
        }
        set({
          session: data.session,
          user: data.session.user,
          isAuthenticated: true,
        });
        return true;
      },

      // Real signup com Supabase
      signup: async (email, password) => {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error || !data.session) {
          set({ user: null, session: null, isAuthenticated: false });
          return false;
        }
        set({
          session: data.session,
          user: data.session.user,
          isAuthenticated: true,
        });
        return true;
      },

      // Real logout com Supabase
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, isAuthenticated: false });
      },

      // Detectar sessão atual na inicialização e setar listeners
      initializeAuth: () => {
        // Setar primeiro o listener, depois buscar sessão.
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          set({
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session?.user,
          });
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
          set({
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session?.user,
          });
        });

        // Cleanup assinando a unsubscribe se necessário (pode ser usado no futuro)
        return () => {
          listener.subscription.unsubscribe();
        };
      },
    }),
    {
      name: 'checkmate-auth',
    }
  )
);

// Project Store
export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      checklists: {},
      addProject: (project) => {
        const newProject = {
          ...project,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          progress: 0,
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        return newProject.id;
      },
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        }));
      },
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },
      updateTaskStatus: (projectId, categoryId, taskId, completed) => {
        set((state) => {
          // Clone the current state
          const newChecklists = { ...state.checklists };
          
          if (!newChecklists[projectId]) return state;
          
          // Find and update the task
          const categoryIndex = newChecklists[projectId].findIndex(c => c.id === categoryId);
          if (categoryIndex === -1) return state;
          
          const taskIndex = newChecklists[projectId][categoryIndex].tasks.findIndex(t => t.id === taskId);
          if (taskIndex === -1) return state;
          
          // Update task
          newChecklists[projectId][categoryIndex].tasks[taskIndex].completed = completed;
          
          // Recalculate category progress
          const category = newChecklists[projectId][categoryIndex];
          const completedTasks = category.tasks.filter(t => t.completed).length;
          category.progress = Math.round((completedTasks / category.tasks.length) * 100);
          
          // Recalculate overall project progress
          const project = state.projects.find(p => p.id === projectId);
          if (project) {
            const allCategories = newChecklists[projectId];
            const totalTasks = allCategories.reduce((acc, cat) => acc + cat.tasks.length, 0);
            const allCompletedTasks = allCategories.reduce(
              (acc, cat) => acc + cat.tasks.filter(t => t.completed).length,
              0
            );
            const newProgress = Math.round((allCompletedTasks / totalTasks) * 100);
            
            // Update project progress
            const updatedProjects = state.projects.map(p => 
              p.id === projectId ? { ...p, progress: newProgress } : p
            );
            
            return {
              checklists: newChecklists,
              projects: updatedProjects
            };
          }
          
          return { checklists: newChecklists };
        });
      },
      addTask: (projectId, categoryId, task) => {
        set((state) => {
          const newChecklists = { ...state.checklists };
          
          if (!newChecklists[projectId]) return state;
          
          const categoryIndex = newChecklists[projectId].findIndex(c => c.id === categoryId);
          if (categoryIndex === -1) return state;
          
          const newTask = {
            ...task,
            id: Math.random().toString(36).substring(2, 9)
          };
          
          newChecklists[projectId][categoryIndex].tasks.push(newTask);
          
          // Recalculate category progress
          const category = newChecklists[projectId][categoryIndex];
          const completedTasks = category.tasks.filter(t => t.completed).length;
          category.progress = Math.round((completedTasks / category.tasks.length) * 100);
          
          return { checklists: newChecklists };
        });
      },
      deleteTask: (projectId, categoryId, taskId) => {
        set((state) => {
          const newChecklists = { ...state.checklists };
          
          if (!newChecklists[projectId]) return state;
          
          const categoryIndex = newChecklists[projectId].findIndex(c => c.id === categoryId);
          if (categoryIndex === -1) return state;
          
          newChecklists[projectId][categoryIndex].tasks = 
            newChecklists[projectId][categoryIndex].tasks.filter(t => t.id !== taskId);
          
          // Recalculate category progress
          const category = newChecklists[projectId][categoryIndex];
          if (category.tasks.length > 0) {
            const completedTasks = category.tasks.filter(t => t.completed).length;
            category.progress = Math.round((completedTasks / category.tasks.length) * 100);
          } else {
            category.progress = 0;
          }
          
          return { checklists: newChecklists };
        });
      }
    }),
    {
      name: 'checkmate-projects',
    }
  )
);

// UI Store
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      activeFilter: 'all',
      setActiveFilter: (filter) => set({ activeFilter: filter }),
    }),
    {
      name: 'checkmate-ui',
    }
  )
);
