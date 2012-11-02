/**
 * This class represents body
 * @param {} x - this is x position in 2d;
 * @param {} y - this is y position in 2d;
 */
function Body(x,y, radii)
  {
    this.dt = 0.01;
    this.radii = radii;
    this.mass = 10*Math.PI*this.radii*this.radii;
    this.canMove = true;
    this.charged = true;
    this.x = x+0.0;
    this.y = y+0.0;
    this.vx = 0//Math.pow(-1,Math.round(2*Math.random()))*100*Math.random()+0.1;
    this.vy = 0//Math.pow(-1,Math.round(2*Math.random()))*100*Math.random()+0.1;
    this.fx = 0;
    this.fy = 0;
    this.moveForce = function()
      {
        this.ax = this.fx/this.mass;
        this.ay = this.fy/this.mass;
        this.vx += this.ax * this.dt;
        this.vy += this.ay * this.dt;
        this.x+=this.vx*this.dt;
        this.y+=this.vy*this.dt;
      }
  };
  
  
function tension(point1,point2) //point1 and 2 should be arrays [x,y] each
  {
    this.el = 10;
    this.length;
  }  

  
/**
 * This little class represents border box for objects
 * @param {} w - width of box;
 * @param {} h - height;
 */
function Box(w,h)
  {
    this.h = h;
    this.w = w;
  };


/**
 * This class represents system of objects;
 */
function System()
  {
    function Box(w,h)
      {
        this.h = h;
        this.w = w;
      };
    this.box = new Box(1000,600); //Should be defined;
    this.set = new Array();
    this.push = function(body)
      {
        this.set.push(body);
      }
    this.pop = function()
      {
        this.set.pop();
      }
  };


// forces ======================================================================
function dropForces()
  {
    arguments[0].fx = 0;
    arguments[0].fy = 0;
  }
function resFriction() //first argument is always current body, second = system
  {
    //console.log("call res function;")
    arguments[0].fy += -5*arguments[0].vy;
    arguments[0].fx += -5*arguments[0].vx;
  };
function gravi()
  {
    var body = arguments[0];
    var system = arguments[1];
    
    //console.log("call for 'gravi'");
    for (var i=0; i<system.length; i++)
      {
        if (!body.charged) break;
        if (!system[i].charged) continue;
        //console.log("call for 'gravi'");
        var qdist = 
        (body.x - system[i].x)*(body.x - system[i].x) + 
        (body.y - system[i].y)*(body.y - system[i].y);

        if (qdist > 0)
          {
            var force = -10 * body.mass * system[i].mass / qdist;
            //console.log(force);
            body.fx += force*(body.x - system[i].x)/Math.sqrt(qdist);
            body.fy += force*(body.y - system[i].y)/Math.sqrt(qdist);
          }
      }
    
  }
function collisions(system_object)
{
  var bounce = 0.95;
  var len = system_object.set.length;
  function isThereHit(body1, body2)
    {
      if (
      Math.pow((body1.x - body2.x),2) + Math.pow((body1.y - body2.y),2) < 
      Math.pow( body1.radii + body2.radii, 2 )
      ) 
        return true
      else 
        return false
    }
  
  for (var i=0; i<len; i++)
    {

      var b1 = system_object.set[i];
      if (!b1.canMove) continue;

      for (var j=i+1; j<len; j++)
        {

          var b2 = system_object.set[j]

          if (isThereHit(b1,b2)) 
            {

              if (!b2.canMove) continue;
              var alpha = b1.mass/b2.mass;
              var c = 1 / Math.sqrt(
              (b1.x-b2.x)*(b1.x-b2.x) + (b1.y-b2.y)*(b1.y-b2.y)
              ); //normalize vectors

              //normalized radius - vector
              var r = [ (b2.x-b1.x)*c, (b2.y-b1.y)*c ]; 
              var shiftx = b1.vx;
              var shifty = b1.vy;
              b1.vx=0;
              b1.vy=0;
              b2.vx-=shiftx;
              b2.vy-=shifty;
              
              var v1l = [0,0]; // longitude and
              var v1t = [0,0]; // transversal parts of velocity

              var proj = b2.vx * r[0] + b2.vy * r[1]; 
              
              var v2l = [ proj*r[0], proj*r[1] ];
              var v2t = [b2.vx - v2l[0], b2.vy - v2l[1]]
              
              v1l[0] = v2l[0] / (alpha/2 + 1/2);
              v1l[1] = v2l[1] / (alpha/2 + 1/2);
              
              v2l[0] = v2l[0] * (1/2 - alpha/2) / ( alpha/2 + 1/2 );
              v2l[1] = v2l[1] * (1/2 - alpha/2) / ( alpha/2 + 1/2 );
              
              b1.vx = shiftx + bounce*v1l[0] + v1t[0];
              b1.vy = shifty + bounce*v1l[1] + v1t[1];
              
              b2.vx = shiftx + bounce*v2l[0] + v2t[0];
              b2.vy = shifty + bounce*v2l[1] + v2t[1];
              
              var delta = b1.radii + b2.radii - Math.sqrt(
              (b1.x-b2.x)*(b1.x-b2.x) + (b1.y-b2.y)*(b1.y-b2.y)
              );

              b2.x += delta * r[0]/2;
              b2.y += delta * r[1]/2;
              
              b1.x -= delta * r[0]/2;
              b1.y -= delta * r[1]/2;
            };
        }
    }
}
// end of forces block =========================================================


