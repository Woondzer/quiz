fetch('quiz.json')
    .then((response) => response.json())
    .then((data) => new QuizGame(data));


class QuizGame {
    constructor(quizData) {
        this.quizData = quizData.quiz;
        this.selectedQuestions = this.getRandomQuestions(10);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.root = document.getElementById("root");
        this.init();
    }

    init() {
        this.renderStartPage();
    }

    renderStartPage() {
        this.root.innerHTML = `
            <button id="start-btn">Start Game</button>
        `;
        document.getElementById("start-btn").addEventListener("click", () => this.startVideoTransition()); //this.startGame()
    }

    startVideoTransition() {
        this.root.innerHTML = "";
        const intro = document.createElement("video");
        intro.src = "./movie/simpsonNEW.mp4";
        intro.classList.add("intro-background");
        intro.autoplay = true;
        intro.muted = false;
        intro.playsInline = true;

        document.body.appendChild(intro)

        setTimeout(() => {
            intro.classList.add("fade-in");
        }, 100);

        const skipButton = document.createElement("button");
        skipButton.textContent = "Skip";
        skipButton.id = "skip-btn";

        document.body.appendChild(skipButton);

        skipButton.addEventListener("click", () => {
            intro.src = "./movie/simpsonNEWshortVersion.mp4";
            intro.play();
            skipButton.remove();
        });

        intro.addEventListener("ended", () => {
            this.startGame();
            skipButton.remove();
        });
    }

    startGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderQuestion();
    }

    getRandomQuestions(count) {
        const shuffled = [...this.quizData];
        for(let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }

    

    renderQuestion() {
        if (this.currentQuestionIndex >= this.selectedQuestions.length) {
            this.renderEndPage();
            return;
        }
        
        const currentQuestion = this.selectedQuestions[this.currentQuestionIndex];
        let remainingTime = 10;

        this.root.innerHTML = `
            <div class="game-container">
                <div class="question">${currentQuestion.question}</div>
                <div class="timer">Time left: <span id="timer-count">${remainingTime}</span> </div>
                <div class="options">
                    ${currentQuestion.options
                        .map(
                            (option, index) => `<button class="option-btn" data-index="${index}">${option}</button>`
                        )
                        .join("")}
                </div>
                <div class="feedback"></div>
                <div class="score">Score: ${this.score}</div>
            </div>
        `;
        
        this.timer = setInterval(() => {
            remainingTime--;
            document.getElementById('timer-count').textContent = remainingTime;
        
            if (remainingTime <= 0) {
                clearInterval(this.timer); 
                this.handleAnswer(null, currentQuestion.answer); 
            }
        }, 1000);

        this.addOptionListeners(currentQuestion);
    }

    addOptionListeners(question) {
        const buttons = document.querySelectorAll(".option-btn");
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                clearInterval(this.timer);
                const selectedOption = question.options[event.target.dataset.index];
                this.handleAnswer(selectedOption, question.answer);
            });
        });
    }

    handleAnswer(selectedOption, correctAnswer) {
        const feedbackDiv = document.querySelector('.feedback');
        const optionsDiv = document.querySelector('.options')

        if (selectedOption === correctAnswer) {
            this.score++;
            feedbackDiv.textContent = "Correct!";
            setTimeout(() => {
                this.nextQuestion();
            }, 2000);

        } else if(selectedOption === null) {
            feedbackDiv.textContent = `Time's up, the correct answer is: ${correctAnswer}`;
            this.renderNextButton();

        } else {
            feedbackDiv.textContent = `Wrong! The correct answer is: ${correctAnswer}`;
            setTimeout(() => {
                this.nextQuestion();
            }, 2000);
        }
        optionsDiv.querySelectorAll('option-btn').forEach(btn => btn.disabled = true);
    }

    renderNextButton() {
        const feedbackDiv = document.querySelector('.feedback');
        const nextButton = document.createElement('button');
        nextButton.textContent = "Next";
        nextButton.id = "next-btn";
        feedbackDiv.appendChild(nextButton);

        nextButton.addEventListener("click", () => {
            this.nextQuestion();
        });
    }


    nextQuestion() {
        clearInterval(this.timer);
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.selectedQuestions.length) {
            this.renderQuestion();
        } else {
            this.renderEndPage();
        }
    }

    renderEndPage() {
        this.root.innerHTML = `
            <div id="end-container">
                <div class="end-message">Game Over!</div>
                <div class="final-score">Your final score: ${this.score}</div>
                <button id="restart-btn">Restart Game</button>
            </div>
        `;
        document.getElementById("restart-btn").addEventListener("click", () => this.startGame());
    }
}

// fetch('quiz.json')
//     .then((response) => response.json())
//     .then((data) => new QuizGame(data));
