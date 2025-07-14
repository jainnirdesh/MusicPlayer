// Music Player Application
// Author: Nirdesh Jain
// Project: Modern Web Music Player

class MusicPlayer {
    constructor() {
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'none'; // none, one, all
        this.volume = 0.7;
        this.playlist = [];
        this.shuffledIndices = [];
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadDefaultPlaylist();
        this.initializeTheme();
    }

    initializeElements() {
        // Audio element
        this.audio = document.getElementById('audio-player');
        
        // Control elements
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.repeatBtn = document.getElementById('repeat-btn');
        
        // Progress elements
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.getElementById('progress');
        this.progressHandle = document.getElementById('progress-handle');
        this.currentTimeElement = document.getElementById('current-time');
        this.totalTimeElement = document.getElementById('total-time');
        
        // Volume elements
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeBar = document.querySelector('.volume-bar');
        this.volumeProgress = document.getElementById('volume-progress');
        this.volumeHandle = document.getElementById('volume-handle');
        
        // Song info elements
        this.albumCover = document.getElementById('album-cover');
        this.songTitle = document.getElementById('song-title');
        this.songArtist = document.getElementById('song-artist');
        this.songAlbum = document.getElementById('song-album');
        this.albumArt = document.querySelector('.album-art');
        
        // Playlist elements
        this.playlistContainer = document.getElementById('playlist');
        this.addSongBtn = document.getElementById('add-song-btn');
        this.clearPlaylistBtn = document.getElementById('clear-playlist-btn');
        
        // Modal elements
        this.uploadModal = document.getElementById('upload-modal');
        this.closeModal = document.getElementById('close-modal');
        this.uploadArea = document.getElementById('upload-area');
        this.fileInput = document.getElementById('file-input');
        
        // Theme toggle
        this.themeToggle = document.getElementById('theme-toggle');
    }

    initializeEventListeners() {
        // Control buttons
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.seekTo(e));
        this.progressBar.addEventListener('mousedown', (e) => this.startDragging(e, 'progress'));
        
