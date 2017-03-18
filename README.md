# DashBois

A multiplayer browser battle platformer! Inspired by Super Smash Bros and DiveKick. Gonna start with basic io and then will progress to interactivity, movement and more.

Gameplay consists of jumping, dashing and (tentatively) dodging:

- Combat only occurs *in air*!

- To attack another player, they *must* dash into them!

## Testing

To run server (assuming node is installed on system):

`$ node app.js`

and connect from your browser at. No graphics yet. Your char sprite is just your connection id.

`localhost:8083`

Controls are (currently):

`Walking: left and right arrow keys`

`Jump: spacebar when on ground`

`Dash: spacebar + desired arrow key when mid-jump`

`Float: spacebar without arrow key when mid-jump`

`Dodge: down arrow key + left/right arrow key + spacebar when on ground`

## ToDo:

### Basic Engine

- [x] Server Framework Setup
- [x] Player connections
- [x] Player input
- [x] Entity / physics object definition
- [x] Player definition
- [x] Player movement
- [ ] Player naming
- [x] Speed
- [x] Gravity
- [ ] Hitboxes / hit detection
- [ ] Platforms / multiple 'grounds'

### Mechanics

- [x] Jumping
- [x] Dodging
- [x] Dashing
- [ ] Level reading
- [ ] Level creating
- [ ] Level generating?

### Gfx

- [ ] UI
- [x] Default Player sprites
- [ ] Other Player sprites
- [ ] Background gfx
- [ ] Platforms

### Audio

- [ ] Background music
- [ ] Sound fx

### Presentation 

- [ ] Menu pages
- [x] Default/unnamed player attribs
- [ ] Chat bar
- [ ] Tutorial
- [ ] Controls Screen
- [ ] Settings

### Network

- [ ] Interpolation
- [ ] Client side prediction
- [ ] Chat functionality
- [ ] Lobbies

## Credits:

Prototype player sprites:

[Eris](http://opengameart.org/content/sprite-sheet-sidescoller-cycles)



