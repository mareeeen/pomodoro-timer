
const audio = document.getElementById('beep');





class App extends React.Component {
  constructor(props) {
    super(props);
    this.loop = undefined;
  }
  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: 'Session',
    isPlaying: false,
    loop: undefined,
    }




  



 handlePlayPause = () => {

 

   const { isPlaying } = this.state;
   
   
   if (isPlaying) {
     clearInterval(this.loop);
     this.setState({isPlaying: false});
     this.setCircleDasharray(); 
     
     
   }
   else {
    this.setState({isPlaying: true});
    this.loop = setInterval(() => { const { clockCount, currentTimer, breakCount, sessionCount } = this.state;
  
    this.setCircleDasharray(); 
   

    

    if(clockCount === 1){
      audio.play();
      
    }
                                   
   if (clockCount === 0){
    this.setBreakDasharray();
    this.setState({
      currentTimer: (currentTimer === 'Session') ? 'Break' : 'Session',
      clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60),
    })
    
     
     
   } else {
       this.setState({clockCount: clockCount - 1});
       }  

      
     }, 1000); 
   } 


 }
 

  
handleReset = () => {
  this.setState({
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: 'Session',
    isPlaying: false
  }),
  clearInterval(this.loop); 
  audio.pause();
  audio.currentTime = 0;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", 283);
}
  

  
  componentWillUnmount() {
    clearInterval(this.loop);
  }
  
  convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    seconds = seconds < 10 ? ('0' + seconds) : seconds;
    return `${minutes}:${seconds}`;
  }
  
  handleBreakDecrease = () => {
    const { breakCount, isPlaying, currentTimer} = this.state;
    
    if (breakCount > 1) {
    
      if(!isPlaying && currentTimer === 'Break'){
      this.setState({
        breakCount: breakCount - 1,
        clockCount: (breakCount - 1) * 60
      })  
      } else {
         this.setState({
      breakCount: breakCount - 1
    });
      }
    }
  }
  
  handleBreakIncrease = () => {
      const { breakCount, isPlaying, currentTimer } = this.state;
    
    if (breakCount < 60){

            if(!isPlaying && currentTimer === 'Break'){
      this.setState({
        breakCount: breakCount + 1,
        clockCount: (breakCount + 1) * 60
      })  
      } else {
         this.setState({
      breakCount: breakCount + 1
    });
      }
    }
   }
  
  handleSessionDecrease = () => {
      const { sessionCount, isPlaying, currentTimer } = this.state;
    
    if(sessionCount > 1){
  
      if(!isPlaying && currentTimer === 'Session'){
      this.setState({
        sessionCount: sessionCount - 1,
        clockCount: (sessionCount - 1) * 60
      })  
      } else {
         this.setState({
      sessionCount: sessionCount - 1
    });
      }
    }
   }
  
  handleSessionIncrease = () => {
      const { sessionCount, isPlaying, currentTimer } = this.state;
    
    if (sessionCount < 60){
  
      if(!isPlaying && currentTimer === 'Session'){
      this.setState({
        sessionCount: sessionCount + 1,
        clockCount: (sessionCount + 1) * 60
      })  
      } else {
         this.setState({
      sessionCount: sessionCount + 1
    });
      }
    }

  }


  //change so that it updates every second//
  
  calculateTimeFraction = () => {
    const { clockCount, sessionCount } = this.state;
    const timeLeft =  clockCount;
    const timeLimit = sessionCount;
    return (timeLeft / timeLimit) / 60;
  }

      
  // Update the dasharray value as time passes, starting with 283
   setCircleDasharray = () => {
    const FULL_DASH_ARRAY = 283;
    const circleDasharray = `${(
      this.calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
   }

   calculateBreakFraction = () => {
    const { clockCount, breakCount } = this.state;
    const timeLeft =  clockCount;
    const timeLimit = breakCount;
    return (timeLeft / timeLimit) / 60;
   }

   setBreakDasharray = () => {
    const FULL_DASH_ARRAY = 283;
    const breakDasharray = `${(
      this.calculateBreakFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", breakDasharray);
   }
  
  
   


  
  
  
  render () {
   
   const {breakCount, sessionCount, clockCount, currentTimer, isPlaying} = this.state;
    




   

    const breakProps = {
    title: 'Break',
     count: breakCount,
     handleDecrease: this.handleBreakDecrease,
     handleIncrease: this.handleBreakIncrease
    } 
    
    const sessionProps = {
    title: 'Session',
     count: sessionCount,
     handleDecrease: this.handleSessionDecrease,
     handleIncrease: this.handleSessionIncrease
    } 
    
    return (
    <div>
        <div className="flex">
          <SetTimer{...sessionProps}/>
          <SetTimer {...breakProps} />
        </div>
        <div className="clock-container">


           <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <g class="base-timer__circle">
               <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />

               <path id="base-timer-path-remaining" stroke-dasharray="283" class="base-timer__path-remaining remainingPathColor" d="M 50, 50m -45, 0a 45,45 0 1,0 90,0a 45,45 0 1,0 -90,0">

               </path>

              </g>
           </svg>


          <div class="label-container">

             <h1 id="timer-label">{currentTimer}</h1>
     

             <span id="time-left">{this.convertToTime(clockCount)}</span>
            
        
          
            <div className="flex">
               <button id="start_stop" onClick={this.handlePlayPause}>
                <i className={`fas fa-${isPlaying ? 'pause': 'play'}`} /></button>
               <button id="reset" onClick={this.handleReset}><i className="fas fa-redo-alt" /></button>
             </div>
           </div>
        </div>
      </div>)
  }


};

const SetTimer = (props) => {
  const id = props.title.toLowerCase();
  
  return(
<div className="timer-container">

  <div className="flex actions-wrapper">
    <button id={`${id}-decrement`} onClick={props.handleDecrease}>
     <i className="fas fa-minus" /></button>
    <span id={`${id}-length`}>{props.count}</span>
    <button id={`${id}-increment`} onClick={props.handleIncrease}><i className="fas fa-plus" /></button>
    
  </div>
  </div>
);
};

if (window.CSS && CSS.supports("color", "var(--bg)")) {
  var toggleColorMode = function toggleColorMode(e) {
    
    if (e.currentTarget.classList.contains("light-hidden")) {
      document.documentElement.setAttribute("color-mode", "light"); 
      localStorage.setItem("color-mode", "light");
      return;
    }
   
    document.documentElement.setAttribute("color-mode", "dark"); 

    localStorage.setItem("color-mode", "dark");
  }; 

  var toggleColorButtons = document.querySelectorAll(".color-mode__btn"); 

  toggleColorButtons.forEach(function(btn) {
    btn.addEventListener("click", toggleColorMode);
  });
} else {
  var btnContainer = document.querySelector(".color-mode__header");
  btnContainer.style.display = "none";
}






ReactDOM.render(<App/>, document.getElementById('app'));