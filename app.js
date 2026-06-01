/* ==========================================================================
   Happy Birthday Amara Clarinta Maharani
   Core Script: Animations, Games, and Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Core Elements
    const envelopeScreen = document.getElementById('envelopeScreen');
    const btnOpenEnvelope = document.getElementById('btnOpenEnvelope');
    const mainContent = document.getElementById('mainContent');
    const musicPlayer = document.getElementById('musicPlayer');

    // ==========================================================================
    // 0. PREMIUM FULL-SCREEN INTRO OVERLAY MANAGER (FIREWORKS & CAKE INTERACTIVE)
    // ==========================================================================
    const introCountdownOverlay = document.getElementById('introCountdownOverlay');
    const introTriggerStage = document.getElementById('introTriggerStage');
    const introCountdownStage = document.getElementById('introCountdownStage');
    const introGreetingStage = document.getElementById('introGreetingStage');
    const countdownNumber = document.getElementById('countdownNumber');
    const introCake = document.getElementById('introCake');
    const introFlame = document.getElementById('introFlame');

    // Canvas Fireworks Setup
    const introCanvas = document.getElementById('introCanvas');
    const iCtx = introCanvas.getContext('2d');
    let fwParticles = [];
    let fireworks = [];
    let fireworksActive = false;

    function resizeIntroCanvas() {
        if (introCanvas) {
            introCanvas.width = window.innerWidth;
            introCanvas.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', resizeIntroCanvas);
    resizeIntroCanvas();

    class Firework {
        constructor() {
            this.x = Math.random() * introCanvas.width;
            this.y = introCanvas.height;
            this.targetY = Math.random() * (introCanvas.height * 0.4) + introCanvas.height * 0.15;
            this.speed = Math.random() * 4 + 7;
            this.angle = Math.atan2(this.targetY - this.y, 0);
            this.velocity = { x: (Math.random() * 2 - 1) * 0.5, y: -this.speed };
            this.hue = Math.random() * 360;
        }
        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            if (this.y <= this.targetY) {
                explodeFirework(this.x, this.y, this.hue);
                return false;
            }
            return true;
        }
        draw() {
            iCtx.save();
            iCtx.fillStyle = `hsl(${this.hue}, 100%, 75%)`;
            iCtx.beginPath();
            iCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            iCtx.fill();
            iCtx.restore();
        }
    }

    class FwParticle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 5 + 2.5;
            this.friction = 0.96;
            this.gravity = 0.15;
            this.hue = hue;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.velocity = {
                x: Math.cos(this.angle) * this.speed,
                y: Math.sin(this.angle) * this.speed
            };
        }
        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= this.decay;
            return this.alpha > 0;
        }
        draw() {
            iCtx.save();
            iCtx.globalAlpha = this.alpha;
            iCtx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
            iCtx.beginPath();
            iCtx.arc(this.x, this.y, Math.random() * 3 + 1, 0, Math.PI * 2);
            iCtx.fill();
            iCtx.restore();
        }
    }

    function explodeFirework(x, y, hue) {
        playExplosionSound(hue);
        for (let i = 0; i < 50; i++) {
            fwParticles.push(new FwParticle(x, y, hue));
        }
    }

    function animateFireworks() {
        if (!fireworksActive) return;
        // Dynamic trail color based on theme to avoid covering dark background
        const isDark = document.body.classList.contains('dark-mode');
        iCtx.fillStyle = isDark ? 'rgba(7, 10, 19, 0.25)' : 'rgba(255, 238, 242, 0.2)';
        iCtx.fillRect(0, 0, introCanvas.width, introCanvas.height);

        if (Math.random() < 0.06 && fireworks.length < 5) {
            fireworks.push(new Firework());
        }

        fireworks = fireworks.filter(fw => {
            const alive = fw.update();
            if (alive) fw.draw();
            return alive;
        });

        fwParticles = fwParticles.filter(p => {
            const alive = p.update();
            if (alive) p.draw();
            return alive;
        });

        requestAnimationFrame(animateFireworks);
    }

    function playExplosionSound(hue) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(90 + (hue % 160), audioCtx.currentTime);
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.35);
        } catch (e) { }
    }

    function playSynthChime(freq, duration) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { }
    }

    // Trigger start on click anywhere on full overlay
    let introStarted = false;
    if (introCountdownOverlay) {
        introCountdownOverlay.addEventListener('click', (e) => {
            if (introStarted) return;
            introStarted = true;

            // 1. Transition to countdown stage
            introTriggerStage.classList.remove('active');
            introCountdownStage.classList.add('active');
            playSynthChime(330, 0.1);

            // Synchronously play and mute bgAudio to bypass browser autoplay policies
            const bgAudioElem = document.getElementById('bgAudio');
            if (bgAudioElem) {
                bgAudioElem.src = "mix.mp4";
                bgAudioElem.load();

                const titleEl = document.querySelector('#musicPlayer .song-title');
                const artistEl = document.querySelector('#musicPlayer .song-artist');
                if (titleEl) titleEl.textContent = "Amara's Theme Song";
                if (artistEl) artistEl.textContent = "Special Video Gift 🌸";

                bgAudioElem.volume = 0;
                bgAudioElem.muted = true;
                bgAudioElem.play()
                    .then(() => {
                        console.log("Audio successfully unlocked on user gesture!");
                    })
                    .catch(err => {
                        console.log("Audio unlock failed:", err);
                    });
            }

            // 2. Start the 3, 2, 1 Countdown Loop
            let count = 3;
            countdownNumber.textContent = count;

            const countdownInterval = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownNumber.textContent = count;
                    playSynthChime(330 + (3 - count) * 110, 0.1);
                } else {
                    clearInterval(countdownInterval);

                    // Transition to Cake & Greeting Stage
                    introCountdownStage.classList.remove('active');
                    introGreetingStage.classList.add('active');

                    // Trigger music playback precisely at countdown 0
                    const bgAudioElem = document.getElementById('bgAudio');
                    const volSliderElem = document.getElementById('volumeSlider');
                    const playPauseBtnElem = document.getElementById('btnPlayPause');
                    if (bgAudioElem) {
                        bgAudioElem.currentTime = 0;
                        bgAudioElem.muted = false;
                        bgAudioElem.volume = volSliderElem ? volSliderElem.value : 0.5;
                        bgAudioElem.play()
                            .then(() => {
                                if (playPauseBtnElem) playPauseBtnElem.innerHTML = '<i class="fas fa-pause"></i>';
                            })
                            .catch(err => {
                                console.log("Failed to play on countdown 0:", err);
                            });
                    }
                    musicInitialized = true;

                    // Start firework canvas
                    fireworksActive = true;
                    animateFireworks();

                    // Play chime chord
                    playSynthChime(554.37, 0.2); // C#5
                    setTimeout(() => playSynthChime(659.25, 0.2), 100); // E5
                    setTimeout(() => playSynthChime(880.00, 0.4), 200); // A5
                }
            }, 1000);
        });
    }

    // Interactive Cake: Blow out the Candle!
    let candleBlown = false;
    if (introCake) {
        // Prevent click bubbling up and triggering overlay clicks
        introCake.addEventListener('click', (e) => {
            e.stopPropagation();
            if (candleBlown) return;
            candleBlown = true;

            // 1. Extinguish candle flame
            if (introFlame) {
                introFlame.style.transform = 'scale(0)';
                introFlame.style.opacity = '0';
            }

            // 2. Stop fireworks
            fireworksActive = false;

            // 3. Play success chimes & celebration burst
            playSynthChime(523.25, 0.15); // C5
            setTimeout(() => playSynthChime(659.25, 0.15), 80); // E5
            setTimeout(() => playSynthChime(783.99, 0.15), 160); // G5
            setTimeout(() => playSynthChime(1046.50, 0.5), 240); // C6 chord!

            // Generate massive confetti blast on the fireworks canvas
            iCtx.clearRect(0, 0, introCanvas.width, introCanvas.height);
            for (let i = 0; i < 90; i++) {
                fwParticles.push(new FwParticle(introCanvas.width / 2, introCanvas.height * 0.6, Math.random() * 360));
            }

            // Temporary loop to render the final massive confetti blast
            let blastDuration = 60;
            function renderBlast() {
                if (blastDuration-- <= 0) return;
                iCtx.fillStyle = 'rgba(255, 238, 242, 0.25)';
                iCtx.fillRect(0, 0, introCanvas.width, introCanvas.height);
                fwParticles = fwParticles.filter(p => {
                    const alive = p.update();
                    if (alive) p.draw();
                    return alive;
                });
                requestAnimationFrame(renderBlast);
            }
            renderBlast();

            // 4. Fade out overlay to show the main 3D book cover
            setTimeout(() => {
                introCountdownOverlay.style.opacity = '0';
                setTimeout(() => {
                    introCountdownOverlay.style.display = 'none';
                }, 1200);
            }, 1000);
        });
    }

    // ==========================================================================
    // 1. FLOATING PARTICLES SYSTEM (BACKGROUND CANVAS) & FAIRY DUST CURSOR
    // ==========================================================================
    const particleCanvas = document.getElementById('particleCanvas');
    const pCtx = particleCanvas.getContext('2d');
    let particles = [];
    let cursorSparkles = [];

    function resizeParticleCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeParticleCanvas);
    resizeParticleCanvas();

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * particleCanvas.height;
        }

        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = particleCanvas.height + 20;
            this.size = Math.random() * 15 + 8;
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = Math.sin(Math.random() * 2) * 0.4;
            this.type = Math.floor(Math.random() * 5); // 0=Heart, 1=Balloon, 2=Star, 3=Sakura, 4=Gift
            this.opacity = Math.random() * 0.5 + 0.3;
            const colors = ['rgba(255, 107, 139, ', 'rgba(255, 182, 193, ', 'rgba(255, 215, 0, ', 'rgba(255, 255, 255, '];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            this.angle = Math.random() * Math.PI;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.angle += this.rotationSpeed;
            if (this.y < 100) this.opacity -= 0.005;
            if (this.y < -20 || this.opacity <= 0) this.reset();
        }

        draw() {
            pCtx.save();
            pCtx.globalAlpha = this.opacity;
            pCtx.translate(this.x, this.y);
            pCtx.rotate(this.angle);
            pCtx.fillStyle = this.colorBase + '1)';

            if (this.type === 0) {
                pCtx.beginPath();
                pCtx.moveTo(0, 0);
                pCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
                pCtx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
                pCtx.fill();
            } else if (this.type === 1) {
                pCtx.beginPath();
                pCtx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
                pCtx.fill();
                pCtx.beginPath();
                pCtx.moveTo(0, this.size * 0.8);
                pCtx.lineTo(0, this.size * 1.5);
                pCtx.strokeStyle = 'rgba(139, 104, 115, 0.4)';
                pCtx.lineWidth = 1;
                pCtx.stroke();
            } else if (this.type === 2) {
                pCtx.beginPath();
                for (let i = 0; i < 5; i++) {
                    pCtx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size * 0.5,
                        Math.sin((18 + i * 72) * Math.PI / 180) * this.size * 0.5);
                    pCtx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * this.size * 0.2,
                        Math.sin((54 + i * 72) * Math.PI / 180) * this.size * 0.2);
                }
                pCtx.closePath();
                pCtx.fill();
            } else if (this.type === 3) {
                pCtx.beginPath();
                for (let i = 0; i < 5; i++) {
                    pCtx.rotate(Math.PI * 2 / 5);
                    pCtx.bezierCurveTo(-this.size * 0.3, -this.size * 0.3, -this.size * 0.1, -this.size * 0.7, 0, -this.size * 0.7);
                    pCtx.bezierCurveTo(this.size * 0.1, -this.size * 0.7, this.size * 0.3, -this.size * 0.3, 0, 0);
                }
                pCtx.fill();
                pCtx.beginPath();
                pCtx.arc(0, 0, this.size * 0.18, 0, Math.PI * 2);
                pCtx.fillStyle = 'rgba(255, 215, 0, 1)';
                pCtx.fill();
            } else {
                pCtx.fillRect(-this.size * 0.4, -this.size * 0.4, this.size * 0.8, this.size * 0.8);
                pCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                pCtx.fillRect(-this.size * 0.08, -this.size * 0.4, this.size * 0.16, this.size * 0.8);
                pCtx.fillRect(-this.size * 0.4, -this.size * 0.08, this.size * 0.8, this.size * 0.16);
            }
            pCtx.restore();
        }
    }

    class CursorSparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 4;
            this.speedX = (Math.random() - 0.5) * 2.5;
            this.speedY = (Math.random() - 0.5) * 2.5 - 0.8;
            this.opacity = 1.0;
            this.decay = Math.random() * 0.02 + 0.015;
            const colors = ['#ffd700', '#ffb6c1', '#ffe4e1', '#ffffff', '#ff4d6d'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.08;
            this.type = Math.random() < 0.3 ? 0 : 2; // heart or star
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.angle += this.spin;
            this.opacity -= this.decay;
            this.size *= 0.97;
        }

        draw() {
            pCtx.save();
            pCtx.globalAlpha = Math.max(0, this.opacity);
            pCtx.translate(this.x, this.y);
            pCtx.rotate(this.angle);
            pCtx.fillStyle = this.color;

            if (this.type === 0) {
                pCtx.beginPath();
                pCtx.moveTo(0, 0);
                pCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
                pCtx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
                pCtx.fill();
            } else {
                pCtx.beginPath();
                for (let i = 0; i < 4; i++) {
                    pCtx.rotate(Math.PI / 4);
                    pCtx.lineTo(0, -this.size);
                    pCtx.rotate(Math.PI / 4);
                    pCtx.lineTo(0, -this.size * 0.25);
                }
                pCtx.closePath();
                pCtx.fill();
            }
            pCtx.restore();
        }
    }

    const maxParticles = 40;
    for (let i = 0; i < maxParticles; i++) particles.push(new Particle());

    window.addEventListener('pointermove', (e) => {
        for (let i = 0; i < 3; i++) cursorSparkles.push(new CursorSparkle(e.clientX, e.clientY));
    });

    window.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        for (let i = 0; i < 2; i++) cursorSparkles.push(new CursorSparkle(touch.clientX, touch.clientY));
    }, { passive: true });

    function animateParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        cursorSparkles.forEach((s, idx) => {
            s.update();
            s.draw();
            if (s.opacity <= 0 || s.size <= 0.5) cursorSparkles.splice(idx, 1);
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ==========================================================================
    // 2. 3D STORYBOOK LANDING TRANSITION
    // ==========================================================================
    const storybook = document.getElementById('storybook');
    let transitionedToMain = false;

    function triggerOpenEnvelope() {
        if (transitionedToMain) return;
        transitionedToMain = true;

        if (storybook) storybook.classList.add('open');
        initMusic();

        setTimeout(() => {
            envelopeScreen.classList.add('slide-up');
            mainContent.classList.add('reveal');
            musicPlayer.classList.add('show');

            triggerConfettiBurst(100);
            initMemoryGame();
        }, 1200);
    }

    if (storybook) {
        storybook.addEventListener('click', (e) => {
            if (storybook.classList.contains('open')) {
                // If book is already open, clicking anywhere on it immediately starts the transition!
                triggerOpenEnvelope();
            } else {
                // Otherwise, clicking it swings it open!
                storybook.classList.add('open');
            }
        });
    }

    if (btnOpenEnvelope) {
        btnOpenEnvelope.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent bubbling double triggers
            triggerOpenEnvelope();
        });
    }


    // ==========================================================================
    // 3. AESTHETIC MUSIC PLAYER
    // ==========================================================================
    const bgAudio = document.getElementById('bgAudio');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const volumeSlider = document.getElementById('volumeSlider');
    const waveBars = document.querySelectorAll('.wave-bar');
    const reelLeft = document.getElementById('reelLeft');
    const reelRight = document.getElementById('reelRight');

    const playlist = [
        {
            title: "Amara's Theme Song",
            artist: "Special Video Gift 🌸",
            url: "mix.mp4"
        },
        {
            title: "Shape of My Heart",
            artist: "Backstreet Boys 💖",
            url: "Backstreet Boys - Shape Of My Heart (256).mp3"
        },
        {
            title: "Sweet Memories with Amara 💖",
            artist: "Our Beautiful Days ✨",
            url: "song1.mp4"
        },
        {
            title: "Unconditional Love 💕",
            artist: "Forever & Always 🌸",
            url: "song2.mp4"
        },
        {
            title: "Happy Birthday, Sweetheart 🎂",
            artist: "You Are My Sunshine ☀️",
            url: "song3.mp4"
        }
    ];

    let currentTrackIndex = 0;
    let musicInitialized = false;

    function initMusic() {
        if (musicInitialized) return;
        musicInitialized = true;
        loadTrack(0);
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        const track = playlist[index];
        bgAudio.src = track.url;

        const titleEl = musicPlayer.querySelector('.song-title');
        const artistEl = musicPlayer.querySelector('.song-artist');
        titleEl.textContent = track.title;
        artistEl.textContent = track.artist;

        bgAudio.play()
            .then(() => { btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>'; })
            .catch(err => {
                console.log("Audio load block, waiting for trigger.", err);
                btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
            });
    }

    function togglePlay() {
        if (bgAudio.paused) {
            bgAudio.play()
                .then(() => { btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>'; })
                .catch(err => {
                    playBeepSynth();
                    btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
                });
        } else {
            bgAudio.pause();
            btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    btnPlayPause.addEventListener('click', togglePlay);
    btnPrev.addEventListener('click', () => {
        let prevIndex = currentTrackIndex - 1;
        if (prevIndex < 0) prevIndex = playlist.length - 1;
        loadTrack(prevIndex);
    });
    btnNext.addEventListener('click', () => {
        let nextIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(nextIndex);
    });
    volumeSlider.addEventListener('input', (e) => { bgAudio.volume = e.target.value; });

    // Auto-advance to the next track when current track ends
    bgAudio.addEventListener('ended', () => {
        let nextIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(nextIndex);
    });

    function animateVisualizer() {
        if (musicInitialized && !bgAudio.paused) {
            if (reelLeft) reelLeft.classList.add('playing');
            if (reelRight) reelRight.classList.add('playing');
            const time = Date.now() * 0.006;
            waveBars.forEach((bar, idx) => {
                const height = 4 + Math.sin(time + idx * 0.55) * 6 + Math.cos(time * 0.75 + idx * 0.35) * 6 + Math.random() * 4;
                bar.style.height = `${Math.max(2, Math.min(22, height))}px`;
            });
        } else {
            if (reelLeft) reelLeft.classList.remove('playing');
            if (reelRight) reelRight.classList.remove('playing');
            waveBars.forEach(bar => { bar.style.height = '3px'; });
        }
        requestAnimationFrame(animateVisualizer);
    }
    animateVisualizer();

    let audioCtx = null;
    function playBeepSynth() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
            let time = audioCtx.currentTime;
            notes.forEach((freq) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.setValueAtTime(freq, time);
                gain.gain.setValueAtTime(0.08, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
                osc.start(time);
                osc.stop(time + 0.3);
                time += 0.35;
            });
        } catch (e) { }
    }


    // ==========================================================================
    // 4. BIRTHDAY CAKE CANDLES & MAKE A WISH
    // ==========================================================================
    const candles = document.querySelectorAll('.candle');
    const btnResetCandles = document.getElementById('btnResetCandles');
    const wishModal = document.getElementById('wishModal');
    const btnSavePersonalWish = document.getElementById('btnSavePersonalWish');
    const amaraPersonalWish = document.getElementById('amaraPersonalWish');
    const btnWishModalClose = document.getElementById('btnWishModalClose');

    let litCandlesCount = 5;
    let cakeReadyToCut = false;
    let cakeIsCut = false;

    // Cake Cutting DOM Elements
    const cakeArena = document.getElementById('cakeArena');
    const cakeWrapper = document.getElementById('cakeWrapper');
    const cakeSplitContainer = document.getElementById('cakeSplitContainer');
    const cakeKnife = document.getElementById('cakeKnife');
    const cakeInstruction = document.getElementById('cakeInstruction');
    const btnOpenGiftTransition = document.getElementById('btnOpenGiftTransition');

    candles.forEach(candle => {
        ['pointerenter', 'click'].forEach(eventType => {
            candle.addEventListener(eventType, () => {
                if (candle.getAttribute('data-lit') === 'true') {
                    extinguishCandle(candle);
                }
            });
        });
    });

    function extinguishCandle(candle) {
        candle.setAttribute('data-lit', 'false');
        candle.classList.add('blown');
        litCandlesCount--;

        const rect = candle.getBoundingClientRect();
        triggerConfettiBurst(12, rect.left + rect.width / 2, rect.top);

        if (litCandlesCount === 0) {
            setTimeout(() => {
                triggerConfettiBurst(60);
                enableCakeCutting();
            }, 600);
        }
    }

    function enableCakeCutting() {
        cakeReadyToCut = true;

        // Add knife cursor to the cake section
        const cakeSection = document.getElementById('cakeSection');
        if (cakeSection) cakeSection.classList.add('cursor-knife');

        // Update instruction text with sparklies
        if (cakeInstruction) {
            cakeInstruction.innerHTML = "Lilin telah padam! Sekarang, ayo potong kuenya! Seret kursor atau klik kue untuk memotong! 🔪✨";
            cakeInstruction.style.color = "var(--primary-pink)";
            cakeInstruction.style.fontWeight = "bold";
        }

        // Show knife tool and set up cursor overrides
        if (cakeKnife && cakeArena) {
            cakeKnife.style.display = "block";
            setTimeout(() => cakeKnife.style.opacity = "1", 50);
            cakeArena.classList.add('knife-active');

            // Track pointer positions within cake boundary
            cakeArena.addEventListener('pointermove', moveKnife);
            cakeArena.addEventListener('pointerleave', hideKnife);
            cakeArena.addEventListener('pointerenter', showKnife);

            // Listen for cutting slice triggers
            cakeArena.addEventListener('click', sliceCake);
        }
    }

    function moveKnife(e) {
        if (!cakeReadyToCut || cakeIsCut) return;
        const rect = cakeArena.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cakeKnife.style.left = `${x}px`;
        cakeKnife.style.top = `${y}px`;
    }

    function hideKnife() {
        if (!cakeReadyToCut || cakeIsCut) return;
        cakeKnife.style.opacity = "0";
    }

    function showKnife() {
        if (!cakeReadyToCut || cakeIsCut) return;
        cakeKnife.style.opacity = "1";
    }

    function sliceCake(e) {
        if (!cakeReadyToCut || cakeIsCut) return;
        cakeIsCut = true;
        cakeReadyToCut = false;

        // Remove knife cursor from the cake section
        const cakeSection = document.getElementById('cakeSection');
        if (cakeSection) cakeSection.classList.remove('cursor-knife');

        // Play clean slicing sound
        playSliceSound();

        // Fade out knife cursor
        if (cakeKnife) {
            cakeKnife.style.opacity = "0";
            setTimeout(() => cakeKnife.style.display = "none", 300);
        }
        if (cakeArena) cakeArena.classList.remove('knife-active');

        // Slide out standard cake and slide in split parts
        if (cakeWrapper) cakeWrapper.style.display = "none";
        if (cakeSplitContainer) cakeSplitContainer.style.display = "flex";

        setTimeout(() => {
            if (cakeSplitContainer) cakeSplitContainer.classList.add('sliced');
            triggerConfettiBurst(120);

            // Satisfying synthetic chime chords
            playSynthChime(523.25, 0.15); // C5
            setTimeout(() => playSynthChime(659.25, 0.15), 80); // E5
            setTimeout(() => playSynthChime(783.99, 0.15), 160); // G5
            setTimeout(() => playSynthChime(1046.50, 0.5), 240); // C6 chord!

            // Adjust header feedback
            if (cakeInstruction) {
                cakeInstruction.innerHTML = "Hore! Kuenya berhasil dipotong! 🍰 Selai stroberi segar di dalamnya kelihatan lezat sekali! 💖";
            }

            // Slide up custom transitions button
            if (btnOpenGiftTransition) {
                btnOpenGiftTransition.style.display = "inline-block";
                setTimeout(() => {
                    btnOpenGiftTransition.style.opacity = "1";
                    btnOpenGiftTransition.style.transform = "scale(1)";
                }, 50);
            }
        }, 100);
    }

    function playSliceSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.type = 'triangle';
            // Clean swish cut frequency sweep
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.25);

            gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } catch (e) { }
    }

    // Set up open gift transitions trigger
    if (btnOpenGiftTransition) {
        btnOpenGiftTransition.addEventListener('click', () => {
            triggerConfettiBurst(150);
            showGiftOverlay();

            // Smoothly hide transition button
            btnOpenGiftTransition.style.opacity = "0";
            btnOpenGiftTransition.style.transform = "scale(0.9)";
            setTimeout(() => btnOpenGiftTransition.style.display = "none", 600);
        });
    }

    btnResetCandles.addEventListener('click', () => {
        candles.forEach(c => {
            c.setAttribute('data-lit', 'true');
            c.classList.remove('blown');
        });
        litCandlesCount = 5;

        // Reset interactive cake-cutting state completely
        cakeReadyToCut = false;
        cakeIsCut = false;

        // Remove knife cursor if candles are reset
        const cakeSection = document.getElementById('cakeSection');
        if (cakeSection) cakeSection.classList.remove('cursor-knife');

        if (cakeInstruction) {
            cakeInstruction.innerHTML = "Yuk bikin permohonan kamu! Klik atau geser kursor di atas lilin buat tiup lilinnya sampai mati, terus lihat apa yang bakal terjadi! ✨";
            cakeInstruction.style.color = "var(--light-text)";
            cakeInstruction.style.fontWeight = "normal";
        }

        if (cakeWrapper) cakeWrapper.style.display = "block";
        if (cakeSplitContainer) {
            cakeSplitContainer.style.display = "none";
            cakeSplitContainer.classList.remove('sliced');
        }
        if (cakeKnife) {
            cakeKnife.style.opacity = "0";
            cakeKnife.style.display = "none";
        }
        if (cakeArena) {
            cakeArena.classList.remove('knife-active');
            cakeArena.removeEventListener('pointermove', moveKnife);
            cakeArena.removeEventListener('pointerleave', hideKnife);
            cakeArena.removeEventListener('pointerenter', showKnife);
            cakeArena.removeEventListener('click', sliceCake);
        }
        if (btnOpenGiftTransition) {
            btnOpenGiftTransition.style.opacity = "0";
            btnOpenGiftTransition.style.transform = "scale(0.9)";
            setTimeout(() => btnOpenGiftTransition.style.display = "none", 600);
        }
    });

    function showWishModal() {
        const modal = document.getElementById('wishModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalDesc = modal.querySelector('.modal-desc');
        const amaraPersonalWish = document.getElementById('amaraPersonalWish');
        const btnSavePersonalWish = document.getElementById('btnSavePersonalWish');
        const modalHearts = modal.querySelector('.modal-hearts');

        if (modal) {
            modalHearts.textContent = '🎉🌸🎈';
            modalTitle.textContent = 'Make a Wish, Amara! 💫';
            modalDesc.textContent = 'Semua lilin telah padam! Pejamkan matamu, buatlah permohonan terindah dalam hatimu...';

            if (amaraPersonalWish) {
                amaraPersonalWish.parentElement.style.display = 'block';
                amaraPersonalWish.value = '';
            }
            if (btnSavePersonalWish) btnSavePersonalWish.style.display = 'inline-block';
            modal.classList.add('show');
        }
    }


    // ==========================================================================
    // 4B. GIFT BOX & 50 ROSES BOUQUET ENGINE
    // ==========================================================================
    const giftOverlay = document.getElementById('giftOverlay');
    const interactiveGiftBox = document.getElementById('interactiveGiftBox');
    const giftBoxWrapper = document.getElementById('giftBoxWrapper');
    const bouquetDisplayWrapper = document.getElementById('bouquetDisplayWrapper');
    const bouquetAssemblyArea = document.getElementById('bouquetAssemblyArea');
    const bouquetRosesContainer = document.getElementById('bouquetRosesContainer');
    const bouquetCanvas = document.getElementById('bouquetCanvas');
    const bCtx = bouquetCanvas.getContext('2d');

    let bouquetAnimationActive = false;
    let assemblyRoses = [];
    let bouquetPetals = [];
    let roseDomeTargets = [];
    let roseSpawnInterval = null;
    let allRosesLanded = false;
    let transitionTriggered = false;

    function resizeBouquetCanvas() {
        bouquetCanvas.width = window.innerWidth;
        bouquetCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeBouquetCanvas);
    resizeBouquetCanvas();

    function generateRoseDomeTargets() {
        roseDomeTargets = [];
        let count = 0;

        const layers = [
            { rx: 0, ry: 0, count: 1, zIndex: 100, fullCircle: true },
            { rx: 22, ry: 15, count: 6, zIndex: 80, fullCircle: true },
            { rx: 44, ry: 30, count: 12, zIndex: 60, fullCircle: true },
            { rx: 66, ry: 45, count: 16, zIndex: 40, fullCircle: true },
            { rx: 84, ry: 58, count: 15, zIndex: 20, fullCircle: false }
        ];

        const reversedLayers = [...layers].reverse();
        reversedLayers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                if (count >= 50) break;
                let angle;
                if (layer.count === 1) {
                    angle = 0;
                } else if (layer.fullCircle) {
                    angle = (i / layer.count) * Math.PI * 2;
                } else {
                    const startAngle = -Math.PI * 0.95;
                    const endAngle = -Math.PI * 0.05;
                    angle = startAngle + (i / (layer.count - 1)) * (endAngle - startAngle);
                }

                const xVariance = (Math.random() - 0.5) * 3;
                const yVariance = (Math.random() - 0.5) * 3;

                roseDomeTargets.push({
                    x: 200 + Math.cos(angle) * layer.rx + xVariance,
                    y: 165 + Math.sin(angle) * layer.ry + yVariance,
                    zIndex: layer.zIndex
                });
                count++;
            }
        });
    }

    class AssemblyRose {
        constructor(startX, startY, targetX, targetY, index) {
            this.x = startX;
            this.y = startY;
            this.startX = startX;
            this.startY = startY;
            this.targetX = targetX;
            this.targetY = targetY;
            this.index = index;

            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
            const speed = Math.random() * 8 + 6;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            this.size = Math.random() * 6 + 18;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 8 - 4;
            this.opacity = 1;
            this.landed = false;
            this.progress = 0;
            this.lerpSpeed = Math.random() * 0.02 + 0.025;

            this.midX = (startX + targetX) / 2 + (Math.random() - 0.5) * 160;
            this.midY = Math.min(startY, targetY) - 140 - Math.random() * 80;

            this.sparkles = [];
            this.el = null;
        }

        createDOMElement() {
            this.el = document.createElement('div');
            this.el.className = 'bouquet-rose';
            this.el.style.opacity = '1';

            this.el.innerHTML = `
                <svg viewBox="0 0 100 120" class="rose-svg">
                    <defs>
                        <linearGradient id="roseBudGrad_${this.index}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#ffccd5" />
                            <stop offset="60%" stop-color="#ffb3c1" />
                            <stop offset="100%" stop-color="#ff85a1" />
                        </linearGradient>
                        <linearGradient id="roseLeafGrad_${this.index}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#c7f9cc" />
                            <stop offset="100%" stop-color="#80ed99" />
                        </linearGradient>
                        <linearGradient id="roseStemGrad_${this.index}" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#80ed99" />
                            <stop offset="100%" stop-color="#57cc99" />
                        </linearGradient>
                    </defs>
                    <path d="M50,55 C50,85 46,102 46,115" fill="none" stroke="url(#roseStemGrad_${this.index})" stroke-width="2.5" stroke-linecap="round" />
                    <path d="M49,85 C36,82 30,94 48,97 Z" fill="url(#roseLeafGrad_${this.index})" stroke="#57cc99" stroke-width="0.5" />
                    <path d="M51,75 C64,72 70,84 52,87 Z" fill="url(#roseLeafGrad_${this.index})" stroke="#57cc99" stroke-width="0.5" />
                    <path d="M38,50 C38,60 62,60 62,50 C56,57 44,57 38,50 Z" fill="#57cc99" />
                    <path d="M22,38 C14,50 32,62 50,58 C68,62 86,50 78,38 C68,24 32,24 22,38 Z" fill="url(#roseBudGrad_${this.index})" />
                    <path d="M22,38 C18,48 38,54 46,50 C38,36 28,32 22,38 Z" fill="#ffb3c1" opacity="0.95" />
                    <path d="M78,38 C82,48 62,54 54,50 C62,36 72,32 78,38 Z" fill="#ffb3c1" opacity="0.95" />
                    <path d="M30,35 C28,45 42,50 50,49 C58,50 72,45 70,35 C65,22 35,22 30,35 Z" fill="#ffccd5" filter="brightness(1.05)" />
                    <path d="M42,32 C45,28 55,28 58,32 C58,36 52,41 50,41 C48,41 42,36 42,32 Z" fill="#ff85a1" />
                    <path d="M46,33 C48,31 52,31 54,33 C54,35 52,38 50,38 C48,38 46,35 46,33 Z" fill="#ff4d6d" opacity="0.9" />
                </svg>
            `;

            this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(0.15) rotate(${this.rotation}deg)`;
            this.el.style.zIndex = this.elZIndex || (this.index + 1);

            bouquetRosesContainer.appendChild(this.el);
            this.wiggleTimer = 0;
            this.restingRotation = (this.index % 11) - 5;
        }

        update() {
            if (this.landed) {
                if (this.wiggleTimer > 0) {
                    this.wiggleTimer -= 0.04;
                    const amplitude = this.wiggleTimer * 0.15;
                    this.scale = 1 + Math.sin(this.wiggleTimer * Math.PI * 4) * amplitude;
                    this.rotation = this.restingRotation + Math.sin(this.wiggleTimer * Math.PI * 3.5) * amplitude * 12;

                    if (this.el) {
                        this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale}) rotate(${this.rotation}deg)`;
                    }
                }
                this.sparkles.forEach((s, idx) => {
                    s.opacity -= 0.035;
                    if (s.opacity <= 0) this.sparkles.splice(idx, 1);
                });
                return;
            }

            this.progress += this.lerpSpeed;
            if (this.progress >= 1) {
                this.progress = 1;
                this.landed = true;
                this.x = this.targetX;
                this.y = this.targetY;
                this.rotation = this.restingRotation;
                this.scale = 1;
                this.wiggleTimer = 1.0;

                playRoseBeep(this.index);
                triggerLandingSparkles(this.x, this.y);
                return;
            }

            const t = this.progress;
            const u = 1 - t;
            this.x = u * u * (this.startX + this.vx) + 2 * u * t * this.midX + t * t * this.targetX;
            this.y = u * u * (this.startY + this.vy) + 2 * u * t * this.midY + t * t * this.targetY;
            this.rotation += this.rotationSpeed;
            this.scale = 0.15 + t * 0.85;

            if (this.el) {
                this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale}) rotate(${this.rotation}deg)`;
            }

            if (Math.random() < 0.3) {
                const containerRect = bouquetRosesContainer.getBoundingClientRect();
                const absX = this.x + containerRect.left;
                const absY = this.y + containerRect.top;
                this.sparkles.push({
                    x: absX,
                    y: absY,
                    size: Math.random() * 4 + 2,
                    opacity: 0.8,
                    color: ['#ffb6c1', '#ffe4e1', '#ffd700'][Math.floor(Math.random() * 3)]
                });
            }

            this.sparkles.forEach((s, idx) => {
                s.opacity -= 0.02;
                if (s.opacity <= 0) this.sparkles.splice(idx, 1);
            });
        }
    }

    function triggerLandingSparkles(localX, localY) {
        const containerRect = bouquetRosesContainer.getBoundingClientRect();
        const absX = localX + containerRect.left;
        const absY = localY + containerRect.top;

        for (let i = 0; i < 5; i++) {
            bouquetPetals.push({
                x: absX,
                y: absY,
                vx: Math.random() * 3 - 1.5,
                vy: Math.random() * 3 - 1.5,
                size: Math.random() * 4 + 2.5,
                opacity: 1,
                color: '#ffd700',
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.opacity -= 0.045;
                },
                draw() {
                    bCtx.save();
                    bCtx.globalAlpha = Math.max(0, this.opacity);
                    bCtx.fillStyle = this.color;
                    bCtx.beginPath();
                    bCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    bCtx.fill();
                    bCtx.restore();
                }
            });
        }
    }

    function playRoseBeep(index) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            let time = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const baseFreq = 261.63;
            const multiplier = 1 + (index % 12) * 0.0833;
            osc.frequency.setValueAtTime(baseFreq * multiplier, time);
            gain.gain.setValueAtTime(0.015, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
            osc.start(time);
            osc.stop(time + 0.12);
        } catch (e) { }
    }

    function showGiftOverlay() {
        interactiveGiftBox.classList.remove('open');
        giftBoxWrapper.classList.remove('fade-out');
        bouquetDisplayWrapper.style.display = 'none';
        bouquetDisplayWrapper.classList.remove('show');
        if (bouquetDisplayWrapper) bouquetDisplayWrapper.style.opacity = '';
        if (bouquetCanvas) {
            bouquetCanvas.style.display = 'block';
            bouquetCanvas.style.opacity = '';
        }
        bouquetRosesContainer.innerHTML = '';

        const wrappingPaperFront = document.getElementById('wrappingPaperFront');
        if (wrappingPaperFront) wrappingPaperFront.classList.remove('show-front');

        // Reset our Totebag claim panels
        const toteDeliveryContainer = document.getElementById('toteDeliveryContainer');
        const toteClaimPanel = document.getElementById('toteClaimPanel');
        const toteCourierPanel = document.getElementById('toteCourierPanel');
        const courierScooter = document.getElementById('courierScooter');

        if (toteDeliveryContainer) {
            toteDeliveryContainer.style.display = 'none';
            toteDeliveryContainer.style.opacity = '';
        }
        if (toteClaimPanel) {
            toteClaimPanel.style.display = 'flex';
            toteClaimPanel.style.opacity = '';
            toteClaimPanel.style.transform = '';
        }
        if (toteCourierPanel) {
            toteCourierPanel.style.display = 'none';
            toteCourierPanel.style.opacity = '';
            toteCourierPanel.style.transform = '';
        }
        if (courierScooter) {
            courierScooter.classList.remove('drive-in');
        }
        if (courierSmokeInterval) {
            clearInterval(courierSmokeInterval);
            courierSmokeInterval = null;
        }

        assemblyRoses = [];
        bouquetPetals = [];
        bouquetAnimationActive = false;
        allRosesLanded = false;
        transitionTriggered = false;
        if (roseSpawnInterval) clearInterval(roseSpawnInterval);

        giftOverlay.classList.add('show');
        resizeBouquetCanvas();
        generateRoseDomeTargets();
    }

    interactiveGiftBox.addEventListener('click', () => {
        if (interactiveGiftBox.classList.contains('open')) return;
        playChimeMelody();
        interactiveGiftBox.classList.add('open');

        setTimeout(() => {
            bouquetDisplayWrapper.style.display = 'flex';
            setTimeout(() => { bouquetDisplayWrapper.classList.add('show'); }, 50);

            bouquetAnimationActive = true;
            animateBouquet();

            const containerRect = bouquetRosesContainer.getBoundingClientRect();
            const boxRect = interactiveGiftBox.getBoundingClientRect();
            const startX = (boxRect.left + boxRect.width / 2) - containerRect.left;
            const startY = (boxRect.top + boxRect.height / 2) - containerRect.top;

            let count = 0;
            roseSpawnInterval = setInterval(() => {
                if (count >= 50) {
                    clearInterval(roseSpawnInterval);
                    return;
                }
                const target = roseDomeTargets[count];
                const rose = new AssemblyRose(startX, startY, target.x, target.y, count);
                rose.elZIndex = target.zIndex;
                rose.createDOMElement();
                assemblyRoses.push(rose);
                count++;
            }, 60);
        }, 850);
    });

    function spawnButterflies() {
        const container = document.getElementById('butterflyContainer');
        container.innerHTML = '';
        const numButterflies = 6;
        const centerX = container.clientWidth / 2;
        const centerY = container.clientHeight / 2;

        for (let i = 0; i < numButterflies; i++) {
            const b = document.createElement('div');
            b.className = 'butterfly';
            b.innerHTML = '<div class="wing-left"></div><div class="wing-right"></div>';

            const radiusX = Math.random() * 80 + 130;
            const radiusY = Math.random() * 60 + 90;
            const speed = Math.random() * 0.02 + 0.015;
            let angle = Math.random() * Math.PI * 2;
            const scale = Math.random() * 0.25 + 0.85;

            function updateButterfly() {
                angle += speed;
                const x = centerX + Math.cos(angle) * radiusX - 15;
                const y = centerY + Math.sin(angle) * radiusY - 15;
                const dx = -Math.sin(angle);
                const dy = Math.cos(angle);
                const heading = Math.atan2(dy, dx) * 180 / Math.PI + 90;

                b.style.left = `${x}px`;
                b.style.top = `${y}px`;
                b.style.transform = `rotate(${heading}deg) scale(${scale})`;

                if (bouquetAnimationActive) {
                    requestAnimationFrame(updateButterfly);
                }
            }
            container.appendChild(b);
            updateButterfly();
        }
    }

    function playChimeMelody() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            let time = audioCtx.currentTime;
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.setValueAtTime(freq, time);
                gain.gain.setValueAtTime(0.08, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
                osc.start(time);
                osc.stop(time + 0.55);
                time += 0.07;
            });
        } catch (e) { }
    }

    function animateBouquet() {
        if (!bouquetAnimationActive) return;
        bCtx.clearRect(0, 0, bouquetCanvas.width, bouquetCanvas.height);

        let landedCount = 0;
        assemblyRoses.forEach(rose => {
            rose.update();
            rose.sparkles.forEach(s => {
                bCtx.save();
                bCtx.globalAlpha = s.opacity;
                bCtx.fillStyle = s.color;
                bCtx.beginPath();
                bCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                bCtx.fill();
                bCtx.restore();
            });
            if (rose.landed) landedCount++;
        });

        bouquetPetals.forEach((sparkle, index) => {
            sparkle.update();
            sparkle.draw();
            if (sparkle.opacity <= 0) bouquetPetals.splice(index, 1);
        });

        if (landedCount === 50 && !allRosesLanded) {
            allRosesLanded = true;
            triggerFinalBouquetTransition();
        }
        requestAnimationFrame(animateBouquet);
    }

    function triggerFinalBouquetTransition() {
        if (transitionTriggered) return;
        transitionTriggered = true;

        playChimeMelody();
        const wrappingPaperFront = document.getElementById('wrappingPaperFront');
        if (wrappingPaperFront) wrappingPaperFront.classList.add('show-front');

        setTimeout(() => {
            const rect = bouquetAssemblyArea.getBoundingClientRect();
            triggerConfettiBurst(120, rect.left + rect.width / 2, rect.top + rect.height / 2);
            spawnButterflies();
        }, 300);

        setTimeout(() => { giftBoxWrapper.classList.add('fade-out'); }, 800);
        // Intercept standard wish transition and show pink tote claim panel!
        setTimeout(() => { showPinkToteClaim(); }, 5000);
    }

    function showPinkToteClaim() {
        if (bouquetDisplayWrapper) {
            bouquetDisplayWrapper.style.transition = 'opacity 0.8s ease';
            bouquetDisplayWrapper.style.opacity = '0';
        }
        if (bouquetCanvas) {
            bouquetCanvas.style.transition = 'opacity 0.8s ease';
            bouquetCanvas.style.opacity = '0';
        }

        setTimeout(() => {
            if (bouquetDisplayWrapper) bouquetDisplayWrapper.style.display = 'none';
            if (bouquetCanvas) bouquetCanvas.style.display = 'none';

            const toteDeliveryContainer = document.getElementById('toteDeliveryContainer');
            if (toteDeliveryContainer) {
                toteDeliveryContainer.style.display = 'flex';
            }
        }, 800);
    }

    function fadeGiftOverlayToWishModal() {
        giftOverlay.style.opacity = '0';
        setTimeout(() => {
            giftOverlay.classList.remove('show');
            giftOverlay.style.opacity = '';
            bouquetAnimationActive = false;
            showWishModal();
            triggerConfettiBurst(150);
        }, 600);
    }

    // ==========================================================================
    // PREMIUM INTERACTIVE TOTEBAG CLAIM & DELIVERY SERVICE LOGIC
    // ==========================================================================
    let courierSmokeInterval = null;
    const btnClaimTote = document.getElementById('btnClaimTote');
    const btnContinueWish = document.getElementById('btnContinueWish');
    const orderIdTag = document.getElementById('orderIdTag');
    const resiTag = document.getElementById('resiTag');
    const toteClaimPanel = document.getElementById('toteClaimPanel');
    const toteCourierPanel = document.getElementById('toteCourierPanel');
    const courierScooter = document.getElementById('courierScooter');
    const exhaustSmoke = document.getElementById('exhaustSmoke');
    const toteDeliveryContainer = document.getElementById('toteDeliveryContainer');

    if (btnClaimTote) {
        btnClaimTote.addEventListener('click', () => {
            // Play victory reward sounds
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                let time = audioCtx.currentTime;
                // Arpeggio C4 -> E4 -> G4 -> C5
                const notes = [261.63, 329.63, 392.00, 523.25];
                notes.forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.frequency.setValueAtTime(freq, time + idx * 0.08);
                    gain.gain.setValueAtTime(0.08, time + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.08 + 0.4);
                    osc.start(time + idx * 0.08);
                    osc.stop(time + idx * 0.08 + 0.4);
                });
            } catch (e) { }

            // Explosion of sparkles and confetti
            const rect = btnClaimTote.getBoundingClientRect();
            triggerConfettiBurst(80, rect.left + rect.width / 2, rect.top + rect.height / 2);

            // Shift panels smoothly
            if (toteClaimPanel && toteCourierPanel) {
                toteClaimPanel.style.transition = 'all 0.5s ease';
                toteClaimPanel.style.opacity = '0';
                toteClaimPanel.style.transform = 'scale(0.9)';

                setTimeout(() => {
                    toteClaimPanel.style.display = 'none';
                    toteCourierPanel.style.display = 'flex';
                    toteCourierPanel.style.opacity = '0';
                    toteCourierPanel.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        toteCourierPanel.style.opacity = '1';
                        toteCourierPanel.style.transform = 'scale(1)';

                        // Drive the vector courier scooter!
                        if (courierScooter) {
                            courierScooter.classList.add('drive-in');

                            // Generate real exhaust puffing smoke particles infinitely!
                            if (courierSmokeInterval) clearInterval(courierSmokeInterval);
                            courierSmokeInterval = setInterval(() => {
                                if (!courierScooter.classList.contains('drive-in')) {
                                    clearInterval(courierSmokeInterval);
                                    return;
                                }
                                const puff = document.createElement('div');
                                puff.className = 'smoke-puff';
                                if (exhaustSmoke) {
                                    exhaustSmoke.appendChild(puff);
                                    setTimeout(() => puff.remove(), 600);
                                }
                            }, 100);
                        }
                    }, 50);
                }, 500);
            }
        });
    }

    if (orderIdTag) {
        orderIdTag.addEventListener('click', () => {
            const orderNum = "584295515954447740";
            navigator.clipboard.writeText(orderNum).then(() => {
                const originalText = orderIdTag.innerHTML;
                orderIdTag.innerHTML = `Copied! <i class="fas fa-check"></i>`;
                orderIdTag.style.background = '#2ecc71';
                orderIdTag.style.color = '#fff';

                setTimeout(() => {
                    orderIdTag.innerHTML = originalText;
                    orderIdTag.style.background = '';
                    orderIdTag.style.color = '';
                }, 2000);
            }).catch(err => { });
        });
    }

    if (resiTag) {
        resiTag.addEventListener('click', () => {
            const resiNum = "JX9547493172";
            navigator.clipboard.writeText(resiNum).then(() => {
                const originalText = resiTag.innerHTML;
                resiTag.innerHTML = `Copied! <i class="fas fa-check"></i>`;
                resiTag.style.background = '#2ecc71';
                resiTag.style.color = '#fff';

                setTimeout(() => {
                    resiTag.innerHTML = originalText;
                    resiTag.style.background = '';
                    resiTag.style.color = '';
                }, 2000);
            }).catch(err => { });
        });
    }

    if (btnContinueWish) {
        btnContinueWish.addEventListener('click', () => {
            if (courierSmokeInterval) {
                clearInterval(courierSmokeInterval);
                courierSmokeInterval = null;
            }
            if (toteDeliveryContainer) {
                toteDeliveryContainer.style.transition = 'opacity 0.6s ease';
                toteDeliveryContainer.style.opacity = '0';

                setTimeout(() => {
                    giftOverlay.style.opacity = '0';
                    setTimeout(() => {
                        giftOverlay.classList.remove('show');
                        giftOverlay.style.opacity = '';
                        toteDeliveryContainer.style.display = 'none';
                        toteDeliveryContainer.style.opacity = '';
                        toteClaimPanel.style.display = 'flex';
                        toteClaimPanel.style.opacity = '';
                        toteClaimPanel.style.transform = '';
                        toteCourierPanel.style.display = 'none';
                        if (courierScooter) courierScooter.classList.remove('drive-in');

                        // Proceed to launch original wishModal
                        showWishModal();
                        triggerConfettiBurst(150);
                    }, 600);
                }, 600);
            }
        });
    }

    btnSavePersonalWish.addEventListener('click', () => {
        const wish = amaraPersonalWish.value.trim();
        if (wish) spawnWishLantern(wish, "Amara ✨", "#ffd700");
        wishModal.classList.remove('show');
        amaraPersonalWish.value = '';
        triggerConfettiBurst(100);
    });

    if (btnWishModalClose) {
        btnWishModalClose.addEventListener('click', () => {
            wishModal.classList.remove('show');
        });
    }

    wishModal.addEventListener('click', (e) => {
        if (e.target === wishModal) wishModal.classList.remove('show');
    });


    // ==========================================================================
    // 5. CANVAS CONFETTI SYSTEM
    // ==========================================================================
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cCtx = confettiCanvas.getContext('2d');
    let confettiPieces = [];

    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfettiCanvas);
    resizeConfettiCanvas();

    class ConfettiPiece {
        constructor(x, y) {
            this.x = x || Math.random() * confettiCanvas.width;
            this.y = y || Math.random() * -100 - 20;
            this.size = Math.random() * 8 + 6;
            this.color = ['#ff6b8b', '#ffb6c1', '#ffe4e1', '#ffd700', '#ffd1dc', '#ff477e'][Math.floor(Math.random() * 6)];
            this.speedX = Math.random() * 4 - 2;
            this.speedY = Math.random() * 5 + 3;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
            this.opacity = 1;

            const typeProb = Math.random();
            if (typeProb < 0.6) this.type = 0;
            else if (typeProb < 0.8) this.type = 1;
            else this.type = 2;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            this.speedX += Math.sin(this.y / 30) * 0.05;
            if (this.y > confettiCanvas.height - 100) this.opacity -= 0.015;
        }

        draw() {
            cCtx.save();
            cCtx.translate(this.x, this.y);
            cCtx.rotate((this.rotation * Math.PI) / 180);
            cCtx.globalAlpha = Math.max(0, this.opacity);
            cCtx.fillStyle = this.color;

            if (this.type === 0) {
                cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            } else if (this.type === 1) {
                cCtx.beginPath();
                for (let i = 0; i < 5; i++) {
                    cCtx.rotate(Math.PI * 2 / 5);
                    cCtx.bezierCurveTo(-this.size * 0.3, -this.size * 0.3, -this.size * 0.1, -this.size * 0.7, 0, -this.size * 0.7);
                    cCtx.bezierCurveTo(this.size * 0.1, -this.size * 0.7, this.size * 0.3, -this.size * 0.3, 0, 0);
                }
                cCtx.fill();
                cCtx.beginPath();
                cCtx.arc(0, 0, this.size * 0.15, 0, Math.PI * 2);
                cCtx.fillStyle = '#ffd700';
                cCtx.fill();
            } else {
                cCtx.fillRect(-this.size * 0.4, -this.size * 0.4, this.size * 0.8, this.size * 0.8);
                cCtx.fillStyle = '#ffffff';
                cCtx.fillRect(-this.size * 0.08, -this.size * 0.4, this.size * 0.16, this.size * 0.8);
                cCtx.fillRect(-this.size * 0.4, -this.size * 0.08, this.size * 0.8, this.size * 0.16);
            }
            cCtx.restore();
        }
    }

    function triggerConfettiBurst(count, x, y) {
        for (let i = 0; i < count; i++) confettiPieces.push(new ConfettiPiece(x, y));
    }

    function animateConfetti() {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiPieces.forEach((piece, index) => {
            piece.update();
            piece.draw();
            if (piece.y > confettiCanvas.height || piece.opacity <= 0) {
                confettiPieces.splice(index, 1);
            }
        });
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();


    // ==========================================================================
    // 6. GAME TAB MECHANICS & STATE MANAGER
    // ==========================================================================
    // --- Lifecycle Variables for all 30 Games ---
    let flappyActive = false, flappyInterval = null;
    let petalCatchActive = false, petalTimerInterval = null, petalSpawnInterval = null;
    let archerActive = false, archerTimerInterval = null;
    let pianoActive = false, pianoSpawnInterval = null;
    let whackActive = false, whackTimerInterval = null, whackSpawnInterval = null;
    let snakeActive = false, snakeInterval = null;
    let mazeActive = false;
    let brickActive = false, brickInterval = null;
    let rhythmActive = false, rhythmInterval = null, rhythmSpawnInterval = null;
    let typingActive = false, typingTimerInterval = null;
    let dotsActive = false;
    let f1RacingActive = false;
    let stopF1EngineSound = null;

    let wishTimerInterval = null, wishStarInterval = null; // for Game 9 Wish Catcher

    // Additional global variables for specific games
    let flappyScore = 0, flappyHighScore = localStorage.getItem('amara_flappy_highscore') || 0;
    let petalScore = 0, petalTimer = 20;
    let archerScore = 0, archerTimer = 20;
    let pianoScore = 0, pianoCombo = 0;
    let whackScore = 0, whackTimer = 20;
    let snakeScore = 0, snakeHighScore = localStorage.getItem('amara_snake_highscore') || 0;
    let brickScore = 0, brickLives = 3;
    let rhythmScore = 0, rhythmCombo = 0;
    let typingTimer = 20, typingWpm = 0;

    const tabButtons = document.querySelectorAll('.tab-btn');
    const gameContainers = document.querySelectorAll('.game-container');

    function stopAllActiveGames() {
        // Clear all timers and spawn intervals
        const activeIntervals = [
            balloonInterval, balloonSpawnInterval,
            wishTimerInterval, wishStarInterval,
            connectorInterval,
            petalTimerInterval, petalSpawnInterval,
            archerTimerInterval,
            pianoSpawnInterval,
            whackTimerInterval, whackSpawnInterval,
            snakeInterval,
            brickInterval,
            rhythmInterval, rhythmSpawnInterval,
            typingTimerInterval,
            flappyInterval
        ];
        activeIntervals.forEach(interval => {
            if (interval) clearInterval(interval);
        });

        // Set all game active state machines to false
        catcherGameActive = false;
        balloonActive = false;
        wishCatcherActive = false;
        connectorActive = false;
        flappyActive = false;
        petalCatchActive = false;
        archerActive = false;
        pianoActive = false;
        whackActive = false;
        snakeActive = false;
        mazeActive = false;
        brickActive = false;
        rhythmActive = false;
        dotsActive = false;
        f1RacingActive = false;
        if (typeof stopF1EngineSound === 'function') stopF1EngineSound();

        // Remove dynamically spawned items from grids
        const balloonPopBoard = document.getElementById('balloonPopBoard');
        if (balloonPopBoard) {
            balloonPopBoard.querySelectorAll('.balloon-svg-node').forEach(node => node.remove());
        }
        const whackGrid = document.getElementById('whackGrid');
        if (whackGrid) {
            whackGrid.querySelectorAll('.whack-mole').forEach(mole => {
                mole.classList.remove('up', 'whacked');
            });
        }
        const jigsawPiecesPool = document.getElementById('jigsawPiecesPool');
        if (jigsawPiecesPool) jigsawPiecesPool.innerHTML = '';
        const studioToppingsContainer = document.getElementById('studioToppingsContainer');
        if (studioToppingsContainer) studioToppingsContainer.innerHTML = '';
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            gameContainers.forEach(gc => gc.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.add('active');

            // Terminate active games on tab switches to prevent clock overlaps
            stopAllActiveGames();

            if (targetId === 'gameHeartCatcher') resizeCatcherCanvas();
            else if (targetId === 'gameMemoryMatch') initMemoryGame();
            else if (targetId === 'gameTicTacToe') initTTTGame();
            else if (targetId === 'gameSlidePuzzle') initSlidePuzzle();
            else if (targetId === 'gamePetalPlucker') initPetalPlucker();
            else if (targetId === 'gameBubbleWrap') initBubbleWrapGame();
            else if (targetId === 'gameWordSearch') initWordSearchGame();
            else if (targetId === 'gamePolaroidJigsaw') initJigsawPuzzle();
            else if (targetId === 'gameHeartSequence') initHeartSequenceGame();
            else if (targetId === 'gameCupcakeStudio') initCupcakeStudio();
            else if (targetId === 'gameCrystalBall') initCrystalBallGame();
            else if (targetId === 'gameFlappyCupid') initFlappyCupidGame();
            else if (targetId === 'gamePetalCatch') initPetalCatchGame();
            else if (targetId === 'gameLoveCode') initLoveCodeGame();
            else if (targetId === 'gameCupidArcher') initCupidArcherGame();
            else if (targetId === 'gamePianoTap') initPianoTapGame();
            else if (targetId === 'gameDoodlePad') initDoodlePadGame();
            else if (targetId === 'gameCupcakeClicker') initCupcakeClickerGame();
            else if (targetId === 'gameWhackCupid') initWhackCupidGame();
            else if (targetId === 'gameHeartSnake') initHeartSnakeGame();
            else if (targetId === 'gameCupidMaze') initCupidMazeGame();
            else if (targetId === 'gameBrickBreaker') initBrickBreakerGame();
            else if (targetId === 'gameHeartRhythm') initHeartRhythmGame();
            else if (targetId === 'gameTypingSpeed') initTypingSpeedGame();
            else if (targetId === 'gameConnectDots') initConnectDotsGame();
            else if (targetId === 'gameF1Racing') initF1RacingGame();
        });
    });


    // ==========================================================================
    // 7. THE 10 MINI-GAMES CODEBASES
    // ==========================================================================

    // --- GAME 1: HEART CATCHER ---
    const catcherCanvas = document.getElementById('catcherCanvas');
    const ctCtx = catcherCanvas.getContext('2d');
    const catcherOverlay = document.getElementById('catcherOverlay');
    const btnStartCatcher = document.getElementById('btnStartCatcher');
    const catcherScoreEl = document.getElementById('catcherScore');
    const catcherHighScoreEl = document.getElementById('catcherHighScore');
    const catcherLivesEl = document.getElementById('catcherLives');
    const btnLeft = document.getElementById('ctrlLeft');
    const btnRight = document.getElementById('ctrlRight');

    let catcherGameActive = false;
    let catcherScore = 0;
    let catcherHighScore = localStorage.getItem('amara_catcher_highscore') || 0;
    catcherHighScoreEl.textContent = catcherHighScore;
    let catcherLives = 3;

    const basket = { x: 0, y: 0, width: 100, height: 25, speed: 12, color: '#ff6b8b' };
    let fallingItems = [];
    let keys = {};

    function resizeCatcherCanvas() {
        const wrapper = catcherCanvas.parentElement;
        catcherCanvas.width = Math.min(wrapper.clientWidth, 600);
        catcherCanvas.height = 400;
        basket.x = catcherCanvas.width / 2 - basket.width / 2;
        basket.y = catcherCanvas.height - 40;
    }
    window.addEventListener('resize', resizeCatcherCanvas);
    resizeCatcherCanvas();

    window.addEventListener('keydown', (e) => { keys[e.code] = true; });
    window.addEventListener('keyup', (e) => { keys[e.code] = false; });

    let touchStartX = 0;
    catcherCanvas.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    catcherCanvas.addEventListener('touchmove', (e) => {
        if (!catcherGameActive) return;
        const touchX = e.touches[0].clientX;
        basket.x += (touchX - touchStartX) * 1.5;
        touchStartX = touchX;
        if (basket.x < 0) basket.x = 0;
        if (basket.x > catcherCanvas.width - basket.width) basket.x = catcherCanvas.width - basket.width;
    }, { passive: true });

    btnLeft.addEventListener('mousedown', () => { if (catcherGameActive) basket.x = Math.max(0, basket.x - 30); });
    btnRight.addEventListener('mousedown', () => { if (catcherGameActive) basket.x = Math.min(catcherCanvas.width - basket.width, basket.x + 30); });
    btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); if (catcherGameActive) basket.x = Math.max(0, basket.x - 30); });
    btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); if (catcherGameActive) basket.x = Math.min(catcherCanvas.width - basket.width, basket.x + 30); });

    class FallingItem {
        constructor() {
            this.x = Math.random() * (catcherCanvas.width - 20) + 10;
            this.y = -20;
            this.size = Math.random() * 8 + 12;
            const typeProb = Math.random();
            if (typeProb < 0.4) {
                this.type = 0; this.points = 10; this.color = '#ff6b8b';
            } else if (typeProb < 0.6) {
                this.type = 1; this.points = 20; this.color = '#ffb6c1';
            } else if (typeProb < 0.75) {
                this.type = 2; this.points = 15; this.color = '#ff69b4'; // Sakura flower
            } else if (typeProb < 0.88) {
                this.type = 3; this.points = 30; this.color = '#ffd700';
            } else {
                this.type = 4; this.points = 0; this.color = '#a9a9a9'; // cloud
            }
            this.speed = Math.random() * 2 + 2 + (catcherScore / 150);
        }

        update() { this.y += this.speed; }

        draw() {
            ctCtx.save();
            ctCtx.fillStyle = this.color;
            if (this.type === 0) {
                ctCtx.translate(this.x, this.y);
                ctCtx.beginPath();
                ctCtx.moveTo(0, 0);
                ctCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
                ctCtx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
                ctCtx.fill();
            } else if (this.type === 1) {
                ctCtx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                ctCtx.fillStyle = '#ffffff';
                ctCtx.fillRect(this.x - 2, this.y - this.size / 2, 4, this.size);
                ctCtx.fillRect(this.x - this.size / 2, this.y - 2, this.size, 4);
            } else if (this.type === 2) {
                ctCtx.translate(this.x, this.y);
                ctCtx.beginPath();
                for (let i = 0; i < 5; i++) {
                    ctCtx.rotate(Math.PI * 2 / 5);
                    ctCtx.bezierCurveTo(-this.size * 0.3, -this.size * 0.3, -this.size * 0.1, -this.size * 0.7, 0, -this.size * 0.7);
                    ctCtx.bezierCurveTo(this.size * 0.1, -this.size * 0.7, this.size * 0.3, -this.size * 0.3, 0, 0);
                }
                ctCtx.fill();
            } else if (this.type === 3) {
                ctCtx.translate(this.x, this.y);
                ctCtx.beginPath();
                for (let i = 0; i < 5; i++) {
                    ctCtx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size,
                        Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
                    ctCtx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * this.size * 0.4,
                        Math.sin((54 + i * 72) * Math.PI / 180) * this.size * 0.4);
                }
                ctCtx.closePath();
                ctCtx.fill();
            } else {
                ctCtx.beginPath();
                ctCtx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                ctCtx.arc(this.x - this.size * 0.4, this.y + 2, this.size * 0.4, 0, Math.PI * 2);
                ctCtx.arc(this.x + this.size * 0.4, this.y + 2, this.size * 0.4, 0, Math.PI * 2);
                ctCtx.fill();
            }
            ctCtx.restore();
        }
    }

    btnStartCatcher.addEventListener('click', () => {
        catcherOverlay.classList.add('hidden');
        catcherGameActive = true;
        catcherScore = 0;
        catcherLives = 3;
        fallingItems = [];
        catcherScoreEl.textContent = catcherScore;
        catcherLivesEl.textContent = catcherLives;
        resizeCatcherCanvas();
        catcherLoop();
    });

    function catcherLoop() {
        if (!catcherGameActive) return;
        ctCtx.fillStyle = '#ffeef2';
        ctCtx.fillRect(0, 0, catcherCanvas.width, catcherCanvas.height);

        if (keys['ArrowLeft'] || keys['KeyA']) basket.x = Math.max(0, basket.x - basket.speed);
        if (keys['ArrowRight'] || keys['KeyD']) basket.x = Math.min(catcherCanvas.width - basket.width, basket.x + basket.speed);

        ctCtx.fillStyle = basket.color;
        ctCtx.beginPath();
        ctCtx.roundRect(basket.x, basket.y, basket.width, basket.height, [0, 0, 16, 16]);
        ctCtx.fill();
        ctCtx.fillStyle = '#ff8da1';
        ctCtx.fillRect(basket.x - 5, basket.y - 4, basket.width + 10, 6);
        ctCtx.fillStyle = '#ffffff';
        ctCtx.font = 'bold 11px Fredoka';
        ctCtx.textAlign = 'center';
        ctCtx.fillText("AMARA BOX 💝", basket.x + basket.width / 2, basket.y + 16);

        if (Math.random() < 0.02 + (catcherScore / 3000)) fallingItems.push(new FallingItem());

        fallingItems.forEach((item, index) => {
            item.update();
            item.draw();

            if (item.y + item.size / 2 >= basket.y &&
                item.x >= basket.x &&
                item.x <= basket.x + basket.width &&
                item.y - item.size / 2 <= basket.y + basket.height) {

                if (item.type === 4) {
                    catcherLives--;
                    catcherLivesEl.textContent = catcherLives;
                    triggerConfettiBurst(10, item.x, item.y);
                    if (catcherLives <= 0) endCatcherGame();
                } else {
                    catcherScore += item.points;
                    catcherScoreEl.textContent = catcherScore;
                    triggerConfettiBurst(8, item.x, item.y);
                    if (catcherScore > catcherHighScore) {
                        catcherHighScore = catcherScore;
                        catcherHighScoreEl.textContent = catcherHighScore;
                        localStorage.setItem('amara_catcher_highscore', catcherHighScore);
                    }
                }
                fallingItems.splice(index, 1);
            } else if (item.y > catcherCanvas.height + 20) {
                fallingItems.splice(index, 1);
            }
        });
        requestAnimationFrame(catcherLoop);
    }

    function endCatcherGame() {
        catcherGameActive = false;
        catcherOverlay.querySelector('.overlay-title').innerHTML = "Game Over! 🌸";
        catcherOverlay.querySelector('.overlay-desc').innerHTML = `Kamu mengumpulkan **${catcherScore}** poin untuk Amara! <br> Rekor terbaikmu: **${catcherHighScore}**`;
        catcherOverlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
        catcherOverlay.classList.remove('hidden');
    }

    // --- GAME 2: MEMORY MATCH ---
    const memoryGrid = document.getElementById('memoryGrid');
    const memoryMovesEl = document.getElementById('memoryMoves');
    const memoryPairsEl = document.getElementById('memoryPairs');
    const btnResetMemory = document.getElementById('btnResetMemory');
    const memoryOverlay = document.getElementById('memoryOverlay');
    const btnStartMemory = document.getElementById('btnStartMemory');
    const icons = ['🌸', '💖', '🎈', '🎂', '🧸', '🎁', '🌟', '🍩'];
    let cardDeck = [...icons, ...icons];
    let flippedCards = [];
    let matchedPairs = 0;
    let memoryMoves = 0;
    let lockDeck = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initMemoryGame() {
        memoryGrid.innerHTML = '';
        shuffle(cardDeck);
        flippedCards = [];
        matchedPairs = 0;
        memoryMoves = 0;
        lockDeck = false;
        memoryMovesEl.textContent = memoryMoves;
        memoryPairsEl.textContent = `0 / 8`;
        memoryOverlay.classList.add('hidden');

        cardDeck.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.icon = icon;
            card.dataset.index = index;
            card.innerHTML = `
                <div class="card-face card-back"></div>
                <div class="card-face card-front">${icon}</div>
            `;
            card.addEventListener('click', () => flipCard(card));
            memoryGrid.appendChild(card);
        });
    }

    function flipCard(card) {
        if (lockDeck) return;
        if (card.classList.contains('flipped') || flippedCards.includes(card)) return;
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            memoryMoves++;
            memoryMovesEl.textContent = memoryMoves;
            checkMatch();
        }
    }

    function checkMatch() {
        lockDeck = true;
        const [card1, card2] = flippedCards;
        if (card1.dataset.icon === card2.dataset.icon) {
            matchedPairs++;
            memoryPairsEl.textContent = `${matchedPairs} / 8`;
            const rect = card2.getBoundingClientRect();
            triggerConfettiBurst(8, rect.left + rect.width / 2, rect.top + rect.height / 2);
            flippedCards = [];
            lockDeck = false;
            if (matchedPairs === 8) {
                setTimeout(() => {
                    triggerConfettiBurst(120);
                    memoryOverlay.classList.remove('hidden');
                }, 600);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                lockDeck = false;
            }, 850);
        }
    }
    btnResetMemory.addEventListener('click', initMemoryGame);
    btnStartMemory.addEventListener('click', initMemoryGame);

    // --- GAME 3: CUPID'S TIC-TAC-TOE ---
    const tttBoard = document.getElementById('tttBoard');
    const tttCells = document.querySelectorAll('.ttt-cell');
    const tttStatus = document.getElementById('tttStatus');
    const btnResetTTT = document.getElementById('btnResetTTT');
    const tttScoreEl = document.getElementById('tttScore');
    let tttActive = true;
    let tttBoardState = ["", "", "", "", "", "", "", "", ""];
    let tttScore = 0;

    function initTTTGame() {
        tttBoardState = ["", "", "", "", "", "", "", "", ""];
        tttActive = true;
        tttStatus.textContent = "Giliranku! Ketuk kotak untuk meletakkan 💖";
        tttCells.forEach(cell => {
            cell.textContent = "";
            cell.style.color = "var(--primary-pink)";
        });
    }

    tttCells.forEach(cell => {
        cell.addEventListener('click', () => {
            const idx = cell.getAttribute('data-idx');
            if (tttBoardState[idx] !== "" || !tttActive) return;
            makeTTTMove(idx, "💖");
            if (checkTTTWin("💖")) {
                tttStatus.textContent = "Kamu Menang! 💖 Cupid kalah telak nih!";
                tttScore += 10;
                tttScoreEl.textContent = tttScore;
                triggerConfettiBurst(30);
                tttActive = false;
                return;
            }
            if (tttBoardState.every(x => x !== "")) {
                tttStatus.textContent = "Seri! Kita berdua saling sayang 🌸";
                tttActive = false;
                return;
            }
            tttActive = false;
            tttStatus.textContent = "Cupid lagi mikir nih... 🌸";
            setTimeout(makeCupidMove, 600);
        });
    });

    function makeTTTMove(idx, sign) {
        tttBoardState[idx] = sign;
        const cell = tttCells[idx];
        cell.textContent = sign;
        cell.style.color = sign === "💖" ? "var(--primary-pink)" : "#ffca28";
    }

    function makeCupidMove() {
        const available = tttBoardState.map((x, i) => x === "" ? i : null).filter(x => x !== null);
        if (available.length === 0) return;
        const chosen = available[Math.floor(Math.random() * available.length)];
        makeTTTMove(chosen, "🌸");
        if (checkTTTWin("🌸")) {
            tttStatus.textContent = "Cupid menang! Jangan menyerah ya Amara! 🥰";
            tttActive = false;
            return;
        }
        if (tttBoardState.every(x => x !== "")) {
            tttStatus.textContent = "Seri! Cintanya seimbang! 🌸";
            tttActive = false;
            return;
        }
        tttActive = true;
        tttStatus.textContent = "Giliran kamu! Ketuk kotak yang kosong ya... 💕";
    }

    function checkTTTWin(sign) {
        const winLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winLines.some(line => line.every(idx => tttBoardState[idx] === sign));
    }
    btnResetTTT.addEventListener('click', initTTTGame);

    // --- GAME 4: LETTER SLIDE PUZZLE ---
    const slidePuzzleGrid = document.getElementById('slidePuzzleGrid');
    const slideMovesEl = document.getElementById('slideMoves');
    const btnResetSlide = document.getElementById('btnResetSlide');
    let slideGridState = [1, 2, 3, 4, 5, 6, 7, 8, ""];
    let slideMoves = 0;

    function initSlidePuzzle() {
        slideMoves = 0;
        slideMovesEl.textContent = slideMoves;
        // Shuffle blocks
        do {
            slideGridState = shufflePuzzle([...slideGridState]);
        } while (!isSolvable(slideGridState));
        renderSlidePuzzle();
    }

    function shufflePuzzle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function isSolvable(arr) {
        let inversions = 0;
        const filtered = arr.filter(x => x !== "");
        for (let i = 0; i < filtered.length; i++) {
            for (let j = i + 1; j < filtered.length; j++) {
                if (filtered[i] > filtered[j]) inversions++;
            }
        }
        return inversions % 2 === 0;
    }

    function renderSlidePuzzle() {
        slidePuzzleGrid.innerHTML = "";
        slideGridState.forEach((val, idx) => {
            const tile = document.createElement('div');
            tile.className = `slide-tile ${val === "" ? "tile-empty" : ""}`;
            tile.textContent = val;
            tile.addEventListener('click', () => trySlideTile(idx));
            slidePuzzleGrid.appendChild(tile);
        });
    }

    function trySlideTile(idx) {
        const adjacent = [
            idx - 1, idx + 1, idx - 3, idx + 3
        ];
        // filter out invalid offsets (edges wrapping checker)
        const validAdjacent = adjacent.filter(adj => {
            if (adj < 0 || adj >= 9) return false;
            if (idx % 3 === 0 && adj === idx - 1) return false;
            if (idx % 3 === 2 && adj === idx + 1) return false;
            return true;
        });

        const emptyIdx = validAdjacent.find(adj => slideGridState[adj] === "");
        if (emptyIdx !== undefined) {
            slideGridState[emptyIdx] = slideGridState[idx];
            slideGridState[idx] = "";
            slideMoves++;
            slideMovesEl.textContent = slideMoves;
            renderSlidePuzzle();
            checkSlidePuzzleWin();
        }
    }

    function checkSlidePuzzleWin() {
        const target = [1, 2, 3, 4, 5, 6, 7, 8, ""];
        if (slideGridState.every((val, i) => val === target[i])) {
            triggerConfettiBurst(100);
            setTimeout(() => {
                alert("Keren Banget! Puzzle tersusun sempurna! Amara hebat! 💖");
            }, 300);
        }
    }
    btnResetSlide.addEventListener('click', initSlidePuzzle);

    // --- GAME 5: DAISY PETAL PLUCKER ---
    const daisyFlower = document.getElementById('daisyFlower');
    const pluckerStatus = document.getElementById('pluckerStatus');
    const btnResetPlucker = document.getElementById('btnResetPlucker');
    let totalPetals = 8;
    const pluckerMessages = [
        "Valdric mencintaimu... 💕",
        "Valdric SANGAT mencintaimu! 💖",
        "Cintanya murni padamu... 🌸",
        "Valdric sangat merindukanmu! 🎀",
        "Hatimu melekat di jiwanya... 🌹",
        "Seluruh bintang saksi sayangnya! 🌟",
        "Valdric selalu mengagumi senyummu... 🥰",
        "AMARA CLARINTA, Valdric SANGAT MENCINTAIMU SELAMANYA! 💖"
    ];

    function initPetalPlucker() {
        daisyFlower.innerHTML = "";
        totalPetals = 8;
        pluckerStatus.textContent = "Klik kelopak bunga di atas satu per satu... 🌸";

        // Center core
        const center = document.createElement('div');
        center.className = 'daisy-center';
        daisyFlower.appendChild(center);

        // Radial Petals
        for (let i = 0; i < 8; i++) {
            const petal = document.createElement('div');
            petal.className = 'daisy-petal';
            const rotate = i * 45;
            petal.style.transform = `translate(-50%, -100%) rotate(${rotate}deg)`;

            petal.addEventListener('click', (e) => {
                if (petal.classList.contains('plucked')) return;
                petal.classList.add('plucked');

                // Random translation fly off coordinates
                const rad = rotate * Math.PI / 180;
                const tx = Math.sin(rad) * 140 + (Math.random() - 0.5) * 40;
                const ty = -Math.cos(rad) * 140 + (Math.random() - 0.5) * 40;
                const tr = rotate + (Math.random() - 0.5) * 90;
                petal.style.setProperty('--tx', `${tx}px`);
                petal.style.setProperty('--ty', `${ty}px`);
                petal.style.setProperty('--tr', `${tr}deg`);

                playPluckSound(i);
                totalPetals--;

                if (totalPetals > 0) {
                    pluckerStatus.textContent = pluckerMessages[7 - totalPetals];
                } else {
                    pluckerStatus.textContent = pluckerMessages[7];
                    triggerConfettiBurst(80);
                }
            });
            daisyFlower.appendChild(petal);
        }
    }

    function playPluckSound(idx) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(330 + idx * 40, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } catch (e) { }
    }
    btnResetPlucker.addEventListener('click', initPetalPlucker);

    // --- GAME 6: BALLOON POP ---
    const balloonPopBoard = document.getElementById('balloonPopBoard');
    const balloonPopCountEl = document.getElementById('balloonPopCount');
    const balloonTimerEl = document.getElementById('balloonTimer');
    const btnStartBalloons = document.getElementById('btnStartBalloons');
    const balloonOverlay = document.getElementById('balloonOverlay');
    let balloonActive = false;
    let balloonScore = 0;
    let balloonTimeLeft = 20;
    let balloonInterval = null;
    let balloonSpawnInterval = null;

    btnStartBalloons.addEventListener('click', () => {
        balloonOverlay.classList.add('hidden');
        balloonActive = true;
        balloonScore = 0;
        balloonTimeLeft = 20;
        balloonPopCountEl.textContent = balloonScore;
        balloonTimerEl.textContent = balloonTimeLeft;

        // Remove old SVGs
        document.querySelectorAll('.balloon-svg-node').forEach(b => b.remove());

        balloonInterval = setInterval(() => {
            balloonTimeLeft--;
            balloonTimerEl.textContent = balloonTimeLeft;
            if (balloonTimeLeft <= 0) {
                endBalloonGame();
            }
        }, 1000);

        balloonSpawnInterval = setInterval(spawnPopBalloon, 400);
    });

    function spawnPopBalloon() {
        if (!balloonActive) return;
        const b = document.createElement('div');
        b.className = 'balloon-svg-node';
        const color = ['#ff6b8b', '#ffb6c1', '#ffe4e1', '#ffd700'][Math.floor(Math.random() * 4)];
        b.style.left = `${Math.random() * 85 + 5}%`;

        b.innerHTML = `
            <svg viewBox="0 0 100 120" style="width: 100%; height: 100%;">
                <ellipse cx="50" cy="50" rx="35" ry="45" fill="${color}" />
                <path d="M50,95 L44,105 L56,105 Z" fill="${color}" />
                <path d="M50,105 C48,112 52,118 50,125" fill="none" stroke="#8b6873" stroke-width="2" />
            </svg>
        `;
        b.addEventListener('click', () => {
            if (!balloonActive) return;
            b.remove();
            balloonScore++;
            balloonPopCountEl.textContent = balloonScore;
            playPluckSound(balloonScore);
            triggerConfettiBurst(5, e => e.clientX, e => e.clientY);
        });

        balloonPopBoard.appendChild(b);
        setTimeout(() => b.remove(), 6000);
    }

    function endBalloonGame() {
        balloonActive = false;
        clearInterval(balloonInterval);
        clearInterval(balloonSpawnInterval);
        balloonOverlay.querySelector('.overlay-title').innerHTML = "Waktu Habis! 🎈";
        balloonOverlay.querySelector('.overlay-desc').innerHTML = `Hebat! Kamu memecahkan **${balloonScore}** balon cinta untuk Amara!`;
        balloonOverlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
        balloonOverlay.classList.remove('hidden');
    }

    // --- GAME 7: TAROT FORTUNE TELLER ---
    const btnDrawTarot = document.getElementById('btnDrawTarot');
    const tarotCrystalRose = document.getElementById('tarotCrystalRose');
    const tarotReadingText = document.querySelector('.tarot-reading-text');

    const tarotFortunes = [
        "🌸 RAMALAN: Belahan jiwa kamu tuh selalu kagum sama kebaikan hati kamu. Hari ini hubungan kalian bakal damai dan adem banget!",
        "🔮 RAMALAN: Bintang-bintang lagi ngeramal bakal ada kejutan manis berupa kado atau chat hangat dari orang tersayang hari ini!",
        "💖 RAMALAN: Cinta sejati kamu mekar sekuat mawar. Ngobrol hari ini bakal dipenuhi tawa dan saling ngerti satu sama lain.",
        "✨ RAMALAN: Takdir lagi nyelarasin mimpi-mimpi kamu. Langkah kecil yang kamu ambil bareng orang tersayang bakal bawa hasil yang besar banget!",
        "🌹 RAMALAN: Kehadiran kamu tuh bawa kehangatan. Ada seseorang yang lagi diem-diem doain kebahagiaan kamu di bawah langit malam.",
        "🧸 RAMALAN: Waktu berdua bareng dia hari ini bakal kerasa nyaman dan damai banget, kayak dipeluk boneka hangat.",
        "🍭 RAMALAN: Hubungan asmara kamu bakal berjalan manis banget hari ini. Manjakan diri kamu lewat obrolan yang penuh canda tawa!",
        "👑 RAMALAN: Kamu tuh ratu dari hatinya dia. Bintang-bintang udah mastiin kalau setia dan sayangnya cuma buat kamu doang selamanya!"
    ];

    function drawTarotCard() {
        tarotReadingText.textContent = "Sedang membaca getaran energi cinta... 🔮";
        playChimeMelody();
        setTimeout(() => {
            const idx = Math.floor(Math.random() * tarotFortunes.length);
            tarotReadingText.textContent = tarotFortunes[idx];
            triggerConfettiBurst(35);
        }, 1000);
    }
    btnDrawTarot.addEventListener('click', drawTarotCard);
    tarotCrystalRose.addEventListener('click', drawTarotCard);

    // --- GAME 8: LOVE COMPATIBILITY QUIZ ---
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizStep = document.getElementById('quizStep');
    const quizCard = document.getElementById('quizCard');
    const quizResults = document.getElementById('quizResults');
    const quizPercent = document.getElementById('quizPercent');
    const quizVerdictTitle = document.getElementById('quizVerdictTitle');
    const quizVerdictDesc = document.getElementById('quizVerdictDesc');
    const btnResetQuiz = document.getElementById('btnResetQuiz');

    const quizQuestions = [
        {
            q: "Bagaimana liburan impian terbaikmu bersama orang tercinta?",
            opts: ["Piknik romantis di kebun bunga Sakura 🌸", "Menatap langit bintang di kabin pegunungan 🌠", "Makan malam lilin mewah di tepi pantai 🌹", "Bermain game seru bersama di rumah 🎮"]
        },
        {
            q: "Bunga apa yang paling melambangkan perasaan cintamu?",
            opts: ["Mawar merah (Gairah mendalam) 🌹", "Sakura pink (Keindahan lembut) 🌸", "Melati putih (Kesetiaan abadi) 🤍", "Matahari kuning (Kegembiraan ceria) 🌻"]
        },
        {
            q: "Apa bahasa kasih (Love Language) utamamu?",
            opts: ["Kata-kata penegasan (Words of Affirmation) 🗣️", "Waktu berkualitas (Quality Time) 🕰️", "Sentuhan fisik (Physical Touch) 🤝", "Tindakan nyata (Acts of Service) 🛠️"]
        },
        {
            q: "Kado ulang tahun terindah apa yang ingin kamu berikan?",
            opts: ["Buku harian 3D kenangan tulisan tangan 📖", "Sebuket mawar concentric pink melingkar 🌹", "Sebuah mixtape retro cassette lagu cinta 📻", "Sebuah perjalanan kejutan berdua saja ✈️"]
        },
        {
            q: "Bagaimana caramu menunjukkan rasa kangen?",
            opts: ["Mengirimkan voice note menyanyikan lagu 🎙️", "Langsung menelepon hingga tertidur berjam-jam 📞", "Mengirimkan hadiah makanan manis secara misterius 🍰", "Langsung datang menemui di rumahnya 💖"]
        }
    ];

    let quizCurrentIdx = 0;
    let quizScoreAcc = 0;

    function renderQuizStep() {
        if (quizCurrentIdx >= quizQuestions.length) {
            showQuizResults();
            return;
        }
        quizCard.classList.remove('hidden');
        quizResults.classList.add('hidden');

        const current = quizQuestions[quizCurrentIdx];
        quizStep.textContent = `Pertanyaan ${quizCurrentIdx + 1} / 5`;
        quizQuestion.textContent = current.q;
        quizOptions.innerHTML = "";

        current.opts.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                quizScoreAcc += (idx + 1) * 3;
                quizCurrentIdx++;
                renderQuizStep();
            });
            quizOptions.appendChild(btn);
        });
    }

    function showQuizResults() {
        quizCard.classList.add('hidden');
        quizResults.classList.remove('hidden');

        // Calculate dynamic perfect scores matching 90-100%
        const score = 90 + (quizScoreAcc % 11);
        quizPercent.textContent = `${score}%`;

        if (score >= 98) {
            quizVerdictTitle.textContent = "Belahan Jiwa Kosmik! 💕";
            quizVerdictDesc.textContent = "Cintamu ditakdirkan oleh bintang-bintang. Kecocokan sempurna dan kasih sayang tanpa batas!";
        } else if (score >= 94) {
            quizVerdictTitle.textContent = "Pasangan Harmonis Indah! 🌸";
            quizVerdictDesc.textContent = "Kalian berdua selalu mengisi kekosongan satu sama lain dengan pengertian romantis yang manis.";
        } else {
            quizVerdictTitle.textContent = "Kisah Cinta Menawan! 🎀";
            quizVerdictDesc.textContent = "Setiap hari bersamanya adalah petualangan penuh tawa dan kebahagiaan manis!";
        }
        triggerConfettiBurst(120);
    }

    btnResetQuiz.addEventListener('click', () => {
        quizCurrentIdx = 0;
        quizScoreAcc = 0;
        renderQuizStep();
    });
    renderQuizStep();

    // --- GAME 9: WISH CATCHER ---
    const wishCatcherSky = document.getElementById('wishCatcherSky');
    const caughtStarsCountEl = document.getElementById('caughtStarsCount');
    const wishTimerEl = document.getElementById('wishTimer');
    const btnStartWishCatcher = document.getElementById('btnStartWishCatcher');
    const wishCatcherOverlay = document.getElementById('wishCatcherOverlay');
    let wishCatcherActive = false;
    let wishCatcherScore = 0;
    let wishCatcherTimeLeft = 20;
    let wishCatcherTimer = null;
    let wishCatcherSpawnInterval = null;

    const romanticWishes = [
        "Sehat selalu Amara! 🌸", "Bahagia selalu! ✨", "Sukses Kuliahnya! 🎓",
        "Makin Cantik! 🎀", "Disayang Keluarga! 💖", "Mimpi Indah Tercapai! 🌠",
        "Penuh Ceria! 💕", "Senyum Selalu Abadi! 😊"
    ];

    btnStartWishCatcher.addEventListener('click', () => {
        wishCatcherOverlay.classList.add('hidden');
        wishCatcherActive = true;
        wishCatcherScore = 0;
        wishCatcherTimeLeft = 20;
        caughtStarsCountEl.textContent = wishCatcherScore;
        wishTimerEl.textContent = wishCatcherTimeLeft;

        document.querySelectorAll('.falling-star-node').forEach(s => s.remove());

        wishCatcherTimer = setInterval(() => {
            wishCatcherTimeLeft--;
            wishTimerEl.textContent = wishCatcherTimeLeft;
            if (wishCatcherTimeLeft <= 0) {
                endWishCatcherGame();
            }
        }, 1000);

        wishCatcherSpawnInterval = setInterval(spawnFallingStar, 400);
    });

    function spawnFallingStar() {
        if (!wishCatcherActive) return;
        const star = document.createElement('div');
        star.className = 'falling-star-node';
        star.textContent = '⭐';
        star.style.left = `${Math.random() * 85 + 5}%`;

        star.addEventListener('click', (e) => {
            if (!wishCatcherActive) return;
            star.remove();
            wishCatcherScore++;
            caughtStarsCountEl.textContent = wishCatcherScore;

            // Spawn floating glowing wish text
            const text = document.createElement('div');
            text.className = 'glowing-wish-text';
            text.textContent = romanticWishes[Math.floor(Math.random() * romanticWishes.length)];

            const boardRect = wishCatcherSky.getBoundingClientRect();
            text.style.left = `${e.clientX - boardRect.left - 40}px`;
            text.style.top = `${e.clientY - boardRect.top - 20}px`;

            wishCatcherSky.appendChild(text);
            setTimeout(() => text.remove(), 2500);

            playPluckSound(wishCatcherScore * 2);
        });

        wishCatcherSky.appendChild(star);
        setTimeout(() => star.remove(), 3500);
    }

    function endWishCatcherGame() {
        wishCatcherActive = false;
        clearInterval(wishCatcherTimer);
        clearInterval(wishCatcherSpawnInterval);
        wishCatcherOverlay.querySelector('.overlay-title').innerHTML = "Waktu Habis! 🌠";
        wishCatcherOverlay.querySelector('.overlay-desc').innerHTML = `Hebat! Kamu menangkap **${wishCatcherScore}** bintang harapan & doa manis!`;
        wishCatcherOverlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
        wishCatcherOverlay.classList.remove('hidden');
    }

    // --- GAME 10: HEART CONNECTOR ---
    const connectorBoard = document.getElementById('connectorBoard');
    const connectedHeartsEl = document.getElementById('connectedHearts');
    const connectorTimerEl = document.getElementById('connectorTimer');
    const btnStartConnector = document.getElementById('btnStartConnector');
    const connectorOverlay = document.getElementById('connectorOverlay');
    let connectorActive = false;
    let connectorScore = 0;
    let connectorTimeLeft = 20;
    let connectorInterval = null;
    let cellPair = [];

    btnStartConnector.addEventListener('click', () => {
        connectorOverlay.classList.add('hidden');
        connectorActive = true;
        connectorScore = 0;
        connectorTimeLeft = 20;
        connectedHeartsEl.textContent = connectorScore;
        connectorTimerEl.textContent = connectorTimeLeft;
        cellPair = [];

        renderConnectorBoard();

        connectorInterval = setInterval(() => {
            connectorTimeLeft--;
            connectorTimerEl.textContent = connectorTimeLeft;
            if (connectorTimeLeft <= 0) {
                endConnectorGame();
            }
        }, 1000);
    });

    function renderConnectorBoard() {
        connectorBoard.innerHTML = "";

        // Pick 2 random cells from 16 to carry matching active hearts
        const h1 = Math.floor(Math.random() * 16);
        let h2 = Math.floor(Math.random() * 16);
        while (h2 === h1) h2 = Math.floor(Math.random() * 16);

        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'connector-cell';
            cell.dataset.idx = i;

            if (i === h1 || i === h2) {
                cell.classList.add('active-heart');
                cell.textContent = "💖";
            }

            cell.addEventListener('click', () => {
                if (!connectorActive) return;
                if (!cell.classList.contains('active-heart')) return;

                if (cellPair.includes(i)) return;
                cellPair.push(i);
                cell.style.background = "#ffd1dc";

                if (cellPair.length === 2) {
                    connectorScore++;
                    connectedHeartsEl.textContent = connectorScore;
                    triggerConfettiBurst(15);
                    playChimeMelody();
                    cellPair = [];
                    setTimeout(renderConnectorBoard, 300);
                }
            });
            connectorBoard.appendChild(cell);
        }
    }

    function endConnectorGame() {
        connectorActive = false;
        clearInterval(connectorInterval);
        connectorOverlay.querySelector('.overlay-title').innerHTML = "Waktu Habis! 🔗";
        connectorOverlay.querySelector('.overlay-desc').innerHTML = `Luar Biasa! Kamu menghubungkan **${connectorScore}** pasangan cinta sejati!`;
        connectorOverlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
        connectorOverlay.classList.remove('hidden');
    }


    // ==========================================================================
    // 9. DYNAMIC DRAGGABLE POLAROID SCRAPBOOK WITH PERSISTENT COORDINATES
    // ==========================================================================
    const scrapbookWorkspace = document.getElementById('scrapbookWorkspace');
    let highestZ = 20;

    // Premium image resizing and compression using HTML5 Canvas to prevent localStorage bloat
    function resizeAndCompressImage(file, callback) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const maxDim = 800;
                let width = img.width;
                let height = img.height;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG with 0.7 quality
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                callback(compressedBase64);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Merge static/fetched scrapbook items with localStorage while preserving customized coordinates/zIndex
    function mergeScrapbookItems(fetchedItems, localItems) {
        const deletedDefaults = JSON.parse(localStorage.getItem('amara_deleted_scrapbook') || '[]');
        const merged = [];
        fetchedItems.forEach(fetched => {
            // Skip if deleted
            if (deletedDefaults.includes(fetched.id)) return;

            const local = localItems.find(it => it.id === fetched.id);
            if (local) {
                merged.push({
                    ...fetched,
                    left: local.left || fetched.left,
                    top: local.top || fetched.top,
                    zIndex: local.zIndex || fetched.zIndex,
                    rotate: local.rotate || fetched.rotate
                });
            } else {
                merged.push(fetched);
            }
        });
        localItems.forEach(local => {
            if (!merged.some(m => m.id === local.id)) {
                merged.push(local);
            }
        });
        return merged;
    }

    function renderPolaroidCard(item) {
        if (!scrapbookWorkspace) return;

        const card = document.createElement('div');
        card.className = 'polaroid-card draggable-polaroid';
        card.setAttribute('data-id', item.id);
        card.style.setProperty('--rotation', item.rotate || '0deg');
        card.style.left = item.left || '10%';
        card.style.top = item.top || '10%';
        card.style.zIndex = item.zIndex || 5;

        if (item.zIndex && item.zIndex > highestZ) {
            highestZ = item.zIndex;
        }

        card.innerHTML = `
            <button class="polaroid-delete-btn" title="Hapus Kenangan">&times;</button>
            <div class="polaroid-img-wrapper">
                <img src="${item.src}" alt="${item.caption}" class="polaroid-img">
            </div>
            <div class="polaroid-caption">${item.caption}</div>
        `;

        // Add dragging listeners
        let startX = 0, startY = 0;
        let currentX = 0, currentY = 0;
        let isDragging = false;

        card.addEventListener('pointerdown', (e) => {
            card.setPointerCapture(e.pointerId);
            highestZ++;
            card.style.zIndex = highestZ;

            const rect = card.getBoundingClientRect();
            const parentRect = card.parentElement.getBoundingClientRect();
            currentX = rect.left - parentRect.left;
            currentY = rect.top - parentRect.top;

            card.style.left = `${currentX}px`;
            card.style.top = `${currentY}px`;
            startX = e.clientX;
            startY = e.clientY;
            isDragging = true;
            card.style.cursor = 'grabbing';
            card.classList.add('active-dragging');
        });

        card.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            startX = e.clientX;
            startY = e.clientY;
            currentX += dx;
            currentY += dy;

            const parentRect = card.parentElement.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            currentX = Math.max(-40, Math.min(parentRect.width - cardRect.width + 40, currentX));
            currentY = Math.max(-40, Math.min(parentRect.height - cardRect.height + 40, currentY));

            card.style.left = `${currentX}px`;
            card.style.top = `${currentY}px`;
        });

        const savePosition = () => {
            fetch('/api/scrapbook/position', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.id,
                    left: card.style.left,
                    top: card.style.top,
                    zIndex: highestZ
                })
            }).catch(err => {
                console.log("Static host - saving position in localStorage.");
                const localScrapbook = JSON.parse(localStorage.getItem('amara_scrapbook') || '[]');
                const existingItem = localScrapbook.find(it => it.id === item.id);
                if (existingItem) {
                    existingItem.left = card.style.left;
                    existingItem.top = card.style.top;
                    existingItem.zIndex = highestZ;
                    localStorage.setItem('amara_scrapbook', JSON.stringify(localScrapbook));
                } else {
                    const newItem = { ...item, left: card.style.left, top: card.style.top, zIndex: highestZ };
                    localScrapbook.push(newItem);
                    localStorage.setItem('amara_scrapbook', JSON.stringify(localScrapbook));
                }
            });
        };

        card.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            card.releasePointerCapture(e.pointerId);
            card.style.cursor = 'grab';
            card.classList.remove('active-dragging');
            savePosition();
        });

        card.addEventListener('pointercancel', (e) => {
            if (!isDragging) return;
            isDragging = false;
            card.style.cursor = 'grab';
            card.classList.remove('active-dragging');
            savePosition();
        });

        card.addEventListener('dblclick', () => {
            const img = card.querySelector('.polaroid-img');
            const caption = card.querySelector('.polaroid-caption');
            const polaroidModal = document.getElementById('polaroidModal');
            const lightboxImg = document.getElementById('lightboxImg');
            const lightboxVideo = document.getElementById('lightboxVideo');
            const lightboxCaption = document.getElementById('lightboxCaption');

            if (img && polaroidModal && lightboxImg && lightboxCaption) {
                // If it's a video file or metadata has a video, handle it
                const videoSrc = card.getAttribute('data-video');
                if (videoSrc) {
                    lightboxImg.style.display = 'none';
                    if (lightboxVideo) {
                        lightboxVideo.style.display = 'block';
                        lightboxVideo.src = videoSrc;
                        lightboxVideo.play();
                    }
                } else {
                    if (lightboxVideo) {
                        lightboxVideo.style.display = 'none';
                        lightboxVideo.pause();
                        lightboxVideo.src = '';
                    }
                    lightboxImg.style.display = 'block';
                    lightboxImg.src = img.src;
                }
                lightboxCaption.textContent = caption ? caption.textContent : 'Sweet Memory ✨';
                polaroidModal.classList.add('show');
                triggerConfettiBurst(35);
            }
        });

        const deleteBtn = card.querySelector('.polaroid-delete-btn');
        if (deleteBtn) {
            // Prevent pointerdown and mousedown from initiating dragging/pointerCapture on the card!
            deleteBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
            deleteBtn.addEventListener('mousedown', (e) => e.stopPropagation());

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal zoom or card drag triggers
                
                // Animate fade out and remove card
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) rotate(10deg)';
                
                setTimeout(() => {
                    card.remove();
                    
                    // Remove from localStorage amara_scrapbook
                    const localScrapbook = JSON.parse(localStorage.getItem('amara_scrapbook') || '[]');
                    const filtered = localScrapbook.filter(it => it.id !== item.id);
                    localStorage.setItem('amara_scrapbook', JSON.stringify(filtered));

                    // If it was a default/preload card, store its ID as deleted
                    if (!item.id.toString().startsWith('user_')) {
                        const deletedDefaults = JSON.parse(localStorage.getItem('amara_deleted_scrapbook') || '[]');
                        if (!deletedDefaults.includes(item.id)) {
                            deletedDefaults.push(item.id);
                            localStorage.setItem('amara_deleted_scrapbook', JSON.stringify(deletedDefaults));
                        }
                    }
                }, 400);
            });
        }

        scrapbookWorkspace.appendChild(card);
    }

    // Load scrapbook entries on startup
    const localScrapbookData = JSON.parse(localStorage.getItem('amara_scrapbook') || '[]');
    fetch('/api/scrapbook')
        .then(res => {
            if (!res.ok) throw new Error("API failed");
            return res.json();
        })
        .then(items => {
            const merged = mergeScrapbookItems(items, localScrapbookData);
            if (merged && merged.length > 0) {
                merged.forEach(item => renderPolaroidCard(item));
            }
        })
        .catch(err => {
            console.log("Static host or server offline - loading scrapbook from scrapbook.json and localStorage.");
            fetch('scrapbook.json')
                .then(res => res.json())
                .then(items => {
                    const merged = mergeScrapbookItems(items, localScrapbookData);
                    if (merged && merged.length > 0) {
                        merged.forEach(item => renderPolaroidCard(item));
                    }
                })
                .catch(err2 => {
                    console.error("Failed to load static scrapbook data:", err2);
                    const deletedDefaults = JSON.parse(localStorage.getItem('amara_deleted_scrapbook') || '[]');
                    const filteredLocal = localScrapbookData.filter(it => !deletedDefaults.includes(it.id));
                    if (filteredLocal && filteredLocal.length > 0) {
                        filteredLocal.forEach(item => renderPolaroidCard(item));
                    }
                });
        });

    // Polaroid Modal setup
    const polaroidModal = document.getElementById('polaroidModal');
    const btnLightboxClose = document.getElementById('btnLightboxClose');
    const lightboxVideoElement = document.getElementById('lightboxVideo');

    function closePolaroidModal() {
        if (polaroidModal) polaroidModal.classList.remove('show');
        if (lightboxVideoElement) {
            lightboxVideoElement.pause();
            lightboxVideoElement.src = '';
            lightboxVideoElement.style.display = 'none';
        }
        
        // Remove dynamic iframe if any
        const lightboxIframe = document.getElementById('lightboxIframe');
        if (lightboxIframe) {
            lightboxIframe.remove();
        }

        // Re-display raw lightbox image block just in case
        const lightboxImg = document.getElementById('lightboxImg');
        if (lightboxImg) lightboxImg.style.display = 'block';

        // Reset the portrait styling
        const lightboxCard = document.querySelector('.lightbox-card');
        if (lightboxCard) {
            lightboxCard.classList.remove('portrait-video-mode');
        }
    }

    if (polaroidModal && btnLightboxClose) {
        btnLightboxClose.addEventListener('click', closePolaroidModal);
        polaroidModal.addEventListener('click', (e) => {
            if (e.target === polaroidModal) closePolaroidModal();
        });
    }

    // Scrapbook Upload Form handlers
    const scrapbookUploadForm = document.getElementById('scrapbookUploadForm');
    const scrapbookImageInput = document.getElementById('scrapbookImageInput');
    const scrapbookCaptionInput = document.getElementById('scrapbookCaptionInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    if (scrapbookImageInput && fileNameDisplay) {
        scrapbookImageInput.addEventListener('change', () => {
            if (scrapbookImageInput.files && scrapbookImageInput.files[0]) {
                fileNameDisplay.textContent = scrapbookImageInput.files[0].name;
            } else {
                fileNameDisplay.textContent = "Belum ada foto terpilih";
            }
        });
    }

    if (scrapbookUploadForm) {
        scrapbookUploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const file = scrapbookImageInput.files[0];
            const caption = scrapbookCaptionInput.value.trim();
            if (!file) return;

            resizeAndCompressImage(file, function (base64Image) {
                // Try API first
                fetch('/api/scrapbook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: base64Image,
                        caption: caption
                    })
                })
                    .then(res => {
                        if (!res.ok) throw new Error("Upload failed");
                        return res.json();
                    })
                    .then(newItem => {
                        renderPolaroidCard(newItem);
                        triggerConfettiBurst(50);
                        scrapbookUploadForm.reset();
                        fileNameDisplay.textContent = "Belum ada foto yang dipilih";
                    })
                    .catch(err => {
                        console.log("Static host or API failure - falling back to localStorage.");
                        highestZ++;
                        const newItem = {
                            id: "user_local_" + Date.now(),
                            src: base64Image,
                            caption: caption,
                            left: (Math.random() * 200 + 100) + "px",
                            top: (Math.random() * 100 + 50) + "px",
                            rotate: (Math.random() * 10 - 5) + "deg",
                            zIndex: highestZ
                        };

                        const localScrapbook = JSON.parse(localStorage.getItem('amara_scrapbook') || '[]');
                        localScrapbook.push(newItem);
                        localStorage.setItem('amara_scrapbook', JSON.stringify(localScrapbook));

                        renderPolaroidCard(newItem);
                        triggerConfettiBurst(50);
                        scrapbookUploadForm.reset();
                        fileNameDisplay.textContent = "Belum ada foto yang dipilih";
                    });
            });
        });
    }


    // ==========================================================================
    // 10. CELESTIAL WISH LANTERNS BOARD SYSTEM
    // ==========================================================================
    const wishForm = document.getElementById('wishForm');
    const wishBoard = document.getElementById('wishBoard');
    const colorDots = document.querySelectorAll('.color-dot');
    let selectedColor = '#ffb6c1';

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            selectedColor = dot.getAttribute('data-color');
        });
    });

    function saveWishLocally(wish) {
        const localWishes = JSON.parse(localStorage.getItem('amara_wishes') || '[]');
        const exists = localWishes.some(w => w.text === wish.text && w.sender === wish.sender && w.color === wish.color);
        if (!exists) {
            localWishes.push(wish);
            localStorage.setItem('amara_wishes', JSON.stringify(localWishes));
        }
    }

    if (wishForm) {
        wishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sender = document.getElementById('wishSender').value.trim();
            const message = document.getElementById('wishMessage').value.trim();
            if (sender && message) {
                const wishPayload = { text: message, sender: sender, color: selectedColor };

                // Save to local database API
                fetch('/api/wishes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(wishPayload)
                })
                    .then(res => {
                        if (res.ok) {
                            spawnWishLantern(message, sender, selectedColor);
                        } else {
                            saveWishLocally(wishPayload);
                            spawnWishLantern(message, sender, selectedColor);
                        }
                    })
                    .catch(err => {
                        saveWishLocally(wishPayload);
                        spawnWishLantern(message, sender, selectedColor);
                    });

                document.getElementById('wishSender').value = '';
                document.getElementById('wishMessage').value = '';
                triggerConfettiBurst(25);
            }
        });
    }

    function spawnWishLantern(text, sender, color, delaySeconds = 0) {
        if (!wishBoard) return;
        const lantern = document.createElement('div');
        lantern.className = 'floating-wish-lantern';

        lantern.style.left = `${Math.random() * 80 + 10}%`;
        lantern.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);

        const duration = Math.random() * 10 + 16;
        lantern.style.animationDuration = `${duration}s`;
        lantern.style.animationDelay = `${delaySeconds}s`;
        lantern.style.background = `linear-gradient(to bottom, #fff6d6 0%, ${color} 65%, #ff5722 100%)`;
        lantern.style.boxShadow = `0 0 15px ${color}, 0 0 30px rgba(255, 87, 34, 0.4)`;

        lantern.innerHTML = `<span class="lantern-sender-tag">${sender}</span>`;
        lantern.setAttribute('data-wish', text);
        lantern.setAttribute('data-sender', sender);

        lantern.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = document.getElementById('wishModal');
            const modalTitle = modal.querySelector('.modal-title');
            const modalDesc = modal.querySelector('.modal-desc');
            const amaraPersonalWish = document.getElementById('amaraPersonalWish');
            const btnSavePersonalWish = document.getElementById('btnSavePersonalWish');
            const modalHearts = modal.querySelector('.modal-hearts');

            if (modal) {
                modalHearts.textContent = '🏮✨🌸';
                modalTitle.textContent = `Lentera Harapan ${sender}`;
                modalDesc.innerHTML = `<p style="font-family: var(--font-heading); font-size: 20px; font-style: italic; color: var(--dark-text); padding: 10px;">"${text}"</p>`;
                if (amaraPersonalWish) amaraPersonalWish.parentElement.style.display = 'none';
                if (btnSavePersonalWish) btnSavePersonalWish.style.display = 'none';
                modal.classList.add('show');
            }
        });
        wishBoard.appendChild(lantern);

        setTimeout(() => {
            lantern.remove();
            spawnWishLantern(text, sender, color, 0);
        }, (duration + delaySeconds) * 1000);
    }

    // Load persistent lanterns from database API on launch
    const localWishesData = JSON.parse(localStorage.getItem('amara_wishes') || '[]');
    fetch('/api/wishes')
        .then(res => {
            if (!res.ok) throw new Error("API failed");
            return res.json();
        })
        .then(wishes => {
            const merged = [...wishes];
            localWishesData.forEach(lw => {
                if (!merged.some(w => w.text === lw.text && w.sender === lw.sender && w.color === lw.color)) {
                    merged.push(lw);
                }
            });
            if (merged && merged.length > 0) {
                merged.forEach(w => {
                    const negativeDelay = -Math.random() * 20;
                    spawnWishLantern(w.text, w.sender, w.color, negativeDelay);
                });
            }
        })
        .catch(err => {
            console.log("Static host or server offline - loading wishes from wishes.json and localStorage.");
            fetch('wishes.json')
                .then(res => res.json())
                .then(wishes => {
                    const merged = [...wishes];
                    localWishesData.forEach(lw => {
                        if (!merged.some(w => w.text === lw.text && w.sender === lw.sender && w.color === lw.color)) {
                            merged.push(lw);
                        }
                    });
                    if (merged && merged.length > 0) {
                        merged.forEach(w => {
                            const negativeDelay = -Math.random() * 20;
                            spawnWishLantern(w.text, w.sender, w.color, negativeDelay);
                        });
                    }
                })
                .catch(err2 => {
                    console.error("Failed to load static wishes:", err2);
                    if (localWishesData && localWishesData.length > 0) {
                        localWishesData.forEach(w => {
                            const negativeDelay = -Math.random() * 20;
                            spawnWishLantern(w.text, w.sender, w.color, negativeDelay);
                        });
                    }
                });
        });


    // ==========================================================================
    // 11. SPECIAL VIDEO PLAYER (DYNAMIC GOOGLE DRIVE EMBED)
    // ==========================================================================
    const birthdayVideo = document.getElementById('birthdayVideo');
    const videoPlayOverlay = document.getElementById('videoPlayOverlay');

    if (birthdayVideo && videoPlayOverlay) {
        videoPlayOverlay.addEventListener('click', () => {
            videoPlayOverlay.style.opacity = '0';
            setTimeout(() => { videoPlayOverlay.style.display = 'none'; }, 500);

            // Create Google Drive Embed Iframe
            const driveIframe = document.createElement('iframe');
            driveIframe.src = "https://drive.google.com/file/d/1LHOJUfLCLVaNmtclVwheLS3BBjYFBKE4/preview?autoplay=1";
            driveIframe.style.width = "100%";
            driveIframe.style.height = "100%";
            driveIframe.style.border = "none";
            driveIframe.style.borderRadius = "12px";
            driveIframe.style.aspectRatio = "16/9";
            driveIframe.allow = "autoplay; encrypted-media";
            driveIframe.setAttribute('allowfullscreen', 'true');

            // Replace the local video element with the Google Drive Iframe
            birthdayVideo.parentNode.replaceChild(driveIframe, birthdayVideo);

            // Pause background music if playing
            if (musicInitialized && !bgAudio.paused) {
                bgAudio.pause();
                if (btnPlayPause) {
                    btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
                }
            }
        });
    }

    // ==========================================================================
    // 7B. GAMES 11-30 CODEBASES (20 NEW GAMES!)
    // ==========================================================================

    // --- GAME 11: FLAPPY CUPID ---
    function initFlappyCupidGame() {
        const canvas = document.getElementById('flappyCanvas');
        const overlay = document.getElementById('flappyOverlay');
        const startBtn = document.getElementById('btnStartFlappy');
        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        let cupid = { x: 50, y: 150, radius: 15, velocity: 0, gravity: 0.25, jump: -5 };
        let pipes = [];
        let score = 0;
        let frameCount = 0;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            flappyActive = true;
            score = 0;
            pipes = [];
            cupid.y = 150;
            cupid.velocity = 0;
            frameCount = 0;

            flappyLoop();
        };

        function flappyLoop() {
            if (!flappyActive) return;

            // Physics
            cupid.velocity += cupid.gravity;
            cupid.y += cupid.velocity;

            // Canvas boundary checks
            if (cupid.y > canvas.height || cupid.y < 0) {
                endFlappyGame();
                return;
            }

            // Spawn pipes
            if (frameCount % 100 === 0) {
                let gap = 120;
                let topHeight = Math.random() * (canvas.height - gap - 100) + 50;
                pipes.push({
                    x: canvas.width,
                    top: topHeight,
                    bottom: canvas.height - topHeight - gap,
                    width: 50,
                    passed: false
                });
            }

            // Move pipes
            pipes.forEach((pipe, idx) => {
                pipe.x -= 2.5;

                // Collisions
                if (cupid.x + cupid.radius > pipe.x && cupid.x - cupid.radius < pipe.x + pipe.width) {
                    if (cupid.y - cupid.radius < pipe.top || cupid.y + cupid.radius > canvas.height - pipe.bottom) {
                        endFlappyGame();
                        return;
                    }
                }

                // Passed & Scoring
                if (pipe.x + pipe.width < cupid.x && !pipe.passed) {
                    pipe.passed = true;
                    score++;
                    playPluckSound(score);
                }

                // Offscreen cleanup
                if (pipe.x + pipe.width < 0) {
                    pipes.splice(idx, 1);
                }
            });

            // Draw everything
            ctx.fillStyle = '#ffeef2'; // Pink sky
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Cupid (Heart shape with wings)
            ctx.save();
            ctx.translate(cupid.x, cupid.y);
            ctx.fillStyle = '#ff6b8b';
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.bezierCurveTo(-10, -16, -20, -6, 0, 14);
            ctx.bezierCurveTo(20, -6, 10, -16, 0, -6);
            ctx.fill();

            // Wings
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(-10, -5, 8, 4, Math.PI / 6, 0, Math.PI * 2);
            ctx.ellipse(10, -5, 8, 4, -Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Draw Pipes (Clouds)
            pipes.forEach(pipe => {
                ctx.fillStyle = '#b3c5d7'; // Cloudy obstruction
                ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
                ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
            });

            // Draw score
            ctx.fillStyle = '#ff4d6d';
            ctx.font = 'bold 20px Fredoka';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${score}`, 15, 30);

            frameCount++;
            requestAnimationFrame(flappyLoop);
        }

        // Jump triggers
        canvas.onmousedown = () => {
            if (flappyActive) cupid.velocity = cupid.jump;
        };
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && flappyActive) {
                e.preventDefault();
                cupid.velocity = cupid.jump;
            }
        });

        function endFlappyGame() {
            flappyActive = false;
            if (score > flappyHighScore) {
                flappyHighScore = score;
                localStorage.setItem('amara_flappy_highscore', flappyHighScore);
            }
            document.getElementById('flappyHighScore').textContent = flappyHighScore;

            overlay.querySelector('.overlay-title').innerHTML = "Game Over! 💔";
            overlay.querySelector('.overlay-desc').innerHTML = `Cupid menabrak awan! <br> Skor: **${score}** | Rekor Terbaik: **${flappyHighScore}**`;
            overlay.querySelector('.play-btn').textContent = "Terbang Lagi 🎮";
            overlay.classList.remove('hidden');
        }
    }

    // --- GAME 12: LOVE BUBBLE WRAP ---
    function initBubbleWrapGame() {
        const grid = document.getElementById('bubbleWrapGrid');
        if (!grid) return;
        grid.innerHTML = '';
        let poppedCount = 0;
        document.getElementById('bubblePopCount').textContent = `0 / 36`;

        for (let i = 0; i < 36; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble-wrap-bubble';
            bubble.textContent = '💖';
            bubble.addEventListener('click', () => {
                if (bubble.classList.contains('popped')) return;
                bubble.classList.add('popped');
                bubble.textContent = '🌸';
                poppedCount++;
                document.getElementById('bubblePopCount').textContent = `${poppedCount} / 36`;

                // Play synth pop chime
                playPluckSound(poppedCount);

                // Trigger stardust particles
                const rect = bubble.getBoundingClientRect();
                triggerConfettiBurst(8, rect.left + rect.width / 2, rect.top + rect.height / 2);

                if (poppedCount === 36) {
                    triggerConfettiBurst(80);
                    setTimeout(() => {
                        alert("Keren banget! Semua bubble wrap cinta telah di-pop! Amara jadi senyum manis deh! 🌸✨");
                    }, 300);
                }
            });
            grid.appendChild(bubble);
        }

        const btnResetBubble = document.getElementById('btnResetBubble');
        if (btnResetBubble) {
            btnResetBubble.onclick = initBubbleWrapGame;
        }
    }

    // --- GAME 13: ROSE PETAL CATCH ---
    function initPetalCatchGame() {
        const canvas = document.getElementById('petalCanvas');
        const overlay = document.getElementById('petalOverlay');
        const startBtn = document.getElementById('btnStartPetalCatch');
        const scoreEl = document.getElementById('petalScore');
        const timerEl = document.getElementById('petalTimer');
        const btnLeft = document.getElementById('ctrlPetalLeft');
        const btnRight = document.getElementById('ctrlPetalRight');

        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        let basket = { x: 250, y: 360, width: 80, height: 20, speed: 15 };
        let petals = [];
        let score = 0;
        let timeLeft = 20;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            petalCatchActive = true;
            score = 0;
            timeLeft = 20;
            petals = [];
            scoreEl.textContent = score;
            timerEl.textContent = timeLeft;

            petalTimerInterval = setInterval(() => {
                timeLeft--;
                timerEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    petalCatchActive = false;
                    clearInterval(petalTimerInterval);
                    clearInterval(petalSpawnInterval);
                    overlay.querySelector('.overlay-title').innerHTML = "Waktu Habis! 🌹";
                    overlay.querySelector('.overlay-desc').innerHTML = `Hebat! Kamu mengumpulkan **${score}** kelopak mawar indah untuk Amara!`;
                    overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
                    overlay.classList.remove('hidden');
                }
            }, 1000);

            petalSpawnInterval = setInterval(() => {
                if (petalCatchActive) {
                    petals.push({
                        x: Math.random() * (canvas.width - 20) + 10,
                        y: -10,
                        size: Math.random() * 8 + 6,
                        speed: Math.random() * 2 + 2,
                        angle: Math.random() * Math.PI,
                        rotationSpeed: Math.random() * 0.05 - 0.025
                    });
                }
            }, 300);

            petalLoop();
        };

        function petalLoop() {
            if (!petalCatchActive) return;

            // Physics & Collision
            petals.forEach((p, idx) => {
                p.y += p.speed;
                p.x += Math.sin(p.y / 20) * 0.5;
                p.angle += p.rotationSpeed;

                // Collision with basket
                if (p.y + p.size >= basket.y && p.x >= basket.x && p.x <= basket.x + basket.width) {
                    petals.splice(idx, 1);
                    score++;
                    scoreEl.textContent = score;
                    playPluckSound(score);
                    triggerConfettiBurst(5, p.x, p.y);
                } else if (p.y > canvas.height) {
                    petals.splice(idx, 1);
                }
            });

            // Draw
            ctx.fillStyle = '#fff5f7';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Basket
            ctx.fillStyle = '#8d6e63'; // Wicker brown
            ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
            ctx.fillStyle = '#ff8da1'; // Ribbon trim
            ctx.fillRect(basket.x - 2, basket.y + 4, basket.width + 4, 4);

            // Draw Petals
            petals.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = '#ff4d6d';
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(petalLoop);
        }

        // Control binds
        window.addEventListener('keydown', (e) => {
            if (!petalCatchActive) return;
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') basket.x = Math.max(0, basket.x - basket.speed);
            if (e.code === 'ArrowRight' || e.code === 'KeyD') basket.x = Math.min(canvas.width - basket.width, basket.x + basket.speed);
        });

        if (btnLeft && btnRight) {
            btnLeft.onclick = () => { if (petalCatchActive) basket.x = Math.max(0, basket.x - 25); };
            btnRight.onclick = () => { if (petalCatchActive) basket.x = Math.min(canvas.width - basket.width, basket.x + 25); };
        }
    }

    // --- GAME 14: SECRET LOVE CODE ---
    function initLoveCodeGame() {
        const input = document.getElementById('loveCodeInput');
        const output = document.getElementById('loveCodeOutput');
        const btnEncode = document.getElementById('btnEncodeMessage');
        const btnDecode = document.getElementById('btnDecodeMessage');

        if (!input || !output || !btnEncode || !btnDecode) return;

        const charMap = {
            'a': '🌸', 'b': '💖', 'c': '🍰', 'd': '🎁', 'e': '🎀',
            'f': '🎈', 'g': '🧸', 'h': '🌟', 'i': '🍭', 'j': '👑',
            'k': '🍬', 'l': '🍃', 'm': '🍡', 'n': '🍩', 'o': '🍪',
            'p': '🍧', 'q': '🪐', 'r': '🌹', 's': '✨', 't': '🍓',
            'u': '🧁', 'v': '🍷', 'w': '🥞', 'x': '🍒', 'y': '🦄', 'z': '💘',
            ' ': '🕊'
        };
        const revMap = {};
        for (let key in charMap) {
            revMap[charMap[key]] = key;
        }

        btnEncode.onclick = () => {
            const text = input.value.toLowerCase();
            let result = '';
            for (let char of text) {
                result += charMap[char] || char;
            }
            output.value = result;
            triggerConfettiBurst(10);
        };

        btnDecode.onclick = () => {
            const text = input.value;
            let result = '';
            // Iterate through emoji characters
            const chars = Array.from(text);
            for (let char of chars) {
                result += revMap[char] || char;
            }
            output.value = result;
            triggerConfettiBurst(10);
        };
    }

    // --- GAME 15: CUPID'S ARCHER ---
    function initCupidArcherGame() {
        const canvas = document.getElementById('archerCanvas');
        const overlay = document.getElementById('archerOverlay');
        const startBtn = document.getElementById('btnStartArcher');
        const scoreEl = document.getElementById('archerScore');
        const timerEl = document.getElementById('archerTimer');

        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        let arrows = [];
        let targets = [];
        let score = 0;
        let timeLeft = 20;

        let bow = { x: 50, y: 200, pullX: 50, pullY: 200, isDragging: false };

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            archerActive = true;
            score = 0;
            timeLeft = 20;
            arrows = [];
            targets = [];
            scoreEl.textContent = score;
            timerEl.textContent = timeLeft;

            archerTimerInterval = setInterval(() => {
                timeLeft--;
                timerEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    archerActive = false;
                    clearInterval(archerTimerInterval);
                    overlay.querySelector('.overlay-title').innerHTML = "Waktu Habis! 🏹";
                    overlay.querySelector('.overlay-desc').innerHTML = `Ketepatan Memanah: Berhasil memanah **${score}** target mawar cinta!`;
                    overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
                    overlay.classList.remove('hidden');
                }
            }, 1000);

            archerLoop();
        };

        function archerLoop() {
            if (!archerActive) return;

            // Spawn targets
            if (Math.random() < 0.03 && targets.length < 5) {
                targets.push({
                    x: Math.random() * (canvas.width - 250) + 200,
                    y: canvas.height + 20,
                    size: Math.random() * 8 + 15,
                    speed: Math.random() * 1.5 + 1
                });
            }

            // Physics: Arrows
            arrows.forEach((arr, aIdx) => {
                arr.x += arr.vx;
                arr.y += arr.vy;

                // Collisions
                targets.forEach((tar, tIdx) => {
                    let dist = Math.hypot(arr.x - tar.x, arr.y - tar.y);
                    if (dist < tar.size) {
                        // HIT!
                        targets.splice(tIdx, 1);
                        arrows.splice(aIdx, 1);
                        score++;
                        scoreEl.textContent = score;
                        playPluckSound(score * 2);
                        triggerConfettiBurst(25, tar.x, tar.y);
                    }
                });

                if (arr.x > canvas.width || arr.y < 0 || arr.y > canvas.height) {
                    arrows.splice(aIdx, 1);
                }
            });

            // Physics: Targets
            targets.forEach((tar, idx) => {
                tar.y -= tar.speed;
                if (tar.y < -30) {
                    targets.splice(idx, 1);
                }
            });

            // Draw
            ctx.fillStyle = '#ffeef2';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Bow
            ctx.strokeStyle = '#8d6e63';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(bow.x, bow.y, 40, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();

            // Draw String
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(bow.x, bow.y - 40);
            ctx.lineTo(bow.pullX, bow.pullY);
            ctx.lineTo(bow.x, bow.y + 40);
            ctx.stroke();

            // Draw Arrows
            arrows.forEach(arr => {
                ctx.strokeStyle = '#ff4d6d';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(arr.x, arr.y);
                ctx.lineTo(arr.x - Math.cos(arr.angle) * 20, arr.y - Math.sin(arr.angle) * 20);
                ctx.stroke();
            });

            // Draw Targets (Heart Balloons)
            targets.forEach(tar => {
                ctx.save();
                ctx.translate(tar.x, tar.y);
                ctx.fillStyle = '#ff6b8b';
                ctx.beginPath();
                ctx.moveTo(0, -tar.size * 0.3);
                ctx.bezierCurveTo(-tar.size * 0.5, -tar.size * 0.8, -tar.size, -tar.size * 0.3, 0, tar.size * 0.7);
                ctx.bezierCurveTo(tar.size, -tar.size * 0.3, tar.size * 0.5, -tar.size * 0.8, 0, -tar.size * 0.3);
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(archerLoop);
        }

        // Pointer controls
        canvas.onmousedown = (e) => {
            if (!archerActive) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (Math.hypot(x - bow.x, y - bow.y) < 60) {
                bow.isDragging = true;
            }
        };

        canvas.onmousemove = (e) => {
            if (!bow.isDragging) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            bow.pullX = Math.min(bow.x, x);
            bow.pullY = y;
        };

        canvas.onmouseup = () => {
            if (!bow.isDragging) return;
            bow.isDragging = false;

            // Release arrow!
            let dx = bow.x - bow.pullX;
            let dy = bow.y - bow.pullY;
            let angle = Math.atan2(dy, dx);
            let force = Math.hypot(dx, dy) * 0.08;

            arrows.push({
                x: bow.x,
                y: bow.y,
                vx: Math.cos(angle) * force,
                vy: Math.sin(angle) * force,
                angle: angle
            });

            // Reset string
            bow.pullX = bow.x;
            bow.pullY = bow.y;

            playPluckSound(1);
        };
    }

    // --- GAME 16: LOVE WORD SEARCH ---
    function initWordSearchGame() {
        const grid = document.getElementById('wordSearchGrid');
        const wordsEl = document.getElementById('wordSearchWords');
        if (!grid || !wordsEl) return;
        grid.innerHTML = '';
        wordsEl.innerHTML = '';

        const boardSize = 8;
        const words = ['AMARA', 'LOVE', 'ROSE', 'HEART', 'SWEET', 'ULTAH'];
        let foundWords = [];

        document.getElementById('wordsFoundCount').textContent = `0 / ${words.length}`;

        // Create grid data
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let gridData = Array(boardSize).fill(null).map(() => Array(boardSize).fill(''));

        const placements = [
            { w: 'AMARA', r: 0, c: 0, dir: 'H' },
            { w: 'LOVE', r: 2, c: 3, dir: 'V' },
            { w: 'ROSE', r: 5, c: 1, dir: 'H' },
            { w: 'HEART', r: 1, c: 2, dir: 'H' },
            { w: 'SWEET', r: 3, c: 0, dir: 'V' },
            { w: 'ULTAH', r: 7, c: 2, dir: 'H' }
        ];

        placements.forEach(p => {
            for (let i = 0; i < p.w.length; i++) {
                let r = p.dir === 'V' ? p.r + i : p.r;
                let c = p.dir === 'H' ? p.c + i : p.c;
                if (r < boardSize && c < boardSize) {
                    gridData[r][c] = p.w[i];
                }
            }
        });

        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (gridData[r][c] === '') {
                    gridData[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }

        words.forEach(word => {
            const wordEl = document.createElement('span');
            wordEl.className = 'word-bank-item';
            wordEl.textContent = word;
            wordEl.style.padding = '3px 8px';
            wordEl.style.background = 'rgba(255,255,255,0.7)';
            wordEl.style.border = '1px solid var(--glass-border)';
            wordEl.style.borderRadius = '4px';
            wordEl.id = `ws-word-${word}`;
            wordsEl.appendChild(wordEl);
        });

        let selection = [];
        let isSelecting = false;

        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                const cell = document.createElement('div');
                cell.className = 'connector-cell';
                cell.textContent = gridData[r][c];
                cell.dataset.r = r;
                cell.dataset.c = c;
                cell.style.fontSize = '16px';
                cell.style.background = 'rgba(255,255,255,0.7)';

                cell.addEventListener('mousedown', () => {
                    isSelecting = true;
                    selection = [{ r, c, cell }];
                    cell.style.background = '#ffccd5';
                });

                cell.addEventListener('mouseenter', () => {
                    if (isSelecting) {
                        selection.push({ r, c, cell });
                        cell.style.background = '#ffccd5';
                    }
                });

                grid.appendChild(cell);
            }
        }

        window.onmouseup = () => {
            if (!isSelecting) return;
            isSelecting = false;

            let selectedText = selection.map(s => gridData[s.r][s.c]).join('');
            let revText = selectedText.split('').reverse().join('');

            let matchedWord = null;
            if (words.includes(selectedText) && !foundWords.includes(selectedText)) {
                matchedWord = selectedText;
            } else if (words.includes(revText) && !foundWords.includes(revText)) {
                matchedWord = revText;
            }

            if (matchedWord) {
                foundWords.push(matchedWord);
                document.getElementById('wordsFoundCount').textContent = `${foundWords.length} / ${words.length}`;

                const wordBankEl = document.getElementById(`ws-word-${matchedWord}`);
                if (wordBankEl) {
                    wordBankEl.style.textDecoration = 'line-through';
                    wordBankEl.style.background = '#c7f9cc';
                    wordBankEl.style.color = '#57cc99';
                }

                selection.forEach(s => {
                    s.cell.style.background = '#c7f9cc';
                    s.cell.style.color = '#2d6a4f';
                    s.cell.style.fontWeight = 'bold';
                    s.cell.classList.add('correct-cell');
                });

                playChimeMelody();
                triggerConfettiBurst(20);

                if (foundWords.length === words.length) {
                    triggerConfettiBurst(80);
                    setTimeout(() => {
                        alert("Keren! Kamu menemukan semua kata cinta untuk Amara! 💖🌸");
                    }, 300);
                }
            } else {
                selection.forEach(s => {
                    if (!s.cell.classList.contains('correct-cell')) {
                        s.cell.style.background = 'rgba(255,255,255,0.7)';
                    }
                });
            }
            selection = [];
        };

        const btnResetWordSearch = document.getElementById('btnResetWordSearch');
        if (btnResetWordSearch) {
            btnResetWordSearch.onclick = initWordSearchGame;
        }
    }

    // --- GAME 17: MELODY PIANO TAP ---
    function initPianoTapGame() {
        const canvas = document.getElementById('pianoCanvas');
        const overlay = document.getElementById('pianoOverlay');
        const startBtn = document.getElementById('btnStartPiano');
        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        let tiles = [];
        let score = 0;
        let combo = 0;
        let frameCount = 0;

        const birthdayMelody = [
            261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
            261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
            261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
            466.16, 466.16, 440.00, 349.23, 392.00, 349.23
        ];
        let noteIndex = 0;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            pianoActive = true;
            score = 0;
            combo = 0;
            tiles = [];
            noteIndex = 0;
            frameCount = 0;

            document.getElementById('pianoScore').textContent = score;
            document.getElementById('pianoCombo').textContent = combo;

            pianoLoop();
        };

        function spawnPianoTile() {
            let lane = Math.floor(Math.random() * 4);
            tiles.push({
                lane: lane,
                y: -100,
                width: canvas.width / 4,
                height: 80,
                speed: 4,
                clicked: false
            });
        }

        function pianoLoop() {
            if (!pianoActive) return;

            if (frameCount % 60 === 0) {
                spawnPianoTile();
            }

            tiles.forEach((tile, idx) => {
                tile.y += tile.speed;

                if (tile.y > canvas.height && !tile.clicked) {
                    tiles.splice(idx, 1);
                    combo = 0;
                    document.getElementById('pianoCombo').textContent = combo;
                }
            });

            ctx.fillStyle = '#fff5f7';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(255, 107, 139, 0.2)';
            ctx.lineWidth = 1.5;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(i * (canvas.width / 4), 0);
                ctx.lineTo(i * (canvas.width / 4), canvas.height);
                ctx.stroke();
            }

            ctx.strokeStyle = 'var(--primary-pink)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 80);
            ctx.lineTo(canvas.width, canvas.height - 80);
            ctx.stroke();

            tiles.forEach(tile => {
                if (tile.clicked) return;
                ctx.fillStyle = 'var(--soft-pink)';
                ctx.fillRect(tile.lane * tile.width + 4, tile.y, tile.width - 8, tile.height);

                ctx.fillStyle = '#ffd700';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('🌹', tile.lane * tile.width + tile.width / 2, tile.y + tile.height / 2 + 8);
            });

            ctx.fillStyle = 'var(--dark-text)';
            ctx.font = 'bold 16px Fredoka';
            ctx.textAlign = 'left';
            ctx.fillText(`Skor: ${score}`, 15, 30);
            ctx.fillText(`Combo: ${combo}`, 15, 55);

            frameCount++;
            requestAnimationFrame(pianoLoop);
        }

        canvas.onmousedown = (e) => {
            if (!pianoActive) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let lane = Math.floor(x / (canvas.width / 4));
            let hit = false;

            tiles.forEach(tile => {
                if (tile.lane === lane && !tile.clicked) {
                    let tileBottom = tile.y + tile.height;
                    let targetLine = canvas.height - 80;

                    if (Math.abs(tileBottom - targetLine) < 80) {
                        tile.clicked = true;
                        hit = true;
                        score++;
                        combo++;
                        document.getElementById('pianoScore').textContent = score;
                        document.getElementById('pianoCombo').textContent = combo;

                        playSynthNoteFreq(birthdayMelody[noteIndex % birthdayMelody.length]);
                        noteIndex++;

                        triggerConfettiBurst(8, x, y);

                        if (score >= 25) {
                            triggerConfettiBurst(100);
                            setTimeout(() => {
                                alert("Met ya! Melodi piano ulang tahun telah berkumandang manis buat Amara! 🎹🌸✨");
                            }, 300);
                        }
                    }
                }
            });

            if (!hit) {
                combo = 0;
                document.getElementById('pianoCombo').textContent = combo;
            }
        };

        function playSynthNoteFreq(freq) {
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.4);
            } catch (e) { }
        }
    }

    // --- GAME 18: AESTHETIC DOODLE PAD ---
    function initDoodlePadGame() {
        const canvas = document.getElementById('doodleCanvas');
        const colorInput = document.getElementById('doodleColor');
        const clearBtn = document.getElementById('btnResetDoodle');
        const downloadBtn = document.getElementById('btnDownloadDoodle');
        const stamps = document.querySelectorAll('.doodle-stamp');

        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let selectedStamp = 'none';

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;

        clearBtn.onclick = () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            playPluckSound(1);
        };

        stamps.forEach(stamp => {
            stamp.onclick = () => {
                stamps.forEach(s => s.classList.remove('active'));
                stamp.classList.add('active');
                selectedStamp = stamp.getAttribute('data-stamp');
            };
        });

        canvas.addEventListener('pointerdown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (selectedStamp === 'none') {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.strokeStyle = colorInput.value;
            } else {
                ctx.font = '28px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(selectedStamp, x, y + 10);
                playPluckSound(4);
            }
        });

        canvas.addEventListener('pointermove', (e) => {
            if (!isDrawing || selectedStamp !== 'none') return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.lineTo(x, y);
            ctx.stroke();
        });

        canvas.addEventListener('pointerup', () => { isDrawing = false; });
        canvas.addEventListener('pointercancel', () => { isDrawing = false; });

        downloadBtn.onclick = () => {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'amara_doodle_birthday.png';
            link.href = dataUrl;
            link.click();
            triggerConfettiBurst(20);
        };
    }

    // --- GAME 19: SWEET CUPCAKE CLICKER ---
    function initCupcakeClickerGame() {
        const cupcake = document.getElementById('giantCupcake');
        const counter = document.getElementById('clickerCount');
        const cpsEl = document.getElementById('clickerCps');
        const autoClickBtn = document.getElementById('upgradeAutoClick');
        const autoClickCostEl = document.getElementById('autoClickCost');
        const autoClickLevelEl = document.getElementById('autoClickLevel');
        const fairyDustBtn = document.getElementById('upgradeFairyDust');
        const fairyDustCostEl = document.getElementById('fairyDustCost');
        const fairyDustLevelEl = document.getElementById('fairyDustLevel');

        if (!cupcake) return;

        let candies = 0;
        let autoLevel = 0;
        let autoCost = 15;
        let fairyLevel = 0;
        let fairyCost = 100;
        let candiesPerClick = 1;

        function updateUI() {
            counter.textContent = Math.floor(candies);
            cpsEl.textContent = autoLevel * 1;
            autoClickCostEl.textContent = autoCost;
            autoClickLevelEl.textContent = autoLevel;
            fairyDustCostEl.textContent = fairyCost;
            fairyDustLevelEl.textContent = fairyLevel;
        }

        cupcake.onclick = (e) => {
            candies += candiesPerClick;
            updateUI();
            playPluckSound(1);
            triggerConfettiBurst(5, e.clientX, e.clientY);
        };

        autoClickBtn.onclick = () => {
            if (candies >= autoCost) {
                candies -= autoCost;
                autoLevel++;
                autoCost = Math.floor(autoCost * 1.5);
                updateUI();
                playChimeMelody();
            }
        };

        fairyDustBtn.onclick = () => {
            if (candies >= fairyCost) {
                candies -= fairyCost;
                fairyLevel++;
                candiesPerClick += 2;
                fairyCost = Math.floor(fairyCost * 1.8);
                updateUI();
                playChimeMelody();
            }
        };

        const clickerInterval = setInterval(() => {
            if (autoLevel > 0) {
                candies += autoLevel * 0.1;
                updateUI();
            }
        }, 100);

        flappyInterval = clickerInterval;
    }

    // --- GAME 20: WHACK-A-CUPID ---
    function initWhackCupidGame() {
        const overlay = document.getElementById('whackOverlay');
        const startBtn = document.getElementById('btnStartWhack');
        const scoreEl = document.getElementById('whackScore');
        const timerEl = document.getElementById('whackTimer');
        const holes = document.querySelectorAll('.whack-hole');

        if (!startBtn) return;

        let score = 0;
        let timeLeft = 20;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            whackActive = true;
            score = 0;
            timeLeft = 20;
            scoreEl.textContent = score;
            timerEl.textContent = timeLeft;

            whackTimerInterval = setInterval(() => {
                timeLeft--;
                timerEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    whackActive = false;
                    clearInterval(whackTimerInterval);
                    clearInterval(whackSpawnInterval);
                    overlay.querySelector('.overlay-title').innerHTML = "Waktu Habis! 🔨";
                    overlay.querySelector('.overlay-desc').innerHTML = `Hebat! Kamu berhasil me-whack **${score}** Cupid cinta!`;
                    overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
                    overlay.classList.remove('hidden');
                }
            }, 1000);

            whackSpawnInterval = setInterval(showMole, 600);
        };

        function showMole() {
            if (!whackActive) return;
            holes.forEach(h => h.querySelector('.whack-mole').classList.remove('up', 'whacked'));

            const randomHole = holes[Math.floor(Math.random() * holes.length)];
            const mole = randomHole.querySelector('.whack-mole');
            mole.classList.add('up');

            mole.onclick = () => {
                if (!mole.classList.contains('up') || mole.classList.contains('whacked')) return;
                mole.classList.add('whacked');
                score++;
                scoreEl.textContent = score;
                playPluckSound(score);

                const rect = mole.getBoundingClientRect();
                triggerConfettiBurst(10, rect.left + rect.width / 2, rect.top + rect.height / 2);

                setTimeout(() => {
                    mole.classList.remove('up');
                }, 200);
            };
        }
    }

    // --- GAME 21: LOVE POLAROID JIGSAW ---
    function initJigsawPuzzle() {
        const board = document.getElementById('jigsawBoardSlots');
        const pool = document.getElementById('jigsawPiecesPool');
        const resetBtn = document.getElementById('btnResetJigsaw');
        if (!board || !pool) return;

        board.innerHTML = '';
        pool.innerHTML = '';

        let pieces = [];
        let correctCount = 0;

        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.className = 'jigsaw-slot';
            slot.dataset.slot = i;
            board.appendChild(slot);
        }

        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.className = 'jigsaw-piece';
            piece.draggable = true;
            piece.dataset.piece = i;
            piece.style.backgroundImage = "url('assets/polaroid_heart_vibes.png')";

            let r = Math.floor(i / 3);
            let c = i % 3;
            piece.style.backgroundPosition = `${-c * 80}px ${-r * 80}px`;

            piece.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', i);
            });

            pieces.push(piece);
        }

        shuffle(pieces);
        pieces.forEach(p => pool.appendChild(p));

        document.querySelectorAll('.jigsaw-slot').forEach(slot => {
            slot.addEventListener('dragover', (e) => e.preventDefault());
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const pieceId = e.dataTransfer.getData('text/plain');
                const piece = document.querySelector(`.jigsaw-piece[data-piece="${pieceId}"]`);
                const slotId = slot.dataset.slot;

                if (piece && slot.childNodes.length === 0) {
                    slot.appendChild(piece);
                    if (pieceId === slotId) {
                        piece.classList.add('correct');
                        piece.draggable = false;
                        correctCount++;

                        playPluckSound(correctCount);
                        triggerConfettiBurst(10);

                        if (correctCount === 9) {
                            triggerConfettiBurst(100);
                            setTimeout(() => {
                                alert("Keren! Polaroid cinta Amara telah tersusun sempurna! 💕✨");
                            }, 300);
                        }
                    }
                }
            });
        });

        if (resetBtn) {
            resetBtn.onclick = initJigsawPuzzle;
        }
    }

    // --- GAME 22: ROMANTIC HEART SNAKE ---
    function initHeartSnakeGame() {
        const canvas = document.getElementById('snakeCanvas');
        const overlay = document.getElementById('snakeOverlay');
        const startBtn = document.getElementById('btnStartSnake');
        const scoreEl = document.getElementById('snakeScore');
        const highScoreEl = document.getElementById('snakeHighScore');
        const btnUp = document.getElementById('ctrlSnakeUp');
        const btnLeft = document.getElementById('ctrlSnakeLeft');
        const btnRight = document.getElementById('ctrlSnakeRight');
        const btnDown = document.getElementById('ctrlSnakeDown');

        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        const gridSize = 16;
        let snake = [];
        let food = { x: 0, y: 0 };
        let dx = gridSize;
        let dy = 0;
        let score = 0;

        highScoreEl.textContent = snakeHighScore;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            snakeActive = true;
            score = 0;
            dx = gridSize;
            dy = 0;
            scoreEl.textContent = score;

            snake = [
                { x: 160, y: 160 },
                { x: 144, y: 160 },
                { x: 128, y: 160 }
            ];

            spawnFood();

            if (snakeInterval) clearInterval(snakeInterval);
            snakeInterval = setInterval(snakeStep, 130);
        };

        function spawnFood() {
            food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
            food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        }

        function snakeStep() {
            if (!snakeActive) return;

            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreEl.textContent = score;
                playPluckSound(score * 2);
                triggerConfettiBurst(8, food.x + gridSize / 2, food.y + gridSize / 2);
                spawnFood();
            } else {
                snake.pop();
            }

            if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
                endSnakeGame();
                return;
            }

            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    endSnakeGame();
                    return;
                }
            }

            ctx.fillStyle = '#fff5f7';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#ffd700';
            ctx.font = '14px Arial';
            ctx.fillText('🌟', food.x + 1, food.y + 13);

            snake.forEach((part, idx) => {
                ctx.fillStyle = idx === 0 ? 'var(--primary-pink)' : 'var(--soft-pink)';
                ctx.font = '14px Arial';
                ctx.fillText('💖', part.x + 1, part.y + 13);
            });
        }

        function endSnakeGame() {
            snakeActive = false;
            clearInterval(snakeInterval);

            if (score > snakeHighScore) {
                snakeHighScore = score;
                localStorage.setItem('amara_snake_highscore', snakeHighScore);
            }
            highScoreEl.textContent = snakeHighScore;

            overlay.querySelector('.overlay-title').innerHTML = "Game Over! 💔";
            overlay.querySelector('.overlay-desc').innerHTML = `Ular cinta menabrak pembatas! <br> Skor: **${score}** | Rekor Terbaik: **${snakeHighScore}**`;
            overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
            overlay.classList.remove('hidden');
        }

        window.addEventListener('keydown', (e) => {
            if (!snakeActive) return;
            if ((e.code === 'ArrowUp' || e.code === 'KeyW') && dy === 0) { dx = 0; dy = -gridSize; }
            if ((e.code === 'ArrowDown' || e.code === 'KeyS') && dy === 0) { dx = 0; dy = gridSize; }
            if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && dx === 0) { dx = -gridSize; dy = 0; }
            if ((e.code === 'ArrowRight' || e.code === 'KeyD') && dx === 0) { dx = gridSize; dy = 0; }
        });

        if (btnUp && btnLeft && btnRight && btnDown) {
            btnUp.onclick = () => { if (snakeActive && dy === 0) { dx = 0; dy = -gridSize; } };
            btnDown.onclick = () => { if (snakeActive && dy === 0) { dx = 0; dy = gridSize; } };
            btnLeft.onclick = () => { if (snakeActive && dx === 0) { dx = -gridSize; dy = 0; } };
            btnRight.onclick = () => { if (snakeActive && dx === 0) { dx = gridSize; dy = 0; } };
        }
    }

    // --- GAME 23: CUPID'S MAZE ---
    function initCupidMazeGame() {
        const canvas = document.getElementById('mazeCanvas');
        const overlay = document.getElementById('mazeOverlay');
        const startBtn = document.getElementById('btnStartMaze');
        const btnUp = document.getElementById('ctrlMazeUp');
        const btnLeft = document.getElementById('ctrlMazeLeft');
        const btnRight = document.getElementById('ctrlMazeRight');
        const btnDown = document.getElementById('ctrlMazeDown');

        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        const gridCell = 32;
        let player = { x: 1, y: 1 };
        let goal = { x: 8, y: 8 };

        const mazeMap = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            mazeActive = true;
            player.x = 1;
            player.y = 1;
            drawMaze();
        };

        function drawMaze() {
            ctx.fillStyle = '#fff5f7';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let r = 0; r < 10; r++) {
                for (let c = 0; c < 10; c++) {
                    if (mazeMap[r][c] === 1) {
                        ctx.fillStyle = '#c7f9cc';
                        ctx.fillRect(c * gridCell, r * gridCell, gridCell - 2, gridCell - 2);
                    }
                }
            }

            ctx.font = '20px Arial';
            ctx.fillText('🔑', goal.x * gridCell + 6, goal.y * gridCell + 24);
            ctx.fillText('🌹', player.x * gridCell + 6, player.y * gridCell + 24);
        }

        function movePlayer(dx, dy) {
            if (!mazeActive) return;
            let nx = player.x + dx;
            let ny = player.y + dy;

            if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                if (mazeMap[ny][nx] === 0) {
                    player.x = nx;
                    player.y = ny;
                    drawMaze();
                    playPluckSound(5);

                    if (player.x === goal.x && player.y === goal.y) {
                        mazeActive = false;
                        triggerConfettiBurst(80);
                        setTimeout(() => {
                            overlay.querySelector('.overlay-title').innerHTML = "Labirin Terselesaikan! 🎉";
                            overlay.querySelector('.overlay-desc').innerHTML = "Luar Biasa! Mawar merah berhasil menemukan kunci cinta Cupid! 🌸🔑";
                            overlay.querySelector('.play-btn').textContent = "Main Lagi 🧭";
                            overlay.classList.remove('hidden');
                        }, 400);
                    }
                }
            }
        }

        window.addEventListener('keydown', (e) => {
            if (!mazeActive) return;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); movePlayer(0, -1); }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); movePlayer(0, 1); }
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); movePlayer(-1, 0); }
            if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); movePlayer(1, 0); }
        });

        if (btnUp && btnLeft && btnRight && btnDown) {
            btnUp.onclick = () => movePlayer(0, -1);
            btnDown.onclick = () => movePlayer(0, 1);
            btnLeft.onclick = () => movePlayer(-1, 0);
            btnRight.onclick = () => movePlayer(1, 0);
        }
    }

    // --- GAME 24: MAGIC LOVE CRYSTAL BALL ---
    function initCrystalBallGame() {
        const textEl = document.getElementById('crystalReadingText');
        const ball = document.getElementById('btnTriggerCrystalBall');
        if (!textEl || !ball) return;

        const ballFortunes = [
            "🔮 JAWABAN: Hari esok bakal bawa bahagia yang luar biasa buat kamu sama dia! 💕",
            "🔮 JAWABAN: Mimpi kamu bakal segera terwujud kok. Terus percaya sama kekuatan cinta ya! ✨",
            "🔮 JAWABAN: Ada kejutan manis yang lagi nungguin kamu hari ini. Siap-siap ya! 🎁",
            "🔮 JAWABAN: Iya dong, hati dia sepenuhnya terpikat sama ketulusan dan pesona kamu yang gemesin! 🌸",
            "🔮 JAWABAN: Energi hari ini lagi dukung penuh tiap langkah romantis yang kamu ambil! 💖",
            "🔮 JAWABAN: Bintang-bintang udah mastiin kesetiaan dia buat kamu sampai akhir waktu! 🪐",
            "🔮 JAWABAN: Santai aja dan nikmatin momen indah bareng dia, semua bakal indah pada waktunya kok! 🧸"
        ];

        ball.onclick = () => {
            textEl.textContent = "Sedang menyerap gelombang energi cinta kosmik... 🔮";
            playChimeMelody();
            triggerConfettiBurst(15);
            setTimeout(() => {
                const idx = Math.floor(Math.random() * ballFortunes.length);
                textEl.textContent = ballFortunes[idx];
                triggerConfettiBurst(30);
            }, 1000);
        };
    }

    // --- GAME 25: BRICK BREAKER LOVE ---
    function initBrickBreakerGame() {
        const canvas = document.getElementById('brickCanvas');
        const overlay = document.getElementById('brickOverlay');
        const startBtn = document.getElementById('btnStartBrick');
        const scoreEl = document.getElementById('brickScore');
        const livesEl = document.getElementById('brickLives');

        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');

        let ball = { x: 250, y: 300, vx: 3, vy: -3, radius: 8 };
        let paddle = { x: 200, y: 330, width: 80, height: 12 };
        let bricks = [];
        let score = 0;
        let lives = 3;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            brickActive = true;
            score = 0;
            lives = 3;
            scoreEl.textContent = score;
            livesEl.textContent = lives;

            ball.x = 250;
            ball.y = 300;
            ball.vx = 3.5;
            ball.vy = -3.5;

            bricks = [];
            const rCount = 4;
            const cCount = 6;
            const bWidth = 65;
            const bHeight = 18;
            const bPadding = 10;
            const bOffsetTop = 40;
            const bOffsetLeft = 30;

            const emojiBricks = ['🌸', '💖', '⭐', '🎈'];

            for (let c = 0; c < cCount; c++) {
                for (let r = 0; r < rCount; r++) {
                    bricks.push({
                        x: c * (bWidth + bPadding) + bOffsetLeft,
                        y: r * (bHeight + bPadding) + bOffsetTop,
                        width: bWidth,
                        height: bHeight,
                        emoji: emojiBricks[r % 4],
                        status: 1
                    });
                }
            }

            if (brickInterval) clearInterval(brickInterval);
            brickInterval = setInterval(brickStep, 16);
        };

        function brickStep() {
            if (!brickActive) return;

            if (ball.x + ball.vx < ball.radius || ball.x + ball.vx > canvas.width - ball.radius) {
                ball.vx = -ball.vx;
            }
            if (ball.y + ball.vy < ball.radius) {
                ball.vy = -ball.vy;
            }

            if (ball.y + ball.vy > paddle.y - ball.radius &&
                ball.x > paddle.x &&
                ball.x < paddle.x + paddle.width) {
                ball.vy = -ball.vy;
                playPluckSound(2);
            }

            if (ball.y + ball.vy > canvas.height - ball.radius) {
                lives--;
                livesEl.textContent = lives;
                playPluckSound(0);

                if (lives <= 0) {
                    endBrickGame();
                    return;
                } else {
                    ball.x = 250;
                    ball.y = 300;
                    ball.vx = 3.5;
                    ball.vy = -3.5;
                }
            }

            ball.x += ball.vx;
            ball.y += ball.vy;

            bricks.forEach(b => {
                if (b.status === 1) {
                    if (ball.x > b.x && ball.x < b.x + b.width &&
                        ball.y > b.y && ball.y < b.y + b.height) {
                        b.status = 0;
                        ball.vy = -ball.vy;
                        score += 10;
                        scoreEl.textContent = score;
                        playPluckSound(score / 5);
                        triggerConfettiBurst(15, b.x + b.width / 2, b.y + b.height / 2);

                        if (bricks.every(br => br.status === 0)) {
                            brickActive = false;
                            clearInterval(brickInterval);
                            triggerConfettiBurst(100);
                            setTimeout(() => {
                                overlay.querySelector('.overlay-title').innerHTML = "Kamu Menang! 🧱🎉";
                                overlay.querySelector('.overlay-desc').innerHTML = "Luar Biasa! Semua bata emoji cinta berhasil dihancurkan! 💖✨";
                                overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
                                overlay.classList.remove('hidden');
                            }, 400);
                        }
                    }
                }
            });

            ctx.fillStyle = '#fff5f7';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'var(--primary-pink)';
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

            ctx.font = '16px Arial';
            ctx.fillText('💖', ball.x - 8, ball.y + 6);

            bricks.forEach(b => {
                if (b.status === 1) {
                    ctx.fillStyle = 'rgba(255, 182, 193, 0.4)';
                    ctx.fillRect(b.x, b.y, b.width, b.height);
                    ctx.font = '12px Arial';
                    ctx.fillText(b.emoji, b.x + b.width / 2 - 6, b.y + 13);
                }
            });
        }

        function endBrickGame() {
            brickActive = false;
            clearInterval(brickInterval);
            overlay.querySelector('.overlay-title').innerHTML = "Game Over! 💔";
            overlay.querySelector('.overlay-desc').innerHTML = `Bata tersisa terlalu kuat! <br> Skor Ulang Tahun: **${score}**`;
            overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
            overlay.classList.remove('hidden');
        }

        canvas.onmousemove = (e) => {
            if (!brickActive) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, x - paddle.width / 2));
        };
        canvas.addEventListener('touchmove', (e) => {
            if (!brickActive) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, x - paddle.width / 2));
        }, { passive: true });
    }

    // --- GAME 26: CUPID'S HEART RHYTHM ---
    function initHeartRhythmGame() {
        const canvas = document.getElementById('rhythmCanvas');
        const overlay = document.getElementById('rhythmOverlay');
        const startBtn = document.getElementById('btnStartRhythm');
        const tapBtn = document.getElementById('btnTapRhythm');
        const scoreEl = document.getElementById('rhythmScore');
        const comboEl = document.getElementById('rhythmCombo');

        if (!canvas || !startBtn || !tapBtn) return;

        const ctx = canvas.getContext('2d');
        let circles = [];
        let score = 0;
        let combo = 0;
        let frameCount = 0;
        let accText = '';
        let accTimer = 0;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            rhythmActive = true;
            score = 0;
            combo = 0;
            circles = [];
            frameCount = 0;

            scoreEl.textContent = score;
            comboEl.textContent = combo;

            rhythmLoop();
        };

        function rhythmLoop() {
            if (!rhythmActive) return;

            if (frameCount % 80 === 0) {
                circles.push({
                    radius: 120,
                    targetRadius: 20,
                    speed: 1.5,
                    status: 1
                });
            }

            circles.forEach((c, idx) => {
                c.radius -= c.speed;

                if (c.radius <= 0) {
                    circles.splice(idx, 1);
                    combo = 0;
                    comboEl.textContent = combo;
                }
            });

            ctx.fillStyle = '#fff5f7';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '32px Arial';
            ctx.fillText('🌹', canvas.width / 2 - 16, canvas.height / 2 + 10);

            ctx.strokeStyle = 'var(--primary-pink)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
            ctx.stroke();

            circles.forEach(c => {
                if (c.status === 1) {
                    ctx.strokeStyle = '#ffd700';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, canvas.height / 2, c.radius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });

            if (accTimer > 0) {
                ctx.fillStyle = 'var(--primary-pink)';
                ctx.font = 'bold 24px Fredoka';
                ctx.textAlign = 'center';
                ctx.fillText(accText, canvas.width / 2, canvas.height / 2 - 60);
                accTimer--;
            }

            ctx.fillStyle = 'var(--dark-text)';
            ctx.font = 'bold 16px Fredoka';
            ctx.textAlign = 'left';
            ctx.fillText(`Ketepatan: ${score}`, 15, 30);
            ctx.fillText(`Combo: ${combo}`, 15, 55);

            frameCount++;
            requestAnimationFrame(rhythmLoop);
        }

        function performRhythmTap() {
            if (!rhythmActive || circles.length === 0) return;

            const c = circles[0];
            let diff = Math.abs(c.radius - c.targetRadius);

            if (diff < 15) {
                circles.shift();
                score += 150;
                combo++;
                triggerConfettiBurst(20);
                playPluckSound(7);
                showAccuracyText("PERFECT! 🌟");
            } else if (diff < 35) {
                circles.shift();
                score += 80;
                combo++;
                triggerConfettiBurst(10);
                playPluckSound(4);
                showAccuracyText("GOOD! 💕");
            } else {
                combo = 0;
                showAccuracyText("MISS! 💔");
            }

            scoreEl.textContent = score;
            comboEl.textContent = combo;

            if (score >= 1200) {
                rhythmActive = false;
                triggerConfettiBurst(100);
                setTimeout(() => {
                    overlay.querySelector('.overlay-title').innerHTML = "Kamu Juara Rhythm! 🥁🎉";
                    overlay.querySelector('.overlay-desc').innerHTML = `Skor Ketukan Sempurna: **${score}**! Amara bangga pada ritmemu! 🌸✨`;
                    overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
                    overlay.classList.remove('hidden');
                }, 400);
            }
        }

        tapBtn.onclick = performRhythmTap;
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && rhythmActive) {
                e.preventDefault();
                performRhythmTap();
            }
        });

        function showAccuracyText(txt) {
            accText = txt;
            accTimer = 30;
        }
    }

    // --- GAME 27: MEMORY HEART SEQUENCE ---
    function initHeartSequenceGame() {
        const overlay = document.getElementById('sequenceOverlay');
        const startBtn = document.getElementById('btnStartSequence');
        const roundEl = document.getElementById('seqRound');
        const statusEl = document.getElementById('seqStatus');
        const panels = document.querySelectorAll('.seq-panel');

        if (!startBtn) return;

        let sequence = [];
        let playerSequence = [];
        let round = 1;
        let isShowingSeq = false;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            round = 1;
            sequence = [];
            roundEl.textContent = round;
            nextSequenceRound();
        };

        function nextSequenceRound() {
            playerSequence = [];
            statusEl.textContent = "Perhatikan... 🧬";
            roundEl.textContent = round;
            sequence.push(Math.floor(Math.random() * 4));
            showSequence();
        }

        function showSequence() {
            isShowingSeq = true;
            let i = 0;
            const seqInterval = setInterval(() => {
                if (i >= sequence.length) {
                    clearInterval(seqInterval);
                    isShowingSeq = false;
                    statusEl.textContent = "Ulangi! 💖";
                    return;
                }
                flashPanel(sequence[i]);
                i++;
            }, 600);
            flappyInterval = seqInterval;
        }

        function flashPanel(idx) {
            const panel = panels[idx];
            panel.classList.add('lit');
            playPluckSound(idx * 2 + 1);
            setTimeout(() => {
                panel.classList.remove('lit');
            }, 300);
        }

        panels.forEach((panel, idx) => {
            panel.onclick = () => {
                if (isShowingSeq) return;
                panel.classList.add('lit');
                playPluckSound(idx * 2 + 1);
                setTimeout(() => panel.classList.remove('lit'), 150);

                playerSequence.push(idx);

                const currentStep = playerSequence.length - 1;
                if (playerSequence[currentStep] !== sequence[currentStep]) {
                    statusEl.textContent = "Salah! Game Over 🌸";
                    playPluckSound(0);
                    setTimeout(() => {
                        overlay.querySelector('.overlay-title').innerHTML = "Game Over! 💔";
                        overlay.querySelector('.overlay-desc').innerHTML = `Kamu berhasil bertahan hingga Ronde **${round}**!`;
                        overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
                        overlay.classList.remove('hidden');
                    }, 600);
                    return;
                }

                if (playerSequence.length === sequence.length) {
                    statusEl.textContent = "Benar! Ronde berikutnya... ✨";
                    round++;
                    triggerConfettiBurst(15);
                    setTimeout(nextSequenceRound, 1000);
                }
            };
        });
    }

    // --- GAME 28: CUPCAKE DECORATION STUDIO ---
    function initCupcakeStudio() {
        const toppingsBar = document.querySelectorAll('.topping-item');
        const targetArea = document.getElementById('studioCupcakeCanvasArea');
        const container = document.getElementById('studioToppingsContainer');
        const resetBtn = document.getElementById('btnResetCupcakeStudio');

        if (!targetArea || !container) return;
        container.innerHTML = '';

        toppingsBar.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.type);
            });
        });

        targetArea.addEventListener('dragover', (e) => e.preventDefault());
        targetArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('text/plain');

            const rect = targetArea.getBoundingClientRect();
            const x = e.clientX - rect.left - 15;
            const y = e.clientY - rect.top - 15;

            const topping = document.createElement('div');
            topping.className = 'studio-dropped-topping';
            topping.style.left = `${x}px`;
            topping.style.top = `${y}px`;

            const emojiMap = {
                'cherry': '🍒',
                'cream': '🍦',
                'sparkle': '✨',
                'candle': '🕯️'
            };
            topping.textContent = emojiMap[type] || '🌸';
            container.appendChild(topping);

            playPluckSound(3);
            triggerConfettiBurst(10, e.clientX, e.clientY);
        });

        if (resetBtn) {
            resetBtn.onclick = () => {
                container.innerHTML = '';
            };
        }
    }

    // --- GAME 29: LOVE QUOTE TYPING SPEED ---
    function initTypingSpeedGame() {
        const overlay = document.getElementById('typingOverlay');
        const startBtn = document.getElementById('btnStartTyping');
        const quoteEl = document.getElementById('typingQuoteDisplay');
        const input = document.getElementById('typingInput');
        const timerEl = document.getElementById('typingTimer');
        const wpmEl = document.getElementById('typingWpm');

        if (!startBtn) return;

        const quotes = [
            "Cinta sejati tidak pernah memudar, ia tumbuh lebih cerah dari hari ke hari.",
            "Selamat ulang tahun Amara Clarinta Maharani, semoga harimu dipenuhi senyuman hangat.",
            "Kamulah mawar terindah di dalam taman hatiku, mekar indah abadi selamanya.",
            "Hari ini adalah hari istimewa milikmu, nikmatilah setiap detik dengan kebahagiaan.",
            "Doa terbaikku mengiringi langkahmu menuju masa depan yang penuh warna."
        ];

        let timeLeft = 20;
        let score = 0;
        let currentQuote = '';

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            typingActive = true;
            timeLeft = 20;
            score = 0;
            timerEl.textContent = timeLeft;
            wpmEl.textContent = '0';

            input.disabled = false;
            input.value = '';
            input.focus();

            loadNextQuote();

            typingTimerInterval = setInterval(() => {
                timeLeft--;
                timerEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    typingActive = false;
                    clearInterval(typingTimerInterval);
                    input.disabled = true;
                    overlay.querySelector('.overlay-title').innerHTML = "Waktu Habis! ⌨️";
                    overlay.querySelector('.overlay-desc').innerHTML = `Kecepatan Mengetik Anda: **${wpmEl.textContent} WPM** dengan ketelitian yang manis!`;
                    overlay.querySelector('.play-btn').textContent = "Main Lagi 🎮";
                    overlay.classList.remove('hidden');
                }
            }, 1000);
        };

        function loadNextQuote() {
            currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteEl.textContent = currentQuote;
            input.value = '';
        }

        input.oninput = () => {
            if (!typingActive) return;
            const typedText = input.value;

            if (typedText === currentQuote) {
                score += currentQuote.split(' ').length;
                const wpm = Math.floor((score / (20 - timeLeft)) * 60) || 0;
                wpmEl.textContent = wpm;
                playChimeMelody();
                triggerConfettiBurst(20);
                loadNextQuote();
            } else if (currentQuote.startsWith(typedText)) {
                input.style.color = 'var(--dark-text)';
            } else {
                input.style.color = '#ff4d6d';
            }
        };
    }

    // --- GAME 30: STARRY CONNECT-THE-DOTS ---
    function initConnectDotsGame() {
        const canvas = document.getElementById('dotsCanvas');
        const overlay = document.getElementById('dotsOverlay');
        const startBtn = document.getElementById('btnStartConnectDots');
        const resetBtn = document.getElementById('btnResetConnectDots');

        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        let stars = [
            { x: 250, y: 120, label: 1, clicked: false },
            { x: 210, y: 80, label: 2, clicked: false },
            { x: 150, y: 80, label: 3, clicked: false },
            { x: 100, y: 140, label: 4, clicked: false },
            { x: 150, y: 220, label: 5, clicked: false },
            { x: 250, y: 300, label: 6, clicked: false },
            { x: 350, y: 220, label: 7, clicked: false },
            { x: 400, y: 140, label: 8, clicked: false },
            { x: 350, y: 80, label: 9, clicked: false },
            { x: 290, y: 80, label: 10, clicked: false }
        ];

        let currentTarget = 1;

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            dotsActive = true;
            currentTarget = 1;
            stars.forEach(s => s.clicked = false);
            drawDotsBoard();
        };

        function drawDotsBoard() {
            ctx.fillStyle = '#1a0b2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.beginPath();

            let started = false;
            for (let i = 0; i < stars.length; i++) {
                if (stars[i].clicked) {
                    if (!started) {
                        ctx.moveTo(stars[i].x, stars[i].y);
                        started = true;
                    } else {
                        ctx.lineTo(stars[i].x, stars[i].y);
                    }
                }
            }

            if (currentTarget > 10) {
                ctx.closePath();
                ctx.fillStyle = 'rgba(255, 107, 139, 0.4)';
                ctx.fill();
            }
            ctx.stroke();

            stars.forEach(s => {
                ctx.fillStyle = s.clicked ? '#ff6b8b' : '#ffd700';
                ctx.beginPath();
                ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Arial';
                ctx.fillText(s.label, s.x - 4, s.y - 12);
            });

            if (currentTarget <= 10) {
                ctx.fillStyle = '#ffb6c1';
                ctx.font = '14px Fredoka';
                ctx.textAlign = 'center';
                ctx.fillText(`Hubungkan Bintang Nomor: ${currentTarget}`, canvas.width / 2, canvas.height - 25);
            }
        }

        canvas.onmousedown = (e) => {
            if (!dotsActive || currentTarget > 10) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const s = stars[currentTarget - 1];
            if (Math.hypot(x - s.x, y - s.y) < 18) {
                s.clicked = true;
                playPluckSound(currentTarget);
                triggerConfettiBurst(12, s.x, s.y);
                currentTarget++;
                drawDotsBoard();

                if (currentTarget > 10) {
                    triggerConfettiBurst(120);
                    playChimeMelody();
                    setTimeout(() => {
                        overlay.querySelector('.overlay-title').innerHTML = "Bintang Rasi Hati Terhubung! 🌠🌸";
                        overlay.querySelector('.overlay-desc').innerHTML = "Selamat Ulang Tahun Amara! Rasi bintang hati telah mekar sempurna di langit malam kosmikmu! 💕🪐";
                        overlay.querySelector('.play-btn').textContent = "Hubungkan Lagi ✨";
                        overlay.classList.remove('hidden');
                    }, 600);
                }
            }
        };

        if (resetBtn) {
            resetBtn.onclick = () => {
                currentTarget = 1;
                stars.forEach(s => s.clicked = false);
                drawDotsBoard();
            };
        }
    }

    // --- GAME 31: F1 RACING GRAND PRIX ---
    function initF1RacingGame() {
        const canvas = document.getElementById('f1Canvas');
        const overlay = document.getElementById('f1Overlay');
        const startBtn = document.getElementById('btnStartF1Racing');
        const resetBtn = document.getElementById('btnResetF1Racing');
        const scoreEl = document.getElementById('f1Score');
        const speedEl = document.getElementById('f1Speed');
        const armorEl = document.getElementById('f1Armor');

        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        let score = 0;
        let speed = 0;
        let armor = 100;
        let playerX = canvas.width / 2;
        let targetPlayerX = canvas.width / 2;

        let roadWidth = 200;
        let scrollOffset = 0;
        let trackCurve = 0;
        let targetTrackCurve = 0;
        let curveTimer = 0;

        let opponents = [];
        let collectibles = [];
        let opponentSpawnTimer = 0;
        let collectibleSpawnTimer = 0;

        let boostActive = false;
        let boostTimer = 0;
        let invulnerableTimer = 0;
        let shakeTimer = 0;
        let keyboard = {};
        let animationFrameId = null;

        // Web Audio Synthesizer variables
        let audioCtx = null;
        let osc = null;
        let osc2 = null;
        let gainNode = null;

        // Make sound stopping accessible to stopAllActiveGames
        stopF1EngineSound = function () {
            if (gainNode) {
                try { gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.08); } catch (e) { }
            }
            setTimeout(() => {
                try {
                    if (audioCtx) {
                        audioCtx.close();
                        audioCtx = null;
                        osc = null;
                        osc2 = null;
                        gainNode = null;
                    }
                } catch (e) { }
            }, 120);
        };

        function startEngineSound() {
            try {
                if (audioCtx) return; // already active
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                osc = audioCtx.createOscillator();
                osc2 = audioCtx.createOscillator();
                gainNode = audioCtx.createGain();

                osc.type = 'sawtooth';
                osc2.type = 'triangle';

                // Biquad filter for realistic engine drone muffling
                const filter = audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(450, audioCtx.currentTime);

                osc.connect(filter);
                osc2.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                osc.frequency.setValueAtTime(50, audioCtx.currentTime);
                osc2.frequency.setValueAtTime(25, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);

                osc.start(0);
                osc2.start(0);
            } catch (e) {
                console.warn("Web Audio Engine sound not supported or blocked", e);
            }
        }

        function updateEnginePitch(curSpeed) {
            if (!audioCtx || !osc || !gainNode) return;
            try {
                // Synthesize the pitch sweep matching an F1 engine rev
                const pitchRatio = curSpeed / 380; // 0 to 1
                const mainFreq = 45 + pitchRatio * 155; // ranges from 45Hz to 200Hz
                osc.frequency.setTargetAtTime(mainFreq, audioCtx.currentTime, 0.08);
                osc2.frequency.setTargetAtTime(mainFreq * 0.5, audioCtx.currentTime, 0.08);

                // Throttling volume
                const volume = 0.04 + pitchRatio * 0.07;
                gainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.08);
            } catch (e) { }
        }

        function playCrashSound() {
            if (!audioCtx) return;
            try {
                // Synthesize white noise impact explosion safely
                const bufferSize = audioCtx.sampleRate * 0.35;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(180, audioCtx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3);

                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);
                noise.start();
            } catch (e) { }
        }

        function playCollectSound(isSpecial) {
            if (!audioCtx) return;
            try {
                // Cute retro arcade synth chimes
                const note = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                note.type = 'sine';
                note.connect(gain);
                gain.connect(audioCtx.destination);

                const baseFreq = isSpecial ? 523.25 : 392.00; // C5 or G4
                note.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
                if (isSpecial) {
                    note.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.1); // Arpeggio C5 -> G5
                }

                gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + (isSpecial ? 0.3 : 0.15));

                note.start();
                note.stop(audioCtx.currentTime + 0.35);
            } catch (e) { }
        }

        // Perspective-based curving track center generator
        function getRoadCenter(yCoord) {
            const ratio = (canvas.height - yCoord) / canvas.height; // 0 at bottom, 1 at top
            return canvas.width / 2 + Math.pow(ratio, 2) * trackCurve;
        }

        function drawF1Car(cx, cy, color, isPlayer) {
            ctx.save();
            ctx.translate(cx, cy);

            // invulnerable flashing
            if (isPlayer && invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
                ctx.restore();
                return;
            }

            // Tires (Dark rubber wheels)
            ctx.fillStyle = '#181818';
            // Front tires
            ctx.fillRect(-22, -18, 7, 13);
            ctx.fillRect(15, -18, 7, 13);
            // Rear tires (wider drag tires)
            ctx.fillRect(-24, 10, 9, 17);
            ctx.fillRect(15, 10, 9, 17);

            // Steel axles
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-18, -11); ctx.lineTo(18, -11);
            ctx.moveTo(-18, 18); ctx.lineTo(18, 18);
            ctx.stroke();

            // Main body sidepods & monocoque
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, -32); // Nose cone tip
            ctx.lineTo(7, -13); // Nose widening
            ctx.lineTo(11, 4);  // Sidepods beginning
            ctx.lineTo(12, 19); // Rear engine cover
            ctx.lineTo(-12, 19);
            ctx.lineTo(-11, 4);
            ctx.lineTo(-7, -13);
            ctx.closePath();
            ctx.fill();

            // Front wing (spoiler)
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(-25, -27, 50, 5);
            ctx.fillStyle = color;
            ctx.fillRect(-25, -30, 3, 7);
            ctx.fillRect(22, -30, 3, 7);

            // Cockpit opening and helmet visor
            ctx.fillStyle = '#0a0a0a';
            ctx.beginPath();
            ctx.arc(0, -1, 5, 0, Math.PI * 2);
            ctx.fill();

            if (isPlayer) {
                // Orange helmet with high visibility visor
                ctx.fillStyle = '#ffa502';
                ctx.beginPath();
                ctx.arc(0, -2, 4, 0, Math.PI * 2);
                ctx.fill();
                // Visor glow
                ctx.fillStyle = '#00f2fe';
                ctx.fillRect(-2.5, -4, 5, 2);

                // Cute logo
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 8px Fredoka';
                ctx.textAlign = 'center';
                ctx.fillText('💖', 0, -16);
            } else {
                // Opponent gold helmet
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(0, -2, 4, 0, Math.PI * 2);
                ctx.fill();
                // Visor black
                ctx.fillStyle = '#000';
                ctx.fillRect(-2.5, -4, 5, 2);
            }

            // Rear spoiler wing
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(-22, 21, 44, 6);
            ctx.fillStyle = color;
            ctx.fillRect(-22, 19, 3, 10);
            ctx.fillRect(19, 19, 3, 10);

            ctx.restore();
        }

        // Steer inputs mapping
        window.addEventListener('keydown', (e) => {
            if (f1RacingActive) keyboard[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            if (f1RacingActive) keyboard[e.code] = false;
        });

        // Mouse/Touch slide controls mapping (extremely smooth!)
        function updatePointer(clientX) {
            const rect = canvas.getBoundingClientRect();
            const relativeX = clientX - rect.left;
            // scale coordinate mapping perfectly
            const scale = canvas.width / rect.width;
            targetPlayerX = relativeX * scale;
        }

        canvas.onmousemove = (e) => {
            if (!f1RacingActive) return;
            updatePointer(e.clientX);
        };

        canvas.ontouchstart = (e) => {
            if (!f1RacingActive) return;
            updatePointer(e.touches[0].clientX);
            e.preventDefault();
        };

        canvas.ontouchmove = (e) => {
            if (!f1RacingActive) return;
            updatePointer(e.touches[0].clientX);
            e.preventDefault();
        };

        startBtn.onclick = () => {
            overlay.classList.add('hidden');
            f1RacingActive = true;
            score = 0;
            speed = 0;
            armor = 100;
            playerX = canvas.width / 2;
            targetPlayerX = canvas.width / 2;
            opponents = [];
            collectibles = [];
            boostActive = false;
            boostTimer = 0;
            invulnerableTimer = 0;
            shakeTimer = 0;

            startEngineSound();

            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            gameLoop();
        };

        function gameLoop() {
            if (!f1RacingActive) {
                stopF1EngineSound();
                return;
            }

            // Update parameters
            if (shakeTimer > 0) shakeTimer--;
            if (invulnerableTimer > 0) invulnerableTimer--;

            // Handle keyboard steering
            const steerSensitivity = 8;
            if (keyboard['ArrowLeft'] || keyboard['KeyA']) {
                targetPlayerX -= steerSensitivity;
            }
            if (keyboard['ArrowRight'] || keyboard['KeyD']) {
                targetPlayerX += steerSensitivity;
            }

            // Steering interpolation (smooth glide - sharper and more responsive!)
            playerX += (targetPlayerX - playerX) * 0.25;
            playerX = Math.max(35, Math.min(canvas.width - 35, playerX));

            // Road curving mechanics
            curveTimer--;
            if (curveTimer <= 0) {
                targetTrackCurve = (Math.random() - 0.5) * 140; // road drift factor
                curveTimer = 130 + Math.random() * 100;
            }
            trackCurve += (targetTrackCurve - trackCurve) * 0.02;

            // Handle Off-Road deceleration (Friendly maximum speeds!)
            const playerRoadCenter = getRoadCenter(285);
            const isOffRoad = Math.abs(playerX - playerRoadCenter) > (roadWidth / 2 - 12);
            const targetMaxSpeed = boostActive ? 240 : (isOffRoad ? 55 : 170);

            if (speed < targetMaxSpeed) {
                speed += (boostActive ? 4.0 : 1.2);
            } else if (speed > targetMaxSpeed) {
                speed -= 3.0;
            }

            // Handle Boost
            if (boostActive) {
                boostTimer--;
                if (boostTimer <= 0) {
                    boostActive = false;
                }
            }

            // Track background scroll and distance score calculation (Smoother, calibrated speed)
            scrollOffset += speed * 0.042;
            score += Math.floor(speed * 0.0035);
            scoreEl.textContent = score;
            speedEl.textContent = Math.floor(speed);
            armorEl.textContent = armor;

            // Engine sound Pitch/Volume drift
            updateEnginePitch(speed);

            // Spawning Opponents (Much more friendly spawn rates!)
            opponentSpawnTimer--;
            if (opponentSpawnTimer <= 0) {
                const laneOffset = (Math.random() - 0.5) * (roadWidth - 50);
                const oppColor = ['#00f2fe', '#ffd700', '#c084fc', '#4ade80'][Math.floor(Math.random() * 4)];
                opponents.push({
                    x: getRoadCenter(-50) + laneOffset,
                    y: -50,
                    speed: 60 + Math.random() * 50, // slower opponents
                    laneOffset: laneOffset,
                    color: oppColor
                });
                opponentSpawnTimer = 145 + Math.random() * 110; // larger spawn gap
            }

            // Spawning Collectibles (Spawn slightly more often to assist player!)
            collectibleSpawnTimer--;
            if (collectibleSpawnTimer <= 0) {
                const laneOffset = (Math.random() - 0.5) * (roadWidth - 50);
                const roll = Math.random();
                let type = 'star';
                if (roll < 0.25) type = 'boost';
                else if (roll < 0.55) type = 'heart';

                collectibles.push({
                    x: getRoadCenter(-30) + laneOffset,
                    y: -30,
                    laneOffset: laneOffset,
                    type: type
                });
                collectibleSpawnTimer = 55 + Math.random() * 45;
            }

            // Render Frame
            ctx.save();
            if (shakeTimer > 0) {
                // Screen shake offset on impacts
                const sx = (Math.random() - 0.5) * 8;
                const sy = (Math.random() - 0.5) * 8;
                ctx.translate(sx, sy);
            }

            // Draw Turf (grass background)
            ctx.fillStyle = '#2d7a46';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Road in perspective slices
            const sliceH = 10;
            for (let y = 0; y < canvas.height; y += sliceH) {
                const center = getRoadCenter(y);
                const halfW = roadWidth / 2;

                // Alternate curbs color
                const curbColor = Math.floor((y + scrollOffset) / 25) % 2 === 0 ? '#ff477e' : '#ffffff';

                ctx.fillStyle = curbColor;
                // Left curb
                ctx.fillRect(center - halfW - 8, y, 8, sliceH);
                // Right curb
                ctx.fillRect(center + halfW, y, 8, sliceH);

                // Asphalt
                ctx.fillStyle = '#32323a';
                ctx.fillRect(center - halfW, y, roadWidth, sliceH);

                // Dotted center lines
                if (Math.floor((y + scrollOffset) / 35) % 2 === 0) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(center - 2, y, 4, sliceH);
                }
            }

            // Update and render opponents
            for (let i = opponents.length - 1; i >= 0; i--) {
                const opp = opponents[i];
                // moves down relative to the player
                opp.y += (speed - opp.speed) * 0.05;

                // weave along road trajectory
                const roadC = getRoadCenter(opp.y);
                opp.x += (roadC + opp.laneOffset - opp.x) * 0.08;

                drawF1Car(opp.x, opp.y, opp.color, false);

                // Collision Check
                const dist = Math.hypot(opp.x - playerX, opp.y - 280);
                if (dist < 32) {
                    if (boostActive) {
                        // smash opponent!
                        opponents.splice(i, 1);
                        playCrashSound();
                        triggerConfettiBurst(20, opp.x, opp.y);
                        score += 300;
                        continue;
                    }

                    if (invulnerableTimer <= 0) {
                        armor -= 25;
                        speed = 35; // slow down significantly
                        shakeTimer = 18;
                        invulnerableTimer = 80; // invulnerability frames
                        playCrashSound();
                        opponents.splice(i, 1);

                        if (armor <= 0) {
                            armor = 0;
                            armorEl.textContent = 0;
                            f1RacingActive = false;
                            stopF1EngineSound();
                            triggerConfettiBurst(50, playerX, 280);
                            setTimeout(() => {
                                overlay.querySelector('.overlay-title').innerHTML = "Balapan Selesai! 🏁💔";
                                overlay.querySelector('.overlay-desc').innerHTML = `Hebat sekali! Amara berhasil mencapai jarak <strong>${score} meter</strong> sebelum mesin F1 mengalami overheat! 💕🏎️`;
                                overlay.querySelector('.play-btn').textContent = "Balapan Lagi ⚡";
                                overlay.classList.remove('hidden');
                            }, 500);
                            ctx.restore();
                            return;
                        }
                    }
                }

                // Clean out-of-screen opponents
                if (opp.y > canvas.height + 60 || opp.y < -100) {
                    opponents.splice(i, 1);
                }
            }

            // Update and render collectibles
            for (let i = collectibles.length - 1; i >= 0; i--) {
                const item = collectibles[i];
                item.y += speed * 0.05;

                const roadC = getRoadCenter(item.y);
                item.x += (roadC + item.laneOffset - item.x) * 0.08;

                // Render item
                ctx.save();
                ctx.translate(item.x, item.y);
                if (item.type === 'heart') {
                    ctx.fillStyle = '#ff4b72';
                    ctx.font = 'bold 18px Fredoka';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💖', 0, 0);
                } else if (item.type === 'star') {
                    ctx.fillStyle = '#ffd700';
                    ctx.font = 'bold 17px Fredoka';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('⭐', 0, 0);
                } else if (item.type === 'boost') {
                    ctx.fillStyle = '#00f2fe';
                    ctx.font = 'bold 20px Fredoka';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('⚡', 0, 0);
                }
                ctx.restore();

                // Check pick-up collision
                const dist = Math.hypot(item.x - playerX, item.y - 280);
                if (dist < 26) {
                    if (item.type === 'heart') {
                        armor = Math.min(100, armor + 25);
                        score += 150;
                        playCollectSound(false);
                        triggerConfettiBurst(12, item.x, item.y);
                    } else if (item.type === 'star') {
                        score += 200;
                        playCollectSound(false);
                        triggerConfettiBurst(12, item.x, item.y);
                    } else if (item.type === 'boost') {
                        boostActive = true;
                        boostTimer = 220; // boost cycles
                        invulnerableTimer = 220;
                        speed = 360;
                        playCollectSound(true);
                        triggerConfettiBurst(40, item.x, item.y);
                    }
                    collectibles.splice(i, 1);
                    continue;
                }

                // Clean out-of-screen collectibles
                if (item.y > canvas.height + 40) {
                    collectibles.splice(i, 1);
                }
            }

            // Draw player F1 car
            drawF1Car(playerX, 280, '#ff7300', true);

            // Draw booster aura if active
            if (boostActive) {
                ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#00f2fe';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(playerX, 280, 26, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            ctx.restore();

            animationFrameId = requestAnimationFrame(gameLoop);
        }

        if (resetBtn) {
            resetBtn.onclick = () => {
                f1RacingActive = false;
                stopF1EngineSound();
                overlay.querySelector('.overlay-title').innerHTML = "F1 Grand Prix 🏎️🏁";
                overlay.querySelector('.overlay-desc').innerHTML = "Kendarai mobil F1 pink Amara! Hindari tabrakan dengan mobil rival, kumpulkan bintang & hati, dan ambil ⚡ untuk Turbo Boost!";
                overlay.querySelector('.play-btn').textContent = "Mulai Balapan! 🏎️";
                overlay.classList.remove('hidden');

                // Clear board
                ctx.fillStyle = '#2d7a46';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                score = 0;
                speed = 0;
                armor = 100;
                scoreEl.textContent = 0;
                speedEl.textContent = 0;
                armorEl.textContent = 100;
            };
        }
    }

    // ==========================================================================
    // PREMIUM AURORA DARK MODE INITIALIZER & PROGRESSIVE HANDLER
    // ==========================================================================
    // Load saved preference from localStorage safely and apply to both html and body
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
    } catch (e) { }

    // Add progressive enhancements (chime sound, local storage state saving, sparkles) on click
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark-mode');

            // Save preference to localStorage safely
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (e) { }

            // Trigger a beautiful cosmic chime synth
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                osc.type = 'triangle';
                // E4 (329.63Hz) for dark aurora transition, B4 (493.88Hz) for light transition
                const freq = isDark ? 329.63 : 493.88;

                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.45);
            } catch (e) { }

            // Generate magical burst of sparkles on the cursor physics engine
            try {
                const rect = themeToggle.getBoundingClientRect();
                if (typeof cursorSparkles !== 'undefined' && typeof CursorSparkle !== 'undefined') {
                    for (let i = 0; i < 20; i++) {
                        cursorSparkles.push(new CursorSparkle(
                            rect.left + rect.width / 2 + (Math.random() - 0.5) * 10,
                            rect.top + rect.height / 2 + (Math.random() - 0.5) * 10
                        ));
                    }
                }
            } catch (e) { }
        });
    }

    // ==========================================================================
    // 12. INTERACTIVE SATURN HEART ORBIT ENGINE
    // ==========================================================================
    const saturnArena = document.getElementById('saturnArena');
    const saturnElements = document.getElementById('saturnOrbitElements');
    const orbitCards = document.querySelectorAll('.orbit-element');

    if (saturnArena && saturnElements && orbitCards.length > 0) {
        let currentRotation = 0; // Cumulative angle in radians
        let isDragging = false;
        let startX = 0;
        let dragSpeed = 0.007; // scale drag movement to angles
        let lastX = 0;
        let velocity = 0.0025; // initial ambient velocity (radians per frame)
        let decay = 0.95; // physics slow-down deceleration

        // Define orbit sizing dynamically based on viewport width (Desktop matches 800x300, Mobile matches 400x150)
        let rx = window.innerWidth > 768 ? 360 : 180; // X radius of flat ellipse
        let ry = window.innerWidth > 768 ? 80 : 40;   // Y radius of flat ellipse
        let depthZ = window.innerWidth > 768 ? 160 : 80; // visual depth spacing
        const tiltAngle = -15 * Math.PI / 180; // Tilted by exactly -15 degrees to match the ring tilt

        window.addEventListener('resize', () => {
            rx = window.innerWidth > 768 ? 360 : 180;
            ry = window.innerWidth > 768 ? 80 : 40;
            depthZ = window.innerWidth > 768 ? 160 : 80;
            updateOrbitPositions();
        });

        // Arrange and project cards along the 3D Ellipse
        function updateOrbitPositions() {
            const cosT = Math.cos(tiltAngle);
            const sinT = Math.sin(tiltAngle);

            orbitCards.forEach(card => {
                // Get the starting angle (in degrees) from HTML attribute, converted to radians
                const startAngle = parseFloat(card.getAttribute('data-angle')) * Math.PI / 180;
                // Add the current rotating offset
                const angle = startAngle + currentRotation;

                // 1. Calculate flat ellipse coordinates
                const xFlat = rx * Math.cos(angle);
                const yFlat = ry * Math.sin(angle);

                // 2. Rotate coordinates by tiltAngle (-15deg) in 2D space
                const x = xFlat * cosT - yFlat * sinT;
                const y = xFlat * sinT + yFlat * cosT;

                // 3. Depth Z matches the Y position before rotation
                const sinA = Math.sin(angle);
                const z = depthZ * sinA;

                // 4. Calculate responsive scale and opacity based on depth position
                const scale = 0.8 + (sinA * 0.22); // scale: 0.58 (back) to 1.02 (front)
                const opacity = 0.65 + (sinA * 0.35); // opacity: 0.3 (back) to 1.0 (front)

                // 5. Z-index matches depth: back is 2 to 8, front is 11 to 21 (center heart has z-index 10)
                const zIndex = sinA >= 0 ? (11 + Math.round(sinA * 10)) : (8 + Math.round(sinA * 6));

                // Project flat coordinates using translate3d centered at 50%
                card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) scale(${scale})`;
                card.style.opacity = opacity;
                card.style.zIndex = zIndex;
            });
        }

        // Ambient Auto-Rotation Animation Loop
        function animateOrbit() {
            if (!isDragging) {
                // Ambient slow rotation combined with residual velocity
                currentRotation += velocity;
                // Decay velocity down to slow ambient speed
                velocity = velocity * decay + 0.0015 * (1 - decay);
                updateOrbitPositions();
            }
            requestAnimationFrame(animateOrbit);
        }

        // Initialize position updates & start loop
        updateOrbitPositions();
        requestAnimationFrame(animateOrbit);

        // Pointer (Mouse / Touch) Event Listeners for Drag-To-Spin
        saturnArena.addEventListener('pointerdown', (e) => {
            // Prevent dragging texts/images from triggering browser native drag-drops
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            lastX = e.clientX;
            velocity = 0;
            saturnArena.style.cursor = 'grabbing';
            saturnArena.setPointerCapture(e.pointerId);
        });

        saturnArena.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - lastX;
            lastX = e.clientX;

            // Convert lateral movement to radial spin
            const rotateDelta = deltaX * dragSpeed;
            currentRotation += rotateDelta;
            velocity = rotateDelta; // store drag speed as input velocity

            updateOrbitPositions();
        });

        const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            saturnArena.style.cursor = 'grab';
            saturnArena.releasePointerCapture(e.pointerId);
        };

        saturnArena.addEventListener('pointerup', endDrag);
        saturnArena.addEventListener('pointercancel', endDrag);

        // Handle clicking the YouTube card in the orbit
        const youtubeCard = document.querySelector('.youtube-card');
        if (youtubeCard) {
            let pressX = 0;
            let pressY = 0;
            let pressTime = 0;

            youtubeCard.addEventListener('pointerdown', (e) => {
                pressX = e.clientX;
                pressY = e.clientY;
                pressTime = Date.now();
            });

            youtubeCard.addEventListener('pointerup', (e) => {
                const deltaX = Math.abs(e.clientX - pressX);
                const deltaY = Math.abs(e.clientY - pressY);
                const deltaTime = Date.now() - pressTime;

                // Simple click/tap detection with drag-to-spin tolerance
                if (deltaX < 6 && deltaY < 6 && deltaTime < 300) {
                    const polaroidModal = document.getElementById('polaroidModal');
                    const lightboxImg = document.getElementById('lightboxImg');
                    const lightboxVideo = document.getElementById('lightboxVideo');
                    const lightboxCaption = document.getElementById('lightboxCaption');
                    const lightboxCard = document.querySelector('.lightbox-card');

                    if (polaroidModal && lightboxVideo && lightboxImg && lightboxCaption) {
                        lightboxImg.style.display = 'none';
                        lightboxVideo.style.display = 'none'; // Hide native HTML5 video

                        // Apply portrait styling classes
                        if (lightboxCard) {
                            lightboxCard.classList.add('portrait-video-mode');
                        }

                        // Remove existing dynamic iframe if any
                        const oldIframe = document.getElementById('lightboxIframe');
                        if (oldIframe) oldIframe.remove();

                        // Create Google Drive Embed Iframe for Portrait Video
                        const driveIframe = document.createElement('iframe');
                        driveIframe.id = "lightboxIframe";
                        driveIframe.src = "https://drive.google.com/file/d/1Ob8mc9VQl-hKNmEumIeOQdZ9l2EhG2MC/preview?autoplay=1";
                        driveIframe.style.width = "100%";
                        driveIframe.style.height = "100%";
                        driveIframe.style.border = "none";
                        driveIframe.style.borderRadius = "4px";
                        driveIframe.allow = "autoplay; encrypted-media";
                        driveIframe.setAttribute('allowfullscreen', 'true');

                        // Append the dynamic iframe into the lightbox container
                        const imgContainer = document.querySelector('.lightbox-img-container');
                        if (imgContainer) {
                            imgContainer.appendChild(driveIframe);
                        }

                        // Pause background music if it is initialized and playing
                        if (musicInitialized && !bgAudio.paused) {
                            bgAudio.pause();
                            if (btnPlayPause) {
                                btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
                            }
                        }

                        lightboxCaption.textContent = "Galaksi Cinta Amara 💖";
                        polaroidModal.classList.add('show');

                        // Trigger a sweet confetti burst!
                        if (typeof triggerConfettiBurst === 'function') {
                            triggerConfettiBurst(35);
                        }
                    }
                }
            });
        }

        // Dynamic Space Ornament Generator (Twinkling Stars & Comets)
        const saturnStarsContainer = document.getElementById('saturnStarsContainer');
        const saturnCometContainer = document.getElementById('saturnCometContainer');

        if (saturnStarsContainer) {
            // Spawn 80 stars dynamically with randomized coordinates, sizing, and twinkling animations
            for (let i = 0; i < 80; i++) {
                const star = document.createElement('div');
                star.className = 'saturn-star';

                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const size = Math.random() * 2.2 + 0.8; // size 0.8px to 3px
                const delay = Math.random() * 5;
                const duration = Math.random() * 3 + 2;

                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.animationDelay = `${delay}s`;
                star.style.animationDuration = `${duration}s`;

                // Add soft random colors: white, baby blue, or warm yellow stars
                const colors = ['#ffffff', '#ffffff', '#ffffff', '#e0f2fe', '#fef08a'];
                star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

                saturnStarsContainer.appendChild(star);
            }
        }

        if (saturnCometContainer) {
            // Spawn 3 active comets with staggered delays and diagonal starting trajectories
            for (let i = 0; i < 3; i++) {
                const comet = document.createElement('div');
                comet.className = 'saturn-comet';

                const startX = Math.random() * 50 + 40; // start on the right half
                const startY = Math.random() * 30;       // start on the top portion
                const delay = i * 4 + Math.random() * 2;  // staggered delays (0s, 4s, 8s, etc.)
                const speed = Math.random() * 3 + 5;      // flight speed

                comet.style.right = `${startX}%`;
                comet.style.top = `${startY}%`;
                comet.style.animationDelay = `${delay}s`;
                comet.style.animationDuration = `${speed}s`;

                saturnCometContainer.appendChild(comet);
            }
        }

        // ==========================================================================
        // DYNAMIC J&T EXPRESS REAL-TIME TIMELINE TRACKING SYSTEM
        // ==========================================================================
        const jtTimelineEvents = [
            {
                time: new Date("2026-06-01T16:30:00+07:00"),
                label: "Senin, 1 Juni 2026 - 16:30 WIB",
                title: "Paket Diterima J&T Express 📦",
                desc: "Pengirim menyerahkan paket ke Drop Point origin J&T Medan Cemara Asri. Paket telah diproses (ED_Cemara_Asri5)."
            },
            {
                time: new Date("2026-06-01T19:00:00+07:00"),
                label: "Senin, 1 Juni 2026 - 19:00 WIB",
                title: "Dalam Perjalanan ke Gateway 🚚",
                desc: "Paket sedang diberangkatkan dari Drop Point origin Medan Cemara Asri menuju Gateway Transit Hub Medan."
            },
            {
                time: new Date("2026-06-01T21:30:00+07:00"),
                label: "Senin, 1 Juni 2026 - 21:30 WIB",
                title: "Transit di Gateway Hub Medan Selesai sortir 🏭",
                desc: "Paket telah tiba di pusat sortir J&T Gateway Transit Hub Medan dan dimasukkan ke karung tujuan Jakarta."
            },
            {
                time: new Date("2026-06-02T03:00:00+07:00"),
                label: "Selasa, 2 Juni 2026 - 03:00 WIB",
                title: "Berangkat dari Gateway Medan ke Jakarta ✈️",
                desc: "Paket dibawa ke Bandara Kualanamu dan diberangkatkan menuju Bandara Soekarno-Hatta Jakarta via jalur kargo udara."
            },
            {
                time: new Date("2026-06-02T10:15:00+07:00"),
                label: "Selasa, 2 Juni 2026 - 10:15 WIB",
                title: "Tiba di Gateway Jakarta (Transit) 📦",
                desc: "Paket mendarat di Jakarta dan dibongkar di Gudang Transit Hub Utama Jakarta untuk disortir ulang ke rute Surabaya."
            },
            {
                time: new Date("2026-06-02T16:00:00+07:00"),
                label: "Selasa, 2 Juni 2026 - 16:00 WIB",
                title: "Berangkat dari Gateway Jakarta menuju Surabaya ✈️",
                desc: "Paket telah naik pesawat kargo udara menuju Surabaya (Transit Sidoarjo)."
            },
            {
                time: new Date("2026-06-02T18:30:00+07:00"),
                label: "Selasa, 2 Juni 2026 - 18:30 WIB",
                title: "Tiba di Gateway Surabaya 🏭",
                desc: "Paket mendarat di Bandara Juanda Surabaya dan dibawa ke pusat sortir utama J&T Jawa Timur (Sidoarjo)."
            },
            {
                time: new Date("2026-06-03T01:00:00+07:00"),
                label: "Rabu, 3 Juni 2026 - 01:00 WIB",
                title: "Selesai Disortir & Menuju Gateway Madiun 🚚",
                desc: "Paket dikeluarkan dari karung besar Jawa Timur, dikelompokkan ke wilayah AE (Madiun), lalu dimuat ke dalam truk boks tol Trans-Jawa."
            },
            {
                time: new Date("2026-06-03T05:30:00+07:00"),
                label: "Rabu, 3 Juni 2026 - 05:30 WIB",
                title: "Tiba di Gateway Madiun 🏭",
                desc: "Truk sampai di pusat sortir wilayah Madiun. Paket diturunkan dan dipisahkan lagi ke kecamatan Kartoharjo."
            },
            {
                time: new Date("2026-06-03T09:00:00+07:00"),
                label: "Rabu, 3 Juni 2026 - 09:00 WIB",
                title: "Berangkat dari Gateway Madiun menuju Drop Point Kartoharjo 🚚💨",
                desc: "Paket dibawa dengan mobil boks cabang menuju Drop Point J&T cabang Kartoharjo Madiun."
            },
            {
                time: new Date("2026-06-04T07:30:00+07:00"),
                label: "Kamis, 4 Juni 2026 - 07:30 WIB",
                title: "Tiba di Drop Point Madiun Kartoharjo 🏢",
                desc: "Paket sampai di kantor cabang J&T Kartoharjo terdekat dan langsung disortir untuk rute pengantaran motor kurir."
            },
            {
                time: new Date("2026-06-04T09:00:00+07:00"),
                label: "Kamis, 4 Juni 2026 - 09:00 WIB",
                title: "Sedang Dikirim oleh Kurir Sopandi 🛵💨",
                desc: "Paket sudah dibawa oleh Kurir Sprinter Sopandi di dalam motor kargo J&T dan sedang menuju ke lokasi rumah Amara."
            },
            {
                time: new Date("2026-06-04T13:15:00+07:00"),
                label: "Kamis, 4 Juni 2026 - 13:15 WIB",
                title: "Delivered: Paket Diterima! 🎉🌸",
                desc: "Paket kado ulang tahun dari Valdric telah berhasil diterima oleh Amara dengan selamat. Status pengiriman selesai!"
            }
        ];

        function updateJntTrackingWidget() {
            const jntTimeline = document.getElementById('jntTimeline');
            const jntStatusBubble = document.getElementById('jntStatusBubble');
            const jntHudLocation = document.getElementById('jntHudLocation');
            const jntStatusBanner = document.getElementById('jntStatusBanner');
            const jntStatusBannerText = document.getElementById('jntStatusBannerText');
            const mapCourierNode = document.getElementById('mapCourierNode');

            if (!jntTimeline) return;

            const now = new Date();
            
            // Filter events that have happened
            const activeEvents = jtTimelineEvents.filter(ev => now >= ev.time);
            activeEvents.sort((a, b) => b.time - a.time); // Latest active first

            // Find first pending event
            const pendingEvents = jtTimelineEvents.filter(ev => now < ev.time);
            
            // 1. Update Status Banner
            if (jntStatusBanner && jntStatusBannerText) {
                if (pendingEvents.length > 0) {
                    const nextEv = pendingEvents[0];
                    const opt = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
                    const formattedTime = nextEv.time.toLocaleString('id-ID', opt).replace(',', '') + ' WIB';
                    jntStatusBannerText.textContent = `Status paket akan diperbarui sebelum ${formattedTime}.`;
                    jntStatusBanner.style.display = 'flex';
                } else {
                    jntStatusBanner.style.display = 'none';
                }
            }

            // 2. Render Timeline
            jntTimeline.innerHTML = '';
            if (activeEvents.length > 0) {
                activeEvents.forEach((ev, idx) => {
                    const item = document.createElement('div');
                    item.className = `timeline-item ${idx === 0 ? 'active' : ''}`;
                    item.innerHTML = `
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-time">${ev.label}</div>
                            <div class="timeline-title" style="font-weight: bold; color: var(--dark-text);">${ev.title}</div>
                            <div class="timeline-desc" style="font-size: 11px; margin-top: 4px; color: var(--light-text);">${ev.desc}</div>
                        </div>
                    `;
                    jntTimeline.appendChild(item);
                });
            } else {
                jntTimeline.innerHTML = '<div style="text-align: center; color: var(--light-text); padding: 15px; font-size: 12px;">Menunggu pick-up kargo oleh J&T Express...</div>';
            }

            // 3. Update status bubble and HUD
            if (activeEvents.length > 0) {
                const latest = activeEvents[0];
                
                if (jntStatusBubble) {
                    if (latest.title.includes('Delivered')) {
                        jntStatusBubble.innerHTML = 'Diterima 🎁';
                        jntStatusBubble.style.color = '#2b8a3e';
                        jntStatusBubble.style.background = '#ebfbee';
                    } else if (latest.title.includes('Sedang Dikirim')) {
                        jntStatusBubble.innerHTML = 'Mengirim 🛵';
                        jntStatusBubble.style.color = '#e8590c';
                        jntStatusBubble.style.background = '#fff4e6';
                    } else {
                        jntStatusBubble.innerHTML = 'Sedang Transit 🚚';
                        jntStatusBubble.style.color = '#f08c00';
                        jntStatusBubble.style.background = '#fff9db';
                    }
                }

                if (jntHudLocation) {
                    if (latest.title.includes('Delivered')) {
                        jntHudLocation.textContent = 'Tiba di Rumah Amara 🏡';
                    } else if (latest.title.includes('Madiun')) {
                        jntHudLocation.textContent = 'Transit di Madiun Hub';
                    } else if (latest.title.includes('Surabaya')) {
                        jntHudLocation.textContent = 'Sidoarjo Sorting Hub';
                    } else if (latest.title.includes('Jakarta')) {
                        jntHudLocation.textContent = 'Transit Gateway Jakarta';
                    } else {
                        jntHudLocation.textContent = 'Gateway Hub Medan';
                    }
                }

                // 4. Update GPS courier node transform
                if (mapCourierNode) {
                    if (latest.title.includes('Delivered')) {
                        mapCourierNode.style.animation = 'none';
                        mapCourierNode.setAttribute('transform', 'translate(340, 140)');
                    } else if (latest.title.includes('Madiun')) {
                        mapCourierNode.style.animation = 'none';
                        mapCourierNode.setAttribute('transform', 'translate(295, 115)');
                    } else {
                        mapCourierNode.style.animation = 'courierGpsTravel 20s infinite linear';
                    }
                }
            }
        }

        // Initialize dynamic J&T widget
        updateJntTrackingWidget();
        // Periodically refresh tracking every 30 seconds
        setInterval(updateJntTrackingWidget, 30000);
    }
});

