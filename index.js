const wrapperSelector = ".wrapper";
const listClass = 'js-list';
const listSelector = `.${listClass}`;
const zoneClass = "js-zone";
const zoneSelector = `.${zoneClass}`;
const wrapperItemClass = "js-wrapper-item";
const wrapperItemSelect = `.${wrapperItemClass}`;
const itemClass = "js-item";
const wrapperPopupClass = "js-wrapper-popup";
const panelPopupClass = "js-popup-panel";
const panelPopupSelector = `.${panelPopupClass}`;
const panelHeaderClass = "js-panel-header";
const panelTitleClass = "js-panel-title";
const panelRatingClass = "js-panel-rating";
const panelMainClass = "js-panel-main";
const panelInfoClass = "js-panel-info";
const panelDiscountPercentageClass = "js-discount-percentage";
const panelBrandClass = 'js-brand';
const panelCategpryClass = "js-category";
const panelDescriptionClass = "js-description";
const panelSlideClass = "js-panel-slide";
const panelImgClass = "js-img";

const wrapperBtnsClass = "js-btn-wrapper";
const wrapperBtnsSelector = `.${wrapperBtnsClass}`;
const prevListClass = "js-prev-list";
const prevNextClass = "js-next-list";
const inactiveBtnClass = "js-inactive-button";
const optionClass = "js-option";
const wrapperSelectInputClass = "js-wrapper-select-input";
const selectClass = "js-select";
const inputClass = "js-input";

const emptySectionHiddenLessonClass = "js-empty-section-hidden-lesson";
const emptySectionHiddenLessonSelector = `.${emptySectionHiddenLessonClass}`;
const placeholderClass = "js-placeholder";
const pointerEventsClass = "js-pointer-events";
const itemActiveClass = "js-item-active";

const JsonPlaceholder = "https://dummyjson.com/products";

const select = [
  {value: "category", text: "category"},
  {value: "title", text: "title"},
  {value: "price", text: "price"},
  {value: "rating", text: "rating"},
];

let currentData = null;


/**
 * класс для инициализации всей страницы
 */
class Page {

  /**
   * конструктор класса Page
   * @constructor 
   */
  constructor() {
    this.count = 10;
    this.numberCurrentList = 0;
    this.items = [];
    this.firstIndexCurrentList = 0

    this._handleGetData(JsonPlaceholder)
    this._init()
  }

  /**
   * метод инициализации страницы 
   */  
  _init = () => {
    const wrapperSelectInputElement = document.createElement('div');
    wrapperSelectInputElement.className = wrapperSelectInputClass;
    document.querySelector(wrapperSelector).append(wrapperSelectInputElement);

    const inputElement = document.createElement('input');
    inputElement.className = inputClass;
    inputElement.value = this.count;
    wrapperSelectInputElement.append(inputElement);

    const selectElement = document.createElement('select');
    selectElement.className = selectClass;
    wrapperSelectInputElement.append(selectElement);

    const optionDefaultElement = document.createElement('option');
    selectElement.append(optionDefaultElement);

    select.forEach(el => {
      const optionElement = document.createElement('option');
      optionElement.className = optionClass;
      optionElement.value = el.value;
      optionElement.textContent = el.text;
      selectElement.append(optionElement);
    })

    const btnsWrapperElement = document.createElement('div');
    btnsWrapperElement.className = wrapperBtnsClass;
    document.querySelector(wrapperSelector).append(btnsWrapperElement);
  
    const btnPrevElement = document.createElement('button');
    btnPrevElement.className = prevListClass;
    btnPrevElement.classList.add(inactiveBtnClass);
    btnPrevElement.textContent = 'prev';
    btnsWrapperElement.append(btnPrevElement);
  
    const btnNextElement = document.createElement('button');
    btnNextElement.className = prevNextClass;
    btnNextElement.textContent = 'next';
    btnsWrapperElement.append(btnNextElement);

    this._initListeners(btnPrevElement, btnNextElement, inputElement, selectElement);
  }

