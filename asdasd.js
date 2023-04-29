
cc.game.onStart = function () {

    cc.LoaderScene.preload([g_resources], function() {

        cc.director.runScene(new GameScene());
    }, this)
};

let BackgroundLayer = cc.Layer.extend({

    ctor: function() {

        this._super();
        
        //screen size
        let size = cc.winSize;
        cocos
        //setting background img
        console.log(res.bcg);
        let background_UI = new cc.Sprite.create(res.bcg);
        background_UI.setAnchorPoint(cc.p(0.5, 0.5));
        background_UI.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(background_UI, 0);
    }
});

let UILayer = cc.Layer.extend({

    ctor: function() {

        this._super();
        this.drawUI();
    },
    drawUI: function() {

        //screen size
        let size = cc.winSize;
        
        
    }
});

let GameScene = cc.Scene.extend({

    onEnter:function () {
        this._super();

        this.addChild(new BackgroundLayer(), 0);
    }
});

cc.game.run("gameCanvas");