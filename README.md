# Shape Flow 🌊

A relaxing stress relief puzzle game built for Reddit's Devvit platform. Create beautiful abstract shapes by rotating and aligning puzzle pieces in this zen-like gaming experience.

## ✨ Features

- **Stress Relief Gameplay**: Calming puzzle mechanics designed to help you unwind
- **AI-Generated SVG Art**: Beautiful abstract shapes created with procedural generation
- **Progressive Difficulty**: Multiple levels with increasing complexity
- **Sound Effects**: Optional audio feedback for an immersive experience
- **Leaderboards**: Compete with other Reddit users for best completion times
- **Level Selection**: Jump to any unlocked level
- **Responsive Design**: Works seamlessly across devices

## 🎮 How to Play

1. **Rotate Pieces**: Tap or click on puzzle pieces to rotate them
2. **Align Shapes**: Match pieces to recreate the target abstract design
3. **Complete Levels**: Finish puzzles to unlock new challenging patterns
4. **Relax & Enjoy**: Let the flowing shapes help you de-stress

## 🛠 Technology Stack

- **[Devvit](https://developers.reddit.com/)**: Reddit's developer platform for immersive experiences
- **[React](https://react.dev/)**: Modern UI framework with hooks and components
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development
- **[Vite](https://vite.dev/)**: Fast build tool and development server
- **[Express](https://expressjs.com/)**: Backend API and game logic
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first styling
- **SVG Graphics**: Scalable vector graphics for crisp visuals
- **AI-Powered Generation**: Procedural shape and puzzle creation

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ installed on your machine
- Reddit account connected to Reddit Developers
- Devvit CLI installed and authenticated

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shape-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Login to Devvit** (if not already done)
   ```bash
   npm run login
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your Reddit test environment** and navigate to the playtest URL provided by Devvit

## 📋 Available Commands

- `npm run dev`: Start development server with live reload on Reddit
- `npm run build`: Build client and server for production
- `npm run deploy`: Upload new version to Reddit
- `npm run launch`: Publish app for Reddit review
- `npm run login`: Authenticate with Reddit Developers
- `npm run check`: Run type checking, linting, and formatting

## 🎯 Development Approach

This project was built using **Kiro Spec-Driven Development**, enabling rapid prototyping and iterative development of complex game mechanics.

### Key Development Features:
- **AI-Powered Shape Generation**: Procedural SVG creation for infinite puzzle variety
- **Modular Architecture**: Clean separation of game logic, UI, and services
- **Type-Safe Development**: Full TypeScript coverage for reliable code
- **Component-Based Design**: Reusable React components for maintainable UI
- **Real-time Development**: Hot reload and live testing on Reddit platform

## 🎨 Game Design

Shape Flow generates beautiful abstract art through:
- **Procedural Algorithms**: Mathematical functions create organic shapes
- **Color Harmony**: Carefully selected green palettes for relaxation
- **Smooth Animations**: Gentle transitions and completion effects
- **Progressive Complexity**: Levels gradually introduce new challenges

## 🔧 Architecture

```
src/
├── client/           # React frontend
│   ├── components/   # UI components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # Game logic and API calls
│   └── utils/        # Helper functions
├── server/           # Express backend
└── shared/           # Common types and utilities
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause License.

## 🙏 Acknowledgments

- Built with ❤️ using Kiro IDE and Spec-Driven Development
- Powered by Reddit's Devvit platform
- AI-assisted development for rapid iteration
