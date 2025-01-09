import { useEffect, useState } from 'react';
import { Box, Spinner, Button, Input, Textarea } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  setPosts,
  setUsers,
  setComments,
  getPosts,
  createLocalPost
} from '../services/localData';
import { Post, User, Comment } from '../types';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const { data: placeholderPosts, isLoading: loadingPosts } = useQuery<Post[]>(
    ['placeholderPosts'],
    async () => {
      const res = await api.get('/posts');
      return res.data.slice(0, 10);
    }
  );
  const { data: placeholderUsers, isLoading: loadingUsers } = useQuery<User[]>(
    ['placeholderUsers'],
    async () => {
      const res = await api.get('/users');
      return res.data.map((u: User) => ({
        ...u,
        avatarUrl: `https://i.pravatar.cc/150?u=${u.id}`
      }));
    }
  );
  const { data: placeholderComments, isLoading: loadingComments } = useQuery<Comment[]>(
    ['placeholderComments'],
    async () => {
      const res = await api.get('/comments');
      return res.data.slice(0, 20);
    }
  );

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  // Form fields para criar post
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Busca por autor
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!placeholderPosts || !placeholderUsers || !placeholderComments) return;
    setLoading(true);

    setPosts(placeholderPosts);
    setUsers(placeholderUsers);
    setComments(placeholderComments);

    const local = getPosts();
    setAllPosts(local);

    setLoading(false);
  }, [placeholderPosts, placeholderUsers, placeholderComments]);

  if (loadingPosts || loadingUsers || loadingComments || loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  function handleCreatePost() {
    createLocalPost({
      userId: 1,
      title,
      body,
      imageUrl
    });
    setShowCreate(false);
    setTitle('');
    setBody('');
    setImageUrl('');

    setAllPosts(getPosts());
  }

  const filtered = allPosts.filter((p) => {
    if (p.userId === 1) {
      return 'meu usuário hardcoded'.includes(searchTerm.toLowerCase());
    }
    return `usuário ${p.userId}`.includes(searchTerm.toLowerCase());
  });

  return (
    <Layout>
      <SearchBar
        placeholder="Buscar posts pelo nome do autor..."
        value={searchTerm}
        onChange={(val) => setSearchTerm(val)}
      />

      <Box mt={4} mb={4}>
        {!showCreate && (
          <Button colorScheme="teal" onClick={() => setShowCreate(true)}>
            Novo Post
          </Button>
        )}
      </Box>

      {showCreate && (
        <Box bg="white" p={4} borderRadius="md" mb={4}>
          <Input
            placeholder="Título do Post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={2}
          />
          <Textarea
            placeholder="Conteúdo do Post"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            mb={2}
          />
          <Input
            placeholder="URL da Imagem (opcional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            mb={2}
          />
          <Button onClick={handleCreatePost} colorScheme="teal">
            Criar
          </Button>
        </Box>
      )}

      {filtered.map((p) => (
        <Box key={p.id} bg="white" p={3} mb={4} borderRadius="md">
          <PostCard
            post={p}
            onPostRemove={() => setAllPosts(getPosts())}
          />
        </Box>
      ))}
    </Layout>
  );
}
