class Joystick {
  constructor(canvas, cb) {
    console.log('joystick', canvas, cb)
    this.cb = cb
    this.canvas = canvas; 
    this.ctx = this.canvas.getContext('2d');          
    this.canvas_x = this.canvas_y = this.ctx.canvas.width/2;
    this.resize();
    document.addEventListener('mousedown', this.start);
    document.addEventListener('mouseup', this.stop);
    document.addEventListener('mousemove', this.move);
    document.addEventListener('touchstart', this.start);
    document.addEventListener('touchend', this.stop);
    document.addEventListener('touchcancel', this.stop);
    document.addEventListener('touchmove', this.move);
    window.addEventListener('resize', this.resize);
    this.active = false;
//    this.last_move = 0;
  }
  
  start = () => {
    this.active = true
  }
  
  stop = () => {
    this.active = false
    this.cb(0,0);
    this.canvas_x = this.canvas_y = this.canvas.width/2
    this.draw()
  }

  move = (event) => {
    if (!this.active) return;
//    if (this.last_move > Date.now()-100) return;
//    this.last_move = Date.now();
    var mouse_x = event.clientX || event.touches && event.touches[0].clientX || 0;
    var mouse_y = event.clientY || event.touches && event.touches[0].clientY || 0;
    let canvas_x = this.canvas_x = Math.min(this.canvas.width, Math.max(0, mouse_x - this.canvas.offsetLeft));
    let canvas_y = this.canvas_y = Math.min(this.canvas.width, Math.max(0, mouse_y - this.canvas.offsetTop));
    let x = 2*(canvas_x - this.canvas.width/2) / this.canvas.width;
    let y = -2*(canvas_y - this.canvas.height/2) / this.canvas.height;
    this.cb(Math.max(-1, Math.min(1,x)), Math.max(-1, Math.min(1,y)))
    this.draw();
  }

  draw = () => {
    const ctx = this.ctx;
    const width = ctx.canvas.height;
    const d = width * .99

    ctx.clearRect(0, 0, width, width);
    
    // background
    ctx.beginPath();
    ctx.arc(width/2, width/2, d/2, 0, 2 * Math.PI);
    ctx.fillStyle = "silver";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gray";
    ctx.stroke();
    ctx.closePath();

    // joystick
    ctx.beginPath();
    ctx.arc(this.canvas_x, this.canvas_y, d*.3/2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff751a";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
  }

  resize = () => {
    this.ctx.canvas.height = this.ctx.canvas.width;
    this.draw()
  }

}

