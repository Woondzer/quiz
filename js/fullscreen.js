export default class FullscreenHandler {
    constructor() {
        this.isPhone = this.checkIfPhone(); 
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


    // values for what screens to handle as "phones"
    checkIfPhone() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return width <= 853 && height <= 1280; 
    }

    renderRotateMessage() {
        const rotateMessage = document.createElement("div");
        rotateMessage.id = "rotate-message";
        rotateMessage.textContent = "Please rotate your phone to start the game!";
        document.body.appendChild(rotateMessage);
    }

    attachOrientationListener() {
        window.addEventListener("resize", () => this.handleOrientationChange());
        this.handleOrientationChange(); 
    }

    handleOrientationChange() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const rotateMessage = document.getElementById("rotate-message");

        if (width > height) {
            // Landscape mode
            this.isLandscape = true;
            rotateMessage?.remove();

            //only render if not in fullscreen
            if (!document.fullscreenElement) {
                this.renderFullscreenButton();
            }
            this.renderStartGameButton(true);
        } else {
            // Portrait mode
            this.isLandscape = false;

            if (this.fullscreenButton) {
                this.fullscreenButton.style.display = "none"; 
            }
            this.renderStartGameButton(false);

            if (!rotateMessage) {
                this.renderRotateMessage();
            }
        }
    }

    renderFullscreenButton() {
        if (!this.fullscreenButton) {
            this.fullscreenButton = document.createElement("button");
            this.fullscreenButton.id = "fullscreen-btn";
            this.fullscreenButton.innerHTML = `
            <?xml version="1.0" ?><!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
            <svg height="20px" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="20px" 
                 xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Layer_1"/>
                <g id="fullscreen_x5F_alt">
                    <g>
                        <polygon points="29.414,26.586 22.828,20 20,22.828 26.586,29.414 24,32 32,32 32,24" style="fill:#FFFFFF;"/>
                        <polygon points="2.586,5.414 9.172,12 12,9.172 5.414,2.586 8,0 0,0 0,8" style="fill:#FFFFFF;"/>
                        <polygon points="26.586,2.586 20,9.172 22.828,12 29.414,5.414 32,8 32,0 24,0" style="fill:#FFFFFF;"/>
                        <polygon points="12,22.828 9.172,20 2.586,26.586 0,24 0,32 8,32 5.414,29.414" style="fill:#FFFFFF;"/>
                    </g>
                </g>
            </svg>
        `;
            document.body.appendChild(this.fullscreenButton);

            this.fullscreenButton.addEventListener("click", () => this.enterFullscreen());
            this.fullscreenButton.addEventListener("touchend", (event) => { //this is added for test iOS full screen functionality
                event.preventDefault();
                this.enterFullscreen();
            });
        }

        this.fullscreenButton.style.display = "block"; 
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
        const docElement = document.getElementById('root') || document.documentElement; //document.getELementByID('root') is test for iOS fullscreen functionality
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
        exitFullscreenButton.innerHTML = `
        <?xml version="1.0" ?><!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
        <svg height="20px" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="20px" 
             xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Layer_1"/>
            <g id="fullscreen_x5F_exit_x5F_alt">
                <g>
                    <polygon points="22.586,25.414 29.172,32 32,29.172 25.414,22.586 28,20 20,20 20,28" style="fill:#FFFFFF;"/>
                    <polygon points="6.547,9.371 4,12 11.961,11.957 12,4 9.375,6.543 2.828,0 0,2.828" style="fill:#FFFFFF;"/>
                    <polygon points="0,29.172 2.828,32 9.414,25.414 12,28 12,20 4,20 6.586,22.586" style="fill:#FFFFFF;"/>
                    <polygon points="28.031,12 25.438,9.404 32,2.838 29.164,0 22.598,6.566 20,3.971 20,12" style="fill:#FFFFFF;"/>
                </g>
            </g>
        </svg>
    `;
        document.body.appendChild(exitFullscreenButton);

        exitFullscreenButton.addEventListener("click", () => this.exitFullscreen(exitFullscreenButton));
        exitFullscreenButton.addEventListener("touchend", (event) => {  //this is added for test iOS full screen functionality
            event.preventDefault();
            this.exitFullscreen(exitFullscreenButton);
        })
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

        // Restore the fullscreen button
        if (this.isLandscape && this.isPhone && !document.fullscreenElement) {
            this.renderFullscreenButton();
        }
    }

    addFullscreenChangeListener() {
        document.addEventListener("fullscreenchange", () => {
            if (document.fullscreenElement) {
                if (this.fullscreenButton) {
                    this.fullscreenButton.style.display = "none";
                }
            } else if (this.isPhone && this.isLandscape) {
                if (!this.fullscreenButton) {
                    this.renderFullscreenButton();
                } else {
                    this.fullscreenButton.style.display = "block";
                }
            }
        });
    }
}
