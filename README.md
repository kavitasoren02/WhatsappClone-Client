# WhatsApp Web Clone Assingment

A WhatsApp Web clone built with React.js, Node.js, MongoDB, and Socket.IO for real-time messaging.

## Features

- 📱 WhatsApp Web interface
- 💬 Real-time messaging with Socket.IO
- 📊 Message status indicators (sent, delivered, read)
- 🔄 Webhook payload processing
- 📱 Responsive design for mobile and desktop
- 🗄️ MongoDB for data persistence
- ⚡ Fast and efficient message handling

## Tech Stack

### Frontend (Client)
- **React.js 19** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icons

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing

## Project Structure

```plaintext
whatsapp-clone/
├── client/
|   ├──public
│   ├──src              
│   │  ├── components/
│   │  │   ├── ChatList.tsx       # Chat sidebar
│   │  │   ├── ChatWindow.tsx     # Message interface
│   │  │   └── MessageBubble.tsx  # Individual messages
│   │  ├── types/
│   │  │   └── index.ts           # TypeScript definitions
│   │  ├── utils/
│   │  │     └── dateUtils.ts      # Date formatting utilities
│   │  ├── App.tsx
│   │  ├── App.css
│   │  ├── main.tsx
│   │  └── index.css
│   ├── package.json
│   ├── index.html
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                       # Node.js backend
│   ├── models/
│   │   └── Message.js            # MongoDB message schema
│   ├── routes/
│   │   ├── messages.js           # Message API routes
│   │   └── chats.js              # Chat API routes
│   ├── utils/
│   │   └── webhookProcessor.js   # Webhook handling
│   └── index.js                  # Main server file
└── README.md
```


## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd whatsapp-clone
```

### 2. Setup Backend (Server)
```bash
cd server
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/whatsapp
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp

# Start the server
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Setup Frontend (Client)
```bash
cd ../client
npm install

# Create environment file (optional)
echo "VITE_BACKEND_URI=http://localhost:5000" > .env.local

# Start the client
npm run dev
```

The client will run on `http://localhost:3000`

## Database Schema

### Messages Collection (`processed_messages`)
```javascript
{
  _id: ObjectId,
  wa_id: String,           // WhatsApp ID (phone number)
  from: String,            // Sender's WhatsApp ID
  text: String,            // Message content
  timestamp: Date,         // Message timestamp
  type: String,            // 'text', 'image', 'document', 'outgoing'
  status: String,          // 'sent', 'delivered', 'read'
  meta_msg_id: String,     // WhatsApp message ID
  profile_name: String     // Sender's display name
}
```

## API Endpoints

### Messages
- `GET /api/messages/:wa_id` - Get messages for a specific chat
- `POST /api/messages/send` - Send a new message
- `PATCH /api/messages/:id/status` - Update message status

### Chats
- `GET /api/chats` - Get all chats with last message
- `PATCH /api/chats/:wa_id/read` - Mark messages as read

### Webhook
- `POST /webhook` - Process WhatsApp webhook payloads

## Webhook Processing

The application processes WhatsApp Business API webhook payloads:

1. **Incoming Messages**: Stored in MongoDB with sender info
2. **Status Updates**: Updates message status (sent → delivered → read)
3. **Real-time Updates**: Broadcasts changes via Socket.IO

### Sample Webhook Payload Structure
```javascript
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{ /* message data */ }],
        "statuses": [{ /* status updates */ }],
        "contacts": [{ /* contact info */ }]
      }
    }]
  }]
}
```

## Real-time Features

- **New Messages**: Instantly appear in chat windows
- **Status Updates**: Message status changes in real-time
- **Chat List Updates**: Last message and timestamps update automatically
- **Typing Indicators**: Can be extended to show typing status

## Features Implemented

✅ **Task 1: Webhook Payload Processor**
- Processes WhatsApp webhook payloads
- Stores messages in MongoDB
- Updates message status based on webhook data

✅ **Task 2: WhatsApp Web-like Interface**
- Chat list with user grouping
- Message bubbles with timestamps
- Status indicators (sent, delivered, read)
- Responsive design for mobile and desktop

✅ **Task 3: Send Message Feature**
- Message input with send functionality
- Messages saved to database
- Real-time UI updates

✅ **Task 4: Deployment Ready**
- Configured for production deployment
- Environment variables setup
- CORS and security headers

✅ **Bonus: Real-time Updates**
- Socket.IO integration
- Live message updates
- Status change notifications

# Thank You