function Grid(box, hres, vres)
  {
    function Cell(x0, x1, y0, y1)
      {
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.center = [(x1-x0)/2,(y1-y0)/2]
        this.set = [];
        this.push = function(body) { this.set.push(body) };
        this.clear = function() { this.set = []; }
      }

    this.hres = box.w/hres;
    this.vres = box.h/vres;
    this.cells = [];
    this.addCell = function(cell) {this.cells.push(cell)}

    this.initCells = function() 
      {
        for (var i=0; i<hres; i++)
          {
            for (var j=0; j<vres; j++)
              {
                this.addCell( 
                new Cell(
                  i*this.hres,
                  (i+1)*this.hres,
                  j*this.vres, 
                  (j+1)*this.vres
                  ) 
                ) 
              }
          }
      };

    //call on start
    this.initCells();

    this.sort = function(body) // takes body obj and inserts it in right cell
      {
        var i = Math.floor(body.x/this.hres);
        var j = Math.floor(body.y/this.vres);
        
        var di = Math.ceil(body.radii/this.hres);
        var dj = Math.ceil(body.radii/this.vres);
        
        for (var k = i - di; k < i + di; k++)
          {
            for (var p = j - dj; p < j + dj; p++)
              {
                try 
                  {
                    this.cells[p*hres + k].set.push(body);
                  }
                catch(e){}  
              }
          }
        
      }

    this.clearCells = function()
      {
        for (var l=0; l<this.cells.length; l++)
          {
            this.cells[l].clear();
          }
      }
    
  }


function Reactor(system_object)
  {
    this.system = system_object;
    this.grid = new Grid(system_object.box, 40, 20);
    this.forces = [dropForces, gravi ];
    //this.forces = [];

    this.setForce = function(body)
      {
        for (var i=0; i<this.forces.length; i++)
          {
            this.forces[i](body, system_object.set);
          }
      }

    this.setForceAll = function()
      {
        for (var i=0; i<system_object.set.length; i++)
          {
            this.setForce(system_object.set[i]);
          }        
      }

    this.moveForceAll = function()
      {
        this.setForceAll();
        for (var i=0; i<system_object.set.length; i++)
          {
            if (system_object.set[i].canMove)
            system_object.set[i].moveForce();
          }        
      }

    this.moveConstrainsBody = function(body)
      {
        var bounce = 0.7;
        var frict = 0.95;
        if (body.x < body.radii) 
          {
            body.x = body.radii; 
            body.vx = -bounce*body.vx;
            body.vy*=frict;
            body.moved = true;
          };

        if (body.y < body.radii) 
          {
            body.y = body.radii;
            body.vy = -bounce*body.vy;
            body.vx*=frict;
            body.moved = true;
          };

        if (body.x > (system_object.box.w-body.radii)) 
          {
            body.x = system_object.box.w-body.radii;
            body.vx = -bounce*body.vx;
            body.vy*=frict;
            body.moved = true;
          };

        if (body.y > (system_object.box.h-body.radii)) 
          {
            body.y = system_object.box.h-body.radii;
            body.vy = -bounce*body.vy;
            body.vx*=frict;
            body.moved = true;
          };
      }

    this.moveConstrainsAll = function()
      {
        for (var i=0; i<system_object.set.length; i++)
          {
            this.moveConstrainsBody(system_object.set[i]);
            this.grid.sort(system_object.set[i]);
          }

        for (var i=0; i<this.grid.cells.length; i++)
          {
            collisions(this.grid.cells[i]);
          }
          
        this.grid.clearCells();
      }

    this.getKinneticE = function()
      {
        var e = 0;
        for (var i=0; i<system_object.set.length; i++)
          {
            e+=system_object.set[i].mass*Math.pow(system_object.set[i].vx,2)/2;
            e+=system_object.set[i].mass*Math.pow(system_object.set[i].vy,2)/2;
          }
        return Math.round((e/100000)).toString();
      };
  };


