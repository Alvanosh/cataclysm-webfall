const terminal = document.getElementById("terminal");
const enter = document.getElementById("enter");

enter.addEventListener("click", async () => {
  enter.disabled = true;
  const lines = [
    "$ connect webfall",
    "> negotiating relay...",
    "> reading public node...",
    "> checking pulse..."
  ];

  terminal.textContent = lines.join("\n");

  try {
    const r = await fetch("/api/pulse");
    const data = await r.json();

    terminal.textContent +=
      `\n> relay ............... ${data.status.toUpperCase()}` +
      `\n> trace ............... ${data.trace}` +
      `\n> archive ............. UNKNOWN` +
      `\n> diagnostic .......... UNKNOWN` +
      `\n> terminal ............ LOCKED` +
      `\n\n> Something is missing.`;
  } catch {
    terminal.textContent += "\n> relay unreachable.";
  }

  enter.disabled = false;
});

const canvas = document.getElementById("web");
const ctx = canvas.getContext("2d");
let w, h, points=[];

function resize(){
  w=canvas.width=innerWidth*devicePixelRatio;
  h=canvas.height=innerHeight*devicePixelRatio;
  ctx.scale(devicePixelRatio,devicePixelRatio);
  points=Array.from({length:42},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}));
}
addEventListener("resize",resize);
resize();

function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of points){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>innerWidth)p.vx*=-1;
    if(p.y<0||p.y>innerHeight)p.vy*=-1;
    ctx.fillStyle="rgba(255,36,72,.45)";
    ctx.fillRect(p.x,p.y,2,2);
  }
  for(let i=0;i<points.length;i++){
    for(let j=i+1;j<points.length;j++){
      const a=points[i],b=points[j];
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<145){
        ctx.strokeStyle=`rgba(255,36,72,${(1-d/145)*.18})`;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();
