
import React from 'react';
import { styles } from '../../styles';
import { Todo } from '../../types';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
    return (
        React.createElement('div', { style: styles.listItem },
            React.createElement('label', { style: styles.checkboxLabel },
                React.createElement('input', {
                    type: 'checkbox',
                    checked: todo.completed,
                    onChange: () => onToggle(todo.id),
                    style: styles.checkbox
                }),
                React.createElement('span', { style: { textDecoration: todo.completed ? 'line-through' : 'none' } }, todo.text)
            ),
            React.createElement('button', {
                onClick: () => onDelete(todo.id),
                style: { ...styles.button, ...styles.buttonDanger, width: 'auto', padding: '5px 10px', fontSize: '0.9em' }
            }, 'Delete')
        )
    );
};
export default TodoItem;