function Renderer(id, width, height, system_object)
  {
    this.handle = document.getElementById(id);
    this.handle.width = width;
    this.handle.height = height;
    this.handle.style.left = (window.innerWidth - this.handle.width)/2;
    this.handle.style.top = (window.innerHeight - this.handle.height)/2;
    this.handle.left = (window.innerWidth - this.handle.width)/2;
    this.handle.top = (window.innerHeight - this.handle.height)/2;
    this.getWidth = function() {return this.handle.width;};
    this.getHeight = function(){return this.handle.height;};
    
    this.handle.ctx = this.handle.getContext("2d");
    this.handle.ctx.fillStyle = "rgb(220,220,220)";
    this.handle.ctx.strokeStyle = "rgb(20, 20, 20)";
    this.handle.ctx.lineWidth = 3;
    this.handle.ctx.fillRect(0,0,this.handle.width,this.handle.height);
    this.handle.ctx.scale(1,1);
    this.clear = function()
      {
        this.handle.ctx.fillRect(0,0,this.handle.width,this.handle.height);  
      }
    this.draw_body = function(body)
      {
        this.handle.ctx.beginPath();
        this.handle.ctx.arc(body.x, body.y, body.radii, 0, 2*Math.PI, true);
        this.handle.ctx.stroke();
        this.handle.ctx.closePath();
      }
    this.renderall = function()
      {
        this.clear();
        for (var i=0; i<system_object.set.length; i++)
          {
            this.draw_body( system_object.set[i] );
          }
      }
  };

  
function Controller(reactor, renderer)
  {
    this.perform = document.getElementById("perform");
    this.simState = 1;
    this.simTime = 0;
    this.drawTime = 0;
    this.reactor = reactor;
    this.renderer = renderer;

    this.renderer.handle.onmousedown = function()
      {
        var x = event.pageX - renderer.handle.offsetLeft;
        var y = event.pageY - renderer.handle.offsetTop;
        var r = 10;
        var b = new Body(x-r,y-r,r);
        b.mass = -100000;
        b.canMove = false;        
        reactor.system.push(b);
      }
      
    this.renderer.handle.onmouseup = function()
      {
        reactor.system.pop();
      }
      

    this.stepSimulation = function() 
      {
        if (this.simState == 1)
        {
        var t0 = new Date()
        var s0 = t0.getMilliseconds();
        this.reactor.moveConstrainsAll();
        this.reactor.moveForceAll();
        var t1 = new Date()
        var s1 = t1.getMilliseconds();
        if (s1-s0>0)
        this.simTime = s1-s0;
        }
      }

    this.getPerform = function()
      {
        //this.perform.textContent = "sim.time="+this.simTime.toString()+"ms.  "+"draw.time="+this.drawTime+"ms.";
      }    
    
    this.simulate = function(delay)
      {
        setInterval("controller.stepSimulation()", delay);
      }

    this.renderScene = function()
      {
        var t0 = new Date()
        var s0 = t0.getMilliseconds();
        this.renderer.renderall();
        var t1 = new Date()
        var s1 = t1.getMilliseconds();
        if (s1-s0>0)
        this.drawTime = s1-s0;
      }

    this.render = function(delay)
      {
        setInterval("controller.renderScene()", delay);
      }

    this.run = function(sim_delay, rend_delay)
      {  
        this.simulate(sim_delay);
        this.render(rend_delay);
        setInterval("controller.getPerform()", 300);
      }
  }

window.onload = function()
  {
    system = new System();
    //Filling system
    for (var i = 0; i<200; i++) 
      { system.push( new Body(Math.random()*700, Math.random()*400, 5) ); }
    react = new Reactor(system);
    viewport = new Renderer("canva", 1000,600, system);
    controller = new Controller( react, viewport );
    controller.run(5,10);    
  };