  /**
   * метод добавления обработчиков событий 
   * @param {HTMLElement} btnPrevElement - кнопка Prev
   * @param {HTMLElement} btnNextElement - кнопка Next
   * @param {HTMLElement} inputElement - поле для ввода количесва выводимых элементов списка
   * @param {HTMLElement} selectElement - селект для сортировки массива
   */  
  _initListeners = (btnPrevElement, btnNextElement, inputElement, selectElement) => {

    btnNextElement.addEventListener('click', () => {
      const coutList= Math.ceil(currentData?.length/this.count); 
      btnPrevElement.classList.remove(inactiveBtnClass);

      if (coutList - 1 > this.numberCurrentList) {
        ++this.numberCurrentList;
        this.firstIndexCurrentList = this.count * this.numberCurrentList;
        let endPosition = this.firstIndexCurrentList + this.count;
        const currentListElement = currentData.slice(this.firstIndexCurrentList, endPosition);
        this._addData(currentListElement);
      };

      if (this.numberCurrentList === coutList - 1 ) {
        btnNextElement.classList.add(inactiveBtnClass);
      };
    })

    btnPrevElement.addEventListener('click', () => {
      btnNextElement.classList.remove(inactiveBtnClass);

      if (!(this.numberCurrentList-1)) {
        btnPrevElement.classList.add(inactiveBtnClass);
      };

      if (this.numberCurrentList) {
        let endPosition = this.count * this.numberCurrentList;
        this.firstIndexCurrentList = endPosition - this.count;
        const currentListElement = currentData.slice(this.firstIndexCurrentList, endPosition);
        this._addData(currentListElement);
        this.numberCurrentList--;
      };
    });

    inputElement.addEventListener('blur', () => {
      const num = Number(inputElement.value);

      if (Number.isInteger(num) && num > 0) {
        this.count = num;
        const currentListElement = currentData.slice(0, this.count);
        this._addData(currentListElement);
      } else {
        inputElement.value = this.count;
      };
    });

    inputElement.addEventListener('keydown', (event) => {

      if (event.key === 'Enter') {
        const num = Number(inputElement.value);

        if (Number.isInteger(num) && num > 0) {
          this.count = num;
          const currentListElement = currentData.slice(0, this.count);
          this._addData(currentListElement);
        } else {
          inputElement.value = this.count;
        };
      };
    });

    selectElement.addEventListener('click', (event) => {
      const newPosts = [...currentData]; 

      if (typeof newPosts[0][`${event.target.value}`] === 'string') {
        newPosts.sort((a, b) => (a[event.target.value]).localeCompare(b[event.target.value]));
      }     

      if (typeof newPosts[0][`${event.target.value}`] === 'number') {
        newPosts.sort((a, b) => {
          if (a[event.target.value] > b[event.target.value]) {
            return -1;
          } else {
            return b[event.target.value] > a[event.target.value] ? 1 : 0;
          };
        });
      };
      currentData = newPosts;
      const currentListElement = currentData.slice(0, this.count);
      this._addData(currentListElement);
    })
  };

  /**
   * метод создания элементов списка 
   * @param {object[]} data - массив текущий объктов которые будут преобразоваться в html элементы
   */
  _addData = (data) => {
    // по всем зонам нужно проходить и удалять каждую. Метод внутри зоны должен удалять себя же и обработчики которые были созданы
    const deleteElements = document.querySelectorAll(zoneSelector);
    deleteElements.forEach(deleteElement => {
      deleteElement.remove();
    });
    // this.items = [];
    // const listElement = document.createElement('div')
    // listElement.classList.add(listClass)
    // document.querySelector(wrapperSelector).append(listElement)


    if (this.count >= currentData.length) {
      document.querySelector(wrapperBtnsSelector).style.opacity = '0';
      document.querySelector(wrapperBtnsSelector).style.cursor = 'none';
    } else {
      document.querySelector(wrapperBtnsSelector).style.opacity = '1';
      document.querySelector(wrapperBtnsSelector).style.cursor = 'pointer';
    };

    data.forEach(el => {
      this.items.push(new Item(el, this.count, this.firstIndexCurrentList, currentData));
    });
  };

  /**
   * метод создания списка 
   * @param {object[]} responseJSON - ответ с сервера
   */
  _addDataAll = (responseJSON) => {
    currentData = [...responseJSON];
    const listElement = document.createElement('div');
    listElement.classList.add(listClass);
    document.querySelector(wrapperSelector).append(listElement);

    const currentListElement = currentData.slice(0, this.count);
    this._addData(currentListElement);
  };

