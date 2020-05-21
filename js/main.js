

//common variables
let maze = new Maze(2,1,2);

maze.registerObserver(this);


document.getElementById("xlabel").innerHTML = "" + 2;
document.getElementById("ylabel").innerHTML = "" + 1;
document.getElementById("zlabel").innerHTML = "" + 2;

//2D variables
let view2dEnabled = false;
let currentSliceEditing = 0;

let canSetInitialAndFinal = true;



const modes = {
    default: -1,
    settingInitialCell: 1,
    settingFinalCell:2
}
let currentMode = modes.default;

let divsize = 1;

/*
    -1: default 
    1: setting initial cell
    2: setting final cell
*/

//2D view code
function setup() {
    var canvas = createCanvas(400, 400);
   
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('2dview');
  
    textSize(16);
    textAlign(LEFT, TOP)
    canvas.mousePressed(canvasHasBeenClicked)
}

function draw(){
    background(51);

    if(view2dEnabled == true){
       
         
        let currentslice = maze.cells[currentSliceEditing]; //Get this slice

        

        for(let x = 0; x < currentslice.length; x++){
            let row = currentslice[x];

            for(let y = 0; y < row.length; y++){

                stroke(51);
                 fill(213);
                let cell = row[y];
                cell.display();
                rect(x * divsize, y * divsize, divsize, divsize);

                if(cell.isInitial == true){
                    fill(12,12,130);
                    noStroke();
                    text('Initial', x * divsize, y * divsize);
                }

                if(cell.isFinal == true){
                    fill(12,12,130);
                    noStroke();
                    text('Final', x * divsize, y * divsize);
                }
            }
        }
        
    }
}

function canvasHasBeenClicked(){
    
    

    if(view2dEnabled == true){

        //Try to get the current cell
        let mx = Math.floor(mouseX / divsize);
        let my = Math.floor(mouseY / divsize);

        if(mx < maze.xdivs && my < maze.zdivs){
            
            //Mx and my are the indices for the cell

            let cell = maze.cells[currentSliceEditing][mx][my];

            switch(currentMode){

                case modes.settingInitialCell:

                    if(canSetInitialAndFinal == true){
                        if(maze.initialCell != undefined){
                            maze.initialCell.isInitial = false;
                        }
                        cell.isInitial = true;
                        maze.initialCell = cell;
                        currentMode = modes.default;
                        break;
                    }
                    

                case modes.settingFinalCell:

                    if(canSetInitialAndFinal == true){
                        if(maze.finalCell != undefined){
                            maze.finalCell.isFinal = false;
                        }

                        cell.isFinal = true;
                        maze.finalCell = cell;
                        currentMode = modes.default;
                        break;
                    }

                default:
                    break;
            }
            
        
        }
    }
}


//2D variables

//3Dview code

let v3dels = {};

let size3dw = 400;
let size3dh = 400;

let blocksize = 0.5;

prepare3DView();

function prepare3DView(){
    var scene = new THREE.Scene();

    v3dels.scene = scene;


    var camera = new THREE.PerspectiveCamera( 75, size3dw/size3dh, 0.1, 1000 );
    v3dels.camera = v3dels;
    camera.position.set(0,5,5)

    const container = document.getElementById( '3dview' );

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( size3dw,size3dh );

    v3dels.renderer = renderer;

    container.appendChild( renderer.domElement );

    var controls = new THREE.OrbitControls( camera, renderer.domElement );


    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    var l1 = new THREE.PointLight( 0xffffff, 1, 100 );
    l1.position.set( 0, 2, 4 );
    scene.add(l1);

    var axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    let mazemesh = new THREE.Object3D();
    v3dels.mazemesh = mazemesh;

    scene.add(mazemesh)


    camera.position.z = 5;

    controls.update();

    updateMeshForMaze();

    var animate = function () {
        requestAnimationFrame( animate );


        controls.update();
        renderer.render( scene, camera );
    };

    animate();

}

function updateMeshForMaze(){

    
    
    let mazemesh = v3dels.mazemesh;

    //Clean the mazemesh
    for (var i = mazemesh.children.length - 1; i >= 0; i--) {
        mazemesh.remove(mazemesh.children[i]);
    }


    //Add a cube for each cell

    const material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,    // red (can also use a CSS color string here)
        flatShading: true,
      });

    //for(let s = 0; s < maze.cells.length; s++){
    for(let y = 0; y < maze.ydivs; y++){

        //let slicecont = maze.cells[s];

        //for(let x = 0; x < slicecont.length; x++ ){
        for(let x = 0; x < maze.xdivs; x++ ){

            //let row = slicecont[x];


            //for(let y = 0; y < row.length; y++ ){
            for(let z = 0; z < maze.zdivs; z++ ){
                //let cell = row[y];

                //row.push(cell);


                var geometry = new THREE.BoxGeometry( blocksize*0.9, blocksize*0.9, blocksize*0.9 );
                //var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                var cube = new THREE.Mesh( geometry, material );

                cube.position.x = x * blocksize;
                cube.position.y = y * blocksize;
                cube.position.z = z * blocksize;
                mazemesh.add( cube );

            }
            
        }
        
    }


}

function onMazeChange(){
 
    updateMeshForMaze();
}


//Interface management stuff

function xdivschanged(slider){
    document.getElementById("xlabel").innerHTML = "" + slider.value;
    maze.setXdivs(Number(slider.value));
}

function ydivschanged(slider){
    document.getElementById("ylabel").innerHTML = "" + slider.value;
    maze.setYdivs(Number(slider.value));
}

function zdivschanged(slider){
    document.getElementById("zlabel").innerHTML = "" + slider.value;
    maze.setZdivs(Number(slider.value));
}


function confirmMazeSize(){
    maze.canBeEdited = false;

    //Disable the controls

    document.getElementById("controlsdiv").style.display = "none";

    //TODO: ENABLE THE 2D view
    view2dEnabled = true;


    let biggest = 1;
    if(maze.xdivs >= maze.zdivs){
        biggest = maze.xdivs;
        divsize = width / biggest;
    }else if(maze.zdivs > maze.xdivs){
        biggest = maze.zdivs;
        divsize = height / biggest;
    }

}

function setInitialCellMode(){
    currentMode = modes.settingInitialCell;
}


function setFinalCellMode(){
    currentMode = modes.settingFinalCell;
}

function fixInitialAndFinalCells(){
    canSetInitialAndFinal = false;
}