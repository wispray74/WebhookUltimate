const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { renderView, renderDashboard, renderAdminDashboard } = require('./views/render');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}}));
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 📁 Database file path - Use Railway Volume if available
const VOLUME_PATH = process.env.VOLUME_PATH || __dirname;
const DB_FILE = path.join(VOLUME_PATH, 'users.json');

// Create volume directory if it doesn't exist
if (process.env.VOLUME_PATH && !fs.existsSync(VOLUME_PATH)) {
    fs.mkdirSync(VOLUME_PATH, { recursive: true });
    console.log(`📁 Created volume directory: ${VOLUME_PATH}`);
}

console.log(`💾 Database location: ${DB_FILE}`);
console.log(`📂 Using ${process.env.VOLUME_PATH ? 'Railway Volume (Persistent)' : 'Local Storage (Ephemeral)'}`);

// 🔧 Database helper functions
function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const initialData = {
                admin: {
                    username: process.env.ADMIN_USERNAME || 'admin',
                    password: process.env.ADMIN_PASSWORD || 'admin123'
                },
                games: []
            };
            fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
            console.log('✅ Created new database file');
            return initialData;
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (error) {
        console.error('❌ Error reading database:', error);
        return { admin: { username: 'admin', password: 'admin123' }, games: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Error writing database:', error);
        return false;
    }
}

// 🎮 Initialize games from environment variables and database
function initializeGames() {
    const db = readDB();
    const envGames = [
        {
            id: 'game1',
            name: process.env.GAME_1_NAME || 'Game 1',
            universeId: process.env.GAME_1_UNIVERSE_ID,
            apiKey: process.env.GAME_1_API_KEY,
            topic: process.env.GAME_1_TOPIC || 'ArchieDonationIDR',
            webhookSecret: process.env.GAME_1_WEBHOOK_SECRET,
            password: process.env.GAME_1_PASSWORD,
            saweriaToken: process.env.GAME_1_SAWERIA_TOKEN,
            socialbuzzToken: process.env.GAME_1_SOCIALBUZZ_TOKEN
        },
        {
            id: 'game2',
            name: process.env.GAME_2_NAME || 'Game 2',
            universeId: process.env.GAME_2_UNIVERSE_ID,
            apiKey: process.env.GAME_2_API_KEY,
            topic: process.env.GAME_2_TOPIC || 'ArchieDonationIDR',
            webhookSecret: process.env.GAME_2_WEBHOOK_SECRET,
            password: process.env.GAME_2_PASSWORD,
            saweriaToken: process.env.GAME_2_SAWERIA_TOKEN,
            socialbuzzToken: process.env.GAME_2_SOCIALBUZZ_TOKEN
        },
        {
            id: 'game3',
            name: process.env.GAME_3_NAME || 'Game 3',
            universeId: process.env.GAME_3_UNIVERSE_ID,
            apiKey: process.env.GAME_3_API_KEY,
            topic: process.env.GAME_3_TOPIC || 'ArchieDonationIDR',
            webhookSecret: process.env.GAME_3_WEBHOOK_SECRET,
            password: process.env.GAME_3_PASSWORD,
            saweriaToken: process.env.GAME_3_SAWERIA_TOKEN,
            socialbuzzToken: process.env.GAME_3_SOCIALBUZZ_TOKEN
        }
    ].filter(game => game.universeId && game.apiKey && game.webhookSecret && game.password);

    // Merge with database games
    const mergedGames = [];
    for (const envGame of envGames) {
        const dbGame = db.games.find(g => g.id === envGame.id);
        if (dbGame) {
            mergedGames.push({
                ...envGame,
                password: dbGame.password || envGame.password,
                lastActive: dbGame.lastActive || new Date().toISOString(),
                createdAt: dbGame.createdAt || new Date().toISOString()
            });
        } else {
            mergedGames.push({
                ...envGame,
                lastActive: new Date().toISOString(),
                createdAt: new Date().toISOString()
            });
        }
    }

    // Update database with merged games
    db.games = mergedGames;
    writeDB(db);

    return mergedGames;
}

let GAMES = initializeGames();

if (GAMES.length === 0) {
    console.error('❌ No games configured!');
    console.error('   Required variables per game:');
    console.error('   - GAME_X_UNIVERSE_ID');
    console.error('   - GAME_X_API_KEY');
    console.error('   - GAME_X_WEBHOOK_SECRET');
    console.error('   - GAME_X_PASSWORD');
    process.exit(1);
}

console.log('🎮 Archie Webhook - ' + GAMES.length + ' games configured');

// 🔐 Auth Helpers
function authenticateGame(password) {
    return GAMES.find(game => game.password && game.password === password);
}

function authenticateAdmin(username, password) {
    const db = readDB();
    return db.admin.username === username && db.admin.password === password;
}

