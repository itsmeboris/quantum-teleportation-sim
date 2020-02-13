let creatent;
let createclassic;
let createphoton;
let createrun;
let elements = [];
let entangled = [];
let createCamera;
let createDemo;
let x, y, state, index, v;
let dlt = undefined;
let r = 6;
let h = 12;
let num;
let d;
let status = "running";
let fixedCord = [];
let img;

function setup() {
    cnv = createCanvas(600, 700);
    background(100);
    creatent = createButton("create entengled bit");
    creatent.position(619, 119);
    creatent.mousePressed(create_ent_bit);

    createclassic = createButton("create classic bit");
    createclassic.position(619, 219);
    createclassic.mousePressed(create_classic_bit);

    createphoton = createButton("create photon");
    createphoton.position(619, 319);
    createphoton.mousePressed(create_photon);

    createCamera = createButton("create camera");
    createCamera.position(619, 419);
    createCamera.mousePressed(create_camera);

    createDemo = createButton("create demo");
    createDemo.position(819, 419);
    createDemo.mousePressed(create_demo);

    createrun = createButton("run/stop");
    createrun.position(719, 419);
    createrun.mousePressed(run_stop);

    cnv.mousePressed(find_element);
    cnv.mouseReleased(drop_element);
    d = 2.3 * h;
    num = (height - d) / d;
    img = createImage(50, 50);
}

function create_classic_bit() {
    status = "create";
    state = 0;
}

function create_ent_bit() {
    status = "create";
    state = 1;
}

function create_photon() {
    status = "create";
    state = 2;
}

function create_camera() {
    t = status;
    status = "camera";
    if (elements.length > 0) {
        create_new();
        status = t;
    }
}

function create_demo() {
    status = "demo";
}

function run_stop() {
    if (status == "running") status = "stop";
    else status = "running";
}

function find_element() {
    if (status == "running") {
        mx = mouseX;
        my = mouseY;
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].touch(mx, my)) {
                x = elements[i].x;
                y = elements[i].y;
                state = elements[i].type;
                v = elements[i].value;
                index = i;
                break;
            }
        }
    } else if (status == "create") {
        x = mouseX;
        y = mouseY;
        status = "waiting for value";
    }
}

function keyPressed() {
    if (status == "waiting for value") {
        // console.log('waiting for value');
        if (key == "0") {
            np = new Particle(x, y, state, 0, r);
        } else {
            np = new Particle(x, y, state, 1, r);
        }
        if (np.type == 2) {
            let pi = find_closest_ent(np);
            if (pi != undefined) {
                np.xSpeed = (elements[pi].x - np.x) / (np.speed * 2);
                np.ySpeed = (elements[pi].y - np.y) / (np.speed * 2);
            }
        }
        elements.push(np);
        status = "running";
    }
}

function find_closest_ent(np) {
    let closest = undefined;
    let minDist = pow(pow(width, 2) + pow(height, 2), 0.5);
    for (let i = 0; i < elements.length; i++) {
        let dist = elements[i].distance(np);
        if (dist < minDist && elements[i].entangled != undefined) {
            minDist = dist;
            closest = i;
        }
    }
    return closest;
}

function drop_element() {
    if (status == "running") {
        mx = mouseX;
        my = mouseY;
        if (index != undefined) elements[index].update(mx, my, state, v);
        index = undefined;
        x = undefined;
        y = undefined;
        v = undefined;
        state = undefined;
    }
}

function draw() {

    if (status == "running") {
        background(100);
        scale(10);
        image(img, 0, 0);
        scale(0.1);
        mx = mouseX;
        my = mouseY;
        detectColision();
        if (index != undefined) elements[index].update(mx, my, state, v);
        for (let i = elements.length - 1; i >= 0; i--) {
            elements[i].show();
            elements[i].move();
            if (
                elements[i].x > width ||
                elements[i].y > height ||
                elements[i].x < 0 ||
                elements[i].y < 0
            ) {
                elements.splice(i, 1);
                update_index(i);
            }
        }
        for (let i = 0; i < entangled.length; i++) {
            let [o1, o2] = entangled[i];
            line(elements[o1].x, elements[o1].y, elements[o2].x, elements[o2].y);
        }
    } else if (status == "camera") {
        v3 = [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1,
            0,
            1,
            1,
            1,
            0
        ];
        for (let i = 0; i < num; i++) {
            x1 = 100;
            y1 = 2 * h + i * d;
            fixedCord.push([x1, y1]);
            x2 = width - 100;
            y2 = 2 * h + i * d;
            x3 = int(random(width - 100, width));
            y3 = y1;
            p1type = 1;
            p2type = 1;
            p3type = 2;
            v1 = rand_value();
            v2 = rand_value();
            p1 = new Particle(x2, y2, p2type, v2, r);
            p2 = new Particle(x1, y1, p1type, v1, r);
            p3 = new Particle(x3, y3, p3type, v3[i], r);
            p3.img = i;
            elements.push(p1);
            elements.push(p2);
            elements.push(p3);
            entangle(3 * i, 3 * i + 1);
            p3.xSpeed = (p1.x - p3.x) / (p3.speed * 2);
            p3.ySpeed = (p1.y - p3.y) / (p3.speed * 2);
        }
        status = "running";
    } else if (status == "demo") {
        x1 = 100;
        x2 = width - 100;
        y1 = [2 * h, 2 * h + d, 2 * h + 2 * d, 2 * h + 3 * d];
        v = [0, 0, 1, 1];
        pv = [0, 1, 0, 1];
        for (let i = 0; i < 4; i++) {
            p1 = new Particle(x1, y1[i], 1, v[i], r);
            p2 = new Particle(x2, y1[i], 1, v[i], r);
            p3 = new Particle(x1 - 50, y1[i], 2, pv[i], r);
            elements.push(p1);
            elements.push(p2);
            elements.push(p3);
            entangle(3 * i, 3 * i + 1);
            p3.xSpeed = (p1.x - p3.x) / (p3.speed * 2);
            p3.ySpeed = (p1.y - p3.y) / (p3.speed * 2);
        }
        status = "running";
    }
}

