import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Heading, Text, VStack, Flex } from '@chakra-ui/react';

const HeroPage = () => {
  return (
    <Box className="min-h-screen bg-gray-900 p-10" color="white">
      <VStack spacing={8} textAlign="center">
        <Heading size="2xl">Welcome to PDF Utility App</Heading>
        <Text fontSize="xl">
          Our app provides seamless extraction of highlights and images from your PDFs. Store and manage your documents with ease.
        </Text>
        <Flex justify="center" gap="4">
          <Link to="/login">
            <Button bg="purple.500" color="white" _hover={{ bg: 'purple.600' }}>
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button bg="green.500" color="white" _hover={{ bg: 'green.600' }}>
              Sign Up
            </Button>
          </Link>
        </Flex>
      </VStack>
    </Box>
  );
};

export default HeroPage;