  /**
   * асинхронный метод обрабатывающий ответ с сервера
   * @param {string} url - ссылка
   */
  _handleGetData = async(url) => {
    try {
        const res = await fetch(url);
        const responseJSON = await res.json();
        this._addDataAll(responseJSON.products);
    } catch (error) {
        console.log(error);
    };
  };
};

new Page();


/**
 * Класс для создания элемента спискa 
 */
class Item {

  /**
   * @constructor 
   * @param {object} itemData - объект
   * @param {object[]} numberCurrentList - текущий массив объектов для инициализации
   * @param {number} firstIndexCurrentList - порядковый номер первого елемента текущего массива из общих данных
   */
  constructor (itemData, numberCurrentList, firstIndexCurrentList) {

    this.firstIndexCurrentList = firstIndexCurrentList;
    this.statusPopup = false;
    this.numberCurrentList = numberCurrentList;
    this.itemData = itemData;
    this.isDraggingStarted = false;
    this.currentDroppable = null;
    this.placeholder = null;
    this.movingElement = null;
    this.elementBelow = null;
    this.element = null;
    this.item =null;
    this.wrapperPopupElement = null;

    this.shifts = {
      shiftX: 0,
      shiftY: 0,
      set (clientX, clientY, movingElement) {
        const rect = movingElement.getBoundingClientRect();
        this.shiftX = clientX - rect.left;
        this.shiftY = clientY - rect.top;
      },
    };

    this.initialMovingElementPageXY = {
      x: 0,
      y: 0,
      set (movingElement) {
        const rect = movingElement.getBoundingClientRect();
        this.x = rect.x + window.scrollX;
        this.y = rect.y + window.scrollY;
      },
    };

    this._init();
}
  /**
  * метод инициализации элемента массива
  */
  _init = () => {
    try{
      const zoneElement = document.createElement('div');
      zoneElement.classList.add(zoneClass);
      zoneElement.id = this.itemData.id;
      this.element = zoneElement;

      const wrapperItemElement = document.createElement('div');
      wrapperItemElement.classList.add(wrapperItemClass);
      zoneElement.append(wrapperItemElement);
        
      const itemElement = document.createElement('div');
      itemElement.classList.add(itemClass);
      itemElement.textContent = this.itemData.title;
      wrapperItemElement.append(itemElement);
      this.item = itemElement;
        
      const wrapperPopupElement = document.createElement('div');
      wrapperPopupElement.classList.add(wrapperPopupClass);
      wrapperItemElement.append(wrapperPopupElement);
      this.wrapperPopupElement = wrapperPopupElement;

      this._initListeners();

      if (document.querySelector(listSelector)) {
        document.querySelector(listSelector).append(zoneElement);
      }

    } catch (Err) {
      console.error(Err);
    }        
  };

  /**
   * Метод добавления событий на элемент списка
   */
  _initListeners = () => {
    this.element.addEventListener('mouseover', this._onMouseOver );
    this.element.addEventListener('mouseout', this._onMouseOut);
    this.element.addEventListener('mousedown', this._onMouseDown);
    this.element.addEventListener("mousemove", this._onZoneMouseMove);
  };

  /**
   * Метод добавления всплывающего окна и активного цвета элементу списка
   */
  _onZoneMouseMove = () => {
         
    if (!this.isDraggingStarted && !this.element.querySelector(panelPopupSelector)){
      const itemPopup = new Popup(this.itemData);
      this.wrapperPopupElement.append(itemPopup._init());
      this.item.classList.add(itemActiveClass);
    }
  };

  /**
   * Метод удаления всплывающего окна и активного цвета элементу списка
   */
  _onMouseOut = () => {

    if (this.element.querySelector(panelPopupSelector)) {
      this.element.querySelector(panelPopupSelector).remove();
    };
    
    this.item.classList.remove(itemActiveClass);
    this.element.querySelector(wrapperItemSelect).classList?.remove(pointerEventsClass);
  };

  _onMouseOver = () => {
         
    if (!this.isDraggingStarted && !this.element.querySelector(panelPopupSelector)){
      this.element.querySelector(wrapperItemSelect).classList.add(pointerEventsClass);
    }
  };

  _onMouseDown = (event) => {
    this.movingElement = event.target;
    this.shifts.set(event.clientX, event.clientY, this.movingElement);
    this.initialMovingElementPageXY.set(this.movingElement);

    document.addEventListener("mousemove", this._onMouseMove);

    this.movingElement.addEventListener('mouseup', this._onMouseUp);
  };

