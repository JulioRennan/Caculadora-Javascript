class CalcController{
    constructor(){
        this._operation=[]
        this._audio = new Audio('click.mp3')
        this._audioOnOff = true;
        this._operationDisplay = []
        this._lastNumOndisplay = "0";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate ;
        this._locale = 'pt-BR'
        this.initialize();
 
    }
    copyToClipBoard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy')
        input.remove()
    }
    pasteFromClipBoard(){
        document.addEventListener('paste',e=>{
            let text = e.clipboardData.getData('Text');
            console.log(text)
            if(!isNaN(text)){
                text = parseFloat(text)
                if(!isNaN(this.getLastOperation)){
                    this._operation[this._operation.length-1] = text
                }else{
                    this._operation.push(text)
                   
                }
                this.setLastNumOnDysplay();
            }
           
        })
    }
    togleAudio(){
        this._audioOnOff!=this._audioOnOff;
    }

    playAudio(){


        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play()
        
        }
    }
  
    initialize(){
       this.setDisplayDateTime();
       this.initButtonsEvents();
       this.initKeyBoard();
       this.setLastNumOnDysplay();
       this.pasteFromClipBoard()
        let interval = setInterval(()=>{
           this.setDisplayDateTime();
        }, 1000);
        /*setTimeout(()=>{
          clearInterval(interval)
        },5000);*/

    }



    addEventListenerAll(element,events,fn){
        
        events.split(' ').forEach((ev,index)=>{
   
           element.addEventListener(ev,fn,false);
        });
    }

    clearAll(){
        this._operation = [];
        this.setLastNumOnDysplay()
   
    }
    clearEntry(){
        this._operation.pop();
        if(this._operation.length>1){
            this._operation.pop()
        }
        this.setLastNumOnDysplay()
    }
    isOperator(value){
        if(['+','-','*','%','/'].indexOf(value)>-1){return true;}
        return false;
    }
    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }
    pushOperation(value){
        if(value == "="){
            console.log(this._operation.length)
            if(this._operation.length==2){
                
                this._operation.push(this._operation[0])
                this.calc()
            }else if(this._operation.length>1){

              
                this.calc()
            }
            return
        }
        if(this._operation.length>=3){
            if(value=="%"){
                    this._operation[2]=(this._operation[2]/100)*this._operation[0];
                    
                  
                    this.calc();
                    return
            }else{
                this.calc();
                
            }
           
        }
        this._operation.push(value);
        
    }
    calc(){
        
        this._operation[0] = eval(this._operation.slice(0,3).join(''));
        this._operation.pop()
        this._operation.pop()
        this.displayCalc = this._operation[0]
    }

    initKeyBoard(){
        document.addEventListener('keyup',e=>{
            let tecla = e.key
            if(tecla =='c'){
                if(e.ctrlKey){
                    tecla = 'copy'       
                }
            }
         
            this.execButtons(tecla)
        });
    }

    addOperator(value){
       
        if(this._operation.length==0){
            if(value!="." && !this.isOperator(value))
            this.pushOperation(value.toString());
            this._lastNumOndisplay = value.toString()
          
        }else{
            let lastOperator = this.getLastOperation()
            if(isNaN(value) && value!="."){
                if(this.isOperator(lastOperator)&&value!='='){
                    this.setLastOperation(value)
                }else{
              
                    this.pushOperation(value);
                }
            }else{
                if(this.isOperator(lastOperator)){
                    this.pushOperation(value.toString())
             
                }else if(value == '.'){
                    if(lastOperator.indexOf('.')==-1){
                        this.setLastOperation(lastOperator+value)
                    }
                }
                else{
                    this.setLastOperation(lastOperator+value.toString())
                }
            }
        }
        this.setLastNumOnDysplay();
        console.log(this._operation)
    }
    setLastNumOnDysplay(){
        if(this._operation.length == 0 ){
            this.displayCalc = '0';
            return;
        }

        let lastNum = this.getLastOperation().toString();
        if(lastNum.length>10){
            this.setError();
            this._operation();
            
        }
        if(!isNaN(lastNum)){
            this.displayCalc = lastNum
        }
        
    }
    setError(){
        this.displayCalc = "Error";
    }

    getLastOperation(){
        let  last = this._operation[this._operation.length-1];
        
        return last; 
        
    }
    execButtons(value){
        this.playAudio()
        let mapKeyBtns = {
            'Enter':'igual',
            'Escape':'ac',
            'Backspace':'ce',
            '+':'soma',
            '-':'subtracao',
            '*':'multiplicacao',
            '/':'divisao',
            '%':'porcento',
            '.':'ponto',
            '=':'igual',
            'c':'copy'
        }
        let isKeyValue = mapKeyBtns[value]
        if(isKeyValue!=undefined){
            value = isKeyValue;
        }

        switch(value){
            case 'copy':
                this.copyToClipBoard();
                break;
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperator('+')
                break;
            case 'subtracao':
                this.addOperator('-')
                break;
            case 'multiplicacao':
                this.addOperator('*')
                break;
            case   'divisao' :
                this.addOperator('/')
                break;
            case 'porcento':
                this.addOperator('%')
                break;
            case 'ponto' :
                this.addOperator('.')
                break;
            case 'igual':
                this.addOperator('=')
                break;
            
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperator(parseInt(value))
                break;
            default:
                console.log("tecla nao mapeada")
                break;


        }
    }
    
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn,index)=>{
            this.addEventListenerAll(btn,'click drag',e=>{
               
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execButtons(textBtn);
                this.setLastNumOnDysplay();
            })
            this.addEventListenerAll(btn,"mouseover mouseup mousedown",e=>{
                btn.style.cursor = "pointer";
            })
        })
   

    }
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day:"2-digit",
            month:"long",
            year:"numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayTime(valor){
        this._timeEl.innerHTML=valor;
    }
    set displayDate(valor){
        this._dateEl.innerHTML=valor;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(valor){
        this._displayCalcEl.innerHTML = valor;
    }
    get currentDate(){
        return new Date();
    }


    set currentDate(valor){
        this._currentDate = valor;
    }
}