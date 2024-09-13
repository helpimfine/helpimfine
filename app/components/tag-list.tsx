import React from 'react';

interface TagListProps {
  tags: string[];
  colors: string[];
}

const computeTextColor = (backgroundColor: string): string => {
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? `rgba(${r * 0.3},${g * 0.3},${b * 0.4}, 1)` : `rgba(${r + (255 - r) * 0.7},${g + (255 - g) * 0.7},${b + (255 - b) * 0.6}, 1)`;
};

const TagList: React.FC<TagListProps> = ({ tags, colors }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => {
        const bgColor = colors[index % colors.length];
        const textColor = computeTextColor(bgColor);
        return (
          <span
            key={index}
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
          >
            {tag}
          </span>
        );
      })}
    </div>
  );
};

export default TagList;