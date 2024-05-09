ig.module( 
	'game.entities.player' 
).requires(
	'impact.entity'
).defines(function() {
    PlayerEntity = ig.Entity.extend({

        size: {x: 49, y: 73},
        animSheet: new ig.AnimationSheet('media/char/idle.png', 49, 73),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },

        update: function() {
            if( ig.input.pressed('jump') ) {
                this.vel.y = -100;
            }

            this.parent(); 
        }
    })
})