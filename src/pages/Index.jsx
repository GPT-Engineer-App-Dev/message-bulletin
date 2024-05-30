import { Box, Container, VStack, Text, Input, Button, HStack, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim() !== "") {
      setPosts([{ content: newPost, id: Date.now() }, ...posts]);
      setNewPost("");
    }
  };

  return (
    <Container maxW="container.lg" p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Anna's Guest Book</Heading>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        <Box as="form" onSubmit={(e) => { e.preventDefault(); handlePostSubmit(); }}>
          <HStack>
            <Input
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <Button type="submit" colorScheme="green">Post</Button>
          </HStack>
        </Box>
        {posts.length === 0 ? (
          <Text>No posts yet. Be the first to post!</Text>
        ) : (
          posts.map((post) => (
            <Box key={post.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
              <Text>{post.content}</Text>
            </Box>
          ))
        )}
      </SimpleGrid>
    </Container>
  );
};

export default Index;