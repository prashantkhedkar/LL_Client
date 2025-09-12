import { useState, useEffect, useCallback } from "react";
import {
  ObservationModel,
  ArticleListModel,
  ArticleCreateUpdateModel,
  ArticleSearchModel,
  ArticleStatsModel,
  ArticleLookupModel,
  DEFAULT_ARTICLE_SEARCH,
} from "../models/observationModel";
import articleService from "../services/observationService";

interface UseArticleState {
  // Data state
  articles: ObservationModel[];
  currentArticle: ObservationModel | null;
  stats: ArticleStatsModel | null;
  lookupData: ArticleLookupModel | null;

  // Pagination state
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;

  // Loading states
  loading: boolean;
  submitting: boolean;
  deleting: boolean;

  // Error state
  error: string | null;

  // Search parameters
  searchParams: ArticleSearchModel;
}

interface UseObservationActions {
  // Data actions
  loadArticles: (
    params?: Partial<ArticleSearchModel>
  ) => Promise<void>;
  loadArticleById: (id: number) => Promise<ObservationModel | null>;
  createArticle: (
    observation: ArticleCreateUpdateModel
  ) => Promise<number | null>;
  updateArticle: (
    id: number,
    observation: ArticleCreateUpdateModel
  ) => Promise<boolean>;
  deleteArticle: (id: number) => Promise<boolean>;

  // Status actions
  submitArticle: (id: number, notes?: string) => Promise<boolean>;
  approveArticle: (id: number, notes?: string) => Promise<boolean>;
  rejectArticle: (id: number, reason: string, notes?: string) => Promise<boolean>;
  archiveArticle: (id: number, reason: string) => Promise<boolean>;

  // Data loading actions
  loadStats: () => Promise<void>;
  loadLookupData: () => Promise<void>;

  // Utility actions
  clearError: () => void;
  resetCurrentArticle: () => void;
  updateSearchParams: (params: Partial<ArticleSearchModel>) => void;

  // Validation actions
  checkArticleTitleAvailability: (
    title: string,
    excludeId?: number
  ) => Promise<boolean>;
}

