import {
  ArticleModel,
  ArticleListModel,
  ArticleSearchModel,
  ArticleCreateUpdateModel,
  ArticleStatsModel,
  ArticleHistoryModel,
  ArticleLookupModel,
  SubmitArticleRequest,
  ApproveArticleRequest,
  RejectArticleRequest,
  ArchiveArticleRequest,
  ArticleApiResponse,
} from "../models/article/articleModels";
import { requests } from "../helper/axiosInterceptor";
import { responseType } from "../models/global/responseResult";

class ArticleService {
  private baseURL = "/Observation";

  // Get articles with search and pagination
  async getArticles(
    searchParams: ArticleSearchModel
  ): Promise<ArticleApiResponse<ArticleModel[]>> {
    try {
      console.log(
        "🌐 Making API call to articles search with params:",
        searchParams
      );
      const response = await requests.post<responseType>(
        `${this.baseURL}/search`,
        searchParams
      );

      console.log("📡 Raw API response for articles:", response);

      if (response.statusCode === 200 && response.data) {
        // API returns articles directly as an array
        const articlesArray = Array.isArray(response.data)
          ? response.data
          : [];

        const result = {
          success: true,
          message: response.message || "Articles retrieved successfully",
          data: articlesArray as ArticleModel[],
          statusCode: response.statusCode,
        };
        console.log("✅ Returning formatted articles response:", result);
        return result;
      } else {
        console.log("❌ Articles API response failed:", response);
        return {
          success: false,
          message: response.message || "Failed to fetch articles",
          statusCode: response.statusCode || 500,
        };
      }
    } catch (error: any) {
      console.error("Error fetching articles:", error);
      return {
        data: [],
        success: false,
        message: error.message || "Failed to fetch articles",
        statusCode: 500,
      };
    }
  }

  async getAllArticles(): Promise<ArticleApiResponse<ArticleModel[]>> {
    try {
      const response = await requests.get<responseType>(
        `${this.baseURL}/GetAllArticles`
      );

      console.log("📡 Raw API response for articles:", response);

      if (response.statusCode === 200 && response.data) {
        // API returns articles directly as an array
        const articlesArray = Array.isArray(response.data)
          ? response.data
          : [];

        const result = {
          success: true,
          message: response.message || "Articles retrieved successfully",
          data: articlesArray as ArticleModel[],
          statusCode: response.statusCode,
        };
        console.log("✅ Returning formatted articles response:", result);
        return result;
      } else {
        console.log("❌ Articles API response failed:", response);
        return {
          success: false,
          message: response.message || "Failed to fetch articles",
          statusCode: response.statusCode || 500,
        };
      }
    } catch (error: any) {
      console.error("Error fetching articles:", error);
      return {
        data: [],
        success: false,
        message: error.message || "Failed to fetch articles",
        statusCode: 500,
      };
    }
  }

