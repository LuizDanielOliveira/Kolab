export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;  // BÔNUS
  }
  
  export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
    imageUrl?: string;   // BÔNUS
  }
  
  export interface Comment {
    id: number;
    postId: number;
    userId?: number;
    name: string;
    email: string;
    body: string;
  }
  