        // Volume control
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeBar.addEventListener('click', (e) => this.setVolume(e));
        this.volumeBar.addEventListener('mousedown', (e) => this.startDragging(e, 'volume'));
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateSongInfo());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('error', (e) => this.handleError(e));
        
        // Playlist actions
        this.addSongBtn.addEventListener('click', () => this.openUploadModal());
        this.clearPlaylistBtn.addEventListener('click', () => this.clearPlaylist());
        
        // Debug button
        const debugBtn = document.getElementById('debug-btn');
        if (debugBtn) {
            debugBtn.addEventListener('click', () => this.debugInfo());
        }
        
        // Modal events
        this.closeModal.addEventListener('click', () => this.closeUploadModal());
        this.uploadModal.addEventListener('click', (e) => {
            if (e.target === this.uploadModal) this.closeUploadModal();
        });
        this.uploadArea.addEventListener('click', () => {
            console.log('Upload area clicked');
            this.fileInput.click();
        });
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Mouse events for dragging
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.stopDragging());
    }

    loadDefaultPlaylist() {
        // Default playlist with sample songs (using placeholder data)
        const defaultSongs = [
            {
                title: "Sunset Dreams",
                artist: "Ambient Waves",
                album: "Peaceful Moments",
                duration: "3:45",
                src: "",
                cover: "https://via.placeholder.com/300x300/6366f1/ffffff?text=Sunset+Dreams"
            },
            {
                title: "Electric Pulse",
                artist: "Neon Nights",
                album: "Digital Soundscape",
                duration: "4:12",
                src: "",
                cover: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Electric+Pulse"
            },
            {
                title: "Ocean Breeze",
                artist: "Nature Sounds",
                album: "Relaxation Series",
                duration: "5:30",
                src: "",
                cover: "https://via.placeholder.com/300x300/06b6d4/ffffff?text=Ocean+Breeze"
            }
        ];
        
        // Only add default songs if playlist is empty
        if (this.playlist.length === 0) {
            defaultSongs.forEach(song => {
                this.playlist.push(song);
                this.renderPlaylistItem(song, this.playlist.length - 1);
            });
        }
        
        // Set initial volume
        this.setInitialVolume();
    }

    setInitialVolume() {
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
    }

    togglePlayPause() {
        if (this.playlist.length === 0) {
            this.showNotification('Please add songs to your playlist first!', 'warning');
            return;
        }
        
        if (this.isPlaying) {
            this.pauseSong();
        } else {
            this.playSong();
        }
    }

    playSong() {
        const currentSong = this.playlist[this.currentSongIndex];
        if (!currentSong) {
            this.showNotification('No song selected', 'warning');
            return;
        }
        
        if (currentSong.src) {
            console.log('Playing song:', currentSong.title);
            
            // Reset audio element
            this.audio.src = '';
            this.audio.load();
            this.audio.src = currentSong.src;
            
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Audio playing successfully');
                    this.isPlaying = true;
                    this.updatePlayButton();
                    this.updateCurrentSongDisplay();
                    this.albumArt.classList.add('playing');
                    this.showNotification(`Now playing: ${currentSong.title}`, 'success');
                }).catch(error => {
                    console.error('Error playing audio:', error);
                    this.showNotification('Error playing audio file. Please try another file.', 'error');
                    this.isPlaying = false;
                    this.updatePlayButton();
                });
            }
        } else {
            this.showNotification('No audio file available for this song', 'warning');
        }
    }

    pauseSong() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
        this.albumArt.classList.remove('playing');
    }

    previousSong() {
        if (this.playlist.length === 0) return;
        
        if (this.isShuffled) {
            const currentShuffledIndex = this.shuffledIndices.indexOf(this.currentSongIndex);
            const prevIndex = currentShuffledIndex > 0 ? currentShuffledIndex - 1 : this.shuffledIndices.length - 1;
            this.currentSongIndex = this.shuffledIndices[prevIndex];
        } else {
            this.currentSongIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
        }
        
        this.loadCurrentSong();
    }

    nextSong() {
        if (this.playlist.length === 0) return;
        
        if (this.isShuffled) {
            const currentShuffledIndex = this.shuffledIndices.indexOf(this.currentSongIndex);
            const nextIndex = currentShuffledIndex < this.shuffledIndices.length - 1 ? currentShuffledIndex + 1 : 0;
            this.currentSongIndex = this.shuffledIndices[nextIndex];
        } else {
            this.currentSongIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
        }
        
        this.loadCurrentSong();
    }

    loadCurrentSong() {
        if (this.playlist.length === 0) return;
        
        const currentSong = this.playlist[this.currentSongIndex];
        if (currentSong && currentSong.src) {
            this.audio.src = currentSong.src;
            this.updateCurrentSongDisplay();
            this.updatePlaylistSelection();
            
            if (this.isPlaying) {
                this.audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                    this.showNotification('Error playing audio file', 'error');
                });
            }
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active', this.isShuffled);
        
        if (this.isShuffled) {
            this.createShuffledIndices();
            this.showNotification('Shuffle enabled', 'info');
        } else {
            this.showNotification('Shuffle disabled', 'info');
        }
    }

    createShuffledIndices() {
        this.shuffledIndices = [...Array(this.playlist.length).keys()];
        for (let i = this.shuffledIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledIndices[i], this.shuffledIndices[j]] = [this.shuffledIndices[j], this.shuffledIndices[i]];
        }
    }

    toggleRepeat() {
        const modes = ['none', 'one', 'all'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        this.repeatBtn.classList.toggle('active', this.repeatMode !== 'none');
        
        // Update button icon based on repeat mode
        const icon = this.repeatBtn.querySelector('i');
        if (this.repeatMode === 'one') {
            icon.className = 'fas fa-redo';
            this.showNotification('Repeat one enabled', 'info');
        } else if (this.repeatMode === 'all') {
            icon.className = 'fas fa-retweet';
            this.showNotification('Repeat all enabled', 'info');
        } else {
            icon.className = 'fas fa-redo';
            this.showNotification('Repeat disabled', 'info');
        }
    }

    handleSongEnd() {
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.repeatMode === 'all' || this.currentSongIndex < this.playlist.length - 1) {
            this.nextSong();
        } else {
            this.pauseSong();
        }
    }

    seekTo(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audio.duration;
        
        if (isFinite(newTime)) {
            this.audio.currentTime = newTime;
        }
    }

    setVolume(e) {
        const rect = this.volumeBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        
        this.volume = percentage;
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.audio.volume = 0;
            this.volumeBtn.querySelector('i').className = 'fas fa-volume-mute';
        } else {
            this.audio.volume = this.volume;
            this.updateVolumeIcon();
        }
        this.updateVolumeDisplay();
    }

    updateVolumeIcon() {
        const icon = this.volumeBtn.querySelector('i');
        if (this.audio.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (this.audio.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    updateVolumeDisplay() {
        const percentage = this.audio.volume * 100;
        this.volumeProgress.style.width = `${percentage}%`;
        this.updateVolumeIcon();
    }

    updateProgress() {
        if (this.audio.duration) {
            const percentage = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${percentage}%`;
            
            this.currentTimeElement.textContent = this.formatTime(this.audio.currentTime);
            this.totalTimeElement.textContent = this.formatTime(this.audio.duration);
        }
    }

    updateSongInfo() {
        this.updateProgress();
        this.updateCurrentSongDisplay();
    }

    updateCurrentSongDisplay() {
        const currentSong = this.playlist[this.currentSongIndex];
        if (currentSong) {
            this.songTitle.textContent = currentSong.title;
            this.songArtist.textContent = currentSong.artist;
            this.songAlbum.textContent = currentSong.album;
            this.albumCover.src = currentSong.cover;
            this.albumCover.alt = `${currentSong.title} - ${currentSong.artist}`;
        }
        
        this.updatePlaylistSelection();
    }

    updatePlaylistSelection() {
        const playlistItems = this.playlistContainer.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }

    updatePlayButton() {
        const icon = this.playPauseBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    openUploadModal() {
        this.uploadModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeUploadModal() {
        this.uploadModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    handleFileUpload(e) {
        console.log('File upload triggered');
        const files = Array.from(e.target.files);
        console.log('Files selected:', files.length);
        
        // Reset the input value to allow selecting the same file again
        e.target.value = '';
        
        this.processFiles(files);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea.style.backgroundColor = 'var(--border-color)';
        this.uploadArea.style.borderColor = 'var(--primary-color)';
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea.style.backgroundColor = '';
        this.uploadArea.style.borderColor = '';
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Files dropped');
        
        this.uploadArea.style.backgroundColor = '';
        this.uploadArea.style.borderColor = '';
        
        const files = Array.from(e.dataTransfer.files);
        console.log('Dropped files:', files.length);
        
        this.processFiles(files);
    }

    processFiles(files) {
        console.log('Processing files:', files);
        
        if (!files || files.length === 0) {
            this.showNotification('No files selected', 'warning');
            return;
        }

        const audioFiles = files.filter(file => {
            console.log('File type:', file.type, 'Name:', file.name);
            // Check both MIME type and file extension
            return file.type.startsWith('audio/') || 
                   file.name.toLowerCase().match(/\.(mp3|wav|ogg|m4a|aac|flac)$/);
        });
        
        console.log('Audio files found:', audioFiles.length);
        
        if (audioFiles.length === 0) {
            this.showNotification('Please select valid audio files (MP3, WAV, OGG, M4A)', 'warning');
            return;
        }

        let processedCount = 0;
        const totalFiles = audioFiles.length;

        audioFiles.forEach((file, index) => {
            this.addSongToPlaylist(file, () => {
                processedCount++;
                if (processedCount === totalFiles) {
                    this.closeUploadModal();
                    this.showNotification(`Added ${totalFiles} song(s) to playlist`, 'success');
                }
            });
        });
    }

    addSongToPlaylist(file, callback) {
        console.log('Adding song to playlist:', file.name);
        
        try {
            const url = URL.createObjectURL(file);
            const song = {
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                artist: 'Unknown Artist',
                album: 'Unknown Album',
                duration: '0:00',
                src: url,
                cover: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Audio+File',
                file: file // Keep reference to original file
            };
            
            this.playlist.push(song);
            this.renderPlaylistItem(song, this.playlist.length - 1);
            
            // Get duration and metadata for the uploaded file
            const tempAudio = new Audio(url);
            
            tempAudio.addEventListener('loadedmetadata', () => {
                console.log('Audio metadata loaded for:', file.name);
                song.duration = this.formatTime(tempAudio.duration);
                this.updatePlaylistItemDuration(this.playlist.length - 1, song.duration);
                
                // Try to extract metadata if available
                if (tempAudio.title) song.title = tempAudio.title;
                if (tempAudio.artist) song.artist = tempAudio.artist;
                if (tempAudio.album) song.album = tempAudio.album;
                
                // Re-render the playlist item with updated info
                this.renderPlaylist();
                
                if (callback) callback();
            });
            
            tempAudio.addEventListener('error', (e) => {
                console.error('Error loading audio metadata:', e);
                this.showNotification(`Error loading ${file.name}`, 'error');
                
                // Remove the failed song from playlist
                const index = this.playlist.indexOf(song);
                if (index > -1) {
                    this.playlist.splice(index, 1);
                    this.renderPlaylist();
                }
                
                if (callback) callback();
            });
            
            // Set a timeout to prevent hanging
            setTimeout(() => {
                if (song.duration === '0:00') {
                    song.duration = 'Unknown';
                    this.updatePlaylistItemDuration(this.playlist.length - 1, song.duration);
                    if (callback) callback();
                }
            }, 3000);
            
            // If this is the first song, load it
            if (this.playlist.length === 1) {
                this.currentSongIndex = 0;
                setTimeout(() => this.loadCurrentSong(), 100);
            }
            
        } catch (error) {
            console.error('Error adding song to playlist:', error);
            this.showNotification(`Error adding ${file.name}`, 'error');
            if (callback) callback();
        }
    }

    renderPlaylistItem(song, index) {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.innerHTML = `
            <div class="playing-indicator" style="display: none;">
                <i class="fas fa-volume-up"></i>
            </div>
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
            <button class="remove-btn" onclick="musicPlayer.removeSong(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        playlistItem.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-btn') && !e.target.classList.contains('fas')) {
                this.currentSongIndex = index;
                this.loadCurrentSong();
                if (!this.isPlaying) {
                    this.playSong();
                }
            }
        });
        
        this.playlistContainer.appendChild(playlistItem);
    }

    updatePlaylistItemDuration(index, duration) {
        const playlistItems = this.playlistContainer.querySelectorAll('.playlist-item');
        if (playlistItems[index]) {
            const durationElement = playlistItems[index].querySelector('.song-duration');
            durationElement.textContent = duration;
        }
    }

    removeSong(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        // Revoke object URL if it exists
        if (this.playlist[index].src.startsWith('blob:')) {
            URL.revokeObjectURL(this.playlist[index].src);
        }
        
        this.playlist.splice(index, 1);
        this.renderPlaylist();
        
        // Adjust current song index
        if (this.currentSongIndex >= index) {
            this.currentSongIndex = Math.max(0, this.currentSongIndex - 1);
        }
        
        // If playlist is empty, reset player
        if (this.playlist.length === 0) {
            this.resetPlayer();
        } else {
            this.loadCurrentSong();
        }
        
        this.showNotification('Song removed from playlist', 'info');
    }

    clearPlaylist() {
        if (this.playlist.length === 0) return;
        
        // Revoke all object URLs
        this.playlist.forEach(song => {
            if (song.src.startsWith('blob:')) {
                URL.revokeObjectURL(song.src);
            }
        });
        
        this.playlist = [];
        this.currentSongIndex = 0;
        this.renderPlaylist();
        this.resetPlayer();
        this.showNotification('Playlist cleared', 'info');
    }

    renderPlaylist() {
        this.playlistContainer.innerHTML = '';
        this.playlist.forEach((song, index) => {
            this.renderPlaylistItem(song, index);
        });
        this.updatePlaylistSelection();
    }

    resetPlayer() {
        this.pauseSong();
        this.audio.src = '';
        this.songTitle.textContent = 'Select a Song';
        this.songArtist.textContent = 'Unknown Artist';
        this.songAlbum.textContent = 'Unknown Album';
        this.albumCover.src = 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=No+Song';
        this.progress.style.width = '0%';
        this.currentTimeElement.textContent = '0:00';
        this.totalTimeElement.textContent = '0:00';
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('musicPlayerTheme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.dataset.theme || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.body.dataset.theme = theme;
        localStorage.setItem('musicPlayerTheme', theme);
        
        const icon = this.themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Debug function to help troubleshoot
    debugInfo() {
        console.log('=== Music Player Debug Info ===');
        console.log('Playlist length:', this.playlist.length);
        console.log('Current song index:', this.currentSongIndex);
        console.log('Is playing:', this.isPlaying);
        console.log('Audio src:', this.audio.src);
        console.log('Audio duration:', this.audio.duration);
        console.log('Audio current time:', this.audio.currentTime);
        console.log('Audio volume:', this.audio.volume);
        console.log('Audio ready state:', this.audio.readyState);
        console.log('Audio network state:', this.audio.networkState);
        console.log('Current song:', this.playlist[this.currentSongIndex]);
        console.log('==============================');
    }

    // Drag functionality
    startDragging(e, type) {
        e.preventDefault();
        this.isDragging = true;
        this.dragType = type;
        
        if (type === 'progress') {
            this.seekTo(e);
        } else if (type === 'volume') {
            this.setVolume(e);
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        if (this.dragType === 'progress') {
            this.seekTo(e);
        } else if (this.dragType === 'volume') {
            this.setVolume(e);
        }
    }

    stopDragging() {
        this.isDragging = false;
        this.dragType = null;
    }

    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSong();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.volume = Math.min(1, this.volume + 0.1);
                this.audio.volume = this.volume;
                this.updateVolumeDisplay();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.volume = Math.max(0, this.volume - 0.1);
                this.audio.volume = this.volume;
                this.updateVolumeDisplay();
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'KeyS':
                e.preventDefault();
                this.toggleShuffle();
                break;
            case 'KeyR':
                e.preventDefault();
                this.toggleRepeat();
                break;
        }
    }

    // Error handling
    handleError(e) {
        console.error('Audio error:', e);
        this.showNotification('Error loading audio file', 'error');
        this.pauseSong();
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface-color);
            color: var(--text-primary);
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: var(--shadow-medium);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            border-left: 4px solid ${this.getNotificationColor(type)};
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    getNotificationColor(type) {
        switch(type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#6366f1';
        }
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
