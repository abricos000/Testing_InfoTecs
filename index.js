
const wrapper = document.querySelector('.wrapper');

const dropZones = document.querySelectorAll(".zone");
let dragItems = document.querySelectorAll('.js-wrapper-item');





/**
 * Класс для создания елемента спискa 
 */
class Item {
  /**
  *  конструктор класса для создания елемента списка
  * @constructor
  * @param {object} array массив объектов с элементами списка
  */
  constructor(array) {
    this.array = array     
  }
  /**
  * метод инициализации компонента
  * @param {element} domElement Dom элемент для инициализации
  */
  init(itemElement){ 
    try{
      let zone = document.createElement('div');
      zone.classList.add("zone");
      zone.draggable = "true"
      wrapper.append(zone);
        
      let wrapperItem = document.createElement('div');
      wrapperItem.classList.add("js-wrapper-item");
      zone.append(wrapperItem);
        
      let item = document.createElement('div');
      item.classList.add("js-item");
      item.innerHTML = `${itemElement.title}`;
      wrapperItem.append(item);
        
      let wrapperDescription = document.createElement('div');
      wrapperDescription.classList.add("js-wrapper-description");
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
  _handleMouseDown(zone) {

    zone.onmouseover = function() {
      let tooltip = this.querySelector('.js-wrapper-description')
      tooltip.style.opacity = '1'
      tooltip.style.visibility = 'visible'
      this.querySelector('.js-wrapper-item').style.pointerEvents = 'none'////////////////////////////
    }

    zone.onmouseout = function() {
      let tooltip = zone.querySelector('.js-wrapper-description')
      tooltip.style.opacity = '0'
      tooltip.style.visibility = 'hidden'
      this.querySelector('.js-wrapper-item').style.pointerEvents = 'auto'

    }

    zone.onmousedown = onMouseDown;
    zone.ondragstart = () => {
      return false;
    };
  }

  /**
  * Метод переключения выпадающего списка
  * @param {element} dropDownList DOM элемент в котором необходимо добавлять/удалять селектор 
  * @param {string} listVisible название класса, который необходимо добавлять/удалять
  */
  _handlePopupPanel(itemElement) {

    let popupPanel = document.createElement('div');
    popupPanel.classList.add("js-popupPanel");



      let header = document.createElement('div');
      header.classList.add("js-panel-header");
      popupPanel.append(header);

      let title = document.createElement('div');
      title.classList.add("js-panel-title");
      title.innerHTML = `${itemElement.title}`;
      header.append(title);

      let rating = document.createElement('div');
      rating.classList.add("js-panel-rating");
      rating.innerHTML = `рейтинг: <strong>${itemElement.rating}</strong> / 5 &#10026;`;
      header.append(rating);

      let main = document.createElement('div');
      main.classList.add("js-panel-main");
      popupPanel.append(main);

      let info = document.createElement('div');
      info.classList.add("js-panel-info");
      main.append(info);

      let discountPercentage = document.createElement('div');
      discountPercentage.classList.add("js-discount-percentage");
      discountPercentage.innerHTML = `скидка: <strong>${itemElement.discountPercentage} &#37;</strong>`;
      info.append(discountPercentage);

      let price = document.createElement('div');
      price.classList.add("js-discount-percentage");
      price.innerHTML = `цена: <strong>${itemElement.price} &#36;</strong>`;
      info.append(price);

      let brand = document.createElement('div');
      brand.classList.add("js-brand");
      brand.innerHTML = `brand: <strong>${itemElement.brand}</strong>`;
      info.append(brand);

      let category = document.createElement('div');
      category.classList.add("js-category");
      category.innerHTML = `category: <strong>${itemElement.category}</strong>`;
      info.append(category);

      let description = document.createElement('div');
      description.classList.add("js-description");
      description.innerHTML = `${itemElement.description}`;
      info.append(description);




      let rightPanel = document.createElement('div');
      rightPanel.classList.add("js-panel-rightPanel");
      main.append(rightPanel);

      let slide = document.createElement('div');
      slide.classList.add("js-panel-slide");
      rightPanel.append(slide);



      itemElement.images.forEach((el, index) => {
        let image = document.createElement('img');
        image.classList.add("js-img");
        image.src = el
        if (!index) {
        image.classList.add("photos__inner");
        }
        slide.append(image);
      })

      let btnPref = document.createElement('button');
      btnPref.className = "pref__img"
      btnPref.classList.add("btns__img");
      btnPref.innerHTML = `&#10094;`;
      slide.append(btnPref);


      let btnNext = document.createElement('button');
      btnNext.className = "next__img"
      btnNext.classList.add("btns__img");
      btnNext.innerHTML = `&#10095;`;
      slide.append(btnNext);







      // let imgArray = images.querySelectorAll('.js-img');
        
      // let i = 0;


      // btnNext.addEventListener('click', () => {
      //   console.log('btnNext');
      //   imgArray[i].className = '';
      //   i++;
      //   if ( i >= imgArray.length){
      //     i = 0;
      //   }
      //   imgArray[i].className = 'photos__inner';
      // })

      // btnPref.addEventListener('click', () => {
      //   console.log('btnPref');
      //   imgArray[i].className = '';
      //     i--;
      //     if ( i < 0){
      //       i = imgArray.length - 1;
      //     }
      //     imgArray[i].className = 'photos__inner';
      // })

    return popupPanel;
  }
}







const addData = (json) => {
  console.log(json);
  json.forEach(el => {
    const item = new Item()
    item.init(el)
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



const initialMovingElementPageXY = {
    x: 0,
    y: 0,
    set: (movingElement) => {
      const rect = movingElement.getBoundingClientRect();
      initialMovingElementPageXY.x = rect.x + window.scrollX;
      initialMovingElementPageXY.y = rect.y + window.scrollY;
    },
  };
 
  const shifts = {
    shiftX: 0,
    shiftY: 0,
    set: (clientX, clientY, movingElement) => {
      shifts.shiftX = clientX - movingElement.getBoundingClientRect().left;
      shifts.shiftY = clientY - movingElement.getBoundingClientRect().top;
    },
  };
  
  const moveAt = (element, pageX, pageY) => {
    element.style.transform = `translate(${
      pageX - initialMovingElementPageXY.x - shifts.shiftX
    }px, ${
      pageY - initialMovingElementPageXY.y - shifts.shiftY
    }px) rotate(-3deg)`;
  };
  
  const getElementCoordinates = (node, searchCoordsBy) => {
    const rect = node.getBoundingClientRect();
    return {
      top:
        searchCoordsBy === "by-center"
          ? rect.top + rect.height / 2
          : rect.top + 10,
      left: rect.left + rect.width / 2,
    };
  };
  
  const isAbove = (nodeA, nodeB) => {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
  
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };
  
  let elementBelow

  const getElementBelow = (movingElement, searchCoordsBy) => {
    const movingElementCenter = getElementCoordinates(
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






    let currentDroppable = null;
    let placeholder;
    let isDraggingStarted = false;
    let movingElement;
  
    const processEmptySections = () => {
      document.querySelectorAll(".wrapper").forEach((section) => {
          if (
            !section.querySelector(".zone:not(.emptySectionHiddenLesson)")//////////////////////////////////
          ) {
            const emptySectionHiddenLesson = document.createElement("div");
            emptySectionHiddenLesson.classList.add(
              "zone",////////////////////////////////
              "emptySectionHiddenLesson"
            );
            section.append(emptySectionHiddenLesson);
          } else {
            const emptySectionHiddenLesson = section.querySelector(
              ".emptySectionHiddenLesson"
            );
            emptySectionHiddenLesson &&
              section.removeChild(emptySectionHiddenLesson);
          }
        });
    };
  
    const createPlaceholder = () => {
      placeholder = document.createElement("div");
      placeholder.classList.add("placeholder");
      movingElement.parentNode.insertBefore(placeholder, movingElement);
    };
  
    const onMouseMove = (event) => {
      if (!isDraggingStarted) {






        

          let tooltip = movingElement.querySelector('.js-wrapper-description')/////////////
          tooltip.style.opacity = '0'
          tooltip.style.visibility = 'hidden'





        isDraggingStarted = true;
        createPlaceholder();
        Object.assign(movingElement.style, {
          position: "absolute",
          zIndex: 1000,
          left: `${initialMovingElementPageXY.x}px`,
          top: `${initialMovingElementPageXY.y}px`,
        });
      }
      moveAt(movingElement, event.pageX, event.pageY);
  
      elementBelow = getElementBelow(movingElement, "by-center");
      if (!elementBelow) return;
      let droppableBelow = elementBelow.closest(".zone");//////////////////////////////////
      if (currentDroppable !== droppableBelow) {
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          if (
            !isAbove(movingElement, currentDroppable) ||
            currentDroppable.classList.contains("emptySectionHiddenLesson")
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
  


    const setMovingElement = (event) => {
      movingElement = event.target;

      // event.target.style.pointerEvents = 'none'//////////////////////


    };
  


    const onMouseUp = () => {
      if (!isDraggingStarted) {
        document.removeEventListener("mousemove", onMouseMove);
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
      document.removeEventListener("mousemove", onMouseMove);
      isDraggingStarted = false;
      placeholder && placeholder.parentNode.removeChild(placeholder);
      movingElement.onmouseup = null;
      movingElement = null;
  
      processEmptySections();
    };



  
    const onMouseDown = (event) => {
      setMovingElement(event);
      shifts.set(event.clientX, event.clientY, movingElement);
      initialMovingElementPageXY.set(movingElement);
      document.addEventListener("mousemove", onMouseMove);
      movingElement.onmouseup = onMouseUp;

    };













  
