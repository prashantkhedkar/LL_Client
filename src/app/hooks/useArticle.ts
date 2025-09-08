import { useState, useEffect, useCallback } from "react";
import {
  ArticleModel,
  ArticleListModel,
  ArticleCreateUpdateModel,
  ArticleSearchModel,
  ArticleStatsModel,
  ArticleLookupModel,
  DEFAULT_ARTICLE_SEARCH,
} from "../models/article/articleModels";
import articleService from "../services/articleService";

interface UseArticleState {
  // Data state
  articles: ArticleModel[];
  currentArticle: ArticleModel | null;
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

interface UseArticleActions {
  // Data actions
  loadArticles: (
    params?: Partial<ArticleSearchModel>
  ) => Promise<void>;
  loadArticleById: (id: number) => Promise<ArticleModel | null>;
  createArticle: (
    article: ArticleCreateUpdateModel
  ) => Promise<number | null>;
  updateArticle: (
    id: number,
    article: ArticleCreateUpdateModel
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

export function useArticle(): [
  UseArticleState,
  UseArticleActions
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

  // Load article by ID
  const loadArticleById = useCallback(
    async (id: number): Promise<ArticleModel | null> => {
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
            error: response.message || "Failed to load article",
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

  // Create article
  const createArticle = useCallback(
    async (
      article: ArticleCreateUpdateModel
    ): Promise<number | null> => {
      try {
        updateState({ submitting: true, error: null });

        const response = await articleService.createArticle(article);
        
        if (response.statusCode && response.data) {
          updateState({ submitting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return 1;
        } else {
          updateState({
            error: response.message || "Failed to create article",
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

  // Update article
  const updateArticle = useCallback(
    async (
      id: number,
      article: ArticleCreateUpdateModel
    ): Promise<boolean> => {
      try {
        updateState({ submitting: true, error: null });

        const response = await articleService.updateArticle(id, article);

        if (response.statusCode && response.data) {
          updateState({ submitting: false });
          // Reload articles to get the updated list
          await loadArticles();
          return true;
        } else {
          updateState({
            error: response.message || "Failed to update article",
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

  // Delete article
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
            error: response.message || "Failed to delete article",
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

  // Submit article
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
            error: response.message || "Failed to submit article",
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

  // Approve article
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
            error: response.message || "Failed to approve article",
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

  // Reject article
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
            error: response.message || "Failed to reject article",
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

  // Archive article
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
            error: response.message || "Failed to archive article",
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
      console.error("💥 Failed to load article stats:", error);
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

  // Check article title availability
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
        console.error("Failed to check article title availability:", error);
        return false;
      }
    },
    []
  );

  // Reset current article
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
  const actions: UseArticleActions = {
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
  useEffect(() => {
    loadLookupData();
  }, [loadLookupData]);

  return [state, actions];
}

export default useArticle;
