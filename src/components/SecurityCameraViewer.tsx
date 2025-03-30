import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'flowbite-react';
import XMLParser from 'react-xml-parser';

const SecurityCameraViewer: React.FC = () => {
  const [captures, setCaptures] = useState<{ url: string; date: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;
  
  // Fetch blob storage data
  useEffect(() => {
    const fetchCaptures = async () => {
      try {
        const response = await fetch(
          "https://yusufzerdazi.blob.core.windows.net/captures?restype=container&comp=list"
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch captures');
        }
        
        const xml = await response.text();
        const parser = new XMLParser();
        const result = parser.parseFromString(xml);
        
        // Extract blob URLs and dates
        const blobElements = result.getElementsByTagName('Blob');
        const captureData = blobElements.map(blob => {
          const url = blob.getElementsByTagName('Url')[0].value;
          const lastModified = blob.getElementsByTagName('Last-Modified')[0].value;
          return {
            url,
            date: new Date(lastModified).getTime()
          };
        });
        
        // Sort by date (newest first)
        captureData.sort((a, b) => b.date - a.date);
        setCaptures(captureData);
      } catch (error) {
        console.error('Error fetching captures:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaptures();
  }, []);
  
  // Calculate total pages
  const totalPages = Math.ceil(captures.length / itemsPerPage);
  
  // Handle navigation
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };
  
  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };
  
  // Get current captures to display
  const currentCaptures = captures.slice(
    currentPage * itemsPerPage, 
    (currentPage * itemsPerPage) + itemsPerPage
  );
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
        Security Camera Captures
      </h3>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="xl" />
        </div>
      ) : captures.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCaptures.map((capture, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <video 
                  className="w-full h-auto" 
                  controls 
                  src={capture.url}
                  preload="metadata"
                />
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(capture.date).toLocaleString()}
                </div>
              </div>
            ))}
            
            {/* Fill empty slots with placeholders to maintain grid */}
            {currentCaptures.length < itemsPerPage && (
              [...Array(itemsPerPage - currentCaptures.length)].map((_, i) => (
                <div key={`empty-${i}`} className="bg-gray-50 dark:bg-gray-800 rounded-lg h-[200px] flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-600">No more captures</span>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination controls */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              color="gray"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Previous
            </Button>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <Button
              color="gray"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1}
            >
              Next
              <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          No captures found
        </div>
      )}
    </div>
  );
};

export default SecurityCameraViewer; 