import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Box, Text, Heading, Stack, StackDivider } from '@chakra-ui/react'


const HomePage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <Card className="ml-5 mr-5">
            <CardHeader>
                <Heading size='md'>PDF Highlight Extractor</Heading>
            </CardHeader>

            <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                    <Heading size='xs' textTransform='uppercase'>
                    Upload Highlights
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                    Click the button below to upload your pdf file for highlight extraction.
                    </Text>
                </Box>
                <Box>
                    <div className="text-center">
                    <Link to="/upload" className="mt-8 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Get Started</Link>
                    </div>
                </Box>
                </Stack>
            </CardBody>
            </Card>
            
            <Card className="ml-5 mr-5">
            <CardHeader>
                <Heading size='md'>PDF Image Extractor</Heading>
            </CardHeader>

            <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                    <Heading size='xs' textTransform='uppercase'>
                    Upload Images
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                    Click the button below to upload your pdf file for image extraction.
                    </Text>
                </Box>
                <Box>
                    <div className="text-center">
                        
                        <Link to="/upload_for_images" className="mt-8 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Upload images</Link>
                    </div>
                </Box>
                </Stack>
            </CardBody>
            </Card>
        </div>
    )
}

export default HomePage;