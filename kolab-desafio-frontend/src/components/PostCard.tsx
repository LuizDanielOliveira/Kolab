import { useState, useEffect } from 'react';
import {
  Box, Heading, Text, Link, VStack, Button, Input, Textarea, Image
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Post, Comment } from '../types';
import {
  updateLocalPost,
  removeLocalPost,
  getComments,
  createLocalComment
} from '../services/localData';
import CommentCard from './CommentCard';

const AUTH_USER_ID = 1;

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  const [isRemoved, setIsRemoved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  const isOwner = post.userId === AUTH_USER_ID;

  // Carregar comentários
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const all = getComments();
    const filtered = all.filter((c) => c.postId === post.id);
    setComments(filtered);
  }, [post.id]);

  // Se isRemoved, não renderiza nada
  if (isRemoved) {
    return null;
  }

  function handleSavePost() {
    if (!isOwner) return;
    updateLocalPost(post.id, { title, body });
    setIsEditing(false);
  }

  function handleRemovePost() {
    if (!isOwner) return;
    removeLocalPost(post.id);
    setIsRemoved(true);
  }

  // Criar comentário
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');

  function handleCreateComment() {
    // se quiser permitir todos comentando, remova check
    if (!isOwner) return;
    createLocalComment({
      postId: post.id,
      userId: AUTH_USER_ID,
      name: 'Usuário Hardcoded',
      email: 'hard@coded.com',
      body: commentText
    });
    setCommentText('');
    setShowCommentBox(false);
    const updated = getComments().filter((c) => c.postId === post.id);
    setComments(updated);
  }

  return (
    <Box>
      {isEditing ? (
        <Box mb={2}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={2}
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            mb={2}
          />
          <Button size="sm" onClick={handleSavePost} mr={2}>
            Salvar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </Button>
        </Box>
      ) : (
        <>
          <Heading size="sm">{post.title}</Heading>
          <Text>{post.body}</Text>
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt="imagem do Post"
              maxH="200px"
              objectFit="cover"
              my={2}
            />
          )}
        </>
      )}

      <Link color="blue.500" onClick={() => navigate(`/users/${post.userId}`)}>
        <Text fontSize="sm" fontWeight="bold">
          {post.userId === 1 ? 'Postado por: Meu Usuário Hardcoded' : `Postado por: Usuário ${post.userId}`}
        </Text>
      </Link>

      {isOwner && !isEditing && (
        <Box mt={2}>
          <Button size="xs" mr={2} onClick={() => setIsEditing(true)}>
            Editar
          </Button>
          <Button size="xs" colorScheme="red" onClick={handleRemovePost}>
            Remover
          </Button>
        </Box>
      )}

      <VStack align="stretch" mt={4}>
        <Text fontWeight="bold">Comentários:</Text>
        {comments.length > 0 ? (
          comments.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))
        ) : (
          <Text fontSize="sm">Nenhum comentário.</Text>
        )}
      </VStack>

      <Box mt={4}>
        {showCommentBox ? (
          <Box>
            <Textarea
              placeholder="Digite seu comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              mb={2}
            />
            <Button size="sm" onClick={handleCreateComment}>
              Comentar
            </Button>
          </Box>
        ) : (
          <Button size="sm" onClick={() => setShowCommentBox(true)}>
            Adicionar Comentário
          </Button>
        )}
      </Box>
    </Box>
  );
}
