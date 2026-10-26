document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const kategori = params.get("kategori");
  const level = params.get("level");
  const validLevels = ["mudah", "normal", "sulit"];

  // Validasi parameter, setara dengan pengecekan $_GET di kuis.php
  if (
    !kategori ||
    !level ||
    !quizCategories[kategori] ||
    !validLevels.includes(level)
  ) {
    window.location.href = "kategori.html";
    return;
  }

  // Filter pertanyaan sesuai kategori & level
  let filteredQuestions = quizQuestions.filter(function (q) {
    return q.kategori === kategori && q.level === level;
  });

  if (filteredQuestions.length === 0) {
    alert("Tidak ada pertanyaan yang tersedia untuk kategori/level ini.");
    window.location.href = "kategori.html";
    return;
  }

  // Acak urutan pertanyaan (Fisher-Yates)
  for (let i = filteredQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredQuestions[i], filteredQuestions[j]] = [
      filteredQuestions[j],
      filteredQuestions[i],
    ];
  }

  // Info header
  document.getElementById("page-title").textContent =
    "Kuis " + quizCategories[kategori] + " - " + capitalize(level);
  document.getElementById("info-category").textContent =
    "Kategori: " + quizCategories[kategori];
  document.getElementById("info-level").textContent =
    "Level: " + capitalize(level);
  document.getElementById("total-questions").textContent =
    filteredQuestions.length;

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 10;

  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const nextButton = document.getElementById("next-btn");
  const timerElement = document.getElementById("timer");
  const currentQuestionElement = document.getElementById("current-question");
  const backButton = document.querySelector(".back-button");

  if (backButton) {
    backButton.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        confirm("Apakah Anda yakin ingin keluar?\nProgress kuis akan hilang!")
      ) {
        window.location.href = "home.html";
      }
    });
  }

  showQuestion();

  function showQuestion() {
    resetState();

    currentQuestionElement.textContent = currentQuestionIndex + 1;

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.pertanyaan;

    currentQuestion.opsi.forEach(function (option) {
      const button = document.createElement("div");
      button.classList.add("option");
      button.textContent = option;
      button.addEventListener("click", function () {
        selectAnswer(option);
      });
      optionsElement.appendChild(button);
    });

    startTimer();
  }

  function resetState() {
    clearInterval(timer);
    timeLeft = 10;
    timerElement.textContent = timeLeft;

    nextButton.disabled = true;

    while (optionsElement.firstChild) {
      optionsElement.removeChild(optionsElement.firstChild);
    }
  }

  function startTimer() {
    timer = setInterval(function () {
      timeLeft--;
      timerElement.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timer);
        timeUp();
      }
    }, 1000);
  }

  function timeUp() {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    highlightCorrectAnswer(currentQuestion.jawaban);

    const options = document.querySelectorAll(".option");
    options.forEach(function (option) {
      option.style.pointerEvents = "none";
    });

    nextButton.disabled = false;
  }

  function selectAnswer(selectedOption) {
    if (hasAnswered) return;

    hasAnswered = true;
    clearInterval(timer);

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.jawaban;

    const sound = document.getElementById(
      isCorrect ? "sound-correct" : "sound-wrong",
    );

    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(function (error) {
        console.warn("Suara kuis gagal diputar:", error);
      });
    }

    if (isCorrect) {
      score++;
    }

    const options = document.querySelectorAll(".option");
    options.forEach(function (option) {
      if (option.textContent === selectedOption) {
        option.classList.add(isCorrect ? "correct" : "wrong");
      }
      option.style.pointerEvents = "none";
    });

    if (!isCorrect) {
      highlightCorrectAnswer(currentQuestion.jawaban);
    }
  }

  // function selectAnswer(selectedOption) {
  //     clearInterval(timer);

  //     const currentQuestion = filteredQuestions[currentQuestionIndex];
  //     const isCorrect = selectedOption === currentQuestion.jawaban;

  //     const sound = document.getElementById(isCorrect ? 'sound-correct' : 'sound-wrong');
  //     if (sound) {
  //         sound.currentTime = 0;
  //         sound.play().catch(function () { /* autoplay diblokir browser, abaikan */ });
  //     }

  //     if (isCorrect) {
  //         score++;
  //     }

  //     const options = document.querySelectorAll('.option');
  //     options.forEach(function (option) {
  //         if (option.textContent === selectedOption) {
  //             option.classList.add(isCorrect ? 'correct' : 'wrong');
  //         }
  //         option.style.pointerEvents = 'none';
  //     });

  //     if (!isCorrect) {
  //         highlightCorrectAnswer(currentQuestion.jawaban);
  //     }

  //     nextButton.disabled = false;
  // }

  function highlightCorrectAnswer(correctAnswer) {
    const options = document.querySelectorAll(".option");
    options.forEach(function (option) {
      if (option.textContent === correctAnswer) {
        option.classList.add("correct");
      }
    });
  }

  nextButton.addEventListener("click", function () {
    currentQuestionIndex++;

    if (currentQuestionIndex < filteredQuestions.length) {
      showQuestion();
    } else {
      // Simpan hasil ke sessionStorage, menggantikan $_SESSION di hasil.php
      sessionStorage.setItem("quizScore", String(score));
      sessionStorage.setItem("quizTotal", String(filteredQuestions.length));
      window.location.href = "hasil.html";
    }
  });
});
