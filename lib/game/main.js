ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		ig.input.bind( ig.KEY.UP_ARROW, 'jump' );

		ig.Game.spawnEntity('PlayerEntity', 0, 0);
	},
	
	update: function() {
		this.parent();
	},
	
	draw: function() {
		this.parent();
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
