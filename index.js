const wrapper = document.querySelector('.wrapper');

// const item = document.querySelectorAll(".js-wrapper-item");
const dropZones = document.querySelectorAll('.js-wrapper-item');
const dragItems = document.querySelectorAll('.js-item');


dragItems.forEach(dragItem => {
    dragItem.addEventListener('dragstart', handlerDragstart)
    dragItem.addEventListener('dragend', handlerDragend)
    dragItem.addEventListener('drag', handlerDrag)
})

function handlerDragstart (event) {
    this.classList.add('js-item--active')
    console.log('dragstart', this);
}
function handlerDragend (event) {
    this.classList.remove('js-item--active')
    console.log('dragend', this);
}
function handlerDrag (event) {
    this.classList.remove('js-item--active')
    console.log('drag');
}


const addData = (json) => {
    json.forEach(el => {
        let wrapperItem = document.createElement('div');
        wrapperItem.classList.add("js-wrapper-item");
        wrapper.append(wrapperItem);

        let item = document.createElement('div');
        item.classList.add("js-item");
        item.innerHTML = `${el.title}`;
        item.draggable = 'true';
        // div.onmouseover = function() {
        //     let tooltip = div0.querySelector('.js-wrapper-item-description')
        //     tooltip.style.opacity = '1'
        //     tooltip.style.visibility = 'visible'
        // }
        // div.onmouseout = function() {
        //     let tooltip = div0.querySelector('.js-wrapper-item-description')
        //     tooltip.style.opacity = 'o'
        //     tooltip.style.visibility = 'hidden'
        // }
        wrapperItem.append(item);

        let wrapperDescription = document.createElement('div');
        wrapperDescription.classList.add("js-wrapper-description");
        wrapperItem.append(wrapperDescription);

        let div2 = document.createElement('div');
        div2.classList.add("js-description");
        div2.innerHTML = `${el.description}${el.description}${el.description}`;
        wrapperDescription.append(div2)
    });
}


const handleGetData = async(url) => {
    try {
        const res = await fetch(url)
        const json = await res.json()
        addData(json.products)
    } catch (error) {
        console.log(error);
    }
}

handleGetData('https://dummyjson.com/products')

console.log(dropZones);

dropZones.forEach((el) => {
        el.onmouseover = function() {
            let tooltip = el.querySelector('.js-wrapper-description')
            tooltip.style.opacity = '1'
            tooltip.style.visibility = 'visible'
        }

        el.onmouseout = function() {
            let tooltip = el.querySelector('.js-wrapper-description')
            tooltip.style.opacity = 'o'
            tooltip.style.visibility = 'hidden'
        }
})


