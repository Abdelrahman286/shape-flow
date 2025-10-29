# Implementation Plan

- [x] 1. Set up Devvit project structure and configuration
  - Initialize Devvit app with `devvit new` command
  - Configure devvit.yaml with required permissions (identity, storage, posts)
  - Set up TypeScript configuration for React
  - Create folder structure: components/ui, components/game, services, hooks, styles, utils
  - Install necessary dependencies and configure build system
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Implement custom UI component library
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2.1 Create Button component with cartoony styling
  - Implement Button component with TypeScript interface (label, onClick, variant, disabled, icon props)
  - Create CSS module with rounded corners (24px), green gradient background (#4ade80 to #22c55e)
  - Add bouncy hover effect using scale transform with spring animation
  - Implement drop shadow (0 4px 12px rgba(0,0,0,0.15)) and active pressed state
  - _Requirements: 5.1_

- [x] 2.2 Create SoundToggle component with lever animation
  - Implement SoundToggle component with isEnabled and onToggle props
  - Create lever-style switch with cartoon flip animation (400ms cubic-bezier)
  - Add speaker icon that animates (waves when on, X when off)
  - Style with green/gray color states matching component library palette
  - _Requirements: 5.2_

- [x] 2.3 Create GameCard container component
  - Implement GameCard component with children, glowColor, and padding props
  - Create CSS module with rounded corners (20px) and soft gradient background
  - Add glowing edge effect using box-shadow with customizable color
  - Implement subtle inner shadow for depth perception
  - _Requirements: 5.3_

- [x] 2.4 Create LeaderboardPanel component
  - Implement LeaderboardPanel with entries array, currentUser, and onClose props
  - Create LeaderboardEntry interface (rank, username, avatar, score, completionTime)
  - Style with animated gradient border and rotation animation
  - Add entry hover effects with background highlight
  - Implement circular avatar frames and score badges with glow effect
  - Add current user highlight with different background color
  - _Requirements: 5.4_

- [x] 2.5 Create RotationIndicator component
  - Implement RotationIndicator with currentRotation, correctRotation, and rotationIncrement props
  - Create circular progress indicator SVG that wraps around puzzle pieces
  - Implement color-coded system (red → yellow → green) based on rotation proximity
  - Add animated fill transition on rotation change
  - _Requirements: 5.5_

- [x] 3. Implement puzzle generation system
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 3.1 Create PuzzleGenerator class with seeded randomization
  - Implement PuzzleGenerator class with generate method accepting PuzzleConfig
  - Create seeded random number generator for reproducible patterns
  - Define PuzzleConfig interface (level, pieceCount, rotationIncrement, seed)
  - Define GeneratedPuzzle interface (pieces array, completeSvg, dimensions)
  - _Requirements: 12.5_

- [x] 3.2 Implement geometric pattern generation
  - Create generateGeometricPattern method that produces abstract SVG shapes
  - Implement shape generators for circles, polygons, curves, and spirals
  - Generate vibrant color palettes from green family (mint, teal, lime)
  - Add smooth cartoonish outlines with stroke styling
  - Ensure patterns are mathematically divisible for clean piece separation
  - _Requirements: 12.1, 12.3, 12.4_

- [x] 3.3 Implement puzzle piece splitting algorithm
  - Create splitIntoPieces method that divides complete pattern into individual pieces
  - Calculate piece positions and SVG paths for each fragment
  - Assign random initial rotations to pieces (multiples of rotationIncrement)
  - Determine correct rotation for each piece
  - Ensure no two consecutive levels use identical patterns
  - _Requirements: 12.2_

- [x] 4. Implement core game components
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.1 Create PuzzlePiece component with rotation logic
  - Implement PuzzlePiece component with piece, rotationIncrement, onRotate, isComplete props
  - Render SVG element with piece.svgPath and current rotation transform
  - Add click handler that calls onRotate with piece ID
  - Implement smooth rotation animation using CSS transition (300ms ease-out)
  - Add hover effects (slight scale and glow) and locked state when complete
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 4.2 Create GameBoard component
  - Implement GameBoard component that renders all puzzle pieces
  - Position pieces according to their x, y coordinates
  - Implement puzzle completion detection by checking all pieces' rotations
  - Trigger completion callback when all pieces are correctly aligned within 100ms
  - Add CompletionAnimation component slot for success effects
  - _Requirements: 1.3_

- [x] 4.3 Create LevelManager for difficulty progression
  - Define LEVEL_PROGRESSION configuration array with level configs
  - Implement level 1-4 with 3-6 pieces and 90-degree rotation
  - Implement level 5-9 with 7-11 pieces and 45-degree rotation
  - Implement level 10+ with 12+ pieces and 30-degree rotation
  - Create getLevelConfig method that returns configuration for given level number
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4.4 Create CompletionAnimation component
  - Implement confetti or glowing success animation using SVG or CSS animations
  - Display animation for 2-4 seconds when puzzle is completed
  - Create smooth transition to next level display after animation
  - Show new level number during transition
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [x] 5. Implement sound system
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 1.5, 3.2_

- [x] 5.1 Create SoundManager class
  - Implement SoundManager with AudioContext and sound asset management
  - Create initialize method that preloads all sound assets (rotate, success, mute, unmute, backgroundMusic)
  - Implement playSound method for sound effects using Web Audio API
  - Create toggleBackgroundMusic method for HTML5 Audio looping
  - Add setVolume method to control audio levels
  - _Requirements: 4.4_

- [x] 5.2 Integrate sound effects with game interactions
  - Connect rotation sound to PuzzlePiece click handler
  - Connect success sound to puzzle completion event
  - Connect mute/unmute jingle to SoundToggle component
  - Implement background music playback that starts with game
  - Ensure all sounds respect the enabled/disabled state
  - _Requirements: 1.5, 3.2, 4.2, 4.3_

- [x] 5.3 Implement sound preference persistence
  - Save sound enabled/disabled state to game state
  - Persist sound preference across sessions using Devvit storage
  - Load sound preference on game initialization
  - Apply loaded preference to SoundManager
  - _Requirements: 4.5_

- [x] 6. Implement Reddit Devvit integration
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 6.1 Create DevvitService class for API integration
  - Implement DevvitService constructor accepting Devvit.Context
  - Define UserProfile interface (username, avatar, karma)
  - Define ProgressData interface (userId, currentLevel, highestLevel, totalCompletions, bestTime, soundEnabled)
  - Define LeaderboardEntry interface (rank, username, avatar, score, completionTime)
  - _Requirements: 6.1, 6.2_

- [x] 6.2 Implement user profile retrieval
  - Create getUserProfile method using Devvit user API
  - Retrieve current user's username, avatar, and karma
  - Implement error handling with default placeholder on API failure
  - Cache user profile data to minimize API calls
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6.3 Implement progress data persistence
  - Create saveProgress method using Devvit storage API with key pattern `player_progress_{userId}`
  - Create loadProgress method to retrieve saved ProgressData
  - Implement JSON serialization/deserialization for storage
  - Save current level and completion time after each level completion
  - Load saved progress on game initialization and resume from last level
  - Implement error logging and fallback to in-memory state on storage failures
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6.4 Implement leaderboard functionality
  - Create updateLeaderboard method that saves score and time to Devvit storage
  - Create getLeaderboard method that retrieves top 10 players sorted by score
  - Use sorted set storage pattern with key `leaderboard_scores`
  - Update leaderboard within 2 seconds of puzzle completion
  - Refresh leaderboard data when leaderboard view is opened
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6.5 Implement achievement sharing
  - Create shareAchievement method using Devvit posts API
  - Display share option when player completes milestone levels (every 5 levels)
  - Create Reddit post with level number and completion time in current subreddit
  - Show confirmation message when post is created successfully
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 7. Implement main game state management
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 7.1 Create useGameState custom hook
  - Define GameState interface (currentLevel, pieces, isComplete, isSoundEnabled, startTime, completionTime, moves)
  - Implement state management for puzzle pieces and rotations
  - Create handlePieceRotate function that updates piece rotation by rotationIncrement
  - Implement puzzle completion detection logic
  - Track start time and calculate completion time
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 7.2 Implement game control functions
  - Create startGame function that initializes new game from level 1
  - Create restartLevel function that resets current level within 500ms
  - Regenerate puzzle piece positions and rotations on restart
  - Create advanceLevel function that progresses to next level
  - Integrate with PuzzleGenerator to create new puzzles
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 7.3 Create GameContainer orchestrator component
  - Implement GameContainer as main component accepting Devvit.Context
  - Initialize useGameState hook and DevvitService
  - Coordinate between game state, sound system, and Devvit APIs
  - Handle level progression and puzzle completion flow
  - Manage leaderboard panel visibility state
  - _Requirements: All game flow requirements_

- [x] 7.4 Create Header component with game info
  - Implement Header component displaying UserProfile (avatar, username)
  - Add LevelIndicator showing current level number
  - Include SoundToggle component
  - Update level indicator within 500ms when advancing levels
  - Maintain visibility throughout gameplay
  - _Requirements: 6.3, 6.4, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 7.5 Create ControlPanel component
  - Implement ControlPanel with Start/Restart button
  - Add View Leaderboard button
  - Show Start button when no game is in progress
  - Show Restart button during active gameplay
  - Handle button clicks to trigger game control functions
  - _Requirements: 10.1, 10.2_

- [x] 8. Implement error handling system
  - Create ErrorHandler class with handle method
  - Define GameError interface (type, message, recoverable)
  - Implement error categorization (devvit, game, audio, unknown)
  - Create retry logic with exponential backoff for Devvit API failures
  - Implement fallback to local state for storage failures
  - Add graceful degradation for audio failures (disable sound, continue gameplay)
  - Create user-friendly error messages for fatal and recoverable errors
  - _Requirements: 6.5, 8.5_

- [x] 9. Wire all components together in main app
  - Create main.tsx Devvit app entry point
  - Register GameContainer as main Devvit component
  - Initialize all services (PuzzleGenerator, SoundManager, DevvitService)
  - Set up error boundaries for graceful error handling
  - Connect all event handlers and state updates
  - Ensure proper data flow from user interactions through state to UI updates
  - Verify puzzle completion triggers success animation, sound, and leaderboard update
  - Test level progression from start to advanced levels
  - _Requirements: All requirements integrated_

- [ ] 10. Create test suite for core functionality
  - _Requirements: All requirements should be validated_

- [x] 10.1 Write unit tests for PuzzleGenerator
  - Test unique pattern generation for different seeds
  - Test correct number of pieces created
  - Test rotation calculations
  - Test piece splitting algorithm
  - _Requirements: 12.1, 12.2, 12.5_

- [x] 10.2 Write unit tests for SoundManager
  - Mock Audio API for testing
  - Test play/pause/volume controls
  - Test sound asset preloading
  - Test background music looping
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 10.3 Write unit tests for DevvitService
  - Mock Devvit APIs
  - Test data serialization/deserialization
  - Test error handling and retries
  - Test leaderboard sorting
  - _Requirements: 6.1, 6.2, 7.1, 8.1, 9.1_

- [x] 10.4 Write component tests for custom UI library
  - Test Button rendering and interactions
  - Test SoundToggle state changes
  - Test GameCard styling
  - Test LeaderboardPanel entry display
  - Test RotationIndicator color changes
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 10.5 Write integration tests for game flow
  - Test complete puzzle flow from start to finish
  - Test level progression and difficulty scaling
  - Test leaderboard updates after completion
  - Test progress save and restore
  - Test sound toggle affecting all audio
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 7.1, 8.1_
