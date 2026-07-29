export function buildContext(nodes) {
    const context = {
        ideas: [],
        users: [],
        features: [],
        notes: []
    };

    nodes.forEach(n => {
        if (n.type === 'idea') context.ideas.push(n.text);
        if (n.type === 'user') context.users.push(n.text);
        if (n.type === 'feature') context.features.push(n.text);
        if (n.type === 'note') context.notes.push(n.text);
    });

    return context;
}