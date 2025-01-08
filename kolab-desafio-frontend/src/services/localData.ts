import { User, Post, Comment } from '../types';

let localUsers: User[] = [];
let localPosts: Post[] = [];
let localComments: Comment[] = [];

// SETTERS / GETTERS
export function setUsers(users: User[]) {
  localUsers = users;
}
export function getUsers() {
  return localUsers;
}

export function setPosts(posts: Post[]) {
  localPosts = posts;
}
export function getPosts() {
  return localPosts;
}

export function setComments(comments: Comment[]) {
  localComments = comments;
}
export function getComments() {
  return localComments;
}

// CRIAR, EDITAR, REMOVER POSTS
export function createLocalPost(data: Omit<Post, 'id'>): Post {
  const newId = Date.now();
  const newPost: Post = { ...data, id: newId };
  localPosts.unshift(newPost);
  return newPost;
}

export function updateLocalPost(id: number, update: Partial<Post>) {
  const i = localPosts.findIndex((p) => p.id === id);
  if (i !== -1) {
    localPosts[i] = { ...localPosts[i], ...update };
  }
}

export function removeLocalPost(id: number) {
  localPosts = localPosts.filter((p) => p.id !== id);
  // Opcional: remover comentários ligados a esse post
  localComments = localComments.filter((c) => c.postId !== id);
}

// CRIAR, EDITAR, REMOVER COMMENTS
export function createLocalComment(data: Omit<Comment, 'id'>): Comment {
  const newId = Date.now();
  const newComment = { ...data, id: newId };
  localComments.push(newComment);
  return newComment;
}

export function updateLocalComment(id: number, update: Partial<Comment>) {
  const i = localComments.findIndex((c) => c.id === id);
  if (i !== -1) {
    localComments[i] = { ...localComments[i], ...update };
  }
}

export function removeLocalComment(id: number) {
  localComments = localComments.filter((c) => c.id !== id);
}
