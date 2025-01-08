import { useEffect, useState } from 'react';
import { Box, Spinner, Input, Button, FormControl, FormLabel, Image } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { getUsers, setUsers } from '../services/localData';
import { User } from '../types';

const AUTH_USER_ID = 1;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLoading(true);
    const all = getUsers();
    const me = all.find((u) => u.id === AUTH_USER_ID) || null;
    setUser(me);
    setLoading(false);
  }, []);

  function handleSave() {
    if (!user) return;
    const updatedList = getUsers().map((u) => (u.id===user.id? user : u));
    setUsers(updatedList);
    setEditing(false);
  }

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Box>Usuário não encontrado.</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {editing ? (
        <Box>
          <FormControl mb={2}>
            <FormLabel>Nome</FormLabel>
            <Input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Username</FormLabel>
            <Input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Email</FormLabel>
            <Input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Avatar URL</FormLabel>
            <Input
              value={user.avatarUrl || ''}
              onChange={(e) => setUser({ ...user, avatarUrl: e.target.value })}
            />
          </FormControl>
          <Button colorScheme="teal" mr={2} onClick={handleSave}>
            Salvar
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)}>
            Cancelar
          </Button>
        </Box>
      ) : (
        <Box>
          {user.avatarUrl && (
            <Image src={user.avatarUrl} alt="avatar" boxSize="100px" borderRadius="full" mb={4}/>
          )}
          <Box>Nome: {user.name}</Box>
          <Box>Username: {user.username}</Box>
          <Box>Email: {user.email}</Box>
          <Button colorScheme="teal" mt={4} onClick={() => setEditing(true)}>
            Editar
          </Button>
        </Box>
      )}
    </Layout>
  );
}
