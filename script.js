(function(){
  var grid=document.getElementById('grid'),scoreEl=document.getElementById('score'),timeEl=document.getElementById('time'),
      bestEl=document.getElementById('best'),msg=document.getElementById('msg'),startBtn=document.getElementById('start');
  var tiles=[],score=0,time=30,best=0,running=false,tick=null,spawn=null;
  try{best=parseInt(localStorage.getItem('m666best'),10)||0}catch(e){}
  bestEl.textContent=best;
  for(var i=0;i<9;i++){
    var b=document.createElement('button');
    b.className='tile';b.type='button';b.setAttribute('aria-label','Tile');b.textContent='';
    b.addEventListener('click',onTap);grid.appendChild(b);tiles.push(b);
  }
  function clear(t){t.className='tile';t.textContent='';delete t.dataset.v}
  function onTap(e){
    var t=e.currentTarget;if(!running||!t.dataset.v)return;
    var v=t.dataset.v;score+=v==='6'?1:-1;if(score<0)score=0;
    scoreEl.textContent=score;
    if(v==='6'){t.className='tile hit';t.textContent='+1'}else{t.textContent='−1'}
    delete t.dataset.v;
    setTimeout(function(){if(!t.dataset.v)clear(t)},250);
  }
  function show(){
    if(!running)return;
    var free=tiles.filter(function(t){return !t.dataset.v&&t.textContent===''});
    if(free.length){
      var t=free[Math.floor(Math.random()*free.length)];
      var is6=Math.random()<0.65;
      t.dataset.v=is6?'6':'9';t.textContent=is6?'6':'9';t.className='tile '+(is6?'six':'nine');
      var life=Math.max(450,1000-(30-time)*18);
      setTimeout(function(){if(t.dataset.v){clear(t)}},life);
    }
    spawn=setTimeout(show,Math.max(280,700-(30-time)*14));
  }
  function end(){
    running=false;clearInterval(tick);clearTimeout(spawn);
    tiles.forEach(clear);
    if(score>best){best=score;bestEl.textContent=best;try{localStorage.setItem('m666best',best)}catch(e){}
      msg.textContent='New best: '+score+'! Play again?'}
    else msg.textContent='Time’s up. You scored '+score+'. Play again?';
    startBtn.textContent='Play again';
  }
  function start(){
    if(running)return;
    score=0;time=30;scoreEl.textContent=0;timeEl.textContent=30;running=true;
    msg.textContent='Tap the 6s, skip the 9s!';
    tick=setInterval(function(){time--;timeEl.textContent=time;if(time<=0)end()},1000);
    show();
  }
  startBtn.addEventListener('click',function(){start();document.querySelector('.game').scrollIntoView({behavior:'smooth',block:'center'})});
})();
