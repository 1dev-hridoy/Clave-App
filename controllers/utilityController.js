const utilityController = {
    getStatus: (req, res) => {



        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime()
        });
    }
};

module.exports = utilityController;