function updateGameLastActive(gameId) {
    const db = readDB();
    const game = db.games.find(g => g.id === gameId);
    if (game) {
        game.lastActive = new Date().toISOString();
        writeDB(db);
    }
}

// Helper Functions
function verifyWebhookToken(req, expectedToken) {
    if (!expectedToken) return true;
    const token = req.headers['x-webhook-token'] || req.headers['authorization']?.replace('Bearer ', '') || req.body?.token;
    return token === expectedToken;
}

function extractUsername(message, donatorName) {
    if (!message || message.trim() === '') return donatorName;
    
    const trimmedMessage = message.trim();
    
    // Format: [username] atau [username]message
    const bracketMatch = trimmedMessage.match(/^\[([^\]]+)\]/);
    if (bracketMatch && bracketMatch[1].trim()) {
        return bracketMatch[1].trim();
    }
    
    // Format: @username atau @username message
    const atMatch = trimmedMessage.match(/^@([^\s]+)/);
    if (atMatch && atMatch[1].trim()) {
        return atMatch[1].trim();
    }
    
    // Format: username: message
    const colonMatch = trimmedMessage.match(/^([^\s:]+):/);
    if (colonMatch && colonMatch[1].trim()) {
        return colonMatch[1].trim();
    }
    
    // Format: username (word pertama jika tidak ada format khusus)
    const firstWord = trimmedMessage.split(/\s+/)[0];
    if (firstWord && firstWord.length >= 3 && firstWord.length <= 20) {
        if (/^[a-zA-Z0-9_]+$/.test(firstWord) && /[0-9_]/.test(firstWord)) {
            return firstWord;
        }
    }
    
    return donatorName;
}

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

