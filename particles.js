/*
EXAMPLE spec object:
{
    x: 100,
    y: 100,
    xMax: 150, //(for dissolve) 
    yMax: 150, //(for dissolve) 
    particlesPerSec: 10, //(for explosion and burning)
    fill: color.white,
    stroke: 'rgba(0,0,0,0)',
    imageSrc: 'fire.png',
    rotation: {mean: .1, std: .1},
    lifetime: {mean: 700, std: 100},
    speed: {mean: .05, std: .01},
    size: {mean: 9, std: 3},
    gravity: 7,
    duration: 100,
}
*/
MyGame.particleSystem = (function(graphics){

    let particles = [];
    let activeParticleEffects = [];
    let particleGraphics = [];

    /*
    Particles makes a list of particle graphics.
    */
    function Particle(particle){
        let particleGraphic;
        if (particle.hasOwnProperty('imageSrc')){
            particle.center = particle.position;
            particle.width = particle.size;
            particle.height = particle.size;
            particleGraphic = graphics.Texture(particle);
        }
        else if (particle.hasOwnProperty('fill') || particle.hasOwnProperty('stroke')){
            particle.x = particle.position.x;
            particle.y = particle.position.y;
            particle.fillStyle = particle.fill;
            particle.strokeStyle = particle.stroke;
            particle.width = particle.size;
            particle.height = particle.size;
            particleGraphic = graphics.Rectangle(particle);
        }
        //Returns either a rectangle or a texture.
        return particleGraphic;
    }

    /*
    ParticleEffect creates a particle effect based on spec passed to it, which has...
      x
      y
      xMax (optional)
      yMax (optional)
      particlesPerSec
      lifetime.mean
      lifetime.std
      size.mean
      size.std
      stroke/fill/imageSrc
      rotationMax (optional)
      duration (optional)
    Returns true if still active, and false if effect duration is finished.
    */
    function ParticleEffect(spec){
        activeParticleEffects.push(MakeParticleEffect(spec));
    }

    function MakeParticleEffect(spec){
        let that = {};
        let time = 0.0;
        let effectDuration = 0.0;

        that.update = function(elapsedTime){
            time += elapsedTime;
            effectDuration += elapsedTime;
            //Makes a certain number of particles per second.
            // make one particle every 1000/spec.particlesPerSec
            if (spec.hasOwnProperty('duration') && effectDuration > spec.duration){
                return false;
            }
            for (time; time > (1000/spec.particlesPerSec); time -= (1000/spec.particlesPerSec) ){
                let p = {
                    direction: Random.nextCircleVector(),
                    speed: Random.nextGaussian( 0.05, .025 ),	// pixels per millisecond
                    rotation: 0,
                    lifetime: Math.abs(Random.nextGaussian(spec.lifetime.mean, spec.lifetime.std)),	// milliseconds
                    alive: 0,
                    size: Random.nextGaussian(spec.size.mean, spec.size.std),
                };
                if (spec.hasOwnProperty('rotationMax')){
                    p.rotationRate = Random.nextGaussian(0, spec.rotationMax);
                }
                if (spec.hasOwnProperty('gravity')){
                    p.gravity = spec.gravity;
                }
                if (spec.hasOwnProperty('fill')){
                    p.fill = spec.fill;
                }
                if (spec.hasOwnProperty('lineWidth')){
                    p.lineWidth = spec.lineWidth;
                }
                if (spec.hasOwnProperty('stroke')){
                    p.stroke = spec.stroke;
                }
                if (spec.hasOwnProperty('imageSrc')){
                    p.imageSrc = spec.imageSrc;
                }
                if (spec.hasOwnProperty('xMax') && spec.hasOwnProperty('yMax')){
                    p.position = { x: Random.nextRange(spec.x, spec.maxX), y: Random.nextRange(spec.y, spec.maxY)};
                }else{
                    p.position = {x: spec.x, y: spec.y};
                }
                if (spec.hasOwnProperty('imageSrc')){
                    p.imageSrc = spec.imageSrc;
                }
                particles.push(p);
                particleGraphics.push(Particle(p));
            }

            return true;
        }

        return that;
    }

    //UpdateParticles updates the particles and removes them when dead, and their corresponding graphics.
    function updateParticles(elapsedTime){
        //Loop through particles
        for (let particle = (particles.length-1); particle >= 0; --particle) {
            particles[particle].alive += elapsedTime;
            particles[particle].rotation += elapsedTime * particles[particle].rotationRate;
            particles[particle].x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
            particles[particle].y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
            if (particle.hasOwnProperty('rotationRate')){
                particles[particle].rotation += particles[particle].rotationRate;
            }
            if (particle.hasOwnProperty('gravity')){
                particles[particle].direction.y += (elapsedTime * particles[particle].gravity);
            }
            if (particles[particle].alive > particles[particle].lifetime) {
                particles.splice(particle, 1);
                particleGraphics.splice(particle, 1);
            }
        }
        //Add any new particles from ActiveParticleEffects
        for (let i = (activeParticleEffects.length-1); i >= 0; --i){
            if (!activeParticleEffects[i].update(elapsedTime)){
                activeParticleEffects.splice(i, 1);
            }
        }
    }

    function renderParticleSystem(){
        for (let i=0; i<particleGraphics.length; ++i){
            particleGraphics[i].draw(particles[i].particles);
        }
    }

    return {
        ParticleEffect: ParticleEffect,
        update: updateParticles,
        draw: renderParticleSystem
    };

}(MyGame.graphics));