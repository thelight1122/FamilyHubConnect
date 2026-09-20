
import React, { useState } from 'react';
import { styles } from '../../styles';

interface TodoManagementPanelProps {
    onAddTodo: (text: string) => void;
}

const TodoManagementPanel: React.FC<TodoManagementPanelProps> = ({ onAddTodo }) => {
    const [newTodoText, setNewTodoText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoText.trim()) {
            onAddTodo(newTodoText.trim());
            setNewTodoText('');
        }
    };
    
    return (
        React.createElement('form', { onSubmit: handleSubmit, style: { display: 'flex', gap: '10px', marginBottom: '20px' } },
            React.createElement('input', {
                type: 'text',
                value: newTodoText,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewTodoText(e.target.value),
                placeholder: "What needs to be done?",
                style: { ...styles.input, flexGrow: 1 }
            }),
            React.createElement('button', { type: 'submit', style: { ...styles.button, width: 'auto' } }, "Add Todo")
        )
    );
};

export default TodoManagementPanel;
