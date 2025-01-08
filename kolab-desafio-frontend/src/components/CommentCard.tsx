import { useState } from 'react';
import { Box, Text, Button, Input } from '@chakra-ui/react';
import { Comment } from '../types';
import { updateLocalComment, removeLocalComment } from '../services/localData';

const AUTH_USER_ID = 1;

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);
  const [isRemoved, setIsRemoved] = useState(false);

  const isOwner = comment.userId === AUTH_USER_ID;

  if (isRemoved) {
    return null;
  }

  function handleSave() {
    if (!isOwner) return;
    updateLocalComment(comment.id, { body: editText });
    setIsEditing(false);
  }

  function handleRemove() {
    if (!isOwner) return;
    removeLocalComment(comment.id);
    setIsRemoved(true);
  }

  return (
    <Box bg="gray.100" p={2} mb={2} borderRadius="md">
      {isEditing ? (
        <Box>
          <Input
            size="sm"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <Button size="xs" mt={1} onClick={handleSave}>Salvar</Button>
        </Box>
      ) : (
        <>
          <Text fontSize="sm">{comment.body}</Text>
          <Text fontSize="xs" color="gray.600">
            - {comment.name} ({comment.email})
          </Text>
        </>
      )}

      {isOwner && (
        <Box mt={1}>
          <Button size="xs" mr={2} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
          <Button size="xs" colorScheme="red" onClick={handleRemove}>
            Remover
          </Button>
        </Box>
      )}
    </Box>
  );
}
