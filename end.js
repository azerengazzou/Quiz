const username=document.getElementById("username");
const saveScoreBtn=document.getElementById("saveScoreBtn");
const finalScore=document.getElementById("finalScore");
const mostRecentScore=localStorage.getItem('mostRecentScore');


const highScore=JSON.parse(localStorage.getItem("highScores")) || [];
console.log(highScore);
console.log(JSON.parse(localStorage.getItem("highScores")));
finalScore.innerText=mostRecentScore;


username.addEventListener('keyup',()=>{
    saveScoreBtn.disabled= !username.value;
});

saveHighScore=e=>{
    console.log("clicked the save btn");
    e.preventDefault();

    const score={
        score: mostRecentScore,
        name: username.value
    };
    highScore.push(score);
    highScore.sort((a,b)=>b.score=a.score);
    highScore.splice(5);
    console.log(highScore);

    localStorage.setItem('highScores',JSON.stringify(highScore));
    window.location.assign("/");

}