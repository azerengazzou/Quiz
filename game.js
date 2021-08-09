const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));

const progressText=document.getElementById("progressText");
const scoreText=document.getElementById("score");
const progressBarFull=document.getElementById("progress-bar-full");
const loader=document.getElementById("loader");
const game=document.getElementById('game');

let currentQuestion={};
let acceptingAnswers=false;
let score=0;
let questionCounter=0;
let availableQuestions=[];

let questions=[];

fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple")
.then(res=>{
    return res.json();
})
.then(loadedQuestions=>{
    console.log(loadedQuestions.results);
    questions=loadedQuestions.results.map(loadedQuestion=>{
        const formattedQuestion={
        question: loadedQuestion.question
        };

    const answerChoises=[...loadedQuestion.incorrect_answers];
    formattedQuestion.answer=Math.floor(Math.random()*3)+1;
    answerChoises.splice(formattedQuestion.answer -1,
        0,
        loadedQuestions.Correct_answer
    );
    
    answerChoises.forEach((choice,index)=>{
        formattedQuestion["choice"+( index+1 )]=choice;
    });

    return formattedQuestion;
    });
    
    startGame();
})
    .catch(err=>{
        console.log(err);
    });

const CorrectBonus=10;
const Max_Questions=3;

startGame=()=>{
    questionCounter=0;
    score=0;
    availableQuestions=[...questions];
    console.log(availableQuestions);
    
    game.classList.remove('hidden');
    loader.classList.add("hidden");
    getNewQuestion();
};

getNewQuestion=()=>{
    if(availableQuestions.length==0 || questionCounter >= Max_Questions){
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${Max_Questions}`;

    //update the progress bar
    progressBarFull.style.width=`${questionCounter/Max_Questions*100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion=availableQuestions[questionIndex];
    question.innerText=currentQuestion.question;

    choices.forEach(choice=> {
        const number=choice.dataset['number'];
        choice.innerText=currentQuestion["choice"+number];
    });

    availableQuestions.splice(questionIndex,1);
    acceptingAnswers=true;
};

choices.forEach(choice=>{
    choice.addEventListener('click', e=>{
        if(!acceptingAnswers) return ;

        acceptingAnswers=false;
        const selectedChoice=e.target;
        const selectedAnswer=selectedChoice.dataset["number"];

        let classToApply='incorrect';
        if(selectedAnswer == currentQuestion.answer){

            classToApply ='correct';
            score=score+CorrectBonus;
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(()=>{
            
            selectedChoice.parentElement.classList.remove(classToApply);
            scoreText.innerText = score;
            getNewQuestion();
        },1000);
    });
});