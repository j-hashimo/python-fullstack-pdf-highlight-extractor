import React from 'react';
import { Link } from 'react-router-dom';
import { Box, SimpleGrid, Text, Heading, Button } from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Box className="min-h-screen bg-gray-900 p-10">
      <Box textAlign="center" py={10} color="white">
        <Heading>PDF Tools</Heading>
        <Text>Make use of our collection of PDF tools to process digital documents and streamline your workflow seamlessly.</Text>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <ToolCard
          title="Upload Highlights"
          description="Click the button below to upload your pdf file for highlight extraction."
          link="/upload"
          buttonText="Get Started"
        />
        <ToolCard
          title="Upload Images"
          description="Click the button below to upload your pdf file for image extraction."
          link="/upload_for_images"
          buttonText="Upload Images"
        />
        <ToolCard
          title="View PDFs"
          description="Access your PDF files and highlights. No upload required."
          link="/pdfview"
          buttonText="View PDFs"
        />
      </SimpleGrid>
    </Box>
  );
};

const ToolCard = ({ title, description, link, buttonText }) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={5}
      color="gray.900"
      shadow="base"
      _hover={{ shadow: "lg" }}
    >
      <Heading size="md" mb={4}>
        {title}
      </Heading>
      <Text mb={4}>{description}</Text>
      <Link to={link}>
        <Button
          bg="purple.500"
          color="white"
          _hover={{ bg: "purple.600" }}
        >
          {buttonText}
        </Button>
      </Link>
    </Box>
  );
};

export default HomePage;
