let cout = 10;
let currentData = null;
let numberCurrentList = 0;

const active = {
  opacity: '1',
  visibility: 'visible',
  height: '50px',
  marginTop: '2px',
}
const inactive = {
  opacity: '0',
  visibility: 'hidden',
  height: '0',
  marginTop: '0',
}

const wrapper = "wrapper"
const list = 'js-list'
const zoneItem = "zone"
const wrapperItemSelect = "js-wrapper-item"
const item = "js-item"
const wrapperPopup = "js-wrapper-popup"
const panelPopup = 'js-popup__panel'
const panelHeader = "js-panel-header"
const panelTitle = "js-panel-title"
const panelRating = "js-panel-rating"
const panelMain = "js-panel-main"
const panelInfo = "js-panel-info"
const panelDiscountPercentage = "js-discount-percentage"
const panelBrand = 'js-brand'
const panelCategpry = "js-category"
const panelDescription = "js-description"
const panelSlide = "js-panel-slide"
const panelImg = "js-img"
const panelBtnsImg = "btns__img"
const panelBtnPrev = "prev__img"
const panelBtnNext = "next__img"

const wrapperBtns = "js-btn-wrapper"
const prevList = "js-prev__list"
const prevNext = "js-next__list"
const inactiveBtn = 'js-inactive__button'

const sectionHiddenLesson = "emptySectionHiddenLesson"
const placeholderSelect = "placeholder"

let currentDroppable = null;
let placeholder = null;
let isDraggingStarted = false;
let movingElement = null;
let elementBelow = null;

const shifts = {
  shiftX: 0,
  shiftY: 0,
  set: (clientX, clientY, movingElement) => {
    shifts.shiftX = clientX - movingElement.getBoundingClientRect().left;
    shifts.shiftY = clientY - movingElement.getBoundingClientRect().top;
  },
};

const initialMovingElementPageXY = {
  x: 0,
  y: 0,
  set: (movingElement) => {
    const rect = movingElement.getBoundingClientRect();
    initialMovingElementPageXY.x = rect.x + window.scrollX;
    initialMovingElementPageXY.y = rect.y + window.scrollY;
  },
};


/**
 * Класс для создания елемента спискa 
 */
class Item {
  /**
  * метод инициализации компонента
  * @param {element} itemElement Объект
  */
  init = (itemElement, index) => { 
    try{
      let zone = document.createElement('div');
      zone.classList.add(zoneItem);
      zone.draggable = "true"
      if (index < cout) {
        Object.assign(zone.style, active)
      } else {
        Object.assign(zone.style, inactive)
      }
      document.querySelector(`.${list}`).append(zone)
        
      let wrapperItem = document.createElement('div');
      wrapperItem.classList.add(wrapperItemSelect);
      zone.append(wrapperItem);
        
      let itemBlock = document.createElement('div');
      itemBlock.classList.add(item);
      itemBlock.innerHTML = `${itemElement.title}`;
      wrapperItem.append(itemBlock);
        
      let wrapperDescription = document.createElement('div');
      wrapperDescription.classList.add(wrapperPopup);
      wrapperItem.append(wrapperDescription);
        
      let description = this._handlePopupPanel(itemElement)
      wrapperDescription.append(description)

      this._handleMouseDown(zone)
    } catch (Err) {
      console.error(Err) 
    }        
  }
  /**
  * Метод добавления событий на элемент списка
  * @param {element} zone DOM элемент, на котором будут отлавливаться события 
  */
  _handleMouseDown = (zone) => {
    let tooltip = zone.querySelector(`.${wrapperPopup}`)
    let hover = zone.querySelector(`.${item}`)
    zone.onmouseover = function() {
      hover.style.background = '#d8a470'
      this.style.cursor = 'pointer'
      tooltip.style.opacity = '1'
      tooltip.style.visibility = 'visible'
      this.querySelector(`.${wrapperItemSelect}`).style.pointerEvents = 'none'///////////////////////////
    }

    zone.onmouseout = function() {
      if (this.querySelector(`.${wrapperItemSelect}`).style.pointerEvents === 'none') {
        this.querySelector(`.${wrapperItemSelect}`).style.pointerEvents = 'auto'
        hover.style.background = '#8d6741'
        tooltip.style.opacity = '0'
        tooltip.style.visibility = 'hidden'
      }
    }
    zone.onmousedown = this._onMouseDown;
    zone.ondragstart = () => {
      return false;
    };
  }

  _onMouseDown = (event) => {
    movingElement = event.target;
    shifts.set(event.clientX, event.clientY, movingElement);
    initialMovingElementPageXY.set(movingElement);
    document.addEventListener("mousemove", this._onMouseMove);
    movingElement.onmouseup = this._onMouseUp
  }

