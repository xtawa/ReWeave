/** @jsx h */
import { h } from 'preact';

export function Header() {
    return (
        <header>
            <div class="nav-container">
                <nav class="nav-links">
                    <a href="/" class="nav-link">
                        <span class="mr-2">🏠</span> Home
                    </a>
                    <a href="/archives" class="nav-link">
                        <span class="mr-2">📚</span> Archives
                    </a>
                    <a href="/about" class="nav-link">
                        <span class="mr-2">👤</span> About
                    </a>
                    <a href="/search" class="nav-link">
                        <span class="mr-2">🔍</span> Search
                    </a>
                </nav>
            </div>
        </header>
    );
}