export function useObservation(): [
  UseArticleState,
  UseObservationActions
] {
  // State
  const [state, setState] = useState<UseArticleState>({
    articles: [],
    currentArticle: null,
    stats: null,
    lookupData: null,
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    loading: false,
    submitting: false,
    deleting: false,
    error: null,
    searchParams: DEFAULT_ARTICLE_SEARCH,
  });

  // Update state helper
  const updateState = useCallback((updates: Partial<UseArticleState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Load articles
  const loadArticles = useCallback(
    async (params?: Partial<ArticleSearchModel>): Promise<void> => {
      try {
        updateState({ loading: true, error: null });

        const searchParams = params
          ? { ...state.searchParams, ...params }
          : state.searchParams;

        console.log("🔍 Loading articles with params:", searchParams);

        const response = await articleService.getArticles(searchParams);

        console.log("📊 Articles response:", response);

        if (response.success && response.data) {
          const articlesArray = Array.isArray(response.data)
            ? response.data
            : [];

          const totalCount = articlesArray.length; // Adjust based on your API response structure

          console.log(
            `✅ Loaded ${articlesArray.length} articles, total: ${totalCount}`
          );

          updateState({
            articles: articlesArray,
            totalCount: totalCount,
            pageNumber: searchParams.pageNumber || 1,
            pageSize: searchParams.pageSize || 10,
            totalPages: Math.ceil(totalCount / (searchParams.pageSize || 10)),
            loading: false,
          });
        } else {
          console.log("❌ Articles API failed:", response.message);
          updateState({
            error: response.message || "Failed to load articles",
            loading: false,
            articles: [],
            totalCount: 0,
          });
        }
      } catch (error) {
        console.error("💥 Error in loadArticles:", error);
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
          articles: [],
          totalCount: 0,
        });
      }
    },
    [updateState]
  ); // Remove state.searchParams dependency to prevent infinite loops

  // Load observation by ID
  const loadArticleById = useCallback(
    async (id: number): Promise<ObservationModel | null> => {
      try {
        updateState({ loading: true, error: null });

        const response = await articleService.getArticleById(id);

        if (response.success && response.data) {
          updateState({
            currentArticle: response.data,
            loading: false,
          });
          return response.data;
        } else {
          updateState({
            error: response.message || "Failed to load observation",
            loading: false,
          });
          return null;
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
        });
        return null;
      }
    },
    [updateState]
  );

  // Create observation
  const createArticle = useCallback(
    async (
      observation: ArticleCreateUpdateModel
    ): Promise<number | null> => {
      try {
        updateState({ submitting: true, error: null });

        const response = await articleService.createArticle(observation);
        
        if (response.statusCode && response.data) {
          updateState({ submitting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return 1;
        } else {
          updateState({
            error: response.message || "Failed to create observation",
            submitting: false,
          });
          return null;
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          submitting: false,
        });
        return null;
      }
    },
    [updateState, loadArticles]
  );

  // Update observation
  const updateArticle = useCallback(
    async (
      id: number,
      observation: ArticleCreateUpdateModel
    ): Promise<boolean> => {
      try {
        updateState({ submitting: true, error: null });

        const response = await articleService.updateArticle(id, observation);

        if (response.statusCode && response.data) {
          updateState({ submitting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return true;
        } else {
          updateState({
            error: response.message || "Failed to update observation",
            submitting: false,
          });
          return false;
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          submitting: false,
        });
        return false;
      }
    },
    [updateState, loadArticles]
  );

  // Delete observation
  const deleteArticle = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        updateState({ deleting: true, error: null });

        const response = await articleService.deleteArticle(id);

        if (response.statusCode === 200 && response.data) {
          updateState({ deleting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return true;
        } else {
          updateState({
            error: response.message || "Failed to delete observation",
            deleting: false,
          });
          return false;
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          deleting: false,
        });
        return false;
      }
    },
    [updateState, loadArticles]
  );

  // Submit observation
  const submitArticle = useCallback(
    async (id: number, notes?: string): Promise<boolean> => {
      try {
        updateState({ submitting: true, error: null });

        const response = await articleService.submitArticle(id, notes);

        if (response.statusCode === 200 && response.data) {
          updateState({ submitting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return true;
        } else {
          updateState({
            error: response.message || "Failed to submit observation",
            submitting: false,
          });
          return false;
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          submitting: false,
        });
        return false;
      }
    },
    [updateState, loadArticles]
  );

  // Approve observation
  const approveArticle = useCallback(
    async (id: number, notes?: string): Promise<boolean> => {
      try {
        updateState({ submitting: true, error: null });

        const response = await articleService.approveArticle(id, notes);

        if (response.statusCode === 200 && response.data) {
          updateState({ submitting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return true;
        } else {
          updateState({
            error: response.message || "Failed to approve observation",
            submitting: false,
          });
          return false;
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          submitting: false,
        });
        return false;
      }
    },
    [updateState, loadArticles]
  );

  // Reject observation
  const rejectArticle = useCallback(
    async (id: number, reason: string, notes?: string): Promise<boolean> => {
      try {
        updateState({ submitting: true, error: null });

        const response = await articleService.rejectArticle(id, reason, notes);

        if (response.statusCode === 200 && response.data) {
          updateState({ submitting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return true;
        } else {
          updateState({
            error: response.message || "Failed to reject observation",
            submitting: false,
          });
          return false;
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          submitting: false,
        });
        return false;
      }
    },
    [updateState, loadArticles]
  );

  // Archive observation
  const archiveArticle = useCallback(
    async (id: number, reason: string): Promise<boolean> => {
      try {
        updateState({ submitting: true, error: null });

        const response = await articleService.archiveArticle(id, reason);

        if (response.statusCode === 200 && response.data) {
          updateState({ submitting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return true;
        } else {
          updateState({
            error: response.message || "Failed to archive observation",
            submitting: false,
          });
          return false;
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : "An error occurred",
          submitting: false,
        });
        return false;
      }
    },
    [updateState, loadArticles]
  );

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const response = await articleService.getArticleStats();

      if (response.success && response.data) {
        updateState({ stats: response.data });
        console.log("✅ Stats loaded successfully:", response.data);
      } else {
        console.log("❌ Stats API failed:", response.message);
      }
    } catch (error) {
      console.error("💥 Failed to load observation stats:", error);
    }
  }, [updateState]);

  // Load lookup data
  const loadLookupData = useCallback(async () => {
    try {
      const response = await articleService.getLookupData();

      if (response.success && response.data) {
        updateState({ lookupData: response.data });
      }
    } catch (error) {
      console.error("Failed to load lookup data:", error);
    }
  }, [updateState]);

  // Check observation title availability
  const checkArticleTitleAvailability = useCallback(
    async (title: string, excludeId?: number): Promise<boolean> => {
      try {
        const response = await articleService.checkArticleTitleAvailability(
          title,
          excludeId
        );

        if (response.success && response.data) {
          return response.data.isAvailable;
        }
        return false;
      } catch (error) {
        console.error("Failed to check observation title availability:", error);
        return false;
      }
    },
    []
  );

  // Reset current observation
  const resetCurrentArticle = useCallback(() => {
    updateState({ currentArticle: null });
  }, [updateState]);

  // Update search parameters
  const updateSearchParams = useCallback(
    (params: Partial<ArticleSearchModel>) => {
      updateState({ searchParams: { ...state.searchParams, ...params } });
    },
    [state.searchParams, updateState]
  );

  // Actions object
  const actions: UseObservationActions = {
    loadArticles,
    loadArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    submitArticle,
    approveArticle,
    rejectArticle,
    archiveArticle,
    loadStats,
    loadLookupData,
    clearError,
    resetCurrentArticle,
    updateSearchParams,
    checkArticleTitleAvailability,
  };

  // Load initial data only once
  // useEffect(() => {
  //   loadLookupData();
  // }, [loadLookupData]);

  return [state, actions];
}

export default useObservation;
