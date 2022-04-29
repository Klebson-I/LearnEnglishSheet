
class Slider{
    constructor() {
        this.flashArr=document.querySelectorAll('.flash');
        this.flash=document.querySelector('.flashSeries');
        this.next=document.querySelector('.next');
        this.prev=document.querySelector('.prev');
        this.slides=this.flashArr.length;
        this.slideWidth=400;
        this.currentPosition=0;
        this.addListeners();
    }
    addListeners(){
        this.flashArr.forEach(flash=>{
            flash.addEventListener('click',()=>{
                console.log(flash.children)
                for(const child of flash.children){
                    child.classList.toggle("hidden");
                }
            })
        })

        this.next.addEventListener('click',()=>{
            this.moveToLeft();
        })
        this.prev.addEventListener('click',()=>{
            this.moveToRight();
        })
    }
    moveToLeft(){
        if(this.currentPosition>-this.slides*this.slideWidth+this.slideWidth){
            this.currentPosition-=400;
            this.flash.style.left=`${this.currentPosition}px`;
        }
    }
    moveToRight(){
        if(this.currentPosition<0){
            this.currentPosition+=400;
            this.flash.style.left=`${this.currentPosition}px`;
        }
    }
}
new Slider();
