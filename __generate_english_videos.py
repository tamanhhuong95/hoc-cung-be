import http.server
import pathlib
import shutil
import subprocess
import tempfile
import threading
import uuid

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "assets" / "english-grade-1" / "videos"
PAGE = ROOT / "__video-renderer.html"
PROFILE = pathlib.Path(tempfile.gettempdir()) / f"hoc-cung-be-video-{uuid.uuid4().hex}"
CHROME = pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
PORT = 8771

HTML = r'''<!doctype html><meta charset="utf-8"><title>English video renderer</title><canvas width="960" height="540"></canvas><pre id="status">starting</pre><script>
const canvas = document.querySelector("canvas"), ctx = canvas.getContext("2d"), status = document.querySelector("#status");
const W = canvas.width, H = canvas.height, fps = 12;
const clips = [
  { file: "en-37-help.webm", duration: 13, draw: help },
  { file: "en-25-classroom.webm", duration: 12, draw: classroom },
  { file: "en-27-places.webm", duration: 13, draw: places },
  { file: "en-29-weather.webm", duration: 14, draw: weather },
];
const ease = (value) => { value = Math.max(0, Math.min(1, value)); return value * value * (3 - 2 * value); };
function roundRect(x,y,w,h,r,fill,stroke="") { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill(); if(stroke){ctx.lineWidth=5;ctx.strokeStyle=stroke;ctx.stroke();} }
function background(accent="#dff7ee") { const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,"#fff9dd");g.addColorStop(.52,"#edf8ff");g.addColorStop(1,accent);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle="rgba(255,255,255,.72)";ctx.beginPath();ctx.arc(115,90,62,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(830,110,82,0,Math.PI*2);ctx.fill();ctx.fillStyle="#bce7cf";ctx.fillRect(0,455,W,85); }
function text(value,x,y,size=62,color="#344b78") { ctx.textAlign="center";ctx.textBaseline="middle";ctx.font=`900 ${size}px Arial, sans-serif`;ctx.lineWidth=9;ctx.strokeStyle="rgba(255,255,255,.94)";ctx.strokeText(value,x,y);ctx.fillStyle=color;ctx.fillText(value,x,y); }
function person(x,y,shirt="#ff8b72",wave=0,step=0,scale=1) { ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#5b4a46";ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(-18,88);ctx.lineTo(-25+step,142);ctx.moveTo(18,88);ctx.lineTo(27-step,142);ctx.stroke();ctx.fillStyle="#5b4a46";ctx.beginPath();ctx.arc(-26+step,148,11,0,Math.PI*2);ctx.arc(28-step,148,11,0,Math.PI*2);ctx.fill();ctx.fillStyle=shirt;ctx.beginPath();ctx.roundRect(-48,5,96,95,35);ctx.fill();ctx.strokeStyle="#f3b58d";ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(-37,32);ctx.lineTo(-76,72);ctx.moveTo(38,30);ctx.lineTo(73,55);ctx.stroke();ctx.save();ctx.translate(73,55);ctx.rotate(wave);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(14,-45);ctx.stroke();ctx.restore();ctx.fillStyle="#f3b58d";ctx.beginPath();ctx.arc(0,-42,47,0,Math.PI*2);ctx.fill();ctx.fillStyle="#4c382f";ctx.beginPath();ctx.arc(0,-57,47,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle="#3f3a3a";ctx.beginPath();ctx.arc(-16,-39,4,0,Math.PI*2);ctx.arc(16,-39,4,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#a85656";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-30,14,.15,Math.PI-.15);ctx.stroke();ctx.restore(); }
function greetings(t) { background("#f6e9ff"); let label="Hello!", ax=290,bx=670,aw=0,bw=0; if(t<4){aw=Math.sin(t*5)*.38;} else if(t<8){label="Hi!";bw=Math.sin((t-4)*5)*.38;} else {label=t<10.5?"Goodbye!":"Bye!";const p=ease((t-8)/4);ax=290-180*p;bx=670+180*p;aw=Math.sin(t*5)*.38;bw=-Math.sin(t*5)*.38;} person(ax,305,"#ff8b72",aw);person(bx,305,"#6ab7e8",bw);roundRect(280,55,400,105,48,"rgba(255,255,255,.9)","#cddcf2");text(label,480,108,64); }
function balloon(x,y,color) { ctx.strokeStyle="#607594";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y+62);ctx.quadraticCurveTo(x+25,y+105,x,y+142);ctx.stroke();ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,58,70,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x-10,y+66);ctx.lineTo(x+10,y+66);ctx.lineTo(x,y+82);ctx.fill(); }
function ball(x,y,color) { ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,66,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.65)";ctx.lineWidth=8;ctx.beginPath();ctx.arc(x,y,38,-1.1,1.1);ctx.stroke();ctx.beginPath();ctx.arc(x,y,38,2.05,4.2);ctx.stroke(); }
function star(x,y,color) { ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?34:76;ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}ctx.closePath();ctx.fill(); }
function leaf(x,y,color) { ctx.save();ctx.translate(x,y);ctx.rotate(-.35);ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(0,0,52,90,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff";ctx.globalAlpha=.55;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,-65);ctx.lineTo(0,65);ctx.stroke();ctx.restore(); }
function colors(t) { background("#fff0ef");const scenes=[{name:"red",color:"#e84f55",draw:ball},{name:"blue",color:"#3978d6",draw:ball},{name:"yellow",color:"#f5c83b",draw:star},{name:"green",color:"#45ad68",draw:leaf},{name:"orange",color:"#f39a38",draw:ball},{name:"pink",color:"#ef7eb6",draw:ball},{name:"purple",color:"#9664cf",draw:ball}];const i=Math.min(scenes.length-1,Math.floor(t/2)),s=scenes[i],local=(t%2)/2,scale=.82+.18*ease(Math.min(1,local*2));ctx.save();ctx.translate(480,295);ctx.scale(scale,scale);ctx.translate(-480,-295);s.draw(480,295,s.color);ctx.restore();roundRect(305,60,350,100,48,"rgba(255,255,255,.92)","#dbe4ee");text(s.name,480,110,58,s.color); }
function actionPerson(x,y,pose,phase) { ctx.save();ctx.translate(x,y);ctx.lineCap="round";ctx.lineJoin="round";const bob=pose==="run"?Math.sin(phase*12)*8:pose==="walk"?Math.sin(phase*7)*4:0;ctx.translate(0,bob);ctx.fillStyle="#f4b58e";ctx.beginPath();ctx.arc(0,-110,42,0,Math.PI*2);ctx.fill();ctx.fillStyle="#4c382f";ctx.beginPath();ctx.arc(0,-123,41,Math.PI,Math.PI*2);ctx.fill();ctx.strokeStyle="#ff806f";ctx.lineWidth=34;ctx.beginPath();if(pose==="sit"){ctx.moveTo(0,-65);ctx.lineTo(0,5);}else{ctx.moveTo(0,-68);ctx.lineTo(0,30);}ctx.stroke();ctx.strokeStyle="#5b4a46";ctx.lineWidth=15;ctx.beginPath();if(pose==="jump"){const k=Math.sin(Math.min(1,phase)*Math.PI);ctx.translate(0,-90*k);ctx.moveTo(0,-50);ctx.lineTo(-55,-10);ctx.moveTo(0,-50);ctx.lineTo(55,-10);ctx.moveTo(0,25);ctx.lineTo(-45,78);ctx.moveTo(0,25);ctx.lineTo(45,78);}else if(pose==="sit"){ctx.moveTo(0,-42);ctx.lineTo(58,-15);ctx.moveTo(0,-42);ctx.lineTo(-35,0);ctx.moveTo(0,5);ctx.lineTo(55,8);ctx.lineTo(57,62);ctx.moveTo(0,5);ctx.lineTo(-8,62);}else if(pose==="stand"){ctx.moveTo(0,-45);ctx.lineTo(-42,8);ctx.moveTo(0,-45);ctx.lineTo(42,8);ctx.moveTo(0,28);ctx.lineTo(-17,92);ctx.moveTo(0,28);ctx.lineTo(17,92);}else{const swing=Math.sin(phase*(pose==="run"?12:7))*(pose==="run"?48:30);ctx.moveTo(0,-45);ctx.lineTo(-swing,12);ctx.moveTo(0,-45);ctx.lineTo(swing,12);ctx.moveTo(0,28);ctx.lineTo(swing,92);ctx.moveTo(0,28);ctx.lineTo(-swing,92);}ctx.stroke();ctx.restore(); }
function actions(t) { background("#e8f5ff");const segment=16/5,scene=Math.min(4,Math.floor(t/segment)),local=(t%segment)/segment,poses=["run","jump","sit","stand","walk"],pose=poses[scene];ctx.fillStyle="#9bcbb2";ctx.fillRect(135,430,690,10);if(pose==="sit"){ctx.fillStyle="#687ea5";ctx.fillRect(520,335,100,18);ctx.fillRect(530,350,14,84);ctx.fillRect(596,350,14,84);}const travel=pose==="run"||pose==="walk"?240+480*ease(local):480;actionPerson(travel,335,pose,local);ctx.fillStyle="rgba(255,255,255,.82)";ctx.beginPath();ctx.arc(105,105,48,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ffd35d";ctx.beginPath();ctx.arc(105,105,26,0,Math.PI*2);ctx.fill(); }
function book(x,y,open=0) { ctx.save();ctx.translate(x,y);ctx.fillStyle="#447fc4";ctx.strokeStyle="#315d91";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-145,-85+40*open);ctx.quadraticCurveTo(-60,-115*open,0,-55);ctx.quadraticCurveTo(60,-115*open,145,-85+40*open);ctx.lineTo(135,90);ctx.quadraticCurveTo(60,62,0,100);ctx.quadraticCurveTo(-60,62,-135,90);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle="#fff";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(0,96);ctx.stroke();ctx.restore(); }
function classroom(t) { background("#e8edff");roundRect(110,70,740,365,32,"#fffdf5","#a7bfde");ctx.fillStyle="#7d92b1";ctx.fillRect(180,355,600,28);ctx.fillRect(230,383,26,70);ctx.fillRect(704,383,26,70);const open=ease(Math.min(1,t/5));book(480,275,open);person(730,280,"#6ab7e8",-.2,0,.65);ctx.fillStyle="#ffd45c";ctx.beginPath();ctx.arc(105,105,28,0,Math.PI*2);ctx.fill(); }
function tree(x,y) { ctx.fillStyle="#8a603d";ctx.fillRect(x-18,y,36,110);ctx.fillStyle="#68b978";ctx.beginPath();ctx.arc(x,y-25,70,0,Math.PI*2);ctx.arc(x-48,y+8,48,0,Math.PI*2);ctx.arc(x+48,y+8,48,0,Math.PI*2);ctx.fill(); }
function places(t) { background("#e0f7ec");tree(155,330);roundRect(615,170,230,260,24,"#f3d48f","#7894b4");roundRect(675,270,80,160,10,"#8dc4e8");ctx.fillStyle="#fff";ctx.fillRect(645,210,55,45);ctx.fillRect(760,210,55,45);const p=ease(t/13);person(260+390*p,315,"#ff8b72",Math.sin(t*4)*.2,0,.72);ctx.strokeStyle="#d4c39f";ctx.lineWidth=28;ctx.beginPath();ctx.moveTo(180,465);ctx.quadraticCurveTo(480,390,790,465);ctx.stroke(); }
function weather(t) { background("#e5f6ff");const phase=(t%4)/4;ctx.fillStyle="#7386a6";for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(360+i*72,150+(i%2)*15,70,0,Math.PI*2);ctx.fill();}ctx.strokeStyle="#4f9bd4";ctx.lineWidth=8;ctx.lineCap="round";for(let i=0;i<18;i++){const x=235+(i%9)*62,y=230+Math.floor(i/9)*100+phase*95;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-18,y+38);ctx.stroke();}ctx.fillStyle="#70b078";ctx.fillRect(0,445,W,95);person(480,320,"#ffd45c",0,0,.78);ctx.strokeStyle="#744f9b";ctx.lineWidth=13;ctx.beginPath();ctx.arc(480,205,125,Math.PI,Math.PI*2);ctx.stroke();ctx.fillStyle="#744f9b";ctx.beginPath();ctx.moveTo(355,205);ctx.quadraticCurveTo(480,70,605,205);ctx.closePath();ctx.fill(); }
function help(t) { background("#e7f5ff");const p=ease(Math.min(1,t/7));person(280,315,"#ff8b72",0,0,.72);person(680,315,"#6ab7e8",0,0,.72);ctx.save();ctx.translate(360+240*p,300);ctx.scale(.48,.48);book(0,0,1);ctx.restore();ctx.fillStyle="#fff";ctx.strokeStyle="#b9cee3";ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(335,55,290,105,40);ctx.fill();ctx.stroke();ctx.fillStyle="#ffcc63";ctx.beginPath();ctx.arc(430,108,18,0,Math.PI*2);ctx.arc(480,108,18,0,Math.PI*2);ctx.arc(530,108,18,0,Math.PI*2);ctx.fill(); }
async function record(clip) { status.textContent=`rendering ${clip.file}`;const stream=canvas.captureStream(fps),type=MediaRecorder.isTypeSupported("video/webm;codecs=vp8")?"video/webm;codecs=vp8":"video/webm";const recorder=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:320000});const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};const done=new Promise(resolve=>recorder.onstop=resolve);recorder.start(1000);await new Promise(resolve=>{let frame=0;const timer=setInterval(()=>{const elapsed=frame/fps;clip.draw(Math.min(clip.duration-.001,elapsed));frame+=1;if(frame>=clip.duration*fps){clearInterval(timer);resolve();}},1000/fps);});recorder.stop();await done;stream.getTracks().forEach(track=>track.stop());const blob=new Blob(chunks,{type:"video/webm"});const response=await fetch(`/upload/${clip.file}`,{method:"POST",headers:{"Content-Type":"video/webm"},body:blob});if(!response.ok)throw new Error(await response.text());status.textContent=`saved ${clip.file}: ${blob.size}`;}
(async()=>{try{await fetch("/started",{method:"POST"});for(const clip of clips)await record(clip);status.textContent="DONE";await fetch("/done",{method:"POST"});}catch(error){status.textContent=error.stack;await fetch("/failed",{method:"POST",body:String(error.stack||error)});}})();
</script>'''

