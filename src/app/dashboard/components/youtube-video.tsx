import React from 'react';

const YouTubeVideo = ({ videoId = 'iEpJwprxDdk' }) => {
  return (
    <iframe
      width="330"
      height="300"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    ></iframe>
  );
};

export default YouTubeVideo;