  /**
   *  метод метод изменения массива после drag and drop
   */ 
  _changeCurrentArray = () => {
    const zoneElements = Object.values(document.querySelectorAll(zoneSelector));
    const indexElement = zoneElements.findIndex(el => el.id === this.movingElement.id);
    const curentElement = currentData.find(el => el.id == this.movingElement.id);
    const newArray = currentData.filter(item => !(item.id == this.movingElement.id));
    const indexNewPosition = this.firstIndexCurrentList + indexElement;

    const newArr = newArray.reduce((pref, el, index) => {

      if( index === indexNewPosition) {
          pref.push(curentElement);
        }
        pref.push(el);
      return pref;
    }, []);

    if( newArray.length === indexNewPosition ) {
      newArr.push(curentElement);
    }

    currentData = [...newArr];
  };

  /**
   *  метод срабатывающий при mouse up
   */ 
  _onMouseUp = () => {//срабатыввет когда отпускаю мышь
    
    if (!this.isDraggingStarted) {
      document.removeEventListener("mousemove", this._onMouseMove);
      return;
    }
    this.placeholder.parentNode.insertBefore(this.movingElement, this.placeholder);

    Object.assign(this.movingElement.style, {
      position: "static",
      left: "auto",
      top: "auto",
      zIndex: "auto",
      transform: "none",
    });

    document.removeEventListener("mousemove", this._onMouseMove);
    this.isDraggingStarted = false;
    this.placeholder && this.placeholder.parentNode.removeChild(this.placeholder);
    this.movingElement.onmouseup = null;
    this._processEmptySections();
    this._changeCurrentArray();
    this.movingElement = null;
  };

  _processEmptySections = () => {
    document.querySelectorAll(listSelector).forEach(section => {

      if (!section.querySelector(`${zoneSelector}:not(${emptySectionHiddenLessonSelector})`)) {
        const emptySectionHiddenLesson = document.createElement("div");

        emptySectionHiddenLesson.classList.add(zoneClass, emptySectionHiddenLesson);
        section.append(emptySectionHiddenLesson);
      } else {
        const emptySectionHiddenLesson = section.querySelector(emptySectionHiddenLessonSelector);
        emptySectionHiddenLesson && section.removeChild(emptySectionHiddenLesson);
      }
    });
  };

// посмотреть про тротлинг, в последний момент, не забыть
  _onMouseMove = (event) => {// срабытывает когда идет перетаскивание

    if (!this.isDraggingStarted) {

      if (this.movingElement.querySelector(panelPopupSelector)) {
        this.movingElement.querySelector(panelPopupSelector).remove()
      }
      this.isDraggingStarted = true;
      this._createPlaceholder();

      Object.assign(this.movingElement.style, {
        position: "absolute",
        zIndex: 10000,
        left: `${this.initialMovingElementPageXY.x}px`,
        top: `${this.initialMovingElementPageXY.y}px`,
      });
    }

    this._moveAt(this.movingElement, event.pageX, event.pageY);
    this.elementBelow = this._getElementBelow(this.movingElement, "by-center");

    if (!this.elementBelow) return;

    const droppableBelow = this.elementBelow.closest(zoneSelector);
    this.currentDroppable = droppableBelow;

    if (this.currentDroppable) {

      if (!this._isAbove(this.movingElement, this.currentDroppable) ||
      this.currentDroppable.classList.contains(emptySectionHiddenLessonClass)
      ) {
        this.currentDroppable.parentNode.insertBefore(
          this.placeholder,
          this.currentDroppable
        );
      } else {
        this.currentDroppable.parentNode.insertBefore(
          this.placeholder,
          this.currentDroppable.nextElementSibling
        );
      }
    }
  };

  /**
   *  метод создания placeholder
   */ 
  _createPlaceholder = () => {
    this.placeholder = document.createElement("div");
    this.placeholder.classList.add(placeholderClass);
    
    if (this.movingElement.parentNode) {
      this.movingElement.parentNode.insertBefore(this.placeholder, this.movingElement);
    }
  };

