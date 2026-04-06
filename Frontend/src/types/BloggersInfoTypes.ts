interface ProfileImage {
  id?: number;
  image_url?: string;
}

interface CoverImage {
  id?: number;
  image_url?: string;
}

interface Follower {
  id: number;
  username: string;
}

interface Following {
  id: number;
  username: string;
}

interface Profile {
  bio?: string;
  phone?: string;
  birthdate?: string | null;
  gender?: string;
  language?: string;
  location?: string;
  first_name?: string;
  last_name?: string;
}

interface Blogger {
  id: number;
  username: string;
  email: string;
  profile: Profile | null;
  profile_images: ProfileImage[];
  cover_images: CoverImage[];
  followers: Follower[];
  following: Following[];
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blogger[];
}

export interface BloggersProps {
  data: ApiResponse;
  isLoading?: boolean;
  error?: string | null;
}
