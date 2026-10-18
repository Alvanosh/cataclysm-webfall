const canvas = document.getElementById("webCanvas");
const ctx = canvas.getContext("2d");
let W, H, points = [], mouse = {x: innerWidth/2, y: innerHeight/2};

function resize(){
  W = canvas.width = innerWidth * devicePixelRatio;
  H = canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth+"px";
  canvas.style.height = innerHeight+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  points = Array.from({length: 75}, () => ({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    vx:(Math.random()-.5)*.18,
    vy:(Math.random()-.5)*.18,
    r:Math.random()*1.5+.2
  }));
}
resize(); addEventListener("resize",resize);
addEventListener("pointermove",e=>mouse={x:e.clientX,y:e.clientY});

function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of points){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>innerWidth)p.vx*=-1;
    if(p.y<0||p.y>innerHeight)p.vy*=-1;
    const d=Math.hypot(p.x-mouse.x,p.y-mouse.y);
    if(d<160){ctx.strokeStyle=`rgba(124,215,255,${(1-d/160)*.13})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();}
    ctx.fillStyle="rgba(255,39,70,.5)";
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

const typed = document.getElementById("typed");
const lines = [
  "connect --target=unknown",
  "trace --signal=red-thread",
  "inspect --route=/hidden",
  "break --assumption=admin"
];
let li=0;
setInterval(()=>{li=(li+1)%lines.length;typed.textContent=lines[li]},2600);

document.getElementById("intelBtn").onclick=()=>document.getElementById("intel").scrollIntoView({behavior:"smooth"});
document.getElementById("launchBtn").onclick=()=>{
  document.body.animate([{filter:"brightness(1)"},{filter:"brightness(2)"},{filter:"brightness(1)"}],{duration:500});
  document.getElementById("message").textContent='"The web is a map. The map is lying."';
};
document.getElementById("decryptBtn").onclick=(e)=>{
  e.currentTarget.textContent="SIGNAL DECRYPTED";
  document.getElementById("message").textContent='"NODE 07 // TRUST NOTHING THAT INHERITS."';
};
