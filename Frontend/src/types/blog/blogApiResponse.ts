export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: number;
  is_published: boolean;
  created_at: string;
}

export interface BlogListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blog[];
}

export interface BlogQueryParams {
  page?: number;
  search?: string;
  category?: number;
}
