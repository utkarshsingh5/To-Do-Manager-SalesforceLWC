/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, track } from 'lwc';
import addToDO from '@salesforce/apex/ToDoController.addToDO';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';
export default class ToDoManger extends LightningElement {
    @track time = "6:18 PM"
    @track greeting = "Good Evening"
    @track todos = [];

    connectedCallback(){
        this.getTime();
        this.fetchToDos();
        setInterval(() => {
            this.getTime();
        }, 1000);
    }

    getTime(){
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)} ${this.getMidDay(hour)}`
        this.setGreeting(hour);
    }

    getHour(hour){
        return hour === 0 ? 12 : hour > 12 ? (hour-12) : hour ;  
    }

    getMidDay(hour){
        return hour < 12 ? "AM" : "PM";
    }

    getDoubleDigit(digit){
        return digit < 10 ? "0"+digit : digit;
    }

    setGreeting(hour){
        if(hour < 12){
            this.greeting = "Good Morning";
        } else if (hour >= 12 && hour < 17){
            this.greeting = "Good Afternoon";
        } else {
            this.greeting = "Good Evening";
        }
    }

    addTodoHandler(){
        const inputBox = this.template.querySelector("lightning-input");
        const todo = {
            todoName : inputBox.value,
            done: false
        }

        addToDO({payload : JSON.stringify(todo)}).then(result =>{
            if(result){
            console.log("To-Do item inserted Succesfully");
            this.fetchToDos();
            }
        })
        .catch(error =>{
            console.error("Error in inserting To-Do item " + error);
        })   
        //this.todos.push(todo);
        inputBox.value="";
    }

    fetchToDos(){
        getCurrentTodos().then(result =>{
            if(result){
            console.log("To-Do item fetched Succesfully", result.length);
            this.todos = result;
            } 
        }).catch(error =>{
            console.error("Error in fetching To-Do item " + error);
        })
    }

    updateHandler(){
        this.fetchToDos();
    }

    deleteHandler(){
        this.fetchToDos();
    }

    get upComingTask() {
        return this.todos && this.todos.length ? this.todos.filter(todo => !todo.done) : [];
    }

    get completedTask() {
        return this.todos && this.todos.length ? this.todos.filter(todo => todo.done) : []
    }
}