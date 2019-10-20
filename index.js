;(function (window, undefined) {
  var Tools = {
    getRandom: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) +  min;
    }
  }
  window.Tools = Tools;
})(window, undefined)

;(function (window) {
  function Parent(options) {
    options = options || {};
    this.width = options.width || 20;
    this.height = options.height || 20;
  }

  Parent.prototype.test = function () {
    console.log('test');
  }
  window.Parent = Parent;
})(window, undefined)


;(function (window, undefined) {
  var position = 'absolute';
  var elements = [];
  function Food(options) {
    options = options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    
    Parent.call(this, options);

    this.color = options.color || 'green';
  }

  Food.prototype = new Parent();
  Food.prototype.constructor = Food;

  Food.prototype.render = function (map) {
    remove();

    this.x = Tools.getRandom(0, map.offsetWidth/this.width - 1) * this.width;
    this.y = Tools.getRandom(0, map.offsetHeight/this.height - 1) * this.height;

    var div = document.createElement('div');
    map.appendChild(div);

    elements.push(div);

    div.style.position = position;
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px';
    div.style.backgroundColor = this.color;
  }

  function remove() {
    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode.removeChild(elements[i]);
      elements.splice(i, 1);
    }
  }

  window.Food = Food;
})(window, undefined)

;(function (window, undefined) {
  var position = 'absolute';
  var elements = [];
  function Snake(options) {
    options = options || {};

    Parent.call(this, options);
   
    this.direction = options.direction || 'right';
    this.body = [
      {x: 3, y: 2, color: 'red'},
      {x: 2, y: 2, color: 'blue'},
      {x: 1, y: 2, color: 'blue'}
    ];
  }

  Snake.prototype = new Parent();
  Snake.prototype.constructor = Snake;

  Snake.prototype.render = function (map) {
    remove();
    for (var i = 0, len = this.body.length; i < len; i++) {
      var object = this.body[i];
      var div = document.createElement('div');
      map.appendChild(div);

      elements.push(div);

      div.style.position = position;
      div.style.width = this.width + 'px';
      div.style.height = this.height + 'px';
      div.style.left = object.x * this.width + 'px';
      div.style.top = object.y * this.height + 'px';
      div.style.backgroundColor = object.color;
    }
  }
  function remove() {
    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode.removeChild(elements[i]);
      elements.splice(i, 1);
    }
  }

  Snake.prototype.move = function (food, map) {
    for (var i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }
    var head = this.body[0];
    switch(this.direction) {
      case 'right': 
        head.x += 1;
        break;
      case 'left': 
        head.x -= 1;
        break;
      case 'top':
        head.y -= 1;
        break;
      case 'bottom':
        head.y += 1;
        break;
    }

    var headX = head.x * this.width;
    var headY = head.y * this.height;
    if (headX === food.x && headY === food.y) {
      var last = this.body[this.body.length - 1];
      this.body.push({
        x: last.x,
        y: last.y,
        color: last.color
      })

      food.render(map);
    }

  }

  window.Snake = Snake;
})(window, undefined)

;(function (window, undefined) {
  var that; 
  function Game(map) {
    this.food = new Food();
    this.snake = new Snake();
    this.map = map;
    that = this;
  }

  Game.prototype.start = function () {
    this.food.render(this.map);
    this.snake.render(this.map);
    runSnake();
    bindKey(); 
   }

  function bindKey() {
    document.addEventListener('keydown', function (e) {
      switch (e.keyCode) {
        case 37: 
          this.snake.direction = 'left';
          break;
        case 38:
          this.snake.direction = 'top';
          break;
        case 39:
          this.snake.direction = 'right';
          break;
        case 40:
          this.snake.direction = 'bottom';
          break;
      }
    }.bind(that), false);
  }

   function runSnake() {
     var timerId = setInterval(function () {
       this.snake.move(this.food, this.map);
       this.snake.render(this.map);

        var maxX = this.map.offsetWidth / this.snake.width;
        var maxY = this.map.offsetHeight / this.snake.height;
        var headX = this.snake.body[0].x;
        var headY = this.snake.body[0].y;
        if (headX < 0 || headX >= maxX) {
          alert('Game Over');
          clearInterval(timerId);
        }

        if (headY < 0 || headY >= maxY) {
          alert('Game Over');
          clearInterval(timerId);
        }
     }.bind(that), 150);
   }

  window.Game = Game;
})(window, undefined)

;(function (window, undefined) {
  var map = document.getElementById('map');
  var game = new Game(map);
  game.start();
})(window, undefined)
