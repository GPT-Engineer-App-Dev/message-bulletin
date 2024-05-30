import { Box, Container, VStack, Text, Input, Button, HStack, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { usePosts, useAddPost } from "../integrations/supabase/index.js";

const Index = () => {
  const { data: posts, isLoading, error } = usePosts();
  const addPostMutation = useAddPost();
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() !== "") {
      addPostMutation.mutate({ title: newPost, body: newPost });
      setNewPost("");
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching posts:", error);
    }
  }, [error]);

  return (
    <Container maxW="container.lg" p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Anna's Guest Book</Heading>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        <Box as="form" onSubmit={handlePostSubmit}>
          <HStack>
            <Input
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <Button type="submit" colorScheme="green" isLoading={addPostMutation.isLoading}>Post</Button>
          </HStack>
        </Box>
        {isLoading ? (
          <Text>Loading posts...</Text>
        ) : posts && posts.length === 0 ? (
          <Text>No posts yet. Be the first to post!</Text>
        ) : (
          posts.map((post) => (
            <Box key={post.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
              <Text>{post.body}</Text>
            </Box>
          ))
        )}
      </SimpleGrid>
    </Container>
  );
};

export default Index;