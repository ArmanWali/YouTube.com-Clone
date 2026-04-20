// ===== YouTube Clone - Interactive Script =====

document.addEventListener('DOMContentLoaded', () => {
    // === Element References ===
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const miniSidebar = document.getElementById('miniSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.getElementById('mainContent');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const searchForm = document.getElementById('searchForm');
    const chipsContainer = document.getElementById('chipsContainer');
    const chipLeft = document.getElementById('chipLeft');
    const chipRight = document.getElementById('chipRight');
    const chips = document.querySelectorAll('.chip');
    const videoCards = document.querySelectorAll('.video-card');
    const videoGrid = document.getElementById('videoGrid');
    const noResults = document.getElementById('noResults');
    const logoLink = document.getElementById('logoLink');
    const showMoreSubs = document.getElementById('showMoreSubs');
    const subscriptionsSection = document.getElementById('subscriptionsSection');

    // === Sidebar Toggle ===
    const isSmallScreen = () => window.innerWidth <= 1312;

    menuToggle.addEventListener('click', () => {
        if (isSmallScreen()) {
            document.body.classList.toggle('sidebar-open');
        } else {
            document.body.classList.toggle('sidebar-collapsed');
        }
    });

    sidebarOverlay.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
    });

    window.addEventListener('resize', () => {
        if (!isSmallScreen()) {
            document.body.classList.remove('sidebar-open');
        }
    });

    // === Search Bar ===
    searchInput.addEventListener('input', () => {
        clearSearch.style.display = searchInput.value ? 'flex' : 'none';
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        clearSearch.style.display = 'none';
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
        }
    });

    // === Category Chip Filtering ===
    function filterByCategory(category) {
        // Update active chip
        chips.forEach(c => c.classList.remove('active'));
        const matchingChip = document.querySelector(`.chip[data-category="${category}"]`);
        if (matchingChip) {
            matchingChip.classList.add('active');
            matchingChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        let visibleCount = 0;

        if (category === 'all') {
            videoCards.forEach(card => {
                card.classList.remove('hidden');
                visibleCount++;
            });
        } else {
            videoCards.forEach(card => {
                const cardCategories = card.dataset.category ? card.dataset.category.split(',') : [];
                if (cardCategories.includes(category)) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        // Show/hide no results message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
        }

        setTimeout(updateChipArrows, 100);
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            filterByCategory(category);
        });
    });

    // === Chip Scroll Arrows ===
    const updateChipArrows = () => {
        if (!chipsContainer) return;
        const { scrollLeft, scrollWidth, clientWidth } = chipsContainer;
        if (chipLeft) chipLeft.classList.toggle('visible', scrollLeft > 10);
        if (chipRight) chipRight.classList.toggle('visible', scrollLeft < scrollWidth - clientWidth - 10);
    };

    if (chipLeft) {
        chipLeft.addEventListener('click', () => {
            chipsContainer.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }

    if (chipRight) {
        chipRight.addEventListener('click', () => {
            chipsContainer.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    if (chipsContainer) {
        chipsContainer.addEventListener('scroll', updateChipArrows);
    }
    window.addEventListener('resize', updateChipArrows);
    setTimeout(updateChipArrows, 100);

    // === Sidebar Navigation Active State Sync ===
    const sidebarItems = document.querySelectorAll('.sidebar-item[data-page]');
    const miniItems = document.querySelectorAll('.mini-sidebar-item[data-page]');

    function setActivePage(page) {
        sidebarItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        miniItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't prevent default - let the link open in new tab
            setActivePage(item.dataset.page);
            if (isSmallScreen()) {
                document.body.classList.remove('sidebar-open');
            }
        });
    });

    miniItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't prevent default - let the link open in new tab
            setActivePage(item.dataset.page);
        });
    });

    // === Sidebar Explore Filter Integration ===
    const exploreItems = document.querySelectorAll('.sidebar-item[data-filter]');
    exploreItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't prevent default - let the link open in new tab
            const filter = item.dataset.filter;

            // Highlight this explore item
            exploreItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Filter videos by category
            filterByCategory(filter);

            // On small screens, close sidebar
            if (isSmallScreen()) {
                document.body.classList.remove('sidebar-open');
            }
        });
    });

    // === Show More Subscriptions Toggle ===
    if (showMoreSubs && subscriptionsSection) {
        showMoreSubs.addEventListener('click', () => {
            const isExpanded = subscriptionsSection.classList.toggle('subs-expanded');
            const label = showMoreSubs.querySelector('.sidebar-label');
            if (label) {
                label.textContent = isExpanded ? 'Show fewer' : 'Show more';
            }
        });
    }

    // === Logo Click - Reset to Home ===
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            filterByCategory('all');
            setActivePage('home');
            exploreItems.forEach(i => i.classList.remove('active'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // === Keyboard Shortcuts ===
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchInput.blur();
            document.body.classList.remove('sidebar-open');
        }
    });

    // === Progress Bar on Thumbnail Hover ===
    const thumbnailContainers = document.querySelectorAll('.thumbnail-container');
    thumbnailContainers.forEach(container => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background-color: red;
            width: 0%;
            z-index: 2;
            transition: width 0.1s linear;
        `;
        container.appendChild(progressBar);

        let interval;
        container.addEventListener('mouseenter', () => {
            let width = 0;
            progressBar.style.width = '0%';
            interval = setInterval(() => {
                width += 0.5;
                if (width >= 100) {
                    clearInterval(interval);
                    width = 100;
                }
                progressBar.style.width = width + '%';
            }, 30);
        });

        container.addEventListener('mouseleave', () => {
            clearInterval(interval);
            progressBar.style.width = '0%';
        });
    });

    // === Video Card Three-Dot Menu ===
    const menuButtons = document.querySelectorAll('.video-menu-btn');
    menuButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close any open menus
            document.querySelectorAll('.video-context-menu').forEach(m => m.remove());

            const menu = document.createElement('div');
            menu.className = 'video-context-menu';
            menu.innerHTML = `
                <div class="context-menu-item"><span class="material-symbols-outlined">playlist_add</span>Save to playlist</div>
                <div class="context-menu-item"><span class="material-symbols-outlined">download</span>Download</div>
                <div class="context-menu-item"><span class="material-symbols-outlined">share</span>Share</div>
                <div class="context-menu-item"><span class="material-symbols-outlined">block</span>Not interested</div>
                <div class="context-menu-item"><span class="material-symbols-outlined">do_not_disturb_on</span>Don't recommend channel</div>
                <div class="context-menu-item"><span class="material-symbols-outlined">flag</span>Report</div>
            `;
            menu.style.cssText = `
                position: absolute;
                right: 0;
                top: 100%;
                background: var(--bg-primary, #fff);
                border-radius: 12px;
                box-shadow: 0 4px 32px rgba(0,0,0,0.15);
                padding: 8px 0;
                z-index: 5000;
                min-width: 250px;
                animation: menuFadeIn 0.15s ease;
            `;

            const videoInfo = btn.closest('.video-info');
            if (videoInfo) {
                videoInfo.style.position = 'relative';
                videoInfo.appendChild(menu);
            }

            // Close menu on outside click
            const closeMenu = (ev) => {
                if (!menu.contains(ev.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => document.addEventListener('click', closeMenu), 0);

            // Menu item clicks
            menu.querySelectorAll('.context-menu-item').forEach(item => {
                item.addEventListener('click', () => menu.remove());
            });
        });
    });

    // === Scroll-triggered Video Card Animations ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation based on visible order
                const card = entry.target;
                const siblings = Array.from(card.parentElement.querySelectorAll('.video-card:not(.animate-in):not(.hidden)'));
                const staggerIndex = siblings.indexOf(card);
                const delay = Math.min(staggerIndex * 80, 400);

                setTimeout(() => {
                    card.classList.add('animate-in');
                }, delay);

                cardObserver.unobserve(card);
            }
        });
    }, observerOptions);

    videoCards.forEach(card => {
        cardObserver.observe(card);
    });

    // Re-observe cards after category filter
    const originalFilterByCategory = filterByCategory;
    // Override filter to re-trigger animations
    const patchedFilter = (category) => {
        // Remove animate-in to allow re-animation
        videoCards.forEach(card => card.classList.remove('animate-in'));
        originalFilterByCategory(category);

        // Re-observe visible cards
        setTimeout(() => {
            videoCards.forEach(card => {
                if (!card.classList.contains('hidden')) {
                    cardObserver.observe(card);
                }
            });
        }, 50);
    };

    // Re-bind chip clicks with patched filter
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            patchedFilter(chip.dataset.category);
        });
    });

    // === Chip Ripple Effect ===
    chips.forEach(chip => {
        chip.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // === Voice Button Pulse on Hover ===
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('mouseenter', () => {
            voiceBtn.style.animation = 'pulse 0.4s ease';
        });
        voiceBtn.addEventListener('animationend', () => {
            voiceBtn.style.animation = '';
        });
    }

    // === Initial State ===
    clearSearch.style.display = 'none';
});
