import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { getPosts } from '../services/localData';
import PostCard from '../components/PostCard';

export default function UserPosts() {
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(getPosts());

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const userPosts = getPosts().filter((p) => String(p.userId) === userId);
    setPosts(userPosts);
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <Text fontSize="lg" mb={4}>
        Posts do Usuário {userId}
      </Text>
      {posts.length === 0 && <Text>Nenhum post encontrado.</Text>}
      {posts.map((p) => (
        <Box key={p.id} bg="white" p={3} mb={4} borderRadius="md">
          <PostCard post={p} />
        </Box>
      ))}
    </Layout>
  );
}
