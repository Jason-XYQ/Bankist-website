'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////

// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////////////////
//PAge navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     //阻止默认的跳转行为
//     e.preventDefault();
//     //获得绝对地址
//     // const id = this.href;
//     //相对地址
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//事件委托 点击  --> 事件生成 捕获 目标元素 冒泡 向上 父元素执行回调函数
//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(this);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed component

tabsContainer.addEventListener('click', function (e) {
  //COOL
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  //Guard clause 保护条款
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Active tab
  clicked.classList.add('operations__tab--active');
  //Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation
//eventHandler function 只接受一个参数就是event
const handleHover = function (e) {
  // console.log(this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//BUG nav.addEventListwner('mouseover',handerHover(e,0.5))
//Passing Arguments to Event Handles     必须是收到调用这个回调函数
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

//COOL //给document元素绑定监听事件时 this默认指向元素
// bind creates a copy of the function that it's call on
//bind生成了一个调用它的函数的副本 并将传入的值作为this  this=0.5
//默认情况下，this === e.currentTarget 即this指向绑定监听事件的元素  但是如果我们在bing()传入了一个值 那么this就会等于这个值
//使用bind给eventHandler传递参数  参数(任何值)=this
//Passing 'argument' into handler
// nav.addEventListener('mouseover', handleHover.bind(0.5));
// nav.addEventListener('mouseout', handleHover.bind(1));

// //Sticky navigation
// window.addEventListener('scroll', function () {
//   const initialCoords = section1.getBoundingClientRect();
//   console.log(initialCoords);
//   //相对于视口的移动距离
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
// Sticky navigation : Intersection Observer API

//不论向上还是向下滚动 只要超过阈值 或者超过阈值之后又低于阈值 这个回调函数都会被调用
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   //target ele is intersecting the viewport at 10%
//   //root:null 所以相交的元素时视口 threshold:0.1 所以是目标元素的10%的地方与视口相交
//   //与视口内部相交的部分阈值为10% 低于10% isIntersecting: false
//   //root是与目标元素相交的元素
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// //section1 是目标元素
// observer.observe(section1);
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  // console.log(entries);
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  //导航条在header完全退出视口前（在实际达到阈值前）的90px位置出现 刚好不会占据section1的空间
  //只是个视觉上的边距
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Reveal section
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //取消对当前元素的观察
  observer.unobserve(entry.target);
  // console.log(entry);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //元素占据空间 但不可见 visibility：hidden  opacity:0
  // section.classList.add('section--hidden');
});

//Lazy loading images
//寻找有data-src属性的img标签
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  // 只有一个阈值 所有只有一个条目  取entries[0] 即可
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // before reach
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;

  //BUG 注意使用querySelectorAll得到的是数组 必须先遍历元素才可使用  query的时候要用‘./#’
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.3) translateX(-800px)';
  // slider.style.overflow = 'visible';

  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    //COOL 利用【】选择符合条件的元素
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      // come from experience
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    //curSlide:1 -100% 0% 100% 200%
    activateDot(curSlide);
  };

  //Pre Slide
  const preSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    //初始化 先创建 后激活
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();
  //Even handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', preSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') preSlide();
    //另一种写法 短路与
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;
      // 同名变量 对象的解构赋值
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////

/*
///////////////////////////////////////
// Modal window
//Selecting , Creating and Deleting elements

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////////////////////////////////////
//Selecting elements
//获取整个dom文档 或者说整个网页
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
//querySelectorAll获取的是节点列表  不会自动更新
const allSections = document.querySelectorAll('.section');
console.log(allSections);

//这里不用#id
document.getElementById('section-1');
//getElementsByTagName 获取的是HTML集合  会自动更新
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements
//.insertAdjacentHTML

//message是个代表DOM元素的对象
//create
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics';
message.innerHTML =
  'We use cookied for improved functionality and analytics .<button class="btn btn--close--cookie"> Got it</button>';

//insert as first child
// header.prepend(message);
//DOM元素时唯一的  一开始在第一个节点 后来移动到最后一个节点  一次只能存在一个地方
//insert as last child
header.append(message);
//可以通过复制节点在多个位置插入一样的节点
// header.append(message.cloneNode(true));
// header.before(message)
// header.after(message);

//Delete elements
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
    //老式用法
    // message.parentElement.removeChild(message);
  });

//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
console.log(getComputedStyle(message).height);

document.documentElement.style.setProperty('--color-primary', 'pink');
console.log(document.documentElement);

//Attribute
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);

//Non-standard
console.log(logo.designer);
//自定义的属性可以通过getAttribute访问  不可以直接logo.designer(undefined)
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

//绝对路径
console.log(logo.src);
//相对路径
console.log(logo.getAttribute('src'));
const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes

//Don't use
logo.className = 'jonas';
*/
/*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  // 相对视口的位置（left,top）
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  //相对于浏览器（页面起始）滚动了多少
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   // 直接获取视口的宽度和高度
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //Scrolling
  // window.scrollTo(s1coords.left, s1coords.top);
  // window.scrollTo(
  //   //current position + current scroll
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////////////////////////////////////////////////////
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('hellosa  ');
  //第一种解除事件监听的方式
  // h1.removeEventListener('mouseenter', alertH1);
};
//1.
h1.addEventListener('mouseenter', alertH1);
//第二种解除事件监听的方式
setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000);
//2.
// h1.onmouseenter = function (e) {
//   alert('hellojj');
// };
//使用addEventListener 可以删除监听事件 起到只执行一次监听事件的作用
//3. html上也可以绑定事件
//<h1 onclick = alert('helloww)><h1>
*/
/*
//每个DOM元素既要监听绑定在自身的事件  也要监听从子元素冒泡上来的事件

//rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  //e.target == where event first happens
  //e.currentTarget  === this == 事件绑定的地方
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  //停止事件的传播
  // e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
//默认是在冒泡阶段监听事件  如果需要在捕获阶段就监听事件 将addEventListener的第三个参数设置为true
//此时在捕获阶段就会开始监听事件 执行回调函数 点击超链接link:  NAV-->CONTAINER-->LINK
// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   true
// );
*/
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
/*
const h1 = document.querySelector('h1');

//Going downwards: child
console.log(h1.querySelector('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
//离h1元素最近的包含有header类的父元素
h1.closest('.header').style.background = 'var( --gradient-secondary)';

h1.closest('h1').style.background = 'var( --gradient-primary)';
//querySelector寻找的是子元素  closest寻找的是父元素

//Going slideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== 'h1') el.style.transform = 'scale(0.5)';
});
*/
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
