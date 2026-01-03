const fs = require('fs');
const path = require('path');

/**
 * Simple template engine - replaces {{variable}} with actual values
 */
function renderTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}

/**
 * Load and render a view file
 */
function renderView(viewName, data = {}) {
    const viewPath = path.join(__dirname, '..', 'views', `${viewName}.html`);
    
    if (!fs.existsSync(viewPath)) {
        throw new Error(`View not found: ${viewName}`);
    }
    
    const template = fs.readFileSync(viewPath, 'utf8');
    return renderTemplate(template, data);
}

/**
 * Render dashboard view with game data
 */
function renderDashboard(game, password, baseUrl) {
    const viewPath = path.join(__dirname, '..', 'views', 'dashboard.html');
    let template = fs.readFileSync(viewPath, 'utf8');
    
    // Replace game data
    template = template.replace(/\{\{gameName\}\}/g, game.name);
    template = template.replace(/\{\{universeId\}\}/g, game.universeId);
    template = template.replace(/\{\{topic\}\}/g, game.topic);
    template = template.replace(/\{\{password\}\}/g, password);
    template = template.replace(/\{\{baseUrl\}\}/g, baseUrl);
    template = template.replace(/\{\{webhookSecret\}\}/g, game.webhookSecret);
    
    // Replace badges
    template = template.replace(/\{\{saweriaBadge\}\}/g, 
        game.saweriaToken 
            ? '<span class="badge badge-success">✓ Configured</span>' 
            : '<span class="badge badge-warning">⚠ Optional</span>'
    );
    template = template.replace(/\{\{socialbuzzBadge\}\}/g, 
        game.socialbuzzToken 
            ? '<span class="badge badge-success">✓ Configured</span>' 
            : '<span class="badge badge-warning">⚠ Optional</span>'
    );
    
    return template;
}

/**
 * Render admin dashboard view
 */
function renderAdminDashboard(token) {
    const viewPath = path.join(__dirname, '..', 'views', 'admin-dashboard.html');
    let template = fs.readFileSync(viewPath, 'utf8');
    
    template = template.replace(/\{\{token\}\}/g, token);
    
    return template;
}

module.exports = {
    renderView,
    renderDashboard,
    renderAdminDashboard
};