function detectColision() {
    status = "stop";
    let touch = false;
    let i, j;
    for (i = elements.length - 2; i >= 0; i--) {
        for (j = elements.length - 1; j > i; j--) {
            if (elements[i].touch(elements[j].x, elements[j].y)) {
                touch = true;
                status = "colision";
                action(i, j);
            }
        }
    }
    status = "running";
}

function create_new() {
    for (let i = 0; i < num; i++) {
        p3 = new Particle(int(random(0, 100)), fixedCord[i][1], 2, rand_value(), r);
        elements.push(p3);
        p3.xSpeed = (fixedCord[i][0] - p3.x) / (p3.speed * 2);
        p3.ySpeed = (fixedCord[i][1] - p3.y) / (p3.speed * 2);
    }
}

function action(i, j) {
    let hitter = elements[i];
    let o = elements[j];
    if (hitter.type == o.type) {
        if (hitter.type == 1) {
            entangle(i, j);
        }
    } else {
        if (hitter.type == 0) {
            // classic
            if (o.type == 1) {
                // entangled
                collapse(i, j);
            }
        }
        if (hitter.type == 1) {
            // entangled
            if (o.type == 0) {
                // classic
                collapse(j, i);
            } else {
                // entabgled & photon
                bell(j, i);
            }
        }
        if (hitter.type == 2) {
            // photon
            if (o.type == 1) {
                // entangled
                bell(i, j);
            }
        }
    }
}

function entangle(i, j) {
    let found = false;
    for (let k = 0; k < entangled.length; k++)
        if (
            entangled[k][0] == i ||
            entangled[k][1] == i ||
            entangled[k][0] == j ||
            entangled[k][1] == j
        )
            found = true;
    if (!found) {
        entangled.push([i, j]);
        elements[i].entangled = elements[j];
        elements[j].entangled = elements[i];
    }
}

function bell(ph, ent) {
    status = "stop";
    photon = elements[ph];
    index = undefined;
    for (let i = 0; i < entangled.length; i++) {
        let p;
        if (entangled[i][0] == ent) {
            e = elements[entangled[i][0]];
            npb = e.spawn_basic(photon);
            elements.splice(ph, 1);
            update_index(ph);
            elements = concat(elements, npb);
            break;
        } else if (entangled[i][1] == ent) {
            e = elements[entangled[i][1]];
            npb = e.spawn_basic(photon);
            elements.splice(ph, 1);
            update_index(ph);
            elements = concat(elements, npb);
            break;
        }
    }
}

function collapse(bp, ep) {
    status = "stop";
    basic = elements[bp];
    index = undefined;
    for (let i = 0; i < entangled.length; i++) {
        let p;
        if (entangled[i][0] == ep) {
            e = elements[entangled[i][0]];
            npp = e.absorb(basic);
            elements.splice(bp, 1);
            update_index(bp);
            if (npp != undefined) {
                img.loadPixels();
                let a = map(npp.value, 0, 1, 0, 255);
                img.set((npp.img) % 5, int(npp.img / 5), [a, a, a, a]);
                img.updatePixels();
                elements.push(npp);
            }
            break;
        } else if (entangled[i][1] == ep) {
            e = elements[entangled[i][1]];
            npp = e.absorb(basic);
            elements.splice(bp, 1);
            update_index(bp);
            if (npp != undefined) {
                img.loadPixels();
                let a = map(npp.value, 0, 1, 0, 255);
                img.set((npp.img) % 5, int(npp.img / 5), [a, a, a, a]);
                img.updatePixels();
                elements.push(npp);
            }
            break;
        }
    }
}

function update_index(ind) {
    for (let i = 0; i < entangled.length; i++) {
        if (entangled[i][0] > ind) {
            entangled[i][0] = entangled[i][0] - 1;
        }
        if (entangled[i][1] > ind) {
            entangled[i][1] = entangled[i][1] - 1;
        }
    }
}

function rand_value() {
    let a = random();
    if (a > 0.5) return 1;
    return 0;
}
