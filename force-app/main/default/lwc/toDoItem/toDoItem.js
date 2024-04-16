import { LightningElement, api } from 'lwc';
import updateToDO from '@salesforce/apex/ToDoController.updateToDO';
import deleteToDo from '@salesforce/apex/ToDoController.deleteToDo';

export default class ToDoItem extends LightningElement {
    @api todoId;
    @api todoName;
    @api done = false;

    updateHandler(){
        const todo = {
            todoID : this.todoId,
            todoName : this.todoName,
            done : !this.done
        };

        updateToDO({payload : JSON.stringify(todo)})
        .then(result =>{
            console.log("To-Do updated succesfully");
            const updateEvent = new CustomEvent('update');
            this.dispatchEvent(updateEvent);
        })
        .catch(error => {
            console.error("Update Todo failed " + error);
            console.log(this.todoID);
        });
    }

    deleteHandler(){
        deleteToDo({todoId : this.todoId})
        .then(result =>{
            console.log("Item deleted succesfully");
            const deleteEvent = new CustomEvent('delete');
            this.dispatchEvent(deleteEvent);
        }).catch(error =>{
            console.error("Error in deleting todo item "+ error);
        })
    }

    get containerClass(){
        return this.done ? "todo completed" : "todo upcoming";
    }

    get iconName(){
        return this.done ? "utility:check" : "utility:add";
    }
}