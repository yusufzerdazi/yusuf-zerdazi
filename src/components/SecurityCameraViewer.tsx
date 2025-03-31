import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Spinner } from 'flowbite-react';

const SecurityCameraViewer: React.FC = () => {
  const [captures, setCaptures] = useState<{ url: string; date: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;
  const videoRefs = useRef<{[url: string]: HTMLVideoElement | null}>({});
  
  // More efficient fetch that caches results
  const fetchCaptures = useCallback(async () => {
    try {
      // Use a cached response if already loaded in this session
      const cacheKey = 'security-camera-captures';
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setCaptures(parsedData);
        setLoading(false);
        return;
      }
      
      const response = await fetch(
        "https://yusufzerdazi.blob.core.windows.net/captures?restype=container&comp=list"
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch captures');
      }
      
      const xml = await response.text();
      
      // Using built-in DOMParser instead of react-xml-parser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      
      // Get all Blob elements
      const blobElements = xmlDoc.getElementsByTagName('Blob');
      const captureData: { url: string; date: number }[] = [];
      
      // Process each Blob element
      for (let i = 0; i < blobElements.length; i++) {
        const blob = blobElements[i];
        const urlElement = blob.getElementsByTagName('Url')[0];
        const lastModifiedElement = blob.getElementsByTagName('Last-Modified')[0];
        
        if (urlElement && lastModifiedElement) {
          captureData.push({
            url: urlElement.textContent || '',
            date: new Date(lastModifiedElement.textContent || '').getTime()
          });
        }
      }
      
      // Sort and cache the result
      captureData.sort((a, b) => b.date - a.date);
      setCaptures(captureData);
      
      // Store in session cache
      sessionStorage.setItem(cacheKey, JSON.stringify(captureData));
    } catch (error) {
      console.error('Error fetching captures:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch data on mount
  useEffect(() => {
    fetchCaptures();
  }, [fetchCaptures]);
  
  // Preload videos for current page
  useEffect(() => {
    if (captures.length === 0 || loading) return;
    
    const startIdx = currentPage * itemsPerPage;
    const currentCaptures = captures.slice(startIdx, startIdx + itemsPerPage);
    
    // Preload current page videos
    currentCaptures.forEach(capture => {
      if (videoRefs.current[capture.url]) {
        videoRefs.current[capture.url]?.load();
      }
    });
    
    // Also preload the next page if it exists
    if (currentPage < Math.ceil(captures.length / itemsPerPage) - 1) {
      const nextIdx = (currentPage + 1) * itemsPerPage;
      const nextCaptures = captures.slice(nextIdx, nextIdx + itemsPerPage);
      
      // Just create the HTTP request but don't process it fully
      nextCaptures.forEach(capture => {
        fetch(capture.url, { method: 'HEAD' });
      });
    }
  }, [captures, currentPage, loading]);
  
  // Calculate total pages
  const totalPages = Math.ceil(captures.length / itemsPerPage);
  
  // Handle navigation with preloading
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);
  
  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  }, []);
  
  // Video reference setter
  const setVideoRef = useCallback((element: HTMLVideoElement | null, url: string) => {
    if (element) {
      videoRefs.current[url] = element;
    }
  }, []);
  
  // Get current captures to display
  const currentCaptures = captures.slice(
    currentPage * itemsPerPage, 
    (currentPage * itemsPerPage) + itemsPerPage
  );
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
        Captures
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
                {/* Video with lazy loading */}
                <div className="relative">
                  <video 
                    ref={(el) => setVideoRef(el, capture.url)}
                    className="w-full h-auto"
                    controls 
                    preload="metadata"
                  >
                    <source src={capture.url + '#t=0.1'} type="video/mp4" />
                  </video>
                </div>
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(capture.date).toLocaleString()}
                </div>
              </div>
            ))}
            
            {/* Fill empty slots with placeholders */}
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