  _onMouseUp = () => {//срабатыввет когда отпускаю мышь
    if (!isDraggingStarted) {
      document.removeEventListener("mousemove", this._onMouseMove);
      movingElement.onmouseup = null;
      return;
    }
    placeholder.parentNode.insertBefore(movingElement, placeholder);
    Object.assign(movingElement.style, {
      position: "static",
      left: "auto",
      top: "auto",
      zIndex: "auto",
      transform: "none",
    });
    document.removeEventListener("mousemove", this._onMouseMove);
    isDraggingStarted = false;
    placeholder && placeholder.parentNode.removeChild(placeholder);
    movingElement.onmouseup = null;
    movingElement = null;
    this._processEmptySections();
  };

  _processEmptySections = () => {
    document.querySelectorAll(`.${list}`).forEach((section) => {
        if (!section.querySelector(`.${zoneItem}:not(.${sectionHiddenLesson})`)) {
          const emptySectionHiddenLesson = document.createElement("div");
          emptySectionHiddenLesson.classList.add(
            zoneItem,
            emptySectionHiddenLesson
          );
          section.append(emptySectionHiddenLesson);
        } else {
          const emptySectionHiddenLesson = section.querySelector(
            `.${sectionHiddenLesson}`
          );
          emptySectionHiddenLesson &&
            section.removeChild(emptySectionHiddenLesson);
        }
      });
  };

  _onMouseMove = (event) => {// срабытывает когда идет перетаскивание
    if (!isDraggingStarted) {
        let tooltip = movingElement.querySelector(`.${wrapperPopup}`)
        tooltip.style.opacity = '0'
        tooltip.style.visibility = 'hidden'
      isDraggingStarted = true;
      this._createPlaceholder();
      Object.assign(movingElement.style, {
        position: "absolute",
        zIndex: 10000,
        left: `${initialMovingElementPageXY.x}px`,
        top: `${initialMovingElementPageXY.y}px`,
      });
    }
    this._moveAt(movingElement, event.pageX, event.pageY);
    elementBelow = this._getElementBelow(movingElement, "by-center");
    if (!elementBelow) return;
    let droppableBelow = elementBelow.closest(`.${zoneItem}`);
    if (currentDroppable !== droppableBelow) {
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        if (!this._isAbove(movingElement, currentDroppable) ||
          currentDroppable.classList.contains(sectionHiddenLesson)
        ) {
          currentDroppable.parentNode.insertBefore(
            placeholder,
            currentDroppable
          );
        } else {
          currentDroppable.parentNode.insertBefore(
            placeholder,
            currentDroppable.nextElementSibling
          );
        }
      }
    }
  };

  _createPlaceholder = () => {
    placeholder = document.createElement("div");
    placeholder.classList.add(placeholderSelect);
    movingElement.parentNode.insertBefore(placeholder, movingElement);
  };

  _getElementBelow = (movingElement, searchCoordsBy) => {
    const movingElementCenter = this._getElementCoordinates(
      movingElement,
      searchCoordsBy
    );
    movingElement.hidden = true;
     elementBelow = document.elementFromPoint(
      movingElementCenter.left,
      movingElementCenter.top
    );
    movingElement.hidden = false;
    return elementBelow;
  };

  _moveAt = (element, pageX, pageY) => {
    element.style.transform = `translate(${
      pageX - initialMovingElementPageXY.x - shifts.shiftX
    }px, ${
      pageY - initialMovingElementPageXY.y - shifts.shiftY
    }px) rotate(-3deg)`;
  };
  
  _getElementCoordinates = (node, searchCoordsBy) => {
    const rect = node.getBoundingClientRect();
    return {
      top:
        searchCoordsBy === "by-center"
          ? rect.top + rect.height / 2
          : rect.top + 10,
      left: rect.left + rect.width / 2,
    };
  };
  
  _isAbove = (nodeA, nodeB) => {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };
  /**
  * Метод создания всплывающей панели
  * @param {element} itemElement Объект
  */
  _handlePopupPanel(itemElement) {

    let popup = document.createElement('div');
    popup.classList.add(panelPopup);

    let header = document.createElement('div');
    header.classList.add(panelHeader);
    popup.append(header);

    let title = document.createElement('div');
    title.classList.add(panelTitle);
    title.innerHTML = `${itemElement.title}`;
    header.append(title);

    let rating = document.createElement('div');
    rating.classList.add(panelRating);
    rating.innerHTML = `rating: <strong>${itemElement.rating}</strong> / 5 &#10026;`;
    header.append(rating);

    let main = document.createElement('div');
    main.classList.add(panelMain);
    popup.append(main);

    let info = document.createElement('div');
    info.classList.add(panelInfo);
    main.append(info);

    let discountPercentage = document.createElement('div');
    discountPercentage.classList.add(panelDiscountPercentage);
    discountPercentage.innerHTML = `скидка: <strong>${itemElement.discountPercentage} &#37;</strong>`;
    info.append(discountPercentage);

    let price = document.createElement('div');
    price.classList.add(panelDiscountPercentage);
    price.innerHTML = `price: <strong>${itemElement.price} &#36;</strong>`;
    info.append(price);

    let brand = document.createElement('div');
    brand.classList.add(panelBrand);
    brand.innerHTML = `brand: <strong>${itemElement.brand}</strong>`;
    info.append(brand);

    let category = document.createElement('div');
    category.classList.add(panelCategpry);
    category.innerHTML = `category: <strong>${itemElement.category}</strong>`;
    info.append(category);

    let description = document.createElement('div');
    description.classList.add(panelDescription);
    description.innerHTML = `${itemElement.description}`;
    info.append(description);

    let slide = document.createElement('div');
    slide.classList.add(panelSlide);
    main.append(slide);

    itemElement.images.forEach((el, index) => {
      let image = document.createElement('img');
      image.classList.add(panelImg);
      image.src = el
      image.loading = "lazy"
      if (!index) {
        image.classList.add("photos__inner");
      }
      slide.append(image);
    })

    let btnPrev = document.createElement('button');
    btnPrev.className = panelBtnPrev
    btnPrev.classList.add(panelBtnsImg);
    btnPrev.innerHTML = `&#10094;`;
    slide.append(btnPrev);


    let btnNext = document.createElement('button');
    btnNext.className = panelBtnNext
    btnNext.classList.add(panelBtnsImg);
    btnNext.innerHTML = `&#10095;`;
    slide.append(btnNext);

      // let imgArray = images.querySelectorAll(panelImg);
      // let i = 0;

      // btnNext.addEventListener('click', () => {
      //   imgArray[i].className = '';
      //   i++;
      //   if ( i >= imgArray.length){
      //     i = 0;
      //   }
      //   imgArray[i].className = 'photos__inner';
      // })

      // btnPrev.addEventListener('click', () => {
      //   imgArray[i].className = '';
      //     i--;
      //     if ( i < 0){
      //       i = imgArray.length - 1;
      //     }
      //     imgArray[i].className = 'photos__inner';
      // })
    return popup;
  }
}



