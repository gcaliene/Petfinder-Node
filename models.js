const uuid = require ('uuid');
const mongoose = require ('mongoose');

const petPostSchema = mongoose.Schema({ 
	text: {type:String, required: true},
	userName: {type:String, required: true},
	created: {type: Date}
});

petPostSchema.virtual('name').get(function() {
	return `${this.userName}`.trim();
});

petPostSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		text: this.text,
		name: this.userName,
		created: this.created
	};
}

const PetPost = mongoose.model('PetPost', petPostSchema);

module.exports = {PetPost};