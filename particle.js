class Particle {
    constructor(x, y, type, value, r) {
        this.index = undefined;
        this.x = x;
        this.y = y;
        this.type = type;
        this.value = value;
        this.r = r;
        this.entangled = undefined;
        this.absorbed_particles = [];
        this.absorb_num = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.speed = 200;
        this.img = undefined;
    }

    show() {
        if (this.entangled != undefined) {
            fill("white");
            rectMode(CENTER);
            rect(this.x, this.y, 2 * r, 2 * r);
        } else {
            if (this.type == 0) fill("blue");
            else if (this.type == 1) fill("red");
            else fill("yellow");
            if (this.value == 0) circle(this.x, this.y, 2 * r);
            else if (this.value == 1) {
                rectMode(CENTER);
                rect(this.x, this.y, 2 * r, 2 * r);
            }
        }
    }

    absorb(basic_particle) {
        this.absorbed_particles[basic_particle.index] = basic_particle;
        this.absorb_num++;
        if (this.absorb_num == 2) {
            let pi;
            for (pi = 0; pi < this.absorbed_particles.length; pi++) {
                if (this.absorbed_particles[pi].index == 0) {
                    break;
                }
            }
            npp = new Particle(
                this.x + basic_particle.xSpeed * 10,
                this.y + basic_particle.ySpeed * 10,
                2,
                this.absorbed_particles[pi].value,
                this.r
            );
            npp.xSpeed = basic_particle.xSpeed;
            npp.ySpeed = basic_particle.ySpeed;
            npp.img = basic_particle.img;
            this.absorb_num = 0;
            this.absorbed_particles = [];
            return npp;
        }
        return undefined;
    }

    update(x, y, type, value) {
        this.x = x;
        this.y = y;
        this.type = state;
        this.value = value;
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    touch(x, y) {
        return abs(x - this.x) <= r && abs(y - this.y) <= r;
    }

    spawn_basic(photon_value) {
        //p is particle photon
        let values = [photon_value.value, this.value];
        let npa = [];
        let xDir, yDir;
        if (this.entangled.x - this.x >= 0) {
            xDir = 1;
        } else xDir = -1;
        if (this.entangled.y - this.y >= 0) {
            yDir = 1;
        } else yDir = -1;
        let np = new Particle(
            this.x + xDir * (2 * r),
            this.y + yDir * (2 * r),
            0,
            values[0],
            this.r
        );
        np.index = 0;
        np.img = photon_value.img;
        np.xSpeed = (this.entangled.x - np.x) / np.speed;
        np.ySpeed = (this.entangled.y - np.y) / np.speed;
        np.speed = this.speed / 2;
        npa.push(np);
        np = new Particle(
            this.x + xDir * (2 * r),
            this.y - yDir * (2 * r),
            0,
            values[1],
            this.r
        );
        np.index = 1;
        np.img = photon_value.img;
        np.xSpeed = (this.entangled.x - np.x) / np.speed;
        np.ySpeed = (this.entangled.y - np.y) / np.speed;
        np.speed = this.speed / 2;
        npa.push(np);
        return npa;
    }
    num_absorb() {
        return this.absorb_num;
    }

    distance(np) {
        return pow(pow(this.x - np.x, 2) + pow(this.y - np.y, 2), 0.5);
    }
}
