/** @jsx h */
import { h } from 'preact';

interface CommentsProps {
    path?: string;
}

export function Comments({ }: CommentsProps) {
    return (
        <div class="glass-card mt-8 p-6">
            <h3 class="text-lg font-bold text-slate-700 mb-4 border-b border-white/50 pb-2">Comments</h3>
            <div class="glass-content min-h-[100px] flex items-center justify-center text-slate-500 italic">
                Comments are loading... (or not configured)
            </div>
        </div>
    );
}
