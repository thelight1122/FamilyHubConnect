
import React, { useMemo, useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components';
import type { Todo } from '../types';
import { uniqueId } from '../utils/utils';

const TodoItem = ({ todo, onToggle, onDelete }: { todo: Todo, onToggle: (id: string) => void, onDelete: (id: string) => void }) => (
    <div className="list-item">
        <label className="checkbox-label" style={{ flexGrow: 1 }}>
            <input
                type="checkbox"
                className="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.text}
            </span>
        </label>
        <button onClick={() => onDelete(todo.id)} className="btn btn-danger btn-sm">Delete</button>
    </div>
);

const TodoManagementPanel = ({ onAddTodo }: { onAddTodo: (text: string) => void }) => {
    const [newTodoText, setNewTodoText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoText.trim()) {
            onAddTodo(newTodoText.trim());
            setNewTodoText('');
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-20">
            <input
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
                placeholder="Add a new to-do item..."
                className="flex-grow"
            />
            <button type="submit" className="btn w-auto">Add</button>
        </form>
    );
};

export default function TodoView() {
    const { onSavePersonalization, onNavigate } = useAppDispatch();
    const { personalizationData, profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    
    if (!currentViewingProfile) {
        return <div className="page">Loading profile...</div>;
    }

    const myTodos = useMemo(() => {
        return (personalizationData?.todos || []).filter(t => t.profileId === currentViewingProfile.id);
    }, [personalizationData?.todos, currentViewingProfile.id]);

    const handleAddTodo = (text: string) => {
        if (!currentViewingProfile) return;
        const newTodo = { id: uniqueId(), text, completed: false, profileId: currentViewingProfile.id };
        const newTodos = [...(personalizationData?.todos || []), newTodo];
        onSavePersonalization({ todos: newTodos });
    };

    const handleToggleTodo = (id: string) => {
        const newTodos = (personalizationData?.todos || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        onSavePersonalization({ todos: newTodos });
    };

    const handleDeleteTodo = (id: string) => {
        const newTodos = (personalizationData?.todos || []).filter(t => t.id !== id);
        onSavePersonalization({ todos: newTodos });
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>✅ My To-Do List</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <div className="card">
                    <TodoManagementPanel onAddTodo={handleAddTodo} />
                    {myTodos.length > 0 ? (
                        myTodos.map(todo => 
                            <TodoItem 
                                key={todo.id} 
                                todo={todo} 
                                onToggle={handleToggleTodo}
                                onDelete={handleDeleteTodo} 
                            />
                        )
                    ) : (
                        <EmptyState
                            icon="📝"
                            title="All Done!"
                            message="You have no pending to-do items. Add one above to get started."
                        />
                    )}
                </div>
            </main>
            <BottomNavbar activePage="todo" onNavigate={onNavigate} />
        </div>
    );
}
