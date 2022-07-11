import React from "react";
import { useLocalStorage } from './useLocalStorage';

const TodoContext = React.createContext();

function TodoProvider(props) {
    const [openModal, setOpenModal] = React.useState(false);

    const {
        item: todos,
        saveItem: saveTodo,
        loading,
        error,
        } = useLocalStorage('TODOS_V1', []);
    const [searchValue, setSearchValue ] = React.useState('');
    
    const completedTodos = todos.filter(todo => !!todo.completed).length;
    const totalTodos = todos.length;
    
    let searchedTodos = [];
    
    if(!searchValue.length >= 1){
        searchedTodos = todos;
    }
    else {
    searchedTodos = todos.filter(todo => {
        const todoText = todo.text.toLowerCase();
        const searchText = searchValue.toLowerCase();
        return todoText.includes(searchText)
        })
    }
    
    const saveTodos = (newTodos) => {
        const stringifiedTodos = JSON.stringify(newTodos);
        localStorage.setItem('TODOS_V1',stringifiedTodos);
        saveTodo(JSON.parse(localStorage.getItem('TODOS_V1')));
    };
    
    const completeTodos = (text) => {
        const todoIndex = todos.findIndex(todo => todo.text === text);
        const newTodos = [...todos];
        newTodos[todoIndex].completed = true;
        saveTodos(newTodos);
    };

    const addTodos = (text) => {
        const newTodos = [...todos];
        newTodos.push({
            completed: false,
            text: text,
            }
        );
        saveTodos(newTodos);
    };
    
    const deleteTodos = (text) => {
        const todoIndex = todos.findIndex(todo => todo.text === text);
        const newTodos = [...todos];
        newTodos.splice(todoIndex, 1)
        saveTodos(newTodos);
    };    
    return(
        <TodoContext.Provider value={{
            error,
            loading,
            totalTodos,
            completedTodos,
            searchValue,
            setSearchValue,
            searchedTodos,
            addTodos,
            completeTodos,
            deleteTodos,
            setOpenModal,
            openModal,
        }}>
            {props.children}
        </TodoContext.Provider>
    );
}

export {TodoContext,TodoProvider};