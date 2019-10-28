document.addEventListener('DOMContentLoaded', e => {

  /**********
   * lazy load
  **********/
  // lazy load IO callback
  function callback_lazyload(entries) {
    Array.prototype.forEach.call(entries, entry => {
      if(entry.isIntersecting) {
        // 將 data-src 的值寫進 src 中
        entry.target.src = entry.target.dataset.src;

        // 停止觀察
        observerLazy.unobserve(entry.target);
      }
    })
  }

  // lazy load IO option
  let option_lazyload = {
    root: null,
    rootMargin: '0px',
    threshold: [0]
  };

  // lazy load create IO
  let observerLazy = new IntersectionObserver(callback_lazyload, option_lazyload);

  // lazyload observe all img.lazy
  const lazyImg = document.querySelectorAll('.lazy');
  Array.prototype.forEach.call(lazyImg, lazy => observerLazy.observe(lazy));



  /**********
   * 進場效果
  **********/
  // animated IO callback
  function callback_animated(entries) {
    Array.prototype.forEach.call(entries, entry => {
      if(entry.isIntersecting) {
        // class 移除 .op-0，加入 data-animated 的值
        entry.target.classList.remove('op-0');
        entry.target.classList.add(entry.target.dataset.animated);

        // 取消觀察
        observerAnimated.unobserve(entry.target);
      }
    })
  }

  // animated IO option
  let option_animated = {
    root: null,
    rootMargin: '0px',
    threshold: [1] // img區塊進到視窗後才執行 animated
  };

  // animated create IO
  let observerAnimated = new IntersectionObserver(callback_animated, option_animated);

  // animated observe all .js-animated
  const animatedIn = document.querySelectorAll('.js-animated');
  Array.prototype.forEach.call(animatedIn, animated => observerAnimated.observe(animated));



  /**********
   * 無限捲動
  **********/
  // infinite IO callback
  const infiniteWrap = document.getElementById('js-infinite-wrap');
  let count = 1;
  function callback_infinite(entries) {
    Array.prototype.forEach.call(entries, entry => {
      if(entry.isIntersecting) {
        fetch('https://jsonplaceholder.typicode.com/posts/' + count)
          .then(res => res.json())
          .then(res => {
            // 取消觀察，以免又觸發下一個 request
            observerInfinite.unobserve(infinite);

            // append html
            let item = `
              <div class="card animated flipInY text-left">
                <img src="https://picsum.photos/id/1${ res.id }/335/335"/>
                <div class="card-body">
                  <div class="card-title font-weight-bold">${ res.title }</div>
                  <div class="card-text">${ res.body }</div>
                </div>
              </div>`;
            infiniteWrap.insertAdjacentHTML('beforeend', item);
            
            count++;
          })
          .then(() => {
            // 載入到 10 個，就關閉觀察器
            if(count <= 10) {
              observerInfinite.observe(infinite);
            } else {
              const end = `<div class="alert alert-warning mt-5 animated fadeInUp" role="alert">無限捲動到10張，結束。</div>`;
              infiniteWrap.insertAdjacentHTML('beforeend', end);
              observerInfinite.disconnect(); // 關閉觀察器
            }
          })
      }
    })
  }

  // infinite IO option
  let option_infinite = {
    root: null,
    rootMargin: '0px',
    threshold: [0]
  };

  // infinite create IO
  let observerInfinite = new IntersectionObserver(callback_infinite, option_infinite);

  // animated observe #js-infinite
  const infinite = document.getElementById('js-detective');
  observerInfinite.observe(infinite);

});