module.exports = function (req, res) {
    res.json({
        success: true, 
        data: {
            serverActive: true
        }
    });
};
