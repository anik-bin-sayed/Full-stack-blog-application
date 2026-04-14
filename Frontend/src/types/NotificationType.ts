interface BlogData {
  id: number;
  title: string;
  slug: string;
}

interface UserData {
  id: number;
  fullname: string;
}

export interface ProfileImage {
  id: number;
  image: string;
}

export interface Notification {
  id: number;
  sender_name: string;
  blog_data: BlogData;
  user_data: UserData;
  profile_image: ProfileImage[];
  notification_type: "like" | "comment";
  is_read: boolean;
  created_at: string;
  sender: number;
  receiver: number;
  blog: number;
  setOpenModal: boolean;
  comment: number | null;
}
