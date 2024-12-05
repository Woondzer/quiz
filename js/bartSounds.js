export default class BartSounds {
    constructor(volume = 0.2) {
        this.winSounds = [];
        this.loseSounds = [];
        this.volume = volume;
        this.loadSounds();
    }

    loadSounds() {
        this.winSounds = [
            "./sound/win/bart-win1.mp3",
            "./sound/win/bart-win2.wav",
            "./sound/win/bart-win3.wav",
            "./sound/win/bart-win4.mp3",
            "./sound/win/bart-win5.mp3",
        ];

        this.loseSounds = [
            "./sound/lose/bart-lose1.mp3",
            "./sound/lose/bart-lose2.wav",
            "./sound/lose/bart-lose3.wav",
            "./sound/lose/bart-lose4.wav",
            "./sound/lose/bart-lose5.mp3",
        ];
    }

    playRandomSounds(soundArray) {
        const randomIndex = Math.floor(Math.random() * soundArray.length);
        const audio = new Audio(soundArray[randomIndex]);
        audio.volume = this.volume;
        audio.play();
    }

    playWinSound() {
        this.playRandomSounds(this.winSounds)
    }

    playLoseSound() {
        this.playRandomSounds(this.loseSounds)
    }
}