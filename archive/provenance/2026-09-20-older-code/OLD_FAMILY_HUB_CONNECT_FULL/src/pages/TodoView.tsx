
import React, { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import TodoItem from '../components/ui/TodoItem';
import TodoManagementPanel from '../components/ui/TodoManagementPanel';
import EmptyState from '../components/ui/EmptyState';
import { uniqueId } from '../utils/utils';

export default function TodoView() {
    const { 
        personalizationData, onSavePersonalization, currentViewingProfile
    } = useAppContext();
    
    if (!currentViewingProfile) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading profile...');
    }

    const myTodos = useMemo(() => {
        return (personalizationData?.todos || []).filter(t => t.profileId === currentViewingProfile.id);
    }, [personalizationData?.todos, currentViewingProfile.id]);

    const handleAddTodo = (text: string) => {
        if (!currentViewingProfile) return;
        const newTodo = {
            id: uniqueId(),
            text,
            completed: false,
            profileId: currentViewingProfile.id,
        };
        const newTodos = [...(personalizationData?.todos || []), newTodo];
        onSavePersonalization({ todos: newTodos });
    };

    const handleToggleTodo = (id: string) => {
        const newTodos = (personalizationData?.todos || []).map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        onSavePersonalization({ todos: newTodos });
    };

    const handleDeleteTodo = (id: string) => {
        const newTodos = (personalizationData?.todos || []).filter(t => t.id !== id);
        onSavePersonalization({ todos: newTodos });
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('h2', { style: styles.pageHeader }, "✅ My To-Do List"),
            React.createElement('section', { style: styles.section },
                React.createElement(TodoManagementPanel, { onAddTodo: handleAddTodo }),
                myTodos.length > 0 ? (
                    myTodos.map(todo => 
                        React.createElement(TodoItem, { 
                            key: todo.id, 
                            todo, 
                            onToggle: handleToggleTodo,
                            onDelete: handleDeleteTodo 
                        })
                    )
                ) : (
                    React.createElement(EmptyState, {
                        icon: "📝",
                        title: "All Done!",
                        message: "You have no pending to-do items. Add one above to get started."
                    })
                )
            )
        )
    );
}
