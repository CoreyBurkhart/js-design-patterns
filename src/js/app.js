//object literal design pattern

{
  let todo = function(todoText, remove, completeTodo) {
    //the element itself
    this.todoText = todoText || '';
    this.id = Symbol(); //unique id for todo removal
    this.inputVisible = true;
    this.completed = false;
    this.completeTodo = completeTodo;
    this.template = document.getElementById('list-template').cloneNode(true);
    this.remove = remove;
    this.removeTodo = function() {
      this.remove(this.id);
    }

    this.edit = function(e) {
      let text = e.target.value;
      if(e.which === 13) {
        console.log('toggled');
        //trigger blur event when enter pressed
        this.input.dispatchEvent(new Event('blur'));
      }
      //keep an internal copy
      this.todoText = text;
      //set this text in the actual element
      this.editElementContent('content', text);
    }

    this.createElement = function() {
      const li = this.template.content.children[0];
      let [input, content, remove, complete] = li.children;

      try {
        input.onkeyup = this.edit.bind(this);
        input.onblur = this.toggleVisibility.bind(this);
        content.onclick = this.toggleVisibility.bind(this);
        remove.onclick = this.removeTodo.bind(this);
        complete.onclick = this.complete.bind(this);
      } catch(e) {
        console.log('could not add event listeners because none were provided', e);
      }
      //if it is a new todo we want the input to be visible
      if(this.todoText === '') {
        console.log('changed todo visibility');
        input.classList.toggle('hidden')
        content.classList.toggle('hidden')
        setTimeout(() => {input.focus()}, 100);
      }

      this.input = input;
      this.element = li;
    }

    this.complete = function(e) {
      if(e.target.checked) {
        this.element.classList.add('complete')
        this.completed = true;
        this.completeTodo(this);
      } else {
        this.element.classList.remove('complete')
        this.completed = false;
      }

    }

    this.toggleVisibility = function(e) {
      let ch = this.element.children;
      let inputCx = ch[0].classList,
          contentCx = ch[1].classList;

      console.log(e);
      if(e.type === 'blur' && !inputCx.contains('hidden')) {
        try {
          if(e.target.value.length < 1) {
            throw 'Todo is empty please provide input';
          } else {
            inputCx.toggle('hidden')
            contentCx.toggle('hidden')
            inputCx.contains('error') ? inputCx.remove('error'): null;
          }
        } catch(e) {
          console.error(e);
          inputCx.contains('error')? null : inputCx.add('error');
        }
      } else if(e.type === 'click' && !contentCx.contains('hidden')) {
        contentCx.toggle('hidden')
        inputCx.toggle('hidden')
        //focus th input when shown
        setTimeout(() => {ch[0].focus()}, 100);
      }
      // this.inputVisible = !this.inputVisible;
      todoList.render();
    }

    this.editElementContent = function(type, text) {
      let ch = this.element.children;
      switch(type) {
        case 'input':
        ch[0].value = text;
        break;
        case 'content':
        ch[1].innerText = text;
        default:
        ch[0].value = text;
        ch[1].innerText = text;
        break;
      }
    }

    this.setDefaultText = function(text) {
      if(text !== '') {
        this.editElementContent(null, text)
      }
    }
    this.createElement();
    this.setDefaultText(todoText);
}
let todoList = {
  savedTodos: ['walk the dog', 'do the dishes', 'wrap gifts', 'make it rain'],
  todos: [],
  cacheDOM: function() {
    this.list = document.getElementById('list')
    this.newTodoButton = document.getElementById('new-todo');
  },
  bindListeners: function() {
    this.newTodoButton.onclick = this.addNewTodo.bind(this);
  },
  init: function() {
    this.removeTodo = this.removeTodo.bind(this)
    this.completeTodo = this.completeTodo.bind(this)
    this.cacheDOM();
    this.bindListeners();
    for(const text of this.savedTodos) {
      let obj = new todo(text, this.removeTodo, this.completeTodo);
      this.todos.push(obj)
    }
    this.render();
  },
  getTodoIndex(id) {
    let index = false;
    this.todos.forEach((ele, i) => {
      if(ele.id === id) {
        index = i;
      }
    })
    return index;
  },
  addNewTodo: function() {
    //makes a todo object and adds it to the array of todo objects
    let obj = new todo(null, this.removeTodo, this.completeTodo);
    this.todos.push(obj);
    this.render();
  },
  removeTodo: function(id) {
    console.log('ran remove');
    const todoIndex = this.getTodoIndex(id)
    this.todos.splice(todoIndex, 1);
    console.log(this.todos);
    this.render();
  },
  completeTodo: function(ele) {
    let index = this.getTodoIndex(ele.id);
    let todo = this.todos.splice(index, 1);
    this.todos.push(todo[0]);
    this.render();
  },
  render: function() {
    let list = this.list;
    list.innerHTML = '';
    this.todos.forEach((ele) => {
      this.list.appendChild(ele.element);
    });
  }
}

  todoList.init();
}
