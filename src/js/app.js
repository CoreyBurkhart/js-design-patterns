//object literal design pattern

// (function(){
let todo = function(todoText) {
  //the element itself
  this.todoText = todoText || '';
  this.inputValue = todoText || '';
  this.inputStyle = todoText ? 'none' : 'inline-block';
  this.contentStyle = todoText ? 'inline-block' : 'none';
  //the associated event handlers
  this.removeHandler = function(e) {
    //removes todo from the array and re-renders
    todoList.removeTodo(this.todoText);
  }
  this.typeHandler = function(e) {
    //adds user input to list item
    this.todoText = e.target.value;
  }
  this.editHandler = function(e) {
    //show input, hide content

    this.inputStyle = 'inline-block';
    this.contentStyle = 'none';
    this.makeElement();
    todoList.render();
  }
  this.blurHandler = function(e) {
    //user is done inputing, hide input, show content
    this.inputStyle = 'none';
    this.contentStyle = 'inline-block';
    this.makeElement();
    todoList.render();
  }
  this.bindEvents = function(ele) {
    let ch = ele.children;
    ch[0].onkeypress = this.typeHandler.bind(this)
    ch[0].onblur = this.blurHandler.bind(this)
    ch[1].onclick = this.editHandler.bind(this)
    ch[2].children[0].onclick = this.removeHandler.bind(this)
    return ele;
  }
  this.makeElement = function() {
    let li = document.createElement('li');
    let temp = `<input type="text" value="${this.inputValue}" name="newTodo" style="display: ${this.inputStyle}">
        <span id="li-content" style="display: ${this.contentStyle}">
          ${this.todoText}
        </span>
        <span class="delete-button">
          <i class="fa fa-close"></i>
        </span>`;
      li.innerHTML = temp;
      li = this.bindEvents(li);
      this.element = li;
      return li;
    }
    this.element = this.makeElement();
}

  let todoList = {
    todos: ['walk the dog'],
    todoElements: [],
    cacheDOM: function() {
      this.list = document.getElementById('list')
      this.newTodoButton = document.getElementById('new-todo');
    },
    bindListeners: function() {
      this.newTodoButton.onclick = this.addBlankTodo.bind(this);
    },
    removeTodo: function(text) {
      const index = this.todos.indexOf(text);
      if(index !== -1 ) {
        console.log(`removed ${text} from todo array`);
        this.todos.splice(index, 1);
        this.todoElements.splice(index, 1);
        this.render();
      }
    },
    init: function() {
      this.cacheDOM();
      this.bindListeners();
      this.render();
    },
    addBlankTodo: function() {
      this.todos.push('');
      this.render();
    },
    render: function() {
      const list = this.list;
      list.innerHTML = '';
      for(const text of this.todos) {
        let obj = new todo(text)
        this.todoElements.push(obj)
      }
      this.todoElements.forEach((ele) => {
        this.list.appendChild(ele.element);
      });
    }
  }

  todoList.init();
// })()
