'use client';

import React from 'react';
import { Shape, ShapeType, SIZE_MAP, POSITION_MAP } from '../../types/matrix';

interface ShapeRendererProps {
    shape: Shape;
    className?: string;
}

/**
 * Renders a single shape as an SVG element
 * Supports: circle, square, triangle, diamond, hexagon, pentagon, star, cross, line, arrow, dot
 */
export const ShapeRenderer: React.FC<ShapeRendererProps> = ({ shape, className }) => {
    const size = SIZE_MAP[shape.size];
    const pos = shape.position ? POSITION_MAP[shape.position] : { x: 50, y: 50 };

    const fillColor = shape.fill === 'solid' ? shape.color : 'none';
    const strokeColor = shape.color;
    const strokeWidth = shape.strokeWidth || 2;
    const opacity = shape.opacity ?? 1;

    // Calculate transform for rotation
    const transform = shape.rotation
        ? `rotate(${shape.rotation} ${pos.x} ${pos.y})`
        : undefined;

    const commonProps = {
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: shape.fill === 'solid' ? 0 : strokeWidth,
        opacity,
        transform,
    };

    // Striped fill pattern
    const patternId = `stripe_${shape.id}`;
    const stripedPattern = shape.fill === 'striped' && (
        <defs>
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="4" height="4">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
                    stroke={shape.color}
                    strokeWidth="1" />
            </pattern>
        </defs>
    );

    const getFill = () => {
        if (shape.fill === 'solid') return shape.color;
        if (shape.fill === 'striped') return `url(#${patternId})`;
        if (shape.fill === 'dotted') return `url(#${patternId})`; // Could create dot pattern
        return 'none';
    };

    const renderShape = (): React.ReactNode => {
        switch (shape.type) {
            case 'circle':
                return (
                    <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={size / 2}
                        {...commonProps}
                        fill={getFill()}
                    />
                );

            case 'square':
                return (
                    <rect
                        x={pos.x - size / 2}
                        y={pos.y - size / 2}
                        width={size}
                        height={size}
                        {...commonProps}
                        fill={getFill()}
                    />
                );

            case 'triangle':
                const triPoints = [
                    `${pos.x},${pos.y - size / 2}`,           // top
                    `${pos.x - size / 2},${pos.y + size / 2}`, // bottom-left
                    `${pos.x + size / 2},${pos.y + size / 2}`, // bottom-right
                ].join(' ');
                return (
                    <polygon
                        points={triPoints}
                        {...commonProps}
                        fill={getFill()}
                    />
                );

            case 'diamond':
                const diaPoints = [
                    `${pos.x},${pos.y - size / 2}`,  // top
                    `${pos.x + size / 2},${pos.y}`,  // right
                    `${pos.x},${pos.y + size / 2}`,  // bottom
                    `${pos.x - size / 2},${pos.y}`,  // left
                ].join(' ');
                return (
                    <polygon
                        points={diaPoints}
                        {...commonProps}
                        fill={getFill()}
                    />
                );

            case 'hexagon':
                const hexPoints = Array.from({ length: 6 }, (_, i) => {
                    const angle = (i * 60 - 90) * Math.PI / 180;
                    return `${pos.x + size / 2 * Math.cos(angle)},${pos.y + size / 2 * Math.sin(angle)}`;
                }).join(' ');
                return (
                    <polygon
                        points={hexPoints}
                        {...commonProps}
                        fill={getFill()}
                    />
                );

            case 'pentagon':
                const pentPoints = Array.from({ length: 5 }, (_, i) => {
                    const angle = (i * 72 - 90) * Math.PI / 180;
                    return `${pos.x + size / 2 * Math.cos(angle)},${pos.y + size / 2 * Math.sin(angle)}`;
                }).join(' ');
                return (
                    <polygon
                        points={pentPoints}
                        {...commonProps}
                        fill={getFill()}
                    />
                );

            case 'star':
                const starPoints = Array.from({ length: 10 }, (_, i) => {
                    const radius = i % 2 === 0 ? size / 2 : size / 4;
                    const angle = (i * 36 - 90) * Math.PI / 180;
                    return `${pos.x + radius * Math.cos(angle)},${pos.y + radius * Math.sin(angle)}`;
                }).join(' ');
                return (
                    <polygon
                        points={starPoints}
                        {...commonProps}
                        fill={getFill()}
                    />
                );

            case 'cross':
                const crossWidth = size / 3;
                return (
                    <g {...commonProps} fill={getFill()}>
                        <rect
                            x={pos.x - crossWidth / 2}
                            y={pos.y - size / 2}
                            width={crossWidth}
                            height={size}
                        />
                        <rect
                            x={pos.x - size / 2}
                            y={pos.y - crossWidth / 2}
                            width={size}
                            height={crossWidth}
                        />
                    </g>
                );

            case 'line':
                // Default horizontal line, rotation controls direction
                return (
                    <line
                        x1={pos.x - size / 2}
                        y1={pos.y}
                        x2={pos.x + size / 2}
                        y2={pos.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth + 1}
                        opacity={opacity}
                        transform={transform}
                    />
                );

            case 'arrow':
                const arrowHead = size / 3;
                return (
                    <g transform={transform}>
                        <line
                            x1={pos.x - size / 2}
                            y1={pos.y}
                            x2={pos.x + size / 2 - arrowHead}
                            y2={pos.y}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth + 1}
                            opacity={opacity}
                        />
                        <polygon
                            points={`
                                ${pos.x + size / 2},${pos.y}
                                ${pos.x + size / 2 - arrowHead},${pos.y - arrowHead / 2}
                                ${pos.x + size / 2 - arrowHead},${pos.y + arrowHead / 2}
                            `}
                            fill={strokeColor}
                            opacity={opacity}
                        />
                    </g>
                );

            case 'dot':
                return (
                    <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={size / 4}
                        fill={shape.color}
                        opacity={opacity}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <g className={className}>
            {stripedPattern}
            {renderShape()}
        </g>
    );
};

// Helper component to render multiple shapes in a cell
interface MultiShapeRendererProps {
    shapes: Shape[];
}

export const MultiShapeRenderer: React.FC<MultiShapeRendererProps> = ({ shapes }) => {
    return (
        <>
            {shapes.map((shape, idx) => (
                <ShapeRenderer key={shape.id || idx} shape={shape} />
            ))}
        </>
    );
};

export default ShapeRenderer;
