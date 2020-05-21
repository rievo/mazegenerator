class Maze{
    constructor(xdivs, ydivs, zdivs){
        this.zdivs = zdivs;
        this.xdivs = xdivs;
        this.ydivs = ydivs;

        this.cells = [];

        this.canBeEdited = true;

        this.observers = [];


        this.cellSize = 10;
        this.recreateCells();

        this.initialCell = undefined;
        this.finalCell = undefined;
    }

    recreateCells(){

        this.cells = [];
        for(let y = 0; y < this.ydivs; y++){

            let slicecont = [];

            for(let x = 0; x < this.xdivs; x++ ){

                let row = [];
                for(let z = 0; z < this.zdivs; z++ ){
                    let cell = new Cell(x, y, z);
                    row.push(cell);
                }
                slicecont.push(row);
            }
            this.cells.push(slicecont);
        }
    }

    registerObserver(newobs){
        this.observers.push(newobs);
    }

    unregisterObserver(obs){
        console.log("WARNING, not implemented")
    }

    notifyAllObservers(){
        for(let i = 0 ; i < this.observers.length; i++){
            if(this.observers[i].onMazeChange != undefined){
                this.observers[i].onMazeChange();
            }
        }
    }

    setXdivs(x){

        if(this.canBeEdited == true){
            this.xdivs = x;
            this.onMazeChange();
        }
        
    }

    setYdivs(y){
        if(this.canBeEdited == true){
            this.ydivs = y;
            this.onMazeChange();
        }
    }

    setZdivs(z){
        if(this.canBeEdited == true){
            this.zdivs = z;
            this.onMazeChange();
        }
    }

    onMazeChange(){
        this.recreateCells();
        this.notifyAllObservers();
    }


}