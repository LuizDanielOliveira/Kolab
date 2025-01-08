import { Box, Container, Flex, Heading, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.100">
      <Box bg="blue.600" color="white" py={4}>
        <Container maxW="container.lg">
          <Flex justify="space-between" align="center">
            <Heading
              size="md"
              cursor="pointer"
              onClick={() => navigate('/')}
            >
              Kolab Feed
            </Heading>
            <Button size="sm" onClick={() => navigate('/profile')}>
              Meu Perfil
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.lg" mt={4}>
        {children}
      </Container>
    </Box>
  );
}