  _getElementBelow = (movingElement, searchCoordsBy) => {

    const movingElementCenter = this._getElementCoordinates(
      movingElement,
      searchCoordsBy
    );
    movingElement.hidden = true;

    this.elementBelow = document.elementFromPoint(
      movingElementCenter.left,
      movingElementCenter.top
    );

    movingElement.hidden = false;

    return this.elementBelow;
  };

  _moveAt = (element, pageX, pageY) => {
    element.style.transform = `translate(${
      pageX - this.initialMovingElementPageXY.x - this.shifts.shiftX
    }px, ${
      pageY - this.initialMovingElementPageXY.y - this.shifts.shiftY
    }px) rotate(-3deg)`;
  };

  _getElementCoordinates = (node, searchCoordsBy) => {
    const rect = node.getBoundingClientRect();

    return {
      top: searchCoordsBy === "by-center" ? rect.top + rect.height / 2 : rect.top + 10,
      left: rect.left + rect.width / 2,
    };
  };

  _isAbove = (nodeA, nodeB) => {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };

  /**
   *  метод удаления самого экзепляра класса
   */ 
  _remove() {
    this.element.remove();
    this._removeListeners();
  };

  /**
   *  метод отписка от всех событий
   */ 
  _removeListeners() {
    document.removeEventListener("mousemove", this._onMouseMove);
    this.movingElement.removeEventListener('mouseup', this._onMouseUp);
    this.element.removeEventListener('mouseover', this._onMouseOver);
    this.element.removeEventListener('mouseout', this._onMouseOut);
    this.element.removeEventListener('mousedown', this._onMouseDown);
    this.element.removeEventListener("mousemove", this._onZoneMouseMove);
  };
}


/**
 * Класс для создания всплывающей панели элемента спискa 
 */ 
class Popup {

  /**
   * конструктор класса для создания всплывающей панели элемента спискa 
   * @constructor
   * @param {object} itemData Объект 
   */
  constructor (itemData) {
    this.itemData = itemData;
  };

/**
 * метод инициализации всплывающей панели 
 * @returns {HTMLElement}  
 */ 
  _init = () => {
    const popupElement = document.createElement('div');
    popupElement.classList.add(panelPopupClass);

    const headerElement = document.createElement('div');
    headerElement.classList.add(panelHeaderClass);
    popupElement.append(headerElement);

    const titleElement = document.createElement('div');
    titleElement.classList.add(panelTitleClass);
    titleElement.textContent = this.itemData.title;
    headerElement.append(titleElement);

    const ratingElement = document.createElement('div');
    ratingElement.classList.add(panelRatingClass);
    ratingElement.innerHTML = `rating: <strong>${this.itemData.rating}</strong> / 5 &#10026;`;
    headerElement.append(ratingElement);

    const mainElement = document.createElement('div');
    mainElement.classList.add(panelMainClass);
    popupElement.append(mainElement);

    const infoElement = document.createElement('div');
    infoElement.classList.add(panelInfoClass);
    mainElement.append(infoElement);

    const discountPercentageElement = document.createElement('div');
    discountPercentageElement.classList.add(panelDiscountPercentageClass);

    discountPercentageElement.innerHTML = 
      `discount: <strong>
        ${this.itemData.discountPercentage}&#37;
      </strong>`;

    infoElement.append(discountPercentageElement);

    const priceElement = document.createElement('div');
    priceElement.classList.add(panelDiscountPercentageClass);
    priceElement.innerHTML = `price: <strong>${this.itemData.price} &#36;</strong>`;
    infoElement.append(priceElement);

    const brandElement = document.createElement('div');
    brandElement.classList.add(panelBrandClass);
    brandElement.innerHTML = `brand: <strong>${this.itemData.brand}</strong>`;
    infoElement.append(brandElement);

    const categoryElement = document.createElement('div');
    categoryElement.classList.add(panelCategpryClass);
    categoryElement.innerHTML = `category: <strong>${this.itemData.category}</strong>`;
    infoElement.append(categoryElement);

    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add(panelDescriptionClass);
    descriptionElement.textContent = this.itemData.description;
    infoElement.append(descriptionElement);

    const slideElement = document.createElement('div');
    slideElement.classList.add(panelSlideClass);
    mainElement.append(slideElement);

    const imageElement = document.createElement('img');
    imageElement.classList.add(panelImgClass);
    imageElement.src = this.itemData.thumbnail;
    slideElement.append(imageElement);

    return popupElement;
  }
}






 

  











  
