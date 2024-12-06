export default class FullscreenHandler {
    constructor() {
        this.isPhone = this.checkIfPhone(); // Detect if the device is a phone
        this.isLandscape = false;
        this.fullscreenButton = null;
        this.startGameButton = null;

        if (this.isPhone) {
            this.renderRotateMessage();
            this.attachOrientationListener();
            this.addFullscreenChangeListener();
        } else {
            this.renderStartGameButton(true);
        }
    }

    checkIfPhone() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return width <= 853 && height <= 1280; // Adjust resolution threshold as needed
    }

    renderRotateMessage() {
        const rotateMessage = document.createElement("div");
        rotateMessage.id = "rotate-message";
        rotateMessage.textContent = "Please rotate your phone for the best experience";
        document.body.appendChild(rotateMessage);
    }

    attachOrientationListener() {
        window.addEventListener("resize", () => this.handleOrientationChange());
        this.handleOrientationChange(); // Initial orientation handling
    }

    handleOrientationChange() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const rotateMessage = document.getElementById("rotate-message");

        if (width > height) {
            // Landscape mode
            this.isLandscape = true;
            rotateMessage?.remove();

            // Only render the fullscreen button if not in fullscreen
            if (!document.fullscreenElement) {
                this.renderFullscreenButton();
            }
            this.renderStartGameButton(true);
        } else {
            // Portrait mode
            this.isLandscape = false;

            if (this.fullscreenButton) {
                this.fullscreenButton.style.display = "none"; // Hide the fullscreen button in portrait mode
            }
            this.renderStartGameButton(false);

            if (!rotateMessage) {
                this.renderRotateMessage(); // Show the rotate message
            }
        }
    }

    renderFullscreenButton() {
        if (!this.fullscreenButton) {
            this.fullscreenButton = document.createElement("button");
            this.fullscreenButton.id = "fullscreen-btn";
            this.fullscreenButton.textContent = "Go Fullscreen";
            document.body.appendChild(this.fullscreenButton);

            this.fullscreenButton.addEventListener("click", () => this.enterFullscreen());
        }

        this.fullscreenButton.style.display = "block"; // Ensure the button is visible
    }

    renderStartGameButton(show) {
        this.startGameButton = document.getElementById("start-btn");
        if (!this.startGameButton) return;

        if (!this.isPhone) {
            this.startGameButton.style.display = "block";
            return;
        }

        this.startGameButton.style.display = show ? "block" : "none";
    }

    enterFullscreen() {
        const docElement = document.documentElement;
        if (docElement.requestFullscreen) {
            docElement.requestFullscreen();
        } else if (docElement.webkitRequestFullscreen) {
            docElement.webkitRequestFullscreen(); // Safari
        } else if (docElement.msRequestFullscreen) {
            docElement.msRequestFullscreen(); // IE11
        }

        if (this.fullscreenButton) {
            this.fullscreenButton.style.display = "none"; // Hide the fullscreen button
        }
        this.renderExitFullscreenButton();
    }

    renderExitFullscreenButton() {
        const exitFullscreenButton = document.createElement("button");
        exitFullscreenButton.id = "exit-fullscreen-btn";
        exitFullscreenButton.textContent = "Exit Fullscreen";
        document.body.appendChild(exitFullscreenButton);

        exitFullscreenButton.addEventListener("click", () => this.exitFullscreen(exitFullscreenButton));
    }

    exitFullscreen(button) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        button.remove();

        // Restore the fullscreen button based on the current orientation and fullscreen state
        if (this.isLandscape && this.isPhone && !document.fullscreenElement) {
            this.renderFullscreenButton();
        }
    }

    addFullscreenChangeListener() {
        document.addEventListener("fullscreenchange", () => {
            if (document.fullscreenElement) {
                // Hide the fullscreen button while in fullscreen
                if (this.fullscreenButton) {
                    this.fullscreenButton.style.display = "none";
                }
            } else if (this.isPhone && this.isLandscape) {
                // Re-render the fullscreen button when exiting fullscreen in landscape mode
                if (!this.fullscreenButton) {
                    this.renderFullscreenButton();
                } else {
                    this.fullscreenButton.style.display = "block";
                }
            }
        });
    }
}
