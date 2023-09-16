function sprite(options) {
    var that = {},
        frameIndex = 0,
        tickCount = 0,
        tickPerFrame = options.tickPerFrame || 0,
        numberOfFrame = options.numberOfFrame || 1;

    that.context = options.context;
    that.w = options.w;
    that.h = options.h;
    that.img = options.img;
    that.x = options.x;
    that.y = options.y;
    that.scaleRatio = 1;

    that.update = function () {
        tickCount += 1;
        
        if(tickCount > tickPerFrame) {
            tickCount = 0;

            if(frameIndex < numberOfFrame - 1){
                frameIndex += 1;
            } else {
                frameIndex = 0;
            }
        }
    };

    that.render = function (){
        that.render = function () {
            that.context.save(); // Simpan konteks sekarang
            if (that.flipX) {
                that.context.scale(-1, 1); // Memutar gambar secara horizontal
                that.context.drawImage(
                    that.img,
                    frameIndex * (that.w / numberOfFrame),
                    0,
                    that.w / numberOfFrame,
                    that.h,
                    -that.x - that.getFramewidth(), // Gunakan nilai negatif untuk mengatasi pergeseran
                    that.y,
                    that.w / numberOfFrame,
                    that.h
                );
            } else {
                that.context.drawImage(
                    that.img,
                    frameIndex * (that.w / numberOfFrame),
                    0,
                    that.w / numberOfFrame,
                    that.h,
                    that.x,
                    that.y,
                    that.w / numberOfFrame,
                    that.h
                );
            }
            that.context.restore(); // Kembalikan konteks yang disimpan
        };
        
        
    };

    that.getFramewidth = function () {
        return that.w / numberOfFrame;
    };

    return that;
}

//init var

    var dino,
        dinoImage,
        canvas,
        score = 0,
        jack = [],
        numJack = 3;

    canvas = document.getElementById("cnv");
    canvas.width = 1024;
    canvas.height = 575;

    for (var i = 0; i < numJack; i++){
        spawnJack();
    }

    dinoImage = new Image();
    dinoImage.src = "images/character/sprite.png";
    dinoImage.onload = function () {
        dino = sprite({
            context: canvas.getContext("2d"),
            w: 1740,
            h: 210,
            img: dinoImage,
            numberOfFrame: 10,
            tickPerFrame: 5,
            x: 0,
            y: canvas.height - 210
        });
        gameLoop(); // Mulai loop setelah gambar dimuat
    }

document.addEventListener("keydown", keydown);

function keydown(e){
    switch (e.keyCode) {
        case 37:
            dino.x -= 10;
            if (dino.x < 0) {
                dino.x = 0; // Memastikan dino tetap di dalam canvas
            }
            dino.flipX = true;
            break;
        case 39:
            dino.x += 10;
            if (dino.x > canvas.width - (dino.getFramewidth() / 2)) {
                dino.x = canvas.width - (dino.getFramewidth() / 2); // Memastikan dino tetap di dalam canvas
            }
            dino.flipX = false;
            break;
    }
}

    function spawnJack(){
        var jackIndex,
            jackImage;

        jackImage = new Image();
        jackIndex = jack.length;

        //create sprite
        jack[jackIndex] = sprite({
            context: canvas.getContext("2d"),
            w: 239,
            h: 209,
            img: jackImage,
            numberOfFrame: 1,
            tickPerFrame: 5
        });

        jackImage.src = "images/character/musuh1.png";

        jack[jackIndex].x = Math.random() * (canvas.width - jack[jackIndex].getFramewidth() * jack[jackIndex].scaleRatio);
        jack[jackIndex].y = -jack[jackIndex].h; // Mulai dari atas canvas
        jack[jackIndex].scaleRatio = Math.random() * 0.5 + 0.5;
    }

    function destroyJack(param) {
        for(var i = 0; i < jack.length; i++) {
            if (jack[i] === param) {
                jack[i] = null;
                jack.splice(i, 1);
                break;
            }
        }
    }


    function drawText() {
        var context = canvas.getContext("2d");

        //score
        context.font = "bold 20px consolas";
        context.textAlign = "start";
        context.fillStyle = "white";
        context.fillText("score:" + score, canvas.width - 150, 40);
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        dino.update();
        dino.render();
        drawText();

        if (dino.x < 0){
            dino.x = 0;
        }

        if (dino.x > canvas.width - 174){
            dino.x = canvas.width - 174;
        }

        //draw jack
        for (var i = 0; i < jack.length; i++){
            jack[i].update();
            jack[i].y += 3;
            jack[i].render();

            //respawn jack
            if (jack[i].y > canvas.height) {
                //hapus
                destroyJack(jack[i]);
                setTimeout(spawnJack, 1000);
            }

            // Periksa tabrakan antara dino dan jack
        if (
            dino.x < jack[i].x + jack[i].getFramewidth() &&
            dino.x + dino.getFramewidth() > jack[i].x &&
            dino.y < jack[i].y + jack[i].h &&
            dino.y + dino.h > jack[i].y
        ) {
            // Terjadi tabrakan, hancurkan objek jack
            destroyJack(jack[i]);
            setTimeout(spawnJack, 2000);
                    score++;
        }
        }
    }