let btnWrapper = document.createElement('div');
btnWrapper.className = wrapperBtns
document.querySelector(`.${wrapper}`).append(btnWrapper);

let btnPrev = document.createElement('button');
btnPrev.className = prevList
btnPrev.classList.add(inactiveBtn) 
btnPrev.innerHTML = `prev`;
btnWrapper.append(btnPrev);

let btnNext = document.createElement('button');
btnNext.className = prevNext
btnNext.innerHTML = `next`;
btnWrapper.append(btnNext);


btnNext.addEventListener('click', () => {
  const zone2 = document.querySelectorAll(`.${zoneItem}`)
  btnPrev.classList.remove(inactiveBtn)
  let coutList= Math.ceil(currentData?.length/cout) 
  if (coutList - 1 > numberCurrentList) {
    ++numberCurrentList;
    let startPosition = cout*numberCurrentList;
    let endPosition = startPosition + cout
    zone2.forEach((el, index) => {
      if ((startPosition <= index) && (index < endPosition)) {
        Object.assign(el.style, active)
      } else {
        Object.assign(el.style, inactive)
      }
    })
  }
  if (numberCurrentList === coutList - 1) {
    btnNext.classList.add(inactiveBtn)
  }
})

btnPrev.addEventListener('click', () => {
  const zone2 = document.querySelectorAll(`.${zoneItem}`)
  btnNext.classList.remove(inactiveBtn)
  if (!(numberCurrentList-1)) {
    btnPrev.classList.add(inactiveBtn)
  }
  if (numberCurrentList) {
    let startPosition = cout*numberCurrentList;
    let endPosition = startPosition - cout
    zone2.forEach((el, index) => {
      if ((endPosition <= index) && (index < startPosition)) {
        Object.assign(el.style, active)
      } else {
        Object.assign(el.style, inactive)
      }
    })
    numberCurrentList--
  }
})

const addData = (data) => {
  currentData = data
  const deleteElements = document.querySelectorAll(`.${list}`);
  deleteElements.forEach(deleteElement => {deleteElement.remove()})
  const listBlock = document.createElement('div')
  listBlock.classList.add(list)
  document.querySelector(`.${wrapper}`).append(listBlock)
  data.forEach((el, index) => {
    const item = new Item()
    item.init(el, index)
  });
}

const handleGetData = async(url) => {
    try {
        const res = await fetch(url)
        const json = await res.json()
        addData([...json.products])
        console.log(json.products);
    } catch (error) {
        console.log(error);
    }
}

handleGetData('https://dummyjson.com/products')













 

  




  














  
