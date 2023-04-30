const GAME_FIELD_POSITION = {

    x: 40,
    y: 520
}

const BLOCK_SIZE = {

    width: 45,
    height: 50
}

const BOOSTERS = [

    {

        price: 222,
        radius: 4,
        id: 0,
        name: "bombBooster"
    }
]

const LEVEL_INFO = {

    width: 9,
    height: 9,
    scoresToGet: 600,
    minBlastableLength: 3,
    shufflesAvailable: 1,
    movesRemaining: 20,
    multipier: 10
}

let userMoney = 223;
let blockGap = 1;
let usingBoosterId = -1;

cc.game.onStart = function(){
    var sys = cc.sys;
    if(!sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(sys.os === sys.OS_IOS ? true : false);

    // Disable auto full screen on baidu and wechat, you might also want to eliminate sys.BROWSER_TYPE_MOBILE_QQ
    if (sys.isMobile && 
        sys.browserType !== sys.BROWSER_TYPE_BAIDU &&
        sys.browserType !== sys.BROWSER_TYPE_WECHAT) {
        cc.view.enableAutoFullScreen(true);
    }

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    // Uncomment the following line to set a fixed orientation for your game
    // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
       
        cc.director.runScene(new GameScene());
    }, this);

    let BackgroundLayer = cc.Layer.extend({

        ctor: function() {
    
            this._super();
            
            //screen size
            let size = cc.winSize;

            //setting background img
            let background_UI = new cc.Sprite.create(res.bcg);
            background_UI.setAnchorPoint(cc.p(0.5, 0.5));
            background_UI.setPosition(cc.p(size.width / 2, size.height / 2));
            this.addChild(background_UI, 0);
        }
    });
    
    let UIHeader = cc.Layer.extend({
    
        ctor: function() {
    
            this._super();
            this.draw();
        },
        draw: function() {
    
            
            //screen size
            let size = cc.winSize;

            //setting header
            
            //setting infoBar
            let levelInfoBarBcg = new cc.Sprite.create(res.levelInfoBarBcg);
            levelInfoBarBcg.setAnchorPoint(cc.p(0.5, 1));
            levelInfoBarBcg.setPosition(cc.p((size.width / 2) - 15, size.height));
            levelInfoBarBcg.__width = 800;
            levelInfoBarBcg.__height = 105;
            levelInfoBarBcg.setScaleX(levelInfoBarBcg.__width / levelInfoBarBcg.getBoundingBox().width);
            levelInfoBarBcg.setScaleY(levelInfoBarBcg.__height / levelInfoBarBcg.getBoundingBox().height);
            this.addChild(levelInfoBarBcg, 0);

            //setting progress bar background
            let progressBarBcg = new cc.Sprite.create(res.progressBarBcg);
            progressBarBcg.setAnchorPoint(cc.p(0.5, 1));
            progressBarBcg.setPosition(levelInfoBarBcg.getPosition());
            progressBarBcg.__width = levelInfoBarBcg.__width * 0.5;
            progressBarBcg.__height = levelInfoBarBcg.__height * 0.8;
            progressBarBcg.setScaleX(progressBarBcg.__width / progressBarBcg.getBoundingBox().width);
            progressBarBcg.setScaleY(progressBarBcg.__height / progressBarBcg.getBoundingBox().height);
            this.addChild(progressBarBcg, 0);

            //setting progress title
            let progressBarTitle = new cc.LabelTTF('Прогресс', 'Impact', 25*4, cc.TEXT_ALIGNMENT_CENTER);
            progressBarTitle.setAnchorPoint(cc.p(0.5, 1));
            progressBarTitle.setPosition(progressBarBcg.getPosition().x, progressBarBcg.getPosition().y - 10);
            progressBarTitle.setScale(0.25);
            this.addChild(progressBarTitle, 0);

            //setting emptry bar
            let emptyBar = new cc.Sprite.create(res.mtBar);
            emptyBar.setAnchorPoint(cc.p(0, 0.5));
            emptyBar.__width = progressBarBcg.__width * 0.8;
            emptyBar.__height = 30;
            emptyBar.setPosition(progressBarTitle.getPosition().x - emptyBar.__width / 2, progressBarTitle.getPosition().y - emptyBar.__height - 15);
            emptyBar.setScaleX( emptyBar.__width / emptyBar.getBoundingBox().width);
            emptyBar.setScaleY(emptyBar.__height / emptyBar.getBoundingBox().height);
            emptyBar.setTag('emptyBar');
            this.addChild(emptyBar, 0)

            //setting bar element
            let barElement = new cc.Sprite.create(res.barElement);
            barElement.setAnchorPoint(cc.p(0, 0.5));
            barElement.setPosition(emptyBar.getPosition().x + 2, emptyBar.getPosition().y);
            barElement.__width = 0;
            barElement.__height = emptyBar.__height - 4;
            barElement.setScaleX(barElement.__width / barElement.getBoundingBox().width);
            barElement.setScaleY(barElement.__height / barElement.getBoundingBox().height);
            barElement.setTag('barElement');
            this.addChild(barElement, 0)

            //setting left pink rectangle
            let scoreToAchieveBcg = new cc.Sprite.create(res.pinkRect);
            scoreToAchieveBcg.setAnchorPoint(cc.p(0.5, 0.5));
            scoreToAchieveBcg.__width = 100;
            scoreToAchieveBcg.__height = 40;
            scoreToAchieveBcg.setPosition(progressBarBcg.getPosition().x - 300, levelInfoBarBcg.getPosition().y - 40);
            scoreToAchieveBcg.setScaleX(scoreToAchieveBcg.__width / scoreToAchieveBcg.getBoundingBox().width);
            scoreToAchieveBcg.setScaleY(scoreToAchieveBcg.__height / scoreToAchieveBcg.getBoundingBox().height);
            this.addChild(scoreToAchieveBcg, 0);

            let scoreToGetLB = new cc.LabelTTF(LEVEL_INFO.scoresToGet, 'Impact', 24*4);
            scoreToGetLB.setAnchorPoint(cc.p(0.5, 0.5));
            scoreToGetLB.setPosition(scoreToAchieveBcg.getPosition());
            scoreToGetLB.setScale(0.25);
            this.addChild(scoreToGetLB, 0);

            //setting right purple rectangle
            let moneyBcg = new cc.Sprite.create(res.purpleRect);
            moneyBcg.setAnchorPoint(cc.p(0.5, 0.5));
            moneyBcg.__width = 130;
            moneyBcg.__height = 40;
            moneyBcg.setPosition(progressBarBcg.getPosition().x + 280, levelInfoBarBcg.getPosition().y - 40);
            moneyBcg.setScaleX( moneyBcg.__width / moneyBcg.getBoundingBox().width);
            moneyBcg.setScaleY(moneyBcg.__height / moneyBcg.getBoundingBox().height);
            this.addChild(moneyBcg, 0);

            let userMoneyLB = new cc.LabelTTF(userMoney, 'Impact', 24*4);
            userMoneyLB.setAnchorPoint(cc.p(0.5, 0.5));
            userMoneyLB.setPosition(moneyBcg.getPosition());
            userMoneyLB.setScale(0.25);
            userMoneyLB.setTag('userMoneyLB');
            this.addChild(userMoneyLB, 0);

            //setting pauseBtn
            let pauseBtn = new cc.Sprite.create(res.pauseBtn);
            pauseBtn.setAnchorPoint(cc.p(0.5, 0.5));
            pauseBtn.__width = 80;
            pauseBtn.__height = 80;
            pauseBtn.setPosition(levelInfoBarBcg.getPosition().x + levelInfoBarBcg.__width/2 + pauseBtn.__width/1.8, levelInfoBarBcg.getPosition().y - pauseBtn.__height/1.5);
            pauseBtn.setScaleX(pauseBtn.__width / pauseBtn.getBoundingBox().width);
            pauseBtn.setScaleY(pauseBtn.__height / pauseBtn.getBoundingBox().height);
            this.addChild(pauseBtn, 0);
        }
    });

    let UILevelInfo = cc.Layer.extend({

        ctor: function() {
    
            this._super();
            this.draw();
        },
        draw: function() {

            //screen size
            let size = cc.winSize;

            //setting level info background
            let levelInfoBcg = new cc.Sprite.create(res.scoresContBcg);
            levelInfoBcg.setAnchorPoint(cc.p(0, 1));
            levelInfoBcg.setPosition(cc.p(590, size.height - 140));
            levelInfoBcg.__width = 310;
            levelInfoBcg.__height = 270;
            levelInfoBcg.setScaleX(levelInfoBcg.__width / levelInfoBcg.getBoundingBox().width);
            levelInfoBcg.setScaleY(levelInfoBcg.__height / levelInfoBcg.getBoundingBox().height);
            this.addChild(levelInfoBcg, 0);

            //setting moves background
            let movesBcg = new cc.Sprite.create(res.movesBcg);
            movesBcg.setAnchorPoint(cc.p(0.5, 1));
            movesBcg.setPosition(levelInfoBcg.getPosition().x + levelInfoBcg.__width/2, levelInfoBcg.getPosition().y - 10);
            movesBcg.__width = 160;
            movesBcg.__height = 160;
            movesBcg.setScaleX(movesBcg.__width / movesBcg.getBoundingBox().width);
            movesBcg.setScaleY(movesBcg.__height / movesBcg.getBoundingBox().height);
            this.addChild(movesBcg, 0);

            //setting moves remaining number label
            let movesRemainingLB = new cc.LabelTTF(LEVEL_INFO.movesRemaining, 'Impact', 35*4);
            movesRemainingLB.setAnchorPoint(cc.p(0.5, 0.5));
            movesRemainingLB.setPosition(movesBcg.getPosition().x, movesBcg.getPosition().y - movesBcg.__height/2);
            movesRemainingLB.setScale(0.25);
            movesRemainingLB.setTag('movesRemainingLB');
            this.addChild(movesRemainingLB, 0);

            //setting number of scores received
            let scoresReceivedBcg = new cc.Sprite.create(res.scoresBcg);
            scoresReceivedBcg.setAnchorPoint(cc.p(0.5, 0.5));
            scoresReceivedBcg.setPosition(movesBcg.getPosition().x, movesBcg.getPosition().y - movesBcg.__height - 35);
            scoresReceivedBcg.__width = levelInfoBcg.__width * 0.8;
            scoresReceivedBcg.__height = 90;
            scoresReceivedBcg.setScaleX(scoresReceivedBcg.__width / scoresReceivedBcg.getBoundingBox().width);
            scoresReceivedBcg.setScaleY(scoresReceivedBcg.__height / scoresReceivedBcg.getBoundingBox().height);
            this.addChild(scoresReceivedBcg, 0);

            //setting number of scores received title
            let scoresReceivedTitle = new cc.LabelTTF('Очки:', 'Impact', 24*4);
            scoresReceivedTitle.setAnchorPoint(cc.p(0.5, 0));
            scoresReceivedTitle.setPosition(scoresReceivedBcg.getPosition());
            scoresReceivedTitle.setScale(0.25);
            this.addChild(scoresReceivedTitle, 0);

            //setting number of scores received label
            let scoresReceivedLB = new cc.LabelTTF('0', 'Impact', 24*4);
            scoresReceivedLB.setAnchorPoint(cc.p(0.5, 1));
            scoresReceivedLB.setPosition(scoresReceivedTitle.getPosition());
            scoresReceivedLB.setScale(0.25);
            scoresReceivedLB.setTag('scoresReceivedLB');
            this.addChild(scoresReceivedLB, 0);
        }
    });

    let UIBoostersSection = cc.Layer.extend({

        ctor: function() {

            this._super();
            this.draw();
            this.createListeners();
        },
        draw: function() {

            //screen size
            let size = cc.winSize;

            //setting bomb booster
            let bombBoosterBcg = new cc.Sprite.create(res.boosterBcg);
            bombBoosterBcg.setAnchorPoint(cc.p(0.5, 0.5));
            bombBoosterBcg.setPosition(cc.p(625, 120));
            bombBoosterBcg.__width = 120;
            bombBoosterBcg.__height = 120;
            bombBoosterBcg.setScaleX(bombBoosterBcg.__width / bombBoosterBcg.getBoundingBox().width);
            bombBoosterBcg.setScaleY(bombBoosterBcg.__height / bombBoosterBcg.getBoundingBox().height);
    
            //setting bomb booster attachment
            let boosterAttachment = new cc.LabelTTF('Бомба', 'Impact', 20*4);
            boosterAttachment.setAnchorPoint(cc.p(0.5, 0));
            boosterAttachment.setPosition(bombBoosterBcg.getPosition());
            boosterAttachment.setScale(0.25);
            
            //setting bomb booster price background
            let bombBoosterPriceBcg = new cc.Sprite.create(res.boosterPriceBcg);
            bombBoosterPriceBcg.setAnchorPoint(cc.p(0.5, 0.5));
            bombBoosterPriceBcg.__width = 90;
            bombBoosterPriceBcg.__height = 40;
            bombBoosterPriceBcg.setPosition(bombBoosterBcg.getPosition().x, bombBoosterBcg.getPosition().y - bombBoosterPriceBcg.__height/2);
            bombBoosterPriceBcg.setScaleX(bombBoosterPriceBcg.__width / bombBoosterPriceBcg.getBoundingBox().width);
            bombBoosterPriceBcg.setScaleY( bombBoosterPriceBcg.__height / bombBoosterPriceBcg.getBoundingBox().height);

            //setting bomb booster price label
            let bombBoosterPriceLB = new cc.LabelTTF('222', 'Impact', 24*4);
            bombBoosterPriceLB.setFontSize(100);
            bombBoosterPriceLB.setAnchorPoint(cc.p(0.5, 0.5));
            bombBoosterPriceLB.setPosition(bombBoosterPriceBcg.getPosition().x, bombBoosterPriceBcg.getPosition().y - 2.5);
            bombBoosterPriceLB.setScale(0.25);

            //setting bomb booster clickable
            let bombBoosterClickable = new cc.Sprite.create(res.boosterBcg);
            bombBoosterClickable.setAnchorPoint(cc.p(0.5, 0.5));
            bombBoosterClickable.setPosition(bombBoosterBcg.getPosition());
            bombBoosterClickable.setScaleX(bombBoosterBcg.__width / bombBoosterClickable.getBoundingBox().width);
            bombBoosterClickable.setScaleY(bombBoosterBcg.__height / bombBoosterClickable.getBoundingBox().height);
            bombBoosterClickable.setOpacity(0);
            bombBoosterClickable.setTag('bombBoosterClickable');

            this.addChild(bombBoosterBcg, 0);
            this.addChild(boosterAttachment, 0);
            this.addChild(bombBoosterPriceBcg, 0);
            this.addChild(bombBoosterPriceLB, 0);
            this.addChild(bombBoosterClickable, 0);
            //--------------------------
        },
        createListeners: function() {

            let self = this;
            let boosters = [this.getChildByTag("bombBoosterClickable")];
            let clickedBooster = null;

            //setting listener
            cc.eventManager.addListener({

                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches : true,
                onTouchBegan: onTouchBegan,
                onTouchEnded: onTouchEnded
            }, this);

            //getting clicked booster
            function onTouchBegan(touch, event) {

                let tap = touch.getLocation();
                
                for(var i = 0; i < boosters.length; i++) {
                  
                  var currBooster = boosters[i];
                  var boosterRect = currBooster.getBoundingBox();
                  
                  if(cc.rectContainsPoint(boosterRect, tap)) {
                    
                    clickedBooster = currBooster;
                    return true;
                  }
                }
                return false;
              }

            //handling logic
            function onTouchEnded(touch, event) {

                if (usingBoosterId == -1) {

                    if (userMoney >= BOOSTERS[boosters.indexOf(clickedBooster)].price) {

                        usingBoosterId = boosters.indexOf(clickedBooster);
                        clickedBooster.setOpacity(100);
                        userMoney -= BOOSTERS[boosters.indexOf(clickedBooster)].price
    
                        let headerUI = self.parent.children[1];
                        let userMoneyLB = headerUI.getChildByTag("userMoneyLB");
    
                        userMoneyLB.setString(userMoney);
                    } else {
    
                        alert('u dont have enough money')
                    }
                }
            }
        }
    });

    let UIGameField = cc.Layer.extend({

        ctor: function() {

            this._super();
            this.draw();
        },
        draw: function() {

            //screen size
            let size = cc.winSize;
            let padding = 15;

            //setting game field
            let gameFieldBcg = new cc.Sprite.create(res.gameFieldBcg);
            gameFieldBcg.setAnchorPoint(cc.p(0, 1));
            gameFieldBcg.setPosition(GAME_FIELD_POSITION.x-padding, GAME_FIELD_POSITION.y+padding);
            gameFieldBcg.__width = BLOCK_SIZE.width * LEVEL_INFO.width + padding*2;
            gameFieldBcg.__height = BLOCK_SIZE.height * LEVEL_INFO.height + padding*2;
            gameFieldBcg.setScaleX(gameFieldBcg.__width / gameFieldBcg.getBoundingBox().width);
            gameFieldBcg.setScaleY(gameFieldBcg.__height / gameFieldBcg.getBoundingBox().height);
    
            this.addChild(gameFieldBcg, 0);
        }
    });

    let blockSprite = cc.Sprite.extend({

        ctor: function(img, x, y, width, height) {

            this._super(img);
            this.__width = width;
            this.__height = height;
            this.setScaleX(width/this.getBoundingBox().width);
            this.setScaleY(height/this.getBoundingBox().height);
            this.setPosition(x, y);
        }
    });

    let gameLayer = cc.Layer.extend({

        ctor: function(levelInfo) {

            this._super(levelInfo);

            this._levelInfo = levelInfo;
            this._levelMap = [];

            this.userScore = 0;
            this.gameOver = false;

            this.createLevelMap();
            this.setLevelBlocks();
            this.createListeners();
            return true;
        },
        createBlock: function(x, y) {

            let colors = [

                [res.blueBlock, 'blue'],
                [res.purpleBlock, 'purple'],
                [res.redBlock, 'red'],
                [res.yellowBlock, 'yellow'],
                [res.greenBlock, 'green']
            ];
            
            let r = Math.floor(Math.random() * colors.length);
            let texture = colors[r][0];
            let block = new blockSprite(texture, x, y, BLOCK_SIZE.width, BLOCK_SIZE.height);
            block._color = colors[r][1];
            block._checked = false;
            block._toMove = false;
            block._toDelete = false;

            return block;
        },
        createLevelMap: function() {

            let info = this._levelInfo;

            for (let i = 0; i < info.height; i++) {

                for (let j = 0; j < info.width; j++) {
        
                    this._levelMap.push({

                        x: (GAME_FIELD_POSITION.x + (j * BLOCK_SIZE.width)) + BLOCK_SIZE.width/2,
                        y: (GAME_FIELD_POSITION.y - (i * BLOCK_SIZE.height)) - BLOCK_SIZE.height/2,
                        xIndex: j,
                        yIndex: i,
                        block: null
                    });
                }
            }
        },
        setLevelBlocks: function() {

            this._levelMap.forEach(e => {
                
                let block = this.createBlock(e.x, e.y);
                e.block = block;
                this.addChild(block);
            });
        },
        getTileByCords: function(x, y) {

            let tile = this._levelMap.filter(e => e.xIndex == x && e.yIndex == y)[0];

            return tile;
        },
        getTileByBlock: function(block) {

            let tile = this._levelMap.filter(e => e.block == block)[0];

            return tile;
        },
        createListeners: function() {

            let self = this;

            let clickedTile = null;

            //setting listener
            cc.eventManager.addListener({

                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches : true,
                onTouchBegan: onTouchBegan,
                onTouchEnded: onTouchEnded
            }, this);

            //getting clicked block
            function onTouchBegan(touch, event) {

                if (self.gameOver) return;

                //disable clicking while anim's playing
                let isRunningActionOnBlocks = self._levelMap.filter(e => e.block.getNumberOfRunningActions() > 0);

                if (isRunningActionOnBlocks.length > 0) return;
      
                let tap = touch.getLocation();
                
                for(var i = 0; i < self._levelMap.length; i++) {
                  
                  var currBlock =  self._levelMap[i].block;
                  var blockRect = currBlock.getBoundingBox();
                  
                  if(cc.rectContainsPoint(blockRect, tap)) {
                    
                    clickedTile = self.getTileByBlock(currBlock);
                    return true;
                  }
                }
                return false;
              }

            //handling logic
            function onTouchEnded(touch, event) {

                if (!clickedTile) return;

                self.handleMove(clickedTile);
            }
        },
        markSimilarBlocks: function(x, y, color) {

            let tile = this.getTileByCords(x, y);

            if (!tile || !tile.block) return;

            let block = tile.block;

            if (block._checked || block._color != color) {

                return;
            }

            block._checked = true;

            this.markSimilarBlocks(x-1, y, color);
            this.markSimilarBlocks(x+1, y, color);
            this.markSimilarBlocks(x, y-1, color);
            this.markSimilarBlocks(x, y+1, color);
        },
        moveBlocksDown: function() {

            let self = this;

            //getting empty tiles
            let holes = self._levelMap.filter(e => e.block == null);

            //check if it doent need to move blocks down
            if (holes.length < 1) return;

            for (let i = self._levelMap.length-1; i > 0; i--) {

                let tile = self._levelMap[i];

                if (!tile.block) {

                    //getting upper hole block
                    let upperTile = self.getTileByCords(tile.xIndex, tile.yIndex-1);

                    //checking if upper block even exists
                    if (upperTile && upperTile.block) {

                        //moving upper block down
                        tile.block = upperTile.block;
                        upperTile.block = null;
                        //tag blocks to play anim
                        tile.block._toMove = true;
                    }
                }
            }
        },
        spawnNewBlocks: function() {

            let self = this;

            //getting top row
            let topRowTiles = self._levelMap.filter(e => e.yIndex == 0 && !e.block);

            //checking if there are no empty tiles
            if (topRowTiles.length < 1) return;

            //spawn new blocks
            topRowTiles.forEach(e => {

                e.block = self.createBlock(e.x, e.y+BLOCK_SIZE.height);
                e.block._toMove = true;
                self.addChild(e.block);
            });

            self.moveBlocksDown();
            self.spawnNewBlocks();
        },
        isPossibleToMakeAMove: function() {

            let self = this;

            for (let i = 0; i < self._levelInfo.width; i++) {

                for (let j = 0; j < self._levelInfo.height; j++) {

                    let tile = self.getTileByCords(j, i);

                    self.markSimilarBlocks(j, i, tile.block._color);

                    let checkedMoves = self._levelMap.filter(e => e.block._checked == true);

                    if (checkedMoves.length >= self._levelInfo.minBlastableLength) {

                        checkedMoves.forEach(e => { e.block._checked = false; });
                        return true;
                    } else {
            
                        checkedMoves.forEach(e => { e.block._checked = false; });
                    }
                }
            }

            return false;
        },
        shuffleBlocks: function() {

            let self = this;

            //shuffle array
            let newCords = self._levelMap.map(e => {
        
                return e.block;
            }).sort(() => 0.5 - Math.random());
        
            for (let i = 0; i < self._levelMap.length; i++) {
        
                self._levelMap[i].block = newCords[i];
                self._levelMap[i].block.stopAllActions();
                self._levelMap[i].block._toMove = true;
            }
        
            if (!self.isPossibleToMakeAMove()) {
        
                self.shuffleBlocks();
            }
        },
        bombArea: function(clickedTile) {

            let self = this;

            let radius = BOOSTERS[0].radius - 1;

            let tile = clickedTile;

            let toBomb = self._levelMap.filter(
                e => e.xIndex > tile.xIndex - radius &&
                e.xIndex < tile.xIndex + radius &&
                e.yIndex > tile.yIndex - radius &&
                e.yIndex < tile.yIndex + radius);

            //deleting blocks
            toBomb.forEach(e => {

                e.block._checked = true;
            });

            let booster = self.parent.children[3].getChildByTag(BOOSTERS[usingBoosterId].name + 'Clickable');

            booster.setOpacity(0);
            usingBoosterId = -1;
        },
        victoryHandle: function() {

            this.gameOver = true;
            console.log('u win');
            alert('u win');
            ///////WIN HANDLE
        },
        loseHandle: function() {

            this.gameOver = true;
            console.log('u lose');
            alert('u lose');
            ///////LOSE HANDLE
        },
        handleMove: function(clickedTile) {

            let self = this;
            let levelInfoUI = self.parent.children[2];
            let HeaderUI = self.parent.children[1];
            let movesRemainingLB = levelInfoUI.getChildByTag("movesRemainingLB");
            let scoresReceivedLB = levelInfoUI.getChildByTag("scoresReceivedLB");
            let emptyBar = HeaderUI.getChildByTag("emptyBar");
            let barElement = HeaderUI.getChildByTag("barElement");
            let similarBlockTiles = null;

            //sets blocks to delete with anim
            function setBlocksToDelete() {

                //deleting blocks
                self._levelMap.forEach(e => {

                    if (e.block._checked) {

                        e.block._checked = false;
                        e.block._toDelete = true;
                    }
                });
            }

            //runs move anims
            function moveAnimRunner(time) {

                //geting to be animated blocks
                let toAnimBlockTiles = self._levelMap.filter(e => e.block._toMove);
                
                //creating move anim
                toAnimBlockTiles.forEach(e => {

                    e.block.runAction(new cc.MoveTo(time, cc.p(e.x, e.y)));
                    e.block._toMove = false;
                });
            }

            //deletes block from the scene
            function deleteChildren() {

                let toAnimBlockTiles = self._levelMap.filter(e => e.block._toDelete);

                toAnimBlockTiles.forEach(e => {

                    self.removeChild(e.block);
                });
            }

            //adds scores
            function addScore() {

                //creating anim
                let scaleAnim = new cc.ScaleBy(0.1, 2);
                let scaleDownAnim = new cc.ScaleBy(0.1, 0.5);

                scoresReceivedLB.setString(self.userScore);

                let sequence = cc.Sequence.create(
                    
                    scaleAnim.clone(),
                    scaleDownAnim.clone()
                );

                scoresReceivedLB.runAction(sequence.clone());
            }

            //moves progress bar
            function moveProgressBar() {
                
                let newWidth = (self.userScore / self._levelInfo.scoresToGet);

                if (newWidth > 1) {

                    newWidth = 1;
                }
                barElement.__width = newWidth

                barElement.setScaleX(newWidth*(81.5 / emptyBar.getBoundingBox().width));
            }

            //checking game result
            function checkGameResult() {

                if (self.userScore >=  self._levelInfo.scoresToGet) {

                    self.victoryHandle();
                } else if (self._levelInfo.movesRemaining <= 0) {

                    self.loseHandle();
                }
            }

            //runs deleting anims
            function deleteBlocksForScore() {

                let multipier = self._levelInfo.multipier;

                self.userScore += multipier*similarBlockTiles.length;

                //geting to be animated blocks
                let toAnimBlockTiles = self._levelMap.filter(e => e.block._toDelete);

                //creating deleting anim
                let scaleAnim = new cc.ScaleBy(0.1, 1.5);
                let scaleDownAnim = new cc.ScaleBy(0.1, 0.1);
                let moveToScore = new cc.MoveTo(0.5, movesRemainingLB.x, movesRemainingLB.y);
                let fade = new cc.FadeTo(0.2, 0);

                let sequence = cc.Sequence.create(
                    
                    scaleAnim.clone(),
                    moveToScore.clone(),
                    scaleDownAnim.clone(),
                    fade.clone(),
                    cc.callFunc(() => deleteChildren()),
                    cc.callFunc(() => addScore()),
                    cc.callFunc(() => moveProgressBar())
                );

                toAnimBlockTiles.forEach(e => {

                    e.block._localZOrder = 10;
                    e.block.runAction(sequence.clone());
                    e.block._toDelete = false;
                    e.block = null;
                });
                
                checkGameResult();
            }

            switch (usingBoosterId) {

                case -1:

                    self.markSimilarBlocks(clickedTile.xIndex, clickedTile.yIndex, clickedTile.block._color);

                    //getting array of similar blocks
                    similarBlockTiles = self._levelMap.filter(e => e.block._checked == true);

                    //checking if less than 3 blocks are selected
                    if (similarBlockTiles.length < self._levelInfo.minBlastableLength) {

                        //cancel marking
                        self._levelMap.forEach(e => e.block._checked = false);
                        return;
                    };

                    setBlocksToDelete();
                    break;

                case 0:

                    self.bombArea(clickedTile);
                    similarBlockTiles = self._levelMap.filter(e => e.block._checked);

                    setBlocksToDelete();
                    break;

            };

            //run deleting anim
            deleteBlocksForScore();

            console.log(similarBlockTiles.length);
            //clear similar block tiles array
            similarBlockTiles = [];

            //move blocks 1 row down
            self.moveBlocksDown();

            //spawning new blocks
            self.spawnNewBlocks();

            //applying anim
            moveAnimRunner(0.2);

            //sub move
            self._levelInfo.movesRemaining--;
            if (self._levelInfo.movesRemaining <= 0) {

                self._levelInfo.movesRemaining = 0;
            }
            movesRemainingLB.setString(self._levelInfo.movesRemaining);

            if (!self.isPossibleToMakeAMove()) {

                if (self._levelInfo.shufflesAvailable > 0) {

                    console.log('ran out of moves');
                    self.shuffleBlocks();
                    //applying anim
                    moveAnimRunner(0.5);
                    self._levelInfo.shufflesAvailable--;
                } else {

                    self.loseHandle();
                }                
            }
        }
    });
    
    let GameScene = cc.Scene.extend({
    
        onEnter:function () {
            this._super();
    
            //ui rendering
            this.addChild(new BackgroundLayer(), 0);
            this.addChild(new UIHeader(), 1);
            this.addChild(new UILevelInfo(), 2);
            this.addChild(new UIBoostersSection(), 3);
            this.addChild(new UIGameField(), 4);

            this.addChild(new gameLayer(LEVEL_INFO), 5);
        }
    });
};

cc.game.run();