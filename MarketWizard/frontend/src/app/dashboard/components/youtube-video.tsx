import React from "react";

const YouTubeVideo = ({ videoId = "QB5BNdBFujE?si=-y-mzeVk2jrRqYMN" }) => {
  return (
    <iframe
      width="330"
      height="300"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
    ></iframe>
  );
};

export default YouTubeVideo;