class Handler(http.server.SimpleHTTPRequestHandler):
    done = threading.Event()
    started = threading.Event()
    failed = None

    def log_message(self, *_args):
        pass

    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length)
        if self.path.startswith("/upload/"):
            name = pathlib.Path(self.path.removeprefix("/upload/")).name
            if name not in {"en-25-classroom.webm", "en-27-places.webm", "en-29-weather.webm", "en-37-help.webm"}:
                self.send_error(400, "Unexpected filename")
                return
            (OUT / name).write_bytes(body)
            self.send_response(204); self.end_headers()
        elif self.path == "/started":
            self.send_response(204); self.end_headers(); self.started.set()
        elif self.path == "/done":
            self.send_response(204); self.end_headers(); self.done.set()
        elif self.path == "/failed":
            type(self).failed = body.decode("utf-8", "replace")
            self.send_response(204); self.end_headers(); self.done.set()
        else:
            self.send_error(404)

OUT.mkdir(parents=True, exist_ok=True)
PAGE.write_text(HTML, encoding="utf-8")
shutil.rmtree(PROFILE, ignore_errors=True)
server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), lambda *args, **kwargs: Handler(*args, directory=str(ROOT), **kwargs))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
    chrome_log = (ROOT / "__video_chrome.log").open("w", encoding="utf-8")
    process = subprocess.Popen([
        str(CHROME), "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
        "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
        "--autoplay-policy=no-user-gesture-required", f"--user-data-dir={PROFILE}", f"http://127.0.0.1:{PORT}/{PAGE.name}",
    ], stdout=chrome_log, stderr=subprocess.STDOUT)
    if not Handler.started.wait(10):
        raise RuntimeError(f"Chromium did not open renderer; exit={process.poll()}")
    if not Handler.done.wait(80):
        raise RuntimeError(f"Chromium MediaRecorder timed out; exit={process.poll()}")
    if Handler.failed:
        raise RuntimeError(Handler.failed)
    for path in sorted(OUT.glob("*.webm")):
        print(f"{path.name}={path.stat().st_size}")
finally:
    server.shutdown(); server.server_close()
    if "process" in locals():
        process.terminate()
        try: process.wait(timeout=5)
        except subprocess.TimeoutExpired: process.kill()
    if "chrome_log" in locals():
        chrome_log.close()
    PAGE.unlink(missing_ok=True)
    shutil.rmtree(PROFILE, ignore_errors=True)