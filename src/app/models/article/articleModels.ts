// Base Article Model
export interface ArticleModel {
  id: number;
  observationSubject: string;
  observationTitle: string;
  discussion: string;
  conclusion: string;
  initialRecommendation: string;
  type: string;
  originatingMainUnit: string;
  originatingSubunit: string;
  submittedBy?: string;
  submittedDate?: Date;
  approvedBy?: string;
  currentAssignment: string;
  status: string;
  submissionStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Article Create/Update Model (for API requests)
export interface ArticleCreateUpdateModel {
  observationSubject: string;
  observationTitle: string;
  discussion: string;
  conclusion: string;
  initialRecommendation: string;
  type: string;
  originatingMainUnit: string;
  originatingSubunit: string;
  currentAssignment: string;
  status: string;
}

// Article List Model (for paginated responses)
export interface ArticleListModel {
  articles: ArticleModel[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Article Search Model
export interface ArticleSearchModel {
  searchTerm?: string;
  type?: string;
  status?: string;
  originatingMainUnit?: string;
  originatingSubunit?: string;
  currentAssignment?: string;
  dateFrom?: Date;
  dateTo?: Date;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Default search parameters
export const DEFAULT_ARTICLE_SEARCH: ArticleSearchModel = {
  searchTerm: '',
  type: '',
  status: '',
  originatingMainUnit: '',
  originatingSubunit: '',
  currentAssignment: '',
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

// Default form values
export const DEFAULT_ARTICLE_FORM: ArticleCreateUpdateModel = {
  observationSubject: '',
  observationTitle: '',
  discussion: '',
  conclusion: '',
  initialRecommendation: '',
  type: '',
  originatingMainUnit: '',
  originatingSubunit: '',
  currentAssignment: '',
  status: 'Draft',
};

// Article History Model
export interface ArticleHistoryModel {
  id: number;
  articleId: number;
  action: string;
  performedBy: string;
  performedAt: Date;
  previousValue?: string;
  newValue?: string;
  notes?: string;
}

// Article Stats Model
export interface ArticleStatsModel {
  totalArticles: number;
  draftArticles: number;
  publishedArticles: number;
  archivedArticles: number;
  pendingApproval: number;
  submissionRate: number;
}

// Article Lookup Model
export interface ArticleLookupModel {
  types: { value: string; text: string }[];
  statuses: { value: string; text: string }[];
  mainUnits: { value: string; text: string }[];
  subunits: { value: string; text: string }[];
  assignments: { value: string; text: string }[];
}

// API Response Model
export interface ArticleApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  errors?: string[];
}

// Action types for status updates
export interface SubmitArticleRequest {
  notes?: string;
}

export interface ApproveArticleRequest {
  notes?: string;
}

export interface RejectArticleRequest {
  reason: string;
  notes?: string;
}

export interface ArchiveArticleRequest {
  reason: string;
}