async function sendToRoblox(game, donationData) {
    const apiUrl = `https://apis.roblox.com/messaging-service/v1/universes/${game.universeId}/topics/${encodeURIComponent(game.topic)}`;
    console.log(`📤 [${game.name}] Sending ${formatRupiah(donationData.amount)} for ${donationData.username}`);
    
    try {
        const response = await axios.post(apiUrl, { 
            message: JSON.stringify(donationData) 
        }, {
            headers: { 
                'Content-Type': 'application/json', 
                'x-api-key': game.apiKey 
            },
            timeout: 10000
        });
        
        console.log(`✅ [${game.name}] Success! Status: ${response.status}`);
        updateGameLastActive(game.id);
        return { success: true, status: response.status, data: response.data };
    } catch (error) {
        console.error(`❌ [${game.name}] Failed to send to Roblox`);
        if (error.response) {
            console.error('📛 Response Status:', error.response.status);
            console.error('📛 Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

// 🔧 Webhook Routes
GAMES.forEach(game => {
    // Saweria
    app.post(`/${game.webhookSecret}/saweria`, async (req, res) => {
        console.log(`\n📩 [${game.name}] Saweria webhook received`);
        
        if (game.saweriaToken && !verifyWebhookToken(req, game.saweriaToken)) {
            console.log(`❌ [${game.name}] Unauthorized - Invalid token`);
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        
        const payload = req.body;
        if (!payload || payload.type !== 'donation') {
            return res.status(200).json({ success: true, message: 'OK' });
        }
        
        const donationData = {
            username: extractUsername(payload.message || '', payload.donator_name || 'Anonymous'),
            displayName: payload.donator_name || 'Anonymous',
            amount: Math.floor(payload.amount_raw || 0),
            timestamp: Math.floor(Date.now() / 1000),
            source: 'Saweria',
            message: payload.message || '',
            email: payload.donator_email || ''
        };
        
        try {
            await sendToRoblox(game, donationData);
            return res.status(200).json({ success: true, message: 'Processed' });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Failed' });
        }
    });
    
    // SocialBuzz
    app.post(`/${game.webhookSecret}/socialbuzz`, async (req, res) => {
        console.log(`\n📩 [${game.name}] SocialBuzz webhook received`);
        console.log('📦 Raw payload:', JSON.stringify(req.body, null, 2));
        
        if (game.socialbuzzToken && !verifyWebhookToken(req, game.socialbuzzToken)) {
            console.log(`❌ [${game.name}] Unauthorized - Invalid token`);
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        
        const payload = req.body;
        if (!payload) {
            return res.status(400).json({ success: false, error: 'No payload' });
        }
        
        const rawMessage = payload.message || payload.supporter_message || payload.note || payload.comment || '';
        const rawName = payload.supporter_name || payload.name || payload.donator_name || 'Anonymous';
        
        console.log('📝 Extracted message:', rawMessage);
        console.log('👤 Extracted name:', rawName);
        
        const extractedUsername = extractUsername(rawMessage, rawName);
        console.log('✅ Final username:', extractedUsername);
        
        const donationData = {
            username: extractedUsername,
            displayName: rawName,
            amount: Math.floor(payload.amount || payload.donation_amount || payload.amount_raw || 0),
            timestamp: Math.floor(Date.now() / 1000),
            source: 'SocialBuzz',
            message: rawMessage,
            email: payload.supporter_email || payload.email || ''
        };
        
        console.log('📤 Donation data to send:', JSON.stringify(donationData, null, 2));
        
        try {
            await sendToRoblox(game, donationData);
            return res.status(200).json({ success: true, message: 'Processed' });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Failed' });
        }
    });
    
    // Test Endpoint
    app.post(`/${game.webhookSecret}/test`, async (req, res) => {
        const password = req.query.password || req.body?.password;
        const authGame = authenticateGame(password);
        
        if (!authGame || authGame.id !== game.id) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        
        console.log(`\n🧪 Test endpoint - ${game.name}`);
        const testPayload = {
            username: req.body.username || 'TestUser',
            displayName: 'Test Donator',
            amount: parseInt(req.body.amount) || 25000,
            timestamp: Math.floor(Date.now() / 1000),
            source: 'Test',
            message: 'Test donation'
        };
        
        try {
            await sendToRoblox(game, testPayload);
            res.json({ success: true, message: 'Test sent', game: game.name });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Test failed', details: error.message });
        }
    });
});

// 🏠 Homepage (using separated view)
app.get('/', (req, res) => {
    try {
        const html = renderView('index');
        res.send(html);
    } catch (error) {
        res.status(500).send('Error loading page');
    }
});

// 🔐 API Routes
app.post('/api/auth', (req, res) => {
    const { password } = req.body;
    const game = authenticateGame(password);
    
    if (game) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/api/admin/auth', (req, res) => {
    const { username, password } = req.body;
    
    if (authenticateAdmin(username, password)) {
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        res.json({ success: true, token });
    } else {
        res.json({ success: false });
    }
});

app.post('/api/user/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
        return res.json({ success: false, error: 'Password must be at least 6 characters' });
    }
    
    const game = authenticateGame(currentPassword);
    if (!game) {
        return res.json({ success: false, error: 'Current password is incorrect' });
    }
    
    const db = readDB();
    const dbGame = db.games.find(g => g.id === game.id);
    if (dbGame) {
        dbGame.password = newPassword;
        if (writeDB(db)) {
            GAMES = initializeGames();
            res.json({ success: true, message: 'Password changed successfully' });
        } else {
            res.json({ success: false, error: 'Failed to save password' });
        }
    } else {
        res.json({ success: false, error: 'Game not found' });
    }
});

app.get('/api/admin/users', (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [username, password] = decoded.split(':');
        
        if (!authenticateAdmin(username, password)) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        
        const db = readDB();
        const users = db.games.map(game => ({
            id: game.id,
            name: game.name,
            universeId: game.universeId,
            lastActive: game.lastActive,
            createdAt: game.createdAt,
            hasPassword: !!game.password
        }));
        
        res.json({ success: true, users });
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

app.post('/api/admin/reset-password', (req, res) => {
    const { token, gameId, newPassword } = req.body;
    
    if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [username, password] = decoded.split(':');
        
        if (!authenticateAdmin(username, password)) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        
        if (!newPassword || newPassword.length < 6) {
            return res.json({ success: false, error: 'Password must be at least 6 characters' });
        }
        
        const db = readDB();
        const game = db.games.find(g => g.id === gameId);
        
        if (!game) {
            return res.json({ success: false, error: 'Game not found' });
        }
        
        game.password = newPassword;
        if (writeDB(db)) {
            GAMES = initializeGames();
            res.json({ success: true, message: 'Password reset successfully' });
        } else {
            res.json({ success: false, error: 'Failed to save password' });
        }
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

// 📊 User Dashboard (using separated view)
app.get('/dashboard', (req, res) => {
    const password = req.query.password;
    const game = authenticateGame(password);
    
    if (!game) {
        return res.redirect('/');
    }
    
    const baseUrl = `https://${req.get('host')}`;
    
    try {
        const html = renderDashboard(game, password, baseUrl);
        res.send(html);
    } catch (error) {
        res.status(500).send('Error loading dashboard');
    }
});

// 📊 Admin Dashboard (using separated view)
app.get('/admin/dashboard', async (req, res) => {
    const token = req.query.token;
    
    if (!token) {
        return res.redirect('/');
    }
    
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [username, password] = decoded.split(':');
        
        if (!authenticateAdmin(username, password)) {
            return res.redirect('/');
        }
        
        const html = renderAdminDashboard(token);
        res.send(html);
    } catch (error) {
        return res.redirect('/');
    }
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🎮 Configured games: ${GAMES.map(g => g.name).join(', ')}`);
    const db = readDB();
    console.log(`👑 Admin username: ${db.admin.username}`);
});
