import React, { useState, useRef, useEffect } from "react";

const ReadMoreText = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (description && textRef.current) {
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
      const maxLines = 6;
      const maxHeight = lineHeight * maxLines;

      if (textRef.current.scrollHeight > maxHeight) {
        setIsTruncated(true);
      } else {
        setIsTruncated(false);
      }
    }
  }, [description]);

  if (!description) {
    return <div className="text-gray-500 text-xs italic">No description available.</div>;
  }

  return (
    <div className="relative">
      <div
        ref={textRef}
        className={`text-gray-500 pb-2 lg:pb-2 whitespace-pre-wrap text-xs overflow-hidden ${
          isExpanded ? "" : "max-h-[calc(1.5rem*6)]"
        }`}
        style={{
          WebkitLineClamp: isExpanded ? "none" : 6,
          WebkitBoxOrient: "vertical",
          display: "-webkit-box",
        }}
      >
        {description}
      </div>
      {isTruncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 text-xs mt-1"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;