  // Get article by ID
  async getArticleById(
    articleId: number
  ): Promise<ArticleApiResponse<ArticleModel>> {
    try {
      const response = await requests.get<responseType>(
        `${this.baseURL}/GetArticleById/${articleId}`
      );

      if (response.statusCode === 200 && response.data) {
        return {
          success: true,
          message: response.message || "Article retrieved successfully",
          data: response.data as any as ArticleModel,
          statusCode: response.statusCode,
        };
      } else {
        return {
          success: false,
          message: response.message || "Article not found",
          statusCode: response.statusCode || 404,
        };
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      return {
        success: false,
        message: "Failed to fetch article",
        statusCode: 500,
      };
    }
  }

  // Create new article
  async createArticle(
    article: ArticleCreateUpdateModel
  ): Promise<ArticleApiResponse<{ articleId: number }>> {
    try {
        debugger;
      const response = await requests.post<
        ArticleApiResponse<{ articleId: number }>
      >(`${this.baseURL}/Create?submissionStatus=Draft`, article);
      return response;
    } catch (error) {
      console.error("Error creating article:", error);
      return {
        success: false,
        message: "Failed to create article",
        statusCode: 500,
      };
    }
  }

  // Update existing article
  async updateArticle(
    articleId: number,
    article: ArticleCreateUpdateModel
  ): Promise<ArticleApiResponse<void>> {
    try {
      const response = await requests.put<ArticleApiResponse<void>>(
        `${this.baseURL}/${articleId}/UpdateArticle`,
        article
      );
      return response;
    } catch (error) {
      console.error("Error updating article:", error);
      return {
        success: false,
        message: "Failed to update article",
        statusCode: 500,
      };
    }
  }

  // Delete article
  async deleteArticle(
    articleId: number
  ): Promise<ArticleApiResponse<void>> {
    try {
      const response = await requests.delete<ArticleApiResponse<void>>(
        `${this.baseURL}/DeleteArticle/${articleId}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting article:", error);
      return {
        success: false,
        message: "Failed to delete article",
        statusCode: 500,
      };
    }
  }

  // Submit article
  async submitArticle(
    articleId: number,
    notes?: string
  ): Promise<ArticleApiResponse<void>> {
    try {
      const request: SubmitArticleRequest = { notes };
      const response = await requests.put<ArticleApiResponse<void>>(
        `${this.baseURL}/${articleId}/submit`,
        request
      );
      return response;
    } catch (error) {
      console.error("Error submitting article:", error);
      return {
        success: false,
        message: "Failed to submit article",
        statusCode: 500,
      };
    }
  }

  // Approve article
  async approveArticle(
    articleId: number,
    notes?: string
  ): Promise<ArticleApiResponse<void>> {
    try {
      const request: ApproveArticleRequest = { notes };
      const response = await requests.put<ArticleApiResponse<void>>(
        `${this.baseURL}/${articleId}/approve`,
        request
      );
      return response;
    } catch (error) {
      console.error("Error approving article:", error);
      return {
        success: false,
        message: "Failed to approve article",
        statusCode: 500,
      };
    }
  }

  // Reject article
  async rejectArticle(
    articleId: number,
    reason: string,
    notes?: string
  ): Promise<ArticleApiResponse<void>> {
    try {
      const request: RejectArticleRequest = { reason, notes };
      const response = await requests.put<ArticleApiResponse<void>>(
        `${this.baseURL}/${articleId}/reject`,
        request
      );
      return response;
    } catch (error) {
      console.error("Error rejecting article:", error);
      return {
        success: false,
        message: "Failed to reject article",
        statusCode: 500,
      };
    }
  }

  // Archive article
  async archiveArticle(
    articleId: number,
    reason: string
  ): Promise<ArticleApiResponse<void>> {
    try {
      const request: ArchiveArticleRequest = { reason };
      const response = await requests.put<ArticleApiResponse<void>>(
        `${this.baseURL}/${articleId}/archive`,
        request
      );
      return response;
    } catch (error) {
      console.error("Error archiving article:", error);
      return {
        success: false,
        message: "Failed to archive article",
        statusCode: 500,
      };
    }
  }

  // Get article history
  async getArticleHistory(
    articleId: number
  ): Promise<ArticleApiResponse<ArticleHistoryModel[]>> {
    try {
      const response = await requests.get<
        ArticleApiResponse<ArticleHistoryModel[]>
      >(`${this.baseURL}/GetArticlesHistory`);
      return response;
    } catch (error) {
      console.error("Error fetching article history:", error);
      return {
        success: false,
        message: "Failed to fetch article history",
        statusCode: 500,
      };
    }
  }

  // Get article statistics
  async getArticleStats(): Promise<
    ArticleApiResponse<ArticleStatsModel>
  > {
    try {
      const response = await requests.get<
        ArticleApiResponse<ArticleStatsModel>
      >(`${this.baseURL}/GetArticleStats`);
      return response;
    } catch (error) {
      console.error("Error fetching article stats:", error);
      return {
        success: false,
        message: "Failed to fetch article stats",
        statusCode: 500,
      };
    }
  }

  // Get lookup data for dropdowns
  async getLookupData(): Promise<
    ArticleApiResponse<ArticleLookupModel>
  > {
    try {
      const response = await requests.get<
        ArticleApiResponse<ArticleLookupModel>
      >(`${this.baseURL}/GetLookupData`);
      return response;
    } catch (error) {
      console.error("Error fetching lookup data:", error);
      return {
        success: false,
        message: "Failed to fetch lookup data",
        statusCode: 500,
      };
    }
  }

  // Check article title availability
  async checkArticleTitleAvailability(
    title: string,
    excludeArticleId?: number
  ): Promise<ArticleApiResponse<{ isAvailable: boolean }>> {
    try {
      const params = new URLSearchParams({ title });
      if (excludeArticleId) {
        params.append(
          "excludeArticleId",
          excludeArticleId.toString()
        );
      }
      const response = await requests.get<
        ArticleApiResponse<{ isAvailable: boolean }>
      >(`${this.baseURL}/CheckArticleTitleAvailability?${params.toString()}`);
      return response;
    } catch (error) {
      console.error("Error checking article title availability:", error);
      return {
        success: false,
        message: "Failed to check article title availability",
        statusCode: 500,
      };
    }
  }
}

// Export singleton instance
export const articleService = new ArticleService();
export default articleService;
