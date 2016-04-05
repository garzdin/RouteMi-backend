var kittySchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Kitten', kittySchema);
