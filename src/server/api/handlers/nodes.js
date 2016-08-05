/**
 * Created by david on 8/5/16.
 */
let nodeService;
function NodeHandler(nodes) {
    nodeService = nodes;
}

NodeHandler.prototype.list = (req, res, next) => {
    var skip = 0;
    var limit = 10;
    let queryData = {};
    if (req.query.skip !== undefined){
        skip = parseInt(req.query.skip);
    }
    if (req.query.limit !== undefined){
        limit = parseInt(req.query.limit);
    }
    if (req.query.isActive !== undefined){
        queryData.state = req.query.isActive;
    }
    if (req.query.isNomad !== undefined){
        queryData.nomad.installed = req.query.isNomad;
    }
    if (req.query.isConsul !== undefined) {
        queryData.consul.installed = req.query.isConsul;
    }
    return nodeService.find(queryData)
        .then(function(nodes){
            nodes = nodes.slice(skip, skip + limit);
            res.status(200).send({
                'nodes': nodes
            });
        })
        .catch(function(err){
            res.status(500).send({
                'message': err.message
            })
        });
};


NodeHandler.prototype.instance = (req, res, next) => {
    nodeService.findById(req.params.nodeId)
        .then(function(node){
            if (node == undefined){
                res.status(404).send({
                    error: 'There is no node with that id '
                });
                return;
            }
            res.status(200).send(node);
        })
        .catch(function(err){
            res.status(500).send({
                message: err.message
            })
        })
};

module.exports = NodeHandler;