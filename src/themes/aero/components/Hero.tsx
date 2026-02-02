/** @jsx h */
import { h } from 'preact';

export function Hero() {
    return (
        <div class="glass-card mb-8 p-8 text-center bg-gradient-to-b from-white/70 to-white/40">
            <h1 class="text-4xl text-slate-800 font-bold mb-4 drop-shadow-sm">Welcome to Aero World</h1>
            <p class="text-lg text-slate-600">The transparent future we were promised.</p>
        </div>
    );
}
