export default class Predict{
    constructor(){
        this.initVars();
        this.getPredictableElements();

        this.getElementsPositions();

        this.onMouseMove = this.onMouseMove.bind(this);
        this.getElementsPositions = this.getElementsPositions.bind(this);

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('scroll', this.getElementsPositions);
    }

    initVars(){
        this.elements = [];

        // Mise en place d'un Timer pour améliorer la précision du mouvement de souris
        this.prevTime = new Date().getTime();
        this.currTime = this.prevTime;

        this.prevMousePosition = { x: null, y: null };
        this.currMousePosition = { x: null, y: null };

        this.activeElement = null;
    }
    getPredictableElements(){
        [].slice.call(document.getElementsByClassName('predictable')).forEach(el => {
            this.elements.push({element: el});
        });
    }
    getElementsPositions(){
        this.elements.forEach(el => {  
            let rect = el.element.getBoundingClientRect();

            el.top = rect.top;
            el.left = rect.left;
            el.bottom = rect.bottom;
            el.right = rect.right;
        });
    }
    onMouseMove(event){
        this.currTime = new Date().getTime();
        if(this.currTime - this.prevTime < 150) return;
        this.prevTime = this.currTime;
        
        this.prevMousePosition = {
            x: this.prevMousePosition.x ? this.currMousePosition.x : event.clientX,
            y: this.prevMousePosition.x ? this.currMousePosition.y : event.clientY,
        }

        this.currMousePosition.x = event.clientX;
        this.currMousePosition.y = event.clientY;

        this.updateDirection();
    }

    updateDirection(){
        if(this.prevMousePosition.x === this.currMousePosition.x && this.prevMousePosition.y === this.currMousePosition.y) return;

        let direction = this._getDirection("x", "left", "right", []);
        direction = this._getDirection("y", "top", "bottom", direction);

        let filtered = this.elements.filter(el => {
            if(direction.indexOf("left") !== -1){
                if(el.right >= this.currMousePosition.x) return false; 
            } else if(el.left < this.currMousePosition.x) return false;
            
            if(direction.indexOf('top') !== -1){
                if(el.bottom >= this.currMousePosition.y) return false;
            } else if(el.top < this.currMousePosition.y) return false;
            return true;
        });
        let closestIndex = 0;

        if(filtered.length === 0) return;
        if(filtered.length > 1){
            closestIndex = this.findClosestFromMouse(filtered);
        }
        
        if(this.activeElement !== filtered[closestIndex].element){
            this.activeElement = filtered[closestIndex].element;
            this.elements.forEach(el => { el.element.classList.remove('predictable--active'); });
            filtered[closestIndex].element.classList.add('predictable--active');
        }
        console.log(filtered[closestIndex].element);
    }

    _getDirection(value, direction_1, direction_2, directionArray){
        if(this.currMousePosition[value] < this.prevMousePosition[value]) directionArray.push(direction_1);
        else if(this.currMousePosition[value] > this.prevMousePosition[value]) directionArray.push(direction_2);
        return directionArray;
    }

    findClosestFromMouse(list){
        let lower = -1;
        let lowest = -1;
        for(let i = 0; i < list.length; i++){
            let itemPos = list[i].left + list[i].top + list[i].width / 2 + list[i].height/2;
            let mousePos = this.currMousePosition.x + this.currMousePosition.y;

            let dist = Math.abs(itemPos - mousePos);

            if(lowest === -1){
                lowest = dist;
                lower = i;
            } else {
                if(dist < lowest){
                    lowest = dist;
                    lower = i;
                }
            }
        }
        return lower;
    }
}