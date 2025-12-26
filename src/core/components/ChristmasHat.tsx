/** @jsx h */
import { h, ComponentChildren } from 'preact';

interface ChristmasHatProps {
    children: ComponentChildren;
    className?: string;
    offset?: string; // e.g. "-top-4 -right-4"
    size?: string; // e.g. "w-8 h-8"
    rotate?: string; // e.g. "rotate-12"
    imageSrc?: string; // Optional custom image source
}

export function ChristmasHat({ children, className = '', offset = '-top-3 -right-2', size = 'w-6 h-6', rotate = '-rotate-12', imageSrc }: ChristmasHatProps) {
    return (
        <div class={`relative inline-flex items-center ${className}`}>
            {children}
            <div class={`christmas-hat hidden absolute ${offset} ${size} ${rotate} pointer-events-none z-50 filter drop-shadow-sm`}>
                {imageSrc ? (
                    <img src={imageSrc} alt="Christmas Hat" class="w-full h-full object-contain" />
                ) : (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                        {/* Hat Body */}
                        <path d="M50 16C50 16 42 4 30 10C18 16 12 38 12 38L44 38C44 38 52 32 50 16Z" fill="#EF4444" />
                        {/* Trim */}
                        <rect x="10" y="38" width="36" height="8" rx="4" fill="white" />
                        {/* Pom Pom */}
                        <circle cx="50" cy="16" r="5" fill="white" />
                    </svg>
                )}
            </div>
        </div>
    );
}
