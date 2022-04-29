
const addSentenceButton=document.querySelector('.addSentenceButton');
const removeSentenceButton=document.querySelector('.removeSentenceButton');
const sentencesDiv=document.querySelector('.singleArea');

addSentenceButton.addEventListener('click',(e)=>{
    e.preventDefault();
    const input=document.createElement('input');
    input.type="text";
    input.setAttribute("name","sentences");
    input.classList.add('singleSentenceInput');
    sentencesDiv.append(input);
    console.log(e);
})
removeSentenceButton.addEventListener('click',(e)=>{
    e.preventDefault();
    const elements=document.querySelectorAll('.singleSentenceInput');
    console.log(elements);
    elements[elements.length-1].remove();
})





