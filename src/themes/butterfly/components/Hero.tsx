/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/butterfly.config';

export function Hero() {
    if (!config.hero || !config.hero.enabled) return null;

    const { description, social } = config.hero;
    const bgImage = "https://images.unsplash.com/photo-1490750967868-58cb75063ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"; // Default Butterfly-ish image

    return (
        <div class="relative h-[60vh] min-h-[400px] w-full overflow-hidden mb-10">
            {/* Background Image */}
            <div
                class="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-[10s]"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>

            {/* Overlay */}
            <div class="absolute inset-0 bg-black/30 dark:bg-black/50"></div>

            {/* Content */}
            <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                <h1 class="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in-up">
                    {config.title}
                </h1>
                <div class="text-xl md:text-2xl font-light mb-8 drop-shadow-md opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {description || config.description}
                </div>

                {/* Social Icons */}
                <div class="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    {social?.github && (
                        <a href={social.github} target="_blank" rel="noopener noreferrer" class="text-2xl hover:text-blue-300 transition-transform hover:-translate-y-1">
                            <i class="fab fa-github"></i>
                        </a>
                    )}
                    {social?.twitter && (
                        <a href={social.twitter} target="_blank" rel="noopener noreferrer" class="text-2xl hover:text-blue-400 transition-transform hover:-translate-y-1">
                            <i class="fab fa-twitter"></i>
                        </a>
                    )}
                    {social?.email && (
                        <a href={social.email} class="text-2xl hover:text-red-400 transition-transform hover:-translate-y-1">
                            <i class="fas fa-envelope"></i>
                        </a>
                    )}
                </div>
            </div>

            {/* Scroll Down Arrow */}
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce text-white/80">
                <i class="fas fa-chevron-down text-2xl"></i>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }
                `
            }} />
        </div>
    );
}
