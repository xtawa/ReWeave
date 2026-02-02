/** @jsx h */
import { h } from 'preact';



export function Sidebar() {
    return (
        <aside class="space-y-12 mt-10">
            {/* Avatar Widget */}
            <div class="relative">
                <div class="avatar-bg mx-auto relative z-10">
                    <img
                        src="https://avatars.githubusercontent.com/u/1017316"
                        alt="Profile"
                        class="profile-img"
                    />
                </div>

                <div class="glass-card mt-[-40px] pt-[55px] pb-4 px-4 text-center relative z-0">
                    <h3 class="font-bold text-lg mb-1">ShinN</h3>

                    <div class="flex justify-center gap-4 my-3">
                        <a href="#" class="profile-link aero-btn w-10 h-10 rounded-full flex items-center justify-center overflow-hidden p-2" title="MSN Messenger">
                            <img src="https://cdn-icons-png.flaticon.com/512/732/732196.png" alt="MSN" class="w-6 h-6 object-contain" />
                        </a>
                        <a href="#" class="profile-link aero-btn w-10 h-10 rounded-full flex items-center justify-center overflow-hidden p-2" title="LinkedIn">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/240px-LinkedIn_logo_initials.png" alt="LinkedIn" class="w-6 h-6 object-contain" />
                        </a>
                    </div>

                    <p class="text-sm italic text-gray-700">
                        "The brain is wider than the sky."
                    </p>
                </div>
            </div>



            {/* About Widget */}
            <div class="glass-card">
                <div class="glass-header text-sm">关于 Aero 主题</div>
                <div class="glass-content text-sm prose">
                    <p class="mb-2">2026-01-27</p>
                    <p>本主题是一个 Frutiger Aero 风格的 Hexo 博客主题，灵感来自 Windows Vista。</p>
                    <div class="text-right mt-2">
                        <a href="#" class="aero-btn px-3 py-1 text-xs rounded-full">Read More...</a>
                    </div>
                </div>
            </div>
        </aside>
    );
}
