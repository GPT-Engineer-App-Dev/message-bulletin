import { Box, Container, VStack, Text, Input, Button, HStack, Flex, Heading, SimpleGrid, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePosts, useAddPost, useToggleStar } from "../integrations/supabase/index.js";

const Index = () => {
  const { data: posts, isLoading, error } = usePosts();
  const addPostMutation = useAddPost();
  const toggleStarMutation = useToggleStar();
  const [newPost, setNewPost] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPost, setSelectedPost] = useState(null);
  const [showStarred, setShowStarred] = useState(false);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() !== "") {
      const wordCount = newPost.trim().split(/\s+/).length;
      addPostMutation.mutate({ title: newPost, body: newPost, word_count: wordCount });
      setNewPost("");
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    onOpen();
  };

  const handleToggleStar = (postId) => {
    toggleStarMutation.mutate(postId);
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching posts:", error);
    }
  }, [error]);

  const filteredPosts = showStarred ? posts.filter(post => post.starred) : posts;

  return (
    <Container maxW="container.lg" p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Anna's Guest Book</Heading>
        <Button onClick={() => setShowStarred(!showStarred)}>
          {showStarred ? "Show All Posts" : "Show Starred Posts"}
        </Button>
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
        ) : filteredPosts && filteredPosts.length === 0 ? (
          <Text>No posts yet. Be the first to post!</Text>
        ) : (
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Box
                p={4}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                onClick={() => handlePostClick(post)}
              >
                <Text>{post.body}</Text>
                <Text fontSize="sm" color="gray.500">Word count: {post.word_count}</Text>
                <Button onClick={() => handleToggleStar(post.id)}>
                  {post.starred ? "Unstar" : "Star"}
                </Button>
              </Box>
            </motion.div>
          ))
        )}
      </SimpleGrid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedPost?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedPost?.body}</Text>
            <Text fontSize="sm" color="gray.500">Word count: {selectedPost?.word_count}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;